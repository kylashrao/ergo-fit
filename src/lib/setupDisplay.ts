import { inchesToCm, type ErgoFit } from "./ergoMath.ts";

export type UnitSystem = "imperial" | "metric";

export function formatLength(inches: number, units: UnitSystem) {
  return units === "metric"
    ? `${Math.round(inchesToCm(inches) * 2) / 2} cm`
    : `${Math.round(inches * 10) / 10} in`;
}

export function setupMeasurements(fit: ErgoFit) {
  return [
    { label: "Seated desk / keyboard", value: fit.seatedDeskHeight },
    { label: "Standing desk", value: fit.standingDeskHeight },
    { label: "Chair seat height", value: fit.seatHeight },
    { label: "Seat depth", value: fit.seatDepth },
    { label: "Monitor top bezel", value: fit.monitorTopBezelHeight },
    { label: "Viewing distance", value: fit.viewingDistance },
  ];
}

export function formatFootprint(footprint: string, units: UnitSystem) {
  return footprint.split("x").map((value) => formatLength(Number(value), units)).join(" × ");
}
