export type FormalNewsSupplement = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  publishedAt: string;
  category: string;
  score: null;
  permalink: string;
  sourceUrl: string;
  sourceName: string;
  signal: "capacity" | "hardware" | "network";
  curator: "官方来源";
  region: "中国" | "美国" | "全球";
  milestone: string;
  scale: string;
  listedTicker?: string;
  whyItMatters: string;
  whyItMattersEn: string;
  verifiedAt?: string;
  lifecycle?: Array<{ label: string; state: "done" | "current" | "next" }>;
};

export const FORMAL_PULSE_SUPPLEMENT: FormalNewsSupplement[] = [{
  id: "singapore-dc-cfa2-200mw",
  title: "新加坡暂定向四家数据中心运营商分配 200MW",
  titleEn: "Singapore provisionally allocates 200MW across four data-centre operators",
  summary: "EDB 与 IMDA 通过第二轮数据中心申请向 Digital Realty、Equinix、Keppel Data Centres 与 ST Telemedia Global Data Centres 各暂定分配 50MW；项目将落在 Jurong Island，至少一半容量须使用绿电。",
  summaryEn: "EDB and IMDA provisionally allocated 50MW each to Digital Realty, Equinix, Keppel Data Centres and ST Telemedia Global Data Centres. The projects will locate on Jurong Island, and at least half of their capacity must use green energy.",
  publishedAt: "2026-08-21T00:00:00+08:00",
  category: "idc-capacity",
  score: null,
  permalink: "https://www.edb.gov.sg/en/about-edb/media-releases-publications/four-data-centre-proposals-selected-as-part-of-second-data-centre.html",
  sourceUrl: "https://www.edb.gov.sg/en/about-edb/media-releases-publications/four-data-centre-proposals-selected-as-part-of-second-data-centre.html",
  sourceName: "Singapore EDB / IMDA",
  signal: "capacity",
  curator: "官方来源",
  region: "全球",
  milestone: "DC-CFA2 暂定分配",
  scale: "200MW · 4 × 50MW · Jurong Island",
  listedTicker: "Digital Realty · DLR / Equinix · EQIX",
  whyItMatters: "新加坡把新增数据中心容量与绿电、液冷和高能效条件绑定；50MW 配额是项目准入与规划节点，后续仍需跟踪选址、建设、供电和投运。",
  whyItMattersEn: "Singapore tied new data-centre capacity to green energy, liquid cooling and high-efficiency requirements. The awards are access and planning milestones, not operating capacity.",
  verifiedAt: "2026-08-22",
  lifecycle: [{ label: "暂定分配", state: "done" }, { label: "选址与建设", state: "current" }, { label: "供电与投运", state: "next" }],
}];

