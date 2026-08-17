import assert from "node:assert/strict";
import {
  deepSeekSessionEnv,
  modelScoringStatus,
  modelMaterialBand,
  parseDeepSeekSessionCredentials,
  parseModelScorePayload,
  parseModelScoringInput,
  scoreWithOpenAiCompatible,
  semanticScore,
  type ModelScoringEnv,
} from "../worker/event-intelligence/model-scoring.ts";

const validPayload = {
  scores: {
    topicRelevanceScore: 5,
    mechanismDepthScore: 4,
    specificityScore: 4,
    researchValueScore: 3,
    readerValueScore: 4,
  },
  rationale: "该事件与数据中心基础设施直接相关，并包含可继续核验的容量信息。",
  reasonCodes: ["core-infrastructure", "specific-capacity"],
  publicCopy: {
    titleZh: "Firebird 规划建设 300MW AI 数据中心",
    titleEn: "Firebird plans a 300MW AI data center",
    summaryZh: "公司披露 300MW 规划容量。",
    summaryEn: "The company disclosed 300MW of planned capacity.",
  },
};

const parsed = parseModelScorePayload(validPayload);
assert.equal(parsed.scores.topicRelevanceScore, 5);
assert.equal(parsed.publicCopy?.titleEn, "Firebird plans a 300MW AI data center");
assert.equal(semanticScore(parsed.scores), 4.11);
const numericStringPayload = parseModelScorePayload({
  ...validPayload,
  scores: Object.fromEntries(Object.entries(validPayload.scores).map(([key, value]) => [key, String(value)])),
});
assert.equal(numericStringPayload.scores.mechanismDepthScore, 4);
assert.throws(() => parseModelScorePayload({ ...validPayload, scores: { ...validPayload.scores, readerValueScore: 6 } }), /0 到 5/);
assert.throws(() => parseModelScorePayload({ ...validPayload, scores: { ...validPayload.scores, readerValueScore: "4/5" } }), /0 到 5/);
assert.throws(() => parseModelScorePayload({ ...validPayload, reasonCodes: new Array(9).fill("too-many") }), /reasonCodes/);

const input = parseModelScoringInput({
  eventId: "event-firebird-armenia",
  title: "Firebird 在亚美尼亚启动 AI 工厂",
  summary: "项目披露 300MW 远期规划，当前规模仍未披露。",
  sourceTier: "T1",
  evidenceStatus: "reported",
  independentSourceCount: 2,
});
assert.equal(input.sourceTier, "T1");
assert.throws(() => parseModelScoringInput({ ...input, sourceTier: "T9" }), /sourceTier/);

const disabledEnv: ModelScoringEnv = {
  ATLAS_SCORING_ENABLED: "false",
  ATLAS_SCORING_BASE_URL: "https://api.openai.com/v1",
  ATLAS_SCORING_MODEL: "gpt-5-mini",
};
assert.deepEqual(modelScoringStatus(disabledEnv), {
  enabled: false,
  keyConfigured: false,
  ready: false,
  provider: "openai-compatible",
  baseUrlHost: "api.openai.com",
  model: "gpt-5-mini",
  timeoutMs: 20_000,
  dailyCallLimit: 20,
});
assert.throws(() => modelScoringStatus({ ...disabledEnv, ATLAS_SCORING_BASE_URL: "http://example.com/v1" }), /HTTPS/);

const deepSeekCredentials = parseDeepSeekSessionCredentials({ apiKey: "sk-session-key-for-testing-12345", model: "deepseek-v4-flash" });
assert.equal(deepSeekCredentials.model, "deepseek-v4-flash");
assert.throws(() => parseDeepSeekSessionCredentials({ apiKey: "bad", model: "deepseek-v4-flash" }), /API Key/);
assert.throws(() => parseDeepSeekSessionCredentials({ apiKey: "sk-session-key-for-testing-12345", model: "unknown" }), /模型/);
const deepSeekEnv = deepSeekSessionEnv(disabledEnv, deepSeekCredentials);
assert.equal(modelScoringStatus(deepSeekEnv).ready, true);
assert.equal(modelScoringStatus(deepSeekEnv).baseUrlHost, "api.deepseek.com");

const enabledEnv: ModelScoringEnv = {
  ...disabledEnv,
  ATLAS_SCORING_ENABLED: "true",
  ATLAS_SCORING_API_KEY: "test-secret",
};
let requestedUrl = "";
let authorization = "";
let requestedMessages: unknown = null;
const mockFetch = (async (request: RequestInfo | URL, init?: RequestInit) => {
  requestedUrl = String(request);
  authorization = new Headers(init?.headers).get("authorization") ?? "";
  requestedMessages = (JSON.parse(String(init?.body)) as Record<string, unknown>).messages;
  return Response.json({
    choices: [{ message: { content: JSON.stringify(validPayload) } }],
    usage: { prompt_tokens: 120, completion_tokens: 48, total_tokens: 168 },
  });
}) as typeof fetch;

const result = await scoreWithOpenAiCompatible(enabledEnv, input, mockFetch);
assert.equal(requestedUrl, "https://api.openai.com/v1/chat/completions");
assert.equal(authorization, "Bearer test-secret");
const messages = requestedMessages;
assert.ok(Array.isArray(messages));
assert.match(String((messages[0] as { content?: unknown }).content), /JSON number from 0 to 5/);
assert.match(String((messages[0] as { content?: unknown }).content), /recall-oriented standard/);
assert.match(String((messages[0] as { content?: unknown }).content), /publicCopy/);
assert.equal(result.mode, "shadow");
assert.equal(result.routeImpact, false);
assert.equal(result.semanticScore, 4.11);
const selectedResult = { ...result, scores: { ...result.scores, researchValueScore: 4 } };
assert.equal(modelMaterialBand(selectedResult), "selected");
assert.equal(result.usage.totalTokens, 168);

assert.equal(modelMaterialBand({ ...selectedResult, semanticScore: 3.6 }), "selected");
assert.equal(modelMaterialBand({ ...result, semanticScore: 3 }), "watch");
assert.equal(modelMaterialBand({ ...result, semanticScore: 2.5 }), "dropped");
assert.equal(modelMaterialBand({ ...result, semanticScore: 3 }, { sourceTier: "T1" }), "selected");
assert.equal(modelMaterialBand({ ...result, semanticScore: 3.2 }, { sourceTier: "T2", independentSourceCount: 2 }), "selected");

requestedUrl = "";
authorization = "";
const deepSeekResult = await scoreWithOpenAiCompatible(deepSeekEnv, input, mockFetch);
assert.equal(requestedUrl, "https://api.deepseek.com/chat/completions");
assert.equal(authorization, "Bearer sk-session-key-for-testing-12345");
assert.equal(deepSeekResult.model, "deepseek-v4-flash");

await assert.rejects(
  scoreWithOpenAiCompatible(enabledEnv, input, (async () => new Response("bad", { status: 429 })) as typeof fetch),
  /HTTP 429/,
);

console.log("model scoring tests passed");
