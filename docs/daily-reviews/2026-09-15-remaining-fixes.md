# 剩余问题修复与证据边界

## 本轮维护范围

- 已评分但尚无发布/拒绝结果的前日候选，原实现只增加 alreadyScoredCount 后 continue，导致从当日包消失。现在复用评分并保留条目；跨日测试确认不新增模型请求。
- source report 增加 reviewWindowStart，brief/fallback/ingest 共用。扫描支持 --review-since；离线 replay 必须显式输入、输出和起点，不覆盖原件、不抓取、不写数据库、不刷新 source generatedAt。
- 以 2026-09-12T22:16:13+08:00 回放 2026-09-15T07:24:18.022Z 原扫描，572 → 579，找回 7 条窗口外候选。此次并非新扫描，也不宣称独立审阅完成。
- Google Cloud 失效 RSS 改为官方文章列表，实测解析 15 个文章 URL；Intel 失效 RSS 改为现行官方 newsroom，解析 40 个文章 URL。仅接受同源文章路径，排除栏目、外链和通用导航；缺失披露日期保持 null。
- 23 条旧项目/公司记录补齐 titleEn/summaryEn。仅翻译现有版本文案，保留原披露日期、来源、金额单位和未来/在建/投运边界，不宣称重新审计历史财务事实。
- constructionPulse/listedCompanyPulse 纳入静态内容版本哈希，防止其文案修改漏掉 API 缓存失效。

## 来源重试

Treasury 本次 HTTP 200；Google Cloud 与 Intel 在新解析路径可读取文章链接。以上仅为传输/解析恢复，不是完整原文审阅。

仍有 8 个缺口：ndrc、miit、mep-china、beijing-gov、shanghai-gov 连接失败；xai-news 与 ap-technology 为 HTTP 403；36kr 官方订阅地址返回 HTML，继续保持 parse-error。NDRC/MIIT 错误为 TLS 建立前 ECONNRESET；NDRC 直连同样失败。未关闭 TLS 校验、未绕过访问限制、未将失败源移出覆盖分母。

## 验证与未完成项

相关采集/跨日/判断回归、类型检查、lint 通过；完整构建测试与部署读回见同名 release receipt。新增旧文案测试检查 23 条记录均有自然英文、来源和日期，并检查容量与未来交付边界。

579 条候选中，上一轮 1 条已补录，其余 578 条仍待逐项原文和增量审阅。50 家核心公司、7 家 China XPU 与 20 家互联/CPO 的完整披露覆盖仍未闭合。显式起点解决本次已有原始扫描的窗口截断，不证明未抓到的历史记录已经找回；禁止将本轮技术维护报为全站语义日更完成。

此轮不新增新闻、不前移全站 reviewed 日期、不改写既有定时快照。只发布经过测试的流程修复与旧文案英文补齐。
