# IDC Atlas Event Intelligence · Gate 3 Shadow Run Report

Generated: 2026-09-02T14:48:58.300Z

## Gate status

**blocked**. The required two public-source shadow slots completed as event-night and event-day against the same persistent shadow database. Connector failures were retained as failures. Gate 3 remains blocked until the labelled replay set reaches 200–500 events and bilingual translation is supplied. No production D1, production Worker, formal Site, public API source switch, or industry-network route was modified.

## Run summary

| Slot | Status | Freshness | Fetched | Relevant | Clusters | Public eligible | Errors | Rumor | Pulse | Policy | Hold |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| event-night | partial | partial | 2919 | 1973 | 707 | 0 | 6 | 127 | 431 | 0 | 149 |
| event-day | partial | partial | 2252 | 1581 | 550 | 0 | 6 | 91 | 360 | 0 | 99 |

Event-night returned 2919 observations and 707 clusters; event-day returned 2252 observations and 550 clusters. The two slots shared 550 event keys; this is expected because both fetches were executed close together and is not evidence of a production delta.

## Source health

Each slot sampled 77 public endpoints from a 45-source registry. Event-night: 66 ok, 5 empty, 0 parse-error, 5 failed, 1 blocked. Event-day: 32 ok, 4 empty, 0 parse-error, 5 failed, 1 blocked.

### Event-night failures

- `ndrc` / `ndrc-endpoint`: failed — fetch failed
- `miit` / `miit-endpoint`: failed — fetch failed
- `mep-china` / `mep-china-endpoint`: failed — fetch failed
- `beijing-gov` / `beijing-gov-endpoint`: failed — fetch failed
- `shanghai-gov` / `shanghai-gov-endpoint`: failed — fetch failed
- `xai-news` / `xai-news-endpoint`: blocked HTTP 403 — HTTP 403

### Event-day failures

- `ndrc` / `ndrc-endpoint`: failed — fetch failed
- `miit` / `miit-endpoint`: failed — fetch failed
- `mep-china` / `mep-china-endpoint`: failed — fetch failed
- `beijing-gov` / `beijing-gov-endpoint`: failed — fetch failed
- `shanghai-gov` / `shanghai-gov-endpoint`: failed — fetch failed
- `xai-news` / `xai-news-endpoint`: blocked HTTP 403 — HTTP 403

