# IDC Atlas 产业链信息网 · 功能规格 v0.1（草案）

状态：待审阅。本文只定义功能与数据规则，不包含任何生产改动。

## 1. 目标

用户从一家公司进入，可以看到它与上下游实体之间的公开关系（投资、订单、供货、租约、供电、冷却、合作、并购、竞争、监管），每条关系都有来源、时间、金额/容量口径和来源层级标签。数据由 AI 每日自动维护，无人值守。

## 2. 范围

- 节点：先覆盖 `app/entity-directory.ts` 中的公司/项目，再扩展到产品、园区、电源等节点（待定）。
- 关系：投资、订单、供货、租约/托管、供电、冷却、合作、并购/持股、竞争、监管。
- 语言：中文与英文双语；英文侧保留原始出处。
- 边界：不输出股价、评级、目标价、交易信号或投资建议；不做全量供应链地图（商业机密本就不可得），只做“可追溯的公开高信号关系”。

## 3. 数据模型

### 3.1 关系词表（方向语义固定，谁 → 谁）

| relation | 方向 | 含义 | 主要来源 |
| --- | --- | --- | --- |
| invests-in / finances | 甲 → 乙 | 投资、融资、平台出资 | SEC、官方公告 |
| orders-from / buys-from | 买方 → 供方 | 订单、采购 | 招标结果、公告、媒体 |
| supplies | 供方 → 买方 | 供货/交付 | 官网、公告 |
| leases-to / hosts | 出租/托管方 → 承租方 | 租约、托管 | 8-K、租约披露 |
| powers / cools | 供电/冷却方 → 受益方 | 供电、液冷 | 并网公告、合同 |
| partners-with | 甲 ↔ 乙 | 合作、合资、联合体 | 联合公告 |
| acquires / owns | 收购方 → 标的 | 并购、持股 | 8-K、交易所公告 |
| competes-with | 甲 ↔ 乙 | 竞争 | 财报、官方材料 |
| regulates | 监管方 → 被监管方 | 监管、许可、审查 | 官方文件 |

### 3.2 边字段（在 watch 包 `relationship_edges` 基础上扩展）

```json
{
  "from": "nvidia",
  "relation": "supplies",
  "to": "microsoft",
  "direction": "nvidia->microsoft",
  "amount": 1300000000,
  "amount_currency": "USD",
  "capacity_mw": null,
  "capacity_unit": "critical-it-mw",
  "status": "delivering",
  "observed_at": "2026-08-06T00:00:00+08:00",
  "valid_from": null,
  "valid_to": null,
  "evidence_label": "official" | "management" | "media",
  "source_item_ids": ["itm-..."],
  "last_verified_at": "2026-08-06T13:30:00+08:00"
}
```

- `status` 阶梯：订单/供货：`announced → signed → delivering → billed`；投资：`mou → signed → closed → exited`；租约：`announced → signed → occupied`。
- `evidence_label` 只表示来源层级：`official`（T0/T1 官方披露）、`management`（管理层表述，含电话会）、`media`（媒体发布）。**媒体来源只写“媒体”，不写是否核验**。
- 金额/容量与单位不得混用；来源未给出明确口径时置空，不允许估算。
- 估算引擎可选入参（由 `scripts/estimate_edges.py` 消费，未提供则走空缺）：`segment`（产品细分，如 `gpu-h100` / `rack-gb200` / `hbm3e`）、`quantity` + `quantity_unit`（数量口径）、`capacity_racks`（租约机柜数）、`region`（`cn` 等，用于区域基准选择）。

## 4. 全自动管线（无人值守）

1. 每日随 `idc-atlas-3` 运行，先扫 T0/T1（SEC、交易所、公司 IR/新闻室），再扫重点财经媒体（T2）。
2. 重点财经媒体沿用 `atlas-watch/references/source-registry.json`：Reuters、Bloomberg、MarketWatch、FT、WSJ、CNBC、Nikkei Asia、SCMP、财新、The Information、第一财经、财联社、证券时报、21 世纪经济报道；可选扩展华尔街见闻、界面、36 氪（需登记后加入 registry）。
3. 对每条候选执行 atlas-watch 抽取：实体对齐（别名/代码 → entity slug）→ 关系抽取（词表内）→ 口径解析 → 去重聚类 → 自动校验。
4. 自动校验不通过（缺来源、关系不在词表、单位缺失、实体未对齐）则不入库，记入当日运行台账。
5. 合并策略：同一条边按 `(from, relation, to)` upsert；`observed_at` 更新、`last_verified_at` 滚动；不重复建边。
6. 无人工复核；唯一例外是规则本身由编辑定义（本文件）。

