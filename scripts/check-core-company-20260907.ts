import { mkdir, writeFile } from "node:fs/promises";
import { CORE_COMPANY_WATCHLIST } from "../worker/event-intelligence/core-company-watchlist.ts";
import { shadowSources } from "../worker/connectors/index.ts";

const direct: Record<string, string> = {
  oracle: "https://www.oracle.com/news/", anthropic: "https://www.anthropic.com/news", alibaba: "https://www.alibabagroup.com/en-US/pressreleases", tencent: "https://www.tencent.com/en-us/articles.html", bytedance: "https://www.bytedance.com/en/news", tesla: "https://ir.tesla.com/", palantir: "https://investors.palantir.com/news-events/press-releases", salesforce: "https://www.salesforce.com/news/press-releases/", servicenow: "https://newsroom.servicenow.com/press-releases", snowflake: "https://investors.snowflake.com/news", baidu: "https://ir.baidu.com/news-releases", deepseek: "https://api-docs.deepseek.com/news/", mistral: "https://mistral.ai/news", perplexity: "https://www.perplexity.ai/hub", asml: "https://www.asml.com/en/news/press-releases", "applied-materials": "https://ir.appliedmaterials.com/news-releases", "lam-research": "https://newsroom.lamresearch.com/press-releases", broadcom: "https://investors.broadcom.com/news-releases", marvell: "https://www.marvell.com/company/newsroom.html", tsmc: "https://pr.tsmc.com/english/news", micron: "https://investors.micron.com/news-releases", arista: "https://www.arista.com/en/company/news/press-release", dell: "https://www.dell.com/en-us/dt/corporate/newsroom.htm", supermicro: "https://ir.supermicro.com/news/default.aspx", huawei: "https://www.huawei.com/en/news/", "digital-realty": "https://investor.digitalrealty.com/news/default.aspx", vertiv: "https://investors.vertiv.com/news/news-releases", "schneider-electric": "https://www.se.com/ww/en/about-us/newsroom/", eaton: "https://www.eaton.com/us/en-us/company/news-insights/news-releases.html", "ge-vernova": "https://www.gevernova.com/news/press-releases", terawulf: "https://investors.terawulf.com/news-events/press-releases", "riot-platforms": "https://www.riotplatforms.com/news-media/press-releases/", "applied-digital": "https://ir.applieddigital.com/news-events/press-releases", gds: "https://investors.gds-services.com/news-releases",
};

const clean = (s: string) => s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const sources = shadowSources();
const queue = [...CORE_COMPANY_WATCHLIST];
const checks: unknown[] = [];

await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const company = queue.shift()!;
    const urls = [...new Set([...sources.filter((source) => company.sourceIds.includes(source.id)).map((source) => source.endpoint.url), ...(direct[company.id] ? [direct[company.id]] : [])])];
    const sourceCoverage: unknown[] = [];
    for (const url of urls) {
      const checkedAt = new Date().toISOString();
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "IDC-Atlas/1.0 (+https://idc-index.com/)" } });
        const body = await response.text();
        const visible = clean(body);
        const dates = [...new Set(visible.match(/2026[-/]0[89][-/]\d{2}/g) ?? [])].slice(0, 12);
        sourceCoverage.push({ url, resolvedUrl: response.url, checkedAt, httpStatus: response.status, accessState: response.ok && !/just a moment|access denied|captcha/i.test(visible.slice(0, 600)) ? "public" : "unavailable", pageTitle: clean(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""), datesObserved: dates, status: "not-determined", note: "Current transport and index probe only; individual disclosures not fully reviewed." });
      } catch (error) {
        sourceCoverage.push({ url, checkedAt, accessState: "unavailable", error: error instanceof Error ? error.message : String(error), status: "not-determined" });
      }
    }
    checks.push({ id: company.id, name: company.name, layer: company.layer, regions: company.regions, sourceIds: company.sourceIds, lastCheckedAt: new Date().toISOString(), sourceCoverage, result: "not-determined", resultReason: "Source requests completed; semantic editorial review and archive completeness remain unresolved." });
    console.log(JSON.stringify({ id: company.id, sourceCount: sourceCoverage.length }));
  }
}));

await mkdir("docs/daily-reviews", { recursive: true });
await writeFile("docs/daily-reviews/2026-09-07-1630.core-company-checks.json", `${JSON.stringify({ schemaVersion: "atlas-core-company-checks.v1", runId: "atlas-2026-09-07-full", generatedAt: new Date().toISOString(), cutoff: "2026-09-06T20:11:01+08:00", cutoffEnd: new Date().toISOString(), companyCount: checks.length, companies: checks }, null, 2)}\n`);
