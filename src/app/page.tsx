import AdSlot from "@/components/AdSlot";
import ErgoCalculator from "@/components/ErgoCalculator";
import { previewAdSlot } from "@/lib/siteConfig";
import { pageMetadata } from "@/lib/siteSeo";

export const metadata = pageMetadata(
  "Ergonomic Fit Calculator",
  "Find desk, chair, and monitor settings based on your height and available space.",
  "/",
);

export default function Home() {
  return (
    <main className="site-shell" id="calculator">
      <section className="intro" aria-labelledby="page-title">
        <h1 id="page-title">Ergonomic Fit <span>Calculator</span></h1>
        <p>Find your desk, chair, and monitor settings based on your height and available space.</p>
      </section>
      <ErgoCalculator />
      <AdSlot enabled={previewAdSlot} />
    </main>
  );
}