## 5. UI

### 5.0 场景化入口（总览页顶部）

- 六条预设链入口：全图 / HBM 供应链 / 液冷供应链 / 电力与并网 / 算力租赁链 / 存储与设备链 / 国产算力链。
- 每个场景一键配置：聚焦节点 + 预展开节点集 + 关系筛选 + 分层布局，并显示场景说明横幅。
- 数据规模感：页头实时显示「收录 N 实体 · M 关系（模拟数据）· 更新日期」。

### 5.1 公司详情页内嵌「上下游关系」

- 视觉语法遵循 atlas-cover `references/visual-system.md`：象牙纸 `#F3EFE5`、炭黑 `#151A18`、森林绿 `#1D433A`、鼠尾草 `#78877D`、锈橙点缀 `#C65D3A`（约占 5–10%），细线工程稿风格；不采用 SaaS 仪表盘样式。
- 布局：中央公司节点，左侧上游（incoming），右侧下游（outgoing）。
- 筛选：关系类型 chips + 时间范围（近 90 天/全部）。
- 边卡片：对方实体、关系标签、状态阶梯、金额/容量（带单位）、生效-失效、来源链接、层级徽标。
- 层级徽标：`官方披露`（实心）、`管理层`（琥珀）、`媒体`（灰色虚线，只写“媒体”）。
- 点击边展开来源卡：原始链接、观察时间、最后核验时间。
- 移动端 390px：上游/下游变上下两列卡片流，无横向滚动。

### 5.2 独立总览页 `/industry-network`（双语）

- 交互图谱：默认一跳跃认；可按实体类型、关系类型、地区、层级、时间筛选；点击节点聚焦该公司的上下游。
- 多跳探索：节点带 `+N` 展开徽标，逐跳展开/收起邻居；「重置视图」回到聚焦公司的一跳范围。
- 路径查询：任意两点间自动计算最短关系路径（BFS，无向），高亮路径节点与边并显示跳数。
- 布局切换：力导向 / 分层（上游-公司-下游列）/ 径向三种布局。
- 边证据抽屉：点击图上的边，右侧抽屉展示关系方向、金额/容量口径、状态阶梯、观察与核验时间、来源层级、原始链接。
- 时间轴回放：底部时间轴按 `observed_at` 筛选/播放；晚于当前时间点的边弱化，随播放展示关系随时间出现的过程。
- 分组圈选：按产业类别（芯片 / 设备与冷却 / 云与平台 / 模型与算力）绘制 Hull 轮廓与组标签，可开关。
- 实体档案联动：节点面板提供「公司档案」入口，链接至站点实体档案页 `/companies/[slug]`；档案页未建实体显示「档案待建」。
- 搜索定位：输入公司名（支持别名/简称）定位到该公司的上下游网络。
- 导出与分享：导出图 PNG；分享链接携带 `focus/layout/expanded/path` 状态参数，打开后自动恢复视图。
- 双公司对比：并排展示两家公司的上游/下游清单，高亮共同上游与共同下游。
- 传导分析：按指定关系（供货/订单/冷却/投资/租约）沿出方向 BFS 逐跳展示传导路径与跳数；媒体层边标注为线索，仅作基础设施传导、不构成投资判断。
- 关注列表：节点面板可关注/取消关注（localStorage 持久化），关注下拉可一键跳转；正式版对接订阅提醒。
- 金额披露规则：金额只展示已披露数值（官方披露 / 最新媒体报道），带来源与日期；未披露项显示为灰色「未披露（不估算）」，禁止推算或编造。
- 实体关键披露：节点面板展示该实体最重要的已披露数据（如 Hut 8 已签约 IT 949MW / 合同价值约 266 亿美元），带官方/媒体标签。
- 视图降噪：默认隐藏边标签与节点 tick 小字（悬停或放大 ≥1.6 倍时显示），提供「完整视图」开关；媒体边默认更淡更细。
- 默认线图规则：默认只绘制与聚焦公司直接相连的边（星型 ego 视图），邻居之间的边默认隐藏，可通过「邻居边」开关显示。
- 默认布局方向：左→右（上游在左 · 公司居中 · 下游在右，直线连接），与卡片区上下游方向一致；「上→下」「力导向」「径向」作为可选布局。
- 分类聚合视图（可选）：可切换为聚焦公司 + 产业分类聚合节点（芯片 / 设备与冷却 / 云与平台 / 模型与算力 / 电力 / 园区，各带「N 家 · M 条」），点击聚合节点展开该类成员，点空白返回聚合。参考 cytoscape.js-expand-collapse / complexity-management 的复合节点模式。
- 3D 探索模式（可选）：基于 Three.js 的 3D 视图——球体节点按类别着色、边按证据层级着色，支持拖拽旋转 / 滚轮缩放 / 自动旋转 / 点击聚焦重排 / 悬停标签 / 标签与全部边开关；与 2D 共用同一数据文件（`industry-network-data.js`）。
- 首次引导：首次打开显示可关闭的引导条（「上游在左 · 下游在右 · 点击分类/节点查看详情 · 点击边查看金额与来源」），localStorage 记忆已读状态。
- 工具栏分组折叠：视图 / 数据 / 工具三组，默认只显示「视图」，其余收进「更多 ▾」（来源、金额筛选、搜索、路径、对比、传导、导出、分享、关注、重置等）。
- 图卡联动：点击图上的节点或边，下方上下游卡片列表同步高亮对应关系并滚动定位；点击空白清除高亮。
- 公司档案入口：页面顶部为聚焦公司的档案头（名称 / ticker / 关键披露 / 「公司档案 ↗」链接至 `/companies/[slug]`），随聚焦公司切换更新；模拟公司档案页内嵌「上下游关系」板块。
- 移动端策略：390px 默认先显示公司档案头与上下游卡片列表（数据优先），图谱默认收起，通过「查看图谱」按钮展开；不缩小桌面图强行适配。
- 数据筛选与覆盖率：工具栏提供「全部 / 有金额 / 仅官方」筛选；页头实时显示金额披露率（如 6/108）。
- 保留 Atlas 编辑气质（纸张底色、等宽标签、网格线、克制红蓝），不做通用 SaaS 仪表盘。
- 页面含口径说明：每日更新、来源层级定义、单位口径、媒体边只作线索。

