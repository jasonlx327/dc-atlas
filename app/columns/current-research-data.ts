import type { ScheduledResearchRecord } from "./scheduled-article-data";

const primary = (url: string, zh: string, en: string) => ({ url, zh, en, level: "primary" as const });
const reported = (url: string, zh: string, en: string) => ({ url, zh, en, level: "reported" as const });

export const currentResearchRecords: ScheduledResearchRecord[] = [
  {
    slug: "minimax-zhipu-h1-token-economics",
    imageAltZh: "MiniMax 与智谱的 API 收入、Token 调用、推理集群和亏损结构对比",
    imageAltEn: "Comparison of MiniMax and Z.ai API revenue, token usage, inference clusters and loss structure",
    articleSectionZh: "中国基础模型财报与推理经济性",
    articleSectionEn: "China foundation-model earnings and inference economics",
    topics: ["MiniMax", "Z.ai", "Zhipu", "2026 interim results", "API revenue", "token economics", "domestic AI chips", "inference"],
    sources: [
      primary("https://file.cdn.minimax.io/public/586c7995-cab1-41b5-9178-c06685b32c88.pdf", "MiniMax 2026 年中期业绩公告", "MiniMax 2026 interim results announcement"),
      primary("https://www.minimax.io/news/minimax-announces-first-half-2026-financial-results-1787744160", "MiniMax 2026 年中期业绩新闻稿与 Token 消耗口径", "MiniMax 2026 interim-results release and token-consumption metric"),
      primary("https://ir.minimax.io/corporate-filings/quarterly-results", "MiniMax 官方业绩与电话会活动页", "MiniMax official results and conference-call page"),
      primary("https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0831/2026083101539.pdf", "智谱 2026 年中期业绩公告", "Z.ai 2026 interim results announcement"),
      reported("https://m.yicai.com/news/103335505.html", "第一财经：MiniMax 中期业绩交流会", "Yicai report on the MiniMax interim-results call"),
      reported("https://m.yicai.com/news/103341523.html", "第一财经：智谱中期业绩电话会", "Yicai report on the Z.ai interim-results call"),
      reported("https://companies.caixin.com/2026-08-31/102480428.html", "财新：智谱 8 月 ARR 管理层口径", "Caixin report on Z.ai management's August ARR disclosure"),
    ],
    zh: {
      hero: "MiniMax 与智谱的 2026 年中报把中国基础模型商业化推进到一个可核验的新阶段。MiniMax 的开放平台及企业服务占收入 63.4%，智谱的开放平台及 API 占 86.5%；两家公司都从产品或项目收入转向持续调用。智谱进一步披露十万卡级国产推理、单位 Token 成本较年初下降 80% 和 API 毛利率转正。收入转换已经发生，训练投入、借款和经调整亏损仍让算力账保持开放。",
      thesis: "这两份财报支持一个有条件的结论：Token 增长已经能够形成可确认收入和正毛利，但还没有形成自给自足的模型经济。智谱给出的证据链更完整，覆盖调用量、价格、单位成本与业务毛利；MiniMax 的全球企业收入增长和整体毛利率改善同样明确，但国产算力集群与下一代推理成本目标仍来自电话会中的未来计划。两家公司都没有披露可把 Token 直接换算成 GPU 数量、MW 或数据中心收入的统一口径。",
      opening: [
        "MiniMax 上半年收入为 1.166 亿美元，同比增长 283.1%；开放平台及其他 AI 企业服务收入为 7,393 万美元，同比增长 703.1%，占总收入 63.4%。整体毛利率从 12.1% 升至 17.9%。净亏损收窄 11.0% 至 3.580 亿美元，经调整净亏损却扩大 111.2% 至 2.930 亿美元，主要经营投入仍远高于收入。",
        "智谱上半年收入为 9.539 亿元人民币，同比增长 399.7%；开放平台及 API 收入为 8.252 亿元，占 86.5%，同比增长 2,735.7%。该业务毛利率从 -0.4% 升至 24.6%，但公司整体毛利率因云业务占比上升从 50.0% 降至 26.4%。净亏损收窄 12.1% 至 20.720 亿元，经调整净亏损扩大 12.1% 至 19.641 亿元。",
        "两家公司使用不同货币、收入分类和非 IFRS 调整口径，本文不做未经披露汇率的横向规模换算。可比较的部分是方向：API 与订阅收入占比上升，推理效率改善，同时研发和融资继续支撑模型迭代。",
      ],
      sections: [
        {
          label: "01 · REVENUE MIX", heading: "API 从分发渠道变成主要收入确认方式",
          paragraphs: [
            "MiniMax 的开放平台及企业服务占比从 30.3% 升至 63.4%，增长来自付费个人与企业用户、API 调用量和 Token Plan。AI 原生产品收入也增长 100.9% 至 4,264 万美元，因此公司仍保留消费者产品与企业平台两条收入线；地域上，中国内地以外收入占 60.8%。",
            "智谱的转换幅度更大。开放平台及 API 占比从上年同期 15.2% 升至 86.5%，企业级通用大模型收入下降 54.6% 至 6,704 万元。本地化部署占比由 73.7% 降至 13.5%。这使收入从项目验收和一次性许可转向按调用与订阅持续确认，也把定价、留存、并发和服务稳定性放到同一张经营表里。",
            "智谱披露，截至公告日 MaaS Token 调用量较年初增长超过 40 倍，Coding Plan 调用量超过 23 倍，平均 API 售价上升约 101%。量价同升是强信号，但这些均为公司统计口径，缺少独立的活跃客户分层、续费率和优惠后净价。",
          ],
          metrics: [
            { label: "MiniMax 开放平台", value: "63.4%", note: "上半年收入占比；同比增长 703.1%。" },
            { label: "智谱开放平台 / API", value: "86.5%", note: "上半年收入占比；同比增长 2,735.7%。" },
            { label: "智谱 API 毛利率", value: "24.6%", note: "上年同期为 -0.4%。" },
            { label: "智谱 Token 调用", value: ">40×", note: "截至公告日相对 2026 年初，公司口径。" },
          ],
        },
        {
          label: "02 · ARR BOUNDARY", heading: "电话会 ARR 显示加速，也放大了口径风险",
          paragraphs: [
            "第一财经转述 MiniMax 管理层称，8 月 ARR 超过 8 亿美元，其中企业端约占 80%；财新转述智谱管理层称，8 月 ARR 为 16 亿美元，采用当月收入年化口径。这两项都没有写入中期业绩公告，也没有公开完整客户、合同期限、退款、折扣或流失率桥接。",
            "ARR 是当前月份或合同状态的年化读数，不等于上半年已确认收入、现金回款或未来十二个月保证收入。它适合观察 8 月业务速度，不能与半年收入直接相加，也不能在两家公司之间作无口径调整的估值比较。",
            "下一次财报需要验证三个转换：ARR 是否进入季度收入，API 业务毛利是否保持，合同负债与经营现金流是否同步增加。若 ARR 上升而确认收入、毛利或回款没有跟上，增长可能更多来自短期促销、集中客户或年化方法。",
          ],
          cards: [
            { label: "REPORTED", title: "MiniMax ARR > 8 亿美元", body: "第一财经转述管理层；约 80% 来自企业端，未写入中期公告。" },
            { label: "REPORTED", title: "智谱 ARR 16 亿美元", body: "财新转述管理层；按 8 月收入乘以 12，未写入中期公告。" },
            { label: "GATE", title: "ARR 不是已确认收入", body: "后续需用季度收入、毛利、合同负债、留存与现金回款闭环。" },
          ],
        },
        {
          label: "03 · INFERENCE ECONOMICS", heading: "智谱首次把国产卡规模、成本和毛利放进同一条链",
          paragraphs: [
            "智谱在业绩公告中把国产芯片列为主要推理资源，并披露超过 10 万颗国产芯片的集群、单位 Token 推理成本较年初下降 80%。同一公告显示，开放平台及 API 毛利率达到 24.6%，改善来自规模摊薄、提价和全栈工程优化。这四个字段首次把物理集群、调用量、价格与毛利连接起来。",
            "电话会报道补充了算力来源：自有集群、租赁和采购服务共同覆盖训练与推理。这个组合说明十万卡不等同于公司自有资产，也不能直接推算资本开支。公司仍未披露芯片供应商、有效在线卡数、功耗、吞吐、SLA 或不同来源的成本比例。",
            "MiniMax 的中报只披露整体毛利率因基础设施效率改善而升至 17.9%。第一财经转述管理层称 M3 和 H3 正在适配国产芯片，计划上线大规模国产算力集群，并把 M3.1 推理成本目标设为 M3 初始水平的约三分之一。这些是方向和目标，尚未形成智谱式的已运营集群、单位成本与业务毛利闭环。",
          ],
          steps: [
            { title: "Token 进入计费", body: "API 调用和订阅把模型使用转成持续收入。" },
            { title: "集群吸收并发", body: "模型、引擎、互联和调度决定安装算力能否形成有效 Token。" },
            { title: "单位成本下降", body: "规模摊薄与工程优化需要覆盖云服务、芯片、网络和运维。" },
            { title: "毛利验证经济性", body: "价格与成本最终在业务毛利率中汇合；现金流仍是下一道门。" },
          ],
        },
        {
          label: "04 · LOSS AND FUNDING", heading: "收入增长还没有覆盖训练周期和资金需求",
          paragraphs: [
            "MiniMax 研发开支增至 2.969 亿美元，同比增长 138.8%，公司明确称主要增量来自模型训练相关云服务。期末现金余额为 13.228 亿美元，银行借款增至 1.336 亿美元；7 月又完成约 94.44 亿港元净配售和约 64.33 亿港元净可转债融资。资本市场继续为训练与扩张提供缓冲。",
            "智谱研发开支为 21.312 亿元人民币，同比增长 33.6%。期末现金及现金等价物为 39.937 亿元，银行贷款增至 22.248 亿元；同期经调整净亏损为 19.641 亿元。其 API 业务已经产生正毛利，但集团仍需用上市融资和借款覆盖更大的研发与运营支出。",
            "两家公司披露的期末资本承诺均不重大或为零，这不表示未来算力需求很小。云服务、租赁和采购服务可能按运营费用、短期合同或其他安排确认。判断资金压力需要同时跟踪现金、借款、云服务费用、租赁负债和后续融资，不能只看固定资产承诺。",
          ],
        },
        {
          label: "05 · INFRASTRUCTURE READ-THROUGH", heading: "对数据中心链条的信号更明确，容量换算仍需克制",
          paragraphs: [
            "两份财报共同确认生产推理需求正在扩大，且编码与代理任务比一般对话更依赖长上下文、缓存、工具调用和连续运行。智谱的十万卡集群为国产加速器、互联、服务器和调度提供了已运营需求证据；MiniMax 的全球收入结构意味着推理容量需要跨区域部署或采购。",
            "公开材料没有给出每 Token 计算量、平均序列长度、缓存命中、批处理效率、芯片型号或 PUE。40 倍和 20 倍 Token 增长无法直接换算为 40 倍和 20 倍 GPU 或 MW；单位成本下降、模型架构和利用率提升可能吸收相当部分增量。",
            "未来 12 至 36 个月，最有判别力的指标是 API 毛利率能否继续上升、经调整亏损能否随收入缩小、国产集群是否披露有效在线规模与单位任务成本，以及 ARR 能否转成确认收入和经营现金流。四项同时改善，模型需求才会稳定传导为可融资的数据中心容量。",
          ],
          cards: [
            { label: "DEMAND", title: "生产调用已进入收入表", body: "API 与订阅占比上升，需求不再只由模型榜单或免费试用代理。" },
            { label: "EFFICIENCY", title: "Token 不等于固定算力", body: "模型、缓存、并发和芯片效率会改变 GPU 与 MW 的换算关系。" },
            { label: "FINANCE", title: "毛利之后还要看现金", body: "训练投入、借款与融资决定推理需求能否持续扩张。" },
          ],
        },
      ],
      conclusion: "MiniMax 与智谱已经证明，国内基础模型可以把大规模调用转成持续收入；智谱还给出了国产推理集群、单位成本和 API 毛利的首个完整经营截面。财报也同时表明，这条业务线仍依赖高额训练投入和外部资金。对 IDC Atlas 而言，需求信号从‘模型有人用’升级为‘调用能够计费并产生毛利’，下一步必须用现金转换和可复现的集群效率判断它能支撑多少长期算力容量。",
      disclosure: "资料截止 2026 年 9 月 1 日 08:45（北京时间）。财务数据、Token 调用、智谱国产芯片规模及成本变化来自两家公司中期业绩公告。MiniMax 的 8 月 ARR、企业端占比、国产芯片适配与 M3.1 成本目标，以及智谱的 8 月 ARR 和电话会问答，来自具名媒体对业绩会的转述；官方活动页可验证 MiniMax 电话会存在，但未提供可公开复用的完整逐字稿。ARR 不等于已确认收入，Token 不直接等于 GPU、MW 或数据中心收入。本文不含股价、评级、目标价或投资建议。",
    },
    en: {
      hero: "MiniMax and Z.ai's 2026 interim results move Chinese foundation-model commercialization into a more verifiable phase. Open Platform and enterprise services reached 63.4% of MiniMax revenue, while Open Platform and API reached 86.5% at Z.ai. Z.ai also disclosed 100,000-plus domestic chips in inference, an 80% decline in unit-token inference cost since the start of the year and positive API gross margin. Revenue conversion is visible; training spend, borrowings and adjusted losses keep the compute bill open.",
      thesis: "The filings support a conditional conclusion: token growth can now produce recognized revenue and positive gross profit, but it has not produced a self-funding model economy. Z.ai offers the fuller chain across volume, price, unit cost and segment margin. MiniMax also shows clear global enterprise growth and total-margin improvement, while its domestic-compute cluster and next-generation cost target remain forward plans reported from the call. Neither company provides a common bridge from tokens to GPUs, megawatts or data-center revenue.",
      opening: [
        "MiniMax reported $116.6 million of first-half revenue, up 283.1%. Open Platform and other AI-based enterprise services generated $73.9 million, up 703.1%, and represented 63.4% of revenue. Total gross margin rose from 12.1% to 17.9%. Net loss narrowed 11.0% to $358.0 million, but adjusted net loss widened 111.2% to $293.0 million, leaving operating investment far above revenue.",
        "Z.ai reported RMB953.9 million of first-half revenue, up 399.7%. Open Platform and API revenue was RMB825.2 million, or 86.5% of the total, up 2,735.7%. Segment gross margin moved from -0.4% to 24.6%, while group gross margin fell from 50.0% to 26.4% as cloud revenue diluted the legacy mix. Net loss narrowed 12.1% to RMB2.072 billion; adjusted net loss widened 12.1% to RMB1.964 billion.",
        "The companies report in different currencies and use different revenue categories and non-IFRS adjustments, so this article does not impose an unreported exchange rate to rank their scale. The comparable direction is the shift toward API and subscription revenue, improving inference efficiency and continued reliance on R&D and financing.",
      ],
      sections: [
        {
          label: "01 · REVENUE MIX", heading: "The API is becoming the primary revenue-recognition channel",
          paragraphs: [
            "MiniMax's Open Platform and enterprise-services share rose from 30.3% to 63.4%, driven by paying users, enterprise customers, API calls and Token Plan adoption. AI-native product revenue also rose 100.9% to $42.6 million, preserving two revenue tracks across products and enterprise infrastructure. Revenue outside mainland China represented 60.8% of the total.",
            "Z.ai's switch was larger. Open Platform and API moved from 15.2% of revenue a year earlier to 86.5%, while enterprise general-purpose large-model revenue fell 54.6% to RMB67.0 million. On-premise deployment fell from 73.7% of the prior full-year mix to 13.5%. Revenue is moving from project acceptance and one-time licenses toward metered calls and subscriptions, tying pricing, retention, concurrency and service reliability together.",
            "Z.ai says MaaS token volume was more than 40 times its level at the start of 2026 by the announcement date, Coding Plan volume was more than 23 times higher and average API selling price rose about 101%. Volume and price rose together, but these remain company-defined statistics without independent cohort retention, net-price or promotion data.",
          ],
          metrics: [
            { label: "MiniMax Open Platform", value: "63.4%", note: "Share of H1 revenue; up 703.1% year over year." },
            { label: "Z.ai Open Platform / API", value: "86.5%", note: "Share of H1 revenue; up 2,735.7% year over year." },
            { label: "Z.ai API gross margin", value: "24.6%", note: "Up from -0.4% a year earlier." },
            { label: "Z.ai token volume", value: ">40×", note: "Company measure from the start of 2026 to the announcement date." },
          ],
        },
        {
          label: "02 · ARR BOUNDARY", heading: "Call disclosures show acceleration and increase the need for denominator discipline",
          paragraphs: [
            "Yicai reported MiniMax management's August ARR at more than $800 million, with roughly 80% from business customers. Caixin reported Z.ai management's August ARR at $1.6 billion using monthly revenue annualized. Neither number appears in the interim-results filings, and neither is accompanied by a public bridge across customers, contract duration, refunds, discounts or churn.",
            "ARR annualizes a current month or contract state. It is not first-half recognized revenue, cash collection or guaranteed revenue for the next twelve months. The figures help measure August velocity; they should not be added to reported revenue or compared across the companies without aligned definitions.",
            "The next filing must test three conversions: ARR into quarterly revenue, API margin durability and contract liabilities plus operating cash flow. If ARR rises without a matching movement in recognized revenue, margin or cash, promotions, customer concentration or the annualization method may explain part of the signal.",
          ],
          cards: [
            { label: "REPORTED", title: "MiniMax ARR above $800M", body: "Management disclosure reported by Yicai; roughly 80% business, absent from the interim filing." },
            { label: "REPORTED", title: "Z.ai ARR at $1.6B", body: "Management disclosure reported by Caixin; August monthly revenue multiplied by twelve, absent from the interim filing." },
            { label: "GATE", title: "ARR is not recognized revenue", body: "Quarterly revenue, margin, contract liabilities, retention and cash collection must complete the bridge." },
          ],
        },
        {
          label: "03 · INFERENCE ECONOMICS", heading: "Z.ai connects domestic-chip scale, cost and margin in one disclosure chain",
          paragraphs: [
            "Z.ai identifies domestic chips as a primary inference resource and reports a cluster of more than 100,000 chips plus an 80% decline in unit-token inference cost since the start of the year. The same filing puts Open Platform and API gross margin at 24.6%, attributing the improvement to scale, pricing and full-stack engineering. Physical infrastructure, volume, price and margin now sit in one operating chain.",
            "Call reporting adds that owned clusters, leased compute and purchased services cover both training and inference. More than 100,000 chips therefore does not mean 100,000 company-owned assets or provide a direct capex estimate. Suppliers, effective online chips, power draw, throughput, SLA and the cost mix across sourcing modes remain undisclosed.",
            "MiniMax discloses only that infrastructure efficiency lifted total gross margin to 17.9%. Yicai reported management saying M3 and H3 are being adapted to domestic chips, that a large domestic-compute cluster is expected to come online and that M3.1 targets inference cost at roughly one third of M3's launch level. Those are plans and targets, not yet an operating cluster-cost-margin bridge comparable with Z.ai's filing.",
          ],
          steps: [
            { title: "Tokens enter billing", body: "API calls and subscriptions turn model use into recurring revenue." },
            { title: "Clusters absorb concurrency", body: "Models, engines, networks and scheduling determine whether installed compute creates effective tokens." },
            { title: "Unit cost falls", body: "Scale and engineering must cover cloud services, chips, networking and operations." },
            { title: "Margin tests the economics", body: "Price and cost converge in segment gross margin; cash flow remains the next gate." },
          ],
        },
        {
          label: "04 · LOSS AND FUNDING", heading: "Revenue growth has not yet covered the training cycle or funding requirement",
          paragraphs: [
            "MiniMax R&D expense rose 138.8% to $296.9 million, primarily because of cloud-service expense for training. It ended June with a $1.323 billion cash balance and $133.6 million of bank borrowings. In July it raised approximately HK$9.44 billion net from a placement and HK$6.43 billion net from convertible bonds, extending the funding buffer for training and expansion.",
            "Z.ai spent RMB2.131 billion on R&D, up 33.6%. It ended June with RMB3.994 billion of cash and cash equivalents and RMB2.225 billion of bank loans, while adjusted net loss was RMB1.964 billion. Positive API gross profit has arrived, but listing proceeds and debt still support a larger R&D and operating base.",
            "Both companies reported no significant or outstanding period-end capital commitments. That does not imply low future compute demand. Cloud services, leases and purchased compute can be recognized as operating expense, short-duration contracts or other arrangements. Cash, debt, cloud-service expense, lease liabilities and later financing need to be read together.",
          ],
        },
        {
          label: "05 · INFRASTRUCTURE READ-THROUGH", heading: "The data-center demand signal is clearer; capacity conversion remains constrained",
          paragraphs: [
            "Both filings confirm expanding production inference, with coding and agent workloads adding long context, cache, tool calls and sustained execution. Z.ai's 100,000-plus-chip cluster is operating evidence for domestic accelerators, servers, interconnect and orchestration. MiniMax's international revenue mix implies inference capacity procured or deployed across regions.",
            "Public disclosures omit compute per token, average sequence length, cache hit rate, batching efficiency, chip models and PUE. Forty-fold and twenty-fold token growth cannot be translated into forty-fold and twenty-fold GPUs or megawatts. Lower unit cost, model architecture and utilization can absorb a substantial share of the increase.",
            "Over the next 12 to 36 months, the discriminating signals are sustained API-margin expansion, adjusted losses shrinking with revenue, effective online domestic-cluster scale and cost per completed task, and ARR converting into recognized revenue and operating cash flow. Improvement across all four would support financeable, durable data-center capacity.",
          ],
          cards: [
            { label: "DEMAND", title: "Production use is in the revenue statement", body: "API and subscription mix reduce reliance on leaderboards or free trials as demand proxies." },
            { label: "EFFICIENCY", title: "Tokens are not fixed compute", body: "Models, cache, concurrency and chip efficiency alter the GPU and megawatt conversion." },
            { label: "FINANCE", title: "Cash follows gross margin", body: "Training spend, debt and financing determine whether inference demand can keep expanding." },
          ],
        },
      ],
      conclusion: "MiniMax and Z.ai have shown that Chinese foundation models can convert large-scale use into recurring revenue. Z.ai also provides the first integrated operating snapshot across domestic inference scale, unit cost and API margin. The filings simultaneously show that the business still depends on heavy training investment and external capital. For IDC Atlas, the signal has advanced from model usage to billable usage with gross profit. Cash conversion and reproducible cluster efficiency now determine how much durable compute capacity it can support.",
      disclosure: "Cutoff: September 1, 2026, 8:45 AM Beijing time. Financial data, token volume, Z.ai's domestic-chip scale and cost change come from the companies' interim-results announcements. MiniMax's August ARR, business mix, domestic-chip adaptation and M3.1 cost target, together with Z.ai's August ARR and call Q&A, come from attributed media reports of the results calls. MiniMax's official event page verifies the call but does not provide a complete transcript licensed for republication. ARR is not recognized revenue, and tokens do not directly equal GPUs, megawatts or data-center revenue. This article contains no price target, rating or investment advice.",
    },
  },
  {
    slug: "nvidia-fy27-q2-five-tests",
    imageAltZh: "NVIDIA AI 工厂从晶圆、HBM、机架和网络延伸到园区电力与信用支持的分析剖面",
    imageAltEn: "Analyst cutaway of NVIDIA AI factories spanning wafers, HBM, racks, networking, campus power and credit support",
    articleSectionZh: "AI 芯片财报与基础设施金融",
    articleSectionEn: "AI semiconductor earnings and infrastructure finance",
    topics: ["NVIDIA", "FY2027 Q2", "Vera Rubin", "Blackwell Ultra", "AI infrastructure", "memory", "data-center finance"],
    sources: [
      primary("https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/q2fy27pr.htm", "NVIDIA FY2027 Q2 业绩公告", "NVIDIA fiscal Q2 2027 earnings release"),
      primary("https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/q2fy27cfocommentary.htm", "NVIDIA FY2027 Q2 CFO 评论", "NVIDIA fiscal Q2 2027 CFO commentary"),
      primary("https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm", "NVIDIA FY2027 Q2 Form 10-Q", "NVIDIA fiscal Q2 2027 Form 10-Q"),
      primary("https://investor.nvidia.com/events-and-presentations/events-and-presentations/event-details/2026/NVIDIA-2nd-Quarter-FY27-Financial-Results/default.aspx", "NVIDIA FY2027 Q2 官方电话会与回放", "NVIDIA fiscal Q2 2027 official call and replay"),
      reported("https://www.marketbeat.com/instant-alerts/transcript-nvidia-q2-earnings-call-highlights-2026-08-26/", "NVIDIA FY2027 Q2 电话会重点记录", "NVIDIA fiscal Q2 2027 call highlights"),
    ],
    zh: {
      hero: "962 亿美元收入证明 AI 需求仍在加速，但这次财报真正改变估值框架的，不是又一次超预期，而是 NVIDIA 已经把风险表从晶圆和 HBM 扩展到客户账期、园区租约、土地电力担保与项目融资。它越来越像 AI 基础设施的总组织者，也因此承担过去芯片供应商不需要承担的信用和交付风险。",
      thesis: "FY2027 Q2 同时给出两组方向相反的证据。经营面，数据中心收入达到 890.23 亿美元、环比增长 18%，AI 云、工业与企业客户增长快于超大规模客户，平台需求正在拓宽。资产负债表面，供应与产能承诺升至 2,790 亿美元，总未来承诺达到 3,660 亿美元，担保最大敞口达到 1,085 亿美元，应收天数从 45 天升至 60 天。NVIDIA 的增长飞轮更强了，但它对客户融资和物理基础设施兑现也更敏感。",
      opening: [
        "截至 2026 年 7 月 26 日的季度，NVIDIA 收入为 962.21 亿美元，环比增长 18%、同比增长 106%；数据中心收入为 890.23 亿美元，环比增长 18%、同比增长 117%。GAAP 与非 GAAP 毛利率均为 75.0%，GAAP 经营利润为 637.34 亿美元。公司给出的下一季度收入指引为 1,080 亿美元，上下浮动 2%，且没有计入任何中国数据中心计算收入。",
        "数据中心内部的结构比总量更有信息。超大规模客户收入为 487.10 亿美元，环比增长 13%；AI 云、工业与企业客户收入为 403.13 亿美元，环比增长 25%、同比增长 138%。这意味着新增需求不再只由少数 hyperscaler 推动，AI 原生公司、企业、主权客户以及通过 AI 云采购的 hyperscaler 都在扩大采购。",
        "但增长质量不能只看利润表。经营现金流从上一季度的 503 亿美元降至 241 亿美元；应收账款增至 631 亿美元，DSO 从 45 天升至 60 天，原因是公司向部分投资级客户的大型多年期协议提供了更长账期；库存从 258 亿美元升至 316 亿美元，为第三季度 Vera Rubin 上市做准备。收入、应收、库存和现金流已经明显不同步。",
      ],
      sections: [
        {
          label: "01 · THE PRINT", heading: "增长没有降速，但引擎从单一 GPU 需求变成完整平台扩张",
          paragraphs: [
            "Blackwell Ultra 的爬坡推动数据中心收入继续创纪录。Compute & Networking 分部收入为 882.99 亿美元，环比增长 18%、同比增长 114%。公司称 Blackwell 架构已占收入绝大部分，说明产品切换没有造成财务断层；Vera Rubin 已进入全面生产，并在 CoreWeave、Google Cloud、Microsoft Azure、Oracle 与 Nebius 等伙伴运行机架。",
            "更重要的是客户结构。ACIE 的环比增速几乎是 hyperscale 的两倍，支持需求广度正在扩大的判断。不过公司本季度把一名客户从 ACIE 重分类为 hyperscale，并重述了前期数据，因此类别趋势应以重述后的可比口径观察，不能把分类变化误认为新增客户。",
            "中国数据中心 Hopper 出货不足数据中心收入的 1%，下一季度指引继续假设中国数据中心计算收入为零。当前业绩因此不是靠中国恢复推动；反过来，中国也没有被纳入增长缓冲。任何出口政策或本土替代变化都会形成额外情景，而非公司基准。",
          ],
          metrics: [
            { label: "总收入", value: "$96.221B", note: "环比 +18%，同比 +106%。" },
            { label: "数据中心", value: "$89.023B", note: "环比 +18%，同比 +117%。" },
            { label: "Hyperscale", value: "$48.710B", note: "环比 +13%，同比 +102%。" },
            { label: "ACIE", value: "$40.313B", note: "环比 +25%，同比 +138%；使用重述后口径。" },
          ],
        },
        {
          label: "02 · MARGIN AND SUPPLY", heading: "毛利率仍强，下一阶段的约束却从 GPU 转向 HBM、互联与整机同步",
          paragraphs: [
            "75% 毛利率表明 Blackwell Ultra 的产品组合仍能覆盖爬坡成本。但公司下一季度毛利率指引降至 74%，电话会进一步表示第四季度可能在 71% 至 72% 触底，FY2028 稳定在 72% 至 73%。这不是需求转弱的单一信号，而是 Vera Rubin 切换、内存成本与整机物料结构共同作用的结果。",
            "最硬的供应链证据是采购承诺：供应和产能承诺从上一季度的 1,190 亿美元升至 2,790 亿美元，主要与内存采购有关，其中本财年剩余时间、FY2028 和 FY2029 分别约 920 亿、870 亿和 880 亿美元。NVIDIA 正用多年采购锁住 HBM 与相关产能，供应安全换来了更大的需求预测风险。",
            "若终端需求继续上行，这些承诺强化 NVIDIA 的交付能力；若产品节奏、客户融资或园区上线延迟，库存和不可取消采购会放大利润表压力。研究的焦点因此不再是‘HBM 有没有’，而是每一代 HBM、GPU、网络与机架能否在同一季度进入可验收系统。",
          ],
          cards: [
            { label: "MARGIN", title: "产品切换成本开始显性化", body: "74% 的 Q3 指引和更低的 Q4 电话会区间，需要与 Rubin 物料、内存价格和定价调整一起读。" },
            { label: "MEMORY", title: "2,790 亿美元供应承诺", body: "主要为内存采购，锁住交付能力，也把多年需求预测写进资产负债表外承诺。" },
            { label: "INVENTORY", title: "库存增至 316 亿美元", body: "为 Rubin 上市备货；后续要看库存周转是否随收入同步恢复。" },
          ],
        },
        {
          label: "03 · CAPITAL PERIMETER", heading: "NVIDIA 已从卖设备进入帮助客户取得土地、电力和信用",
          paragraphs: [
            "CFO 评论披露的未来承诺合计 3,660 亿美元：除 2,790 亿美元供应与产能外，还包括 290 亿美元云服务协议、250 亿美元尚未开始的数据中心租约、250 亿美元股权投资和 80 亿美元资本支出。这些并非同一性质的债务，也不等于当期现金支出，但共同显示公司正在为研发、供应链、模型生态和数据中心容量提前占位。",
            "公司还披露了面向第三方的 560 亿美元 AI 云协议与未开始租约。其商业模式不再止于设备前端销售：若满足条件，NVIDIA 还会参与 AI 云面向第三方客户产生的收入分成。上行时，这带来硬件之外的经常性收益；下行时，利用率、客户信用与租约转让都会进入风险判断。",
            "担保是本季最需要被单独定价的变化。现有 AI 云土地、电力与外壳担保最大敞口为 35 亿美元；PORTS-Pike 4.25GW 项目的担保上限为 1,050 亿美元，随数据中心 ready-for-service 分批生效，并随 OpenAI 支付租金而下降。合计最大担保敞口为 1,085 亿美元。这不是已发生损失，也不是 NVIDIA 立即支付 1,085 亿美元，但它是条件满足后可能进入信用风险表的上限。",
          ],
          steps: [
            { title: "供应承诺", body: "NVIDIA 先锁晶圆、内存、封装和系统产能，承担需求预测误差。" },
            { title: "土地电力与外壳", body: "项目方建设园区，NVIDIA 的信用支持帮助项目取得融资。" },
            { title: "系统销售与租约", body: "设备验收形成收入，部分租约计划转让给第三方。" },
            { title: "客户现金流", body: "AI 云与模型公司最终需要用利用率和收入覆盖长期租金与算力付款。" },
          ],
        },
        {
          label: "04 · CALL READ-THROUGH", heading: "电话会最重要的不是需求口号，而是供应、毛利和融资三条边界",
          paragraphs: [
            "管理层在电话会中强调，按客户自己的预测，需求增长可能接近翻倍，但供应链限制压低了可交付增速。这句话把当前瓶颈从终端需求移到 HBM、先进封装、网络、机架和园区上线。它支持景气持续，却也意味着收入预测越来越依赖跨公司、跨工程环节的同步。",
            "毛利率问答给出了比当季 75% 更重要的路径：Rubin 初期成本和内存价格将令毛利率在 Q4 进一步下降，随后公司希望通过提价和效率在 FY2028 稳定。若收入继续高增长、毛利率按期企稳，这是产品迭代成本；若毛利率下降同时应收、库存和担保敞口继续上升，则风险会从供应周期转向资本效率。",
            "对于融资安排，正确的问题不是 NVIDIA 是否‘循环融资’，而是风险是否被充分计价和隔离。需要继续追踪担保何时生效、是否有抵押与追索、租约是否成功转让、收入分成是否来自独立第三方需求，以及客户违约时 NVIDIA 的实际现金义务。没有这些字段，不能把 1,085 亿美元上限直接等同损失，也不能把它忽略为脚注。",
          ],
        },
        {
          label: "05 · NEXT QUARTER", heading: "下一季度要用五个硬指标检验增长质量",
          paragraphs: [
            "第一看 1,080 亿美元收入指引是否兑现；第二看 Rubin 收入、库存周转与毛利率能否给出一致的产品切换桥；第三看 DSO 是否从 60 天回落，经营现金流是否重新接近利润增长；第四看 2,790 亿美元供应承诺是否继续扩张；第五看 PORTS-Pike 与其他 AI 云担保是否出现 ready-for-service、融资和租约转让的正式节点。",
            "反面情景也已经清楚：内存与系统成本上升快于提价，Rubin 上线慢于库存积累，客户账期继续拉长，或园区融资依赖更多 NVIDIA 信用支持。任何一项单独出现都不必然破坏增长；若同时出现，市场就需要把 NVIDIA 从高毛利芯片平台重新估值为带有项目融资风险的基础设施组织者。",
          ],
          cards: [
            { label: "REVENUE", title: "$108B 是否按期交付", body: "不含中国数据中心计算收入，是当前可比基准。" },
            { label: "CASH", title: "DSO 与经营现金流", body: "收入增长需要重新转化为现金，而不是继续延长客户账期。" },
            { label: "RUBIN", title: "库存、毛利与上线同步", body: "备货只有在系统验收和收入确认后才完成转换。" },
            { label: "CREDIT", title: "担保生效与风险转让", body: "追踪 ready-for-service、租约转让和客户付款，而非只看 GW。" },
          ],
        },
      ],
      conclusion: "这不是一份简单的‘AI 需求仍强’财报。NVIDIA 用更大的采购承诺、客户账期、长期租约和信用担保，把供应链与客户资本结构同时锁进自己的增长系统。它因此获得更强的订单可见度和平台控制力，也把内存、园区、电力、融资与客户现金流变成新的共同风险。下一阶段最重要的指标不是 GPU 订单，而是每一美元承诺能否按期变成系统验收、客户收入与现金回款。",
      disclosure: "资料截止 2026 年 8 月 27 日 09:20（北京时间）。财务数字、承诺和担保来自 NVIDIA 8-K、CFO 评论与 10-Q；电话会区间与管理层表述按官方回放和公开电话会记录交叉核验。承诺与最大担保敞口不等于当期现金支出或已发生损失。本文不含股价、评级、目标价或投资建议。",
    },
    en: {
      hero: "$96.2 billion of revenue confirms that AI demand is still accelerating. The more consequential change is that NVIDIA's risk perimeter now reaches beyond wafers and HBM into customer payment terms, long leases, land-and-power guarantees and project finance. It is becoming the organizer of AI infrastructure, gaining control while accepting credit and delivery risks that a conventional chip supplier would not carry.",
      thesis: "Fiscal Q2 2027 produced two sets of evidence moving in opposite directions. Operationally, Data Center revenue reached $89.023 billion, up 18% sequentially, and AI-cloud, industrial and enterprise customers grew faster than hyperscalers. On the balance-sheet perimeter, supply and capacity commitments rose to $279 billion, total future commitments reached $366 billion, maximum guarantee exposure reached $108.5 billion, and DSO moved from 45 to 60 days. The growth flywheel is stronger, but it is also more sensitive to customer finance and physical delivery.",
      opening: [
        "For the quarter ended July 26, 2026, NVIDIA reported $96.221 billion of revenue, up 18% sequentially and 106% year over year. Data Center revenue was $89.023 billion, up 18% and 117%, respectively. GAAP and non-GAAP gross margin were both 75.0%, and GAAP operating income was $63.734 billion. Q3 revenue is guided to $108 billion, plus or minus 2%, with no China Data Center compute revenue assumed.",
        "The mix inside Data Center is more informative than the headline. Hyperscale revenue was $48.710 billion, up 13% sequentially. AI Clouds, Industrial and Enterprise revenue was $40.313 billion, up 25% sequentially and 138% year over year. Incremental demand is broadening beyond a small set of hyperscalers into AI-native companies, enterprises, sovereigns and hyperscalers consuming infrastructure through AI clouds.",
        "Growth quality cannot be read from the income statement alone. Operating cash flow fell to $24.1 billion from $50.3 billion in Q1. Accounts receivable reached $63.1 billion and DSO rose from 45 to 60 days because NVIDIA extended terms on large multi-quarter agreements with certain investment-grade customers. Inventory increased to $31.6 billion from $25.8 billion ahead of Vera Rubin. Revenue, receivables, inventory and cash flow are no longer moving together.",
      ],
      sections: [
        {
          label: "01 · THE PRINT", heading: "Growth did not slow, but the engine is becoming a full-platform expansion",
          paragraphs: [
            "The Blackwell Ultra ramp pushed Data Center to another record. Compute & Networking revenue was $88.299 billion, up 18% sequentially and 114% year over year. NVIDIA says Blackwell represents the vast majority of revenue, so the transition did not create a financial air pocket. Vera Rubin is in full production, with racks running at CoreWeave, Google Cloud, Microsoft Azure, Oracle and Nebius.",
            "Customer mix matters more. ACIE grew almost twice as fast sequentially as hyperscale, supporting broader demand. NVIDIA did reclassify one customer from ACIE to hyperscale and recast prior periods, so the comparison must use the restated series rather than treating classification as a new customer event.",
            "China Hopper shipments were less than 1% of Data Center revenue, and Q3 again assumes zero China Data Center compute revenue. The quarter was not driven by a China reopening; China is also absent as a buffer. Export policy and local substitution remain scenarios outside management's base case.",
          ],
          metrics: [
            { label: "Revenue", value: "$96.221B", note: "Up 18% sequentially and 106% year over year." },
            { label: "Data Center", value: "$89.023B", note: "Up 18% sequentially and 117% year over year." },
            { label: "Hyperscale", value: "$48.710B", note: "Up 13% sequentially and 102% year over year." },
            { label: "ACIE", value: "$40.313B", note: "Up 25% sequentially and 138% year over year on the restated basis." },
          ],
        },
        {
          label: "02 · MARGIN AND SUPPLY", heading: "Margin remains exceptional while the constraint shifts into memory and system synchronization",
          paragraphs: [
            "A 75% gross margin shows that Blackwell Ultra mix still covered ramp cost. Q3 margin is guided to 74%, however, and management indicated on the call that the trough could be 71% to 72% in Q4 before stabilizing at 72% to 73% in fiscal 2028. That path combines Vera Rubin launch costs, memory inflation and system bill of materials; it is not a single demand signal.",
            "The hardest supply evidence is contractual. Supply and capacity commitments jumped from $119 billion to $279 billion, primarily for memory. Roughly $92 billion falls in the remainder of FY2027, $87 billion in FY2028 and $88 billion in FY2029. NVIDIA is securing several years of HBM and related capacity, trading supply certainty for greater forecast risk.",
            "If end demand continues higher, those commitments protect delivery. If product cadence, customer finance or campus activation slips, inventory and non-cancellable procurement can amplify margin pressure. The question has moved beyond HBM availability to whether each generation of memory, GPUs, networking and racks reaches customer acceptance in the same window.",
          ],
          cards: [
            { label: "MARGIN", title: "Transition cost becomes visible", body: "Q3 at 74% and the lower Q4 call range must be read with Rubin materials, memory pricing and price actions." },
            { label: "MEMORY", title: "$279B of supply commitments", body: "Mostly memory procurement, securing delivery while embedding a multi-year demand forecast." },
            { label: "INVENTORY", title: "$31.6B ahead of Rubin", body: "The next test is whether inventory turns recover with system revenue." },
          ],
        },
        {
          label: "03 · CAPITAL PERIMETER", heading: "NVIDIA is helping customers secure land, power and credit, not merely selling equipment",
          paragraphs: [
            "CFO commentary lists $366 billion of future commitments: $279 billion of supply and capacity, $29 billion of cloud services, $25 billion of uncommenced data-center leases, $25 billion of equity investments and $8 billion of capital expenditure. These are not one class of debt or an immediate cash outlay. Together, they show NVIDIA reserving positions across supply, R&D infrastructure, model ecosystems and data-center capacity.",
            "A separate $56 billion schedule covers third-party AI-cloud agreements and uncommenced leases. The model can extend beyond upfront infrastructure sales: when criteria are met, NVIDIA can participate in revenue generated by AI clouds from third-party customers. Upside is recurring participation; downside introduces utilization, customer credit and lease-transfer execution.",
            "Guarantees are the change that deserves explicit pricing. Existing land, power and shell guarantees for AI-cloud partners carry $3.5 billion of maximum exposure. The initial 4.25GW PORTS-Pike phase carries a guarantee cap of $105 billion, activated in phases as facilities become ready for service and declining as OpenAI makes lease payments. Total maximum guarantee exposure is $108.5 billion. It is neither a realized loss nor an immediate $108.5 billion payment, but it is a conditional credit ceiling.",
          ],
          steps: [
            { title: "Supply commitment", body: "NVIDIA reserves wafers, memory, packaging and systems, taking demand-forecast risk." },
            { title: "Land, power and shell", body: "Developers build campuses while NVIDIA credit support improves financeability." },
            { title: "System sale and lease", body: "Hardware acceptance creates revenue; some leases are expected to be reassigned." },
            { title: "Customer cash flow", body: "AI-cloud and model-company utilization ultimately must cover rent and compute payments." },
          ],
        },
        {
          label: "04 · CALL READ-THROUGH", heading: "The useful call signal is the boundary among supply, margin and finance",
          paragraphs: [
            "Management said customer forecasts imply demand growth could be closer to doubling, with supply limiting deliverable growth. That shifts the near-term bottleneck from end demand into HBM, packaging, networking, racks and campus activation. It supports the cycle while making revenue more dependent on synchronization across companies and engineering layers.",
            "The margin path matters more than the current 75%. Rubin launch costs and memory prices are expected to push Q4 lower before price and efficiency actions stabilize fiscal 2028. If growth continues and margin follows that bridge, the decline is transition cost. If margin falls while receivables, inventory and guarantees keep rising, the issue becomes capital efficiency.",
            "The right financing question is not whether every arrangement is circular. It is whether risk is priced and isolated. Watch guarantee activation, collateral and recourse, successful lease assignment, revenue share generated by independent third-party demand, and NVIDIA's cash obligation after customer default. The $108.5 billion ceiling should neither be booked as a loss nor dismissed as a footnote.",
          ],
        },
        {
          label: "05 · NEXT QUARTER", heading: "Five hard measures now define earnings quality",
          paragraphs: [
            "First, delivery against the $108 billion revenue guide. Second, a consistent bridge among Rubin revenue, inventory turns and margin. Third, whether DSO retreats from 60 days and operating cash flow reconnects with profit growth. Fourth, whether $279 billion of supply commitments expands again. Fifth, whether PORTS-Pike and other guarantees reach formal ready-for-service, financing and lease-transfer milestones.",
            "The counter-case is also observable: memory and system cost rises faster than pricing, Rubin activation lags inventory, customer terms extend further, or campuses require more NVIDIA credit support. Any one can be manageable. In combination, they would require NVIDIA to be valued less like a pure high-margin platform and more like an infrastructure orchestrator with project-finance exposure.",
          ],
          cards: [
            { label: "REVENUE", title: "Deliver the $108B guide", body: "Zero China Data Center compute revenue is the stated comparison base." },
            { label: "CASH", title: "DSO and operating cash flow", body: "Growth must convert back into cash rather than continuously longer customer terms." },
            { label: "RUBIN", title: "Inventory, margin and activation", body: "Prebuild completes its conversion only after system acceptance and revenue." },
            { label: "CREDIT", title: "Guarantee activation and transfer", body: "Track ready-for-service, lease assignment and customer payment, not only gigawatts." },
          ],
        },
      ],
      conclusion: "This is not a simple AI-demand-stays-strong quarter. NVIDIA is locking supply and customer capital structure into the same growth system through larger purchase commitments, longer payment terms, long leases and credit guarantees. That creates stronger visibility and platform control while making memory, campus power, finance and customer cash flow joint risks. The next decisive metric is not the GPU order. It is whether every dollar committed becomes accepted systems, customer revenue and collected cash on schedule.",
      disclosure: "Cutoff: August 27, 2026, 9:20 AM Beijing time. Financial figures, commitments and guarantees come from NVIDIA's 8-K, CFO commentary and 10-Q; call ranges and management statements were cross-checked against the official replay and public call records. Commitments and maximum guarantee exposure are not current cash expenditure or realized loss. No share prices, ratings, targets or investment advice are included.",
    },
  },
  {
    slug: "glm-5-3-flash-china-chips",
    imageAltZh: "GLM-5.3-Flash 模型、国产 AI 加速器、高带宽互联与分离式推理集群的技术剖面",
    imageAltEn: "Technical cutaway of GLM-5.3-Flash, Chinese AI accelerators, high-bandwidth interconnect and disaggregated inference",
    articleSectionZh: "国产模型与推理基础设施",
    articleSectionEn: "Chinese models and inference infrastructure",
    topics: ["Ox Alpha", "GLM-5.3-Flash", "Z.ai", "Zhipu", "Chinese AI chips", "inference", "SGLang", "open weights"],
    sources: [
      primary("https://z.ai/blog/glm-5.3-flash", "Z.ai：GLM-5.3-Flash 官方发布与国产芯片服务说明", "Z.ai GLM-5.3-Flash launch and Chinese-chip serving disclosure"),
      primary("https://huggingface.co/zai-org/GLM-5.3-Flash", "Z.ai GLM-5.3-Flash 官方模型卡与 MIT 权重", "Z.ai GLM-5.3-Flash model card and MIT weights"),
      primary("https://docs.z.ai/guides/llm/glm-5.3-flash", "Z.ai GLM-5.3-Flash API 文档", "Z.ai GLM-5.3-Flash API documentation"),
      primary("https://openrouter.ai/collections/programming", "OpenRouter 编程模型使用榜与 Ox Alpha 服务说明", "OpenRouter programming usage ranking and Ox Alpha service description"),
      reported("https://wallstreetcn.com/articles/3780350", "华尔街见闻：智谱确认 Ox Alpha 属于 GLM 系列新迭代", "Wallstreetcn report on Z.ai confirming Ox Alpha as a new GLM iteration"),
      reported("https://wallstreetcn.com/articles/3780371", "华尔街见闻转引晚点：国产卡规模与潜在供应商线索", "Wallstreetcn republication of LatePost on reported Chinese-chip scale and possible suppliers"),
    ],
    zh: {
      hero: "Ox Alpha 的热度来自匿名、免费和榜单，但 GLM-5.3-Flash 真正值得研究的部分发生在榜单背后：智谱把一个 320B 总参数、18B 激活参数的原生多模态模型，运行在数万颗国产加速器组成的大规模集群上，并通过模型架构、内核、量化、互联和分离式调度把端到端性能提升到初始基线的 3 倍。国产算力的竞争正在从‘能否适配’进入‘能否经济地提供生产服务’。",
      thesis: "现有一手证据足以确认三件事：GLM-5.3-Flash 已正式发布并开放 MIT 权重；智谱过去一周确实在大规模国产 AI 芯片集群上提供该模型服务；生产系统覆盖数万颗国产加速器。证据还不足以确认三件事：具体采用哪家芯片、模型训练是否使用国产卡、所谓与主流 NVIDIA GPU 成本相当是否能跨工作负载复现。Ox Alpha 与智谱 GLM 系列的归属已获媒体确认，但智谱官方发布页没有直接使用 Ox Alpha 名称，因此本文以公开产品名 GLM-5.3-Flash 为事实主体。",
      opening: [
        "Ox Alpha 于 8 月 20 日以匿名 stealth model 身份出现在 OpenRouter，提供约 100 万 token 上下文、多模态输入和工具调用，并在免费窗口内迅速冲到平台使用榜前列。华尔街见闻转述彭博报道称，智谱已确认它是新的 GLM 系列模型，并计划当晚开放权重。",
        "同日，Z.ai 正式发布 GLM-5.3-Flash，并在 Hugging Face 放出 MIT 权重。公开模型卡给出 320B 总参数、18B 激活参数、原生多模态、30T token 多模态预训练语料和新训练基座。产品形态、上下文、模态与发布时点都与 Ox Alpha 的预览高度一致，但官方博客没有逐字写出‘Ox Alpha 等于 GLM-5.3-Flash’。专业表述应保留这一个命名边界，而不是继续把匿名期流量当成正式产品披露。",
        "OpenRouter 的榜单读数会随类别、时间窗口和抓取时点变化，因此只适合证明短期使用热度，不适合直接推算独立用户、付费收入、模型总调用或智谱商业收入。更有价值的证据来自智谱自己披露的生产集群与服务栈。",
      ],
      sections: [
        {
          label: "01 · MODEL ARCHITECTURE", heading: "Flash 不是 GLM-5.3 的简单降价版，而是为推理成本重新设计的基座",
          paragraphs: [
            "GLM-5.3-Flash 与此前 GLM-5.3 的关系容易被误读。官方说明它采用新训练基座，不是只在 GLM-5.2 基座上继续后训练。模型总参数约 320B、每 token 激活 18B、45 层；相比 GLM-4.5 系列的 355B 总参数、32B 激活参数和 92 层，计算路径明显收缩。",
            "长上下文成本由混合注意力处理：线性注意力负责局部依赖，稀疏注意力通过轻量 indexer 找全局相关信息，IndexPool 再把四个索引键压成一个。智谱称，相比 GLM-5.3，Flash 的注意力计算量降低 3 倍，KV cache 降低 4.4 倍。这些是厂商测算，不是独立云端成本审计，但它们解释了为什么 1M 上下文能在资源更受限的硬件上进入服务。",
            "原生多模态同样不是附加接口。30T token 语料包含多模态预训练，模型卡把图像和视频编码器写入架构；智谱又用视觉反馈强化前端、游戏、3D、办公文档和 computer-use 工作流。对于推理基础设施，这会增加编码、prefill、decode 三类负载之间的差异，也推动分离式调度。",
          ],
          metrics: [
            { label: "总参数 / 激活参数", value: "320B / 18B", note: "官方模型卡；MoE 每 token 仅激活部分专家。" },
            { label: "层数", value: "45", note: "相较 GLM-4.5 系列的 92 层显著减少。" },
            { label: "注意力计算", value: "约 1/3", note: "相较 GLM-5.3 的官方架构测算。" },
            { label: "KV cache", value: "约 1/4.4", note: "相较 GLM-5.3 的官方测算，仍需真实工作负载验证。" },
          ],
        },
        {
          label: "02 · CHINESE CHIPS", heading: "正式结论是国产卡大规模推理，不是国产卡完成训练",
          paragraphs: [
            "智谱官方写明，过去一周已在大规模国产 AI 芯片集群上提供 GLM-5.3-Flash 服务，底层是高带宽互联和针对硬件优化的服务栈；生产架构覆盖数万颗国产加速器。这是比‘完成适配’更强的信号，因为它对应真实路由、并发、故障与持续服务，而不是单机 demo。",
            "华尔街见闻转引《晚点 LatePost》称，线上推理可能调用超过 10 万张国产芯片，潜在供应商包括华为、摩尔线程与海光；报道同时写明智谱没有回应供应商信息。这个数量与厂商名单属于媒体线索，正文的正式规模口径仍采用智谱官方的‘数万颗’，不据此分配订单或收入。",
            "但公开材料只谈 serving。它没有说明 30T token 基座训练使用了哪种硬件，也没有给出国产卡训练占比。把‘国产卡推理集群’写成‘全流程国产卡训练’会跨越证据边界。官方同样没有披露具体芯片品牌，因此不能据此在华为昇腾、寒武纪、摩尔线程、沐曦或其他厂商之间分配订单。",
            "智谱称国产卡单芯片的计算和显存容量更受限，尤其在 1M 上下文下受内存容量与带宽约束。这一坦率描述反而提高了技术信息量：国产替代不是把 CUDA 调用改一个后端名称，而是需要模型架构、并行策略、缓存格式、通信和调度共同重写性能边界。",
          ],
          cards: [
            { label: "VERIFIED", title: "数万颗国产加速器提供服务", body: "智谱官方披露的是过去一周的规模化推理服务。" },
            { label: "NOT DISCLOSED", title: "具体芯片供应商", body: "公开材料未点名，不能按厂商映射订单或收入。" },
            { label: "NOT DISCLOSED", title: "训练硬件", body: "30T token 预训练语料不等于训练过程使用国产卡。" },
          ],
        },
        {
          label: "03 · SERVING STACK", heading: "3 倍提升来自系统共设计，而不是芯片峰值算力突然改变",
          paragraphs: [
            "智谱在 SGLang 之上构建了针对 GLM-5.3-Flash 的推理引擎，组合了线性注意力与 LM head 的节点内张量并行、ReplaySSM、W8A8 量化、INT8/FP8/BF16 混合 KV cache 量化以及 Layer Split。每一项都在用额外计算、通信或精度管理换显存与带宽。",
            "集群层采用 Encode–Prefill–Decode 分离架构，把多模态编码、提示词 prefill 和逐 token decode 放入独立可扩展的 worker 池。这样做的意义是三类任务不再争抢同一块卡：长上下文 prefill 可以单独扩容，decode 可以按并发调度，视觉编码也能独立控制。国产卡的单芯片短板被集群级资源池部分吸收。",
            "官方称相对同一硬件的初始基线，端到端服务性能提高 3 倍，并达到与主流 NVIDIA GPU 可比的硬件效率和单位 token 成本。这里的比较缺少芯片型号、精度、批次、延迟、功耗、SLA 和利用率，不能扩大为国产芯片对所有 NVIDIA GPU 的普遍等效；它更准确地证明了在一个已知模型和高度优化栈上，经济性可以被工程追回。",
          ],
          steps: [
            { title: "模型先减少激活计算", body: "18B 激活参数和 45 层降低每 token 基础计算量。" },
            { title: "注意力压低长上下文缓存", body: "线性与稀疏注意力、IndexPool 减少 1M 上下文的 KV 压力。" },
            { title: "内核和量化适配硬件", body: "W8A8 与混合 cache 量化用精度管理换容量和带宽。" },
            { title: "EPD 把集群拆成资源池", body: "编码、prefill 与 decode 分别调度，提高数万卡集群利用率。" },
          ],
        },
        {
          label: "04 · ECONOMICS", heading: "开源权重与低价 API 会把竞争从模型评分推向每个完成任务的成本",
          paragraphs: [
            "MIT 权重意味着开发者可以在自有集群部署、修改和商业使用，SGLang、vLLM、TokenSpeed 与 KTransformers 已提供或计划提供支持。对国产芯片厂商，这创造了一个公开目标：不再等待闭源厂商授权，而是围绕同一 checkpoint 优化内核、量化、互联和调度，并在相同任务上比较性能。",
            "智谱称 Flash 价格只有 GLM-5.3 的十分之一，并给 Coding Plan 用户 3 倍可用额度。低价会扩大调用，却也可能把更多价值转移到服务效率而不是模型毛利。真正应比较的是完成一个可验收 coding/agent 任务的总成本，包括重试、上下文缓存、工具执行、延迟和人工接管，而不是输入 token 单价。",
            "Ox Alpha 的匿名免费期提供了高强度流量测试，也可能帮助模型团队观察真实 agent 工作负载。OpenRouter 榜单可以证明开发者愿意尝试，但免费、匿名和限时供给会放大流量。只有转入正式付费端点后，留存、错误率、每任务成本与稳定性才构成商业验证。",
          ],
        },
        {
          label: "05 · INDUSTRY READ-THROUGH", heading: "对国产算力产业链，最重要的增量是软件栈开始形成规模经验",
          paragraphs: [
            "数万卡生产服务会产生单机适配无法提供的数据：不同长度请求如何排队、哪类 kernel 限速、通信如何放大尾延迟、量化在哪些任务失真、节点故障如何迁移。这些反馈可以回流模型架构和推理引擎，形成模型帮助优化自身服务系统的循环。",
            "这也重新定义 NVIDIA 与国产卡的竞争边界。训练前沿大模型仍高度依赖最强算力、互联和成熟软件；推理则更容易围绕固定模型做专门优化。GLM-5.3-Flash 的证据首先指向推理替代加速，而不是训练市场已被重写。若类似工作负载持续扩大，竞争会从芯片峰值性能转向整套集群的单位任务成本。",
            "接下来需要四类正式披露：具体硬件与卡数、不同上下文和并发下的吞吐与延迟、集群功耗与可用率、付费端点的留存和收入。缺少这些数据，最稳健的结论仍是‘国产卡已能支撑大规模前沿模型推理’，而不是‘国产卡已全面追平 NVIDIA’。",
          ],
          cards: [
            { label: "HARDWARE", title: "点名芯片与拓扑", body: "只有具体型号、节点和互联，产业链映射才成立。" },
            { label: "PERFORMANCE", title: "给出吞吐、P99 与功耗", body: "平均成本可比不足以证明生产 SLA 可比。" },
            { label: "COMMERCIAL", title: "从免费流量转向付费留存", body: "榜单热度不是收入，正式端点的续用才是需求。" },
            { label: "TRAINING", title: "单独核验训练底座", body: "推理国产化不能自动推导训练国产化。" },
          ],
        },
      ],
      conclusion: "Ox Alpha 是一个成功的发布事件，GLM-5.3-Flash 则是一项更重要的基础设施实验。智谱没有靠一句‘适配国产卡’结束叙事，而是公开了模型架构、缓存、量化、并行和 EPD 调度如何共同补偿硬件约束。它证明国产算力的可用性正在从兼容性走向经济性，但下一阶段必须用具体芯片、吞吐、延迟、功耗、SLA 和付费留存把这项公司披露变成可复现的行业结论。",
      disclosure: "资料截止 2026 年 8 月 27 日 09:20（北京时间）。GLM-5.3-Flash 的架构、国产芯片服务规模、性能提升与成本比较均为 Z.ai 官方披露，尚未经过 IDC Atlas 独立基准复现；具体芯片厂商和训练硬件未披露。Ox Alpha 身份来自媒体对智谱确认的报道，Z.ai 官方发布页未直接使用该别名。OpenRouter 使用量是动态平台读数，不等同于独立用户、收入或市场份额。",
    },
    en: {
      hero: "Ox Alpha drew attention through anonymity, free access and leaderboards. The more important GLM-5.3-Flash story sits behind the ranking: Z.ai served a 320B-total, 18B-active natively multimodal model across a large cluster of tens of thousands of Chinese accelerators, then used architecture, kernels, quantization, interconnect and disaggregated scheduling to improve end-to-end performance by 3x over its initial baseline. Chinese compute is moving from compatibility toward production economics.",
      thesis: "Primary evidence establishes three facts: GLM-5.3-Flash is released with MIT weights; Z.ai served it over the past week on a large-scale cluster of Chinese AI chips; and the production system spans tens of thousands of domestically developed accelerators. It does not establish which vendor supplied the chips, whether training ran on Chinese hardware, or whether claimed cost parity with mainstream NVIDIA GPUs generalizes across workloads. Media reported that Z.ai confirmed Ox Alpha as a new GLM iteration, but Z.ai's launch page does not use the Ox Alpha name. The documented product, GLM-5.3-Flash, is therefore the factual center of this analysis.",
      opening: [
        "Ox Alpha appeared on OpenRouter on August 20 as an anonymous stealth model with roughly one million tokens of context, multimodal input and tool use. Free access quickly pushed it to the top of platform usage rankings. Wallstreetcn cited Bloomberg in reporting that Z.ai confirmed it as a new GLM-series model and planned to release weights that night.",
        "Z.ai then released GLM-5.3-Flash and MIT-licensed weights on Hugging Face. The model card documents 320B total parameters, 18B active parameters, native multimodality, a 30T-token multimodal pretraining corpus and a newly trained base. Product shape, context, modalities and timing align strongly with the Ox preview, but the official blog does not literally state that Ox Alpha equals GLM-5.3-Flash. That naming boundary should remain visible.",
        "OpenRouter leaderboard readings change with category, time window and retrieval point. They demonstrate short-term attention rather than unique users, paid revenue, total model demand or Z.ai revenue. The more durable evidence is Z.ai's disclosed production cluster and serving stack.",
      ],
      sections: [
        {
          label: "01 · MODEL ARCHITECTURE", heading: "Flash is not merely a discounted GLM-5.3 endpoint; its base was redesigned for inference cost",
          paragraphs: [
            "GLM-5.3-Flash is easy to misclassify. Z.ai says it starts from a newly trained base rather than only extending post-training on the GLM-5.2 base. It has about 320B total parameters, activates 18B per token and uses 45 layers. Against the GLM-4.5 family at 355B total, 32B active and 92 layers, the active path is substantially smaller.",
            "Hybrid attention targets long-context cost. Linear attention captures local dependencies, sparse attention retrieves global context through an indexer, and IndexPool compresses four index keys into one. Z.ai estimates 3x lower attention compute and 4.4x smaller KV cache than GLM-5.3. Those are vendor calculations rather than an independent cloud-cost audit, but they explain how one-million-token workloads can move onto hardware with tighter memory and bandwidth.",
            "Native multimodality is also architectural, not just an API wrapper. The 30T-token corpus includes multimodal pretraining and the model configuration includes vision components. Z.ai trained visual feedback for front-end, game, 3D, office-document and computer-use workflows. Serving consequently has distinct encode, prefill and decode loads that benefit from separate scheduling.",
          ],
          metrics: [
            { label: "Total / active parameters", value: "320B / 18B", note: "Official model card; MoE activates only part of the model per token." },
            { label: "Layers", value: "45", note: "Materially fewer than 92 in the GLM-4.5 family comparison." },
            { label: "Attention compute", value: "~1/3", note: "Z.ai estimate versus GLM-5.3." },
            { label: "KV cache", value: "~1/4.4", note: "Z.ai estimate versus GLM-5.3; production workloads still need validation." },
          ],
        },
        {
          label: "02 · CHINESE CHIPS", heading: "The verified claim is large-scale Chinese-chip inference, not Chinese-chip training",
          paragraphs: [
            "Z.ai says it served GLM-5.3-Flash over the past week on a large-scale cluster of Chinese AI chips, supported by high-bandwidth interconnect and a hardware-optimized stack. The production architecture spans tens of thousands of domestically developed accelerators. That is stronger than a compatibility announcement because it covers real routing, concurrency, failures and continuous service rather than a single-node demo.",
            "Wallstreetcn republished LatePost reporting that online inference may use more than 100,000 Chinese chips, with Huawei, Moore Threads and Hygon named as possible suppliers; the same report says Z.ai did not comment on suppliers. The count and vendor list remain media leads. This analysis therefore retains Z.ai's official ‘tens of thousands’ scale and does not allocate orders or revenue.",
            "The disclosure is specifically about serving. It does not identify the hardware used for the 30T-token base training or the share of training performed on domestic accelerators. Chinese-chip inference cannot be rewritten as full-stack Chinese-chip training. Z.ai also does not name the chip supplier, so the evidence cannot allocate orders among Ascend, Cambricon, Moore Threads, MetaX or another vendor.",
            "Z.ai acknowledges that individual chips are constrained by compute and memory, especially memory capacity and bandwidth at one-million-token context. That candor is analytically useful: substitution is not a backend rename. Model architecture, parallelism, cache formats, communication and scheduling must jointly redraw the performance envelope.",
          ],
          cards: [
            { label: "VERIFIED", title: "Tens of thousands of Chinese accelerators", body: "Z.ai discloses production inference service over the past week." },
            { label: "NOT DISCLOSED", title: "The chip supplier", body: "No public vendor name means no defensible order or revenue attribution." },
            { label: "NOT DISCLOSED", title: "Training hardware", body: "A 30T-token pretraining corpus does not identify the accelerators used to train it." },
          ],
        },
        {
          label: "03 · SERVING STACK", heading: "The 3x gain came from system co-design, not a sudden change in chip peak performance",
          paragraphs: [
            "On top of SGLang, Z.ai built an inference engine combining intra-node tensor parallelism for Linear Attention and the LM head, ReplaySSM, W8A8 quantization, hybrid INT8/FP8/BF16 KV-cache quantization and Layer Split. Each technique exchanges computation, communication or precision management for memory capacity and bandwidth.",
            "At cluster scale, Encode-Prefill-Decode disaggregation moves multimodal encoding, prompt prefill and token-by-token decode into separately scheduled worker pools. Long-context prefill can scale independently, decode can follow concurrency, and visual encoding no longer competes for the same device. Cluster resource pools absorb part of the single-chip constraint.",
            "Z.ai reports a 3x end-to-end serving improvement over its initial baseline on the same hardware, reaching hardware efficiency and per-token cost comparable to mainstream NVIDIA GPUs. Chip model, precision, batch, latency, power, SLA and utilization are not disclosed. The claim therefore supports workload-specific engineering parity, not general equivalence between Chinese accelerators and every NVIDIA platform.",
          ],
          steps: [
            { title: "Reduce active compute", body: "18B active parameters and 45 layers reduce the baseline work per token." },
            { title: "Compress long-context state", body: "Hybrid attention and IndexPool reduce KV pressure at one million tokens." },
            { title: "Adapt kernels and precision", body: "W8A8 and hybrid cache formats exchange precision management for capacity and bandwidth." },
            { title: "Pool encode, prefill and decode", body: "EPD scheduling raises utilization across tens of thousands of accelerators." },
          ],
        },
        {
          label: "04 · ECONOMICS", heading: "Open weights and low API pricing move competition from model scores to cost per completed task",
          paragraphs: [
            "MIT weights allow self-hosting, modification and commercial use, while SGLang, vLLM, TokenSpeed and KTransformers provide or plan support. Chinese chip vendors now have a public target: optimize kernels, quantization, interconnect and scheduling around the same checkpoint, then compare results on the same workloads without waiting for access to a closed model.",
            "Z.ai says Flash is priced at one tenth of GLM-5.3 and gives Coding Plan users three times the usable quota. Lower price can expand calls while moving value from model margin into serving efficiency. The right denominator is cost per accepted coding or agent task, including retries, cache, tool execution, latency and human intervention, not input-token price alone.",
            "Ox Alpha's anonymous free period created a high-intensity traffic test and likely exposed real agent workloads. OpenRouter rankings show willingness to try the model, but free, anonymous and time-limited supply amplifies usage. Retention, error rate, task cost and reliability after migration to a paid endpoint are the commercial test.",
          ],
        },
        {
          label: "05 · INDUSTRY READ-THROUGH", heading: "The most important gain for China's compute chain is large-scale software experience",
          paragraphs: [
            "A production service spanning tens of thousands of accelerators generates evidence that a single-node port cannot: queue behavior across context lengths, kernel bottlenecks, communication-driven tail latency, quantization failure modes and node recovery. Those observations can flow back into model architecture and the inference engine, creating a loop in which the model helps optimize its own serving system.",
            "This also clarifies the competitive boundary with NVIDIA. Frontier training still places the highest burden on peak compute, interconnect and mature software. Inference allows deeper optimization around a fixed model. GLM-5.3-Flash first supports faster substitution in inference, not a rewritten training market. If workloads grow, competition moves from chip peak performance to cluster cost per completed task.",
            "Four disclosures would turn the company claim into an industry benchmark: exact hardware and topology, throughput and latency by context and concurrency, cluster power and availability, and paid-endpoint retention and revenue. Until then, the defensible conclusion is that Chinese accelerators can support large-scale frontier-model inference, not that they broadly match NVIDIA.",
          ],
          cards: [
            { label: "HARDWARE", title: "Name the chip and topology", body: "Order and revenue mapping requires exact devices, nodes and interconnect." },
            { label: "PERFORMANCE", title: "Publish throughput, P99 and power", body: "Average cost parity does not prove production-SLA parity." },
            { label: "COMMERCIAL", title: "Move from free traffic to paid retention", body: "Leaderboard attention is not revenue; continued paid use is demand." },
            { label: "TRAINING", title: "Verify training separately", body: "Domestic inference does not establish domestic training." },
          ],
        },
      ],
      conclusion: "Ox Alpha was a successful launch event; GLM-5.3-Flash is the more important infrastructure experiment. Z.ai moved beyond a compatibility claim and described how model architecture, cache, quantization, parallelism and EPD scheduling compensate for hardware limits. That demonstrates a move from compatibility toward economics. Exact chips, throughput, latency, power, SLA and paid retention are now required to turn a company disclosure into a reproducible industry conclusion.",
      disclosure: "Cutoff: August 27, 2026, 9:20 AM Beijing time. GLM-5.3-Flash architecture, Chinese-chip serving scale, performance improvement and cost comparison are Z.ai disclosures and have not been independently reproduced by IDC Atlas. Chip suppliers and training hardware are not disclosed. Ox Alpha attribution comes from media reporting of Z.ai's confirmation; the official Z.ai launch page does not use the alias. OpenRouter usage is dynamic platform data, not unique users, revenue or market share.",
    },
  },
];
