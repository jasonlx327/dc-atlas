import test from "node:test";
import assert from "node:assert/strict";
import { checkScanNetwork } from "../scripts/check-scan-network.mjs";

test("scan preflight preserves DNS failure codes and stops a zero-fetch run", async () => {
  const report = await checkScanNetwork(async () => { throw new TypeError("fetch failed", { cause: { code: "ENOTFOUND" } }); });
  assert.equal(report.ok, false);
  assert.equal(report.results.length, 2);
  assert.ok(report.results.every((item) => item.code === "ENOTFOUND"));
});

test("one source-specific denial does not become a global network blocker", async () => {
  let calls = 0;
  const report = await checkScanNetwork(async () => {
    if (calls++ === 0) throw new Error("network failure");
    return new Response("Forbidden", { status: 403 });
  });
  assert.equal(report.ok, true);
  assert.equal(report.results[1].status, 403);
});
