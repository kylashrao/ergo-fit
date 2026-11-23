export const siteOperator = process.env.SITE_OPERATOR?.trim() || "ergo-fit";

const configuredEmail = process.env.SITE_CONTACT_EMAIL?.trim() ?? "";
export const siteContactEmail = /^[^\s@:?&#%<>]+@[^\s@:?&#%<>]+\.[^\s@:?&#%<>]+$/.test(configuredEmail)
  ? configuredEmail
  : null;

const configuredPublisher = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
export const adsenseClient = /^ca-pub-(?!0{16}$)\d{16}$/.test(configuredPublisher)
  ? configuredPublisher
  : null;

export const previewAdSlot = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && adsenseClient !== null;
