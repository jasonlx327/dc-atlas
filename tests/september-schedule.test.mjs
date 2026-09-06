import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

const source = await readFile(new URL("../app/columns/september-week-articles.ts", import.meta.url), "utf8");
const articles = new Function(source.replace("export const", "const") + ";return septemberWeekArticles;")();

async function render(path) {
  const { default: worker } = await import("../dist/server/index.js");
  return worker.fetch(new Request("https://idc-index.com" + path, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not Found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("five complete bilingual originals have unique schedules and source records", async () => {
  assert.equal(articles.length, 5);
  assert.equal(new Set(articles.map(x => x.slug)).size, 5);
  const records = [];
  for (const name of ["hf", "broadcom", "claude", "ciena"]) {
    records.push(JSON.parse(await readFile(new URL(`../app/columns/september-week-${name}.json`, import.meta.url), "utf8")));
  }
  const astra = await readFile(new URL("../app/columns/astra-september-data.ts", import.meta.url), "utf8");
  records.push(new Function(stripTypeScriptTypes(astra.replace(/^import type[^\n]+\n/, "")).replace("export const", "const") + ";return astraSeptemberRecord;")());
  for (const [i, article] of articles.entries()) {
    assert.equal(article.publishAt, i === 0 ? "2026-09-06T10:42:00+08:00" : `2026-09-${String(7 + i).padStart(2, "0")}T09:30:00+08:00`);
    const record = records.find(x => x.slug === article.slug);
    assert.ok(record, article.slug);
    assert.ok(record.sources.length >= 3);
    await readFile(new URL("../public" + article.image, import.meta.url));
    for (const lang of ["zh", "en"]) {
      const copy = record[lang];
      const narrative = [...copy.opening, ...copy.sections.flatMap(x => x.paragraphs), copy.conclusion].join(" ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
      const length = lang === "zh" ? (narrative.match(/\p{Script=Han}/gu) || []).length : (narrative.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
      assert.ok(length >= (lang === "zh" ? 4000 : 2200), `${article.slug} ${lang}: ${length}`);
      assert.ok(copy.sections.length >= 5);
      assert.doesNotMatch(narrative, /not-determined|blocked|编辑台账|付费媒体并保留访问限制/);
    }
  }
});

test("immediate HF publication and timed September releases open across all discovery surfaces", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse("2026-09-07T09:29:59+08:00") });
  for (const [i, article] of articles.entries()) {
    t.mock.timers.setTime(Date.parse(article.publishAt) - 1000);
    for (const prefix of ["", "/en"]) {
      const response = await render(prefix + "/columns/" + article.slug);
      assert.equal(response.status, 404, `future route ${prefix}/${article.slug}`);
    }
    for (const path of ["/feed.xml", "/en/feed.xml", "/sitemap.xml", "/llms.txt", "/en/llms.txt"]) {
      const response = await render(path);
      assert.equal(response.status, 200, path);
      assert.ok(!(await response.text()).includes(article.slug), "early discovery leak " + path);
    }
    t.mock.timers.setTime(Date.parse(article.publishAt));
    for (const prefix of ["", "/en"]) {
      const response = await render(prefix + "/columns/" + article.slug);
      assert.equal(response.status, 200, `published route ${prefix}/${article.slug}`);
      const html = await response.text();
      assert.match(html, /AnalysisNewsArticle/);
      assert.ok(html.includes(article.publishAt));
      const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      assert.doesNotMatch(visibleHtml, /\]\(https:\/\//, "unrendered source Markdown");
      const home = await render(prefix || "/");
      const homeHtml = (await home.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      assert.ok(homeHtml.includes(article.slug), "homepage selection " + article.slug);
      if (i < articles.length - 1) assert.ok(!homeHtml.includes(articles[i + 1].slug), "future homepage leak");
    }
    for (const path of ["/feed.xml", "/en/feed.xml", "/sitemap.xml", "/llms.txt", "/en/llms.txt"]) {
      const response = await render(path);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(article.slug), "missing published discovery " + path);
    }
  }
  t.mock.timers.reset();
});

test("company research links respect the same publication boundary", async t => {
  t.mock.timers.enable({ apis: ["Date"], now: Date.parse("2026-09-06T12:00:00+08:00") });
  const companies = ["nvidia", "broadcom", "anthropic", "ciena", "openai"];
  for (const [i, article] of articles.entries()) {
    t.mock.timers.setTime(Date.parse(article.publishAt) - 1000);
    const before = await render("/companies/" + companies[i]);
    assert.equal(before.status, 200);
    assert.ok(!(await before.text()).includes('href="/columns/' + article.slug + '"'), "future company research link");
    t.mock.timers.setTime(Date.parse(article.publishAt));
    for (const prefix of ["", "/en"]) {
      const after = await render(prefix + "/companies/" + companies[i]);
      assert.equal(after.status, 200);
      assert.ok((await after.text()).includes(article.slug), "missing company research link");
    }
  }
  t.mock.timers.reset();
});