export const FORMAL_LISTED_SUPPLEMENT: FormalNewsSupplement[] = [
  {
    id: "cerebras-cs4-rack-scale-2026",
    title: "Cerebras 发布 CS-4 机架级系统，系统 I/O 达 7.2Tbps",
    titleEn: "Cerebras launches the CS-4 rack-scale system with 7.2Tbps of system I/O",
    summary: "CS-4 在单机架内集成三颗 WSE-3T，披露 750PFLOPs AI 计算能力和 7.2Tbps 系统 I/O，并支持 Direct Wafer Links 与 RoCE v2；公司称首批出货将在本季度开始。",
    summaryEn: "The CS-4 integrates three WSE-3T processors in one rack, with 750PFLOPs of AI compute and 7.2Tbps of system I/O. Cerebras says initial shipments begin this quarter.",
    publishedAt: "2026-08-18T00:00:00-07:00", category: "idc-supply-chain", score: null,
    permalink: "https://investors.cerebras.ai/news-releases/news-release-details/cerebras-unveils-cs-4-30-times-faster-gpu-based-solutions",
    sourceUrl: "https://investors.cerebras.ai/news-releases/news-release-details/cerebras-unveils-cs-4-30-times-faster-gpu-based-solutions",
    sourceName: "Cerebras Investor Relations", signal: "network", curator: "官方来源", region: "美国",
    milestone: "产品发布 / 首批出货本季度开始", scale: "3 × WSE-3T · 750PFLOPs · 7.2Tbps I/O", listedTicker: "Cerebras · CBRS",
    whyItMatters: "这是机架级算力与互联共同设计的正式产品节点；7.2Tbps 是系统 I/O 指标，首批出货仍需后续收入与客户部署验证。",
    whyItMattersEn: "This is a formal rack-scale compute-and-interconnect product milestone. System I/O is not total data-centre bandwidth, and shipments still need customer and revenue validation.",
  },
  {
    id: "lumentum-fy2026-cpo-els-1-6t",
    title: "Lumentum 披露 CPO 激光器需求、首个 ELS 订单与 1.6T 模块进展",
    titleEn: "Lumentum reports CPO-laser demand, an initial ELS order and 1.6T module progress",
    summary: "Lumentum 在 FY2026 Q4 业绩原文中表示，超高功率 CPO 激光器需求上升，已取得首个外置激光源模块订单，同时 1.6T 云端模块和光路交换采用开始叠加。",
    summaryEn: "In its FY2026 Q4 results, Lumentum said demand for ultra-high-power CPO lasers is increasing, disclosed an initial external-laser-source module order, and said 1.6T cloud-module adoption is beginning to layer in.",
    publishedAt: "2026-08-11T00:00:00-07:00", category: "idc-supply-chain", score: null,
    permalink: "https://investor.lumentum.com/financial-news-releases/news-details/2026/Lumentum-Announces-Fourth-Quarter-and-Full-Fiscal-Year-2026-Results/default.aspx",
    sourceUrl: "https://investor.lumentum.com/financial-news-releases/news-details/2026/Lumentum-Announces-Fourth-Quarter-and-Full-Fiscal-Year-2026-Results/default.aspx",
    sourceName: "Lumentum Investor Relations", signal: "network", curator: "官方来源", region: "美国",
    milestone: "FY2026 Q4 业绩 / CPO 与 1.6T 需求信号", scale: "Q4 营收 $10.1 亿 · FY2027 Q1 指引 $12.25–12.75 亿", listedTicker: "Lumentum · LITE",
    whyItMatters: "CPO 观察从演示推进到激光器需求和 ELS 订单信号，但客户、订单金额、出货量或 CPO 收入占比均未披露。",
    whyItMattersEn: "The CPO watch has moved from demonstrations to laser-demand and ELS-order signals, but the customer, value, volume and CPO revenue contribution remain undisclosed.",
  },
  {
    id: "credo-omniconnect-ocp-scale-in-2026",
    title: "Credo 拟向 OCP 贡献 OmniConnect 规模内互联规范",
    titleEn: "Credo plans to contribute its OmniConnect scale-in interconnect specification to OCP",
    summary: "Credo 宣布成立 OCP OCE LSI 工作组，并计划贡献 OmniConnect 规范，用于芯片到芯片与内存解耦互联；方案覆盖高速铜缆和最高 1.6T 光互联。",
    summaryEn: "Credo announced an OCP OCE LSI workstream and plans to contribute OmniConnect for chip-to-chip and disaggregated-memory connectivity across copper and optical links up to 1.6T.",
    publishedAt: "2026-08-10T00:00:00-07:00", category: "idc-supply-chain", score: null,
    permalink: "https://investors.credosemi.com/news-events/news/news-details/2026/Credo-to-Contribute-OmniConnect-Scale-In-Interconnect-Solution-to-the-Open-Compute-Project-to-Address-AI-Inference-Memory-Wall/default.aspx",
    sourceUrl: "https://investors.credosemi.com/news-events/news/news-details/2026/Credo-to-Contribute-OmniConnect-Scale-In-Interconnect-Solution-to-the-Open-Compute-Project-to-Address-AI-Inference-Memory-Wall/default.aspx",
    sourceName: "Credo Investor Relations", signal: "network", curator: "官方来源", region: "美国",
    milestone: "OCP 工作组成立 / 规范拟贡献", scale: "铜与光互联最高 1.6T", listedTicker: "Credo · CRDO",
    whyItMatters: "规模内互联开始把内存池化、AEC 和光链路放进同一开放规范讨论；当前是标准贡献计划，不是已采用标准、客户订单或量产出货。",
    whyItMattersEn: "Scale-in interconnect is bringing memory pooling, AECs and optical links into one open-specification discussion. This is a planned contribution, not an adopted standard or shipment.",
  },
  {
    id: "arista-q2-2026-1-6t-lpo",
    title: "Arista 推出 1.6T AI 互联平台，LPO 方案称可降低约 60% 互联功耗",
    titleEn: "Arista introduces 1.6T AI fabric platforms and says LPO cuts interconnect power by about 60%",
    summary: "Arista Q2 新闻稿披露 1.6Tbps AI fabric 平台及液冷选项，7060XE7 系统带宽最高 100Tbps；公司称 LPO 相对传统可插拔方案可降低约 60% 互联功耗。",
    summaryEn: "Arista introduced 1.6Tbps AI-fabric platforms with liquid-cooled options and up to 100Tbps of system bandwidth. It says LPO can reduce interconnect power by about 60% versus traditional pluggables.",
    publishedAt: "2026-08-04T00:00:00-07:00", category: "idc-supply-chain", score: null,
    permalink: "https://www.arista.com/company/news/press-release/24401-pr-20260804", sourceUrl: "https://www.arista.com/company/news/press-release/24401-pr-20260804",
    sourceName: "Arista Networks", signal: "network", curator: "官方来源", region: "美国",
    milestone: "Q2 业绩 / 1.6T 产品发布", scale: "1.6Tbps 端口 · 7060XE7 最高 100Tbps", listedTicker: "Arista Networks · ANET",
    whyItMatters: "LPO 是与 CPO 并行的低功耗互联路径；约 60% 为公司比较值，不代表 CPO 部署或客户订单。",
    whyItMattersEn: "LPO is a parallel low-power path to CPO. The roughly 60% figure is Arista's comparison, not evidence of a CPO deployment or customer order.",
  },
  {
    id: "ciena-toshiba-1-6t-quantum-safe-dci-2026",
    title: "Ciena 与 Toshiba 在商用网络完成 1.6Tbps 量子安全数据中心互联",
    titleEn: "Ciena and Toshiba complete a 1.6Tbps quantum-safe data-centre interconnect on a commercial network",
    summary: "Quantum Corridor、Ciena 与 Toshiba 披露，在现网数据中心链路上完成 1.6Tbps 加密连接，并把 QKD 密钥与高速光传输结合。",
    summaryEn: "Quantum Corridor, Ciena and Toshiba said they completed a 1.6Tbps encrypted link between data centres on a live commercial network, combining QKD keys with optical transport.",
    publishedAt: "2026-08-04T00:00:00-04:00", category: "idc-supply-chain", score: null,
    permalink: "https://investor.ciena.com/news/news-details/2026/Quantum-Corridor-Ciena-and-Toshiba-Complete-Worlds-First-1-6-Tbs-Quantum-Safe-Optical-Encryption-Milestone-on-Live-Commercial-Network/default.aspx",
    sourceUrl: "https://investor.ciena.com/news/news-details/2026/Quantum-Corridor-Ciena-and-Toshiba-Complete-Worlds-First-1-6-Tbs-Quantum-Safe-Optical-Encryption-Milestone-on-Live-Commercial-Network/default.aspx",
    sourceName: "Ciena Investor Relations", signal: "network", curator: "官方来源", region: "美国",
    milestone: "商用网络互操作演示", scale: "1.6Tbps 加密数据中心互联", listedTicker: "Ciena · CIEN",
    whyItMatters: "这条记录补足 scale-across/DCI 维度，说明 1.6T 已进入现网加密互操作演示；它不是 CPO 量产或新增数据中心容量。",
    whyItMattersEn: "This adds a scale-across/DCI signal: 1.6T has reached encrypted interoperability on a live network. It is not evidence of CPO volume production or new capacity.",
  },
  {
    id: "celestica-q2-2026-800g-1-6t-programs",
    title: "Celestica Q2 HPS 收入约 19 亿美元，继续推进 800G/1.6T 网络项目",
    titleEn: "Celestica posts about $1.9B of Q2 HPS revenue and advances 800G/1.6T programs",
    summary: "Celestica 披露 Q2 营收 47.0 亿美元，CCS 收入 38.1 亿美元、同比增长 84%，其中 HPS 收入约 19 亿美元、同比增长 58%。",
    summaryEn: "Celestica reported Q2 revenue of $4.70B, CCS revenue of $3.81B, up 84%, and approximately $1.9B of HPS revenue, up 58%.",
    publishedAt: "2026-07-27T16:38:00-04:00", category: "idc-supply-chain", score: null,
    permalink: "https://corporate.celestica.com/news-releases/news-release-details/celestica-announces-second-quarter-2026-financial-results",
    sourceUrl: "https://corporate.celestica.com/news-releases/news-release-details/celestica-announces-second-quarter-2026-financial-results",
    sourceName: "Celestica", signal: "network", curator: "官方来源", region: "美国",
    milestone: "Q2 业绩 / 高性能系统项目更新", scale: "Q2 营收 $47.0 亿 · HPS 约 $19 亿", listedTicker: "Celestica · CLS",
    whyItMatters: "高速交换与计算平台需求已体现在 HPS 收入，但公开稿没有把 800G、1.6T 或 CPO 分别拆成订单和收入。",
    whyItMattersEn: "Demand for high-speed switching and compute platforms is visible in HPS revenue, but the release does not break out orders or revenue for 800G, 1.6T or CPO.",
  },
  {
    id: "singapore-dc-cfa2-200mw-listed-operators",
    title: "Digital Realty 与 Equinix 获新加坡 DC-CFA2 各 50MW 暂定配额",
    titleEn: "Digital Realty and Equinix each receive a provisional 50MW Singapore allocation",
    summary: "新加坡 EDB 与 IMDA 公布，Digital Realty、Equinix、Keppel Data Centres 与 ST Telemedia Global Data Centres 各获 50MW 暂定配额；项目位于 Jurong Island。",
    summaryEn: "Singapore EDB and IMDA said Digital Realty, Equinix, Keppel Data Centres and ST Telemedia Global Data Centres each received a provisional 50MW allocation on Jurong Island.",
    publishedAt: "2026-08-21T00:00:00+08:00", category: "idc-company", score: null,
    permalink: "https://www.edb.gov.sg/en/about-edb/media-releases-publications/four-data-centre-proposals-selected-as-part-of-second-data-centre.html",
    sourceUrl: "https://www.edb.gov.sg/en/about-edb/media-releases-publications/four-data-centre-proposals-selected-as-part-of-second-data-centre.html",
    sourceName: "Singapore EDB / IMDA", signal: "capacity", curator: "官方来源", region: "全球",
    milestone: "政府暂定配额", scale: "Digital Realty 50MW · Equinix 50MW", listedTicker: "Digital Realty · DLR / Equinix · EQIX",
    whyItMatters: "两家上市运营商新增的是新加坡项目配额，不是已投运容量；公开事实表未披露最终建筑、并网或交付时间。",
    whyItMattersEn: "The listed operators received project allocations, not operating capacity. Final construction, interconnection and delivery dates remain undisclosed.", verifiedAt: "2026-08-22",
  },
  {
    id: "micron-research-labs-10b-2026",
    title: "Micron 设立研究实验室，计划十年投入 100 亿美元",
    titleEn: "Micron launches research labs with a planned $10B decade-long investment",
    summary: "Micron IR 原文称，Boise 总部研究实验室将围绕先进内存、计算架构、封装和半导体制造开展长期研究，计划十年投入 100 亿美元，预计 2027 年开工。",
    summaryEn: "Micron says its Boise research labs will focus on advanced memory, compute architectures, packaging and semiconductor manufacturing, backed by a planned $10B investment over the next decade.",
    publishedAt: "2026-08-20T00:00:00-06:00", category: "idc-company", score: null,
    permalink: "https://investors.micron.com/news/press-release/2026/Micron-Unveils-Micron-Research-Labs-a-U-S--Based-Long-Horizon-Innovation-Hub-to-Shape-the-Future-of-Memory-and-AI/default.aspx",
    sourceUrl: "https://investors.micron.com/news/press-release/2026/Micron-Unveils-Micron-Research-Labs-a-U-S--Based-Long-Horizon-Innovation-Hub-to-Shape-the-Future-of-Memory-and-AI/default.aspx",
    sourceName: "Micron Investor Relations", signal: "hardware", curator: "官方来源", region: "美国",
    milestone: "研究投资计划公布", scale: "$10B planned over 10 years · Boise · 2027 groundbreaking target", listedTicker: "Micron · MU",
    whyItMatters: "Micron 将先进内存、封装和计算架构的研发投入单独量化；这是研发计划，不是已建成晶圆厂或数据中心容量。",
    whyItMattersEn: "Micron quantified long-horizon work on memory, packaging and compute architectures. This is an R&D plan, not completed fab or data-centre capacity.", verifiedAt: "2026-08-22",
  },
  {
    id: "biren-h1-2026-profit-alert-listed",
    title: "壁仞科技预计 H1 收入 11.5–13 亿元，8 月 28 日审议中期业绩",
    titleEn: "Biren guides to RMB1.15B–1.30B of H1 revenue; interim results due August 28",
    summary: "港交所盈利预告显示，公司预计 2026 年上半年收入同比增长约 1,852%–2,107%，经调整亏损预计约 2.9–3.6 亿元；最终数字仍可能调整。",
    summaryEn: "Biren's HKEX profit alert points to H1 2026 revenue growth of about 1,852%–2,107% and an adjusted loss of approximately RMB290M–360M. Final figures remain subject to adjustment.",
    publishedAt: "2026-08-17T07:30:00+08:00", category: "idc-company", score: null,
    permalink: "https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0817/2026081700117.pdf", sourceUrl: "https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0817/2026081700117.pdf",
    sourceName: "壁仞科技 / 港交所", signal: "hardware", curator: "官方来源", region: "中国",
    milestone: "中期盈利预告 / 完整业绩待发布", scale: "H1 收入 11.5–13 亿元 · 经调整亏损 2.9–3.6 亿元", listedTicker: "壁仞科技 · 06082.HK",
    whyItMatters: "盈利预告把国产 GPGPU 商业化转化为收入与亏损收窄信号；仍需等待完整业绩核对收入确认、毛利率、现金流、研发与客户结构。",
    whyItMattersEn: "The profit alert turns domestic GPGPU commercialization into revenue and loss-narrowing signals. Full results still need to confirm revenue recognition, margin, cash flow, R&D and customer mix.", verifiedAt: "2026-08-22",
  },
];
