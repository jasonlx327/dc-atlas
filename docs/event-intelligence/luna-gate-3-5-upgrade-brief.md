# IDC Atlas Event Intelligence · Gate 3.5 升级任务书

> 给 Luna Ultra 的下一轮实施 Prompt  
> 版本：v1.0  
> 日期：2026-08-09  
> 项目：`/Users/xlarge/Desktop/数据中心/data-center-site-work`  
> 本轮边界：只做本地实现、历史回放和持续影子验证；**不得部署或修改任何生产资源**。

## 0. 给 Luna 的直接指令

你正在接手 IDC Atlas 事件情报系统 Gate 0–Gate 3 之后的改进工作。当前系统不是空白项目：schema、迁移、connector、规范化、去重、分类、聚类、事实提取、评分、路由、双时段 shadow、报告和本地只读管理后台已经存在并通过现有测试。

本轮目标是把“可以运行的 deterministic shadow”推进为“可以被审阅的 production candidate”，解决当前三个阻塞项：

1. 建立 200–500 个历史事件的固定回放集。
2. 把来源适配、聚类和双语输出从占位实现推进为可校准实现。
3. 连续运行 7 天影子任务，形成可量化的 Gate 4 准入报告。

不要重写现有系统，不要清理工作区，不要顺手改首页或产业链信息网。先审计当前代码和未提交改动，再以最小增量完成以下 Gate 3.5A–3.5D。除非遇到真实阻塞，请持续实现、测试和修复；完成后停止并交付验收包。

### 绝对停止线

- 不创建、绑定、迁移或写入生产 D1。
- 不修改生产 Worker cron、公开 API 数据源、KV 正式快照或 Sites 配置。
- 不运行 `wrangler deploy`、`npm run deploy` 或 Sites 发布。
- 不启用 `/admin/intelligence` 生产写操作或公开访问。
- 不抓取付费墙正文，不绕过登录、robots、访问控制或许可限制。
- 不把 AI HOT、搜索摘要、媒体报道或模型记忆当成事实来源。
- 不修改或启用产业链信息网。
- 不删除、reset、stash 或覆盖不属于本任务的 WIP。

任何需要账号、API Key、付费授权、Cookie、生产 DNS、Cloudflare Access、模型供应商或远程数据库的步骤，只完成接口、文档、成本/隐私/回滚说明和本地验证，然后列为 `external-decision-required`，等待用户批准。

## 1. 已确认基线

开始前重新读取并验证以下文件；若数字变化，以本地最新产物为准并说明差异：

- `docs/atlas-event-intelligence-upgrade-plan.md`
- `docs/event-intelligence/current-state-audit.md`
- `docs/event-intelligence/schema-and-migration.md`
- `docs/event-intelligence/scoring-and-routing.md`
- `docs/event-intelligence/shadow-run-report.md`
- `artifacts/event-intelligence/live-shadow-acceptance.json`
- `worker/connectors/**`
- `worker/event-intelligence/**`
- `scripts/*event*`
- `app/admin/intelligence/**`
- `db/schema.ts`
- `drizzle/0000_event_intelligence.sql`
- `wrangler.jsonc`
- `package.json`

当前已验证基线：

| 项目 | 当前状态 |
| --- | --- |
| 数据结构 | 17 张表、47 个索引；本地迁移可验证 |
| 影子任务 | `event-night` 与 `event-day` 均成功 |
| 单轮公开来源结果 | fetched 92、relevant 26、clusters 19、errors 0 |
| 路由安全 | 媒体误升 Pulse 0；非 T0 进入 Policy Index 0 |
| 容量边界 | qualifier/type 缺失错误 0 |
| 公开候选 | 0；原因是双语翻译适配器尚未接入 |
| 回放集 | 12 条 observation、7 个标注事件；不足 200–500 |
| 模型调用 | 0；当前仍为 deterministic-shadow |
| 管理后台 | `/admin/intelligence` 默认 404；仅本地环境变量开启 |
| Gate 3 | `blocked`，不是生产可上线状态 |

现有验证命令已经通过：

```bash
npm run event:test
npm run event:evaluate
npm run event:verify-migration
npx tsc --noEmit --incremental false
npm run lint
npm test
WRANGLER_LOG_PATH=.wrangler/wrangler.log npm run cf:check
```

本轮必须保持这些结果不退化。预先存在的 lint warning 可以保留，但不得新增 lint error 或 warning。

## 2. 不变的产品与证据规则

### 2.1 来源权威与路线

