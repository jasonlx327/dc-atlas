import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articles = JSON.parse(await readFile(new URL("../app/columns/september-four-articles.json", import.meta.url), "utf8"));
const records = JSON.parse(await readFile(new URL("../app/columns/september-four-data.json", import.meta.url), "utf8"));
async function render(path) {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(new Request("https://idc-index.com" + path), { ASSETS: { fetch: async () => new Response("Not Found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}
test("four explainers retain all sections, source references and table cells in both languages", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse(articles[0].publishAt) });
  for (const article of articles) {
    const record = records.find(r => r.slug === article.slug);
    assert.equal(record.layout, "explainer");
    assert.ok(record.imageAltZh && record.imageAltEn);
    await readFile(new URL("../public" + article.image, import.meta.url));
    for (const lang of ["zh", "en"]) {
      const copy = record[lang];
      assert.equal(copy.sections.length, 6);
      const response = await render((lang === "en" ? "/en" : "") + article.href);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /atlas-explainer/);
      assert.match(html, /AnalysisNewsArticle/);
      assert.match(html, /explainer-sources/);
      assert.ok(html.includes(article.image));
      const narrative = [copy.thesis, ...copy.opening, ...copy.sections.flatMap(s => s.paragraphs), copy.conclusion].join(" ");
      for (const match of narrative.matchAll(/\[(\d+)\]/g)) assert.ok(record.sources[Number(match[1]) - 1]);
      for (const section of copy.sections) {
        assert.ok(html.includes(section.heading.replaceAll("&", "&amp;")));
        if (section.table) {
          assert.ok(section.table.afterParagraph <= section.paragraphs.length);
          for (const row of section.table.rows) assert.equal(row.length, section.table.headers.length);
        }
      }
      assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""), /\]\(https:\/\//);
    }
  }
});
test("all four explainers are discoverable together and remain hidden before their release", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse(articles[0].publishAt) - 1 });
  for (const article of articles) assert.equal((await render(article.href)).status, 404);
  t.mock.timers.setTime(Date.parse(articles[0].publishAt));
  for (const path of ["/", "/en", "/columns", "/en/columns", "/feed.xml", "/en/feed.xml", "/sitemap.xml", "/llms.txt", "/en/llms.txt"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const article of articles) assert.ok(html.includes(article.slug), path + ": " + article.slug);
  }
});
