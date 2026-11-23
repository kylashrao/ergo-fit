import Link from "next/link";
import { sections } from "@/lib/editorial";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" aria-label="ergo-fit home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 10.5h15m-13 0v8m11-8v8M9 5.5h6v5H9z" />
            </svg>
          </span>
          ergo<span>fit</span>
        </Link>
        <nav aria-label="Main navigation">
          {sections.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
