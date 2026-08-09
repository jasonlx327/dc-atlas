# 事件评分、资格与证据路由

策略版本：`atlas-event-v1`  
分类版本：`rules-v1`  
实现：`worker/event-intelligence/pipeline.ts`

## 1. 两条独立轴

事件的 `evidenceStatus` 描述来源支持的状态：`lead`、`reported`、`official_response`、`officially_confirmed` 等；`priorityScore` 只用于确定性排序。任意媒体分数都不能把事件升级为已核验事实。

## 2. 分类漏斗

1. 规范 URL、标题、摘要，生成 canonical URL hash、content hash 和 observation ID。
2. 完全相同的 canonical URL 去重；转载保留来源观察并在事件来源链中标记 `syndication`。
3. 规则分类为核心基础设施、上游算力/需求、政策/资本、关键词型无关、无关五类。
4. 前三类以及 `uncertain` 观察进入深度分析；后两类停止，原因保留在漏斗。
5. 本地 shadow 的分析器是可审计的 deterministic rule adapter，五维分和事实候选落在 `observation_analysis` 语义结构；未配置模型时调用数和成本明确为 0，不假称已经调用模型。

## 3. 五维分与确定性总分

当前版本权重：

| 维度 | 权重 |
| --- | ---: |
| 主题相关度 | 0.28 |
| 基础设施传导机制深度 | 0.23 |
| 信息具体性与可量化程度 | 0.20 |
| 研究增量价值 | 0.17 |
| 读者阅读价值 | 0.12 |

代码再加入来源等级、独立来源数、近期性，并扣除转载和容量边界不清的惩罚。当前公共排序阈值为 45，研究候选阈值为 58；它们是本地 shadow 的初始策略，不是生产阈值，必须由固定 fixture 回放校准后才能进入 Gate 4。

## 4. 资格与路由

| Route | 代码门槛 | 允许的证据状态 |
| --- | --- | --- |
| `policy-index` | 事件带政策/监管语义，至少一个 T0 官方记录 | `officially_confirmed` |
| `pulse` | 至少一个 T0/T1 直接披露，且有主体、时间和事件机制 | `officially_confirmed` |
| `rumor-watch` | T2/T3 原创报道或可追溯线索，且没有 T0/T1 确认 | `reported` / `official_response` |
| `research-queue` | 可信来源、研究问题、分数达到候选阈值；媒体 claim 仍需 primary verification | 不自动升级事实 |
| `hold` | 发现层、T4/T5、缺时间/实体、分析不确定或访问受限 | 内部 |
| `rejected` | 无 Atlas 主题、纯关键词、交易信号、无可归属来源 | 不公开 |

一个事件可能有多个 `routeCandidates`，但 `selection_decisions.route` 只保存本轮主要路由。T2/T3 媒体独家不能进入 Pulse；非 T0 不能进入政策索引；AI HOT D 只能进入 hold 或作为原始来源链中的发现观察。

## 5. 聚类安全规则

聚类顺序：external ID/canonical URL/content hash → independence group/转载关系 → entity/action/project/location/period 确定性 event key → embedding（本轮未启用）。

事件 key 不跨越以下边界：规划/潜在/签约/获批/在建/投运；总电力/utility power/IT load；融资传闻/融资完成/CAPEX 预算；选址/土地/并网/开工/设备到货/投运；媒体报道/官方回应/法定披露。不同语言只有在共享明确 event key 或确定性事实键时才合并。

## 6. 容量和财务事实

每个容量事实必须同时保留来源观察、`qualifier` 和容量类型；如果状态或类型不明确，事实保留为 `unspecified_capacity` 并增加 `capacity-boundary-needs-review`，不自动公开。金额保留原始币种/单位；PP&E、公司推断或模型推理单独标记 `inference`，不写成 AI CAPEX。

## 7. 可回放要求

每个策略版本记录权重、阈值、代码版本、Prompt hash 和 replay report reference。新策略只有在同一 fixture 上未降低高价值召回、route 安全和容量准确性时，才可申请 Gate 4 评审。
