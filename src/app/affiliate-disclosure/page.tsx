import Link from "next/link";
import TrustPage, { ContactPageLink } from "@/components/TrustPage";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Affiliate Disclosure";
const description = "We may earn a commission when you buy through an affiliate link on ergo-fit.";

export const metadata = pageMetadata(title, description, "/affiliate-disclosure");

export default function AffiliateDisclosure() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>How affiliate links work</h2>
        <p>We may use affiliate links to furniture and workspace gear retailers and manufacturers. These links may appear for products such as chairs, standing desks, monitor arms, and footrests. A merchant or affiliate network may use a referral code, cookie, or similar technology to credit a qualifying purchase to ergo-fit. Purchases, prices, returns, and warranties are handled by the seller.</p>
        <p>We disclose potential commissions near paid links and gear recommendations. Some links lead directly to a manufacturer’s specifications for reference. A product’s inclusion in the catalog does not by itself indicate a paid relationship.</p>
      </section>
      <section>
        <h2>How we choose and rank gear</h2>
        <p>Our matcher compares your inputs with published adjustment ranges and dimensions. Affiliate availability and commission amounts are excluded from the score. Read the fit explanation and verify the exact product configuration with the manufacturer before ordering.</p>
        <p>For more about how we work, see our <Link href="/about">methodology</Link>. For disclosure questions or corrections, use the <ContactPageLink />.</p>
      </section>
    </TrustPage>
  );
}
