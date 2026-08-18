import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { canonicalRunKey, codexRunKey, type CodexEventSlot, validateCodexIngestReport } from "../worker/event-intelligence/codex-ingest.ts";
import { shadowSources } from "../worker/connectors/index.ts";
import type { ShadowRunReport } from "../worker/event-intelligence/pipeline.ts";

function arg(name: string): string | null {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : null;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function slotArg(): CodexEventSlot {
  const slot = arg("slot");
  if (slot === "event-night" || slot === "event-midday" || slot === "event-day") return slot;
  throw new Error("--slot 必须是 event-night、event-midday 或 event-day。");
}

async function putRemote(key: string, path: string): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn("npm", ["exec", "--", "wrangler", "kv", "key", "put", key, "--binding", "IDC_DAILY_SNAPSHOTS", "--path", path, "--remote"], {
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`wrangler KV 写入 ${key} 失败，退出码 ${code ?? "unknown"}。`)));
  });
}

async function run() {
  const slot = slotArg();
  const input = resolve(arg("input") ?? "artifacts/event-intelligence/latest-run.json");
  const raw = await readFile(input, "utf8");
  const report = JSON.parse(raw) as ShadowRunReport & { inputMode?: string; executionMode?: string };
  if (report.inputMode !== "live") throw new Error("只有 live 输入生成的 Codex 抓取包可以进入远端 ingestion。");
  if (report.executionMode !== "codex-local") throw new Error("抓取包缺少 codex-local 执行标记。");
  const validation = validateCodexIngestReport(report, shadowSources(), arg("day") ?? undefined);
  const keys = [
    codexRunKey(slot, validation.day),
    canonicalRunKey(slot, validation.day),
    "event-intelligence:latest-run",
  ];
  if (!hasFlag("remote")) {
    console.log(JSON.stringify({ message: "Codex ingestion validation passed; remote write not requested", input, slot, keys, ...validation }));
    return;
  }

  const temporary = await mkdtemp(join(tmpdir(), "idc-atlas-codex-ingest-"));
  try {
    const markerPath = join(temporary, "marker.json");
    await writeFile(markerPath, `${JSON.stringify({
      schemaVersion: "atlas-codex-ingest.v1",
      ingestedAt: new Date().toISOString(),
      generatedAt: report.generatedAt,
      day: validation.day,
      slot,
      sourceCount: validation.sourceCount,
      passingSourceCount: validation.passingSourceCount,
      successRate: validation.successRate,
      reportKey: canonicalRunKey(slot, validation.day),
    })}\n`);
    for (const key of keys) await putRemote(key, input);
    await putRemote("event-intelligence:codex-ingest:latest", markerPath);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
  console.log(JSON.stringify({ message: "Codex event run ingested into Cloudflare KV", input, slot, keys, ...validation }));
}

void run();
