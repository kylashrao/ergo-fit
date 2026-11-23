import Link from "next/link";
import TrustPage, { ContactPageLink } from "@/components/TrustPage";
import { siteOperator } from "@/lib/siteConfig";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Terms of Use";
const description = "Terms for using the ergo-fit calculators, guides, layout examples, and catalog.";

export const metadata = pageMetadata(title, description, "/terms");

export default function Terms() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>Using ergo-fit</h2>
        <p>{siteOperator} provides the site for general workstation planning and product comparison. Use it lawfully and avoid activity that disrupts availability or interferes with other people’s use.</p>
      </section>
      <section>
        <h2>Measurements, products, and purchases</h2>
        <p>Verify your measurements and the specifications for the exact product configuration before buying, assembling, or installing furniture or equipment. Product information may change. The <Link href="/legal-disclaimer">sizing disclaimer</Link> explains the limits of our estimates.</p>
        <p>Sellers set their own prices, availability, shipping, return policies, and warranties. Transactions take place with the seller under its terms. Read our <Link href="/affiliate-disclosure">affiliate disclosure</Link> for more about commission links.</p>
      </section>
      <section>
        <h2>Availability and responsibility</h2>
        <p>To the extent permitted by applicable law, the site is provided as available without implied warranties of accuracy, availability, or fitness for a particular purpose. Your rights under applicable consumer law still apply. Use the <ContactPageLink /> to report an error or ask about these terms.</p>
      </section>
    </TrustPage>
  );
}
