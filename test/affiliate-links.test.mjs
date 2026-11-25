import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import catalog from "../data/gear-catalog.json" with { type: "json" };
import programs from "../data/affiliate-links.json" with { type: "json" };
import { getGearDestination, programStatuses, resolveProductLink, safeHttpsUrl } from "../src/lib/affiliate-links.ts";

const filename = new URL("../data/affiliate-links.json", import.meta.url);
const utmKeys = ["utm_source", "utm_medium", "utm_campaign"];

test("affiliate JSON contains no repeated properties or product keys", () => {
  const tree = ts.parseJsonText("affiliate-links.json", readFileSync(filename, "utf8"));
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const keys = node.properties.map((property) => property.name.text);
      assert.equal(new Set(keys).size, keys.length, `Duplicate JSON property in ${node.getText(tree)}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);

  const keys = Object.values(programs).flatMap(({ products }) => Object.keys(products));
  assert.equal(new Set(keys).size, keys.length);
  assert.deepEqual(new Set(keys), new Set(catalog.map(({ affiliateKey }) => affiliateKey)));
});

test("affiliate programs and products use the expected schema and manufacturer references", () => {
  const sources = new Map(catalog.map(({ affiliateKey, sources }) => [affiliateKey, sources]));
  const allowedTags = new Set([...catalog.map(({ category }) => category), "height-fit", "room-fit"]);
  for (const [partner, program] of Object.entries(programs)) {
    assert.match(partner, /^[a-z][a-z0-9_]+$/);
    assert.match(program.merchant, /\S/);
    assert.ok(programStatuses.includes(program.status), partner);
    assert.match(program.disclosureText, /\bcommission\b/i);
    assert.ok(Array.isArray(program.tags) && program.tags.every((tag) => allowedTags.has(tag)));
    for (const [key, product] of Object.entries(program.products)) {
      assert.ok(safeHttpsUrl(product.fallbackUrl), key);
      assert.ok(sources.get(key)?.includes(product.fallbackUrl), key);
      assert.ok(product.trackingUrl === null || safeHttpsUrl(product.trackingUrl), key);
      assert.ok(product.utmParams && typeof product.utmParams === "object" && !Array.isArray(product.utmParams));
      for (const [name, value] of Object.entries(product.utmParams)) {
        assert.ok(utmKeys.includes(name), name);
        assert.match(value, /\S/);
      }
      assert.equal(getGearDestination(key)?.kind, program.status === "approved" && product.trackingUrl ? "affiliate" : "reference");
    }
  }
});

const merchant = "Test merchant";
const disclosureText = "We may earn a commission if you buy through this link.";
// Synthetic fixtures exercise URL handling locally and are never added to the catalog.
const trackingUrl = "https://merchant-fixture.example.edu/item?ref=opaque%20value&utm_source=provided#details";
const fallbackUrl = catalog[0].sources[0];
const product = { trackingUrl, fallbackUrl, utmParams: {} };
const approved = { status: "approved", merchant, disclosureText };

test("unapproved, missing, malformed, or placeholder URLs fall back safely", () => {
  const reference = { kind: "reference", href: fallbackUrl };
  for (const status of programStatuses.filter((status) => status !== "approved")) {
    assert.deepEqual(resolveProductLink({ ...approved, status }, product), reference);
  }
  for (const invalid of [null, "not a URL", "http://merchant-fixture.example.edu/item", "https://sub.example.com/item",
    "https://merchant-fixture.example.edu/?tag=YOUR_TAG", "https://merchant-fixture.example.edu/?tag=%59OUR_TAG", "https://user:pass@merchant-fixture.example.edu"]) {
    assert.deepEqual(resolveProductLink(approved, { ...product, trackingUrl: invalid }), reference);
  }
  assert.deepEqual(getGearDestination("constructor", fallbackUrl), reference);
  assert.equal(resolveProductLink(approved, { ...product, trackingUrl: null, fallbackUrl: "https://example.com" }), undefined);
});

test("approved URLs keep partner parameters and add only explicitly configured missing UTMs", () => {
  assert.equal(resolveProductLink(approved, product).href, trackingUrl);
  const destination = resolveProductLink(approved, {
    ...product,
    utmParams: { utm_source: "ergo-fit", utm_medium: "affiliate" },
  });
  assert.equal(destination.href, trackingUrl.replace("#details", "&utm_medium=affiliate#details"));
});

test("rendered affiliate anchors have a nearby commission disclosure and sponsored rel", () => {
  const component = new URL("../src/components/GearProductLink.tsx", import.meta.url);
  const { outputText } = ts.transpileModule(readFileSync(component, "utf8"), {
    fileName: component.pathname,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  new Function("require", "exports", outputText)(createRequire(import.meta.url), exports);
  const render = (destination) => renderToStaticMarkup(createElement(exports.default, { destination }));

  const paid = render(resolveProductLink(approved, product));
  assert.match(paid, /commission[^<]*<\/span><a [^>]*rel="sponsored noopener noreferrer"[^>]*target="_blank"/);
  const reference = render(resolveProductLink({ ...approved, status: "pending_approval" }, product));
  assert.match(reference, /rel="noopener noreferrer" target="_blank">View manufacturer specs/);
  assert.doesNotMatch(reference, /sponsored|commission|merchant-fixture/);
  assert.equal(render(undefined), "");
});
