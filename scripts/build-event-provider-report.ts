import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deterministicShadowProvider, providerDecision, recordedResponseProvider, recordedTranslationAdapter } from "../worker/event-intelligence/provider-contract.ts";

const outputUrl = new URL("../artifacts/event-intelligence/provider-decision.json", import.meta.url);
const providers = [deterministicShadowProvider, recordedResponseProvider].map((provider) => ({
  id: provider.id,
  kind: provider.kind,
  model: provider.model,
  privacy: provider.privacy,
  cost: { modelCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0 },
  latency: { p50Ms: 0, p95Ms: 0, status: "not-network-measured" },
}));
const output = {
  schemaVersion: "atlas-event-provider-decision.v1",
  generatedAt: new Date().toISOString(),
  status: "external-decision-required",
  providerDecision,
  selectedLocalAdapters: {
    analysis: deterministicShadowProvider.id,
    recordedAnalysis: recordedResponseProvider.id,
    translation: recordedTranslationAdapter.id,
  },
  providers,
  externalProvider: {
    selected: false,
    model: null,
    promptHash: null,
    privacyReview: "pending explicit user/provider choice",
    retentionReview: "pending explicit user/provider choice",
    costReview: "pending explicit user/provider choice",
    latencyReview: "pending live provider choice",
  },
  fallback: "When no recorded bilingual pair exists, keep source-only or pending internally; do not silently call an external provider.",
  productionTouched: false,
  writeScope: "local artifact only; no model provider request and no production write",
};
const outputPath = fileURLToPath(outputUrl);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, status: output.status, selectedLocalAdapters: output.selectedLocalAdapters }, null, 2));
