import EditorialPage, { EditorialIndex } from "@/components/EditorialPage";
import { guides } from "@/lib/editorial";
import { pageMetadata } from "@/lib/siteSeo";

const title = "Workstation Fit & Buying Guides";
const description = "Learn how to measure desk and chair fit, place your monitors, and choose furniture for your room.";

export const metadata = pageMetadata(title, description, "/guides");

export default function GuideIndex() {
  return (
    <EditorialPage title={title} description={description}>
      <EditorialIndex links={guides.map(({ slug, title, description }) => ({
        href: `/guides/${slug}`, label: title, description,
      }))} />
    </EditorialPage>
  );
}