Failures are not replaced with old observations and do not advance a successful cursor. AI HOT was called through its current v1 connector (/api/v1/items, selected, 24h); the old /api/public/* contract was not copied.

## Safety checks

| Check | Event-night | Event-day | Gate target |
| --- | ---: | ---: | --- |
| Media-only events routed to Pulse | 0 | 0 | 0 |
| Non-T0 events routed to Policy Index | 0 | 0 | 0 |
| Capacity facts missing qualifier/type | 0 | 0 | 0 |
| Event samples available | 10 | 10 | ≥10 |

Unspecified capacity type is retained as explicit 'unspecified_capacity'; it is not silently converted to IT load, utility power, or GPU compute. An unstated stage remains unset and makes the event ineligible for public output.

## Ten event-cluster samples

The following are source-chain samples from event-night. They are internal shadow objects, not published Atlas records.

| # | Main event | Evidence | Route | Priority | Source chain | Capacity facts | Route reasons |
| ---: | --- | --- | --- | ---: | --- | --- | --- |
| 1 | Samsung Redefines Laundry With New A-70% and 13 Kg Bespoke AI Washers at IFA 2026 | officially_confirmed | pulse | 75.4 | samsung-global-newsroom[T1/origin/public] | — | source-tier-T1, independent-sources-1, semantic-4.1, official-T0-or-T1-supports-pulse, research-question-candidate, bilingual-translation-pending |
| 2 | Analysts split on whether rumored Nvidia-Hugging Face deal is a good thing | reported | rumor-watch | 53 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.9, media-only-stays-rumor-watch, bilingual-translation-pending |
| 3 | AWS and Microsoft launch multicloud networking in preview | reported | rumor-watch | 55.7 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.1, media-only-stays-rumor-watch, bilingual-translation-pending |
| 4 | Equinix and CPP Investments close $4B atNorth acquisition | reported | rumor-watch | 49 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.6, media-only-stays-rumor-watch, bilingual-translation-pending |
| 5 | What is sovereign AI? Only 13% of enterprises know. | reported | rumor-watch | 46.2 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.4, media-only-stays-rumor-watch, bilingual-translation-pending |
| 6 | Huawei reports mixed results as HP dispute ends and U.S. trial nears | reported | rumor-watch | 45.9 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.3, media-only-stays-rumor-watch, bilingual-translation-pending |
| 7 | Opinion: AI-RAN could give telecom a second chance to own the AI economy | reported | rumor-watch | 46.2 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.4, media-only-stays-rumor-watch, bilingual-translation-pending |
| 8 | Alibaba Cloud launches first cloud region in Brazil | reported | rumor-watch | 49 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.6, media-only-stays-rumor-watch, bilingual-translation-pending |
| 9 | SK Telecom launches dedicated data center infrastructure company | reported | rumor-watch | 49 | fierce-network[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-2.6, media-only-stays-rumor-watch, bilingual-translation-pending |
| 10 | Agent Plugins package your skills, tools, and more | officially_confirmed | pulse | 60.1 | google-developers[T1/origin/public] | — | source-tier-T1, independent-sources-1, semantic-3, official-T0-or-T1-supports-pulse, research-question-candidate, bilingual-translation-pending |

## Strategy, model and cost

- Strategy version: atlas-event-v2
- Classifier version: rules-v1
- Model calls: 0 in each run.
- Estimated model cost: 0 in each run.
- Shadow analysis is deterministic and does not prove a production model prompt/schema contract.
- Fixture comparison: current media-only → Pulse = 0; tier-only baseline = 1; labels = 7/7.
- 这是可审计的核心边界 fixture，不等同于计划要求的 200–500 条历史回放；真实 shadow 运行后需再次观察该指标。

## Schedule proof

| Job | UTC cron | Beijing | Purpose |
| --- | --- | --- | --- |
| event-night | 30 21 * * * | 05:30 | nightly event ingest, cluster and route |
| event-midday | 30 4 * * * | 12:30 | midday event ingest, cluster and route |
| snapshot-daily | 0 22 * * * | 06:00 | existing formal Atlas snapshot |
| daily-closure | 30 22 * * * | 06:30 | DeepSeek selection, 13-section closure and refreshed snapshot |
| event-day | 30 12 * * * | 20:30 | evening event ingest, cluster and route |

The local schedule map distinguishes the three jobs. The existing production Wrangler cron was not changed in this gate.

## Compatibility and static-output boundary

现有 atlas-live-v5、公开 Worker route、静态 RUMOR/POLICY fallback 和站点生产读取链没有切换；本报告只记录 shadow 旁路结果，未做逐条静态内容替换比较。

## Unresolved risks

- event-night 有 6 个 endpoint failed/parse-error/blocked；不得用旧数据替代。
- 当前真实 shadow 的分类、五维分析、聚类、评分和路由仍是 deterministic-shadow，不代表模型版本已校准。
- 真实数据的 707 个事件簇尚未与 Atlas 历史 200–500 条标注集回放；现有 fixture 只有 12 条观察、7 个标注事件。
- 真实双语翻译适配器尚未接入；源语言内容只可进入内部路线，不能成为公开候选。
- 公开候选数量不是发布授权；生产 D1、发布记录、日报和公开 API 均未写入。

## Acceptance declaration

- Schema/migration: local blank SQLite migration verified; repeated invocation is skipped by a local migration ledger.
- Persistence: shadow SQLite contains sources, endpoints, sync state, ingestion run, observations, observation analysis, entities, events, event relationships, facts, selection decisions, scoring version, and pipeline stage runs.
- Production D1: **not modified**.
- Production Worker: **not modified**.
- Formal Site / public URL: **not deployed**.
- Public API source switch: **not performed**.
- Industry-network WIP and route: **not modified**.
- Gate 3 action: **stop here for review; no deployment**.
