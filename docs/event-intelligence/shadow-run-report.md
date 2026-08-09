# IDC Atlas Event Intelligence · Gate 3 Shadow Run Report

Generated: 2026-08-09T02:17:28.604Z

## Gate status

**blocked**. The required two public-source shadow slots completed as event-night and event-day against the same persistent shadow database. Connector failures were retained as failures. Gate 3 remains blocked until the labelled replay set reaches 200–500 events and bilingual translation is supplied. No production D1, production Worker, formal Site, public API source switch, or industry-network route was modified.

## Run summary

| Slot | Status | Freshness | Fetched | Relevant | Clusters | Public eligible | Errors | Rumor | Pulse | Policy | Hold |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| event-night | succeeded | verified-no-change | 92 | 26 | 19 | 0 | 0 | 9 | 9 | 1 | 0 |
| event-day | succeeded | verified-no-change | 92 | 26 | 19 | 0 | 0 | 9 | 9 | 1 | 0 |

Event-night returned 92 observations and 19 clusters; event-day returned 92 observations and 19 clusters. The two slots shared 19 event keys; this is expected because both fetches were executed close together and is not evidence of a production delta.

## Source health

Each slot sampled 15 public endpoints from a 45-source registry. Event-night: 6 ok, 1 empty, 0 parse-error, 0 failed, 0 blocked. Event-day: 6 ok, 1 empty, 0 parse-error, 0 failed, 0 blocked.

### Event-night failures

- None

### Event-day failures

- None

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
| 1 | Plan of Action Under the Defense Production Act (Human Mobilization Committee) | officially_confirmed | policy-index | 83.1 | federal-register[T0/origin/public-api] | — | source-tier-T0, independent-sources-1, semantic-4.5, policy-route-requires-T0, research-question-candidate, bilingual-translation-pending |
| 2 | Firebird Launches CIS Region’s Largest AI Factory in Armenia | officially_confirmed | pulse | 74.8 | nvidia[T1/origin/public] | — | source-tier-T1, independent-sources-1, semantic-4.1, official-T0-or-T1-supports-pulse, research-question-candidate, bilingual-translation-pending |
| 3 | Texas Audit Could Delay 49.8 GW of Data Center Load, Cost Projects Up to $15 Billion, BNEF Warns | reported | rumor-watch | 66.1 | power-magazine[T3/origin/public] | 49.8 GW potential/it_capacity | source-tier-T3, independent-sources-1, semantic-4, media-only-stays-rumor-watch, bilingual-translation-pending |
| 4 | Rugged Switchgear–A Reliable Data Center’s Bedrock | reported | rumor-watch | 61.8 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.7, media-only-stays-rumor-watch, bilingual-translation-pending |
| 5 | LS Power Acquiring 606-MW Texas Gas-Fired Plant From Constellation | reported | rumor-watch | 61.6 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.7, media-only-stays-rumor-watch, bilingual-translation-pending |
| 6 | DOE Approves Safety Design of Deep Fission’s Underground SMR | reported | rumor-watch | 65.8 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-4, media-only-stays-rumor-watch, bilingual-translation-pending |
| 7 | Oklo’s Groves Becomes Fifth DOE Pilot Reactor to Reach Criticality, First on Private Land | reported | rumor-watch | 65.8 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-4, media-only-stays-rumor-watch, bilingual-translation-pending |
| 8 | The POWER Interview: NRG’s Case for Bring Your Own Power—and the Labor to Build It | reported | rumor-watch | 64.8 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.9, media-only-stays-rumor-watch, bilingual-translation-pending |
| 9 | AI’s Obstacle: Why the Grid Can’t Keep Pace With the Data Center Boom | reported | rumor-watch | 60.6 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.7, media-only-stays-rumor-watch, bilingual-translation-pending |
| 10 | Nebraska Public Power District Breaks Ground on 694-MW Princeton Road Station | reported | rumor-watch | 64.1 | power-magazine[T3/origin/public] | — | source-tier-T3, independent-sources-1, semantic-3.9, media-only-stays-rumor-watch, bilingual-translation-pending |

## Strategy, model and cost

- Strategy version: atlas-event-v1
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
| snapshot-daily | 0 22 * * * | 06:00 | existing formal Atlas snapshot |
| event-day | 30 9 * * * | 17:30 | daytime event ingest, cluster and route |

The local schedule map distinguishes the three jobs. The existing production Wrangler cron was not changed in this gate.

## Compatibility and static-output boundary

现有 atlas-live-v5、公开 Worker route、静态 RUMOR/POLICY fallback 和站点生产读取链没有切换；本报告只记录 shadow 旁路结果，未做逐条静态内容替换比较。

## Unresolved risks

- 当前真实 shadow 的分类、五维分析、聚类、评分和路由仍是 deterministic-shadow，不代表模型版本已校准。
- 真实数据的 19 个事件簇尚未与 Atlas 历史 200–500 条标注集回放；现有 fixture 只有 12 条观察、7 个标注事件。
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
