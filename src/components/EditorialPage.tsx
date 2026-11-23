import Link from "next/link";
import type { ReactNode } from "react";

export type EditorialLink = { href: string; label: string; description?: string };

export default function EditorialPage({ title, description, parent, children }: {
  title: string;
  description: string;
  parent?: EditorialLink;
  children: ReactNode;
}) {
  return (
    <main className="site-shell editorial-main">
      <header className="intro editorial-intro">
        {parent && <Link className="parent-link" href={parent.href}>{parent.label}</Link>}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </main>
  );
}

export function EditorialLinks({ title, links }: { title: string; links: EditorialLink[] }) {
  return (
    <section className="editorial-related">
      <h2>{title}</h2>
      <ul>
        {links.map(({ href, label }) => <li key={href}><Link href={href}>{label}</Link></li>)}
      </ul>
    </section>
  );
}

export function EditorialIndex({ links }: { links: EditorialLink[] }) {
  return (
    <ul className="editorial-index">
      {links.map(({ href, label, description }) => <li key={href}>
        <Link className="panel editorial-index-card" href={href}>
          <h2>{label}</h2>
          <p>{description}</p>
        </Link>
      </li>)}
    </ul>
  );
}
