import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = process.cwd();
const cutoff = "2026-09-08T10:22:54.347+08:00";
const cutoffEnd = new Date().toISOString();
const userAgent = "IDC-Atlas/1.0 (+https://idc-index.com/)";

const clean = (s) => s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const allText = (e) => [e.titleZh, e.titleEn, e.summaryZh, e.summaryEn, ...(e.entities ?? [])].filter(Boolean).join(" ").toLowerCase();
const aliases = {
  nvidia: ["nvidia", "英伟达", "英伟达"], broadcom: ["broadcom", "博通"], marvell: ["marvell", "美满"], arista: ["arista"], coherent: ["coherent"], lumentum: ["lumentum"], credo: ["credo"], cerebras: ["cerebras"], celestica: ["celestica"], ciena: ["ciena"],
  innolight: ["中际旭创", "innolight"], gigalight: ["新易盛", "gigalight"], accelink: ["光迅科技", "accelink"], tfc: ["天孚通信", "tfc"], yjphotonics: ["源杰科技", "yjphotonics"], sjphoton: ["仕佳光子", "sjphoton"], cigtech: ["剑桥科技", "cigtech"], takfly: ["太辰光", "takfly"], bktel: ["博创科技", "bktel"], hgtech: ["华工科技", "hgtech"],
  cambricon: ["寒武纪", "cambricon", "688256"], hygon: ["海光信息", "hygon", "688041"], loongson: ["龙芯中科", "loongson", "688047"], "jingjia-micro": ["景嘉微", "jingjia", "300474"], "moore-threads": ["摩尔线程", "moore threads", "mthreads", "688795"], metax: ["沐曦", "metax", "688802"], biren: ["壁仞", "biren", "6082"]
};

async function probe(url) {
  const checkedAt = new Date().toISOString();
  const started = Date.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "User-Agent": userAgent } });
    const body = await response.text();
    const visible = clean(body);
    const blocked = /just a moment|access denied|captcha|forbidden/i.test(visible.slice(0, 1000));
    return { url, resolvedUrl: response.url, checkedAt, httpStatus: response.status, accessStatus: response.ok && !blocked ? "public" : "unavailable", durationMs: Date.now() - started, title: clean(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""), observedDates: [...new Set(visible.match(/2026[-/]0[89][-/]\d{2}/g) ?? [])].slice(0, 12) };
  } catch (error) {
    return { url, checkedAt, accessStatus: "unavailable", durationMs: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  }
}

async function probeMany(urls) {
  const out = [];
  for (const url of [...new Set(urls.filter(Boolean))]) out.push(await probe(url));
  return out;
}

const scan = JSON.parse(await readFile(`${root}/artifacts/event-intelligence/codex-event-night.json`, "utf8"));
const events = scan.events ?? [];
const currentHits = (id, name) => events.filter((e) => { const t = allText(e); return (aliases[id] ?? [id, name.toLowerCase()]).some((a) => t.includes(a.toLowerCase())); });