- T0：政府、监管、法定记录、交易所，可支持政策索引和法定事实。
- T1：公司、项目方、客户、供应商、公用事业、官方技术来源，可支持 Pulse。
- T2/T3：Reuters、Bloomberg、WSJ、FT、MarketWatch、行业媒体等，只能作为具名报道、Rumor Watch 和研究线索。
- T4/T5：分发稿、社区和社交内容，只能作为低权威线索。
- D：AI HOT、GDELT、搜索引擎等发现入口，不改变原始来源等级。

硬约束：

- 媒体报道无论评分多高，都不能自动升级为 Pulse。
- Policy Index 只接受官方 T0 原文。
- 同一通讯社稿件的转载、翻译和镜像只算一个 `independence_group`。
- `reported`、`company-response`、`officially-confirmed`、`contested` 是证据状态，不是真假或概率判断。
- 找不到原文时保留 `not-determined`，不能用搜索摘要补齐缺失事实。

### 2.2 容量与财务边界

- `proposed`、`planned`、`contracted`、`under-construction`、`energized`、`commissioned`、`operating` 必须分开。
- `IT capacity`、`utility power`、`total campus power`、`compute nameplate`、`potential capacity` 必须分开。
- 未披露 type 或 stage 时保留空值或 `unspecified_capacity`，不能猜测。
- PP&E、总 CAPEX、AI CAPEX、租赁承诺、融资额度和合同金额不能互相替代。
- 每个数值必须保留单位、币种、期间、来源 observation 和原始表述。

### 2.3 当前资讯边界

- 当前新闻必须来自本轮真实抓取结果，不能来自模型训练记忆。
- 请求失败是 `failed`、`blocked` 或 `unavailable`，不能替换成旧新闻后声称本轮更新。
- 304 与“成功但无新增”必须分别记录为 `not-modified` 和 `verified-no-change`。
- 只有明确 404 且 connector 合同允许时，才可执行有界索引回退。

## 3. Gate 3.5A：固定历史回放集

### 3.1 目标

建立一个版本化、可重复运行、可解释的 240–360 个事件回放集。优先质量，不为了凑数构造虚假样本。

### 3.2 数据来源

优先从仓库已有并带来源的内容抽取：

- Pulse、项目、上市公司、政策、并购、财报、园区、容量、GPU、内存、电力和液冷历史记录。
- 现有 Rumor Watch 与 Policy Index。
- 历史 daily review、source manifest、research evidence packet 和 shadow observations。
- 中英文同一事件、后续官方确认/否认、同一园区不同阶段、同一媒体稿多域转载。

不得用未验证的模型生成事实作为 fixture。可以让模型协助建议标签，但最终 fixture 必须能回到现有来源和明确规则；模型建议标签标记为 `provisional`，经代码约束和来源复核后才能变为 `frozen`。

### 3.3 必须覆盖的样本分布

最低覆盖：

- 50 个 T0/T1 项目、财报、政策或并购事件。
- 40 个 T2/T3 媒体独家或多源报道。
- 40 组转载、翻译、镜像和重复标题。
- 30 个 AI 关键词明显但与基础设施无实质关系的负样本。
- 40 个容量 stage/type 易混淆样本。
- 20 组中英文同一事件。
- 20 组传闻后出现官方回应、确认、否认或重大新细节的时间线。

同一事件可同时覆盖多个类别，但报告要展示真实分布，不能重复计数伪装样本量。

### 3.4 Fixture 合同

每个 frozen event 至少包含：

```text
fixture_id
source_observation_ids[]
expected_relevance
expected_event_key
expected_cluster_members[]
expected_primary_source_id
expected_evidence_status
expected_route
expected_public_eligible
expected_entities[]
expected_capacity_facts[]
expected_relationships[]
expected_bilingual_state
label_basis
label_status: provisional | frozen
```

### 3.5 输出

- `scripts/fixtures/event-intelligence/history-v1.json`
- `scripts/build-event-replay-corpus.ts`
- `scripts/validate-event-replay-corpus.ts`
- `docs/event-intelligence/replay-corpus-v1.md`
- package script：`event:replay:build`、`event:replay:validate`

验证器必须阻止：无来源、重复 ID、非法 route、媒体直升 Pulse、非 T0 政策、容量边界缺失、同一稿件被错误计为多个独立来源。

## 4. Gate 3.5B：来源适配与事件聚类升级

### 4.1 Connector 顺序

采用“来源专用适配器优先，通用 RSS/JSON/HTML fallback 其次”的最小实现：

1. 官方 API、RSS、Atom、JSON feed。
2. 官方 listing page + article metadata。
3. 允许访问的媒体 RSS 或公开页面 metadata。
4. AI HOT 仅作 discovery lead，并保留其 `origin_url`。

