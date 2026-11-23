import EditorialPage, { EditorialLinks } from "@/components/EditorialPage";
import ErgoCalculator from "@/components/ErgoCalculator";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Sitting & Standing Desk Height Calculator";
const description = "Estimate both keyboard heights from your stature, then check the desktop footprint, monitor depth, and chair clearance.";

export const metadata = pageMetadata(title, description, "/desk-height-calculator");

export default function DeskHeightCalculator() {
  return (
    <EditorialPage title={title} description={description}>
      <ErgoCalculator focus="desk" />
      <EditorialLinks title="Measure before ordering" links={[
        { href: "/guides/standing-vs-sitting-desk-height", label: "How to set sitting and standing desk height" },
        { href: "/guides/standing-desk-widths-depths", label: "Compare 42-, 48-, and 60-inch desks" },
        { href: "/space", label: "Browse room layouts" },
      ]} />
    </EditorialPage>
  );
}
