export type PolicyIndexRecord = {
  id: string;
  jurisdiction: "US" | "中国";
  title: string;
  titleEn: string;
  scope: string;
  scopeEn: string;
  status: string;
  statusEn: string;
  publishedAt: string;
  effectiveLabel: string;
  effectiveLabelEn: string;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  summaryEn: string;
  impact: string;
  impactEn: string;
  affected: string;
  affectedEn: string;
};

export type RumorWatchItem = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  region: "中国" | "美国" | "全球";
  status: "reported";
  statusLabel: string;
  statusLabelEn: string;
  sourceCount: number;
  entities: string[];
  officialResponse: string;
  officialResponseEn: string;
  sourceNote: string;
  sourceNoteEn: string;
};

export const POLICY_BRIEFS: PolicyIndexRecord[] = [
  {
    id: "us-ratepayer-protection-pledge-2026",
    jurisdiction: "US",
    title: "美国扩大数据中心电费保护承诺",
    titleEn: "U.S. expands the data-center ratepayer protection pledge",
    scope: "新增电源、输电与并网成本",
    scopeEn: "New generation, transmission and interconnection costs",
    status: "自愿承诺 · 2026年扩围",
    statusEn: "Voluntary pledge · expanded in 2026",
    publishedAt: "2026-07-23T12:00:00-04:00",
    effectiveLabel: "2026年7月23日扩围；非统一强制电价规则",
    effectiveLabelEn: "Expanded July 23, 2026; not a uniform mandatory tariff",
    sourceName: "The White House",
    sourceUrl: "https://www.whitehouse.gov/releases/2026/07/president-trumps-ratepayer-protection-pledge-secures-american-ai-dominance-protects-consumers/",
    summary: "白宫把此前由大型科技公司参与的电费保护承诺扩大到200多家电力公司、数据中心开发商、合作社和州。参与方承诺由大型数据中心项目承担新增发电与配套电网成本。",
    summaryEn: "The White House expanded its ratepayer pledge to more than 200 additional utilities, data-center developers, cooperatives and states. Participating projects commit to paying for the generation and grid infrastructure they require.",
    impact: "新项目在申请供电、谈判电价和获得地方支持时，需要更清楚地隔离新增成本，并证明普通用户不会为数据中心配套设施买单。",
    impactEn: "New projects face greater pressure to ring-fence incremental power and grid costs when negotiating service, tariffs and local approvals.",
    affected: "大型数据中心开发商、超大规模云厂商、电力公司与州政府",
    affectedEn: "Large data-center developers, hyperscalers, utilities and states",
  },
  {
    id: "us-virginia-data-center-electricity-tax-2026",
    jurisdiction: "US",
    title: "弗吉尼亚州开始征收数据中心用电税",
    titleEn: "Virginia begins collecting a data-center electricity tax",
    scope: "电力成本、自备电源与计量申报",
    scopeEn: "Power costs, self-generation and consumption reporting",
    status: "已生效 · 临时税项",
    statusEn: "In force · temporary tax",
    publishedAt: "2026-07-01T00:00:00-04:00",
    effectiveLabel: "2026年7月1日起至2028年7月1日前",
    effectiveLabelEn: "July 1, 2026 through June 30, 2028",
    sourceName: "Virginia General Assembly",
    sourceUrl: "https://budget.lis.virginia.gov/item/2026/2/HB30/Chapter/3/3-5.24/",
    summary: "弗吉尼亚州对州内数据中心每月消耗的电力征收每千瓦时0.011美元的税，自备发电同样纳入。首次征收安排在2026年9月，并追溯覆盖7月起的用电。",
    summaryEn: "Virginia imposes a $0.011 per kWh tax on electricity consumed by data centers, including self-supplied power. The first collection in September 2026 covers consumption from July onward.",
    impact: "数据中心的单位电力成本直接上升，自备电源不能规避税项；运营商需要把计量、申报和税费纳入项目运营模型。",
    impactEn: "Unit power costs rise directly, self-generation is not exempt, and operators must add metering, reporting and tax treatment to operating models.",
    affected: "弗吉尼亚州内数据中心运营商及其供电主体",
    affectedEn: "Data-center operators and electricity suppliers in Virginia",
  },
  {
    id: "us-texas-sb6-large-load-2025",
    jurisdiction: "US",
    title: "得州收紧大型用电负荷并网与成本承担规则",
    titleEn: "Texas tightens large-load interconnection and cost allocation",
    scope: "ERCOT并网、前期保证金与紧急削减负荷",
    scopeEn: "ERCOT interconnection, financial commitments and curtailment",
    status: "已生效 · 配套规则制定中",
    statusEn: "In force · rulemaking continues",
    publishedAt: "2025-09-01T00:00:00-05:00",
    effectiveLabel: "2025年9月1日起；输电成本规则须在2026年底前修订",
    effectiveLabelEn: "Effective September 1, 2025; transmission-cost rules due by end-2026",
    sourceName: "Texas Legislature",
    sourceUrl: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00006F.HTM",
    summary: "SB 6要求大型负荷承担并网成本，并设置至少10万美元的初步输电筛查费、场址控制证明和统一财务承诺。部分新接入负荷还需具备紧急情况下的可中断能力。",
    summaryEn: "SB 6 makes large loads contribute to interconnection costs and requires at least a $100,000 screening fee, site-control evidence and standardized financial commitments. Some new loads must also support emergency curtailment.",
    impact: "ERCOT区域的数据中心项目需要更早提交资金与场址证明，并承担更明确的电网扩建和可靠性责任；缺乏实质进展的排队项目更难长期占用容量。",
    impactEn: "ERCOT data-center projects must show site control and financial commitment earlier and assume clearer grid-upgrade and reliability obligations.",
    affected: "得州ERCOT区域新建和扩容的大型数据中心负荷",
    affectedEn: "New and expanding large data-center loads in ERCOT",
  },
  {
    id: "us-eo-14318-data-center-permitting",
    jurisdiction: "US",
    title: "美国联邦政府加快100MW以上AI数据中心审批",
    titleEn: "U.S. accelerates federal permitting for 100MW-plus AI data centers",
    scope: "联邦土地、环境审查与项目融资支持",
    scopeEn: "Federal land, environmental review and project support",
    status: "行政令生效",
    statusEn: "Executive order in force",
    publishedAt: "2025-07-23T12:00:00-04:00",
    effectiveLabel: "2025年7月23日签署并生效",
    effectiveLabelEn: "Signed and effective July 23, 2025",
    sourceName: "The White House",
    sourceUrl: "https://www.whitehouse.gov/presidential-actions/2025/07/accelerating-federal-permitting-of-data-center-infrastructure/",
    summary: "第14318号行政令把新增负荷超过100MW的AI数据中心及其电力、芯片、网络和存储配套纳入加速范围，并要求推进FAST-41、联邦土地利用和可用融资支持。",
    summaryEn: "Executive Order 14318 covers AI data centers adding more than 100MW of load and their power, chip, networking and storage components, directing agencies to use FAST-41, federal land and available financial support.",
    impact: "符合条件的项目可以获得更集中的联邦审批协调和土地入口，但行政令不等同于自动获批，州级并网、环保和地方许可仍需单独完成。",
    impactEn: "Qualifying projects gain a clearer path to coordinated federal review and federal land, but state interconnection, environmental and local permits still apply.",
    affected: "100MW以上AI数据中心及其电力与关键设备项目",
    affectedEn: "AI data centers above 100MW and their power and equipment projects",
  },
  {
    id: "cn-beijing-data-center-pue-pricing-2026",
    jurisdiction: "中国",
    title: "北京对PUE高于1.35的数据中心执行差别电价",
    titleEn: "Beijing applies differential tariffs to data centers above PUE 1.35",
    scope: "存量数据中心能效、绿电与改造成本",
    scopeEn: "Existing-facility efficiency, green power and retrofit costs",
    status: "2026年起执行",
    statusEn: "In force from 2026",
    publishedAt: "2024-11-14T12:00:00+08:00",
    effectiveLabel: "自2026年起按上一年度实际PUE梳理执行",
    effectiveLabelEn: "Applied from 2026 using the prior year's actual PUE",
    sourceName: "北京市经济和信息化局",
    sourceUrl: "https://jxj.beijing.gov.cn/zwgk/2024zcwj/202411/t20241115_3942040.html",
    summary: "北京把年用电500万千瓦时及以上、PUE高于1.35的存量数据中心列为重点改造对象，并从2026年起执行差别电价；达标改造项目可申请节能、节水和新能源奖励。",
    summaryEn: "Beijing targets existing data centers using at least 5 million kWh a year and operating above PUE 1.35 for retrofit and differential tariffs, while qualifying efficiency and renewable projects can seek incentives.",
    impact: "超限部分电价可按每千瓦时0.2元或0.5元加价，低效机房面临直接成本压力；改造达标并稳定运行后可申请停止执行差别电价。",
    impactEn: "Electricity above the efficiency limit can face RMB 0.2 or RMB 0.5 per kWh surcharges, creating direct pressure to retrofit inefficient facilities.",
    affected: "北京市高能耗存量数据中心及计划转型的智算中心",
    affectedEn: "Energy-intensive existing data centers and conversion projects in Beijing",
  },
  {
    id: "cn-data-center-carbon-efficiency-standard-2026",
    jurisdiction: "中国",
    title: "数据中心算力碳效评价国家标准进入制定阶段",
    titleEn: "China starts drafting a national compute-carbon-efficiency standard",
    scope: "算力碳效定义、核算方法与评价流程",
    scopeEn: "Compute carbon-efficiency definitions, accounting and assessment",
    status: "标准制定中 · 尚未生效",
    statusEn: "Drafting · not yet in force",
    publishedAt: "2026-04-28T12:00:00+08:00",
    effectiveLabel: "计划周期15个月；当前不是强制合规要求",
    effectiveLabelEn: "Fifteen-month project; not currently a mandatory requirement",
    sourceName: "全国标准信息公共服务平台",
    sourceUrl: "https://std.samr.gov.cn/gb/search/gbDetailedCNF?id=30A9F6473109728BE06397BE0A0A0EFB",
    summary: "国家标准计划20262489-T-467拟统一数据中心算力碳效的定义、计算公式、核算方法和评价流程，适用范围覆盖通用数据中心、智算中心及内部机房。",
    summaryEn: "National standards project 20262489-T-467 will define compute carbon efficiency, formulas, accounting methods and assessment procedures across conventional and AI data centers.",
    impact: "现阶段不会直接改变项目审批或电价；标准发布后，可能形成更统一的碳效披露和第三方评价口径。",
    impactEn: "It does not yet change approvals or tariffs, but could create a common disclosure and third-party assessment framework once published.",
    affected: "数据中心运营商、智算中心、评价与认证机构",
    affectedEn: "Data-center operators, AI computing centers and certification bodies",
  },
  {
    id: "cn-green-data-center-action-plan-2030",
    jurisdiction: "中国",
    title: "全国数据中心绿色低碳行动延伸至2030年",
    titleEn: "China's green data-center action plan extends through 2030",
    scope: "PUE、上架率、绿电比例与枢纽布局",
    scopeEn: "PUE, utilization, renewable power and hub siting",
    status: "持续实施 · 2030目标",
    statusEn: "In force · 2030 targets",
    publishedAt: "2024-07-24T12:00:00+08:00",
    effectiveLabel: "2025阶段目标已到期；2030长期目标继续执行",
    effectiveLabelEn: "The 2025 milestone has passed; 2030 objectives remain",
    sourceName: "中国政府网",
    sourceUrl: "https://www.gov.cn/zhengce/zhengceku/202407/P020240724272072479001.pdf",
    summary: "专项行动要求优化全国数据中心布局、提升上架率和可再生能源使用，并推动老旧小散机房改造。2030年目标继续强调平均PUE、单位算力能效、碳效和余热利用。",
    summaryEn: "The action plan directs China to improve data-center siting, utilization and renewable-energy use while upgrading inefficient facilities. Its 2030 objectives cover PUE, compute efficiency, carbon efficiency and heat recovery.",
    impact: "新增项目更偏向国家枢纽与绿电资源地区，存量项目需要持续投入制冷、供配电和能源管理改造；2025指标不应再当作未来目标引用。",
    impactEn: "New projects are steered toward national hubs and renewable-rich regions, while existing sites face continuing cooling, power and energy-management upgrades.",
    affected: "全国新建与存量数据中心、国家算力枢纽节点",
    affectedEn: "New and existing data centers and national computing hubs in China",
  },
];

