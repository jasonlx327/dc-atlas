import { mkdir, readFile, writeFile } from "node:fs/promises";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

const inputUrl = new URL("../artifacts/event-intelligence/latest-run.json", import.meta.url);
const outputUrl = new URL("../artifacts/event-intelligence/latest-run.html", import.meta.url);

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function badge(value: string): string {
  return `<span class="badge">${escapeHtml(value)}</span>`;
}

function render(report: ShadowRunReport & { inputMode?: string; shadowDbPath?: string; sourceRegistryCount?: number }): string {
  const eventRows = report.events.map((event) => `<tr>
    <td><strong>${escapeHtml(event.titleZh)}</strong><br><small>${escapeHtml(event.eventKey)}</small></td>
    <td>${badge(event.route ?? "hold")}</td>
    <td>${badge(event.evidenceStatus)}</td>
    <td>${escapeHtml(event.priorityScore ?? 0)}</td>
    <td>${escapeHtml(event.sourceChain.length)}<br><small>${escapeHtml(event.sourceTiers.join(", "))}</small></td>
  </tr>`).join("\n");
  const sourceRows = report.sourceHealth.map((source) => `<tr><td>${escapeHtml(source.sourceId)}</td><td>${escapeHtml(source.endpointId)}</td><td>${badge(source.status)}</td><td>${escapeHtml(source.observations)}</td><td>${escapeHtml(source.error ?? "")}</td></tr>`).join("\n");
  const cards = [
    ["Fetched", report.stats.fetched], ["Relevant", report.stats.relevant], ["Clusters", report.stats.clusters], ["Public eligible", report.stats.publicEligible], ["Failures", report.stats.errors], ["Model calls", report.cost.modelCalls],
  ].map(([label, value]) => `<div class="metric"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>IDC Atlas Event Intelligence Shadow Run</title><style>
  :root{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#17231e;background:#f3efe5}body{max-width:1180px;margin:0 auto;padding:32px}h1{margin-bottom:6px;color:#1d433a}p,small{color:#65736a;line-height:1.5}.metrics{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin:22px 0}.metric,section{background:#fffdf7;border:1px solid #dcd5c4;border-radius:12px;padding:14px}.metric strong{display:block;font-size:24px;margin-top:5px;color:#1d433a}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #e5dfd1;text-align:left;vertical-align:top;font-size:13px}.badge{display:inline-block;border:1px solid #c7d2c9;border-radius:999px;padding:2px 7px;background:#eff5ef;color:#1d433a;font-size:11px}.meta{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 24px}.meta span{border:1px solid #dcd5c4;border-radius:999px;padding:5px 9px;background:#fffdf7;font-size:12px}section{margin-top:16px;overflow:auto}@media(max-width:820px){body{padding:18px}.metrics{grid-template-columns:repeat(2,1fr)}}
  </style></head><body><h1>IDC Atlas 事件情报 Shadow Run</h1><p>Local-only report. It does not prove production D1, Worker, Site, or source-switch status.</p><div class="meta"><span>mode: ${escapeHtml(report.inputMode ?? "unknown")}</span><span>run: ${escapeHtml(report.generatedAt)}</span><span>strategy: ${escapeHtml(report.strategyVersion)}</span><span>freshness: ${escapeHtml(report.freshness)}</span><span>registry: ${escapeHtml(report.sourceRegistryCount ?? "")}</span></div><div class="metrics">${cards}</div><section><h2>Event stream</h2><table><thead><tr><th>Event</th><th>Route</th><th>Evidence</th><th>Priority</th><th>Sources</th></tr></thead><tbody>${eventRows}</tbody></table></section><section><h2>Source health</h2><table><thead><tr><th>Source</th><th>Endpoint</th><th>Status</th><th>Observations</th><th>Error</th></tr></thead><tbody>${sourceRows}</tbody></table></section><section><h2>Cost and storage</h2><p>${escapeHtml(report.cost.note)} Estimated USD: ${escapeHtml(report.cost.estimatedUsd)}. Shadow DB: ${escapeHtml(report.shadowDbPath ?? "not recorded")}.</p></section></body></html>`;
}

async function run() {
  const report = JSON.parse(await readFile(inputUrl, "utf8")) as ShadowRunReport & { inputMode?: string; shadowDbPath?: string; sourceRegistryCount?: number };
  await mkdir(new URL("../artifacts/event-intelligence/", import.meta.url), { recursive: true });
  await writeFile(outputUrl, render(report));
  console.log(JSON.stringify({ message: "Event intelligence HTML report rendered", output: outputUrl.pathname }));
}

void run();
