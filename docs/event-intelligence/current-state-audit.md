# Atlas 事件情报管线现状审计

审计时间：2026-08-08 Asia/Shanghai  
审计范围：`/Users/xlarge/Desktop/数据中心/data-center-site-work`  
对应任务：`docs/atlas-event-intelligence-upgrade-plan.md` Gate 0

## 结论摘要

当前站点是“Worker 在线聚合 + 静态研究数据 + KV 正式日快照”的架构，还没有事件数据库或事件级处理流水线。计划书中的几项基线与代码不一致：当前没有业务 D1 绑定、没有 Drizzle 迁移、`db/schema.ts` 为空；Worker 仍调用旧的 AI HOT `/api/public/*` 兼容接口，而已安装 Skill 的稳定合同是 `/api/v1/*`。

本轮可以在不触碰生产 D1、生产 KV、生产站点和产业链信息网的前提下继续 Gate 1–3。现状偏差不会阻塞本地 schema、迁移、connector、事件处理和影子运行；它会被作为 Gate 4 的绑定与数据源切换前置事项保留。

**Gate 1 blocker：no blocking issue for the local-only implementation.** 生产 D1 绑定缺失是已确认的边界，不在本轮通过修改远程资源解决。

## 1. 当前数据入口

| 入口 | 代码位置 | 当前作用 | 证据/失败边界 |
| --- | --- | --- | --- |
| AI HOT selected items | `worker/index.ts` 的 `fetchAihotNews` / `fetchAihotCategory` | 以查询词抓取“数据中心、NVIDIA、液冷、光模块、电力、芯片”等新闻 | 当前调用 `https://aihot.virxact.com/api/public/items`，失败后该 Promise rejected，公开 API 只返回空的动态新闻并保留状态 |
| AI HOT daily | `worker/index.ts` 的 `fetchAihotDaily` | 生成首页/脉搏中的 AI 日报 | 当前调用 `/api/public/daily`；仅在明确 404 时查询一次 `/api/public/dailies?take=1` 再请求实际日期。新管线必须改用已安装 Skill 规定的 `/api/v1/dailies/latest` 和有界索引回退 |
| CWW benchmark | `worker/index.ts` 的 `fetchCwwBenchmark` | 读取 `https://cwwindex.today/data/latest.json` 的 CWW/CWWCN 指标 | 失败时 `benchmarkStatus=unavailable`，不伪造指数 |
| OpenRouter / Arena | `fetchOpenRouterUsage`、`fetchArenaCodeLeaderboard` | 市场/模型背景数据 | 各自失败时保留 `unavailable` 空状态，不进入事件事实库 |
| Worker 内置官方/静态记录 | `capacityRadar`、`coolingProgress`、`officialChinaChipNews`、`mnaDeals`、`constructionPulse`、`listedCompanyPulse` 等 | 在动态接口不可用时保持已有项目、公司、容量、液冷和交易展示 | 这些是源码中的静态/编辑 fallback，不包含 observation/event 版本链 |
| 公开来源链接 | `app/watch-data.ts`、Worker 静态记录 | 政策索引与 Rumor Watch 的人工维护基础 | `POLICY_BRIEFS`、`RUMOR_BRIEFS` 带来源链接和状态，但尚未进入 D1 事件模型 |

AI HOT 当前返回值在 Worker 中被压缩为 `NewsItem`；站点保留标题、摘要、来源、来源链接、时间、分类和“AI HOT” curator，但没有保存抓取时间、原始 payload、canonical URL hash、独立性分组或 connector 健康历史。

## 2. 定时任务与存储

| 部分 | 当前事实 |
| --- | --- |
| Worker cron | `wrangler.jsonc` 只有 `0 22 * * *`，即北京时间每日 06:00 |
| scheduled controller | `worker/index.ts` 的 `scheduled()` 无条件调用 `createScheduledSnapshot()`，所有计划任务都只做正式日快照 |
| KV | 绑定 `IDC_DAILY_SNAPSHOTS`；写入 `daily:YYYY-MM-DD`、`latest`、`latest-meta` |
| D1 | `db/index.ts` 预留了 `env.DB`/Drizzle helper，但 `wrangler.jsonc` 和生成的 `worker-configuration.d.ts` 都没有 `DB` 绑定；当前没有调用方 |
| Drizzle | `db/schema.ts` 只有 `export {}`；`drizzle/meta/_journal.json` 的 `entries` 为空；`drizzle/` 没有迁移 SQL |
| Sites 配置 | `.openai/hosting.json` 只有 Sites `project_id`，没有 D1 逻辑绑定；本轮不添加远程/生产资源 |

这意味着不能把计划书中的“已有早期迁移 SQL”或“现有 DB 绑定”当作事实，也不能直接生成一个假定从 `0002` 开始的迁移。当前 schema 的第一个本地迁移应从空 journal 的下一个可用编号开始，并在 Gate 1 文档中明确该选择。

## 3. API 与页面消费关系

### 公共 Worker API

- `/api/atlas`、`/api/atlas-live`、`/api/atlas-live-v2`、`/api/atlas-live-v3`、`/api/atlas-live-v4`、`/api/atlas-live-v5` 都进入同一个 `atlasApi()`。
- `atlasApi()` 先以静态内容 hash 查边缘 Cache；未命中后并发获取动态入口和 AI HOT 日报。
- 核心动态入口（AI HOT 新闻与 CWW）成功时才写边缘 Cache；失败时使用空动态集合和源码内的官方/静态记录，并返回 `newsStatus`、`benchmarkStatus`、各 section freshness、`positiveNewsStatus`、`chinaChipStatus` 等状态。
- `rumorWatch()` 把静态 `RUMOR_BRIEFS` 与满足媒体/传闻词筛选的动态候选合并；动态候选默认标成 `reported`，不会升级为已核验事实。
- `policyIndex()` 当前直接返回静态 `POLICY_BRIEFS`，不是从可验证的 T0 事件查询生成。
- `/api/daily-snapshot` 从 KV 读 `latest` 或指定日期快照；KV 没有快照时返回 404。