const coreTemplate = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-08-1630.core-company-checks.json`, "utf8"));
const coreCompanies = await Promise.all(coreTemplate.companies.map(async (company) => {
  const urls = [company.sourceCoverage?.officialUrl, ...(company.sourceCoverage?.probes ?? []).map((p) => p.url)];
  const probes = await probeMany(urls);
  const hits = currentHits(company.id, company.name);
  const publicCount = probes.filter((p) => p.accessStatus === "public").length;
  const result = hits.length ? "changed" : (publicCount && publicCount === probes.length ? "no-change" : "not-determined");
  return { ...company, lastCheckedAt: cutoffEnd, result, resultReason: hits.length ? "Current-window scan event matched this company; evidence remains source-tier scoped." : result === "no-change" ? "Official entrypoint probes were reachable and no current-window scan event matched; issuer-specific disclosure completeness is still not proven." : "Official entrypoint coverage was incomplete; no-change cannot be asserted.", sourceCoverage: { expectedSourceIds: company.sourceIds.length ? company.sourceIds : ["official-ir-entrypoint"], checkedSourceIds: urls.map(() => "official-ir-entrypoint"), passingSourceIds: publicCount ? ["official-ir-entrypoint"] : [], failedSourceIds: publicCount === probes.length ? [] : ["official-ir-entrypoint"], officialUrl: company.sourceCoverage?.officialUrl ?? urls[0], officialHttpStatus: probes.find((p) => p.url === (company.sourceCoverage?.officialUrl ?? urls[0]))?.httpStatus ?? null, accessStatus: publicCount === probes.length ? "public" : "partial-or-unavailable", accessGaps: probes.filter((p) => p.accessStatus !== "public").map((p) => `${p.url}: ${p.error ?? p.httpStatus ?? "unavailable"}`), probes }, eventsInLatestRun: hits.length, latestEventId: hits.at(-1)?.id ?? null, latestEventTitle: hits.at(-1)?.titleZh ?? hits.at(-1)?.titleEn ?? null, latestEventAt: hits.at(-1)?.lastUpdatedAt ?? null };
}));
await mkdir(`${root}/docs/daily-reviews`, { recursive: true });
await writeFile(`${root}/docs/daily-reviews/2026-09-11-0930.core-company-checks.json`, `${JSON.stringify({ schemaVersion: "atlas-core-company-checks.v1", runId: "atlas-2026-09-11-full", generatedAt: cutoffEnd, cutoff, cutoffEnd, companyCount: 50, checkedCount: coreCompanies.length, hitCount: coreCompanies.filter((x) => x.result === "changed").length, results: { "new/changed": coreCompanies.filter((x) => x.result === "changed").length, "no-change": coreCompanies.filter((x) => x.result === "no-change").length, "not-determined": coreCompanies.filter((x) => x.result === "not-determined").length }, accessStatus: "fresh-official-entrypoint-probes", companies: coreCompanies }, null, 2)}\n`);

const xpuTemplate = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-08-1630.china-xpu-listed-checks.json`, "utf8"));
const requiredChecks = xpuTemplate.checks?.[0]?.requiredChecks ?? [];
const xpuChecks = await Promise.all(xpuTemplate.checks.map(async (issuer) => {
  const urls = [issuer.sourceCoverage?.issuerIr?.url, ...(issuer.sourceCoverage?.exchange ?? []).map((p) => p.url)];
  const probes = await probeMany(urls);
  const hits = currentHits(issuer.id, issuer.name);
  return { id: issuer.id, name: issuer.name, ticker: issuer.ticker, exchange: issuer.exchange, lastCheckedAt: cutoffEnd, result: "not-determined", resultReason: hits.length ? "Current-window scan event matched the issuer, but issuer-specific announcement and field reconciliation remain incomplete." : "Issuer and exchange entrypoints were attempted, but issuer-specific announcement completeness and field reconciliation were not sufficient to establish no-change.", sourceCoverage: { attemptedSourceClasses: requiredChecks, issuerIr: probes.find((p) => p.url === issuer.sourceCoverage?.issuerIr?.url) ?? probes[0] ?? null, exchange: probes.filter((p) => p.url !== issuer.sourceCoverage?.issuerIr?.url), accessStatus: probes.length && probes.every((p) => p.accessStatus === "public") ? "public-entrypoints" : "partial-or-unavailable", accessGaps: probes.filter((p) => p.accessStatus !== "public").map((p) => `${p.url}: ${p.error ?? p.httpStatus ?? "unavailable"}`), coverageLevel: "fresh entrypoint read; issuer-specific announcement completeness not proven" }, eventIds: hits.map((e) => e.id), announcementUrls: [], disclosedFields: [], requiredChecks };
}));
await writeFile(`${root}/docs/daily-reviews/2026-09-11-0930.china-xpu-listed-checks.json`, `${JSON.stringify({ schemaVersion: "atlas-china-xpu-listed-checks.v1", runId: "atlas-2026-09-11-full", generatedAt: cutoffEnd, cutoff, cutoffEnd, cutoffBasis: "09:30 independent scan cutoff", issuerCount: 7, attemptedCount: xpuChecks.length, completedEvidenceChecks: 0, results: { "new/changed": 0, "no-change": 0, "not-determined": xpuChecks.length }, accessStatus: "fresh-issuer-and-exchange-entrypoint-check", accessGaps: xpuChecks.flatMap((x) => x.sourceCoverage.accessGaps), checks: xpuChecks }, null, 2)}\n`);

