# 工作日影响力更新与发布

用户于 2026-09-12 要求两项 IDC Atlas 更新由 GPT Terra high 执行，周一至周五北京时间 10:00 主运行、11:00 恢复、16:30 下午更新。AI HOT 日报与晚间 Terra Rumor Watch 不在本次改时范围内。周一窗口必须覆盖周末空档。两个现有自动任务已原位改写，不另建重复任务。

## 发布单位是事件及其变化

先运行已有事件聚类及 novelty 比较，再对照全站已有正式记录、媒体记录和上一轮事件。稳定 clusterKey 由实体、动作、项目/地点和时期限定；同公司不同项目不得误并。新来源、转载和翻译不自动成为新事件，不增加独立确认数。每次拟发布需列明新增事实或状态、影响对象、产业传导机制、原文依据，不能只写“值得关注”。

高影响或实质影响应改变容量兑现、经济性、供应链、技术商业化、政策约束或资本配置判断。金额、来源权威、知名公司及传播热度不能单独保证重要性。不设每日篇数配额。无实质增量内容留在候选/研究，不回流主信息流。编辑推断须与原文事实分开。

媒体写入支持 eventKey；同一事件跨来源、跨次运行更新原 ID，保留旧详情链接和来源链。首页正式与媒体共有 eventKey 时优先正式条目；产业链共享信息池同样识别 eventKey。历史无明确事件身份的不同条目不凭公司名强行合并。正式内容补录也应写入同一 eventKey，保留证据升级轨迹。

## 原文阅读覆盖

每轮分别记录八类：公司 IR；交易所/监管；完整财报与电话会；项目许可/电网；政府政策；技术文档/标准；客户/合作方；原创媒体。媒体只是线索入口，每个拟发布事件都追查对应一手材料。相关文件打不开必须明确访问缺口，可以按归因媒体发布独立合格内容，但不能写为官方确认。

阅读发现必须来自正文/附表/完整记录，不是首页 HTTP 状态、搜索摘要或新闻平台转述。覆盖台账可为 reviewed、not-determined、带理由的 not-applicable，不用数量配额催生虚假阅读。

## 强制机器校验

结构以 worker/event-intelligence/publication-review.ts 为准。本轮 publication-review.json 包含：

- schemaVersion 为 atlas-publication-review.v1，day 与 decision 同日。
- sourceCoverage 八类各一项，包含结果、URL 和阅读发现/缺口。
- events 对每个 publish decision 恰好一项，包含 eventId、稳定 clusterKey。
- change 包含 type、description、priorPublicIds；跟进必须指向旧公开 ID。
- impact 包含 level（high/material）、dimension、affected、consequence、evidenceUrls。
- sources 为实际阅读原文的 url、kind、independenceGroup、readAt、finding。
- primaryAttempts 为一手原文追查的 url、result 和 note。

先执行：

```sh
node --experimental-strip-types scripts/validate-publication-review.ts editor-decision.json publication-review.json
npm run event:intelligence:apply -- --input=editor-decision.json --review=publication-review.json
```

正式内容同样需 review 校验，然后才写对应版本化适配入口。机器校验能拒绝缺字段、重复事件、未有阅读记录的公开引用和无影响依据，不能替代 Terra 的真实阅读和产业判断。不得为通过校验填模板或捏造阅读。两个任务的完整提示词包含这些约束。

发布继续遵循 docs/luna-update-contract.md 与 docs/sites-mirror-release.md：共享锁、实际生产基线、来源/双语、测试、同 HEAD 保存部署、正式页面/API/快照/SEO 及受影响交互读回。报告独立事件数与真实来源阅读，不以抓取量冒充成效。

首页精选不再每类机械取最新六条；事实与媒体须有审查确认的 impactLevel（high/material），研究保留既有编辑发布入口。历史未复核内容仍在全部及原板块，不能把缺少评级理解为事实有误。媒体适配器从 review 写入 impactLevel；正式内容同样填写已核验评级。本次对照 DCD 原文将 JWCC 招标列为 material：潜在云采购上限影响需求观察，但不是已授予金额或实际支出。其余历史条目不自动追授影响等级。
