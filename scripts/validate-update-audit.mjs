import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function coverageErrors(ledger) {
  const errors = [];
  for (const item of ledger.companies ?? ledger.checks ?? []) {
    if (!["no-change", "verified-no-change"].includes(item.result)) continue;
    const evidence = item.reviewEvidence;
    if (!evidence || !Array.isArray(evidence.reviewedSourceUrls) || !evidence.reviewedSourceUrls.length
      || !evidence.reviewedSourceUrls.every(url => /^https?:\/\//.test(url))
      || !Number.isFinite(Date.parse(evidence.windowStart)) || !Number.isFinite(Date.parse(evidence.windowEnd))
      || Date.parse(evidence.windowStart) >= Date.parse(evidence.windowEnd)
      || !Number.isFinite(Date.parse(evidence.checkedAt)) || !evidence.conclusion?.trim()) {
      errors.push(`${item.id}: no-change requires reviewed source content and a bounded window; HTTP probes are insufficient`);
    }
  }
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const paths = process.argv.slice(2);
  if (!paths.length) throw new Error("Provide this run's core-company and overlay ledger JSON paths.");
  const errors = [];
  for (const path of paths) errors.push(...coverageErrors(JSON.parse(await readFile(path, "utf8"))).map(error => `${path}: ${error}`));
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(JSON.stringify({ status: "passed", ledgers: paths.length }));
}
