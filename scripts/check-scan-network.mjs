import "./node-transport.mjs";
import { pathToFileURL } from "node:url";

export async function checkScanNetwork(request = fetch) {
  const results = await Promise.all([
    "https://idc-index.com/robots.txt",
    "https://nvidianews.nvidia.com/releases.xml",
  ].map(async (url) => {
    try {
      const response = await request(url, { signal: AbortSignal.timeout(10000) });
      await response.body?.cancel();
      // Even a 403 proves transport works; source-specific access remains a connector concern.
      return { url, reachable: true, status: response.status };
    } catch (error) {
      return { url, reachable: false, error: error.message, code: error.cause?.code ?? error.code ?? null };
    }
  }));
  return { ok: results.some((item) => item.reachable), checkedAt: new Date().toISOString(), results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await checkScanNetwork();
  console.log(JSON.stringify(report));
  if (!report.ok) {
    console.error("SCAN_NETWORK_UNAVAILABLE: No source request has succeeded. Check execution sandbox/network permission separately from host proxy/DNS. Use the platform approval mechanism when permitted; do not bypass a denial. Preserve prior scan data and resume only after a real source request succeeds. This is not verified-no-change.");
    process.exitCode = 2;
  }
}
