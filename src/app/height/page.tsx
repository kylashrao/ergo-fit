import EditorialPage, { EditorialIndex } from "@/components/EditorialPage";
import { heights } from "@/lib/editorial";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Ergonomic Setup by Height";
const description = "Browse desk, chair, and monitor starting dimensions for 20 height profiles from 4′10″ to 6′7″.";

export const metadata = pageMetadata(title, description, "/height");

export default function HeightIndex() {
  return (
    <EditorialPage title={title} description={description}>
      <EditorialIndex links={heights.map((profile) => ({
        href: `/height/${profile.slug}`,
        label: `${profile.imperialLabel} · ${profile.metricLabel}`,
        description: profile.deskHighlight,
      }))} />
    </EditorialPage>
  );
}
