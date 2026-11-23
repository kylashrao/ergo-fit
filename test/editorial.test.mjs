import assert from "node:assert/strict";
import test from "node:test";
import { editorialPaths, guides, heights, spaces, trustPages } from "../src/lib/editorial.ts";
import { calculateErgoFit, REAR_CHAIR_CLEARANCE_INCHES } from "../src/lib/ergoMath.ts";
import { formatLength } from "../src/lib/setupDisplay.ts";

test("twenty ordered height profiles use the engine's metric rounding", () => {
  assert.equal(heights.length, 20);
  assert.equal(heights[0].heightInches, 58);
  assert.equal(heights.at(-1).heightInches, 79);
  for (const [index, profile] of heights.entries()) {
    assert.equal(profile.metricLabel, formatLength(profile.heightInches, "metric"));
    if (index) {
      const increment = profile.heightInches - heights[index - 1].heightInches;
      assert.ok(increment >= 1 && increment <= 1.5, profile.slug);
    }
  }
});

test("room profiles use the engine clearance and include both fitting and tight layouts", () => {
  assert.equal(spaces.length, 15);
  const outcomes = new Set();
  for (const profile of spaces) {
    const fit = calculateErgoFit({ ...profile, wearsShoes: true }).spaceFit;
    assert.equal(profile.rearChairClearanceInches, REAR_CHAIR_CLEARANCE_INCHES);
    assert.equal(fit.maxDeskDepthInches, profile.roomDepthInches - profile.rearChairClearanceInches);
    outcomes.add(fit.fitsComfortably);
    if (profile.slug === "48-inch-small-apartment-setup") {
      assert.equal(fit.recommendedFootprint, "48x24");
    }
  }
  assert.deepEqual(outcomes, new Set([true, false]));
});

test("guides have visible FAQ content, sources, and links to indexable routes", () => {
  assert.equal(guides.length, 8);
  const routes = new Set(editorialPaths);
  assert.equal(routes.size, 55);
  assert.equal(trustPages.length, 6);
  for (const { href } of trustPages) assert.ok(routes.has(href));
  assert.equal(routes.size, editorialPaths.length);
  for (const guide of guides) {
    assert.ok(guide.sections.length >= 3 && guide.takeaways.length >= 3);
    assert.ok(guide.faqs.length >= 2 && guide.faqs.every(({ question, answer }) => question && answer));
    assert.ok(guide.sources.length > 0);
    assert.ok(guide.links.some(({ href }) => href.endsWith("#gear")));
    for (const { href } of guide.links) {
      assert.ok(routes.has(href.split("#")[0]), `${guide.slug}: ${href}`);
    }
  }
});