先把当前 15 个 sampled endpoint 扩到至少 30 个稳定 endpoint，再讨论 40–60 全量。不得同时扩大数量和重写评分，以免无法定位质量变化。

### 4.2 Connector 必须记录

- canonical URL、publisher、author、published/discovered/fetched time。
- ETag、Last-Modified、cursor、HTTP 状态、响应时间、body size。
- `ok`、`empty`、`not-modified`、`parse-error`、`failed`、`blocked`。
- parser version、连续失败、近 7 日成功率、新增/重复/解析失败数。
- access：`public`、`public-api`、`paywalled`、`licensed`、`login-required`、`unavailable`。

增加超时、有限重试、最大响应体和并发上限；失败不推进 cursor。不要为绕过受限来源使用无授权镜像。

### 4.3 聚类分层

按以下顺序聚类，不把向量相似度当最终决定：

1. canonical URL / publisher article ID 精确去重。
2. syndication origin / independence group 去重。
3. `entity + action + counterparty/project + location + period` 确定性 block。
4. 标题、实体、时间、金额和容量的候选相似度。
5. 可选 embedding 只生成 merge candidate。
6. 由确定性冲突规则决定 merge、split、follow-up、official-response 或 contradiction。

必须保持：

- 同一园区不同阶段是一条事件时间线中的不同版本，不覆盖历史。
- 不同园区、不同合同、融资与建设、产品传闻与正式发布不得错误合并。
- 官方回应可关联媒体传闻，但仍保留各自 observation 和 evidence relationship。
- 每次 merge/split 记录 reason code、策略版本和输入 observation IDs。

### 4.4 输出

- 扩充 `worker/connectors/**` 和 `worker/event-intelligence/cluster.ts`，但不另建无必要框架。
- 增加 connector contract、independence group、时间线、冲突和错误合并测试。
- 生成 `artifacts/event-intelligence/source-health-30.json`。
- 生成 `artifacts/event-intelligence/clustering-regression.json`。

## 5. Gate 3.5C：五维评分与双语输出

### 5.1 模型职责

模型只允许完成以下狭窄任务：

- 判断 Atlas 主题实质相关性。
- 输出五个独立维度分及一句编辑理由。
- 提取实体、事实候选、研究问题和中英文标题/摘要候选。

模型不得：

- 修改 source tier 或 evidence status。
- 决定最终 route 或 public eligibility。
- 把缺失事实补齐。
- 把媒体转成官方确认。
- 覆盖 deterministic capacity/finance validation。

最终分数、门槛、route 和公开资格由版本化代码计算。

### 5.2 五个维度

每个维度 0–5，保留原始输出：

1. `infrastructure_relevance`
2. `materiality`
3. `novelty`
4. `source_value`
5. `research_value`

评分模型、Prompt hash、输入 schema、输出 schema、token、成本、耗时和错误必须写入运行记录。优先用便宜模型预筛，较强模型只处理进入深度阶段的少数候选。

若接入模型需要新账号、API Key、费用或把内容发给第三方，则：

1. 实现 provider-neutral adapter 与本地 recorded-response adapter。
2. 用 frozen fixture 比较 2–3 个候选方案。
3. 输出数据字段、隐私、成本、延迟、失败回退和可逆性说明。
4. 标记 `external-decision-required` 并等待用户选择；不得私自接入生产供应商。

### 5.3 双语输出

实现 translator contract，至少包含：

```text
translateTitle
translateSummary
protectEntities
protectNumerics
validateBilingualPair
```

保护项：公司名、产品名、ticker、金额、币种、容量、单位、日期、地名和 URL。中文展示 Asia/Shanghai，英文展示 America/New_York，并覆盖 DST 边界测试。

若只存在源语言：

- 可进入内部事件和研究队列。
- `public_eligible=false`。
- 不以旧翻译、机器记忆或空字符串冒充完整双语。

### 5.4 回放比较

至少输出：

- relevance precision / recall。
- 高价值事件 recall。
- duplicate rate / incorrect merge rate。
- 主来源选择准确率。
- 媒体误升 Pulse、非 T0 进入 Policy、容量边界错误。
- 中英文数值、单位、实体和时间一致率。
- 单条平均成本、总成本、P50/P95 延迟。
- 新旧策略按 tier、topic、route 的分布变化。

新策略不能仅凭总分更高通过；任何安全硬约束退化都直接失败。

## 6. Gate 3.5D：7 天连续影子观察

### 6.1 调度

继续使用本地/专用影子数据库：