### 页面

- `app/page.tsx`、`app/en/page.tsx`、`app/pulse/page.tsx` 等通过 `loadInitialAtlasPayload()` 读取 Worker 注入的 `x-idc-atlas-prime` / `x-idc-atlas-meta`，由 `home-client.tsx` / `english-home.tsx` 消费既有 payload 合同。
- `app/policy/page.tsx` 与 `app/rumors/page.tsx` 读取 `loadInitialAtlasPayload()` 并将 `POLICY_BRIEFS` / `RUMOR_BRIEFS` 用于 ItemList、详情链接和静态首屏；它们没有专用 D1 route。
- `app/watch-data.ts` 是政策与 Rumor Watch 的主要静态数据源；`app/sitemap.ts` 将静态政策/传闻条目加入 sitemap。
- `app/intelligence-console-overview.tsx` 是公开站点首页/脉搏的控制台式展示组件，不是计划书要求的 `/admin/intelligence` 内部只读控制台。

现有 `atlas-live-v5` 字段和页面读取方式是兼容红线。事件数据库接入时应先做 adapter，并保留静态 `POLICY_BRIEFS`、`RUMOR_BRIEFS` fallback；本轮不切换公开 route。

## 4. 迁移与风险审计

已确认：

1. 空 schema、空 journal、无历史业务表，因此当前不存在可被新迁移覆盖的旧表。
2. `db/index.ts` 的 `env.DB` 类型与当前生成 Worker 环境类型不一致；这是预留 helper 的编译/运行边界，不是生产 D1 已存在的证据。
3. `wrangler.jsonc` 没有 D1 `database_id`，不应在本轮凭空填入生产 ID，也不应把 Sites 资源创建当作本地迁移。
4. 本地迁移验证应使用 D1 兼容 SQLite：空库执行、现有空结构快照执行、重复执行/幂等检查，以及 schema/index 读取核对。
5. API 当前的静态 fallback 没有 event-level freshness；新 adapter 必须明确 `live`、`fallback`、`partial`、`failed`、`blocked`，并保留上一版有效输出。

潜在 Gate 4 风险：生产绑定缺失、正式 Worker cron 尚未拆分、旧 AI HOT endpoint 尚未切换、现有公开 API 尚未读取 D1。这些均在本轮停线门之外。

## 5. 必须保留的并行 WIP

本审计读取到的工作区存在以下与本任务无关的改动；本轮不得清理、重置、覆盖或顺手重构：

- 已修改：`docs/daily-reviews/2026-08-06.md`。
- 未跟踪：`artifacts/`、`research-drafts/`、`docs/daily-reviews/2026-08-05-relationship-edges.json`、`docs/daily-reviews/2026-08-06-industry-network.json`、`docs/industry-network-pm-design.md`、`docs/industry-network-spec.md`、`scripts/benchmarks.json`、`scripts/fixtures/`、`scripts/build_industry_network.py`、`scripts/build_relationship_edges.py`、`scripts/estimate_edges.py`、`scripts/preview-scheduled-articles.mjs`、`scripts/sync-industry-network-data.mjs`、`tsconfig.tsbuildinfo`。
- 用户提供的本任务书 `docs/atlas-event-intelligence-upgrade-plan.md` 也是当前未跟踪文件；仅阅读，不改写。

尤其不碰：`app/industry-network/**`、`app/industry-network-data.ts`、`app/industry-network-mini.tsx`、上述 industry-network 脚本和 JSON，以及现有设计 QA/视觉 artifacts。

## 6. 本任务文件边界

### 计划新建或修改

- `docs/event-intelligence/`：审计、schema/迁移、来源注册、评分/路由、影子运行和验收报告。
- `db/schema.ts`、首个无冲突 Drizzle 迁移及其 journal。
- `worker/connectors/`：统一 envelope、AI HOT v1、RSS、JSON/API 和 registry。
- `worker/event-intelligence/`：规范化、分类、事实/双语分析占位、聚类、评分、路由、发布 adapter、运行协调。
- `scripts/` 中仅限 `event-intelligence` 影子运行、fixture 回放、报告渲染和本地迁移验证脚本。
- `app/admin/intelligence/`：不进入公开导航的本地只读控制台；仅在 `ATLAS_INTELLIGENCE_ADMIN=1` 时可访问，默认构建返回 404。
- 与上述实现直接相关的测试和最小 package/类型调整。

### 明确不碰

- 生产 D1、生产 KV、正式 Worker/站点部署、Sites hosting 操作、Cloudflare Access 或其他第三方账号。
- 公开首页、现有公开 `atlas-live-v5` route、产业链信息网数据/路由，除非后续批准的 Gate 4 明确要求 adapter 切换。
- 既有专栏、每日审阅、视觉 artifacts 和并行研究草稿。

## 7. Gate 0 判定

- 当前架构、存储、定时器、API、静态 fallback、页面消费关系：已确认。
- 计划基线与实际代码的 D1/迁移/AI HOT endpoint 偏差：已记录。
- 并行 WIP 保护边界：已记录。
- 生产环境动作：未执行。
- Gate 1：可以进入本地 schema/迁移设计；**no blocking issue for the local-only implementation**。
