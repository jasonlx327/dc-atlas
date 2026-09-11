import "./node-transport.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { fetchRegisteredSource, sourceRegistry } from "../worker/connectors/index.ts";
import { runShadowPipeline } from "../worker/event-intelligence/pipeline.ts";
const ids = ["semi-analysis", "serve-the-home", "blocks-and-files", "coherent-ir", "nvidia-developer", "sk-hynix-newsroom", "openai-news", "google-ai-blog", "data-center-dynamics", "utility-dive", "power-magazine", "google-news-cn-infrastructure"];
const sources = ids.map(id => { const source = sourceRegistry.find(s => s.id === id); if (!source) throw new Error(`Unknown source ${id}`); return source; });
const results = [];
for (let i = 0; i < sources.length; i += 4) {
  results.push(...await Promise.all(sources.slice(i,i+4).map(source => fetchRegisteredSource(source, {signal: AbortSignal.timeout(20000)}))));
}
const report = await runShadowPipeline(results, sources, {strategyVersion:"recall-audit-v3"});
const recentCutoff = Date.parse(report.generatedAt) - 7*86400000;
const summary = { generatedAt:report.generatedAt, expectedSources:ids.length, checkedSources:results.length, healthy:results.filter(r=>r.status === "ok").length, recent7d:results.flatMap(r=>r.observations).filter(o=>o.publishedAt && Date.parse(o.publishedAt)>=recentCutoff && Date.parse(o.publishedAt)<=Date.parse(report.generatedAt)).length, stats:report.stats, outcomes:report.ingestionAudit?.reduce<Record<string,number>>((a,o)=>{a[o.outcome]=(a[o.outcome]??0)+1;return a;},{}), gaps:report.sourceHealth.filter(s=>!["ok","empty","not-modified"].includes(s.status)), scope:"Local audit only; no production publication or completeness claim" };
await mkdir("artifacts/clustering-upgrade",{recursive:true});
await writeFile("artifacts/clustering-upgrade/input-snapshot.json",JSON.stringify(results,null,2));
await writeFile("artifacts/clustering-upgrade/live-report.json",JSON.stringify(report,null,2));
await writeFile("artifacts/clustering-upgrade/summary.json",JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
