import type { ScheduledResearchRecord } from "./scheduled-article-data";

export const metaBlackrockElPaso: ScheduledResearchRecord = {
  slug: "meta-blackrock-el-paso",
  imageAltZh: "正在建设的数据中心园区通过变电站和输电线路接入电网，分层资产结构表现建设期融资",
  imageAltEn: "A data-center campus under construction linked to a substation and transmission grid, with layered infrastructure financing",
  articleSectionZh: "AI 基建融资与园区交付",
  articleSectionEn: "AI infrastructure finance and campus delivery",
  topics: ["Meta", "BlackRock", "El Paso", "data-center finance", "leases", "residual value", "power", "AI infrastructure"],
  sources: [
    { url: "https://about.fb.com/news/2026/07/meta-announces-new-venture-with-blackrock-to-develop-data-center-in-el-paso/", zh: "Meta：与 BlackRock 建立 El Paso 数据中心合资平台", en: "Meta: Strategic venture with BlackRock for El Paso", level: "primary" },
    { url: "https://about.fb.com/news/2026/04/infrastructure-explained-meta-data-centers/", zh: "Meta：数据中心基础设施说明", en: "Meta: Infrastructure Explained — Data Centers", level: "primary" },
    { url: "https://about.fb.com/news/2026/06/meta-partners-with-reliance-on-ai-enabled-data-center-in-india/", zh: "Meta / Reliance：印度 AI 数据中心租赁与能源安排", en: "Meta / Reliance: AI-enabled data center in India", level: "primary" },
    { url: "https://about.fb.com/news/2026/07/teachers-local-businesses-win-as-meta-expands-louisiana-data-center/", zh: "Meta：路易斯安那 Richland Parish 扩建与能源安排", en: "Meta: Richland Parish expansion and energy arrangement", level: "primary" },
    { url: "https://www.bankofengland.co.uk/financial-stability-report/2026/july-2026", zh: "英格兰银行：2026 年 7 月金融稳定报告", en: "Bank of England: Financial Stability Report, July 2026", level: "primary" },
  ],
  zh: {
    hero: "Meta 把 El Paso 在建园区放进 BlackRock 管理基金持有 80% 权益的合资平台，同时保留承租、建设管理和残值担保。1GW 仍是 2028 年起上线的目标；真正值得追踪的是，建设期、资产寿命和使用率风险分别落在谁的合同里。",
    thesis: "El Paso 不是把数据中心“卖掉”，而是把长期设施、债务、使用权和残值保障分层安排。外部资本可以降低 Meta 对单一资产的资金占用，却不能替代送电、系统验收和实际负载。项目的下一阶段要看金融交割、并网和租赁会计，而不是把 1GW 目标直接记成运营容量。",
    opening: [
      "Meta 在 7 月 28 日公布 El Paso 合资安排时，给出了一组通常不会同时出现在数据中心项目公告里的数字：BlackRock 管理基金持有 80% 权益，Meta 留下 20%；双方计划按持股比例承担约 140 亿美元开发成本；BlackRock 在交割时注入约 49 亿美元现金，Meta 注入估值约 23 亿美元的土地和在建资产，并获得约 10 亿美元一次性分配。BlackRock 投资的一部分来自 125 亿美元债务融资。",
      "这些数字并不等于一座已经完成、已经送电的 140 亿美元园区。公告称 El Paso 仍在建设，预计从 2028 年起逐步上线，所谓 1GW 是计算容量目标。它没有披露已送电 MW、GPU 数量、并网协议、债务期限、利率、抵押物或每 MW 租金。把这项交易写成“新增 1GW 运营容量”，会一次性跨过建设、送电、验收和利用四道尚未披露的门。",
      "更有用的问题是：当 AI 园区的建筑、电力、冷却和连接设施可以被长期资本持有，但服务器平台和模型负载更新更快时，谁承担两种资产寿命不匹配的风险？El Paso 给出的是合同上的分配，而不是运营上的结论。Meta 的承租、管理和残值担保把公司信用保留在结构内；BlackRock 的权益和债务融资则让基础设施资本进入建设期的风险与回报。",
      "英格兰银行 7 月的金融稳定报告把这一点放到更大的市场背景中：AI 公司在 2026 年上半年加快使用外部融资，债务主要投向数据中心的建筑外壳和设施，而不是服务器和芯片。报告警告，长期债务可能面对更短、更不确定的硬件生命周期。这个观察不能替代 El Paso 的融资条款，却说明为什么租约、保证和可改造性会成为 AI 园区信用结构的核心。",
    ],
    sections: [
      {
        label: "01 · THE DISCLOSURE",
        heading: "一座在建园区，四层资本安排",
        paragraphs: [
          "公告所披露的第一层是资产与权益。基金取得 80% 权益，Meta 保留 20%，并把土地和在建资产转入合资平台。第二层是现金与债务：BlackRock 计划投入约 49 亿美元现金，其投资的一部分由 125 亿美元融资支持。第三层是使用权：Meta 将租用整个园区，是完工后的初始唯一使用方。第四层是信用支持：Meta 提供随时间下降的残值担保。",
          "四层安排的意义在于，它们处理的是不同问题。开发成本决定需要投入多少长期资本；权益比例决定资产价值上升或下降时谁先承受波动；债务决定固定偿付和再融资压力；租约把园区的未来使用与 Meta 的经营需求连接起来；残值担保则在满足特定条件时覆盖财产公允价值低于担保阈值的缺口。没有一层单独等于“项目已经安全”。",
          "数字也不能被机械相加。约 140 亿美元是双方承诺承担的总开发成本，约 23 亿美元和约 49 亿美元是交割时的资产/现金贡献，125 亿美元是部分 BlackRock 投资的融资来源，而非另一笔可以叠加的园区造价。公告未公开债务最终用途、利率、期限、优先级和摊还安排。Atlas 将这些项目保留为 not-determined，而非按常见项目融资条款补全。",
        ],
        metrics: [
          { label: "计算容量目标", value: "1GW", note: "Meta 对在建园区的前瞻描述；预计自 2028 年起上线，不是已送电或运营容量。" },
          { label: "总开发成本", value: "约 140 亿美元", note: "建筑及长期电力、冷却、连接基础设施的计划成本。" },
          { label: "权益结构", value: "BlackRock 80% / Meta 20%", note: "合资平台持股，不代表园区已经完成交割。" },
          { label: "债务融资", value: "125 亿美元", note: "用于 BlackRock 投资的一部分；具体债务条款未公开。" },
          { label: "残值担保阈值", value: "约 130 亿美元", note: "随时间下降，且仅在约定条件下触发，不是无条件付款。" },
        ],
      },
      {
        label: "02 · RISK OWNERSHIP",
        heading: "轻资产不等于风险消失",
        paragraphs: [
          "Meta 并没有把园区交给一个没有明确客户的开发商。它将承租整个园区，初始租期为四年，拥有四次续租选择，潜在总期限可达二十年；它也继续提供建设、行政和物业管理服务。对外部资本而言，这些安排将项目现金流与 Meta 的使用需求相连。对 Meta 而言，资产不再完全由自己持有，但项目是否按时可用、是否适配下一代硬件仍会影响自身业务。",
          "残值担保尤其容易被误读。公告称担保阈值合计约 130 亿美元并随时间降低；在租期前十六年内满足特定条件时，Meta 的最高付款是当时公允价值低于适用担保阈值的差额。它不是对全部开发成本的即时、无条件担保。信用支持随着园区交付、使用和资产剩余价值变化而变化，因此需要与租约、资产评估和债务契约一起阅读。",
          "Atlas 的判断是，交易把“谁拥有砖瓦”与“谁需要算力”拆开，却没有把后者从风险链中移走。Meta 以租约、管理和担保保留了对项目成功的经济暴露；BlackRock 则以权益与融资参与建设期和长期设施价值。可复制性取决于是否具备同等质量的单一承租人、可验证的交付计划和足以覆盖建设期不确定性的合同，而不是某个 headline 债务金额。",
        ],
        cards: [
          { label: "EQUITY", title: "谁承受资产价值波动", body: "80/20 权益决定合资平台中价值上升或下降的分配起点。" },
          { label: "DEBT", title: "谁面对固定偿付", body: "债务支持部分投资，但期限、利率、担保和优先级尚未公开。" },
          { label: "LEASE", title: "谁把需求带进项目", body: "Meta 是初始唯一使用方；租约形成使用权，而非已实现利用率。" },
          { label: "RVG", title: "谁承担部分残值缺口", body: "担保按条件和时间变化，不能等同于对项目全额兜底。" },
        ],
      },
      {
        label: "03 · THREE PATHS",
        heading: "同一买方正在拆开资产、使用权与电力责任",
        paragraphs: [
          "El Paso 是资产合资路径：外部基金持有多数权益，Meta 保留使用和管理职责。Meta 的其他公开项目显示，超大规模买方并不只使用一种模式。4 月的基础设施说明页把 El Paso、Richland Parish、Lebanon 和 Tulsa 列为在建 AI 优化园区，却没有把它们写成已经投运。这个共同边界很重要：建设计划可以反映资本方向，但不足以证明当期供给。",
          "在印度 Jamnagar，Meta 宣布向 Reliance 租赁 AI 数据中心容量，并与两家能源供应商另行支持接近 1GW 的可再生能源。这里的资产所有权、容量使用和能源采购被拆成不同合同；但公告未披露租赁 MW、能源项目实际发电或与 El Paso 可比的成本，因此不能从结构不同推导出哪种模式更便宜或更快。",
          "Richland Parish 则呈现更重的自建与能源组合。Meta 7 月称其计算容量扩展目标为 5GW、投入超过 500 亿美元，并称与 Entergy 的安排将支持燃气机组、电网级电池、核电增容和其他购电。这些规模、成本承担和节省表述来自 Meta，未替代公用事业或监管文件的独立确认；它们的分析价值在于说明，机房资产的融资不能与电力、输电、储能和水系统的交付脱钩。",
          "三条路径并不构成优劣排序。它们共同提出了一个可检验的问题：资产所有权、容量使用权和能源责任是否能在同一时间表上闭合？El Paso 解决的是可融资资产和使用者信用如何连接；它没有自动提供可交付电力、已安装系统或有实际负载的机柜。",
        ],
        steps: [
          { title: "资产所有权", body: "El Paso 用合资平台承接长期设施；资产从 Meta 单独持有转为共享权益。" },
          { title: "容量使用权", body: "Meta 承租整个 El Paso 园区，也在 Jamnagar 选择容量租赁；两者均不等于披露的实际利用率。" },
          { title: "能源责任", body: "Richland Parish 的公司表述把发电、储能与电网安排置于园区经济性中。" },
          { title: "交付闭合", body: "金融交割、并网、设备验收和真实负载必须依次发生，才能形成可运营容量。" },
        ],
      },
      {
        label: "04 · DELIVERY GATES",
        heading: "从融资交割到可用算力，要跨过五道门",
        paragraphs: [
          "第一道是金融交割。公告称交易预计在数日内完成，但该表述不是交割已经完成的证明。第二道是土建与长周期设备。建筑、电力、冷却和连接设施需要按预算和时点交付；目前没有各系统机械完工比例。第三道是电力与并网。1GW 计算容量需要对应的园区供电、输电接入和运营安排，但公告没有披露送电 MW、并网协议、发电来源或商业运行日期。",
          "第四道是系统安装与验收。GPU、网络、液冷回路和控制系统必须被安装并通过稳定性测试；公告没有披露供应商、机柜数量、冷却架构或验收节奏。第五道才是承租与利用。Meta 的租约说明谁拥有使用权，却没有给出最低使用率、每 MW 租金或实际工作负载。",
          "因此，1GW 只有在这些门被逐一跨过后才可讨论为可运营的计算能力。已宣布、在建、已送电、系统就绪和已投入使用是不同状态；把它们合并，会同时夸大容量、收入和信用质量。",
        ],
      },
      {
        label: "05 · FORWARD VIEW",
        heading: "未来 12–36 个月，看条件而不是预测",
        paragraphs: [
          "按计划转换的情景需要四类公开证据连续出现：金融交割、送电与长周期设备里程碑、系统安装与验收、以及 2028 年首批容量上线。只有最后两项开始反映真实负载或租赁会计时，租约和担保才从建设期信用支持转向可以观察的资产与使用现金流。",
          "第二种情景是资本到位、交付延后。合资可能完成，但并网、设备或施工节点滞后。那意味着权益和债权承担建设期风险的时间更长，1GW 仍不能计入运营供给。这个情景并不需要需求消失；它只需要实体交付比融资文件更慢。",
          "第三种情景是需求或技术重配。如果租约、担保阈值、使用方式或资产改造计划发生变化，园区的再部署能力和残值会比一次性开发成本更重要。相反，若 Meta 按原计划启用全园区且长期安排未调整，说明项目在最初结构下实现了资产、负载和技术适配的闭合。",
          "这不是对任一情景的概率判断。它把前瞻性从“项目一定会如何”转成可观察的领先指标：交割确认资本结构，送电确认实体基础设施，验收确认系统可用，负载与会计披露确认经济使用。任何一个指标都不能代替其他三个。",
        ],
        cards: [
          { label: "2026–27", title: "资本结构是否完成", body: "看交割、债务主体、期限、担保与抵押，而不是只看公告的融资金额。" },
          { label: "2027–28", title: "电力和建设是否同步", body: "看并网、送电与长周期设备里程碑，避免把施工叙事当作供给。" },
          { label: "2028+", title: "上线是否变成使用", body: "看实际 MW、机柜、可用率、租赁会计或收入确认。" },
          { label: "FALSIFY", title: "什么会削弱原判断", body: "正式下调时间表、范围、使用结构或担保安排，都会改变风险归属。" },
        ],
      },
      {
        label: "06 · COUNTER-CASE",
        heading: "规模不能替代可验证性",
        paragraphs: [
          "第一层风险是交易条款。债务工具的利率、期限、优先级、摊还与契约尚未公开，无法计算真实杠杆、利息覆盖或再融资压力。第二层是建设与转换。2028 年上线是公司目标，电力、冷却、网络、施工和设备任何一环延误，都会延后可供租赁或使用的容量。",
          "第三层是运营与残值。残值担保阈值会随时间下降，且需满足触发条件；园区长期价值还取决于后续加速器的功率密度、冷却适配、网络架构、实际负载和能效。长期设施可以比一代服务器耐用，也可能因无法支持下一代系统而缩短经济寿命。",
          "反向证据也必须保留。若项目按时送电、Meta 按计划导入长期负载、租约和担保的会计披露与公告结构一致，外部基础设施资本就能在不完全依赖 Meta 自有资本支出的前提下推进园区。现有公开记录还不足以在这两种结果之间下结论。",
        ],
      },
    ],
    conclusion: "El Paso 把 AI 园区融资从“谁投了多少钱”推进到“谁在不同阶段承担什么风险”。外部资本与债务可以承接长期设施，Meta 的租约、管理和残值担保仍把需求与信用留在项目中。1GW 是目标而非已运营容量；未来的关键不是更大的 headline，而是交割、送电、验收与实际使用能否依次出现。",
    disclosure: "资料截止：2026 年 8 月 10 日（北京时间）。El Paso 的权益、成本、出资、融资、租约与残值担保来自 Meta 2026 年 7 月 28 日公告。Jamnagar 与 Richland Parish 作为比较案例，均按 Meta 的公司表述处理。英格兰银行报告用于宏观融资背景，不用于推断 El Paso 的债务条款。本文不构成投资建议。",
  },
  en: {
    hero: "Meta has placed its El Paso campus into a BlackRock-managed venture while retaining the lease, construction role and residual-value support. The 1GW figure remains a target for capacity beginning to come online in 2028. The real question is how construction, asset-life and utilization risk are allocated before that happens.",
    thesis: "El Paso is not a simple sale of a data center. It separates long-lived facilities, debt, occupancy rights and residual-value support into different contractual layers. Outside capital can reduce Meta's direct asset funding, but it cannot replace energization, system acceptance or real workload. The decisive evidence will be financial close, grid delivery and subsequent lease accounting—not the 1GW headline.",
    opening: [
      "Meta's July 28 El Paso announcement disclosed an unusually detailed capital structure for a data-center project. Funds managed by BlackRock will hold 80% of the venture and Meta 20%. The parties have committed to fund roughly $14 billion of development costs. At financial close, Meta is to contribute land and construction in progress valued at about $2.3 billion, BlackRock is to contribute about $4.9 billion in cash, and Meta is to receive a one-time distribution of roughly $1 billion to align ownership. Part of BlackRock's investment is to be financed by $12.5 billion of debt.",
      "Those figures do not describe a completed or energized $14 billion campus. Meta says the El Paso site is under construction and expects capacity to begin coming online in 2028. Its stated 1GW of compute is a forward-looking campus target, not disclosed delivered power, installed accelerators or billable capacity. The announcement does not disclose energization, interconnection, debt tenor, interest rate, collateral, amortization, rack count or rent per megawatt. Treating the disclosure as one gigawatt of operating supply would skip several still-unobserved delivery stages.",
      "The useful question is therefore not how large the headline is. It is who carries the risk when buildings, substations, cooling plants and connectivity are financed as long-lived infrastructure while server generations, workloads and utilization can change much faster. El Paso provides a contractual allocation, not an operational answer. Meta's lease, management role and residual-value support keep its credit and demand attached to the project; BlackRock's equity and debt financing bring infrastructure capital into construction-period risk and return.",
      "The Bank of England's July Financial Stability Report puts this structure into market context. It says AI companies accelerated their use of external finance in the first half of 2026, with most debt financing data-center shells and facilities rather than the servers and chips inside them. The report also identifies a potential mismatch between long-dated debt and faster, uncertain AI-hardware life cycles. That is a macroprudential observation, not a statement about El Paso's debt terms. It does, however, identify why leases, guarantees and the ability to adapt a campus matter to AI-infrastructure credit.",
    ],
    sections: [
      {
        label: "01 · THE DISCLOSURE",
        heading: "One campus, four layers of capital",
        paragraphs: [
          "The first disclosed layer is the asset and equity structure. BlackRock-managed funds take an 80% interest while Meta keeps 20%, with Meta contributing land and construction in progress to the venture. The second is cash and debt: BlackRock's roughly $4.9 billion cash contribution is partly supported by $12.5 billion of debt financing. The third is occupancy: Meta will lease the entire campus and be its initial sole occupant. The fourth is credit support: Meta provides residual-value guarantees that decline over time.",
          "Each layer solves a different problem. Development cost describes the long-lived capital required for buildings and power, cooling and connectivity infrastructure. Equity determines who first absorbs changes in asset value. Debt creates fixed claims and refinancing exposure. The lease connects future use of the campus to Meta's operating demand. The residual-value guarantee can cover a specified value shortfall under specified conditions. None of those layers independently means that the campus has been built, powered or de-risked.",
          "The figures also must not be added mechanically. Roughly $14 billion is the parties' planned total development cost. The $2.3 billion and $4.9 billion figures are asset and cash contributions at financial close. The $12.5 billion is a funding source for part of BlackRock's investment, not an additional campus cost. Meta did not disclose the debt's ultimate uses, interest rate, maturity, security, seniority or amortization. Atlas therefore treats those terms as not determined rather than filling them in with a typical project-finance template.",
        ],
        metrics: [
          { label: "Compute target", value: "1GW", note: "A forward-looking Meta description of an under-construction campus expected to begin coming online in 2028." },
          { label: "Development cost", value: "~$14B", note: "Planned buildings plus long-lived power, cooling and connectivity infrastructure." },
          { label: "Equity structure", value: "BlackRock 80% / Meta 20%", note: "Venture ownership; not proof that financial close has occurred." },
          { label: "Debt financing", value: "$12.5B", note: "Funds part of BlackRock's investment; debt terms are not public." },
          { label: "Residual-value threshold", value: "~$13B", note: "Declines over time and applies only under contractual conditions." },
        ],
      },
      {
        label: "02 · RISK OWNERSHIP",
        heading: "Asset-light does not mean risk-free",
        paragraphs: [
          "Meta is not handing an empty site to an independent developer. It will lease the entire campus, beginning with a four-year term and four extension options that could take the relationship to twenty years. Meta will also provide construction management, administrative and property-management services. For outside capital, those arrangements connect project cash flow to Meta's use of the site. For Meta, not owning every project asset directly does not remove the business consequence if delivery or technical fit fails.",
          "The residual-value guarantee is especially easy to overstate. Meta says the guarantees have an aggregate threshold of roughly $13 billion that declines over time. If specified conditions are met in the first sixteen years of the lease, Meta's maximum payment equals the shortfall between then-current fair value and the applicable threshold. That is not an immediate, unconditional guarantee of all development cost. Its relevance changes with delivery, use, asset valuation and the debt and lease terms around it.",
          "Atlas's view is that the transaction separates who owns the physical campus from who needs the compute, but it does not remove the latter from the risk chain. Meta retains economic exposure through the lease, management role and guarantee. BlackRock takes equity exposure and funds part of the investment with debt. Replicating the structure elsewhere would require more than a large financing headline: it needs an anchor tenant of comparable credit quality, a credible delivery plan and contractual support that bridges the construction period without confusing future demand with present capacity.",
        ],
        cards: [
          { label: "EQUITY", title: "Asset-value exposure", body: "The 80/20 split is the starting point for sharing changes in venture value." },
          { label: "DEBT", title: "Fixed-claim exposure", body: "Debt supports part of the investment, but its maturity, pricing, security and seniority are undisclosed." },
          { label: "LEASE", title: "Demand enters the structure", body: "Meta is the initial sole occupant; occupancy rights are not disclosed utilization." },
          { label: "RVG", title: "Partial residual-value exposure", body: "The guarantee is conditional and time-varying, not a blanket project backstop." },
        ],
      },
      {
        label: "03 · THREE PATHS",
        heading: "The same buyer is separating asset, occupancy and power choices",
        paragraphs: [
          "El Paso is an asset-venture route: external funds hold most of the long-lived infrastructure while Meta retains use and management. Meta's other public infrastructure disclosures show that a hyperscaler does not use only one model. Its April infrastructure explainer lists El Paso, Richland Parish, Lebanon and Tulsa as AI-optimized data centers under construction. That common status matters. A build plan can show capital direction; it does not prove delivered power, system readiness or current supply.",
          "In Jamnagar, India, Meta announced an agreement to lease capacity at a Reliance AI-enabled data center while separately backing nearly one gigawatt of renewable energy with two energy providers. Asset ownership, use of capacity and energy procurement are therefore split among different agreements. The announcement does not disclose leased megawatts, actual generation from those energy projects or a cost basis comparable with El Paso, so the different structure cannot support a claim that one route is cheaper or faster.",
          "Richland Parish, Louisiana illustrates a heavier build-and-power configuration. Meta said in July that it was expanding the site's compute target to 5GW with more than $50 billion of investment, and that its Entergy agreement would fund new gas generation, grid-scale batteries, nuclear uprates and other purchased power. The capacity, customer-savings and cost-allocation statements are Meta's own and do not substitute for utility or regulatory records. Their analytical value is narrower: a campus financing model cannot be assessed only through the data halls when power, transmission, storage and water determine delivery timing.",
          "These are not a ranking of Meta's preferred models. Together they pose a testable question: can asset ownership, rights to use capacity and power responsibility close on the same timetable? El Paso connects financeable assets with an anchor tenant's credit. It does not automatically supply energized power, installed systems or productive workload.",
        ],
        steps: [
          { title: "Asset ownership", body: "El Paso puts long-lived facilities into a venture rather than keeping every asset solely on Meta's balance sheet." },
          { title: "Capacity rights", body: "Meta leases the whole El Paso campus and separately leases capacity in Jamnagar; neither disclosure establishes utilization." },
          { title: "Power responsibility", body: "Richland Parish shows company-described generation, storage and grid arrangements becoming part of campus economics." },
          { title: "Delivery closure", body: "Financial close, grid delivery, equipment acceptance and real load must occur in sequence before capacity is operational." },
        ],
      },
      {
        label: "04 · DELIVERY GATES",
        heading: "Five gates separate financing from usable compute",
        paragraphs: [
          "The first gate is financial close. Meta said the transaction was expected to close in the coming days; that is not proof that the conditions have been met. The second is civil works and long-lead equipment. Buildings plus power, cooling and connectivity infrastructure must arrive to budget and schedule, but no mechanical-completion percentage is public. The third is power and interconnection. A one-gigawatt compute target requires campus power and transmission arrangements, yet Meta did not disclose delivered megawatts, an interconnection agreement, a generation source or a commercial-operation date.",
          "The fourth gate is system installation and acceptance. Accelerators, networks, cooling loops and controls have to be installed and pass reliability tests. Meta did not disclose suppliers, rack count, liquid-cooling architecture or acceptance cadence. The fifth is occupancy and utilization. The lease establishes who has the right to use the campus. It does not disclose a minimum utilization level, rent per megawatt or an actual production workload.",
          "Only after the five gates have been crossed can the one-gigawatt figure be discussed as usable computing capacity. Announced, under construction, energized, system-ready and occupied are separate states. Collapsing them turns a forward-looking development objective into inflated supply, revenue and credit quality.",
        ],
      },
      {
        label: "05 · FORWARD VIEW",
        heading: "A 12–36 month view built from conditions, not forecasts",
        paragraphs: [
          "In an on-plan conversion, four public signals appear in sequence: financial close; power and long-lead-equipment milestones; system installation and acceptance; and the first capacity coming online in 2028. Only when the latter stages show actual workload, lease accounting or another use metric does the lease-and-guarantee structure begin to move from construction-period credit support toward observable asset and usage cash flow.",
          "A second path is capital in place but delivery delayed. The venture can close while interconnection, equipment or construction moves later. In that case equity and debt carry construction-period risk longer, and the one-gigawatt target remains outside operating supply. This path does not require demand to disappear. It requires physical delivery to move more slowly than the financing documents.",
          "A third path is demand or technology reconfiguration. If the lease, guarantee thresholds, intended use or asset-upgrade plan changes, redeployability and residual value become more important than the initial development cost. Conversely, if Meta activates the full campus on the initial timetable without changing the long-term arrangement, the original structure has closed the loop between asset, workload and technical fit.",
          "This is not a probability call on any path. It converts foresight into observable leading indicators. Financial close verifies the capital structure. Energization verifies physical infrastructure. Acceptance verifies system availability. Workload and accounting disclosure verify economic use. None can stand in for the other three.",
        ],
        cards: [
          { label: "2026–27", title: "Does the capital structure close?", body: "Watch financial close, debt borrower, tenor, security and guarantee terms—not only the financing headline." },
          { label: "2027–28", title: "Do grid and construction close together?", body: "Watch interconnection, energization and long-lead-equipment milestones before treating construction as supply." },
          { label: "2028+", title: "Does online become used?", body: "Watch actual megawatts, racks, availability, lease accounting or revenue recognition." },
          { label: "FALSIFY", title: "What changes the view?", body: "A formal reduction in timing, scope, use structure or guarantee support would change risk ownership." },
        ],
      },
      {
        label: "06 · COUNTER-CASE",
        heading: "Scale cannot substitute for verifiability",
        paragraphs: [
          "The first risk layer is transaction terms. Without the debt's pricing, tenor, seniority, amortization and covenants, actual leverage, interest coverage and refinancing pressure cannot be calculated. The second is construction and conversion. A 2028 online target is a company objective; any delay in power, cooling, networking, civil works or equipment pushes out capacity that can be leased or used.",
          "The third is operating value and residual value. The guarantee threshold declines over time and applies only if conditions are met. The campus's long-term value will also depend on later accelerator power density, cooling fit, network architecture, workloads and energy efficiency. Facilities can outlive one server generation, but a facility unable to accommodate the next one can lose economic life earlier than its physical shell suggests.",
          "The counter-case must remain visible. If the site energizes on schedule, Meta brings in long-lived workloads and later lease and guarantee disclosures match the announced structure, external infrastructure capital can advance a campus without Meta funding every asset directly. Current public records do not yet allow a conclusion between that outcome and the execution-risk case.",
        ],
      },
    ],
    conclusion: "El Paso moves the AI-campus question beyond who is spending the most. Outside equity and debt can hold long-lived facilities, while Meta's lease, management role and residual-value support keep demand and credit attached to the project. One gigawatt is a target, not operating capacity. The next proof points are financial close, energization, acceptance and real use—each one necessary, none sufficient on its own.",
    disclosure: "Cut-off: August 10, 2026, Beijing time. El Paso ownership, development-cost, contribution, financing, lease and residual-value figures are from Meta's July 28, 2026 announcement. Jamnagar and Richland Parish are used as Meta-described comparison cases. The Bank of England report provides macro-finance context and is not used to infer El Paso debt terms. For information and research only; not investment advice.",
  },
};
