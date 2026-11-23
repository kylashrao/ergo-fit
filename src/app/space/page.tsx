import EditorialPage, { EditorialIndex } from "@/components/EditorialPage";
import { spaces } from "@/lib/editorial";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Small-Space Home Office Layouts";
const description = "Compare 15 desk layouts and see how much room each leaves for the chair, displays, and daily movement.";

export const metadata = pageMetadata(title, description, "/space");

export default function SpaceIndex() {
  return (
    <EditorialPage title={title} description={description}>
      <EditorialIndex links={spaces.map((profile) => ({
        href: `/space/${profile.slug}`,
        label: profile.title,
        description: `${profile.deskWidthInches} × ${profile.deskDepthInches} in desktop. ${profile.tradeoff}`,
      }))} />
    </EditorialPage>
  );
}
