import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const wrangler = resolve("node_modules", ".bin", process.platform === "win32" ? "wrangler.cmd" : "wrangler");
const binding = "IDC_DAILY_SNAPSHOTS";
const keys = [
  "event-intelligence:core-company-watch:latest",
  "event-intelligence:daily-candidates:latest",
  "atlas-daily-update:closure:latest",
];

function run(args) {
  let last;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const result = spawnSync(wrangler, args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, timeout: 45_000 });
    if (result.status === 0) return result.stdout.trim();
    last = `${result.stderr || result.stdout || result.error?.message || "unknown error"}`.trim();
  }
  throw new Error(last || `wrangler ${args.join(" ")} failed`);
}

function summary(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(["schemaVersion", "generatedAt", "day", "status", "companyCount", "candidateCount"]
    .filter((key) => key in value)
    .map((key) => [key, value[key]]));
}

try {
  run(["whoami"]);
  const kv = {};
  for (const key of keys) {
    const raw = run(["kv", "key", "get", key, "--binding", binding, "--remote"]);
    kv[key] = summary(JSON.parse(raw));
  }
  console.log(JSON.stringify({ status: "ready", authenticated: true, binding, kv }));
} catch (error) {
  console.error(JSON.stringify({ status: "blocked", authenticated: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
}
