import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

function config(overrides = {}) {
  const env = {
    ...process.env,
    SITE_OPERATOR: "",
    SITE_CONTACT_EMAIL: "",
    NEXT_PUBLIC_ADSENSE_CLIENT: "",
    NEXT_PUBLIC_ADSENSE_ENABLED: "",
    ...overrides,
  };
  const expression = 'import * as config from "./src/lib/siteConfig.ts"; console.log(JSON.stringify(config));';
  return JSON.parse(execFileSync(process.execPath, ["--no-warnings", "--input-type=module", "-e", expression], {
    env,
    cwd: new URL("../", import.meta.url),
    encoding: "utf8",
  }));
}

test("public identity has no fabricated email and the ad slot defaults to off", () => {
  assert.deepEqual(config(), {
    siteOperator: "ergo-fit",
    siteContactEmail: null,
    adsenseClient: null,
    previewAdSlot: false,
  });
});

test("verification accepts a configured client separately from the slot toggle", () => {
  const client = "ca-pub-1234567890123456";
  assert.deepEqual(config({
    SITE_OPERATOR: " Example Operator ",
    SITE_CONTACT_EMAIL: " contact@example.com ",
    NEXT_PUBLIC_ADSENSE_CLIENT: client,
  }), {
    siteOperator: "Example Operator",
    siteContactEmail: "contact@example.com",
    adsenseClient: client,
    previewAdSlot: false,
  });
  assert.equal(config({ NEXT_PUBLIC_ADSENSE_CLIENT: client, NEXT_PUBLIC_ADSENSE_ENABLED: "true" }).previewAdSlot, true);
  assert.equal(config({ NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-0000000000000000", NEXT_PUBLIC_ADSENSE_ENABLED: "true" }).previewAdSlot, false);
});
