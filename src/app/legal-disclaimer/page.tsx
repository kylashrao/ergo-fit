import Link from "next/link";
import TrustPage from "@/components/TrustPage";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Ergonomic and Sizing Disclaimer";
const description = "Anthropometric calculations, layout examples, and gear matches are informational estimates for workstation planning.";

export const metadata = pageMetadata(title, description, "/legal-disclaimer");

export default function LegalDisclaimer() {
  return (
    <TrustPage title={title} description={description}>
      <section>
        <h2>Educational guidance</h2>
        <p>The calculators, blueprints, profiles, guides, and gear matches are for educational use. They do not provide medical, physical-therapy, architectural, or engineering advice. For symptoms, injury, disability, or individualized accommodations, consult an appropriate qualified professional.</p>
      </section>
      <section>
        <h2>Personal fit and equipment</h2>
        <p>Height-based calculations approximate body dimensions. Leg, torso, and arm proportions vary, so verify the settings using your own measurements, equipment, and working posture. Check product variants, installation instructions, mounting hardware, and weight limits before use.</p>
      </section>
      <section>
        <h2>Room planning and standards</h2>
        <p>Chair clearance is a planning allowance. Confirm door swings, walkways, accessibility, structural support, and applicable building or safety requirements independently. The site does not certify furniture, a layout, or a workstation against any standard or code.</p>
        <p>See our <Link href="/about">methodology</Link> for how estimates are calculated.</p>
      </section>
    </TrustPage>
  );
}
