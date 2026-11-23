import Link from "next/link";
import type { ReactNode } from "react";
import EditorialPage from "./EditorialPage";
import { siteContactEmail } from "@/lib/siteConfig";

export default function TrustPage({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <EditorialPage title={title} description={description}>
      <div className="panel editorial-article trust-content">{children}</div>
    </EditorialPage>
  );
}

export function ContactDetails() {
  return siteContactEmail
    ? <a href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a>
    : <>A public email address is pending.</>;
}

export function ContactPageLink() {
  return <Link href="/contact">contact page</Link>;
}
