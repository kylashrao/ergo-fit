import { notFound } from "next/navigation";
import EditorialPage, { EditorialLinks } from "@/components/EditorialPage";
import GearMatchList from "@/components/GearMatchList";
import ProfileSetup from "@/components/ProfileSetup";
import { spaces, type SlugPageProps } from "@/lib/editorial";
import { calculateErgoFit } from "@/lib/ergoMath";
import { formatFootprint } from "@/lib/setupDisplay";
import { pageMetadata } from "@/lib/siteSeo";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return spaces.map(({ slug }) => ({ slug }));
}

async function getProfile(params: SlugPageProps["params"]) {
  const { slug } = await params;
  const profile = spaces.find((entry) => entry.slug === slug);
  if (!profile) notFound();
  return profile;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const profile = await getProfile(params);
  return pageMetadata(profile.title, profile.tradeoff, `/space/${profile.slug}`);
}

export default async function SpacePage({ params }: SlugPageProps) {
  const profile = await getProfile(params);
  const fit = calculateErgoFit({ ...profile, wearsShoes: true });
  const maxDeskDepth = fit.spaceFit?.maxDeskDepthInches ?? 0;
  const rearRemaining = profile.roomDepthInches - profile.deskDepthInches;
  const targetFits = profile.deskWidthInches <= profile.roomWidthInches &&
    profile.deskDepthInches <= maxDeskDepth && profile.deskDepthInches >= fit.minDeskDepthInches;
  const footprint = { width: profile.deskWidthInches, depth: profile.deskDepthInches };

  return (
    <EditorialPage title={profile.title} description={profile.tradeoff} parent={{ href: "/space", label: "All room layouts" }}>
      <section className="panel clearance-plan" aria-labelledby="clearance-plan-title">
        <h2 id="clearance-plan-title">Desk footprint and chair clearance</h2>
        <dl>
          <div><dt>Available room</dt><dd>{profile.roomWidthInches} × {profile.roomDepthInches} in</dd></div>
          <div><dt>Target desktop</dt><dd>{footprint.width} × {footprint.depth} in</dd></div>
          <div><dt>Room behind target desk</dt><dd>{rearRemaining} in</dd></div>
          <div><dt>Maximum desk depth</dt><dd>{maxDeskDepth} in</dd></div>
        </dl>
        <p>{profile.roomDepthInches} in room depth − {profile.rearChairClearanceInches} in planned chair clearance = {maxDeskDepth} in available for a desktop.</p>
        <p><strong>{targetFits ? "Target fits the planning envelope." : "Target falls outside the planning envelope."}</strong> {profile.clearanceNote}</p>
        {fit.spaceFit?.fitsComfortably && <p>Planner footprint for this room and display setup: {formatFootprint(fit.spaceFit.recommendedFootprint, "imperial")}.</p>}
      </section>
      <div className="editorial-notes">
        <section className="panel"><h2>Monitor placement</h2><p>{profile.monitorArmNote}</p></section>
        <section className="panel"><h2>Footrest and knee room</h2><p>{profile.footrestNote}</p></section>
      </div>
      <ProfileSetup fit={fit} />
      <GearMatchList fit={fit} units="imperial" deskFootprint={footprint} />
      <EditorialLinks title="Plan your own workspace" links={[
        { href: "/desk-height-calculator#room", label: "Enter your room dimensions" },
        { href: "/chair-fit-finder", label: "Check chair sizing and foot support" },
        { href: "/guides/small-space-home-office-setup", label: "Read the small-space home office guide" },
        { href: "/guides/standing-desk-widths-depths", label: "Compare desktop widths and depths" },
      ]} />
    </EditorialPage>
  );
}
