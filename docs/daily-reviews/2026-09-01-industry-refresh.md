# IDC Atlas 产业链补更 — 2026-09-01

- Cutoff：北京时间 09:55；增量检查至 11:20。
- 扫描：2,832 fetched、2,788 normalized、657 clusters、7 个来源错误。
- 新增情报判断：cutoff 后没有同时满足可靠发布时间、可归因来源和双语边界的新事件；缺日期或访问失败的线索保留为 event-local hold。
- 根因：正式公司/项目记录已发布，但没有自动交叉路由到产业链节点；生产 API 当时为算力 2、服务器与网络 0、冷却 1、电力 3、园区 3、模型 3。

## 本轮修复

1. 正式记录按内容和 signal 自动进入算力、服务器与互联、冷却、电力节点。
2. 每个节点从最多 3 条扩展到最多 6 条，并按原始发布时间倒序。
3. 同一来源 URL 只保留一条，避免公司记录和项目记录重复显示。
4. 软件类记录不会因为错误的 network signal 混入服务器与互联。
5. API 增加 `formal-cross-route-v1` 缓存版本，部署后不会继续命中旧产业链响应。
6. 未完成的 `/industry-network` 关系图仍保持下线；本轮只修复已公开的 `/industry` 与 `/en/industry`。

## 本地回读

- 算力：2 → 6。
- 服务器与网络：0 → 6。
- 冷却：1 → 2。
- 电力：3 → 6，且无重复来源 URL。
- 园区：3 → 6。
- 模型：3 → 5。

## 门禁

- lint：0 error；27 个既有 warning。
- build：通过。
- rendered HTML：50/50 通过。
- Cloudflare dry-run：通过。
- 当前状态：ready-for-release，等待选择性提交、Cloudflare/Sites 同 HEAD 部署和生产回读。
