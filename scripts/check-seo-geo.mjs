import { writeFile } from "node:fs/promises";

const requestBase = (process.env.SEO_BASE_URL ?? "http://localhost:3107").replace(/\/$/, "");
const canonicalBase = "https://idc-index.com";
const coreRoutes = ["/", "/en", "/columns", "/en/columns", "/companies", "/en/companies", "/companies/nvidia", "/en/companies/nvidia"];
const fullCrawl = process.env.SEO_CRAWL_ALL !== "0";
const failures = [];
const results = [];
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const attribute = (tag, name) => decode(tag.match(new RegExp("\\b" + name + "=[\"']([^\"']*)[\"']", "i"))?.[1] ?? "");
const tags = (html, tag) => [...html.matchAll(new RegExp("<" + tag + "\\b[^>]*>", "gi"))].map((match) => match[0]);

async function request(pathname) {
  const response = await fetch(requestBase + pathname, {
    redirect: "manual",
    headers: { accept: "text/html", "user-agent": "IDC-Atlas-SEO-QA/2.0" },
    signal: AbortSignal.timeout(45000),
  });
  if (response.status !== 200) failures.push(pathname + ": HTTP " + response.status + " " + (response.headers.get("location") ?? ""));
  return response;
}

async function checkPage(pathname, canonicalPath = pathname) {
  const response = await request(pathname);
  const html = await response.text();
  const title = decode(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "");
  const links = tags(html, "link");
  const metas = tags(html, "meta");
  const meta = (name) => attribute(metas.find((tag) => attribute(tag, "name") === name || attribute(tag, "property") === name) ?? "", "content");
  const canonical = attribute(links.find((tag) => attribute(tag, "rel") === "canonical") ?? "", "href");
  const english = canonicalPath === "/en" || canonicalPath.startsWith("/en/");
  const language = attribute(tags(html, "html")[0] ?? "", "lang");
  const fail = (message) => failures.push(pathname + ": " + message);
  if (title.length < 12) fail("missing or weak title");
  if (meta("description").length < 30) fail("missing or weak description");
  if (canonical !== canonicalBase + canonicalPath) fail("canonical " + (canonical || "missing"));
  if (language !== (english ? "en" : "zh-CN")) fail("wrong document language " + language);
  if (tags(html, "h1").length !== 1) fail("expected one H1");
  const robotRules = [meta("robots"), meta("googlebot"), response.headers.get("x-robots-tag") ?? ""].join(",");
  if (/\b(noindex|none|nosnippet)\b/i.test(robotRules)) fail("indexing or snippets blocked");
  const alternatePaths = canonicalPath === "/calendar" ? null : {
    "zh-CN": english ? canonicalPath.slice(3) || "/" : canonicalPath,
    en: english ? canonicalPath : "/en" + (canonicalPath === "/" ? "" : canonicalPath),
    "x-default": english ? canonicalPath : "/en" + (canonicalPath === "/" ? "" : canonicalPath),
  };
  for (const [lang, target] of Object.entries(alternatePaths ?? {})) {
    const alternate = attribute(links.find((tag) => attribute(tag, "hreflang") === lang) ?? "", "href");
    if (alternate !== canonicalBase + target) fail("hreflang " + lang + " → " + (alternate || "missing"));
  }
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) fail("missing JSON-LD");
  const nodes = blocks.flatMap(([, body]) => {
    try { const value = JSON.parse(body); return value["@graph"] ?? [value]; }
    catch { fail("invalid JSON-LD"); return []; }
  });
  if (/^\/(en\/)?columns\/[^/]+$/.test(canonicalPath)) {
    const article = nodes.find((node) => /Article$/.test(node["@type"]));
    if (!article || article["@id"] !== canonical + "#article") fail("missing stable article identity");
    if (!article?.citation?.length) fail("missing article citations");
    if (!Number.isFinite(Date.parse(article?.datePublished)) || Date.parse(article.datePublished) > Date.now()) fail("invalid or future publication");
    if (article?.image !== meta("og:image") || article?.image !== meta("twitter:image")) fail("article/share image mismatch");
    if (!html.includes("column-reading-context")) fail("missing research context links");
    if (!/max-image-preview:large/i.test(robotRules)) fail("large cover previews not enabled");
  }
  results.push({ pathname, status: response.status, canonical, language, title });
}

const sitemap = await (await request("/sitemap.xml")).text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
if (!locations.length) failures.push("/sitemap.xml: empty URL list");
if (new Set(locations).size !== locations.length) failures.push("/sitemap.xml: duplicate URLs");
for (const pathname of coreRoutes) if (!locations.includes(canonicalBase + pathname)) failures.push("/sitemap.xml: missing " + pathname);
for (const url of locations) {
  const parsed = new URL(url);
  if (parsed.origin !== canonicalBase || parsed.search || parsed.hash) failures.push("/sitemap.xml: non-canonical URL " + url);
}
const routes = fullCrawl ? locations.map((url) => new URL(url).pathname) : coreRoutes;
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < routes.length) {
    const pathname = routes[next++];
    try { await checkPage(pathname); } catch (error) { failures.push(pathname + ": " + error.message); }
  }
}));

// Filter URLs stay usable but consolidate to their parent, not thin search pages.
for (const pathname of ["/pulse?signal=policy", "/en/pulse?signal=policy", "/industry?tab=chain&stage=compute", "/en/industry?tab=china", "/columns?company=nvidia", "/en/columns?topic=MEMORY%20WATCH"]) {
  await checkPage(pathname, pathname.split("?")[0]);
}
const robots = await (await request("/robots.txt")).text();
for (const token of ["Sitemap: https://idc-index.com/sitemap.xml", "OAI-SearchBot", "GPTBot", "ClaudeBot"]) {
  if (!robots.includes(token)) failures.push("/robots.txt: missing " + token);
}
for (const prefix of ["", "/en"]) {
  const text = await (await request(prefix + "/llms.txt")).text();
  for (const token of ["methodology", "companies", "columns"]) if (!text.includes(token)) failures.push(prefix + "/llms.txt: missing " + token);
  const feed = await (await request(prefix + "/feed.xml")).text();
  const research = locations.filter((url) => new URL(url).pathname.startsWith(prefix + "/columns/"));
  for (const url of research) {
    if (!text.includes(url)) failures.push(prefix + "/llms.txt: missing research " + url);
    if (!feed.includes("<link>" + url + "</link>")) failures.push(prefix + "/feed.xml: missing research " + url);
  }
}
const report = { ok: failures.length === 0, checkedAt: new Date().toISOString(), base: requestBase, checkedRoutes: results.length, sitemapUrls: locations.length, fullCrawl, failures, results };
if (process.env.SEO_REPORT_PATH) await writeFile(process.env.SEO_REPORT_PATH, JSON.stringify(report, null, 2));
if (failures.length) {
  console.error("SEO/GEO QA failed (" + failures.length + ")\n" + failures.map((item) => "- " + item).join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