## 6. 质量门与发布

- 数据 schema 校验脚本：必填字段、词表、单位、实体 slug 可解析。
- 沿用现有链路：`npm test` → commit → `npm run deploy` → 正式域名 API 回读 → 同 HEAD Sites 发布 → 线上 URL 验证。
- 试运行期只写台账和统计，不自动发布。

## 7. 试点与验收

- 试点 7 天：对目录内现有公司每日跑抽取，记录每日边数、类型分布、来源层级分布、未通过校验数量。
- 验收标准：7 天累计 ≥ 40 条有效边；`official + management` 占比 ≥ 30%；无未附来源的边入库。

## 8. 待决事项

- 媒体边是否上线公开显示（当前方案：显示，仅标“媒体”）。
- 节点是否扩展到产品/园区/电源。
- 总览图交互技术方案（自绘 SVG vs 引入图库）。

## 9. 数据补全方案（金额 / 数值，替代「未披露」空置）

### 9.1 金额三层策略（已在原型 v0.15 落地）

1. 披露值：官方 / 最新媒体报道的数值，带来源链接与日期，标「官方」或「媒体」。
2. 估算值：仅当存在可辩护的公开基准时生成，标「估算」徽标，边详情展示：估算区间、方法（如「HBM 出货量 × 均价区间」「代工收入占比法」「PPA 电价 × 容量」「机柜单价 × 出货量」）、基准来源、置信度（高/中/低）、免责声明（估算为研究推断，非公司披露，不作交易依据）。
3. 空缺：无公开基准 → 显示「暂无可靠估算」，禁止编造或填补。

页面呈现：卡片三态（披露值 / 估算值 + 方法 tooltip / 暂无可靠估算）；页头显示「披露 X/108 · 估算 Y」覆盖率；「有金额」筛选同时包含披露与估算。

引擎实现：`scripts/estimate_edges.py` 读取边存储 + `scripts/benchmarks.json`，按规则生成估算（区间 + 方法 + 基准 + 置信度）或标注空缺原因；`--check` 模式用 fixture 自检（1 披露 / 3 估算 / 1 空缺）。