| Job | UTC | 北京时间 | 用途 |
| --- | --- | --- | --- |
| event-night | `30 21 * * *` | 05:30 | 夜间事件采集、聚类、路由 |
| snapshot-daily | `0 22 * * *` | 06:00 | 现有正式快照；本轮不修改 |
| event-day | `30 9 * * *` | 17:30 | 日间事件采集、聚类、路由 |

本轮只运行等价的本地/影子调度器，不修改生产 cron。

### 6.2 每轮记录

- 所有 endpoint 的状态和 freshness。
- 抓取、可评估、相关、深度评分、事件簇和 route 漏斗。
- 新事件、状态变化、官方回应、新来源、新细节、矛盾和 verified-no-change。
- 错误、重试、模型失败、成本、阶段耗时和 P95 延迟。
- 10 个代表事件的来源链、聚类理由、事实边界、route reason codes。
- 与当前静态 Pulse/Rumor/Policy 输出的差异，但不得切换公开 API。

### 6.3 7 天通过标准

全部同时满足才可输出 `gate4_ready=true`：

| 指标 | 门槛 |
| --- | ---: |
| 启用 endpoint 近 7 日成功或真实 no-change 比例 | ≥95% |
| 媒体-only → Pulse | 0 |
| 非 T0 → Policy Index | 0 |
| frozen fixture 容量/财务硬边界错误 | 0 |
| 高价值事件 recall | ≥90% |
| relevance precision | ≥85% |
| 聚类 purity | ≥95% |
| duplicate event rate | ≤5% |
| 中英文数值/单位/实体不一致 | 0 |
| 旧数据冒充本轮更新 | 0 |
| 无来源公开候选 | 0 |
| 关键 pipeline error 未暴露 | 0 |

若任何硬约束失败，状态必须是 `blocked`。来源受限但不影响安全时可为 `complete_with_risks`，并明确哪些来源、哪些日期和哪些指标受影响。

## 7. 管理者后台改进范围

本轮继续保持本地只读定位，补齐观察能力，不做生产操作台：

- Overview：7 天趋势、两时段状态、freshness、成本和公开资格阻塞原因。
- Sources：30 个稳定 endpoint、访问边界、成功率、cursor、parser 和最近错误。
- Event Stream：按 route、evidence、topic、region、tier、novelty 筛选。
- Event Detail：事件时间线、全部来源、independence group、merge reason、事实版本、双语校验。
- Pipeline Runs：阶段漏斗、时长、模型 token/成本、失败 observation。
- Strategy Lab：history-v1 回放、新旧策略、回归案例、Prompt hash。

可以实现“重放此 fixture”或“导出诊断包”的本地开发按钮，但默认禁用、不得访问远程资源、不得成为每日内容的人工审批瓶颈。

必须保持：

- 未设置 `ATLAS_INTELLIGENCE_ADMIN=1` 时返回 404。
- 不进入公开导航、sitemap 或搜索引擎。
- 不向浏览器输出 secret、完整付费正文或内部凭证。

## 8. 实施顺序与每阶段停线门

### Milestone 1：Corpus

先完成历史抽取、fixture 合同、验证器和 baseline 回放。

通过条件：至少 240 个可追溯 frozen events，分布满足要求，验证器 0 error。

若来源链不足，不允许用模型合成样本凑数；报告真实数量并停止扩大模型/来源工作。

### Milestone 2：Connectors + Clustering

扩到 30 个稳定 endpoint，完成 source health 和聚类回归。

通过条件：fixture 上 route 安全错误为 0、聚类 purity ≥95%、错误合并率 ≤3%。

### Milestone 3：Scoring + Translation

接入 provider-neutral contracts、recorded adapter、双语校验和策略比较。

通过条件：所有硬约束不退化；若真实 provider 需要外部选择，输出决策包并以 `external-decision-required` 停止该子项，不阻塞其他本地工作。

### Milestone 4：7-day Shadow

连续记录 7 天、每天两轮；单次网络失败不是失败样本，应如实计入来源健康。

通过条件：满足第 6.3 节全部准入门槛，输出 Gate 4 readiness package。未满 7 个自然日不得声称完成。

### Milestone 5：Stop

完成 Gate 4 readiness package 后立即停止。不要部署，不要创建生产资源，不要修改正式 API。

## 9. 需要新增的测试与命令

在保持现有命令通过的基础上，增加最少必要命令：

```bash
npm run event:replay:build
npm run event:replay:validate
npm run event:replay
npm run event:shadow:7d:report
npm run event:gate4-readiness
```

新增测试至少覆盖：

