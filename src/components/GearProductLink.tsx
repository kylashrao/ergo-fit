import type { GearDestination } from "../lib/affiliate-links";

export default function GearProductLink({ destination }: { destination?: GearDestination }) {
  if (!destination) return null;

  return (
    <div className="gear-link">
      {destination.kind === "affiliate" ? (
        <>
          <span className="affiliate-badge">{destination.disclosureText}</span>
          <a href={destination.href} rel="sponsored noopener noreferrer" target="_blank">Visit {destination.merchant}</a>
        </>
      ) : (
        <a href={destination.href} rel="noopener noreferrer" target="_blank">View manufacturer specs</a>
      )}
    </div>
  );
}
