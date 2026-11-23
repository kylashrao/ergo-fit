import type { Metadata } from "next";

export const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ergo-fit.example").origin;

export function siteUrl(path: string) {
  return new URL(path, siteOrigin).href;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: siteUrl(path) },
    openGraph: { title, description, url: siteUrl(path), siteName: "ergo-fit", type: "website" },
  };
}