export const RUMOR_BRIEFS: RumorWatchItem[] = [
  {
    id: "nvda-hut8-beacon-point-tenant-2026",
    title: "Hut 8未披露的得州租户，据报为英伟达",
    titleEn: "Nvidia is reported to be Hut 8's undisclosed Texas tenant",
    summary: "Hut 8已公开Beacon Point园区两份合计704MW的长期租约，但没有披露客户名称。《金融时报》援引知情人士称租户为英伟达；按续约选项计算，合同总值最高可达约502亿美元。",
    summaryEn: "Hut 8 has disclosed two long-term Beacon Point leases totaling 704MW without naming the customer. The Financial Times identified Nvidia as the tenant and reported potential value of about $50.2 billion including renewal options.",
    publishedAt: "2026-07-28T07:00:00Z",
    sourceName: "Reuters · Financial Times",
    sourceUrl: "https://www.channelnewsasia.com/business/nvidia-behind-50-billion-lease-texas-data-center-ft-reports-6282306",
    region: "美国",
    status: "reported",
    statusLabel: "租约已披露 · 租户身份未确认",
    statusLabelEn: "Lease disclosed · tenant unconfirmed",
    sourceCount: 1,
    entities: ["Nvidia", "Hut 8", "Beacon Point"],
    officialResponse: "Hut 8确认租约但未公开租户；截至报道时，英伟达与Hut 8均未就租户身份回应。",
    officialResponseEn: "Hut 8 confirmed the leases but did not name the tenant. Nvidia and Hut 8 had not commented on the reported identity.",
    sourceNote: "Reuters转述《金融时报》的识别结果，Reuters注明无法独立核实。",
    sourceNoteEn: "Reuters relayed the Financial Times identification and said it could not independently verify it.",
  },
  {
    id: "nvda-openai-ohio-financing-backstop-2026",
    title: "英伟达据报洽谈为OpenAI俄亥俄10GW项目提供融资担保",
    titleEn: "Nvidia is reported to be discussing a financing backstop for OpenAI's 10GW Ohio project",
    summary: "《华尔街日报》称，英伟达正在讨论为OpenAI租用SoftBank在俄亥俄州南部开发的10GW园区提供约2500亿美元融资担保；相关安排还可能与芯片采购融资分开。",
    summaryEn: "The Wall Street Journal reported that Nvidia is discussing roughly $250 billion of financing guarantees tied to OpenAI leasing a 10GW campus being developed by SoftBank in southern Ohio.",
    publishedAt: "2026-07-26T21:52:00Z",
    sourceName: "Reuters · Wall Street Journal",
    sourceUrl: "https://ca.investing.com/news/stock-market-news/nvidia-in-talks-with-openai-to-guarantee-250-billion-financing-for-data-center-wsj-reports-4753152",
    region: "美国",
    status: "reported",
    statusLabel: "交易洽谈 · 条款未定",
    statusLabelEn: "Talks reported · terms not final",
    sourceCount: 1,
    entities: ["Nvidia", "OpenAI", "SoftBank"],
    officialResponse: "截至报道发布时，没有正式担保协议；报道明确提示交易仍可能变化或终止。",
    officialResponseEn: "No formal guarantee had been announced, and the reported terms could still change or fall apart.",
    sourceNote: "Reuters转述《华尔街日报》的知情人士报道，属于单一独立来源组。",
    sourceNoteEn: "Reuters relayed a Wall Street Journal report based on people familiar with the talks; this is one independent source group.",
  },
  {
    id: "intel-amd-china-server-cpu-commitments-2026",
    title: "英特尔与AMD据报推动中国服务器CPU长期采购承诺",
    titleEn: "Intel and AMD are reported to be seeking longer China server-CPU commitments",
    summary: "Reuters援引两名知情人士称，英特尔与AMD正与中国服务器客户讨论约一年、部分长达两年以上的采购承诺，主要锁定采购量而非价格，背景是服务器CPU交期拉长和价格上行。",
    summaryEn: "Reuters reported that Intel and AMD are discussing roughly one-year, and in some cases multi-year, purchase commitments with Chinese server customers, generally locking volume rather than price amid tighter CPU supply.",
    publishedAt: "2026-07-23T03:27:00Z",
    sourceName: "Reuters",
    sourceUrl: "https://www.investing.com/news/stock-market-news/exclusiveintel-amd-sign-longterm-server-cpu-deals-with-chinese-clients-as-prices-surge-sources-say-4807453",
    region: "中国",
    status: "reported",
    statusLabel: "供应谈判 · 客户未披露",
    statusLabelEn: "Supply talks · customers undisclosed",
    sourceCount: 1,
    entities: ["Intel", "AMD", "中国服务器客户"],
    officialResponse: "截至报道时，英特尔与AMD均未回应，具体客户、数量和合同期限没有公开文件。",
    officialResponseEn: "Intel and AMD had not commented, and no public filing identified customers, volumes or final contract terms.",
    sourceNote: "Reuters独家报道，核心合同细节来自未具名知情人士。",
    sourceNoteEn: "A Reuters exclusive whose core contract details came from unnamed people familiar with the talks.",
  },
  {
    id: "meta-anthropic-compute-lease-talks-2026",
    title: "Meta与Anthropic据报洽谈两年最高100亿美元算力租赁",
    titleEn: "Meta and Anthropic are reported to be discussing a compute lease worth up to $10B",
    summary: "Reuters报道称，双方正在讨论由Anthropic按月租用Meta算力、期限两年且总额最高约100亿美元的安排。谈判仍处早期，条款可变，双方也可能提前退出。",
    summaryEn: "Reuters reported early-stage talks under which Anthropic could lease Meta compute capacity in monthly installments for two years, with potential value up to $10 billion and flexible exit terms.",
    publishedAt: "2026-07-17T21:00:00Z",
    sourceName: "Reuters",
    sourceUrl: "https://m.investing.com/news/stock-market-news/meta-in-talks-for-10-billion-anthropic-compute-deal-nyt-reports-4798826?ampMode=1",
    region: "美国",
    status: "reported",
    statusLabel: "早期洽谈 · 可能不成交",
    statusLabelEn: "Early talks · may not close",
    sourceCount: 1,
    entities: ["Meta", "Anthropic"],
    officialResponse: "Meta截至报道时未回应；Anthropic拒绝置评。双方没有发布合同或服务产品。",
    officialResponseEn: "Meta had not responded and Anthropic declined to comment. Neither company had announced a contract or service.",
    sourceNote: "Reuters基于一名知情人士报道，明确表示讨论可能不会形成交易。",
    sourceNoteEn: "Reuters cited one person familiar with the matter and explicitly noted that the talks may not lead to a deal.",
  },
  {
    id: "meta-compute-cloud-plan-2026",
    title: "Meta据报筹划对外出售AI算力与模型托管",
    titleEn: "Meta is reported to be planning an AI compute and model-hosting business",
    summary: "Bloomberg报道称，Meta正在研究把多余AI算力和模型托管能力向外部客户销售的云基础设施业务，可能同时覆盖原始算力租用和托管模型访问。",
    summaryEn: "Bloomberg reported that Meta is developing a cloud-infrastructure business that could sell spare AI compute and hosted-model access to outside customers.",
    publishedAt: "2026-07-01T14:39:00Z",
    sourceName: "Bloomberg News",
    sourceUrl: "https://news.bloomberglaw.com/ip-law/meta-is-building-a-cloud-business-to-sell-excess-ai-compute-1",
    region: "美国",
    status: "reported",
    statusLabel: "内部规划 · 产品未发布",
    statusLabelEn: "Internal planning · no product announced",
    sourceCount: 1,
    entities: ["Meta", "Meta Compute"],
    officialResponse: "Meta尚未公布产品、价格或上线时间；管理层此前只公开表示，进入云计算业务属于可能选项。",
    officialResponseEn: "Meta has not announced a product, pricing or launch date; management had only said that entering cloud computing was an option.",
    sourceNote: "Bloomberg基于未具名知情人士报道，当前没有对应的正式产品页面。",
    sourceNoteEn: "Bloomberg cited unnamed people familiar with the plans; no corresponding product page has been published.",
  },
];
