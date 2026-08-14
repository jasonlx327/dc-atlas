import assert from "node:assert/strict";
import {
  CORE_COMPANY_SOURCE_IDS,
  CORE_COMPANY_WATCHLIST,
  buildCoreCompanyWatchState,
  matchCoreCompanies,
} from "../worker/event-intelligence/core-company-watchlist.ts";

assert.equal(CORE_COMPANY_WATCHLIST.length, 50);
assert.equal(new Set(CORE_COMPANY_WATCHLIST.map((company) => company.id)).size, 50);
assert.deepEqual(new Set(CORE_COMPANY_WATCHLIST.map((company) => company.layer)), new Set([
  "demand-platform",
  "model-application",
  "compute-silicon",
  "capacity-power",
]));
assert.deepEqual(matchCoreCompanies(["微软 Azure 新增 AI capacity"]).map((company) => company.id), ["microsoft"]);
assert.deepEqual(matchCoreCompanies(["DeepSeek 发布新模型"]).map((company) => company.id), ["deepseek"]);
assert.deepEqual(matchCoreCompanies(["万国数据获得新订单"]).map((company) => company.id), ["gds"]);
assert.ok(CORE_COMPANY_SOURCE_IDS.includes("nvidia"));
assert.ok(CORE_COMPANY_SOURCE_IDS.includes("apple"));
const state = buildCoreCompanyWatchState([{
  id: "deepseek-model",
  titleZh: "DeepSeek 发布新模型",
  titleEn: "DeepSeek releases a new model",
  summaryZh: "模型更新",
  summaryEn: "Model update",
  entities: ["DeepSeek"],
  lastUpdatedAt: "2026-08-12T12:00:00.000Z",
}], "2026-08-12T12:30:00.000Z");
assert.equal(state.companyCount, 50);
assert.equal(state.companies.find((company) => company.id === "deepseek")?.eventsInLatestRun, 1);
assert.equal(state.companies.find((company) => company.id === "nvidia")?.eventsInLatestRun, 0);

console.log(JSON.stringify({ message: "core company watchlist tests passed", companies: CORE_COMPANY_WATCHLIST.length, sourceFeeds: CORE_COMPANY_SOURCE_IDS.length }));
