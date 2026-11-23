const CM_PER_INCH = 2.54;
export const REAR_CHAIR_CLEARANCE_INCHES = 32;

export const inchesToCm = (inches: number) => inches * CM_PER_INCH;
export const cmToInches = (cm: number) => cm / CM_PER_INCH;
export const feetAndInchesToInches = (feet: number, inches = 0) => feet * 12 + inches;

export function inchesToFeetAndInches(totalInches: number) {
  const feet = Math.floor(totalInches / 12);
  return { feet, inches: totalInches - feet * 12 };
}

export interface ErgoInput {
  heightInches: number;
  wearsShoes: boolean;
  roomWidthInches?: number;
  roomDepthInches?: number;
  monitorInches?: number;
  dualMonitor: boolean;
  monitorMount?: "clamp-arm" | "stand";
}

function measurement(exactInches: number) {
  return {
    exactInches,
    inches: Math.round(exactInches * 10) / 10,
    cm: Math.round(inchesToCm(exactInches) * 2) / 2,
  };
}

const footprints = [
  { width: 60, depth: 30, label: "60x30" },
  { width: 48, depth: 30, label: "48x30" },
  { width: 48, depth: 24, label: "48x24" },
  { width: 42, depth: 24, label: "42x24" },
] as const;

function calculateSpaceFit(width: number, depth: number, minDeskDepth: number) {
  const maxDeskWidth = Math.max(0, width);
  const maxDeskDepth = Math.max(0, depth - REAR_CHAIR_CLEARANCE_INCHES);
  const footprint = footprints.find(({ width, depth }) =>
    width <= maxDeskWidth && depth <= maxDeskDepth && depth >= minDeskDepth
  );

  return {
    maxDeskWidthInches: measurement(maxDeskWidth).inches,
    maxDeskDepthInches: measurement(maxDeskDepth).inches,
    maxDeskWidth: measurement(maxDeskWidth),
    maxDeskDepth: measurement(maxDeskDepth),
    recommendedFootprint: footprint?.label ?? "tight-nook",
    fitsComfortably: footprint !== undefined,
  };
}

/** Estimates based on project proportions and ANSI/BIFMA G1 workstation fit principles. */
export function calculateErgoFit({
  heightInches,
  wearsShoes,
  roomWidthInches,
  roomDepthInches,
  monitorInches = 27,
  dualMonitor,
  monitorMount = dualMonitor ? "stand" : "clamp-arm",
}: ErgoInput) {
  if (!Number.isFinite(heightInches) || !Number.isFinite(monitorInches) || monitorInches <= 0 ||
    (roomWidthInches !== undefined && !Number.isFinite(roomWidthInches)) ||
    (roomDepthInches !== undefined && !Number.isFinite(roomDepthInches))) {
    throw new RangeError("Supply finite dimensions and a positive monitor size.");
  }

  const height = Math.max(56, Math.min(80, heightInches));
  const shoeAllowance = wearsShoes ? 1 : 0;
  const seatHeight = 0.25 * height + shoeAllowance;
  const seatDepth = 0.27 * height - 2.5;
  const seatedDeskHeight = 0.37 * height + shoeAllowance;
  const viewingDistance = Math.max(20, Math.min(32, monitorInches * 0.85));
  const minDeskDepth = monitorInches <= 27 && monitorMount === "clamp-arm" ? 24 : 30;
  // One trillionth of an inch absorbs floating-point noise at inclusive thresholds.
  const sizeThresholdDepth = Math.round(seatDepth * 1e12) / 1e12;

  return {
    height: measurement(height),
    shoeAllowance: measurement(shoeAllowance),
    seatHeight: measurement(seatHeight),
    needsLowCylinder: seatHeight < 16.5,
    footrestHeightForStandardDesk: measurement(Math.max(0, 29.5 - seatedDeskHeight)),
    seatDepth: measurement(seatDepth),
    aeronSize: sizeThresholdDepth < 16.3 ? "Size A" : sizeThresholdDepth > 17.7 ? "Size C" : "Size B",
    seatedDeskHeight: measurement(seatedDeskHeight),
    fitsStandardFixedDesk: seatedDeskHeight >= 28.5 && seatedDeskHeight <= 30.5,
    standingDeskHeight: measurement(0.61 * height + shoeAllowance),
    monitorTopBezelHeight: measurement(0.72 * height + shoeAllowance),
    monitorInches,
    dualMonitor,
    monitorMount,
    viewingDistanceInches: measurement(viewingDistance).inches,
    viewingDistance: measurement(viewingDistance),
    minDeskDepthInches: minDeskDepth,
    minDeskDepth: measurement(minDeskDepth),
    roomDepth: roomDepthInches === undefined ? null : measurement(Math.max(0, roomDepthInches)),
    spaceFit: roomWidthInches === undefined || roomDepthInches === undefined
      ? null
      : calculateSpaceFit(roomWidthInches, roomDepthInches, minDeskDepth),
  } as const;
}

export type ErgoFit = ReturnType<typeof calculateErgoFit>;
