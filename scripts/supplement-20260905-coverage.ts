import { writeFile, mkdir } from "node:fs/promises";
import { CORE_COMPANY_WATCHLIST } from "../worker/event-intelligence/core-company-watchlist.ts";
import { shadowSources } from "../worker/connectors/index.ts";

const direct: Record<string, string> = {
  oracle: "https://www.oracle.com/news/",
  anthropic: "https://www.anthropic.com/news",
  alibaba: "https://www.alibabagroup.com/en-US/pressreleases",
  tencent: "https://www.tencent.com/en-us/articles.html",
  bytedance: "https://www.bytedance.com/en/news",
  tesla: "https://ir.tesla.com/",
  palantir: "https://investors.palantir.com/news-events/press-releases",
  salesforce: "https://www.salesforce.com/news/press-releases/",
  servicenow: "https://newsroom.servicenow.com/press-releases",
  snowflake: "https://investors.snowflake.com/news",
  baidu: "https://ir.baidu.com/news-releases",
  deepseek: "https://api-docs.deepseek.com/news/",
  mistral: "https://mistral.ai/news",
  perplexity: "https://www.perplexity.ai/hub",
  asml: "https://www.asml.com/en/news/press-releases",
  "applied-materials": "https://ir.appliedmaterials.com/news-releases",
  "lam-research": "https://newsroom.lamresearch.com/press-releases",
  broadcom: "https://investors.broadcom.com/news-releases",
  marvell: "https://www.marvell.com/company/newsroom.html",
  tsmc: "https://pr.tsmc.com/english/news",
  micron: "https://investors.micron.com/news-releases",
  arista: "https://www.arista.com/en/company/news/press-release",
  dell: "https://www.dell.com/en-us/dt/corporate/newsroom.htm",
  supermicro: "https://ir.supermicro.com/news/default.aspx",
  huawei: "https://www.huawei.com/en/news/",
  "digital-realty": "https://investor.digitalrealty.com/news/default.aspx",
  vertiv: "https://investors.vertiv.com/news/news-releases",
  "schneider-electric": "https://www.se.com/ww/en/about-us/newsroom/",
  eaton: "https://www.eaton.com/us/en-us/company/news-insights/news-releases.html",
  "ge-vernova": "https://www.gevernova.com/news/press-releases",
  terawulf: "https://investors.terawulf.com/news-events/press-releases",
  "riot-platforms": "https://www.riotplatforms.com/news-media/press-releases/",
  "applied-digital": "https://ir.applieddigital.com/news-events/press-releases",
  gds: "https://investors.gds-services.com/news-releases",
};
const sources = shadowSources();
const clean = (s: string) => s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const queue = [...CORE_COMPANY_WATCHLIST];
const checks: unknown[] = [];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const company = queue.shift()!;
    const urls = [...new Set([...sources.filter(s => company.sourceIds.includes(s.id)).map(s => s.endpoint.url), ...(direct[company.id] ? [direct[company.id]] : [])])];
    const coverage = [];
    for (const url of urls) {
      const checkedAt = new Date().toISOString();
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "IDC-Atlas/1.0 (+https://idc-index.com/)" } });
        const body = await response.text();
        const visible = clean(body);
        const links = [...body.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
          .map(m => ({ url: (() => { try { return new URL(m[1], response.url).href; } catch { return m[1]; } })(), title: clean(m[2]).slice(0, 220) }))
          .filter(x => x.title.length > 20 && /news|blog|2026|press|release/i.test(x.url)).slice(0, 60);
        const feedItems = [...body.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0, 30).map(m => ({ title: clean(m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""), publishedAt: clean(m[1].match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ?? ""), url: m[1].match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() }));
        coverage.push({ url, resolvedUrl: response.url, checkedAt, httpStatus: response.status, accessState: response.ok && !/just a moment|access denied|captcha/i.test(visible.slice(0, 600)) ? "public" : "unavailable", title: clean(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""), excerpt: visible.slice(0, 900), links, feedItems });
      } catch (error) { coverage.push({ url, checkedAt, accessState: "unavailable", error: String(error) }); }
    }
    checks.push({ ...company, lastCheckedAt: new Date().toISOString(), sourceCoverage: coverage, result: "not-determined", resultReason: "Source requests completed; semantic editorial review and archive completeness must be assessed separately." });
    console.log(JSON.stringify({ id: company.id, sources: coverage.map(c => ({ url: c.url, state: c.accessState })) }));
  }
}));
await mkdir("docs/daily-reviews", { recursive: true });
await writeFile("docs/daily-reviews/2026-09-05-1630.core-company-checks.json", JSON.stringify({ schemaVersion: "atlas-core-company-checks.v1", runId: "atlas-2026-09-05-full", generatedAt: new Date().toISOString(), cutoff: "2026-09-04T21:47:45+08:00", cutoffEnd: "2026-09-05T22:53:19+08:00", companies: checks }, null, 2));
