# Atlas 事件信源注册表

注册表实现：`worker/connectors/registry.ts`  
当前登记来源：45 个  
当前影子启用：AI HOT v1、Federal Register API、SEC EDGAR Atom（其余先登记，逐个验证访问合同后再打开 shadow）

## 1. 字段合同

每个来源包含：`source_id`、`name`、`tier`、`publisher_type`、`region`、`language`、`independence_group`、`topics[]`、`endpoint_type`、`endpoint_url`、`parser_key`、`enabled`、`poll_interval_minutes`、`access_notes` 和 `copyright_notes`。实现额外保留 `shadowEnabled`，用于本地影子白名单，不代表生产启用。

`independence_group` 以原始采集主体为准：AI HOT 是发现组；SEC、Federal Register、公司 IR、同一通讯社分发和中文翻译不被计为相互独立的确认。T4 distributor 也不自动增加独立证据数。

## 2. 覆盖分布

| 覆盖组 | 来源示例 | 数量 | 首版角色 |
| --- | --- | ---: | --- |
| 发现层 | AI HOT | 1 | 发现/聚类入口，不确认事实 |
| 美国政府、监管、立法和电网 | Federal Register、SEC、FERC、EIA、PJM、ERCOT、CAISO、DOE、EPA、BIS、FCC、Treasury/IRS、White House、Congress | 14 | T0 原始记录 |
| 中国政府、交易所和政策 | 巨潮、HKEX、上交所、深交所、国家数据局、发改委、工信部、能源局、生态环境部、北京/上海政府 | 11 | T0 原始记录 |
| 官方公司与项目 | NVIDIA、AMD、Microsoft、Google Cloud、AWS、Meta、Oracle、CoreWeave、Galaxy、Digital Realty、Hut 8、TeraWulf | 12 | T1 一手披露 |
| 专业媒体 | Data Center Dynamics、SemiAnalysis、POWER Magazine | 3 | T3 线索和背景 |
| 主流媒体 | Reuters、Bloomberg | 2 | T2 Rumor Watch/研究线索 |
| 合计 |  | **45** |  |

## 3. 访问和版权边界

- AI HOT 只使用匿名公开 v1 只读 API，保留 `links.aihot`、`links.original`、`publishedAt`、`discoveredAt` 和 attribution；接口失败是 `failed`，不回填旧日报或训练记忆。
- Federal Register 与 SEC 只保存文档标题、链接、日期、短摘要和原始 payload 的必要元数据；SEC 请求使用可识别 User-Agent，不下载全文。
- Reuters、Bloomberg、SemiAnalysis 等可能受授权、登录或付费限制；不可访问时保留 `not-determined`/`blocked`，不绕过限制、不重建全文。
- RSS 解析器只保存标题、链接、作者、时间和裁剪到 800 字符的短摘要；不保存媒体全文。
- `enabled` 是注册表配置，不等于当前已经成功抓取；健康状态以每轮 connector 返回和本地报告为准。

## 4. 健康记录

运行时将 `ConnectorResult` 归档到 `source_sync_state` 和 `sources` 的健康字段：最后尝试/成功时间、HTTP 状态、响应时间、ETag/Last-Modified、连续失败、近 7 日成功率、本轮新增/重复/解析失败和错误原因。`304 not-modified` 保留上次有效观察，不生成新 observation，也不推进失败计数。

“无新条目”和“抓取失败”分别是 `ok` + 0 observations 与 `failed/blocked`，报告和控制台不合并它们。

## 5. 启用顺序

1. 先验证 public-api、T0 官方 API 或公开 RSS 的访问、解析和时间字段。
2. 再加入 fixture 与健康样本，确认独立性组和版权说明。
3. 仅在本地 shadow 报告连续成功且不违反访问边界后提高轮询范围。
4. Gate 4 前不把注册表 `enabled` 解释为生产切换，不修改正式 D1 或生产 cron。