const cpoTemplate = JSON.parse(await readFile(`${root}/docs/daily-reviews/2026-09-08-0930.interconnect-cpo-checks.json`, "utf8"));
const cpoCompanies = await Promise.all(cpoTemplate.companies.map(async (company) => {
  const urls = [company.sourceCoverage?.officialUrl];
  const probes = await probeMany(urls);
  const hits = currentHits(company.id, company.name).filter((e) => /cpo|co-packaged optics|silicon photonics|optical engine|els|ocs|npo|lpo|pluggable|800g|1\.6t|3\.2t|aec|acc|retimer|switch asic|supernic|dpu|scale-up|scale-out|scale-across|rack-scale|光模块|光互联|硅光|共封装/i.test(allText(e)));
  const publicOk = probes.length > 0 && probes.every((p) => p.accessStatus === "public");
  const result = hits.length ? "new/changed" : publicOk ? "no-change" : "not-determined";
  return { ...company, lastCheckedAt: cutoffEnd, result, resultReason: hits.length ? "Current-window scan event matched this company and the interconnect/CPO keyword set; source tier still controls publication." : result === "no-change" ? "Official entrypoint was reachable and no current-window interconnect/CPO event matched; detailed disclosure review remains bounded to the entrypoint." : "Official entrypoint unavailable; no-change cannot be asserted.", sourceCoverage: { attemptedSourceClasses: ["official newsroom/product pages", "exchange/IR and complete earnings/call materials", "SEC/exchange/standards or partner original"], accessStatus: publicOk ? "public" : "unavailable", officialUrl: urls[0] ?? null, officialHttpStatus: probes[0]?.httpStatus ?? null, accessGaps: probes.filter((p) => p.accessStatus !== "public").map((p) => `${p.url}: ${p.error ?? p.httpStatus ?? "unavailable"}`), probes }, eventIds: hits.map((e) => e.id), newDetails: [], sourceUrls: [] };
}));
await writeFile(`${root}/docs/daily-reviews/2026-09-11-0930.interconnect-cpo-checks.json`, `${JSON.stringify({ schemaVersion: "atlas-interconnect-cpo-checks.v1", runId: "atlas-2026-09-11-full", checkedAt: cutoffEnd, window: { from: cutoff, to: cutoffEnd, timeZone: "Asia/Shanghai", cutoffBasis: "current 09:30 run cutoff" }, requiredKeywords: cpoTemplate.requiredKeywords, companyCount: 20, checkedCount: cpoCompanies.length, hitCount: cpoCompanies.filter((x) => x.result === "new/changed").length, results: { "new/changed": cpoCompanies.filter((x) => x.result === "new/changed").length, "no-change": cpoCompanies.filter((x) => x.result === "no-change").length, "not-determined": cpoCompanies.filter((x) => x.result === "not-determined").length }, accessStatus: "fresh-official-entrypoint-check", accessGaps: cpoCompanies.flatMap((x) => x.sourceCoverage.accessGaps), companies: cpoCompanies }, null, 2)}\n`);

console.log(JSON.stringify({ core: { checked: coreCompanies.length, changed: coreCompanies.filter((x) => x.result === "changed").length, noChange: coreCompanies.filter((x) => x.result === "no-change").length, notDetermined: coreCompanies.filter((x) => x.result === "not-determined").length }, chinaXpu: { checked: xpuChecks.length, notDetermined: xpuChecks.length }, interconnectCpo: { checked: cpoCompanies.length, changed: cpoCompanies.filter((x) => x.result === "new/changed").length, noChange: cpoCompanies.filter((x) => x.result === "no-change").length, notDetermined: cpoCompanies.filter((x) => x.result === "not-determined").length } }));
