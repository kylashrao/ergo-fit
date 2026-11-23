import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateErgoFit,
  cmToInches,
  feetAndInchesToInches,
  inchesToCm,
  inchesToFeetAndInches,
} from "../src/lib/ergoMath.ts";
import { getAffiliateLink, matchGear } from "../src/lib/catalog.ts";
import catalog from "../data/gear-catalog.json" with { type: "json" };

const profile = (heightInches, overrides = {}) =>
  calculateErgoFit({ heightInches, wearsShoes: false, dualMonitor: false, ...overrides });

test("5'0 barefoot profile needs a low cylinder and 7.3-inch foot support at a fixed desk", () => {
  const fit = profile(feetAndInchesToInches(5, 0));
  assert.deepEqual(fit.seatHeight, { exactInches: 15, inches: 15, cm: 38 });
  assert.equal(fit.needsLowCylinder, true);
  assert.equal(fit.aeronSize, "Size A");
  assert.equal(fit.seatDepth.inches, 13.7);
  assert.equal(fit.seatedDeskHeight.inches, 22.2);
  assert.equal(fit.footrestHeightForStandardDesk.inches, 7.3);
  assert.equal(fit.footrestHeightForStandardDesk.cm, 18.5);
  assert.equal(fit.fitsStandardFixedDesk, false);
  assert.deepEqual(matchGear(fit, "chair"), []);
  assert.deepEqual(matchGear(fit, "footrest"), []);
});

test("5'9 with shoes meets the calculated elbow targets and falls below the Size B threshold", () => {
  const fit = profile(feetAndInchesToInches(5, 9), { wearsShoes: true });
  assert.equal(fit.shoeAllowance.cm, 2.5);
  assert.equal(fit.seatHeight.inches, 18.3);
  assert.equal(fit.needsLowCylinder, false);
  assert.equal(fit.seatedDeskHeight.inches, 26.5);
  assert.equal(fit.seatedDeskHeight.cm, 67.5);
  assert.equal(fit.standingDeskHeight.inches, 43.1);
  assert.equal(fit.standingDeskHeight.cm, 109.5);
  assert.equal(fit.monitorTopBezelHeight.inches, 50.7);
  assert.equal(fit.seatDepth.inches, 16.1);
  assert.equal(fit.aeronSize, "Size A");
  assert.equal(fit.viewingDistanceInches, 23);
  assert.equal(fit.viewingDistance.cm, 58.5);
});

test("Size B includes both cutoffs and excludes values outside them", () => {
  const heightForDepth = (depth) => (depth + 2.5) / 0.27;
  assert.equal(profile(heightForDepth(16.299)).aeronSize, "Size A");
  assert.equal(profile(heightForDepth(16.3)).aeronSize, "Size B");
  assert.equal(profile(72).aeronSize, "Size B");
  assert.equal(profile(heightForDepth(17.7)).aeronSize, "Size B");
  assert.equal(profile(heightForDepth(17.701)).aeronSize, "Size C");
});

test("6'5 reaches about 47 inches standing and matches Size C", () => {
  const fit = profile(77);
  assert.equal(fit.standingDeskHeight.inches, 47);
  assert.equal(fit.standingDeskHeight.cm, 119.5);
  assert.equal(fit.aeronSize, "Size C");
  assert.equal(fit.fitsStandardFixedDesk, false);
  assert.equal(profile(77, { wearsShoes: true }).fitsStandardFixedDesk, true);
  assert.equal(matchGear(fit, "chair")[0].item.affiliateKey, "aeron-c");
  assert.equal(profile(80, { wearsShoes: true }).footrestHeightForStandardDesk.inches, 0);
});

test("62 by 58 apartment allows a 48x24 desk and clamp arm", () => {
  const fit = profile(69, { wearsShoes: true, roomWidthInches: 62, roomDepthInches: 58 });
  assert.equal(fit.spaceFit.maxDeskWidthInches, 62);
  assert.equal(fit.spaceFit.maxDeskDepthInches, 26);
  assert.equal(fit.spaceFit.maxDeskDepth.cm, 66);
  assert.equal(fit.spaceFit.recommendedFootprint, "48x24");
  assert.equal(fit.spaceFit.fitsComfortably, true);
  assert.equal(fit.minDeskDepthInches, 24);
  assert.equal(fit.monitorMount, "clamp-arm");
  const desks = matchGear(fit, "standing-desk");
  assert.deepEqual(desks.map(({ item }) => item.widthInches), [48, 42]);
  assert.match(desks[0].reasons[1], /leaves 32"/);
  assert.equal(matchGear(fit, "monitor-arm")[0].item.affiliateKey, "ergotron-lx");
});

test("viewing distance and desktop depth follow display configuration", () => {
  const room = { roomWidthInches: 62, roomDepthInches: 58 };
  assert.equal(profile(69, { monitorInches: 19 }).viewingDistanceInches, 20);
  assert.equal(profile(69, { monitorInches: 40 }).viewingDistanceInches, 32);
  for (const overrides of [{ dualMonitor: true }, { monitorInches: 32 }, { monitorMount: "stand" }]) {
    const fit = profile(69, { ...room, ...overrides });
    assert.equal(fit.minDeskDepthInches, 30);
    assert.equal(fit.spaceFit.recommendedFootprint, "tight-nook");
    assert.equal(fit.spaceFit.fitsComfortably, false);
    assert.deepEqual(matchGear(fit, "standing-desk"), []);
  }
  assert.equal(profile(69, { dualMonitor: true, monitorMount: "clamp-arm" }).minDeskDepthInches, 24);
});

test("clamping, conversion, missing room dimensions and invalid inputs", () => {
  assert.deepEqual(profile(40), profile(56));
  assert.deepEqual(profile(90), profile(80));
  assert.equal(cmToInches(inchesToCm(69)), 69);
  assert.deepEqual(inchesToFeetAndInches(77.5), { feet: 6, inches: 5.5 });
  assert.equal(profile(69, { roomWidthInches: 60 }).spaceFit, null);
  assert.equal(profile(69, { roomWidthInches: 60, roomDepthInches: 20 }).spaceFit.maxDeskDepthInches, 0);
  assert.throws(() => profile(NaN), RangeError);
  assert.throws(() => profile(69, { monitorInches: 0 }), RangeError);
});

test("catalog has twelve sourced products with unique centralized placeholder links", () => {
  assert.equal(catalog.length, 12);
  assert.equal(new Set(catalog.map(({ affiliateKey }) => affiliateKey)).size, 12);
  for (const item of catalog) {
    assert.ok(item.sources.length && item.widthInches > 0 && item.depthInches > 0);
    const link = getAffiliateLink(item.affiliateKey);
    assert.equal(new URL(link.url).hostname, "example.com");
    assert.ok(link.merchant);
    assert.match(link.disclosureLabel, /commission/);
  }
  assert.equal(getAffiliateLink("constructor"), undefined);
  const fit = profile(69, { wearsShoes: false });
  assert.equal(matchGear(fit, "footrest")[0].item.affiliateKey, "kensington-solemate-plus");
  assert.deepEqual(matchGear(fit), matchGear(fit));
});
