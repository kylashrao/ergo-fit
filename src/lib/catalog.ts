import gearData from "../../data/gear-catalog.json" with { type: "json" };
import { REAR_CHAIR_CLEARANCE_INCHES, type ErgoFit } from "./ergoMath.ts";

interface GearItem {
  name: string;
  category: string;
  configuration: string;
  widthInches: number;
  depthInches: number;
  priceTier: string;
  bestFor: string;
  affiliateKey: string;
  sources: string[];
  minSeatHeight: number | null;
  maxSeatHeight: number | null;
  minSeatDepth: number | null;
  maxSeatDepth: number | null;
  minDeskHeight: number | null;
  maxDeskHeight: number | null;
  aeronSize?: string;
  maxMonitorInches?: number;
  minMonitorWeightLbs?: number;
  maxMonitorWeightLbs?: number;
  minFootrestHeight?: number;
  maxFootrestHeight?: number;
}

type GearCategory = "chair" | "standing-desk" | "monitor-arm" | "footrest";
type GearMatch = { item: GearItem; score: number; reasons: string[] };

function covers(target: number, min?: number | null, max?: number | null) {
  return min != null && max != null && min <= target && target <= max;
}

/** Returns dimensional matches. Mount compatibility and under-desk clearance require setup details. */
export function matchGear(
  fit: ErgoFit,
  category?: GearCategory,
  formatLength?: (inches: number) => string,
): GearMatch[] {
  const matches: GearMatch[] = [];

  for (const item of gearData) {
    if (category !== undefined && item.category !== category) continue;
    const match = scoreGear(item, fit, formatLength);
    if (match) matches.push(match);
  }

  // The stable sort preserves catalog order for equal scores.
  return matches.sort((a, b) => b.score - a.score);
}

function scoreGear(item: GearItem, fit: ErgoFit, formatLength?: (inches: number) => string): GearMatch | undefined {
  const length = formatLength ?? ((inches: number) => `${inches}"`);
  const targetLength = (value: ErgoFit["seatHeight"]) => formatLength ? formatLength(value.exactInches) : length(value.inches);
  const { spaceFit, seatHeight, seatDepth, seatedDeskHeight, standingDeskHeight } = fit;
  const roomWidth = spaceFit?.maxDeskWidth.exactInches ?? Infinity;
  const deskDepth = spaceFit?.maxDeskDepth.exactInches ?? Infinity;
  const footprint = `${length(item.widthInches)} × ${length(item.depthInches)}`;

  switch (item.category) {
    case "chair": {
      if (item.widthInches > roomWidth || item.depthInches > Math.min(REAR_CHAIR_CLEARANCE_INCHES, fit.roomDepth?.exactInches ?? Infinity) ||
        !covers(seatHeight.exactInches, item.minSeatHeight, item.maxSeatHeight)) return;
      const minDepth = item.minSeatDepth;
      const fixedDepth = minDepth !== null && minDepth === item.maxSeatDepth;
      const depthGap = fixedDepth ? Math.abs(seatDepth.exactInches - minDepth) : 0;
      // A fixed pan can be a close match within half an inch of the estimated target.
      if (fixedDepth ? depthGap > 0.5 : !covers(seatDepth.exactInches, item.minSeatDepth, item.maxSeatDepth)) return;
      return {
        item,
        score: 100 - depthGap * 10 + (item.aeronSize === fit.aeronSize ? 10 : 0),
        reasons: [
          `The ${length(item.minSeatHeight!)}–${length(item.maxSeatHeight!)} seat-height range includes your ${targetLength(seatHeight)} target.`,
          fixedDepth
            ? `The fixed ${length(item.minSeatDepth!)} pan is within ${length(0.5)} of your ${targetLength(seatDepth)} estimate. Check knee clearance in person.`
            : `The pan adjusts to your ${targetLength(seatDepth)} seat-depth target.`,
          ...(spaceFit ? [`The ${footprint} chair fits the room width and the planned ${length(REAR_CHAIR_CLEARANCE_INCHES)} chair zone.`] : []),
        ],
      };
    }
    case "standing-desk": {
      if (item.widthInches > roomWidth || item.depthInches > deskDepth ||
        item.depthInches < fit.minDeskDepthInches ||
        !covers(seatedDeskHeight.exactInches, item.minDeskHeight, item.maxDeskHeight) ||
        !covers(standingDeskHeight.exactInches, item.minDeskHeight, item.maxDeskHeight)) return;
      const preferredFootprint = spaceFit?.recommendedFootprint === `${item.widthInches}x${item.depthInches}`;
      return {
        item,
        score: 100 + (preferredFootprint ? 10 : 0),
        reasons: [
          `The ${length(item.minDeskHeight!)}–${length(item.maxDeskHeight!)} range covers your ${targetLength(seatedDeskHeight)} seated and ${targetLength(standingDeskHeight)} standing targets.`,
          `The ${footprint} surface meets the ${length(fit.minDeskDepthInches)} monitor setup depth${spaceFit ? ` and leaves ${length(REAR_CHAIR_CLEARANCE_INCHES)} behind the desk` : ""}.`,
        ],
      };
    }
    case "monitor-arm": {
      if (fit.monitorMount !== "clamp-arm" || fit.dualMonitor ||
        fit.monitorInches > (item.maxMonitorInches ?? 0) ||
        roomWidth < item.widthInches || deskDepth < fit.minDeskDepthInches) return;
      return {
        item,
        score: 100,
        reasons: [
          `The arm is rated for a single ${fit.monitorInches}" display by diagonal size. Check VESA pattern, display weight (${item.minMonitorWeightLbs}–${item.maxMonitorWeightLbs} lb), desk thickness, and arm swing.`,
          `The clamp frees desktop area. Adjust toward a ${targetLength(fit.viewingDistance)} viewing distance and ${targetLength(fit.monitorTopBezelHeight)} top bezel height.`,
        ],
      };
    }
    case "footrest": {
      const target = fit.footrestHeightForStandardDesk;
      if (target.exactInches <= 0 || !covers(target.exactInches, item.minFootrestHeight, item.maxFootrestHeight) ||
        item.widthInches > roomWidth || item.depthInches > deskDepth) return;
      return {
        item,
        score: 100,
        reasons: [
          `The ${length(item.minFootrestHeight!)}–${length(item.maxFootrestHeight!)} lift range covers your ${targetLength(target)} target at a ${length(29.5)} desk.`,
          `The platform measures ${footprint}. Verify clear space under your desk.`,
        ],
      };
    }
  }
}
