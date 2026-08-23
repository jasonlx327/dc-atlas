const requestBase = (process.env.SEO_BASE_URL ?? "http://localhost:3107").replace(/\/$/, "");
const canonicalBase = "https://idc-index.com";
const routes = ["/", "/en", "/columns", "/en/columns", "/companies", "/en/companies", "/companies/nvidia", "/en/companies/nvidia"];
const failures = [];

function matches(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function expectedCanonical(pathname) {
  return pathname === "/" ? `${canonicalBase}/` : `${canonicalBase}${pathname}`;
}

async function htmlFor(pathname) {
  const response = await fetch(`${requestBase}${pathname}`, { redirect: "follow", headers: { "user-agent": "IDC-Atlas-SEO-QA/1.0" } });
  if (!response.ok) failures.push(`${pathname}: HTTP ${response.status}`);
  return response.text();
}

for (const pathname of routes) {
  const html = await htmlFor(pathname);
  const title = matches(html, /<title>([^<]+)<\/title>/i);
  const description = matches(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    || matches(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const canonical = matches(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || matches(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (title.length < 12) failures.push(`${pathname}: missing or weak title`);
  if (description.length < 30) failures.push(`${pathname}: missing or weak description`);
  const canonicalUrl = canonical ? new URL(canonical, requestBase) : null;
  const requiresProductionHost = requestBase === canonicalBase;
  if (!canonicalUrl || canonicalUrl.pathname !== new URL(expectedCanonical(pathname)).pathname || (requiresProductionHost && canonicalUrl.origin !== canonicalBase)) failures.push(`${pathname}: canonical ${canonical || "missing"}`);
  for (const language of ["zh-CN", "en", "x-default"]) {
    const hreflang = new RegExp(`<link[^>]+hreflang=["']${language}["'][^>]+href=["'][^"']+["']`, "i");
    const reverse = new RegExp(`<link[^>]+href=["'][^"']+["'][^>]+hreflang=["']${language}["']`, "i");
    if (!hreflang.test(html) && !reverse.test(html)) failures.push(`${pathname}: missing hreflang ${language}`);
  }
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) failures.push(`${pathname}: unexpected noindex`);
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!jsonLdBlocks.length) failures.push(`${pathname}: missing JSON-LD`);
  for (const [, body] of jsonLdBlocks) {
    try { JSON.parse(body.replaceAll("&quot;", '"').replaceAll("&amp;", "&")); }
    catch { failures.push(`${pathname}: invalid JSON-LD`); }
  }
}

const robots = await (await fetch(`${requestBase}/robots.txt`)).text();
for (const token of ["Sitemap: https://idc-index.com/sitemap.xml", "OAI-SearchBot", "GPTBot", "ClaudeBot"]) {
  if (!robots.includes(token)) failures.push(`/robots.txt: missing ${token}`);
}

const sitemapResponse = await fetch(`${requestBase}/sitemap.xml`);
if (!sitemapResponse.ok) failures.push(`/sitemap.xml: HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(locations).size !== locations.length) failures.push("/sitemap.xml: duplicate URLs");
for (const pathname of routes) {
  if (!locations.includes(expectedCanonical(pathname))) failures.push(`/sitemap.xml: missing ${pathname}`);
}

for (const pathname of ["/llms.txt", "/en/llms.txt"]) {
  const response = await fetch(`${requestBase}${pathname}`);
  const body = await response.text();
  if (!response.ok) failures.push(`${pathname}: HTTP ${response.status}`);
  for (const token of ["methodology", "companies", "columns"]) {
    if (!body.toLowerCase().includes(token)) failures.push(`${pathname}: missing ${token}`);
  }
}

if (process.env.SEO_CRAWL_ALL === "1") {
  const results = await Promise.all(locations.map(async (url) => {
    const pathname = new URL(url).pathname;
    const response = await fetch(`${requestBase}${pathname}`, { redirect: "manual", headers: { "user-agent": "IDC-Atlas-SEO-QA/1.0" } });
    return { pathname, status: response.status };
  }));
  results.filter(({ status }) => status < 200 || status >= 400).forEach(({ pathname, status }) => failures.push(`${pathname}: crawl HTTP ${status}`));
}

if (failures.length) {
  console.error(`SEO/GEO QA failed (${failures.length})\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, base: requestBase, checkedRoutes: routes.length, sitemapUrls: locations.length, fullCrawl: process.env.SEO_CRAWL_ALL === "1" }, null, 2));
