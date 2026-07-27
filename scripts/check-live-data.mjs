const endpoint = "https://idc-index.com/api/atlas-live-v5?schema=v1&deploy_check=";
let lastError = null;

for (let attempt = 0; attempt < 4; attempt += 1) {
  try {
    const response = await fetch(`${endpoint}${Date.now()}-${attempt}`, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.newsStatus !== "ok" || payload.benchmarkStatus !== "ok") throw new Error(`core sources: news=${payload.newsStatus} benchmark=${payload.benchmarkStatus}`);
    if (!payload.generatedAt || !Array.isArray(payload.news) || !Array.isArray(payload.benchmarks)) throw new Error("invalid payload shape");
    console.log(`Live data check passed: ${payload.generatedAt} · news=${payload.news.length} · benchmarks=${payload.benchmarks.length}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
}

console.error(`Live data check failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
process.exit(1);
