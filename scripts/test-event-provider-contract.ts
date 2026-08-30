import assert from "node:assert/strict";
import { deterministicShadowProvider, recordedTranslationAdapter, validateBilingualPair } from "../worker/event-intelligence/provider-contract.ts";

const recorded = recordedTranslationAdapter.translateTitle({ sourceLanguage: "zh-CN", targetLanguage: "en-US", sourceText: "源标题", recordedText: "Recorded title" });
assert.deepEqual(recorded, { status: "complete", text: "Recorded title", provenance: "recorded" });
assert.equal(recordedTranslationAdapter.translateSummary({ sourceLanguage: "zh-CN", targetLanguage: "en-US", sourceText: "源摘要" }).status, "source-only");
assert.deepEqual(recordedTranslationAdapter.protectNumerics("NVIDIA 200 MW / 2 GW"), ["200mw", "2gw"]);
assert.ok(recordedTranslationAdapter.protectEntities("NVIDIA deploys an AI GPU", ["NVIDIA"]).includes("NVIDIA"));

assert.equal(validateBilingualPair({ titleZh: "NVIDIA 建设 200MW 园区", titleEn: "NVIDIA builds a 200MW campus", summaryZh: "AI 容量将在 2027 年达到 2GW", summaryEn: "AI capacity will reach 2GW in 2027", entities: ["NVIDIA"] }).status, "pass");
assert.equal(validateBilingualPair({ titleZh: "NVIDIA 建设 200MW 园区", titleEn: "NVIDIA builds a 300MW campus", summaryZh: "AI 容量为 2GW", summaryEn: "AI capacity is 2GW", entities: ["NVIDIA"] }).status, "fail");
assert.equal(validateBilingualPair({ titleZh: "NVIDIA 建设 200MW 园区", titleEn: "AMD builds a 200MW campus", summaryZh: "AI 容量为 2GW", summaryEn: "AI capacity is 2GW", entities: ["NVIDIA"] }).status, "fail");
assert.equal(validateBilingualPair({ titleZh: "NVIDIA builds a 200MW campus", titleEn: "NVIDIA builds a 200MW campus", summaryZh: "AI capacity is 2GW", summaryEn: "AI capacity is 2GW", entities: ["NVIDIA"] }).status, "fail", "mirrored source-language copy must not pass as bilingual");
const deterministic = await deterministicShadowProvider.analyze({ title: "title", summary: "summary" });
assert.deepEqual(deterministic, { status: "deterministic", modelCalls: 0, estimatedUsd: 0 });
console.log(JSON.stringify({ message: "Event provider contract tests passed", provider: deterministicShadowProvider.id, modelCalls: deterministic.modelCalls }));