- fixture 来源完整性、标签枚举、分布和去重。
- connector 200/304/404/429/5xx、timeout、body cap 和 parse error。
- 失败不推进 cursor，不覆盖 last successful payload。
- syndication independence group 计数。
- 中英文同事件、不同园区、不同阶段、传闻与官方回应。
- capacity/finance 硬边界。
- route 与 evidence 分离。
- translation 数值、单位、实体和 DST。
- admin 默认 404 和 noindex。
- 公开 `atlas-live-v5` contract 不变。

每个 Milestone 后运行：

```bash
npm run event:test
npm run event:evaluate
npm run event:verify-migration
npx tsc --noEmit --incremental false
npm run lint
npm test
WRANGLER_LOG_PATH=.wrangler/wrangler.log npm run cf:check
```

测试命令需要联网或写出沙箱时，先说明原因；不能把网络失败包装成测试通过。

## 10. 文件边界

允许修改：

- `worker/connectors/**`
- `worker/event-intelligence/**`
- `scripts/*event*`
- `scripts/fixtures/event-intelligence/**`
- `docs/event-intelligence/**`
- `artifacts/event-intelligence/**`
- `app/admin/intelligence/**`
- `db/schema.ts`、`db/index.ts`、现有 event migration（仅在 schema 确有必要时）
- `package.json`、相关最小测试/类型配置

除非为保持既有 contract 的测试修复，不允许修改：

- 公开首页及其视觉样式。
- `app/industry-network/**` 和产业链数据/脚本。
- 正式 `atlas-live-v5` 字段语义。
- 正式 KV 快照任务。
- 不相关的 daily review、专栏、SEO/GEO、研究草稿和 artifacts。
- `.openai/hosting.json`、生产 D1 ID、secret、DNS 或部署配置。

不要为了获得 clean worktree 而处理用户已有改动。每一行改动都必须能映射到本任务。

## 11. Luna 最终验收包

一次性提交：

1. 按 Milestone 列出的完成摘要。
2. 开始和结束时的 `git status --short --branch`，只解释本任务相关改动。
3. 新增/修改文件清单及用途。
4. history-v1 样本数、来源分布、主题分布、route 分布、标签状态。
5. baseline 与新策略完整比较。
6. 30 个 endpoint 的 7 日健康报告和访问缺口。
7. 至少 20 个聚类案例：正确合并、正确拆分、时间线、官方回应和矛盾。
8. 双语一致性报告；列出所有 unresolved translation。
9. 模型候选、Prompt hash、token、成本、延迟、隐私和失败回退；若未选 provider，明确原因。
10. 7 天共 14 个 shadow slot 的逐轮摘要。
11. 所有测试、lint、typecheck、build、migration 和 cf dry-run 结论。
12. 管理后台桌面/移动截图，覆盖 Overview、Sources、Event Detail、Runs、Strategy Lab。
13. `gate4_ready` 判定、未解决风险、external decisions 和回滚方案。
14. 明确声明生产 D1、Worker、Sites、公开 API、KV 和产业链信息网是否被修改。正确答案必须是“没有”。

## 12. Gate 4 只形成提案，不执行

若 Gate 3.5 全部通过，只生成 `docs/event-intelligence/gate4-cutover-proposal.md`，内容包括：

- 正式 D1 创建/绑定、迁移、备份和回滚步骤。
- Cloudflare Access 或现有身份系统的账号、权限、Cookie/隐私、费用和撤销方式。
- 模型供应商的数据字段、保留政策、费用上限和停用方式。
- 逐 route 切换顺序：Rumor → Policy → Pulse → Research Queue。
- 每一步的 feature flag、失败阈值和静态 fallback。
- 同一 commit 的测试、正式域 API 证明、Sites 保存/部署和生产 URL readback 计划。
- 14 天并行期和何时允许淘汰静态 fallback。

完成提案后等待用户明确批准，不得自行执行。

---

## 可复制给 Luna 的启动消息

请阅读并执行：

`/Users/xlarge/Desktop/数据中心/data-center-site-work/docs/event-intelligence/luna-gate-3-5-upgrade-brief.md`

从真实仓库状态和现有 Gate 0–3 产物开始，按 Milestone 1 → 4 持续实现、测试和修复。保留全部无关 WIP，不得部署，不得修改生产 D1、Worker、Sites、KV、公开 API 或产业链信息网。需要新账号、付费授权、Cookie、API Key、模型供应商或 Cloudflare Access 时，只完成本地接口与决策包并标记 `external-decision-required`。完成 7 天影子观察和 Gate 4 readiness package 后立即停止，等待用户将结果交回原 Codex 任务审阅。