### 9.2 生产数据采集管线（参考高分开源项目）

- 官方一手源（优先）：
  - SEC EDGAR：参考 `edgartools`（约 2.4k star，10-K/10-Q/8-K + XBRL→JSON）、`edgar-crawler`（约 534 star）、`sec-edgar-downloader`。
  - A 股 / 港股公告与财报：参考 `AKShare`（2026 年第三方口径约 1.4 万–1.8 万 star，A股/港股/美股数据接口，无 Key、学术用途）、Tushare（约 1.5 万 star）、CNINFO/SSE/SZSE/HKEX 官方接口。
  - 公司 IR / 新闻室（JS 重页面）：Crawlee / Playwright（Node 无头浏览器抓取）。
- 财经媒体层：沿用 atlas-watch 来源注册表（Reuters / Bloomberg / 财新 / 第一财经 / 财联社 等），RSS + 搜索发现 + 授权页面抓取，遵守付费墙与 robots 边界。
- 抽取：LLM 结构化抽取（参考 `fin-insight-extract` / `news_db` 模式），输出关系边 schema（from/to/relation/金额/单位/状态/时间/证据），进入 `build_relationship_edges.py` 自动校验。
- 估算引擎：维护 `scripts/benchmarks.json` 基准目录（草稿已建：TrendForce HBM 参考、GPU 均价、中国机柜租金、PPA 电价、整机柜单价、液冷造价、Arm 版税率，含来源 URL、发布日与有效期）；按关系类型 × 可获取量生成估算区间 + 方法 + 置信度；无基准 → 空缺，不生成估算。
- 更新：随每日自动化运行，披露率与估算覆盖率随扫描上升；每次变更保留来源与时间戳。

### 9.3 参考项目

- 爬虫框架：Scrapy、Crawlee（Node）、Playwright / Puppeteer、awesome-crawler。
- 金融数据：edgartools、edgar-crawler、sec-edgar-downloader、AKShare、Tushare、finance-news-aggregator、news_db、fin-insight-extract、Galpha（SEC 结构化管线）。

## 10. 落地状态（2026-08-06）

- 数据模块：`app/industry-network-data.ts`（50 实体 / 108 关系 / 33 估算 / 7 场景，由原型数据机械化生成，`google → alphabet` 对齐实体目录 slug）。
- 全链路页：`/industry-network` 与 `/en/industry-network`（左→右布局、焦点切换、关系抽屉、金额三态、场景预设、移动端卡片优先）。文案遵循用户友好原则：一句话引导、无方法论术语、「暂未公开」而非生硬标注。
- 公司档案内嵌：`app/companies/[slug]` 新增「产业链上下游」板块（`app/industry-network-mini.tsx`），页脚入口改为「探索产业链信息网」。
- 入口：产业页 hero 增加「查看产业链信息网」链接；sitemap 收录中英两条。
- 估算引擎：`scripts/benchmarks.json` + `scripts/estimate_edges.py`（`--check` 自检：1 披露 / 3 估算 / 1 空缺）。
- 验证：`npm test` 43/43 通过（含新增双语信息网与实体内嵌两条测试）；新增文件 lint 0 错误、tsc 0 错误。

### 10.1 每日数据闭环（已打通）

1. `scripts/build_industry_network.py <watch-packet.json> --date YYYY-MM-DD --output <store.json>`：watch 包 → `build_relationship_edges.py` 归一化校验（含 `segment/quantity/capacity_racks/region` 透传与新别名）→ `estimate_edges.py` 估算 → 按 `(from, relation, to)` upsert 合并种子 store（`scripts/fixtures/seed-industry-network.json`）→ 输出合并 store + 统计。
2. `node scripts/sync-industry-network-data.mjs <store.json>`：用合并 store 重新生成 `app/industry-network-data.ts`，站点数据随之更新。
3. 2026-08-06 首跑：watch 包 5/5 条边通过（SpaceX↔NVIDIA 合作、Partners Group→AVK 收购、Anthropic→Volta/Nexus 订单与租约、Volta↔Bitdeer 合作），合并后 113 边 / 56 实体；新边无量纲时如实空缺，不编造。
4. 待办：把该两步挂进每日自动化（与 `idc-atlas-3` 同调度），并逐步以真实边替换演示种子边。
