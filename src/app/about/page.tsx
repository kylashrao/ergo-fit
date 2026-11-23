import Link from "next/link";
import TrustPage, { ContactPageLink } from "@/components/TrustPage";
import { siteOperator } from "@/lib/siteConfig";
import { pageMetadata, siteOrigin } from "@/lib/siteSeo";

const title = "About ergo-fit";
const description = "Who operates ergo-fit and how we calculate workstation dimensions and match furniture.";

export const metadata = pageMetadata(title, description, "/about");

export default function About() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>Site operator</h2>
        <p>{siteOperator} operates ergo-fit at <Link href="/">{new URL(siteOrigin).hostname}</Link>. The site helps you estimate desk, chair, and monitor settings and compare equipment before buying.</p>
      </section>
      <section>
        <h2>How the estimates work</h2>
        <p>The calculator uses height-based proportions to estimate seated and standing working heights, seat dimensions, and monitor position. Footwear adds an allowance to floor-based heights. The room planner subtracts a 32-inch rear chair zone before comparing desktop footprints.</p>
        <p>These project estimates draw on workstation adjustment principles, including <a href="https://store.accuristech.com/bifma/products/preview/1854112">BIFMA G1-2013</a>. Our <Link href="/guides/ansi-bifma-g1-workstation-guidelines">guide to BIFMA ergonomics</Link> explains the guideline and the newer standard. See the <Link href="/legal-disclaimer">sizing disclaimer</Link> for the limits of the estimates.</p>
      </section>
      <section>
        <h2>Catalog and corrections</h2>
        <p>We compare published product dimensions and adjustment ranges against calculator targets. Product cards link to specifications or disclose affiliate links, and commission does not affect the matching score. To report a specification or methodology error, use the <ContactPageLink />.</p>
      </section>
    </TrustPage>
  );
}
