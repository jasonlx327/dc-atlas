import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

const directorySource = await readFile(new URL("../app/entity-directory.ts", import.meta.url), "utf8");
const directoryModule = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(directorySource)).toString("base64")}`);
const { entityDirectory } = directoryModule;
const source = await readFile(new URL("../app/intelligence-model.ts", import.meta.url), "utf8");
const implementation = stripTypeScriptTypes(source.replace(/^import .*;\n/gm, "")).replace(/\bexport /g, "");
const model = new Function("entityDirectory", "currentDailyBriefRecord", `${implementation}; return {storyEntities, articleEntities, relatedResearch};`)(entityDirectory, () => null);
const slugs = (records) => records.map((record) => record.slug);
const article = (title, href = "/columns/example") => ({ title, titleEn: "", summary: "", summaryEn: "", href });

test("entity matching preserves word boundaries, explicit IDs and ticker precedence", () => {
  assert.deepEqual(slugs(model.storyEntities({ id: "a", title: "ARM and NVIDIA" })), ["nvidia", "arm"]);
  assert.deepEqual(slugs(model.storyEntities({ id: "b", title: "pharmacy; a meta-analysis; Claude" })), ["anthropic", "meta"]);
  assert.deepEqual(slugs(model.storyEntities({ id: "c", title: "NVIDIA", entityIds: ["missing", "amd"] })), ["amd"]);
  assert.deepEqual(slugs(model.storyEntities({ id: "d", title: "NVIDIA", listedTicker: "AMD" })), ["amd"]);
  assert.deepEqual(slugs(model.storyEntities({ id: "e", title: "海光信息", entityIds: ["missing"] })), ["hygon"]);
});

test("targeted research matching equals the full directory relation for every entity", async () => {
  const records = JSON.parse(await readFile(new URL("../app/data/public-intelligence.json", import.meta.url), "utf8"));
  const articles = records.map((record) => article(`${record.title} ${record.titleEn} ${record.summary} ${record.summaryEn}`));
  articles.push(article("No alias in title", "/columns/hyperscale-idc-leases"));
  articles.push(article("SK hynix, Z.ai and 688041.SH"));
  for (const entity of entityDirectory) {
    const expected = articles.filter((item) => model.articleEntities(item).some((match) => match.slug === entity.slug));
    assert.deepEqual(model.relatedResearch(entity, articles), expected, entity.slug);
  }
  assert.deepEqual(model.relatedResearch({ slug: "not-in-directory" }, articles), []);
});

test("repeated matching retains deterministic results without regex cursor state", () => {
  const item = article("NVIDIA, AMD, Arm and Z.ai");
  const expected = slugs(model.articleEntities(item));
  for (let i = 0; i < 10; i++) assert.deepEqual(slugs(model.articleEntities(item)), expected);
});
