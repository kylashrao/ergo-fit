import EditorialPage, { EditorialLinks } from "@/components/EditorialPage";
import ErgoCalculator from "@/components/ErgoCalculator";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Ergonomic Chair Fit Finder";
const description = "Estimate seat height and depth, check whether you need a low cylinder or footrest, and compare chair adjustment ranges.";

export const metadata = pageMetadata(title, description, "/chair-fit-finder");

export default function ChairFitFinder() {
  return (
    <EditorialPage title={title} description={description}>
      <ErgoCalculator focus="chair" />
      <EditorialLinks title="Check your chair fit" links={[
        { href: "/guides/ergonomic-chair-buying-checklist", label: "Ergonomic chair buying checklist" },
        { href: "/guides/aeron-size-a-b-c-fit-guide", label: "Herman Miller Aeron sizing guide" },
        { href: "/height", label: "Browse height profiles" },
      ]} />
    </EditorialPage>
  );
}
