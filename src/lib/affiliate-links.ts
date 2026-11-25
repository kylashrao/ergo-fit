import programs from "../../data/affiliate-links.json" with { type: "json" };

export const programStatuses = ["pending_application", "pending_approval", "approved", "restricted_check"] as const;
type ProgramStatus = (typeof programStatuses)[number];

interface ProductLink {
  trackingUrl: string | null;
  fallbackUrl: string;
  utmParams: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign", string>>;
}

interface AffiliateProgram {
  merchant: string;
  status: string;
  tags: string[];
  disclosureText: string;
  products: Record<string, ProductLink>;
}

export type GearDestination =
  | { kind: "affiliate"; href: string; merchant: string; disclosureText: string }
  | { kind: "reference"; href: string };

export function safeHttpsUrl(value: string | null | undefined): URL | undefined {
  if (typeof value !== "string" || !/^https:\/\//i.test(value) || /[\s\\<>{}]/.test(value)) return;
  let url: URL;
  let decoded: string;
  try {
    url = new URL(value);
    decoded = decodeURIComponent(value);
  } catch {
    return;
  }
  if (url.protocol !== "https:" || url.username || url.password) return;
  const host = url.hostname.replace(/\.$/, "");
  if (!host.includes(".") ||
      /(^|\.)(example\.(com|net|org)|example|invalid|test|localhost|local)$/.test(host)) return;
  if (/placeholder|replace[_-]?me|your[_-]?(?:affiliate|tracking|partner|property|publisher|tag|id)/i.test(decoded)) return;
  return url;
}

export function resolveProductLink(
  program?: Omit<AffiliateProgram, "products" | "tags" | "status"> & { status: ProgramStatus },
  product?: ProductLink,
  catalogSource?: string,
): GearDestination | undefined {
  if (program?.status === "approved" && program.merchant.trim() && program.disclosureText.trim()) {
    const tracking = safeHttpsUrl(product?.trackingUrl);
    if (tracking && product?.trackingUrl) {
      let href = product.trackingUrl;
      // Leave the partner URL intact unless explicitly configured to add missing UTM parameters.
      const additions = new URLSearchParams();
      for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
        const value = product.utmParams[key];
        if (value?.trim() && !tracking.searchParams.has(key)) additions.set(key, value.trim());
      }
      if (additions.size) {
        const hashStart = href.indexOf("#");
        const base = hashStart === -1 ? href : href.slice(0, hashStart);
        const fragment = hashStart === -1 ? "" : href.slice(hashStart);
        const separator = base.endsWith("?") || base.endsWith("&") ? "" : base.includes("?") ? "&" : "?";
        href = `${base}${separator}${additions}${fragment}`;
      }
      return { kind: "affiliate", href, merchant: program.merchant, disclosureText: program.disclosureText };
    }
  }

  const reference = safeHttpsUrl(product?.fallbackUrl) ?? safeHttpsUrl(catalogSource);
  return reference && { kind: "reference", href: reference.href };
}

const directory: Record<string, AffiliateProgram> = programs satisfies Record<string, AffiliateProgram>;

export function getGearDestination(key: string, catalogSource?: string): GearDestination | undefined {
  const matches = Object.values(directory).filter(({ products }) => Object.hasOwn(products, key));
  const program = matches.length === 1 ? matches[0] : undefined;
  const status = programStatuses.find((status) => status === program?.status);
  return resolveProductLink(program && status ? { ...program, status } : undefined, program?.products[key], catalogSource);
}
