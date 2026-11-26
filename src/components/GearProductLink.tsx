import { AFFILIATE_LINK_REL, type GearDestination } from "../lib/affiliate-links";
import AffiliateDisclosure from "./AffiliateDisclosure";

export default function GearProductLink({ destination }: { destination?: GearDestination }) {
  if (!destination) return null;

  return (
    <div className="gear-link">
      {destination.kind === "affiliate" ? (
        <>
          <AffiliateDisclosure />
          <a href={destination.href} rel={AFFILIATE_LINK_REL} target="_blank">Visit {destination.merchant}</a>
        </>
      ) : (
        <a href={destination.href} rel="noopener noreferrer" target="_blank">View manufacturer specs</a>
      )}
    </div>
  );
}
