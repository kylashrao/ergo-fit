"use client";

import Link from "next/link";
import { useState } from "react";
import { AFFILIATE_LINK_REL, getGearDestination, standingDeskOffers } from "@/lib/affiliate-links";
import { matchGear } from "@/lib/catalog";
import GearProductLink from "./GearProductLink";
import AffiliateDisclosure from "./AffiliateDisclosure";
import type { ErgoFit } from "@/lib/ergoMath";
import { formatLength, type UnitSystem } from "@/lib/setupDisplay";

const categories = {
  chair: "Chair",
  "standing-desk": "Standing desk",
  "monitor-arm": "Monitor arm",
  footrest: "Footrest",
};

const filters = [
  { label: "All", categories: Object.keys(categories) },
  { label: "Chairs", categories: ["chair"] },
  { label: "Standing Desks", categories: ["standing-desk"] },
  { label: "Monitor Arms & Footrests", categories: ["monitor-arm", "footrest"] },
];

export default function GearMatchList({ fit, units, focus, deskFootprint }: {
  fit: ErgoFit;
  units: UnitSystem;
  focus?: "desk" | "chair";
  deskFootprint?: { width: number; depth: number };
}) {
  const [filter, setFilter] = useState(0);
  const length = (inches: number) => formatLength(inches, units);
  const range = (min?: number | null, max?: number | null) =>
    min == null || max == null ? undefined : min === max ? length(min) : `${length(min)}–${length(max)}`;
  const scope = focus === "desk" ? ["standing-desk", "monitor-arm"] : focus === "chair" ? ["chair", "footrest"] : filters[0].categories;
  const visibleCategories = scope.filter((category) => filters[filter].categories.includes(category));
  const matches = matchGear(fit, undefined, length).filter(({ item }) =>
    visibleCategories.includes(item.category) &&
    (item.category !== "standing-desk" || !deskFootprint ||
      (item.widthInches <= deskFootprint.width && item.depthInches <= deskFootprint.depth))
  );

  return (
    <section id="gear" className="gear-section" aria-labelledby="gear-title">
      <div className="section-heading">
        <h2 id="gear-title">Gear that fits</h2>
        <p>Compare manufacturer dimensions against your current setup.</p>
      </div>
      <div className="gear-filters" role="group" aria-label="Filter gear by category">
        {filters.map(({ label, categories }, index) => categories.some((category) => scope.includes(category)) && <button key={label} type="button" aria-pressed={filter === index} onClick={() => setFilter(index)}>{label}</button>)}
      </div>
      <div className="disclosures">
        <AffiliateDisclosure variant="banner" />
        {visibleCategories.includes("standing-desk") && (
          <ul className="gear-offer-links" aria-label="Standing desk shopping links">
            {standingDeskOffers.map(({ label, href }) => href && (
              <li key={label}><a href={href} rel={AFFILIATE_LINK_REL} target="_blank">{label}</a></li>
            ))}
          </ul>
        )}
        <p><strong>Ergonomic disclaimer.</strong> These estimates are educational workstation sizing guidance, not medical advice. Check the configuration and dimensions before buying. <Link href="/legal-disclaimer">Sizing disclaimer</Link>.</p>
      </div>
      <p className="match-count" role="status">{matches.length} {matches.length === 1 ? "match" : "matches"}</p>
      {matches.length === 0 && <p className="panel empty-state">No products in this category meet the current dimensions in our catalog.</p>}
      <div className="gear-grid">
        {matches.map(({ item, reasons }) => {
          const dimensions = [
            ["Width × depth", `${length(item.widthInches)} × ${length(item.depthInches)}`],
            ["Seat height", range(item.minSeatHeight, item.maxSeatHeight)],
            ["Seat depth", range(item.minSeatDepth, item.maxSeatDepth)],
            ["Desk height", range(item.minDeskHeight, item.maxDeskHeight)],
            ["Footrest lift", range(item.minFootrestHeight, item.maxFootrestHeight)],
            ["Monitor limit", item.maxMonitorInches && `Up to ${item.maxMonitorInches}″`],
          ];
          return (
            <article className="panel gear-card" key={item.affiliateKey}>
              <div className="gear-meta">
                <span>{categories[item.category as keyof typeof categories]}</span>
                <span>{item.priceTier}</span>
              </div>
              <h3>{item.name}</h3>
              <p className="configuration">{item.configuration}</p>
              <dl>
                {dimensions.map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <h4>Why it fits your specs</h4>
              <ul>{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
              <GearProductLink destination={getGearDestination(item.affiliateKey, item.sources[0])} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
