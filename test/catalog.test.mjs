import assert from "node:assert/strict";
import test from "node:test";
import catalog from "../data/gear-catalog.json" with { type: "json" };

test("every product has HTTPS manufacturer sources without CMS upload PDFs", () => {
  for (const { affiliateKey, sources } of catalog) {
    assert.ok(sources.length > 0, `${affiliateKey} must have a manufacturer source`);
    for (const source of sources) {
      const message = `${affiliateKey}: ${source}`;
      assert.match(source, /^https:\/\//, message);
      assert.doesNotMatch(new URL(source).pathname, /\/content\/uploads\/.*\.pdf$/i, message);
    }
  }
});
