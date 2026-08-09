import assert from "node:assert/strict";
import { deterministicShadowProvider, recordedTranslationAdapter, validateBilingualPair } from "../worker/event-intelligence/provider-contract.ts";

const recorded = recordedTranslationAdapter.translateTitle({ sourceLanguage: "zh-CN", targetLanguage: "en-US", sourceText: "源标题", recordedText: "Recorded title" });
assert.deepEqual(recorded, { status: "complete", text: "Recorded title", provenance: "recorded" });
assert.equal(recordedTranslationAdapter.translateSummary({ sourceLanguage: "zh-CN", targetLanguage: "en-US", sourceText: "源摘要" }).status, "source-only");
assert.deepEqual(recordedTranslationAdapter.protectNumerics("NVIDIA 200 MW / 2 GW"), ["200mw", "2gw"]);
assert.ok(recordedTranslationAdapter.protectEntities("NVIDIA deploys an AI GPU", ["NVIDIA"]).includes("NVIDIA"));

assert.equal(validateBilingualPair({ titleZh: "NVIDIA 200MW", titleEn: "NVIDIA 200MW", summaryZh: "AI capacity 2GW in 2027", summaryEn: "AI capacity 2GW in 2027", entities: ["NVIDIA"] }).status, "pass");
assert.equal(validateBilingualPair({ titleZh: "NVIDIA 200MW", titleEn: "NVIDIA 300MW", summaryZh: "AI capacity 2GW", summaryEn: "AI capacity 2GW", entities: ["NVIDIA"] }).status, "fail");
assert.equal(validateBilingualPair({ titleZh: "NVIDIA 200MW", titleEn: "AMD 200MW", summaryZh: "AI capacity 2GW", summaryEn: "AI capacity 2GW", entities: ["NVIDIA"] }).status, "fail");
const deterministic = await deterministicShadowProvider.analyze({ title: "title", summary: "summary" });
assert.deepEqual(deterministic, { status: "deterministic", modelCalls: 0, estimatedUsd: 0 });
console.log(JSON.stringify({ message: "Event provider contract tests passed", provider: deterministicShadowProvider.id, modelCalls: deterministic.modelCalls }));
