import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/columns/september-15-articles.ts", import.meta.url), "utf8");
const articles = new Function(source.replace("export const", "const") + ";return september15Articles;")();
const records = await Promise.all(["pacing", "oracle"].map(async name => JSON.parse(await readFile(new URL(`../app/columns/september-15-${name}.json`, import.meta.url), "utf8"))));
async function render(path) {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(new Request("https://idc-index.com" + path, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not Found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("September 15 research retains bilingual depth and resolvable claim references", async () => {
  for (const article of articles) {
    const record = records.find(r => r.slug === article.slug);
    assert.ok(record);
    await readFile(new URL("../public" + article.image, import.meta.url));
    assert.equal(record.zh.sections.length, record.en.sections.length);
    for (const lang of ["zh", "en"]) {
      const c = record[lang];
      const narrative = [...c.opening, ...c.sections.flatMap(s => s.paragraphs), c.conclusion].join(" ");
      const length = lang === "zh" ? (narrative.match(/\p{Script=Han}/gu) || []).length : (narrative.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
      assert.ok(length >= (lang === "zh" ? 4000 : 2200), `${article.slug} ${lang}: ${length}`);
      for (const ref of narrative.matchAll(/\[(\d+)\]/g)) assert.ok(record.sources[Number(ref[1]) - 1], `invalid source ${ref[0]}`);
    }
  }
});

test("September 15 releases expose complete language routes and discovery only after publication", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse(articles[0].publishAt) - 1 });
  for (const a of articles) for (const prefix of ["", "/en"]) assert.equal((await render(prefix + "/columns/" + a.slug)).status, 404);
  t.mock.timers.setTime(Date.parse(articles[0].publishAt));
  for (const a of articles) {
    for (const prefix of ["", "/en"]) {
      const response = await render(prefix + "/columns/" + a.slug);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /AnalysisNewsArticle/);
      assert.ok(html.includes(a.publishAt));
      assert.ok(html.includes(a.image));
      assert.ok(html.includes('id="research-section-6"'));
      assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""), /\]\(https:\/\//);
    }
    for (const path of ["/", "/en", "/columns", "/en/columns", "/feed.xml", "/en/feed.xml", "/sitemap.xml", "/llms.txt", "/en/llms.txt"]) {
      const response = await render(path);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(a.slug), `missing ${a.slug} on ${path}`);
    }
  }
});
