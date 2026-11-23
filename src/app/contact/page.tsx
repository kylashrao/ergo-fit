import Link from "next/link";
import TrustPage, { ContactDetails } from "@/components/TrustPage";
import { siteOperator } from "@/lib/siteConfig";
import { pageMetadata, siteOrigin } from "@/lib/siteSeo";

const title = "Contact";
const description = "Contact the operator of ergo-fit about calculator results, product data, privacy, or accessibility.";

export const metadata = pageMetadata(title, description, "/contact");

export default function Contact() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>Contact details</h2>
        <dl className="contact-details">
          <div><dt>Operator</dt><dd>{siteOperator}</dd></div>
          <div><dt>Website</dt><dd><Link href="/">{siteOrigin}</Link></dd></div>
          <div><dt>Email</dt><dd><ContactDetails /></dd></div>
        </dl>
      </section>
      <section>
        <h2>What to include</h2>
        <p>For a catalog correction, include the model, configuration, and a link to the manufacturer’s spec. For a calculator or accessibility issue, include the page URL, your browser, and what happened. Please omit health and other sensitive details.</p>
        <p>For information about privacy requests, see the <Link href="/privacy-policy">privacy policy</Link>.</p>
      </section>
    </TrustPage>
  );
}
