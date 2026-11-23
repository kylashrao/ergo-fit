import { notFound } from "next/navigation";
import EditorialPage, { EditorialLinks } from "@/components/EditorialPage";
import GearMatchList from "@/components/GearMatchList";
import ProfileSetup from "@/components/ProfileSetup";
import { heights, type SlugPageProps } from "@/lib/editorial";
import { calculateErgoFit } from "@/lib/ergoMath";
import { pageMetadata } from "@/lib/siteSeo";

type HeightProfile = (typeof heights)[number];

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return heights.map(({ slug }) => ({ slug }));
}

async function getProfile(params: SlugPageProps["params"]) {
  const { slug } = await params;
  const profile = heights.find((entry) => entry.slug === slug);
  if (!profile) notFound();
  return profile;
}

function titleFor(profile: HeightProfile) {
  return `Desk and Chair Fit for ${profile.imperialLabel} (${profile.metricLabel})`;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const profile = await getProfile(params);
  return pageMetadata(titleFor(profile), profile.deskHighlight, `/height/${profile.slug}`);
}

export default async function HeightPage({ params }: SlugPageProps) {
  const profile = await getProfile(params);
  const fit = calculateErgoFit({
    heightInches: profile.heightInches,
    wearsShoes: true,
    dualMonitor: false,
  });

  return (
    <EditorialPage title={titleFor(profile)} description={profile.postureNote} parent={{ href: "/height", label: "All height profiles" }}>
      <ProfileSetup fit={fit} />
      <div className="editorial-notes">
        <section className="panel">
          <h2>Desk sizing</h2>
          <p>{profile.deskHighlight}</p>
          {fit.footrestHeightForStandardDesk.inches > 0 && <p>At a 29.5 in fixed desk, the estimated footrest lift is {fit.footrestHeightForStandardDesk.inches} in ({fit.footrestHeightForStandardDesk.cm} cm), if you raise the chair to meet the work surface.</p>}
        </section>
        <section className="panel">
          <h2>Chair sizing</h2>
          <p>{profile.chairHighlight}</p>
          {fit.needsLowCylinder && <p>Look for a low cylinder that reaches the estimated {fit.seatHeight.inches} in seat height ({fit.seatHeight.cm} cm).</p>}
        </section>
      </div>
      <GearMatchList fit={fit} units="imperial" />
      <EditorialLinks title="Refine this setup" links={[
        { href: "/desk-height-calculator", label: "Calculate desk height and footprint" },
        { href: "/chair-fit-finder", label: "Check chair and footrest fit" },
        { href: "/guides/standing-vs-sitting-desk-height", label: "Measure your seated and standing keyboard heights" },
        { href: "/space", label: "Browse small-space layouts" },
      ]} />
    </EditorialPage>
  );
}
