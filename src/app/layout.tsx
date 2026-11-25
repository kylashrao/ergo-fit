import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { trustPages } from "@/lib/editorial";
import { adsenseClient } from "@/lib/siteConfig";
import { siteOrigin } from "@/lib/siteSeo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Ergonomic Fit Calculator | ergo-fit", template: "%s | ergo-fit" },
  other: adsenseClient ? { "google-adsense-account": adsenseClient } : undefined,
  description: "Calculate desk, chair, and monitor heights, plan your room layout, and compare gear by physical dimensions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="impact-site-verification" content="2b1e3dba-2d8c-43ab-a85d-dd36ed25660a" />
        <meta name="p:domain_verify" content="d53754ec0676d559f5613d78e85a771a" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2824959172169836"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="site-shell">
            <div className="footer-identity"><Link href="/">ergo-fit</Link><span>Educational workstation sizing guidance.</span></div>
            <nav aria-label="Trust and legal">
              <ul className="footer-links">
                {trustPages.map(({ href, label }) => <li key={href}><Link href={href}>{label}</Link></li>)}
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
