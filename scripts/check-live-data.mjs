import { readFile } from "node:fs/promises";

const publishedIntelligence = JSON.parse(await readFile(new URL("../app/data/public-intelligence.json", import.meta.url), "utf8"));
const withdrawn = JSON.parse(await readFile(new URL("../app/data/withdrawn-intelligence.json", import.meta.url), "utf8"));
const endpoint = "https://idc-index.com/api/atlas-live-v5?schema=v1&deploy_check=";
const pulsePage = "https://idc-index.com/pulse?deploy_check=";
const expectedPulseMarkers = (process.env.ATLAS_EXPECTED_PULSE_CSS_MARKERS ?? "").split("|").map((value) => value.trim()).filter(Boolean);
const minimumPulseCount = Number(process.env.ATLAS_MIN_PULSE_COUNT ?? "0");
const minimumListedCount = Number(process.env.ATLAS_MIN_LISTED_COUNT ?? "0");
let lastError = null;

for (let attempt = 0; attempt < 4; attempt += 1) {
  try {
    const response = await fetch(`${endpoint}${Date.now()}-${attempt}`, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.newsStatus !== "ok" || payload.benchmarkStatus !== "ok") throw new Error(`core sources: news=${payload.newsStatus} benchmark=${payload.benchmarkStatus}`);
    if (!payload.generatedAt || !Array.isArray(payload.news) || !Array.isArray(payload.benchmarks)) throw new Error("invalid payload shape");
    if (!payload.contentReviewedAt || !payload.sectionFreshness) throw new Error("content freshness metadata missing");
    if (!Array.isArray(payload.rumors)) throw new Error("intelligence archive missing");
    if (payload.rumors.some(item => withdrawn.some(entry => entry.id === item.id))) throw new Error("withdrawn intelligence reappeared in public API");
    for (const expected of publishedIntelligence) {
      const actual = payload.rumors.find((item) => item.id === expected.id);
      if (!actual) throw new Error(`published intelligence missing: ${expected.id}`);
      for (const field of ["title", "titleEn", "summary", "summaryEn", "sourceUrl", "publishedAt", "status", "eventKey", "impactLevel"]) {
        if (actual[field] !== expected[field]) throw new Error(`published intelligence mismatch: ${expected.id}.${field}`);
      }
    }
    const requiredSections = ["idcPulse", "listedCompanyNews", "mnaDeals", "capacityRadar", "coolingProgress"];
    for (const section of requiredSections) {
      if (!Array.isArray(payload[section]) || payload[section].length === 0) throw new Error(`${section} is empty`);
      const freshness = payload.sectionFreshness[section];
      if (!freshness || freshness.count !== payload[section].length || freshness.status === "stale") {
        throw new Error(`${section} freshness invalid: ${freshness?.status ?? "missing"}`);
      }
    }
    if (payload.idcPulse.length < minimumPulseCount) throw new Error(`idcPulse count regressed: ${payload.idcPulse.length} < ${minimumPulseCount}`);
    if (payload.listedCompanyNews.length < minimumListedCount) throw new Error(`listedCompanyNews count regressed: ${payload.listedCompanyNews.length} < ${minimumListedCount}`);
    if (payload.benchmarks.length === 0) throw new Error("benchmarks is empty");
    if (expectedPulseMarkers.length) {
      const pulseResponse = await fetch(`${pulsePage}${Date.now()}-${attempt}`, { headers: { Accept: "text/html" }, cache: "no-store" });
      if (!pulseResponse.ok) throw new Error(`Pulse page HTTP ${pulseResponse.status}`);
      const pulseHtml = await pulseResponse.text();
      const stylesheet = pulseHtml.match(/href="(\/assets\/index-[^"]+\.css)"/i)?.[1];
      if (!stylesheet) throw new Error("Pulse stylesheet link missing");
      const stylesheetResponse = await fetch(new URL(stylesheet, pulseResponse.url), { headers: { Accept: "text/css" }, cache: "no-store" });
      if (!stylesheetResponse.ok) throw new Error(`Pulse stylesheet HTTP ${stylesheetResponse.status}`);
      const stylesheetCss = await stylesheetResponse.text();
      for (const marker of expectedPulseMarkers) {
        if (!stylesheetCss.includes(marker)) throw new Error(`Pulse editorial UI marker missing: ${marker}`);
      }
    }
    const sectionSummary = requiredSections.map((section) => `${section}=${payload[section].length}/${payload.sectionFreshness[section].status}`).join(" · ");
    console.log(`Live data and Pulse UI check passed: ${payload.generatedAt} · reviewed=${payload.contentReviewedAt} · ${sectionSummary} · news=${payload.news.length} · benchmarks=${payload.benchmarks.length} · intelligence=${payload.rumors.length}/${publishedIntelligence.length} adapter records verified`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
}

console.error(`Live data check failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
process.exit(1);
