import { metaBlackrockElPaso } from "./meta-blackrock-el-paso-data";
import { currentResearchRecords } from "./current-research-data";
import { nextWeekResearchRecords } from "./next-week-research-data";
import { nextCycleResearchRecords } from "./next-cycle-research-data";
import { septemberWeekResearchRecords } from "./september-week-research-data";
import { september15ResearchRecords } from "./september-15-research-data";
import septemberFourRecords from "./september-four-data.json";

export type ResearchMetric = {
  label: string;
  value: string;
  note: string;
};

export type ResearchStep = {
  title: string;
  body: string;
};

export type ResearchCard = {
  label: string;
  title: string;
  body: string;
};

export type ResearchSection = {
  label: string;
  heading: string;
  paragraphs: string[];
  table?: { headers: string[]; rows: string[][]; afterParagraph: number };
  metrics?: ResearchMetric[];
  steps?: ResearchStep[];
  cards?: ResearchCard[];
};

export type ResearchCopy = {
  hero: string;
  thesis: string;
  opening: string[];
  sections: ResearchSection[];
  conclusion: string;
  disclosure: string;
};

export type ResearchSource = {
  url: string;
  zh: string;
  en: string;
  level: "primary" | "reported";
};

export type ScheduledResearchRecord = {
  layout?: "explainer";
  slug: string;
  imageAltZh: string;
  imageAltEn: string;
  articleSectionZh: string;
  articleSectionEn: string;
  topics: string[];
  sources: ResearchSource[];
  zh: ResearchCopy;
  en: ResearchCopy;
};

export const scheduledResearchRecords: ScheduledResearchRecord[] = [
  ...(septemberFourRecords as ScheduledResearchRecord[]),
  ...september15ResearchRecords,
  ...septemberWeekResearchRecords,
  ...currentResearchRecords,
  ...nextCycleResearchRecords.filter((record) => !currentResearchRecords.some((current) => current.slug === record.slug)),
  ...nextWeekResearchRecords,
  metaBlackrockElPaso,
  {
    slug: "accelerator-platform-divergence",
    imageAltZh: "概念体素插画：具有独立交换网络的两组加速器平台",
    imageAltEn: "Conceptual voxel illustration of two distinct accelerator fabric islands",
    articleSectionZh: "GPU 平台与算力基础设施",
    articleSectionEn: "GPU platforms and compute infrastructure",
    topics: ["SpaceX", "NVIDIA", "AMD", "Anthropic", "Vera Rubin", "Helios", "AI infrastructure"],
    sources: [
      {
        url: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm",
        zh: "SpaceX 2026 Q2 Form 10-Q",
        en: "SpaceX Q2 2026 Form 10-Q",
        level: "primary",
      },
      {
        url: "https://ir.spacex.com/updates/releases-details/2026/SpaceX-to-Post-Second-Quarter-2026-Results-and-Host-Webcast-on-August-4-2026-2026-g8layJlbFm/default.aspx",
        zh: "SpaceX 官方财报活动页",
        en: "SpaceX official earnings event",
        level: "primary",
      },
      {
        url: "https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results",
        zh: "AMD 2026 Q2 官方业绩",
        en: "AMD Q2 2026 results",
        level: "primary",
      },
      {
        url: "https://ir.amd.com/news-events/press-releases/detail/1292/amd-and-anthropic-announce-strategic-partnership-to-deploy-up-to-2-gigawatts-of-amd-instinct-mi450-series-gpus",
        zh: "AMD 与 Anthropic 2GW 合作公告",
        en: "AMD-Anthropic 2GW partnership",
        level: "primary",
      },
      {
        url: "https://www.axios.com/2026/08/04/spacex-earnings-elon-musk",
        zh: "Axios 对 SpaceX 电话会的报道",
        en: "Axios report on the SpaceX call",
        level: "reported",
      },
    ],
    zh: {
      hero: "两家模型公司正在给出两种看似相反的采购答案。SpaceX 把新一代 AI 集群压在 NVIDIA Vera Rubin 上；Anthropic 则把最高 2GW 的增量容量交给 AMD Helios。分界线落在集群架构，而非采购名单。",
      thesis: "大客户会在公司层面保留多家供应商，在单座大规模集群内部却倾向统一平台。GPU 只是入口；CPU、网络、软件栈、机柜、电力和运维共同决定切换成本。SpaceX 与 Anthropic 的选择显示，AI 算力市场可能形成多平台并存、单集群标准化的格局。",
      opening: [
        "SpaceX 的正式 10-Q 给出了比电话会标题更有用的底座。截至 2026 年 6 月 30 日，公司 AI 计算的铭牌功率为 1.4GW，一年前为 0.4GW。这个口径只计算已安装 GPU 的整机功率，不含冷却、配电损耗、照明和设施开销，因此园区总负荷还会更高。",
        "同一份文件显示，上半年购买物业、厂房和设备支出为 284.76 亿美元；服务器与网络设备账面原值达到 347.71 亿美元，数据中心基础设施为 39.91 亿美元，在建工程为 125.54 亿美元。SpaceX 已经进入以电力、施工和系统交付为约束的阶段。",
        "Axios 转述电话会称，SpaceX 的新一代 AI 基础设施将采用 NVIDIA Vera Rubin。该供应商表述目前来自媒体对电话会的报道，未写入 10-Q。本文把它保留为“管理层经媒体转述的计划”，不扩大成对全部历史集群的排他性结论。",
      ],
      sections: [
        {
          label: "01 · REPORTED BASE",
          heading: "先把两边的已披露规模放到同一张表",
          paragraphs: [
            "AMD 在 Q2 创下 115.36 亿美元收入，数据中心业务为 67 亿美元，同比增长 107%。公司同时确认，Helios 已开始爬坡，MI450 系列的客户部署正在扩大。财务结果证明 AMD 的数据中心业务已经跨过试验性收入阶段，但 2GW 合作仍属于未来交付。",
            "Anthropic 与 AMD 的正式公告约定最高 2GW MI450 系列 GPU，第一批 1GW 从 2027 年上半年开始部署。Helios 组合包括 MI455X、EPYC Venice、Pensando 网络和 ROCm。AMD 还承诺未来向 Anthropic 投资最高 50 亿美元。芯片采购、软件协作和资本关系被放进了同一份安排。",
          ],
          metrics: [
            {
              label: "SpaceX 已安装算力",
              value: "1.4GW",
              note: "2026 年 6 月 30 日铭牌计算功率；不含设施级开销。",
            },
            {
              label: "SpaceX 上半年 PP&E 采购",
              value: "284.76 亿美元",
              note: "同时覆盖数据中心、相关基础设施与航天设施，不能全部归入 AI。",
            },
            {
              label: "Anthropic / AMD",
              value: "最高 2GW",
              note: "第一批 1GW 计划于 2027 年上半年开始部署，属于前瞻计划。",
            },
          ],
        },
        {
          label: "02 · CLUSTER ECONOMICS",
          heading: "单集群标准化，比公司层面的多元采购更重要",
          paragraphs: [
            "一家 AI 实验室可以同时购买 NVIDIA、AMD 与定制 ASIC，但训练任务不会随意跨平台拆分。大规模作业要求一致的加速器行为、通信拓扑、故障恢复和编译环境。跨平台搬迁会重新触发模型验证、内核优化、通信调优和运维培训。",
            "Anthropic 在公告中强调“把合适的工作负载映射到合适的硬件”。这句话更接近组合管理：不同集群承担不同工作负载。它没有证明一套训练任务会在两种 GPU 之间无缝迁移。",
            "SpaceX 的选择则体现另一种路径。公司已经拥有 1.4GW 铭牌算力，继续用单一下一代平台可以减少扩容时的软件分叉、备件类型与网络调试。代价是采购议价和供应链集中度上升。",
          ],
          steps: [
            {
              title: "加速器确定机柜热密度",
              body: "GPU 数量、功率和互联方式决定机柜功率、母线、电缆与液冷回路。芯片选择会先变成机柜工程问题。",
            },
            {
              title: "网络决定集群边界",
              body: "Vera Rubin 与 Helios 各自绑定网络、CPU 和系统软件。规模越大，网络拓扑与故障域越难在交付后重做。",
            },
            {
              title: "软件决定可用算力",
              body: "安装 GPU 只形成铭牌容量。编译器、内核、调度和模型适配决定多少容量能够进入训练与推理。",
            },
            {
              title: "运营把选择锁定多年",
              body: "备件、现场服务、监控、员工技能与容量规划会围绕平台积累，形成持续切换成本。",
            },
          ],
        },
        {
          label: "03 · WHAT THE MARKET MAY MISS",
          heading: "AMD 要证明交付，NVIDIA 要证明系统优势能守住集中度",
          paragraphs: [
            "AMD 面前的任务已经从芯片规格转向系统兑现。1GW 起步意味着大量机柜、网络、CPU、内存、光互联、配电与冷却同时按计划上线。任何一个环节延迟，2GW 都只会停留在合作上限。",
            "NVIDIA 的优势也不再只来自单卡性能。Vera Rubin 能否通过完整机架、网络与软件缩短上线时间，将决定客户愿意为平台一致性支付多少溢价。SpaceX 的在建工程快速增加，为这个判断提供了真实的交付场景。",
            "对数据中心产业链而言，最有价值的读数不是“谁赢得一个客户”。需要追踪的是每个平台的实际送电、机柜密度、网络配置、冷却方式和可用率。它们决定收入落在哪个季度，也决定园区容量能否变成可计费算力。",
          ],
          cards: [
            {
              label: "AMD",
              title: "第一批 1GW 是否按时启动",
              body: "观察 2027 年上半年 Helios 机架交付、ROCm 优化与 Anthropic 生产负载的明确披露。",
            },
            {
              label: "NVIDIA",
              title: "Vera Rubin 的系统上线速度",
              body: "观察 SpaceX 是否披露安装容量、可用率和下一阶段园区电力，而非只看供应商名称。",
            },
            {
              label: "IDC",
              title: "铭牌功率与设施负荷的差距",
              body: "1.4GW 不含冷却与配电开销。园区总负荷、PUE 和送电节点仍是容量兑现的核心。",
            },
            {
              label: "BOUNDARY",
              title: "电话会报道不等同于 10-Q",
              body: "NVIDIA 独家计划来自 Axios 对管理层电话会的转述；官方 10-Q 仅确认算力规模与资本投入。",
            },
          ],
        },
        {
          label: "04 · FALSIFIABLE CHECKS",
          heading: "未来四个节点会决定这条判断是否成立",
          paragraphs: [
            "第一，SpaceX 后续文件是否继续提高铭牌算力，并把在建工程转入服务器、网络和数据中心基础设施。第二，Anthropic 的首个 1GW 是否如期进入部署，而非继续顺延。",
            "第三，AMD 是否披露 Helios 的实质收入与客户上线节奏。第四，两家公司是否公开跨平台工作负载的比例、迁移成本或利用率。任何一项偏离，都可能改变“组合多元、集群统一”的结论。",
          ],
        },
      ],
      conclusion: "AI 加速器竞争正在从芯片对比转向集群操作系统。客户会保留第二供应商，但一座 GW 级集群必须选择明确的工程标准。未来的胜负将由按时送电、按时上线和长期可用率决定。",
      disclosure: "资料截止：2026 年 8 月 5 日 16:30（北京时间）。SpaceX 财务与容量数据来自其 2026 Q2 10-Q；NVIDIA Vera Rubin 计划来自 Axios 对电话会的报道。AMD 财务与 Anthropic 合作规模来自 AMD 官方公告。前瞻部署时间、投资上限与性能描述均可能变化。",
    },
    en: {
      hero: "Two model builders are giving apparently opposite procurement answers. SpaceX is standardizing its next AI build on NVIDIA Vera Rubin, while Anthropic is assigning up to 2GW of incremental capacity to AMD Helios. The dividing line runs through cluster architecture, not the vendor list.",
      thesis: "Large buyers can diversify at the company level and still standardize each major cluster. GPUs are the entry point. CPUs, networking, software, racks, power and operations determine switching cost. SpaceX and Anthropic point toward a market with several platforms but fewer mixed-platform clusters.",
      opening: [
        "SpaceX's Form 10-Q provides the useful baseline. Nameplate compute draw reached 1.4GW on June 30, 2026, from 0.4GW a year earlier. The metric counts installed GPUs at all-in equipment power and excludes cooling, distribution losses, lighting and facility overhead, so total campus load is higher.",
        "The filing also shows $28.476 billion of property, plant and equipment purchases in the first half. Gross servers and networking equipment reached $34.771 billion, data-center infrastructure $3.991 billion and construction in progress $12.554 billion. SpaceX has moved into a phase constrained by power, construction and system delivery.",
        "Axios reported that management said new AI infrastructure would be built exclusively on NVIDIA Vera Rubin. That supplier statement is a media account of the call, not a line in the 10-Q. This column treats it as a reported management plan and does not extend it to every historical cluster.",
      ],
      sections: [
        {
          label: "01 · REPORTED BASE",
          heading: "Put the two disclosed buildouts on comparable footing",
          paragraphs: [
            "AMD reported record Q2 revenue of $11.536 billion. Data Center revenue was $6.7 billion, up 107% year over year. Management said Helios had begun to ramp and customer deployments of the MI450 family were expanding. The financials show that AMD's data-center business has moved beyond pilot revenue; the 2GW agreement still depends on future delivery.",
            "The AMD-Anthropic agreement covers up to 2GW of MI450-series GPUs, with the first 1GW beginning deployment in the first half of 2027. Helios combines MI455X accelerators, EPYC Venice CPUs, Pensando networking and ROCm. AMD also committed to a future strategic equity investment of up to $5 billion in Anthropic, linking hardware procurement, software work and capital.",
          ],
          metrics: [
            {
              label: "SpaceX installed compute",
              value: "1.4GW",
              note: "Nameplate compute draw at June 30; facility overhead is excluded.",
            },
            {
              label: "SpaceX first-half PP&E purchases",
              value: "$28.476B",
              note: "Covers data centers and related infrastructure as well as launch facilities.",
            },
            {
              label: "Anthropic / AMD",
              value: "Up to 2GW",
              note: "The first 1GW is scheduled to begin deployment in the first half of 2027.",
            },
          ],
        },
        {
          label: "02 · CLUSTER ECONOMICS",
          heading: "Cluster standardization matters more than portfolio diversification",
          paragraphs: [
            "An AI lab can buy NVIDIA, AMD and custom ASICs without splitting one training job freely across all three. Large jobs require consistent accelerator behavior, communication topology, recovery procedures and compiler environments. Moving across platforms reopens model validation, kernel work, collective tuning and operations training.",
            "Anthropic says diversified hardware lets it map the right workloads to the right hardware. That describes portfolio allocation: separate clusters can carry separate workloads. It does not establish frictionless movement of one training run between GPU stacks.",
            "SpaceX represents the other path. With 1.4GW already installed, one next-generation standard can reduce software branches, spare-part variety and network debugging. Procurement leverage and supply concentration become the tradeoff.",
          ],
          steps: [
            {
              title: "Accelerators set rack density",
              body: "GPU count, power and interconnect determine busways, cabling and liquid-cooling loops. Silicon becomes a rack-engineering decision.",
            },
            {
              title: "Networks define cluster boundaries",
              body: "Vera Rubin and Helios bind networking, CPUs and system software. At scale, topology and failure domains are expensive to redesign.",
            },
            {
              title: "Software creates usable compute",
              body: "Installed GPUs create nameplate capacity. Compilers, kernels, scheduling and model adaptation determine how much enters production.",
            },
            {
              title: "Operations extend lock-in",
              body: "Spares, field service, monitoring, staff skills and capacity planning accumulate around a platform over multiple years.",
            },
          ],
        },
        {
          label: "03 · WHAT THE MARKET MAY MISS",
          heading: "AMD must prove delivery; NVIDIA must defend the value of system consistency",
          paragraphs: [
            "AMD's test has shifted from chip specifications to system execution. A 1GW starting tranche requires racks, networking, CPUs, memory, optics, distribution and cooling to arrive together. A delay in any layer can leave the 2GW headline as an unfilled ceiling.",
            "NVIDIA's advantage now extends beyond device performance. If Vera Rubin's rack, network and software stack shortens time to service, customers may pay for consistency. SpaceX's rapid growth in construction in progress gives that claim a real delivery environment.",
            "For the data-center chain, the useful readout is not the identity of one winning supplier. Actual energization, rack density, network design, cooling and availability determine when revenue is recognized and whether campus capacity becomes billable compute.",
          ],
          cards: [
            {
              label: "AMD",
              title: "Does the first 1GW start on time?",
              body: "Watch for 2027 Helios deliveries, ROCm optimization and explicit Anthropic production workloads.",
            },
            {
              label: "NVIDIA",
              title: "Vera Rubin time to service",
              body: "SpaceX needs to disclose installed capacity, availability and the next power step, not only a vendor name.",
            },
            {
              label: "IDC",
              title: "Nameplate versus facility load",
              body: "The 1.4GW metric excludes cooling and distribution overhead. Campus load, PUE and energization still govern conversion.",
            },
            {
              label: "BOUNDARY",
              title: "Media call report versus filing",
              body: "The exclusive NVIDIA plan is reported by Axios. The 10-Q confirms scale and capital spending, not the supplier choice.",
            },
          ],
        },
        {
          label: "04 · FALSIFIABLE CHECKS",
          heading: "Four disclosures can overturn or confirm the thesis",
          paragraphs: [
            "First, SpaceX must keep raising nameplate compute and transfer construction in progress into servers, networking and data-center infrastructure. Second, Anthropic's first 1GW needs to enter deployment on schedule.",
            "Third, AMD must show material Helios revenue and customer activation. Fourth, either company would need to disclose workload allocation, migration cost or utilization across platforms. A miss on any of these points can weaken the portfolio-diverse, cluster-standardized view.",
          ],
        },
      ],
      conclusion: "Accelerator competition is becoming a contest between cluster operating systems. Customers will keep a second supplier, but a gigawatt-scale cluster still needs a clear engineering standard. Delivery, energization and sustained availability will settle the argument.",
      disclosure: "Information cut-off: August 5, 2026, 4:30 PM Beijing time. SpaceX financial and capacity figures come from its Q2 2026 Form 10-Q. The Vera Rubin plan is reported by Axios from the earnings call. AMD financials and the Anthropic agreement come from AMD releases. Deployment timing, investment ceilings and performance claims are forward-looking.",
    },
  },
  {
    slug: "us-data-center-power-gate",
    imageAltZh: "概念体素插画：机房、自备发电设施与电网接入关口",
    imageAltEn: "Conceptual voxel illustration of a power gate joining an onsite generator to a compute hall",
    articleSectionZh: "美国数据中心电力与政策",
    articleSectionEn: "U.S. data-center power and policy",
    topics: ["data centers", "power", "PJM", "EPA", "ratepayer protection", "behind the meter"],
    sources: [
      {
        url: "https://www.epa.gov/newsreleases/president-trump-expands-historic-ratepayer-protection-pledge-protect-american",
        zh: "EPA 用电成本保护承诺",
        en: "EPA Ratepayer Protection Pledge",
        level: "primary",
      },
      {
        url: "https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers",
        zh: "EPA 数据中心清洁空气法资源页",
        en: "EPA Clean Air Act resources for data centers",
        level: "primary",
      },
      {
        url: "https://www.epa.gov/system/files/documents/2026-07/epa-issues-clarification-on-islanded-power-generators-and-acid-rain-program-provisions.pdf",
        zh: "EPA 孤网发电与酸雨计划澄清文件",
        en: "EPA clarification on islanded generation and the Acid Rain Program",
        level: "primary",
      },
      {
        url: "https://www.energy.gov/articles/energy-secretary-secures-mid-atlantic-grid-ahead-period-hot-weather",
        zh: "美国能源部电网应急与可靠性文件",
        en: "U.S. Department of Energy grid reliability action",
        level: "primary",
      },
    ],
    zh: {
      hero: "美国数据中心的选址表正在重写。拥有土地和光纤仍不够，开发商需要带来新增电源、支付输配电升级，并在实际用电低于预期时继续承担约定容量成本。",
      thesis: "新增算力负荷正从公共电网的普通客户变成带电源方案的工业项目。项目价值将更多落在可交付电源、燃料、空气许可、容量付款和并网责任上。自备电源能够压缩等待时间，也会把燃料、排放、运维与融资风险转移到园区。",
      opening: [
        "2026 年 7 月，EPA 扩展“用电成本保护承诺”。七家 AI 与云计算公司此前已承诺建设、引入或购买全部新增电源，承担配套输配电升级，并按议定电价付款，即使实际用电没有达到合同容量。",
        "同一政策框架提到，PJM 区域计划推动超过 150 亿美元的新增基荷电源，并要求为数据中心建设的容量由数据中心承担。政策方向很清楚：居民和既有用户不应为 AI 负荷的新增系统成本兜底。",
        "EPA 还在 7 月 16 日发布孤网发电澄清。需要准确读它的边界：文件处理的是《酸雨计划》特定条款，不等于数据中心自备燃气机组全面免于《清洁空气法》。固定燃机、往复式发动机、危险空气污染物和州级许可仍有各自规则。",
      ],
      sections: [
        {
          label: "01 · THE NEW COST STACK",
          heading: "电价只是账单的一部分",
          paragraphs: [
            "传统模型把数据中心看作大用户：接入电网，按负荷和电量付费。新模型要求开发商提前参与电源、输电、变电与可靠性建设。它更接近大型工业项目，资本成本与许可进度会在送电前数年进入选址判断。",
            "“自带电源”也有多种形态。园区可以建设表后燃气发电与储能，可以签长期购电协议，也可以在容量市场为新增机组提供固定付款。三种方式对应不同的资产所有权、燃料风险和监管边界。",
          ],
          metrics: [
            {
              label: "签署企业",
              value: "7 家",
              note: "Amazon、Google、Meta、Microsoft、OpenAI、Oracle 与 xAI。",
            },
            {
              label: "PJM 新增基荷计划",
              value: "超过 150 亿美元",
              note: "政策计划规模；项目、回报机制与投运时间仍需逐项确认。",
            },
            {
              label: "付款原则",
              value: "按约定容量承担",
              note: "即使实际用电较低，签署方也承诺支付议定成本。",
            },
          ],
        },
        {
          label: "02 · PROJECT TRANSMISSION",
          heading: "一条政策如何进入园区模型",
          paragraphs: [
            "园区开发商会先比较两条时间线：公共电网扩建所需年限，以及自备电源从设备采购到空气许可和燃料接入的年限。速度更快的一方不一定成本更低；它只是在收入开始时间上更有确定性。",
            "容量付款改变了“先圈地、后找客户”的经济性。若开发商为尚未用足的电源持续付款，租赁预签率、客户信用和分期建设就会直接影响融资。低利用率不再只损害机房收入，还会留下独立的电力负担。",
          ],
          steps: [
            {
              title: "土地先看燃料与许可",
              body: "天然气管线、排放空间、噪声、水与地方审批会与电网接入一起进入早期筛选。",
            },
            {
              title: "电源方案进入融资文件",
              body: "容量义务、输配电升级和最低付款决定项目固定成本，也影响贷款覆盖倍数。",
            },
            {
              title: "送电节点决定租金起算",
              body: "设备到场不等于可计费容量。燃料、排放许可、调试和并网测试仍需逐项完成。",
            },
            {
              title: "运营承担双重可靠性",
              body: "孤网运行需要备件、维护、黑启动与储能协同；与公共电网并行时还要处理调度责任。",
            },
          ],
        },
        {
          label: "03 · THE REGULATORY BOUNDARY",
          heading: "孤网澄清减少一处不确定性，没有取消空气许可",
          paragraphs: [
            "EPA 的 7 月文件解释，某些与电网物理隔离的发电设备在《酸雨计划》中的适用方式。它解决了一个联邦规则解释问题，却没有替代州和地方发证，也没有取消固定燃机与发动机可能适用的 NSPS、NESHAP 和新源审查。",
            "这一区别会影响项目估值。把澄清误读成“自备电厂免许可”，会低估控制设备、建模、监测和工期。稳健的项目模型需要把每一台发动机或燃机的用途、运行小时、燃料和排放控制单独列出。",
            "政策同时提高了公开资料的价值。空气许可、燃气接入、容量市场文件与公用事业费率案将比企业新闻稿更早暴露项目能否落地。",
          ],
          cards: [
            {
              label: "POWER",
              title: "新增电源是否已锁定",
              body: "区分口头承诺、购电协议、设备订单、燃气合同与实际投运。",
            },
            {
              label: "GRID",
              title: "升级成本由谁支付",
              body: "查看公用事业费率案、并网协议与最低付款，而非只看平均电价。",
            },
            {
              label: "AIR",
              title: "许可是否覆盖实际运行",
              body: "核对发动机类型、年运行小时、排放控制和州级审批状态。",
            },
            {
              label: "UTILIZATION",
              title: "未用容量仍有成本",
              body: "客户预签、分期投产与容量付款共同决定现金流压力。",
            },
          ],
        },
        {
          label: "04 · WHAT TO WATCH",
          heading: "下一轮数据中心竞争会围绕“可交付电力”排序",
          paragraphs: [
            "未来六个月应优先跟踪四类文件：公用事业费率与特别合同、PJM 新增电源和容量安排、州级空气许可、园区设备订单与燃料协议。任何一个环节缺失，都可能让“自带电源”停留在概念图。",
            "当这些文件齐全，数据中心公司与传统电力设备商的边界会变得模糊。开发商可能持有发电资产，设备商可能提供融资和长期服务，云厂商则通过最低付款把信用传递给整套基础设施。",
          ],
        },
      ],
      conclusion: "美国数据中心的新门票由四部分组成：新增电源、输配电责任、空气许可和持续付款。拥有土地与客户仍然重要，能够把电源按时变成可计费容量，才会决定下一批园区的先后顺序。",
      disclosure: "资料截止：2026 年 8 月 5 日 17:00（北京时间）。政策义务与 150 亿美元计划来自 EPA 官方文件。孤网发电分析依据 EPA 2026 年 7 月 16 日澄清及其数据中心清洁空气法资源页。本文没有将特定项目计划视为已投运电源。",
    },
    en: {
      hero: "The U.S. data-center site-selection sheet is being rewritten. Land and fiber are no longer enough. Developers increasingly need to bring new supply, fund delivery upgrades and keep paying for contracted capacity even when load falls short.",
      thesis: "Incremental compute load is shifting from an ordinary utility customer into an industrial project with its own power plan. Deliverable generation, fuel, air permits, capacity payments and interconnection responsibility now shape site value. Behind-the-meter power can compress the wait, while transferring fuel, emissions, maintenance and financing risk to the campus.",
      opening: [
        "EPA expanded the Ratepayer Protection Pledge in July 2026. Seven AI and cloud companies had already committed to build, bring or buy the power required for their facilities, fund supporting delivery upgrades and pay negotiated charges even if actual use falls below contracted capacity.",
        "The same policy framework points to more than $15 billion of new baseload generation through PJM and a requirement that data centers pay for capacity built on their behalf. The direction is explicit: households and existing customers should not carry the incremental system cost of AI demand.",
        "EPA also issued a July 16 clarification on islanded generation. Its scope matters. The document addresses specific Acid Rain Program provisions; it is not a blanket Clean Air Act exemption for on-site gas generation. Stationary turbines, reciprocating engines, hazardous-air rules and state permits retain separate requirements.",
      ],
      sections: [
        {
          label: "01 · THE NEW COST STACK",
          heading: "The energy price is only one line in the bill",
          paragraphs: [
            "The conventional model treated a data center as a large load connecting to the grid. The emerging model asks the developer to participate in generation, transmission, substations and reliability before energization. That makes the campus look more like a heavy industrial project, with capital and permitting decisions years ahead of revenue.",
            "Bring-your-own-power can mean different things: behind-the-meter gas and storage, long-term power-purchase agreements, or fixed capacity-market support for new plants. Each carries a different mix of ownership, fuel exposure and regulation.",
          ],
          metrics: [
            {
              label: "Corporate signatories",
              value: "7",
              note: "Amazon, Google, Meta, Microsoft, OpenAI, Oracle and xAI.",
            },
            {
              label: "PJM baseload plan",
              value: "More than $15B",
              note: "A policy target; projects, return mechanisms and in-service dates still require verification.",
            },
            {
              label: "Payment principle",
              value: "Pay contracted capacity",
              note: "The pledge covers negotiated costs even when actual consumption is lower.",
            },
          ],
        },
        {
          label: "02 · PROJECT TRANSMISSION",
          heading: "How policy enters a campus model",
          paragraphs: [
            "Developers now compare two timelines: utility expansion and the path from on-site equipment orders through air permits and fuel delivery. The faster route can still be more expensive. Its value is earlier, more certain revenue.",
            "Capacity payments change the economics of securing land before customers. A campus paying for underused generation needs pre-leasing, strong counterparties and disciplined phasing. Low utilization can leave a power obligation alongside vacant data halls.",
          ],
          steps: [
            {
              title: "Sites screen for fuel and permits",
              body: "Gas access, emissions headroom, noise, water and local approval move into the same early filter as interconnection.",
            },
            {
              title: "Power enters financing documents",
              body: "Capacity obligations, delivery upgrades and minimum payments become fixed costs that affect debt coverage.",
            },
            {
              title: "Energization starts the revenue clock",
              body: "Equipment arrival is not billable capacity. Fuel, permits, commissioning and grid tests still have to close.",
            },
            {
              title: "Operations carry two reliability systems",
              body: "Islanded campuses need spares, maintenance, black start and storage coordination; grid-parallel assets add dispatch duties.",
            },
          ],
        },
        {
          label: "03 · THE REGULATORY BOUNDARY",
          heading: "The islanded-generation clarification removes one ambiguity, not air permitting",
          paragraphs: [
            "EPA's July document explains how some physically isolated generation is treated under the Acid Rain Program. It resolves one federal interpretation and does not replace state or local permits, NSPS, NESHAP or New Source Review that may apply to turbines and engines.",
            "That distinction affects valuation. Reading the clarification as a permit exemption understates control equipment, modeling, monitoring and schedule. A robust campus model identifies each unit's use, operating hours, fuel and emissions controls.",
            "Public filings become more valuable under this regime. Air permits, gas connections, capacity-market records and utility tariff cases can reveal execution earlier than a developer announcement.",
          ],
          cards: [
            {
              label: "POWER",
              title: "Is new supply actually secured?",
              body: "Separate statements of intent from PPAs, equipment orders, gas contracts and commissioned output.",
            },
            {
              label: "GRID",
              title: "Who funds delivery upgrades?",
              body: "Read utility tariffs, interconnection agreements and minimum payments, not only average energy prices.",
            },
            {
              label: "AIR",
              title: "Does the permit match operations?",
              body: "Check engine type, annual hours, controls and state approval status.",
            },
            {
              label: "UTILIZATION",
              title: "Unused power still costs money",
              body: "Pre-leasing, phasing and contracted capacity jointly set cash-flow pressure.",
            },
          ],
        },
        {
          label: "04 · WHAT TO WATCH",
          heading: "The next U.S. campus ranking will be based on deliverable power",
          paragraphs: [
            "Four document sets deserve priority over the next six months: utility tariffs and special contracts, PJM generation and capacity arrangements, state air permits, and equipment plus fuel agreements. A missing layer can leave bring-your-own-power as a rendering.",
            "When those documents line up, the boundary between data-center developer and power company blurs. Developers may own generation, equipment suppliers may provide financing and service, and hyperscalers may pass credit through minimum-use commitments.",
          ],
        },
      ],
      conclusion: "The new U.S. data-center entry price has four parts: new supply, grid responsibility, air permits and continuing payment. Land and customers still matter. The order of the next campuses will be set by who turns power into billable capacity on schedule.",
      disclosure: "Information cut-off: August 5, 2026, 5:00 PM Beijing time. Pledge obligations and the $15B plan come from EPA. The islanded-generation discussion uses EPA's July 16 clarification and its Clean Air Act resource center. No proposed project is treated as commissioned capacity.",
    },
  },
  {
    slug: "ai-infrastructure-financing",
    imageAltZh: "概念体素插画：分层资本结构支撑计算机架与使用承诺",
    imageAltEn: "Conceptual voxel illustration of compute pod supported by a layered capital scaffold",
    articleSectionZh: "AI 基础设施融资",
    articleSectionEn: "AI infrastructure financing",
    topics: ["Broadcom", "Apollo", "Blackstone", "Anthropic", "private credit", "AI XPV", "Fluidstack"],
    sources: [
      {
        url: "https://www.apollo.com/insights-news/pressreleases/2026/06/broadcom--apollo--and-blackstone-establish-landmark-strategic-pl",
        zh: "AI XPV 平台官方公告",
        en: "Official AI XPV platform announcement",
        level: "primary",
      },
      {
        url: "https://ir.apollo.com/_assets/_0cf46289135c652dcf5d317982a2f526/apollo/news/2026-06-09_Apollo_Leads_35_Billion_Capital_Solution_for_629.pdf",
        zh: "Apollo 350 亿美元资本方案",
        en: "Apollo $35B capital solution",
        level: "primary",
      },
      {
        url: "https://investors.broadcom.com/node/64396/pdf",
        zh: "Broadcom 项目公告",
        en: "Broadcom transaction announcement",
        level: "primary",
      },
      {
        url: "https://www.apollo.com/insights-news/insights/2026/07/jim-zelter-on-bloomberg-meeting-europe-s-growing-capital-needs",
        zh: "Apollo 管理层对融资结构的公开说明",
        en: "Apollo management discussion of the financing structure",
        level: "primary",
      },
    ],
    zh: {
      hero: "350 亿美元、超过 1GW、五年摊还。Broadcom、Apollo 与 Blackstone 正在把芯片、网络、机房和长期算力需求装进一个可融资平台。最大的未知数留给了利用率与硬件残值。",
      thesis: "AI 基础设施融资正在从企业资产负债表走向项目化私人信贷。长期客户承诺和专用芯片降低了建设期风险，也制造了新的期限错配：模型需求变化快于贷款摊还，硬件代际快于数据中心寿命。谁承担未用容量与过时设备，决定这类融资能否复制到 20GW。",
      opening: [
        "2026 年 6 月，Broadcom、Apollo 与 Blackstone 宣布 AI XPV Platform。首笔 350 亿美元资金用于支持 Anthropic 超过 1GW 的算力扩张，计划从 2026 年中期起在 Fluidstack 运营的站点部署。平台目标是在 2028 年前支持超过 20GW 的 Broadcom XPU 与网络容量。",
        "公告把它描述为一个可复制的框架。它的确把资金来源从单一科技公司扩展到保险资金与私人信贷，但公开资料没有完整披露每个资产的所有权、客户最低付款、设备残值担保、提前终止条款或每 GW 的建设成本。",
        "Apollo 总裁 Jim Zelter 后续把首笔融资描述为五年期、逐步摊还的债务，并强调控制下行与残值风险。该表述来自管理层公开访谈。合同文本并未公开，因此本文只讨论结构机制，不推断未披露的担保。",
      ],
      sections: [
        {
          label: "01 · WHAT IS REPORTED",
          heading: "350 亿美元无法直接除以 1GW",
          paragraphs: [
            "首笔方案同时覆盖 Broadcom 定制 XPU、网络、站点部署和资本结构。将 350 亿美元简单除以“超过 1GW”会得到一个夸大的单位成本，因为资金可能包含设备采购、建设期融资、利息储备、扩容选项和多个站点。",
            "同样，20GW 是平台到 2028 年的支持目标，不是已签署、已送电或已计费容量。只有当设备订单、站点、客户承诺和资金关闭同时出现，单个项目才进入可交付阶段。",
          ],
          metrics: [
            {
              label: "初始资本方案",
              value: "350 亿美元",
              note: "由 Apollo 牵头、Blackstone 参与；具体分层与担保未完整公开。",
            },
            {
              label: "首批算力",
              value: "超过 1GW",
              note: "面向 Anthropic，计划在 Fluidstack 站点从 2026 年中期开始部署。",
            },
            {
              label: "平台目标",
              value: "超过 20GW",
              note: "截至 2028 年的支持目标，不等同于已签容量。",
            },
          ],
        },
        {
          label: "02 · THE CAPITAL CHAIN",
          heading: "信用从模型需求一路传到数据中心资产",
          paragraphs: [
            "融资成立需要四层同时工作。Anthropic 提供长期算力需求；Broadcom 提供定制 XPU 和网络路线图；Fluidstack 负责站点部署；Apollo 与 Blackstone 把长期合同和设备资产转成债务现金流。",
            "这个结构降低了 Anthropic 一次性持有全部资产的压力，也让 Broadcom 的订单拥有更确定的资金来源。信贷方换来的是可预测摊还，但必须接受技术资产更新速度远快于传统基础设施。",
          ],
          steps: [
            {
              title: "需求承诺形成收入底座",
              body: "最低使用、付款期限和客户信用决定债务能否按计划摊还；这些条款尚未公开。",
            },
            {
              title: "设备路线图决定残值",
              body: "定制 XPU 与网络的二级市场窄于通用服务器。下一代芯片提前到来会压缩可再利用价值。",
            },
            {
              title: "站点交付控制时间风险",
              body: "送电、冷却、网络和机房延迟会让已采购设备等待收入，同时开始承担折旧和利息。",
            },
            {
              title: "私人信贷吸收期限错配",
              body: "五年摊还可以缩短风险暴露，但仍需客户付款、资产处置和再融资共同完成。",
            },
          ],
        },
        {
          label: "03 · WHERE THE RISK SITS",
          heading: "最难定价的是未用容量和代际过时",
          paragraphs: [
            "AI 算力的长期合同可以锁定名义需求，却无法保证每小时利用率。若模型效率提高、推理价格下行或工作负载转移，客户可能仍付款，但资产的续约价值会下降。若合同允许调整或退出，风险会更早回到项目公司和债权人。",
            "硬件残值是第二个变量。机房、供电和冷却可以服务十年以上，定制加速器的经济寿命短得多。项目必须在前几个年份回收足够现金，或让下一代设备继续使用既有设施。",
            "第三个变量是集中度。首笔项目依赖 Anthropic、Broadcom 与 Fluidstack 的协同。任何一方的产品、融资或交付变化都可能影响整套结构。公开资料尚不足以判断替换权和违约分配。",
          ],
          cards: [
            {
              label: "DEMAND",
              title: "客户最低付款",
              body: "需要核对用量不足时的付款、延期和终止条款。",
            },
            {
              label: "TECHNOLOGY",
              title: "设备残值",
              body: "定制 XPU 的再部署范围、软件兼容与二级市场决定回收率。",
            },
            {
              label: "DELIVERY",
              title: "站点与送电",
              body: "设备到场早于园区投运会增加利息、折旧与保管成本。",
            },
            {
              label: "CREDIT",
              title: "结构分层",
              body: "高级债、次级资本、担保与保险资金的具体损失顺序仍未披露。",
            },
          ],
        },
        {
          label: "04 · REPLICATION TEST",
          heading: "从 1GW 复制到 20GW，需要看到项目级证据",
          paragraphs: [
            "下一步不能只看新的资金标题。应逐个记录站点、送电日期、设备类型、客户、合同期限、融资关闭和投运容量。平台的规模只有在多个项目重复完成这些节点后才有意义。",
            "如果五年摊还能够在设备经济寿命内回收大部分本金，同时旧机房顺利承接下一代硬件，这套模式会成为 AI 资本开支的重要中介。若交付延迟、利用率不足或残值偏低，私人信贷的利差会先反映风险。",
          ],
        },
      ],
      conclusion: "350 亿美元解决了建设资金，不会自动解决利用率和残值。AI XPV 模式还要证明：长期算力合同能否在硬件过时之前产生足够现金，并让园区继续服务下一代设备。",
      disclosure: "资料截止：2026 年 8 月 5 日 17:20（北京时间）。交易规模、平台目标、部署对象与时间来自 Broadcom、Apollo 和 Blackstone 联合公告。五年摊还与风险控制表述来自 Apollo 管理层公开访谈。未公开合同条款均未作事实推断。",
    },
    en: {
      hero: "$35 billion, more than 1GW and five-year amortization. Broadcom, Apollo and Blackstone are packaging chips, networking, sites and long-duration compute demand into a financeable platform. Utilization and hardware residual value remain the hard variables.",
      thesis: "AI infrastructure is moving from corporate balance sheets into project-style private credit. Long-term demand and custom silicon reduce construction uncertainty while creating a maturity mismatch: model demand changes faster than debt amortizes, and hardware generations turn faster than data centers. Allocation of unused capacity and obsolete equipment will determine whether the model scales to 20GW.",
      opening: [
        "Broadcom, Apollo and Blackstone launched the AI XPV Platform in June 2026. The initial $35 billion capital solution supports more than 1GW for Anthropic, expected to deploy at Fluidstack-based sites beginning in mid-2026. The platform is designed to enable more than 20GW of Broadcom XPU and networking capacity through 2028.",
        "The announcement calls it a repeatable framework. It widens the funding base to insurance capital and private credit, but it does not disclose complete asset ownership, customer minimums, residual-value support, termination rights or unit cost by gigawatt.",
        "Apollo president Jim Zelter later described the initial financing as five-year amortizing paper and emphasized downside and residual-risk control. That is a public management description rather than a published contract. This column analyzes the mechanism without inventing undisclosed guarantees.",
      ],
      sections: [
        {
          label: "01 · WHAT IS REPORTED",
          heading: "$35 billion cannot be divided cleanly by 1GW",
          paragraphs: [
            "The initial solution spans custom Broadcom XPUs, networking, site deployment and financing. Dividing $35 billion by 'more than 1GW' overstates unit build cost because the envelope may include equipment, construction financing, interest reserves, expansion options and several sites.",
            "The 20GW figure is a platform objective through 2028, not contracted, energized or billed capacity. An individual project becomes deliverable only when equipment orders, sites, customer commitments and closed financing are present together.",
          ],
          metrics: [
            {
              label: "Initial capital solution",
              value: "$35B",
              note: "Led by Apollo with Blackstone; full layering and guarantees are not public.",
            },
            {
              label: "Initial compute",
              value: "More than 1GW",
              note: "For Anthropic at Fluidstack-based sites beginning in mid-2026.",
            },
            {
              label: "Platform objective",
              value: "More than 20GW",
              note: "A 2028 enablement target, not signed capacity.",
            },
          ],
        },
        {
          label: "02 · THE CAPITAL CHAIN",
          heading: "Credit travels from model demand into data-center assets",
          paragraphs: [
            "Four layers have to work together. Anthropic supplies long-term demand; Broadcom supplies a custom XPU and network roadmap; Fluidstack deploys the sites; Apollo and Blackstone translate contracts and equipment into debt cash flow.",
            "Anthropic reduces the need to own every asset up front, while Broadcom gains funded orders. Lenders receive scheduled amortization and accept that the technology turns much faster than conventional infrastructure.",
          ],
          steps: [
            {
              title: "Demand commitments support revenue",
              body: "Minimum use, payment duration and counterparty credit determine amortization; the detailed terms are not public.",
            },
            {
              title: "The roadmap sets residual value",
              body: "Custom XPUs and networks have a narrower secondary market than general servers. Early obsolescence lowers recovery.",
            },
            {
              title: "Site delivery controls timing",
              body: "Power, cooling, networking and data-hall delays leave purchased equipment waiting while interest and depreciation accrue.",
            },
            {
              title: "Private credit absorbs the mismatch",
              body: "Five-year amortization shortens exposure, but customer payments, asset disposition and refinancing still have to align.",
            },
          ],
        },
        {
          label: "03 · WHERE THE RISK SITS",
          heading: "Unused capacity and generational obsolescence are hardest to price",
          paragraphs: [
            "A long-term compute contract can lock in nominal demand without guaranteeing hourly utilization. Model efficiency, lower inference prices or workload migration may reduce renewal value even when the customer keeps paying. Flexible termination terms would return risk to the project company and lenders earlier.",
            "Residual value is the second variable. Data halls, power and cooling can operate for more than a decade; custom accelerators have shorter economic lives. The project needs substantial early cash recovery or an upgrade path that reuses the facility.",
            "Concentration is the third. The first project depends on Anthropic, Broadcom and Fluidstack acting together. Public information does not establish substitution rights or loss allocation if one layer changes.",
          ],
          cards: [
            {
              label: "DEMAND",
              title: "Customer minimums",
              body: "Underuse payments, deferral and termination terms determine revenue protection.",
            },
            {
              label: "TECHNOLOGY",
              title: "Equipment residual",
              body: "Redeployment range, software compatibility and secondary-market depth set recovery.",
            },
            {
              label: "DELIVERY",
              title: "Sites and energization",
              body: "Equipment arriving ahead of the campus increases interest, depreciation and storage costs.",
            },
            {
              label: "CREDIT",
              title: "Capital layering",
              body: "The loss order across senior debt, junior capital, guarantees and insurance money is not public.",
            },
          ],
        },
        {
          label: "04 · REPLICATION TEST",
          heading: "Scaling from 1GW to 20GW requires project-level evidence",
          paragraphs: [
            "The next financing headline is not enough. Each project needs a record of site, energization, equipment, customer, contract duration, financing close and commissioned capacity. Platform scale matters only after several projects repeat those milestones.",
            "If five-year amortization recovers most principal inside the hardware's economic life and older data halls accept the next generation, the structure can become a major channel for AI capex. Delays, weak utilization or poor residuals will first appear in private-credit pricing.",
          ],
        },
      ],
      conclusion: "$35 billion solves construction funding. It does not solve utilization or residual value. The AI XPV model must show that long-duration compute contracts generate enough cash before hardware ages, while the site remains useful for the next generation.",
      disclosure: "Information cut-off: August 5, 2026, 5:20 PM Beijing time. Transaction size, platform objective, deployment customer and timing come from the joint Broadcom-Apollo-Blackstone announcement. Five-year amortization and risk-control descriptions come from an Apollo management interview. No unpublished contract term is presented as fact.",
    },
  },
  {
    slug: "eu-ai-gigafactories",
    imageAltZh: "概念体素插画：公共访问通道连接分期建设的算力机房",
    imageAltEn: "Conceptual voxel illustration of partially assembled public compute hall with a divided foundation",
    articleSectionZh: "欧洲主权算力与公共基础设施",
    articleSectionEn: "European sovereign compute and public infrastructure",
    topics: ["European Union", "EuroHPC", "AI Gigafactories", "sovereign compute", "public access"],
    sources: [
      {
        url: "https://commission.europa.eu/topics/competitiveness/competitiveness-coordination-tool-projects/ai-gigafactories_en",
        zh: "欧盟委员会 AI Gigafactories 项目页",
        en: "European Commission AI Gigafactories page",
        level: "primary",
      },
      {
        url: "https://www.eurohpc-ju.europa.eu/ai-gigafactories_en",
        zh: "EuroHPC AI Gigafactories 说明",
        en: "EuroHPC AI Gigafactories overview",
        level: "primary",
      },
      {
        url: "https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32026R0150",
        zh: "欧盟 2026/150 号条例",
        en: "Council Regulation (EU) 2026/150",
        level: "primary",
      },
      {
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=COM%3A2025%3A165%3AFIN",
        zh: "AI Continent Action Plan",
        en: "AI Continent Action Plan",
        level: "primary",
      },
    ],
    zh: {
      hero: "欧洲正在动员 200 亿欧元建设 AI Gigafactories。公共资金能够降低首期资本压力，却不会自动带来高利用率。制度设计落在访问权、客户队列、芯片依赖、能源成本和长期 OPEX。",
      thesis: "欧洲选择了“私人主导、公共参与”的算力基础设施。欧盟资金最多覆盖整体计算基础设施 CAPEX 的 17%，也可以用等值的算力访问时间预购替代；成员国至少匹配欧盟投入，剩余 CAPEX 与全部 OPEX 由项目联盟承担。公共部门买到的是治理和访问权，运营风险仍留在项目。",
      opening: [
        "欧盟委员会的现行项目页写明，InvestAI Facility 计划动员 200 亿欧元，支持若干 AI Gigafactories。此前非正式意向征集收到 77 份提案，覆盖 16 个成员国、60 个地点。正式招标计划在 2026 年夏季发布，首批项目预计 2027 年开工。",
        "这一数字需要与早期媒体口径区分。官方页面的当前表述是“动员 200 亿欧元”，没有把所有成员国、EIB 或未来私人资本的潜在额度简单相加。本文采用可回溯的官方口径。",
        "2026/150 号条例给出了更重要的机制。欧盟出资最多覆盖整体计算基础设施 CAPEX 的 17%，或预购等值访问时间；一个或多个成员国至少匹配这部分资金。剩余投资和 OPEX 由 AI Gigafactory Consortium 承担。",
      ],
      sections: [
        {
          label: "01 · PUBLIC MONEY, PRIVATE OPERATIONS",
          heading: "公共资金购买控制权与访问权",
          paragraphs: [
            "AI Gigafactory 由在欧盟设立的联盟运营，联盟可包含技术基础设施供应商。项目需要托管协议、公共治理机构和年度审计。公共治理机构对可能影响欧盟战略资产、安全或自主性的第三国访问协议拥有事前批准权。",
            "这套安排降低了完全由政府采购和运营超算的效率风险。私人联盟保留运营自主，但公共资金对应明确访问时间、治理席位和审计要求。算力由谁使用、使用多久、在什么安全边界内使用，成为核心资产。",
          ],
          metrics: [
            {
              label: "计划动员资金",
              value: "200 亿欧元",
              note: "欧盟委员会当前项目口径，面向若干 AI Gigafactories。",
            },
            {
              label: "意向提案",
              value: "77 份 / 60 个地点",
              note: "覆盖 16 个成员国；属于非正式意向，不是最终中标项目。",
            },
            {
              label: "欧盟出资上限",
              value: "CAPEX 的 17%",
              note: "可改为预购等值访问时间；成员国至少匹配，联盟承担其余 CAPEX 与 OPEX。",
            },
          ],
        },
        {
          label: "02 · UTILIZATION MECHANICS",
          heading: "利用率不能靠建设目标解决",
          paragraphs: [
            "一座大型计算设施可以在技术上满载，在经济上仍然低效。公共研究任务、初创公司、工业客户和模型实验室对时长、数据安全、软件栈和服务等级的要求不同。队列安排会决定高价值任务能否持续进入机器。",
            "预购访问时间把一部分需求提前锁定，也可能形成未用配额。项目需要允许公共任务在不降低安全性的前提下转移时段，并让私人客户补充空闲容量。否则公共资金只是把利用率风险从建设期推到运营期。",
            "电力是另一条限制。欧洲项目需要同时满足能源、水与可持续基础设施要求。高电价、并网等待和跨境数据限制都会缩小可用地点，多个站点则需要极高带宽网络才能作为一体化设施运行。",
          ],
          steps: [
            {
              title: "公共访问形成基础负荷",
              body: "欧盟和成员国通过资金换取访问时间，但需建立可转让、可审计的任务队列。",
            },
            {
              title: "私人客户提高边际利用率",
              body: "工业、模型和云客户提供高频工作负载，价格和服务等级决定空闲容量能否变现。",
            },
            {
              title: "能源与网络限制物理布局",
              body: "多站点方案需要高带宽互联；电力、水和许可决定每个地点的可交付规模。",
            },
            {
              title: "升级周期决定长期成本",
              body: "芯片更新快于机房，项目需要把既有电力、冷却与网络持续用于下一代计算。",
            },
          ],
        },
        {
          label: "03 · SOVEREIGNTY TEST",
          heading: "主权目标仍受芯片与软件供应约束",
          paragraphs: [
            "欧盟希望 AI Gigafactories 反向刺激本土 AI 芯片设计与未来制造。建设初期仍可能依赖非欧盟高端加速器、HBM、网络与软件。采购规则可以要求透明与安全，却不能立即补齐产品性能和供应规模。",
            "因此需要区分三层主权：设施由欧盟实体控制，访问协议受公共治理；数据与工作负载在欧洲安全边界运行；关键计算部件逐步提高欧洲设计或制造比例。前两层可以通过合同较快实现，第三层需要更长产业周期。",
          ],
          cards: [
            {
              label: "ACCESS",
              title: "谁获得多少算力时间",
              body: "年度审计应披露公共访问的分配、使用和未用配额。",
            },
            {
              label: "CUSTOMERS",
              title: "工作负载是否持续",
              body: "关注工业客户、模型实验室与公共研究的复购和长期任务。",
            },
            {
              label: "SILICON",
              title: "供应依赖是否下降",
              body: "区分欧洲控制的设施与欧洲制造的计算部件，避免把两者合并。",
            },
            {
              label: "ENERGY",
              title: "OPEX 是否可承受",
              body: "电力价格、PUE、用水与并网进度决定公共资金退出后的运营能力。",
            },
          ],
        },
        {
          label: "04 · THE FIRST PROCUREMENT",
          heading: "正式招标文件会给出可投资的信号",
          paragraphs: [
            "正式招标需要明确联盟构成、地点、电力、计算性能、公共访问、第三国控制和升级机制。项目宣布之前，这些要素仍是政策框架，不能当作设备订单或数据中心开工。",
            "后续跟踪应落到每个联盟的客户结构和利用率设计。若公共访问、私人负载与设备升级形成闭环，欧洲会获得一套可持续的公共算力。若只完成一次性采购，OPEX 与迭代成本将很快回到财政预算。",
          ],
        },
      ],
      conclusion: "欧洲的 200 亿欧元计划购买的是基础设施控制、公共访问与战略选择空间。项目能否成立，要看私人联盟能否长期承担剩余资本与 OPEX，并把公共配额和商业负载填进同一套机器。",
      disclosure: "资料截止：2026 年 8 月 5 日 17:40（北京时间）。资金、提案与时间表采用欧盟委员会现行项目页；17% CAPEX、成员国匹配、访问时间和联盟责任来自 2026/150 号条例。意向提案未被视为中标或开工项目。",
    },
    en: {
      hero: "Europe is mobilizing €20 billion for AI Gigafactories. Public capital can reduce the initial burden; it cannot manufacture utilization. Access rights, customer queues, chip dependency, energy cost and long-run opex determine whether the facilities work.",
      thesis: "Europe has chosen private-led infrastructure with public participation. EU support can cover up to 17% of total computing-infrastructure capex or pre-purchase equivalent access time; member states must at least match that contribution, while the consortium funds the remaining capex and opex. Public money buys governance and access. Operating risk remains with the project.",
      opening: [
        "The Commission's current project page says the InvestAI Facility aims to mobilize €20 billion for several AI Gigafactories. An informal expression-of-interest process produced 77 proposals across 16 member states and 60 sites. A formal call is expected in summer 2026, with first construction targeted for 2027.",
        "Broader early estimates use different scopes. The current official formulation is €20 billion mobilized and does not aggregate every potential member-state, EIB and future private commitment. This column uses the traceable Commission figure.",
        "Regulation 2026/150 provides the more important mechanism. The EU can cover up to 17% of total compute-infrastructure capex or pre-purchase equivalent access time. One or more member states must at least match it. The consortium carries the rest of capex and all opex.",
      ],
      sections: [
        {
          label: "01 · PUBLIC MONEY, PRIVATE OPERATIONS",
          heading: "Public capital buys control and access",
          paragraphs: [
            "An EU-incorporated consortium operates each AI Gigafactory and may include technology-infrastructure suppliers. The project requires a hosting agreement, a public governance body and annual audits. That governance body must pre-approve third-country access arrangements that may affect EU strategic assets, autonomy or security.",
            "The structure avoids some problems of a wholly government-procured supercomputer. The private consortium retains operational autonomy, while public capital receives defined access time, governance and audit rights. Who uses compute, for how long and inside which security boundary becomes a core asset.",
          ],
          metrics: [
            {
              label: "Capital to mobilize",
              value: "€20B",
              note: "The Commission's current program figure for several AI Gigafactories.",
            },
            {
              label: "Expressions of interest",
              value: "77 / 60 sites",
              note: "Across 16 member states; proposals are not selected projects.",
            },
            {
              label: "EU support ceiling",
              value: "17% of capex",
              note: "Or equivalent access-time purchase; states match and the consortium carries the balance plus opex.",
            },
          ],
        },
        {
          label: "02 · UTILIZATION MECHANICS",
          heading: "A construction target cannot solve utilization",
          paragraphs: [
            "A facility can be technically full and economically inefficient. Public research, startups, industrial customers and model labs require different duration, security, software and service levels. Queue design determines whether high-value workloads keep entering the machines.",
            "Pre-purchased access secures baseline demand and can also create unused allocation. Projects need a mechanism to move public time without weakening security and let private customers fill open capacity. Otherwise public money shifts utilization risk from construction into operations.",
            "Power adds another constraint. The regulation requires energy, water and sustainable supporting infrastructure. High power prices, interconnection waits and cross-border data rules narrow the site list; multi-site facilities require very high-bandwidth networks to operate as one technical entity.",
          ],
          steps: [
            {
              title: "Public access forms baseload",
              body: "EU and member-state capital buys access time, which needs transferable, auditable scheduling.",
            },
            {
              title: "Private customers raise marginal utilization",
              body: "Industrial, model and cloud workloads monetize open capacity through price and service levels.",
            },
            {
              title: "Energy and networks shape geography",
              body: "Multi-site designs need high-bandwidth links; power, water and permits determine deliverable scale.",
            },
            {
              title: "Upgrade cycles set long-run cost",
              body: "Silicon turns faster than data halls, so existing power, cooling and networks must accept new compute.",
            },
          ],
        },
        {
          label: "03 · SOVEREIGNTY TEST",
          heading: "Sovereign control still depends on imported silicon and software",
          paragraphs: [
            "The EU expects predictable demand from Gigafactories to stimulate domestic AI-chip design and, over time, manufacturing. Initial facilities may still rely on non-EU accelerators, HBM, networking and software. Procurement rules can improve transparency and security; they cannot instantly close product and supply gaps.",
            "Three sovereignty layers should be tracked separately: EU entities control the facility and access rules; data and workloads run inside a European security boundary; and a rising share of critical compute is designed or made in Europe. Contracts can establish the first two faster than the industrial cycle can deliver the third.",
          ],
          cards: [
            {
              label: "ACCESS",
              title: "Who gets compute time?",
              body: "Annual audits should expose allocation, actual use and unused public access.",
            },
            {
              label: "CUSTOMERS",
              title: "Are workloads persistent?",
              body: "Watch repeat demand from industry, model labs and public research.",
            },
            {
              label: "SILICON",
              title: "Is supply dependence falling?",
              body: "Keep EU-controlled facilities separate from EU-made compute components.",
            },
            {
              label: "ENERGY",
              title: "Can opex remain affordable?",
              body: "Power price, PUE, water and interconnection govern operations after construction support.",
            },
          ],
        },
        {
          label: "04 · THE FIRST PROCUREMENT",
          heading: "The formal call will contain the investable signal",
          paragraphs: [
            "The procurement must specify consortium, site, power, compute performance, public access, third-country control and upgrade mechanisms. Until those elements are awarded, the initiative is a policy framework rather than an equipment order or construction start.",
            "The useful comparison will be customer design and utilization, not the number of winning countries. A closed loop between public access, private workloads and upgrades can create durable shared compute. A one-time purchase would return opex and refresh cost to public budgets quickly.",
          ],
        },
      ],
      conclusion: "Europe's €20 billion plan buys infrastructure control, public access and strategic option value. Success depends on private consortia carrying the remaining capital and opex while filling the same machines with public allocations and commercial workloads.",
      disclosure: "Information cut-off: August 5, 2026, 5:40 PM Beijing time. Capital, proposal count and schedule use the current Commission page. The 17% capex ceiling, matching contribution, access-time option and consortium responsibilities come from Regulation 2026/150. Expressions of interest are not treated as awards or construction starts.",
    },
  },
{
    slug: "caterpillar-ai-power",
    imageAltZh: "概念体素插画：往复式发电机剖面、储能与配电设备",
    imageAltEn: "Conceptual voxel illustration of monumental block-built reciprocating generator cutaway",
    articleSectionZh: "数据中心电力设备与资本开支",
    articleSectionEn: "Data-center power equipment and capital spending",
    topics: ["Caterpillar", "data-center power", "natural gas generation", "BESS", "AI capex"],
    sources: [
      {
        url: "https://www.sec.gov/Archives/edgar/data/18230/000001823026000040/ex991toformcat2q2026earnin.htm",
        zh: "Caterpillar Q2 2026 SEC 8-K 业绩附件",
        en: "Caterpillar Q2 2026 SEC earnings exhibit",
        level: "primary",
      },
      {
        url: "https://www.sec.gov/Archives/edgar/data/18230/000001823026000040/cat-20260804.htm",
        zh: "Caterpillar 2026 年 8 月 4 日 Form 8-K",
        en: "Caterpillar August 4, 2026 Form 8-K",
        level: "primary",
      },
      {
        url: "https://investors.caterpillar.com/news/news-details/2026/American-Intelligence--Power-Forms-Strategic-Alliance-with-Caterpillar-and-Boyd-CAT-to-Deploy-2-Gigawatts-of-Dedicated-Power-for-Hyperscale-AI-Infrastructure/default.aspx",
        zh: "Caterpillar 与 AIP 2GW 电力项目公告",
        en: "Caterpillar-AIP 2GW power project announcement",
        level: "primary",
      },
      {
        url: "https://www.epa.gov/stationary-sources-air-pollution/clean-air-act-resources-data-centers",
        zh: "EPA 数据中心空气许可资源",
        en: "EPA air-permitting resources for data centers",
        level: "primary",
      },
    ],
    zh: {
      hero: "Caterpillar Q2 的正式数字是 29%，并非二手信息流中的 72%。发电业务销售增至 30.98 亿美元，增长主要来自数据中心用大型往复式发动机、燃机与相关服务。这是 GPU 资本开支向持续电源外溢的清晰证据。",
      thesis: "数据中心电力瓶颈正在把 AI CAPEX 从加速器扩展到发电机组、燃气接入、储能、排放控制、配电和长期服务。设备收入先确认，园区算力收入后兑现。Caterpillar 的增长证明订单已经进入工业设备层；项目风险仍集中在许可、燃料与按时投运，电话会口径与报表口径的差异则提醒读者先统一数字再下结论。",
      opening: [
        "先厘清两个口径。Caterpillar 8 月 4 日提交的 Q2 8-K 附件显示，Power Generation 销售为 30.98 亿美元，去年同期为 24.07 亿美元，同比增长 29%。公司明确表示，增长来自大型往复式发动机、燃机与燃机服务，主要应用于数据中心。",
        "Power & Energy 分部总销售为 82.38 亿美元，同比增长 17%；分部利润为 20.27 亿美元，增长 30%。公司整体销售和收入达到 205.43 亿美元，增长 24%。电话会上管理层另给出“销售到用户”口径的 Power Generation 增长 72%，反映终端需求与经销商渠道节奏。29% 是 8-K 报表口径，按交付确认收入；72% 是管理层对同一业务终端销售的口径。两个数字测量渠道的不同层次，可以同时成立，不能混用。",
        "29% 仍然具有结构性意义。它来自可交付的发动机、燃机和服务，不是尚未投运的园区容量。设备商在数据中心开始收费前便获得订单，因此能更早观察 AI 基建支出向电力层传导。",
        "这一读数与同期其他信号互相印证：Caterpillar-AIP 的 2GW 发电机组采购、Partners Group 对电源运营平台 AVK 的收购、云厂商为园区配建天然气电厂，都在把“电力”从成本项变成资本项。",
      ],
      sections: [
        {
          label: "01 · THE OFFICIAL PRINT",
          heading: "电力设备已经成为增长主轴",
          paragraphs: [
            "Power Generation 是 Power & Energy 分部增长最快的主要应用。Oil and Gas 与 Industrial 均增长 9%，对比显示数据中心相关发电需求明显更强。分部利润增速高于销售，也说明销量和定价暂时覆盖了制造成本上升。",
            "该口径覆盖大型往复式发动机、燃机与相关服务，不能全部归入 AI 数据中心。公司只说明增长“主要”来自数据中心应用，没有披露数据中心收入占比、客户数量或各类设备的拆分。",
            "电话会与 8-K 的差异由此解释：报表按发货确认收入，因此反映当期交付与经销商进货；管理层口中的销售到用户则提前捕捉终端需求，包括经销商库存的消耗与补货。两者指向同一需求，但时点和数值不同。对读者，两个数字都保留，用途不同：29% 用于与历史财报比较，72% 用于感受终端需求强度。",
            "Power & Energy 分部内部，发电设备只是其中一块，还包括油气与工业应用。把 29% 放回分部背景看：它不是行业整体增速，而是数据中心应用相对其他应用的超额增长。",
          ],
          metrics: [
            {
              label: "Power Generation",
              value: "30.98 亿美元 / +29%",
              note: "增长主要来自数据中心用大型往复式发动机、燃机与服务。",
            },
            {
              label: "Power & Energy",
              value: "82.38 亿美元 / +17%",
              note: "分部利润 20.27 亿美元，同比增长 30%。",
            },
            {
              label: "公司整体",
              value: "205.43 亿美元 / +24%",
              note: "Q2 销售与收入；调整后每股收益为 8.17 美元。",
            },
            {
              label: "销售到用户（电话会）",
              value: "Power Generation +72%",
              note: "管理层口径，反映终端需求与渠道节奏。",
            },
          ],
        },
        {
          label: "02 · FROM GPU TO FIRM POWER",
          heading: "下一美元 AI CAPEX 正沿着电力路径拆分",
          paragraphs: [
            "一座高密度 AI 园区需要的不只是发电机。持续电源方案通常包括天然气供应、发动机或燃机、储能、开关设备、变压器、控制系统、排放治理、备件和长期运维。每个环节都有独立的交付与收入节奏。",
            "Caterpillar 与 American Intelligence & Power 的 Monarch 项目展示了这条路径。AIP 已订购 2GW 快速响应天然气发电机组，计划从 2026 年 9 月至 2027 年 8 月交付，并配套电池储能处理 AI 负荷波动。项目方称初期 2GW 在 2027 年上线，远期目标为 8GW。",
            "2GW 是采购与项目计划，远期 8GW 更是前瞻目标。只有设备交付、空气许可、燃气、调试和机房负载完成，才能视为可用电源。设备订单解决“有没有机器”，项目执行解决“机器是否在转”。",
            "云厂商为这类园区配建天然气电厂的逻辑相同：并网排队、电网容量和持续可用性决定算力上线时间，发电资产成为园区融资与交付计划的一部分。",
          ],
          steps: [
            {
              title: "设备订单先确认",
              body: "发动机、燃机和储能可以在园区投运前形成设备收入与积压订单。",
            },
            {
              title: "燃料与许可决定交付",
              body: "天然气容量、排放建模、控制设备和地方审批决定机组能否持续运行。",
            },
            {
              title: "储能处理负荷变化",
              body: "AI 机架的快速功率波动要求发电机组、BESS 与配电控制协同。",
            },
            {
              title: "长期服务延长现金流",
              body: "连续运行需要备件、维护与现场支持，设备安装后继续产生服务需求。",
            },
          ],
        },
        {
          label: "03 · WHY RECIPROCATING ENGINES",
          heading: "速度和模块化解释了往复式机组的机会",
          paragraphs: [
            "大型燃机适合高效率规模化供电，往复式发动机则可以分模块交付、快速启动，并随园区阶段扩展。Monarch 公告称 G3516 机组约七秒从零升至满负荷，用于应对 AI 负载快速变化。该性能来自项目与厂商公告，实际系统表现取决于整套配置。",
            "技术选型不是单一最优解：燃机在效率与规模上占优，往复式发动机在速度与模块化上占优，电池储能负责毫秒级响应，燃气轮机与电网则承担基础负荷。园区通常按“发电机 + 储能 + 电网/燃气”组合设计，而不是押注单一技术。",
            "模块化缩短建设路径，也会提高设备数量、维护与燃料管理复杂度。园区若长期孤网运行，需要 N+1 冗余、黑启动、备件和排放控制；若与电网并行，还会增加保护与调度要求。",
            "资本流向因此分成两层。第一层是快速交付的发电与储能，解决“何时有电”；第二层是电网、燃料和长期服务，解决“能否持续低成本运行”。前者带来订单，后者决定项目回报。",
          ],
          cards: [
            {
              label: "ORDER",
              title: "采购不等于投运",
              body: "记录设备订单、交付、调试和商业运行四个不同日期。",
            },
            {
              label: "FUEL",
              title: "天然气容量是否落实",
              body: "发电机数量再多，也需要长期燃料合同和管线能力。",
            },
            {
              label: "PERMIT",
              title: "空气许可是否完成",
              body: "EPA 澄清没有取消州级许可、排放控制和监测责任。",
            },
            {
              label: "SERVICE",
              title: "运维收入是否跟上",
              body: "现场服务、备件与可用率将决定一次性设备销售之后的现金流。",
            },
          ],
        },
        {
          label: "04 · THE ORDER-TO-OPERATION GAP",
          heading: "从订单到投运的四道门",
          paragraphs: [
            "发电设备收入确认在交付时，园区算力收入确认在投运后。两者之间的差距就是项目执行：设备到货只是第一道门，空气许可、燃气接入、调试和机房负载决定机组何时真正持续运行。",
            "EPA 已澄清数据中心空气许可的适用边界：联邦层面没有取消州级许可、排放控制和监测责任。对项目方，这意味着发电机组数量再多，排放建模、控制设备与地方审批仍决定交付时间。",
            "AIP 的交付窗口从 2026 年 9 月到 2027 年 8 月，跨越三个季度。对设备商，这是收入确认节奏；对园区，这是容量爬坡曲线；对云厂商，这是可用算力的到达时间。同一个时间表，三个不同的观察者读出三个含义。",
            "四道门各自可验证：设备订单与交付看公告与 8-K，空气许可看 EPA 与州记录，燃气接入看管线协议，调试与投运看项目方公告。任一扇门未过，园区就停留在“已订购”状态。",
          ],
          steps: [
            {
              title: "设备交付",
              body: "发动机、燃机与储能按合同到货，形成设备收入。",
            },
            {
              title: "空气许可",
              body: "排放建模、控制设备与州级审批完成。",
            },
            {
              title: "燃气接入",
              body: "管线容量与长期燃料合同落实。",
            },
            {
              title: "调试与投运",
              body: "机组并网、负荷测试与客户负载完成后开始计费。",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "这组数字如何映射到数据中心产业链",
          paragraphs: [
            "对园区开发商，持续电源可以缩短并网等待，却提高前期资本、燃料和许可风险。对设备商，订单能在机房收入前确认，但制造扩产与现场服务必须跟上。对云厂商，电力方案会进入每一单位可用算力的全生命周期成本。",
            "对竞争格局，Caterpillar 的增长说明大型往复式发动机在数据中心场景已经形成规模需求，这会吸引更多设备商进入并网外电源市场；设备产能、燃气供应与安装队伍将成为新的瓶颈。",
            "反向证据同样需要记录：Power Generation 口径包含非数据中心应用，公司未披露占比；若后续季度油气与工业应用增速追上数据中心，或 2GW 项目交付延迟，当前“AI 电力外溢”的强度判断需要下修。",
            "下一季应跟踪 Power Generation 的增速、分部积压订单、产能扩张、项目交付和服务收入。若设备销售继续快于油气与工业应用，同时更多项目完成许可和投运，AI CAPEX 向电力设备外溢的判断会得到加强。",
          ],
        },
      ],
      conclusion: "Caterpillar 的 29% 说明 AI 基建已经进入重型工业设备。下一美元支出会流向能把 GPU 持续点亮的发电、储能、配电与服务；订单增长能否变成园区运行，还要过燃料、许可和调试三道门。72% 与 29% 分别是电话会与报表口径，都保留、都标注、不混用，才能让这组数字承担它应有的判断重量。",
      disclosure: "资料截止：2026 年 8 月 5 日 17:40（北京时间）。财务数字来自 Caterpillar 2026 Q2 SEC 8-K 附件；72% 为电话会管理层“销售到用户”口径，29% 为 8-K 报表口径。2GW 项目、交付时间和设备性能来自 Caterpillar 与 AIP 的官方公告；EPA 边界来自其官方页面。项目远期规模与投运时间属于前瞻计划。",
    },
    en: {
      hero: "Caterpillar's official Q2 figure is 29%, not the 72% circulating in secondary feeds. Power-generation sales reached $3.098 billion, led by large reciprocating engines, turbines and services for data-center applications. It is clear evidence that GPU capex is spilling into firm power.",
      thesis: "Power constraints are extending AI capex into generation, gas delivery, storage, emissions controls, distribution and service. Equipment revenue can arrive before campus compute revenue. Caterpillar confirms that orders have entered the industrial-equipment layer; permitting, fuel and commissioning still hold project risk, and the gap between the call's 72% and the filing's 29% is a reminder to fix the measurement before drawing conclusions.",
      opening: [
        "Start with the two figures. Caterpillar's August 4 SEC earnings exhibit reports Power Generation sales of $3.098 billion, up 29% from $2.407 billion. The company says the increase came from large reciprocating engines, turbines and turbine services, primarily in data-center applications.",
        "Total Power & Energy sales were $8.238 billion, up 17%, while segment profit reached $2.027 billion, up 30%. Company sales and revenues were $20.543 billion, up 24%. On the call, management separately cited Power Generation sales to users up 72%, capturing end demand and dealer-channel pacing. The 29% is the exhibit's recognized-revenue view; the 72% is management's measure of the same business at the user layer. Both can be true and should not be merged.",
        "The 29% still carries structural weight. It represents deliverable engines, turbines and service rather than announced campus capacity. Equipment suppliers receive orders before data centers begin billing, making them an earlier read on AI spending moving into power.",
        "The reading is consistent with parallel signals: the Caterpillar-AIP 2GW generator purchase, Partners Group's acquisition of power operator AVK, and hyperscalers adding on-site gas plants all turn power from a cost line into a capital line.",
      ],
      sections: [
        {
          label: "01 · THE OFFICIAL PRINT",
          heading: "Power equipment has become a growth axis",
          paragraphs: [
            "Power Generation was the fastest-growing major application inside Power & Energy. Oil and Gas and Industrial each rose 9%, showing a much stronger data-center-related power trend. Segment profit grew faster than sales as volume and price more than offset higher manufacturing costs.",
            "The category includes large reciprocating engines, turbines and related services and cannot be assigned entirely to AI data centers. Caterpillar says data-center applications were the primary driver without disclosing customer count, revenue share or equipment mix.",
            "The gap between the call and the 8-K is explained by channel position: the exhibit recognizes revenue on shipments to dealers, while sales to users capture end demand, including inventory drawdowns and restocking. They describe the same trend at different points in the channel, with different timing and magnitude. Keep both figures and label their uses: 29% for comparison with prior filings, 72% for the feel of end demand.",
            "Inside Power & Energy, generation is one application among several, including oil and gas and industrial. Set against that background, 29% is not an industry growth rate; it is data-center applications' excess growth over other end markets.",
          ],
          metrics: [
            {
              label: "Power Generation",
              value: "$3.098B / +29%",
              note: "Led by large reciprocating engines, turbines and services, primarily for data centers.",
            },
            {
              label: "Power & Energy",
              value: "$8.238B / +17%",
              note: "Segment profit was $2.027B, up 30%.",
            },
            {
              label: "Company total",
              value: "$20.543B / +24%",
              note: "Q2 sales and revenues; adjusted EPS was $8.17.",
            },
            {
              label: "Sales to users (call)",
              value: "Power Generation +72%",
              note: "Management figure; captures end demand and channel pacing.",
            },
          ],
        },
        {
          label: "02 · FROM GPU TO FIRM POWER",
          heading: "The next AI dollar splits along the power path",
          paragraphs: [
            "A high-density AI campus needs more than generators. Firm-power systems typically include gas supply, engines or turbines, batteries, switchgear, transformers, controls, emissions treatment, spares and long-term service. Each layer has its own delivery and revenue schedule.",
            "Caterpillar's Monarch project with American Intelligence & Power illustrates the chain. AIP ordered 2GW of fast-response natural-gas generator sets for delivery from September 2026 through August 2027, paired with battery storage for AI load swings. The project targets the first 2GW online in 2027 and 8GW over time.",
            "The 2GW is a purchase and project plan; 8GW is a longer-term objective. Equipment delivery, air permits, gas, commissioning and data-hall load must close before either becomes usable power. An equipment order answers whether the machines exist; project execution answers whether they run.",
            "Hyperscalers add on-site gas plants for the same reason: interconnection queues, grid capacity and continuous availability set when compute comes online, so generation assets become part of campus financing and delivery plans.",
          ],
          steps: [
            {
              title: "Equipment orders arrive first",
              body: "Engines, turbines and storage can create revenue and backlog before campus operations.",
            },
            {
              title: "Fuel and permits control delivery",
              body: "Gas capacity, emissions modeling, controls and local approvals determine continuous operation.",
            },
            {
              title: "Storage handles load variation",
              body: "Fast AI-rack power swings require coordination across generators, BESS and distribution controls.",
            },
            {
              title: "Service extends cash flow",
              body: "Continuous-duty operations create spares, maintenance and field-support demand after installation.",
            },
          ],
        },
        {
          label: "03 · WHY RECIPROCATING ENGINES",
          heading: "Speed and modularity explain the opportunity",
          paragraphs: [
            "Large turbines offer efficient scale, while reciprocating engines can arrive in modules, start quickly and expand with campus phases. The Monarch announcement says G3516 units can move from zero to full load in about seven seconds. That is a project and vendor specification; real system behavior depends on configuration.",
            "Technology selection is not a single best answer: turbines win on efficiency and scale, reciprocating engines on speed and modularity, batteries on millisecond response, while grid and gas cover base load. Campuses typically combine generators, storage and grid or gas rather than betting on one technology.",
            "Modularity shortens the construction path and increases unit count, maintenance and fuel-management complexity. Long-term islanded operations need redundancy, black start, spares and emissions controls; grid-parallel systems add protection and dispatch.",
            "The capital path has two layers. Rapid generation and storage answer when power arrives. Grid, fuel and service answer whether it runs reliably at sustainable cost. The first creates orders; the second determines project returns.",
          ],
          cards: [
            {
              label: "ORDER",
              title: "Purchase is not operation",
              body: "Track separate dates for order, delivery, commissioning and commercial operation.",
            },
            {
              label: "FUEL",
              title: "Is gas capacity secured?",
              body: "Generator count still depends on long-term contracts and pipeline capacity.",
            },
            {
              label: "PERMIT",
              title: "Is the air permit final?",
              body: "EPA clarification does not remove state permitting, controls or monitoring.",
            },
            {
              label: "SERVICE",
              title: "Does recurring service follow?",
              body: "Field support, spares and availability determine cash after equipment sales.",
            },
          ],
        },
        {
          label: "04 · THE ORDER-TO-OPERATION GAP",
          heading: "Four gates between order and operation",
          paragraphs: [
            "Generation revenue recognizes at delivery; campus compute revenue recognizes after energization. The gap between them is project execution: equipment arrival is the first gate, while air permits, gas connection, commissioning and customer load decide when the machines run continuously.",
            "The EPA has clarified the permitting boundary for data centers: federal clarification does not remove state-level permitting, emissions controls or monitoring obligations. For project teams, generator count does not matter until emissions modeling, control equipment and local approvals close.",
            "AIP's delivery window runs from September 2026 to August 2027, spanning three quarters. For the equipment maker it is a revenue recognition schedule; for the campus it is a capacity ramp; for the cloud tenant it is the arrival time of usable compute. The same calendar reads differently to each observer.",
            "Each gate is verifiable: orders and delivery appear in announcements and 8-K filings, air permits in EPA and state records, gas connection in pipeline agreements, commissioning and energization in project announcements. Until all four close, a campus sits in purchased-but-not-operating status.",
          ],
          steps: [
            {
              title: "Equipment delivery",
              body: "Engines, turbines and storage arrive per contract, creating equipment revenue.",
            },
            {
              title: "Air permitting",
              body: "Emissions modeling, controls and state approvals close.",
            },
            {
              title: "Gas connection",
              body: "Pipeline capacity and long-term fuel contracts are secured.",
            },
            {
              title: "Commissioning and energization",
              body: "Grid sync, load testing and customer load precede billing.",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "How the print maps into the data-center chain",
          paragraphs: [
            "For campus developers, firm power can shorten grid waits and raise upfront capital, fuel and permitting exposure. For equipment suppliers, orders arrive ahead of data-hall revenue and require manufacturing plus field service to keep pace. For cloud companies, power enters the lifetime cost of usable compute.",
            "For competition, Caterpillar's growth shows that large reciprocating engines now have scalable data-center demand, which will draw more suppliers into the off-grid power market; equipment capacity, gas supply and installation labor become the next bottlenecks.",
            "Counter-evidence matters: the Power Generation category includes non-data-center applications, and the mix is undisclosed. If oil-and-gas and industrial growth catch up, or the 2GW project slips, the AI-power-spillover call should be revised down.",
            "Next quarter, watch Power Generation growth, segment backlog, capacity expansion, project deliveries and service revenue. Continued outgrowth versus oil-and-gas and industrial applications, paired with permitted and commissioned projects, would strengthen the AI-power-spillover thesis.",
          ],
        },
      ],
      conclusion: "Caterpillar's 29% shows that AI infrastructure has entered heavy industrial equipment. The next dollar goes to generation, storage, distribution and service that keep GPUs on. Fuel, permits and commissioning still separate orders from operating campuses. Keep 72% and 29% as the call and filing measures, label both, and never merge them, so the numbers can carry the analytical weight they deserve.",
      disclosure: "Information cut-off: August 5, 2026, 5:40 PM Beijing time. Financial figures come from Caterpillar's Q2 2026 SEC earnings exhibit; 72% is the call's sales-to-users figure and 29% is the exhibit's recognized-revenue figure. The 2GW project, delivery schedule and equipment performance come from the Caterpillar-AIP announcement; the EPA boundary comes from its official page. Long-term capacity and in-service dates are forward-looking.",
    },
  },
  {
    slug: "partners-group-avk-power",
    imageAltZh: "概念体素插画：集成发电、储能与配电的电力服务装置",
    imageAltEn: "Conceptual voxel illustration of integrated power-as-service machinery skid",
    articleSectionZh: "数据中心电力与投资结构",
    articleSectionEn: "Data-center power and capital structure",
    topics: ["Partners Group", "AVK", "BTM power", "data-center power", "EaaS", "microgrids", "interconnection"],
    sources: [
      {
        url: "https://www.partnersgroup.com/news-and-views/press-releases/investment-news/detail?news_id=80e9420b-67c0-43f1-b298-e0dfa2aba73e",
        zh: "Partners Group 收购 AVK 多数股权官方公告",
        en: "Partners Group-AVK majority stake press release",
        level: "primary",
      },
    ],
    zh: {
      hero: "Partners Group 将以超 10 亿美元初始股权投资加举债，取得英国电源厂商 AVK Power Solutions 多数股权。AVK 已交付超 2 万个项目、累计装机约 3.5GW，并把数据中心自备电源与微电网作为转型方向。交易尚未完成，金额与交割条款以最终协议为准。",
      thesis: "自备电源正在从备用变成主用：当并网排队成为瓶颈，园区开发商愿意为发电、储能、配电和运营服务支付长期资本。Partners Group 买到的是一个入口：把分散的 BTM 电源打包成可扩展 EaaS 平台。关键检验有三道：交易能否交割、2GW 后期管线能否跨过许可、燃料与客户合同变成运营容量，以及 EaaS 转型能否把一次性设备销售变成可复制的月度收入。",
      opening: [
        "Partners Group 8 月 6 日公告，同意收购 AVK Power Solutions 的多数股权，初始股权投资超过 10 亿美元，并配以债务融资。交易预计在监管批准和交割条件满足后完成。公告中的“超 2 万个项目、约 3.5GW 装机”为历史交付口径，AVK 当前收入与装机规模未全部披露。",
        "AVK 总部位于英国，业务覆盖数据中心、电信、工业与基础设施的备用电源、持续电源和配电，运营区域包括 FLAP-D 与欧洲新兴市场。公告称其拥有超 2GW 的后期 BTM（自备）电力管线。",
        "这笔交易的结构意义大于单一金额：私人资本开始把数据中心电力当成可以规模化运营的资产类别，而不是一次性设备采购。它把发电、储能、配电与运维放进同一个资本结构，赌的是“电力即服务”能像云服务一样按月产生现金流。",
        "时间点同样值得注意。欧洲并网排队、AI 机架功率密度与云厂商对持续电源的需求同时上升，自备电源从应急选项变成资本配置选项。Partners Group 在这个时点出手，等于承认这个市场已经大到可以容纳机构级资本，而不是停留在设备采购层面。",
      ],
      sections: [
        {
          label: "01 · THE DEAL",
          heading: "一笔把电源资产变成平台的交易",
          paragraphs: [
            "Partners Group 称计划把 AVK 转型为 EaaS（能源即服务）与微电网平台，覆盖发电、储能、配电和长期运维。翻译成业务语言，就是把一次性销售发电机的生意，改造成按合同提供持续可用电力的生意：客户付的从“设备款”变成“可用性费用”，供应商的收入从离散订单变成月度经常性收入。",
            "这是对业务模式的定位，不是对既有收入的描述。公告未披露 AVK 当前 EaaS 收入占比，也未说明转型的资本投入计划。EaaS 需要自有资产、运维网络和长期客户合同三重支撑，转型速度与资金消耗都还是未知数。",
            "交易结构本身留了空间：多数股权加“超 10 亿美元初始股权 + 举债”，说明买方既要控制权也要杠杆。公告没有给出交割时间表、最终股权比例和债务规模，实际资本投入以交割时披露为准。",
            "FLAP-D 覆盖法国、伦敦、阿姆斯特丹、法兰克福与都柏林五个欧洲主要数据中心市场，欧洲新兴市场则提供更高的增长与更高的执行风险。两者共享同一套技术平台，但许可、燃料和客户结构各不相同，跨市场运营能力本身就是进入门槛。",
          ],
          metrics: [
            {
              label: "初始股权",
              value: "超 10 亿美元 + 举债",
              note: "取得多数股权，交割条款以最终协议为准。",
            },
            {
              label: "历史交付",
              value: "超 2 万个项目",
              note: "覆盖数据中心、电信、工业与基础设施。",
            },
            {
              label: "累计装机",
              value: "约 3.5GW",
              note: "公告口径，非当前收入或盈利指标。",
            },
            {
              label: "BTM 管线",
              value: "超 2GW 后期项目",
              note: "容量意向，需客户合同、许可与投运验证。",
            },
          ],
        },
        {
          label: "02 · THE MARKET",
          heading: "自备电力为何从应急变成主用",
          paragraphs: [
            "传统上发电机是停电应急设备，按“小时”运行，收入来自设备销售和零星维护。AI 机架的持续高功率密度与并网等待改变了这个定位：发电机开始按“年”运行，成为园区电力架构的常态化组成部分，并连带拉动储能、开关、控制与运维。",
            "公告将并网排队列为关键瓶颈：在欧洲，接入时间可以长达数年。自备电源的价值正在于绕开部分排队，但燃气、燃料供应、排放许可和现场运营仍构成独立约束。换句话说，BTM 电力把“电网的问题”部分转换成“燃料与许可的问题”，并没有消除风险，只是重新分配了风险。",
            "把最近三组信号放在一起看，趋势是完整的：Caterpillar 与 AIP 的 2GW 燃气发电机组采购代表设备侧，Volta 与 Bitdeer 的挪威托管租约代表容量侧，这笔交易代表运营平台侧。三者发生在同一轮资本周期里，共同指向“持续电源”成为 AI 基建的独立资产类别。",
            "对电网而言，BTM 电力减少接入需求，也减少规划中的负荷承诺；对园区开发商，自备电源缩短上线路径却抬高前期资本；对投资者，长期运维合同提供更可预测的现金流。各方动机一致，但承担的风险各不相同。",
          ],
          cards: [
            {
              label: "EQUIPMENT",
              title: "设备侧：Caterpillar-AIP 2GW",
              body: "发电机与储能订单，交付与投运分离。",
            },
            {
              label: "CAPACITY",
              title: "容量侧：Volta-Bitdeer 挪威 133MW",
              body: "托管租约与芯片平台，客户未确认。",
            },
            {
              label: "PLATFORM",
              title: "运营侧：Partners Group-AVK",
              body: "多数股权与 EaaS 转型，跨市场组合。",
            },
          ],
        },
        {
          label: "03 · THE PIPELINE",
          heading: "2GW 后期管线怎么验证",
          paragraphs: [
            "AVK 的管线数字是容量意向，不是已签约收入。“后期（late-stage）”具体指什么阶段，公告没有定义：可能已有客户意向，也可能只有场地与初步设计。在管线与订单之间，隔着客户合同、燃料协议、许可和调试四道门。",
            "每一道门都有独立的确认标志：客户合同意味着承购方愿意付费，燃料协议意味着发电能力有持续输入，许可意味着项目可以动工，调试与投运意味着容量开始计费。四者缺一，管线就停留在意向层面。",
            "如果 EaaS 转型落地，验证标准会进一步收紧：不只是项目投运，还要看投运后按合同产生的月度收入、可用率条款和续约率。届时“电力即服务”才从叙事变成可审计的现金流。",
          ],
          steps: [
            {
              title: "并网排队成为瓶颈",
              body: "接入时间可能长达数年，园区开始寻找自备方案。",
            },
            {
              title: "自备电源进入项目资本",
              body: "发电、储能与配电进入 CAPEX 与融资结构。",
            },
            {
              title: "客户合同锁定承购",
              body: "开发商与运营商签订长期可用性协议。",
            },
            {
              title: "许可与燃料决定上线",
              body: "排放、燃气、调试和客户负载共同决定实际投运。",
            },
            {
              title: "运营成为月度收入",
              body: "EaaS 合同把一次性设备销售转成可复制的服务现金流。",
            },
          ],
        },
        {
          label: "04 · RISKS",
          heading: "哪些因素会让交易偏离预期",
          paragraphs: [
            "第一层是交易风险。公告未给出交割时间表，监管审查、反垄断与交割条件都可能改变最终结构。以“超 10 亿美元初始股权”为界，实际资本投入以交割时披露为准，在此之前都不应计入 AVK 的资本实力。",
            "第二层是转化风险。2GW 管线若无法取得客户合同、燃料协议或许可，就只是容量意向；客户集中度、燃料价格波动和排放监管收紧都会压缩 EaaS 的单位经济性。",
            "第三层是经营风险。EaaS 是运营生意，毛利率取决于资产可用率、服务网络密度和响应成本，而不是设备售价。跨 FLAP-D 与新兴市场的扩张同时放大了机会与执行难度，整合与管理层更替也可能改变战略节奏。",
          ],
          cards: [
            {
              label: "DEAL",
              title: "尚未完成",
              body: "监管批准与交割条件满足前不视为落地。",
            },
            {
              label: "MIX",
              title: "收入结构未披露",
              body: "备用、持续、EaaS 各占多少未知。",
            },
            {
              label: "PIPELINE",
              title: "2GW 是意向",
              body: "客户合同、燃料、许可与投运四道门未验证。",
            },
            {
              label: "MARGIN",
              title: "EaaS 靠可用率赚钱",
              body: "燃料波动、监管与响应成本决定单位经济性。",
            },
            {
              label: "QUEUE",
              title: "并网瓶颈是双刃剑",
              body: "自备电源绕开排队，燃气与排放仍是约束。",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "对数据中心电力链的映射",
          paragraphs: [
            "这笔交易与 Caterpillar 的发电设备增长同向：资本正在把电力从成本项变成资产项。区别在于设备商确认订单收入，而基金买入的是运营平台和长期合同。设备订单代表当下需求，EaaS 平台赌的是未来十年的运营现金流，两者的验证周期完全不同。",
            "对开发商，这笔交易意味着自备电力的融资渠道变宽，但项目资本与燃料义务也同步上升。对设备商，机构资本进入运营层会拉动发电机、储能和配电设备的长期需求，同时提高对服务网络的要求。对云厂商，电力供应商从设备商扩展为运营商，采购逻辑从“买设备”转向“买可用性”。",
            "后续跟踪清单：交易交割与最终结构、AVK 的订单与运维合同披露、BTM 管线项目的许可与投运、EaaS 收入口径与可用率条款。若管线项目陆续签约并上线，电力即服务会从叙事变成可审计的现金流；若交割延后或管线转化停滞，则应下调对 BTM 资产类别化进程的预期。",
          ],
        },
      ],
      conclusion: "Partners Group 把 AVK 当成一个可扩展的电力平台来买：发电、储能、配电和运维打包成 EaaS。交易未完成、收入结构未披露、管线规模也不等于订单；它能成立的前提是欧洲并网瓶颈持续存在，且 AVK 能把自备电力跨过许可、燃料和客户合同变成运营中的园区，再把运营收入变成可复制的月度现金流。三道门，缺一不可。",
      disclosure: "资料截止：2026 年 8 月 6 日（北京时间）。交易条款、历史交付规模、装机与 BTM 管线均来自 Partners Group 官方公告；“并网排队多年”为公告表述；Caterpillar-AIP 与 Volta-Bitdeer 的对照数据来自 IDC Atlas 同期专栏所引公开来源。交易尚待监管批准与交割条件满足，最终金额与股权比例以交割披露为准。",
    },
    en: {
      hero: "Partners Group has agreed to acquire a majority stake in UK power provider AVK Power Solutions with an initial equity investment above $1 billion plus debt. AVK has delivered more than 20,000 projects and roughly 3.5GW of installed power, and is repositioning around behind-the-meter power and microgrids. The transaction is not complete; final terms depend on closing.",
      thesis: "Behind-the-meter power is moving from backup to primary: when interconnection queues become the bottleneck, campus developers will pay long-term capital for generation, storage, distribution and operation. Partners Group is buying an entry point to package fragmented BTM power into a scalable energy-as-a-service platform. The thesis faces three tests: whether the deal closes, whether a 2GW late-stage pipeline crosses contracts, fuel and permits into operating capacity, and whether EaaS converts one-time equipment sales into repeatable monthly revenue.",
      opening: [
        "Partners Group announced on August 6 that it agreed to acquire a majority stake in AVK Power Solutions, with an initial equity investment above $1 billion alongside debt financing. Closing is subject to regulatory approval and conditions. The release cites more than 20,000 delivered projects and roughly 3.5GW of installed power as historical delivery figures; AVK's current revenue and capacity are not fully disclosed.",
        "AVK is headquartered in the UK and serves backup, continuous and distribution power for data centers, telecom, industrial and infrastructure customers across FLAP-D and European emerging markets. The release says AVK holds a late-stage pipeline of more than 2GW of BTM power.",
        "The structural signal is larger than the headline amount: private capital is treating data-center power as an asset class to operate at scale rather than as one-time equipment procurement. Generation, storage, distribution and operations enter one capital structure, betting that power-as-a-service can produce cash flow monthly, the way cloud services do.",
        "The timing matters as much as the money. European interconnection queues, AI rack density and hyperscaler demand for firm power are rising together, turning behind-the-meter power from an emergency option into a capital-allocation choice. Partners Group's entry is an admission that the market is large enough for institutional capital, not just equipment purchasing.",
      ],
      sections: [
        {
          label: "01 · THE DEAL",
          heading: "Turning power assets into a platform",
          paragraphs: [
            "Partners Group says it plans to transform AVK into an energy-as-a-service and microgrid platform covering generation, storage, distribution and long-term operations. In business terms, that means converting a one-time generator-selling model into contracted continuous power: customers pay for availability rather than hardware, and revenue shifts from discrete orders to monthly recurring income.",
            "That is a positioning statement, not a description of existing revenue. The release does not disclose AVK's current EaaS revenue share or the capital required for the transition. EaaS needs owned assets, an operations network and long-term customer contracts at the same time; the pace and cost of transformation are unknown.",
            "The structure leaves room by design: a majority stake financed by over $1 billion of initial equity plus debt signals control appetite and leverage. The release gives no closing date, final ownership percentage or debt size; actual capital committed is whatever closing discloses.",
            "FLAP-D spans the five main European data-center markets, while European emerging markets offer higher growth and higher execution risk. They share a technology platform but differ in permitting, fuel and customer structure, making cross-market operations a barrier to entry in itself.",
          ],
          metrics: [
            {
              label: "Initial equity",
              value: "$1B+ plus debt",
              note: "Majority stake; final terms depend on closing.",
            },
            {
              label: "Delivered projects",
              value: "20,000+",
              note: "Across data centers, telecom, industrial and infrastructure.",
            },
            {
              label: "Installed power",
              value: "~3.5GW",
              note: "Announced historical figure, not current revenue or profitability.",
            },
            {
              label: "BTM pipeline",
              value: "2GW+ late stage",
              note: "Capacity intention requiring contracts, permits and commissioning.",
            },
          ],
        },
        {
          label: "02 · THE MARKET",
          heading: "Why behind-the-meter power moves from backup to primary",
          paragraphs: [
            "Generators were traditionally emergency assets, run by the hour and paid for by equipment sales plus occasional maintenance. Sustained high power density and long interconnection waits change that: generators now run by the year as a standing part of campus power architecture, pulling in storage, switchgear, controls and operations.",
            "The announcement identifies interconnection queues as a critical bottleneck, with grid access in Europe taking years. Behind-the-meter power can bypass part of that queue, but gas supply, emissions permitting and site operations remain separate constraints. BTM does not eliminate risk; it converts grid risk into fuel-and-permitting risk and redistributes it across the project.",
            "Three recent signals complete the picture: Caterpillar's 2GW order with AIP represents the equipment layer, Volta's Norwegian hosting lease with Bitdeer represents the capacity layer, and this deal represents the operations layer. They sit in the same capital cycle and together mark firm power as a distinct asset class in AI infrastructure.",
            "For grids, BTM reduces interconnection demand and committed loads in planning. For developers, it shortens the energization path and raises upfront capital. For investors, long-term operations contracts offer more predictable cash flow. All parties have aligned incentives but bear different risks.",
          ],
          cards: [
            {
              label: "EQUIPMENT",
              title: "Equipment: Caterpillar-AIP 2GW",
              body: "Generator and storage orders; delivery and energization remain separate.",
            },
            {
              label: "CAPACITY",
              title: "Capacity: Volta-Bitdeer 133MW Norway",
              body: "Hosting lease and chip platform; customer unconfirmed.",
            },
            {
              label: "PLATFORM",
              title: "Operations: Partners Group-AVK",
              body: "Majority stake and EaaS transition across multiple markets.",
            },
          ],
        },
        {
          label: "03 · THE PIPELINE",
          heading: "How to verify the 2GW pipeline",
          paragraphs: [
            "The pipeline figure is capacity intention, not signed revenue. The release does not define late-stage: it could mean customer interest or just sites with preliminary design. Between pipeline and orders sit four gates: customer contracts, fuel agreements, permits and commissioning.",
            "Each gate has an observable signal. A customer contract means a buyer is willing to pay; a fuel agreement means generation has a continuous input; a permit means construction can start; commissioning and energization mean capacity begins billing. Missing any one leaves the pipeline at intention level.",
            "If the EaaS transition lands, the bar tightens further: beyond energization, watch contracted monthly revenue, availability clauses and renewals. Only then does power-as-a-service become auditable cash flow rather than narrative.",
          ],
          steps: [
            {
              title: "Interconnection becomes the bottleneck",
              body: "Grid access can take years, pushing campuses toward self-supply.",
            },
            {
              title: "BTM power enters project capital",
              body: "Generation, storage and distribution move into CAPEX and financing.",
            },
            {
              title: "Customer contracts lock offtake",
              body: "Developers and operators sign long-term availability agreements.",
            },
            {
              title: "Permits and fuel decide energization",
              body: "Emissions, gas, commissioning and customer load set the go-live date.",
            },
            {
              title: "Operations become monthly revenue",
              body: "EaaS contracts convert one-time equipment sales into repeatable service cash flow.",
            },
          ],
        },
        {
          label: "04 · RISKS",
          heading: "What could push the deal off course",
          paragraphs: [
            "The first layer is deal risk. The release gives no closing schedule; regulatory review, antitrust and conditions can change the final structure. Until closing discloses the actual amount, the over-$1-billion initial equity is a stated boundary, not AVK's capital strength.",
            "The second layer is conversion risk. A 2GW pipeline without customer contracts, fuel agreements or permits is capacity intention; tenant concentration, fuel-price volatility and tighter emissions regulation all compress EaaS unit economics.",
            "The third layer is operating risk. EaaS is an operations business: margin depends on asset availability, service-network density and response cost, not equipment price. Expansion across FLAP-D and emerging markets scales both opportunity and execution difficulty, and integration or management change can reset strategic pace.",
          ],
          cards: [
            {
              label: "DEAL",
              title: "Not closed",
              body: "Regulatory approval and conditions come first.",
            },
            {
              label: "MIX",
              title: "Revenue mix undisclosed",
              body: "Share of backup, continuous and EaaS revenue is unknown.",
            },
            {
              label: "PIPELINE",
              title: "2GW is an intention",
              body: "Contracts, fuel, permits and commissioning are unverified.",
            },
            {
              label: "MARGIN",
              title: "EaaS earns on availability",
              body: "Fuel swings, regulation and response cost drive unit economics.",
            },
            {
              label: "QUEUE",
              title: "Interconnection cuts both ways",
              body: "BTM bypasses queues but gas and emissions remain constraints.",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "Mapping into the data-center power chain",
          paragraphs: [
            "The deal moves in the same direction as Caterpillar's power-equipment growth: capital is turning power from a cost line into an asset line. Equipment makers recognize order revenue while the fund buys an operating platform and long-term contracts. Orders measure current demand; an EaaS platform bets on a decade of operating cash flow, so verification cycles differ completely.",
            "For developers, funding channels for BTM power widen, but project capital and fuel obligations rise with them. For equipment makers, institutional capital in the operations layer drives long-term demand for generators, storage and switchgear while raising requirements for service networks. For cloud buyers, power suppliers expand from equipment vendors to operators, shifting procurement logic from buying hardware to buying availability.",
            "The watch list: deal closing and final structure, disclosure of AVK orders and operations contracts, permitting and energization of BTM pipeline projects, and the EaaS revenue definition and availability terms. If pipeline projects sign and energize, power-as-a-service becomes auditable cash flow; if closing slips or conversion stalls, expectations for BTM as an asset class should be revised down.",
          ],
        },
      ],
      conclusion: "Partners Group is buying AVK as a scalable power platform: generation, storage, distribution and operations packaged as EaaS. The deal is open, the revenue mix is undisclosed, and a pipeline is not an order book. The thesis works only if European interconnection bottlenecks persist, AVK moves behind-the-meter power through permits, fuel and customer contracts into operating campuses, and operations convert into repeatable monthly cash flow. Three gates, none optional.",
      disclosure: "Information cut-off: August 6, 2026, Beijing time. Deal terms, delivered-project count, installed power and the BTM pipeline come from the Partners Group announcement; the multi-year interconnection timeline is the announcement's wording. Caterpillar-AIP and Volta-Bitdeer comparisons cite the public sources used in IDC Atlas's parallel columns. Closing remains subject to regulatory approval and conditions; final amounts and ownership depend on closing disclosures.",
    },
  },
  {
    slug: "anthropic-volta-compute",
    imageAltZh: "概念体素插画：三层融资底座上的算力机房与独立客户端",
    imageAltEn: "Conceptual voxel illustration of compute hall resting on three stacked funding layers",
    articleSectionZh: "算力采购与 AI 基础设施",
    articleSectionEn: "Compute procurement and AI infrastructure",
    topics: ["Anthropic", "Volta", "Bitdeer", "NVIDIA", "Vera Rubin", "compute procurement", "AI data centers"],
    sources: [
      {
        url: "https://ir.bitdeer.com/news-releases/news-release-details/bitdeer-announces-47-billion-16-year-aihpc-data-center-lease",
        zh: "Bitdeer 与 Volta 47 亿美元 16 年托管租约官方公告",
        en: "Bitdeer-Volta $4.7B 16-year hosting lease announcement",
        level: "primary",
      },
      {
        url: "https://secure.businesswire.com/news/home/20260804493428/en/Volta-Emerges-From-Stealth-With-%2410-Billion-AI-Lab-Partnership-and-%245-Billion-AI-Infrastructure-Program",
        zh: "Volta 官方新闻稿：100 亿美元 AI 实验室合作与 50 亿美元基础设施计划",
        en: "Volta press release: $10B AI lab partnership and $5B infrastructure program",
        level: "primary",
      },
      {
        url: "https://qz.com/anthropic-volta-infra-computing-deal-10-billion-080426",
        zh: "Quartz 报道：Anthropic 与 Volta 的 100 亿美元算力交易",
        en: "Quartz report on the Anthropic-Volta $10B computing deal",
        level: "reported",
      },
      {
        url: "https://au.finance.yahoo.com/news/ai-cloud-startup-volta-valued-143851167.html",
        zh: "Yahoo Finance 报道：Volta 估值与融资",
        en: "Yahoo Finance report on Volta valuation and funding",
        level: "reported",
      },
    ],
    zh: {
      hero: "Anthropic 被报道与成立仅 7 个月的初创公司 Volta Infra Holdings 签订 100 亿美元、为期 6 年的算力采购协议。Volta 官方公告只称客户为未具名 AI 实验室，Anthropic 尚未确认。这一边界意味着：协议存在、客户身份未证实、交付远未开始。",
      thesis: "Volta 用三层资本进入算力市场：约 3 亿美元股权融资（Nvidia、Michael Dell 等参与，估值 24 亿美元）、Azora 的 50 亿美元基础设施资金、与 Bitdeer 的约 47 亿美元 16 年托管租约。风险集中在 133MW 机架能否按时带电、Vera Rubin 交付与客户验证，以及 6 年 100 亿美元承诺如何变成实际收入。在客户确认与首批交付前，这是前瞻承诺而非已投运基础设施。",
      opening: [
        "Volta 8 月宣布与一家未具名 AI 实验室签订 100 亿美元、6 年协议，为其建设并运营挪威的 AI 数据中心。公司自称“完全纵向整合的 AI 基础设施平台”与 NVIDIA 云合作伙伴，使命是构建“算力公用事业”。媒体随后报道该客户是 Anthropic；Anthropic 官方没有确认，因此本文把“Anthropic 采购”作为媒体报道处理。",
        "Volta 于 2026 年 1 月成立，获得 Nvidia、Michael Dell 等支持的约 3 亿美元融资，估值 24 亿美元；Azora 承诺提供 50 亿美元基础设施资金。与 Bitdeer 的托管租约价值约 47 亿美元、期限 16 年，对应 121 IT MW，Dell 为技术提供方。",
        "把这些数字放在一起，可以看到新进入者如何提前资本化一座算力园区：股权融资建立信用、基础设施资金承担长期资产、托管租约锁定场地、芯片厂商背书降低客户疑虑。但其中任何一项都不等于已上线容量。真正的问题是谁承担建设风险，以及机器何时开始计费。",
        "协议的口径同样关键：6 年 100 亿美元对应每年约 16.7 亿美元，按 133MW 折算约为每兆瓦每年 1,250 万美元。公告未披露按容量、按可用算力还是按固定付款计费，付款结构与违约条款决定它是采购意向还是可确认订单。",
      ],
      sections: [
        {
          label: "01 · THE REPORTED DEAL",
          heading: "100 亿美元协议的确认边界",
          paragraphs: [
            "已确认部分：Volta 官方公告中的 100 亿美元、6 年期协议与未具名客户；Bitdeer 官方 16 年约 47 亿美元托管租约；Volta 的 3 亿美元融资与 24 亿美元估值。已确认的是公告本身，不是协议已开始执行。",
            "未确认部分：客户身份。Bloomberg、Reuters、Quartz 与中文科技媒体均报道客户为 Anthropic，但 Anthropic 未发布确认。在官方确认前，“Anthropic 承诺 100 亿美元”应视为报道，不应作为已签署合同写入基础设施统计。",
            "每年 16.7 亿美元与每兆瓦 1,250 万美元是 Atlas 按披露数字做的折算，前提假设是六年内满额支付、容量全数上线。实际计费基础、可用率条款和提前终止权都会改变这两个数字，因此它们只用于量级判断，不用于估值。",
          ],
          metrics: [
            {
              label: "协议规模",
              value: "100 亿美元 / 6 年",
              note: "Volta 官方公告，客户未具名。",
            },
            {
              label: "园区容量",
              value: "133MW（约 121 IT MW）",
              note: "挪威站点规划容量，非已投运容量。",
            },
            {
              label: "托管租约",
              value: "约 47 亿美元 / 16 年",
              note: "Bitdeer 官方公告，Dell 为技术提供方。",
            },
            {
              label: "融资与估值",
              value: "约 3 亿美元融资 / 估值 24 亿美元",
              note: "Nvidia、Michael Dell 等参与，媒体报道口径。",
            },
            {
              label: "折算量级",
              value: "约 1.67 亿美元/年；约 1,250 万美元/MW/年",
              note: "Atlas 按披露数字折算，计费基础未披露。",
            },
          ],
        },
        {
          label: "02 · THE CAPITAL STACK",
          heading: "24 亿美元估值如何支撑 100 亿美元承诺",
          paragraphs: [
            "Volta 的资本结构分为三层：股权融资建立信用与所有权，基础设施资金承担长期资产，托管租约把场地成本变成固定费用。Nvidia 与 Dell 的参与提供芯片和服务器生态背书，Bitdeer 提供挪威园区、电力和运营。",
            "估值 24 亿美元对应 3 亿美元融资后的隐含规模，主要反映早期资本对算力合同的定价，不是对已建成资产的估值。没有已运营容量时，估值锚定的是合同、团队与生态关系。",
            "把收入与成本放在一起看：100 亿美元协议年均 16.7 亿美元，Bitdeer 租约年均约 2.9 亿美元，是收入侧的六分之一左右。其余成本包括芯片采购、电力、冷却、运维与融资费用，均未披露；这意味着租约成本可以核对，但单位毛利无法从公开信息验证。",
          ],
          steps: [
            {
              title: "融资建立信用",
              body: "芯片厂商与个人投资者背书降低客户疑虑。",
            },
            {
              title: "租约锁定场地",
              body: "Bitdeer 提供挪威园区、电力和长期托管。",
            },
            {
              title: "合同承诺收入",
              body: "100 亿美元协议带来收入可见度。",
            },
            {
              title: "建设期资本到位",
              body: "Azora 的基础设施资金与项目融资覆盖建设支出。",
            },
            {
              title: "交付与验证兑现",
              body: "机架带电、Vera Rubin 交付、客户验收后才产生真实收入。",
            },
          ],
        },
        {
          label: "03 · THE NORWAY SITE",
          heading: "133MW 与 Vera Rubin：交付是最大变量",
          paragraphs: [
            "Volta 采用 NVIDIA Vera Rubin 平台，Bitdeer 的公告显示 Dell 为技术提供方。从芯片出货、机架组装、液冷部署到电力接入，每一环的排期都会把交付窗口向后推。Vera Rubin 的量产与 HBM 供应节奏因此直接决定 133MW 何时可交付。",
            "挪威的优势是水电、低温与长期电力合同，这些条件降低电力和冷却成本，却不缩短建设周期：并网规模、施工许可与设备交付仍然决定项目节奏。133MW 是园区规划容量，与投运容量、可计费容量是三个不同的数。",
            "对客户的吸引力也来自速度与独家性：新平台宣称比传统云厂商更快交付专属算力。速度承诺一旦兑现会改变采购格局，一旦延误则正好反向印证新进入者的执行风险。",
          ],
          cards: [
            {
              label: "CONTRACT",
              title: "客户未确认",
              body: "报道为 Anthropic，官方未证实。",
            },
            {
              label: "CAPACITY",
              title: "133MW 是规划",
              body: "与投运容量、可计费容量不同。",
            },
            {
              label: "CHIPS",
              title: "Vera Rubin 未交付",
              body: "依赖 NVIDIA 量产与 HBM 供应。",
            },
            {
              label: "POWER",
              title: "挪威电力是优势",
              body: "水电与低温降成本，并网与施工仍是约束。",
            },
            {
              label: "SPEED",
              title: "速度是卖点也是风险",
              body: "交付延误会把差异化承诺变成反向证据。",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "哪些因素会让这单偏离预期",
          paragraphs: [
            "第一层是合同风险。客户身份未确认，付款结构未披露，100 亿美元是公告中的承诺而非已确认订单。若客户最终不确认，或协议被重定价、分期执行，收入可见度会大幅缩水。",
            "第二层是执行风险。133MW 的带电时间依赖 Vera Rubin 交付、挪威并网与液冷部署，任一环节延误都会推迟计费。公告没有给出首批机架带电的时间表，这是最重要的缺口。",
            "第三层是需求分散。即使客户确认为 Anthropic，其算力采购也是多供应商策略的一部分：同一时期 Anthropic 还与另一平台有 2GW 级合作。100 亿美元在总盘子里占比有限，单点延误不会改变其整体供给计划，反而会降低 Volta 的议价地位。",
            "反向证据同样值得记录：若媒体集中报道后公司迟迟不确认，或 Bitdeer 财报中租约收入确认与公告不一致，说明协议执行慢于宣传节奏。",
          ],
          cards: [
            {
              label: "CONTRACT",
              title: "客户身份是媒体口径",
              body: "官方确认前不写入合同统计。",
            },
            {
              label: "EXECUTION",
              title: "没有带电时间表",
              body: "首批机架何时计费是最大缺口。",
            },
            {
              label: "DIVERSIFY",
              title: "采购方在分散订单",
              body: "单点延误不会改变其整体供给计划。",
            },
            {
              label: "MARGIN",
              title: "毛利无法验证",
              body: "租约成本可核对，芯片与运维成本未披露。",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "新算力玩家对产业链的映射",
          paragraphs: [
            "对云厂商，这类协议增加供给多样性和更快的专属交付选项，但验证周期长，协议与容量之间隔着施工和验收。对芯片与设备商，早期融资和订单加速生态扩张，Vera Rubin 与 Dell 的平台角色被进一步确认。",
            "对 Bitdeer，这笔租约是转型样本：把矿场与电力资产改造成 AI/HPC 托管，用长期租约换取稳定收入。租约在公告中是约 47 亿美元 16 年，实际收入确认要看 Bitdeer 后续财报。",
            "后续跟踪：Anthropic 是否官方确认、Volta 首批机架带电时间、Bitdeer 项目的建设进度与财报确认口径、Vera Rubin 实际交付，以及 100 亿美元协议在公开文件中的披露形态。",
          ],
        },
      ],
      conclusion: "Volta 案例显示新算力供给可以快速完成“融资—租约—合同”的组合，但距离运营还有芯片、电力和验证三关。100 亿美元协议是真实公告，“Anthropic”是媒体报道，133MW 是规划容量，每年 16.7 亿美元与每兆瓦 1,250 万美元只是量级折算。在客户确认与首批交付前，它属于前瞻承诺而非已投运基础设施。",
      disclosure: "资料截止：2026 年 8 月 6 日（北京时间）。Volta 公告的 100 亿美元协议与挪威 133MW、Bitdeer 的 47 亿美元 16 年租约分别来自 Volta 官方新闻稿（BusinessWire 页面访问受限，经标题与媒体转述核验）与 Bitdeer IR。客户身份（Anthropic）仅由媒体确认，Anthropic 官方未确认。每年 16.7 亿美元与每兆瓦 1,250 万美元为 Atlas 基于披露数字的折算，计费基础未披露。融资、估值与芯片配置来自媒体报道与公告，交付时间以实际执行为准。",
    },
    en: {
      hero: "Anthropic is reported to have signed a $10 billion, six-year compute agreement with Volta Infra Holdings, a startup founded only seven months ago. Volta's own announcement names an undisclosed AI lab as the customer, and Anthropic has not confirmed. That boundary means: the agreement exists, the customer is unconfirmed, and delivery has not begun.",
      thesis: "Volta is entering the compute market with three capital layers: roughly $300 million of equity at a $2.4 billion valuation from investors including NVIDIA and Michael Dell, $5 billion of infrastructure funding from Azora, and a roughly $4.7 billion 16-year hosting lease with Bitdeer. Risk sits in whether 133MW energizes on time, Vera Rubin delivers, customers validate, and a six-year $10 billion commitment becomes actual revenue. Until confirmation and first delivery, this is forward commitment rather than operating infrastructure.",
      opening: [
        "Volta announced in August a $10 billion, six-year agreement to build and operate an AI data center in Norway for an unnamed AI lab, describing itself as a fully vertically integrated AI infrastructure platform, an NVIDIA Cloud Partner, and on a mission to build the utility of compute. Media subsequently reported the customer to be Anthropic; Anthropic has not confirmed, so this article treats the Anthropic procurement as a report.",
        "Volta was founded in January 2026, raised roughly $300 million from investors including NVIDIA and Michael Dell at a $2.4 billion valuation, and Azora has committed $5 billion in infrastructure funding. The Bitdeer hosting lease is worth about $4.7 billion over 16 years, covering 121 IT MW, with Dell as technology provider.",
        "Together the numbers show how a new entrant capitalizes a compute campus early: equity builds credibility, infrastructure capital carries long-term assets, the hosting lease locks the site, and chip-maker endorsement lowers customer risk perception. None of them equals live capacity. The real questions are who carries construction risk and when the machines start billing.",
        "Deal terms also matter. Six years at $10 billion imply about $1.67 billion per year, or roughly $12.5 million per MW per year across 133MW. The announcement does not disclose whether billing is per capacity, per usable compute or fixed; payment structure and default terms decide whether this is intent to purchase or a confirmable order.",
      ],
      sections: [
        {
          label: "01 · THE REPORTED DEAL",
          heading: "The confirmation boundary of the $10B agreement",
          paragraphs: [
            "Confirmed: Volta's announcement of a $10 billion, six-year agreement with an undisclosed customer; Bitdeer's official 16-year, roughly $4.7 billion hosting lease; and Volta's $300 million funding at a $2.4 billion valuation. What is confirmed is the announcement itself, not that the agreement has begun executing.",
            "Unconfirmed: the customer's identity. Bloomberg, Reuters, Quartz and Chinese tech media report the customer to be Anthropic, but Anthropic has issued no confirmation. Until it does, an Anthropic $10 billion commitment should be treated as reporting, not as a signed contract in infrastructure statistics.",
            "The $1.67 billion per year and $12.5 million per MW per year figures are Atlas conversions from disclosed numbers, assuming full payment over six years and full capacity online. Actual billing basis, availability terms and early-termination rights would change both, so they indicate magnitude rather than valuation.",
          ],
          metrics: [
            {
              label: "Deal size",
              value: "$10B / 6 years",
              note: "Volta announcement; customer unnamed.",
            },
            {
              label: "Site capacity",
              value: "133MW (~121 IT MW)",
              note: "Planned Norwegian capacity, not operating capacity.",
            },
            {
              label: "Hosting lease",
              value: "~$4.7B / 16 years",
              note: "Bitdeer official announcement; Dell is technology provider.",
            },
            {
              label: "Funding and valuation",
              value: "~$300M raised / $2.4B valuation",
              note: "Including NVIDIA and Michael Dell; media-reported.",
            },
            {
              label: "Converted scale",
              value: "~$1.67B/yr; ~$12.5M/MW/yr",
              note: "Atlas conversion; billing basis undisclosed.",
            },
          ],
        },
        {
          label: "02 · THE CAPITAL STACK",
          heading: "How a $2.4B valuation supports a $10B commitment",
          paragraphs: [
            "Volta's capital structure has three layers: equity establishes credibility and ownership, infrastructure capital carries long-term assets, and the hosting lease turns site cost into fixed expense. NVIDIA and Dell participation provides chip and server ecosystem endorsement, while Bitdeer supplies the Norwegian campus, power and operations.",
            "The $2.4 billion valuation is the implied post-funding scale and mostly prices early capital's view of the compute contract, not built assets. With no operating capacity, valuation anchors on contracts, team and ecosystem relationships.",
            "Revenue and cost together tell a partial story: the $10 billion agreement averages $1.67 billion per year, while the Bitdeer lease averages about $290 million per year, roughly one-sixth of the revenue side. The rest covers chips, power, cooling, operations and financing, none disclosed; the lease is verifiable, unit margin is not.",
          ],
          steps: [
            {
              title: "Funding builds credibility",
              body: "Chip-maker and investor endorsement lowers customer risk perception.",
            },
            {
              title: "Lease locks the site",
              body: "Bitdeer provides the Norwegian campus, power and long-term hosting.",
            },
            {
              title: "Contract commits revenue",
              body: "The $10B agreement creates revenue visibility.",
            },
            {
              title: "Construction capital closes",
              body: "Azora infrastructure funding and project finance cover build costs.",
            },
            {
              title: "Delivery and validation convert",
              body: "Racks energize, Vera Rubin arrives and customer acceptance precedes revenue.",
            },
          ],
        },
        {
          label: "03 · THE NORWAY SITE",
          heading: "133MW and Vera Rubin: delivery is the biggest variable",
          paragraphs: [
            "Volta is built on NVIDIA Vera Rubin, and Bitdeer's announcement names Dell as the technology provider. From chip shipment and rack assembly to liquid cooling and grid connection, every step in the chain pushes the delivery window. Vera Rubin's production ramp and HBM supply therefore decide when 133MW becomes deliverable.",
            "Norway offers hydropower, low temperatures and long-term power contracts, which lower power and cooling cost but do not shorten the build: interconnection scale, construction permits and equipment delivery still set the pace. 133MW is planned campus capacity; operating and billable capacity are different numbers.",
            "The pitch to customers also rests on speed and exclusivity: a new platform claiming faster delivery of dedicated compute than incumbent clouds. Meeting that promise changes procurement dynamics; missing it turns the differentiation claim into evidence of the entrant's execution risk.",
          ],
          cards: [
            {
              label: "CONTRACT",
              title: "Customer unconfirmed",
              body: "Reported as Anthropic; not confirmed officially.",
            },
            {
              label: "CAPACITY",
              title: "133MW is planned",
              body: "Distinct from operating or billable capacity.",
            },
            {
              label: "CHIPS",
              title: "Vera Rubin undelivered",
              body: "Depends on NVIDIA ramp and HBM supply.",
            },
            {
              label: "POWER",
              title: "Norway power is an advantage",
              body: "Hydropower and cold lower cost; grid and construction still bind.",
            },
            {
              label: "SPEED",
              title: "Speed is both pitch and risk",
              body: "Delivery delay turns differentiation into counter-evidence.",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "What could push the deal off course",
          paragraphs: [
            "The first layer is contract risk. The customer is unnamed, the payment structure is undisclosed, and the $10 billion is a commitment in an announcement rather than a confirmed order. If the customer never confirms, or the agreement is repriced or staged, revenue visibility shrinks sharply.",
            "The second layer is execution risk. Energization of 133MW depends on Vera Rubin delivery, Norwegian interconnection and liquid cooling; any slippage delays billing. The announcement gives no schedule for first-rack energization, the most important gap.",
            "The third layer is demand diversification. Even if the customer is confirmed as Anthropic, its procurement is multi-vendor: in the same period Anthropic has a separate 2GW-scale arrangement with another platform. The $10 billion is a limited share of the total book, so a single delay does not change its supply plan but does weaken Volta's bargaining position.",
            "Counter-evidence is worth recording: if the company stays silent after dense media coverage, or Bitdeer's financial statements recognize lease revenue inconsistently with the announcement, execution is running behind the publicity.",
          ],
          cards: [
            {
              label: "CONTRACT",
              title: "Customer is media-reported",
              body: "Do not count as a signed contract before official confirmation.",
            },
            {
              label: "EXECUTION",
              title: "No energization schedule",
              body: "When first racks bill is the biggest open gap.",
            },
            {
              label: "DIVERSIFY",
              title: "Buyer is spreading orders",
              body: "A single delay does not change its overall supply plan.",
            },
            {
              label: "MARGIN",
              title: "Unit margin unverifiable",
              body: "Lease cost checks out; chip and operations cost do not.",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "Mapping a new compute entrant into the chain",
          paragraphs: [
            "For cloud buyers, such agreements add supply diversity and a faster dedicated-delivery option, but validation cycles are long: construction and acceptance separate agreements from capacity. For chip and equipment vendors, early funding and orders accelerate the ecosystem, further confirming Vera Rubin and Dell platform roles.",
            "For Bitdeer, the lease is a transformation case: converting mining sites and power assets into AI/HPC hosting and trading them for stable long-term revenue. The lease is announced at about $4.7 billion over 16 years; actual revenue recognition depends on subsequent Bitdeer filings.",
            "Watch whether Anthropic confirms, when Volta's first racks energize, Bitdeer construction progress and financial-statement recognition, actual Vera Rubin delivery, and how the $10 billion agreement appears in public documents.",
          ],
        },
      ],
      conclusion: "Volta shows that new compute supply can quickly assemble funding, leases and contracts, but chips, power and validation still separate the deal from operations. The $10 billion agreement is a real announcement, Anthropic is a media report, 133MW is planned capacity, and $1.67 billion per year or $12.5 million per MW are magnitude conversions. Until the customer confirms and first delivery occurs, this is forward commitment rather than operating infrastructure.",
      disclosure: "Information cut-off: August 6, 2026, Beijing time. The $10 billion agreement and 133MW Norwegian site come from Volta's official release (BusinessWire page access-limited, verified by headline and media relay), and the $4.7 billion 16-year lease from Bitdeer IR. The customer identity (Anthropic) is media-confirmed only. The per-year and per-MW conversions are Atlas figures based on disclosed numbers; billing basis is undisclosed. Funding, valuation and chip configuration come from media and announcements; delivery timing depends on execution.",
    },
  },
  {
    slug: "ai-debt-refinancing",
    imageAltZh: "概念体素插画：两类融资支柱支撑尚未完成的项目桥梁",
    imageAltEn: "Conceptual voxel illustration of an unfinished bridge supported by two differently structured block piers",
    articleSectionZh: "AI 基建融资与资本结构",
    articleSectionEn: "AI infrastructure financing and capital structure",
    topics: ["Nexus", "Morgan Stanley", "debt refinancing", "Anthropic", "Google", "data-center financing", "bonds"],
    sources: [
      {
        url: "https://news.qq.com/rain/a/20260805A0BJJ600",
        zh: "FT 报道转载：摩根士丹利拟将 Nexus 150 亿美元贷款转债券再融资",
        en: "FT report (relay): Morgan Stanley plans to refinance Nexus's $15B loan into bonds",
        level: "reported",
      },
      {
        url: "https://www.reuters.com/legal/litigation/banks-talks-lend-15-billion-anthropic-data-center-backed-by-google-wsj-reports-2026-07-30/",
        zh: "Reuters 7 月 30 日报道：银行团讨论向 Anthropic 数据中心放贷 150 亿美元",
        en: "Reuters (July 30): banks discussing $15B lending for the Anthropic data center backed by Google",
        level: "reported",
      },
    ],
    zh: {
      hero: "摩根士丹利牵头的银行团正在准备把德州 Hubbard 数据中心园区约 150 亿美元的贷款，在提取后尽快拆分成债券再融资，部分可能走杠杆贷款。该园区由 Google 支持、租给 Anthropic，自带约 1.6GW 天然气电厂。风险归属的下一步是：建设期由投资者承担，Google 的担保要到建成后才生效。",
      thesis: "AI 数据中心融资正在从单一银团贷款转向“贷款—债券—杠杆贷款”的分层资本结构。150 亿美元对应约 2000 英亩园区、约 1.6GW 自备电厂与单个大客户租约，债券预计为投机级。信用变量落在建设期风险归谁、完工后担保何时生效；项目规模本身并不决定信用。",
      opening: [
        "FT 8 月 5 日报道，摩根士丹利主导的银行团准备为 Nexus Data Centers 位于德州 Hubbard 的园区提供约 150 亿美元贷款，并计划在贷款提取后尽快通过债券再融资，部分可能走杠杆贷款。该园区约 2000 英亩，由 Google 支持并租给 Anthropic。",
        "这不是第一次关于该项目的融资讨论。Reuters 与 Bloomberg 7 月 30 日已报道银行团在讨论向该项目放贷约 150 亿美元。FT 的新信息在于再融资路径：把贷款尽快转成公开债券，让银行团更快退出资产负债表。",
        "项目自带约 1.6GW 天然气电厂（Reuters 7 月 30 日口径），电力自给是融资设计的一部分，也把燃料与发电风险放进同一个资本结构。目前报道均为媒体来源，银行团与项目方未发布官方公告。",
        "把这一单与上一期 Atlas 讨论的 Broadcom-Apollo-Blackstone 平台并排看，AI 基建融资正在出现两条并行路径：私募信贷把芯片、机房与长期使用承诺装进同一结构，公开债券为单个大园区再融资。两者都说明，信用分层已经发生。",
      ],
      sections: [
        {
          label: "01 · THE REFINANCING PATH",
          heading: "150 亿美元如何从贷款变成债券",
          paragraphs: [
            "流程通常分两步：银行团先放贷用于项目建设，随后在贷款提取后尽快启动债券发行（部分可能走杠杆贷款），用公开市场资金替换银行信贷。这样银行可以把信用风险转移给债券投资者，同时保留承销与安排费。",
            "“尽快”是关键词。贷款停留在银行资产负债表的时间越短，银行的资本占用越少，也越能继续承接下一单同类融资。对债券投资者，这意味着他们买到的是一个还在建设期、距离稳定运营现金流尚远的资产。",
            "债券预计为投机级，市场按“资产未完工 + 单一客户”定价。投机级定价意味着利差补偿的是完工概率、租约履约与电力可用率，而不是成熟资产的现金流。",
          ],
          steps: [
            {
              title: "银团放贷",
              body: "摩根士丹利牵头，为项目建设提供约 150 亿美元。",
            },
            {
              title: "项目提取",
              body: "资金按建设里程碑提取，此时 Google 担保尚未生效。",
            },
            {
              title: "债券再融资",
              body: "贷款提取后尽快发债，部分可能走杠杆贷款。",
            },
            {
              title: "完工担保生效",
              body: "建成后 Google 的支持才覆盖项目。",
            },
          ],
        },
        {
          label: "02 · RISK OWNERSHIP",
          heading: "建设期风险归谁",
          paragraphs: [
            "FT 报道称 Google 的担保仅在建成后生效。建设期间的施工延误与成本超支由投资者承担，这与上一期 Atlas 讨论的“残值与利用率决定风险”一致：资本结构越早转给公开市场，信用评估越依赖完工概率与客户履约。",
            "担保的时间边界把同一笔债务切成两段：建成前，信用锚定开发商执行能力与租约承诺；建成后，Google 支持才进入信用结构。投资者买的是哪一段，决定了他们承担什么风险。",
            "150 亿美元对应约 2000 英亩园区与约 1.6GW 自备电力，规模与自给电力都高于典型园区融资。自备电厂把燃料价格、排放许可和发电可用率变成债务的信用变量：电厂不只是供电设施，也是偿债能力的组成部分。",
          ],
          cards: [
            {
              label: "TIMING",
              title: "建设期无担保",
              body: "Google 担保建成后才生效。",
            },
            {
              label: "SIZE",
              title: "150 亿美元 / 约 2000 英亩",
              body: "单一园区融资规模。",
            },
            {
              label: "POWER",
              title: "约 1.6GW 自备电厂",
              body: "燃料与发电可用率进入信用结构。",
            },
            {
              label: "TENANT",
              title: "Anthropic 租约",
              body: "客户集中度是定价因素。",
            },
          ],
        },
        {
          label: "03 · THE CREDIT MATH",
          heading: "把 150 亿美元拆到兆瓦与租约上",
          paragraphs: [
            "按 1.6GW 折算，150 亿美元约为每兆瓦 940 万美元。这个数字包含土地、厂房、自备电厂与配电，是园区级融资密度，不是单台服务器的资本成本；它只能用于量级比较，不能直接与单机柜成本对照。",
            "真正决定偿债能力的不是每兆瓦成本，而是租约收入与债务的匹配：Anthropic 租约的期限、付款结构和可用率条款未披露，因此无法计算利息覆盖倍数。公开债券定价时，租约披露程度会直接决定信用利差。",
            "与典型企业债不同，这单债券的现金流入依赖单一租户的项目投运，属于“项目融资型”信用：估值看完工时间表、租约现金流与自备电厂的可靠性，而不是发行人资产负债表。",
          ],
          metrics: [
            {
              label: "融资规模",
              value: "约 150 亿美元",
              note: "FT 与 Reuters 报道口径，官方未公告。",
            },
            {
              label: "园区规模",
              value: "约 2000 英亩",
              note: "德州 Hubbard，Google 支持并租给 Anthropic。",
            },
            {
              label: "自备电力",
              value: "约 1.6GW 天然气",
              note: "Reuters 7 月 30 日口径。",
            },
            {
              label: "折算密度",
              value: "约 940 万美元/MW",
              note: "Atlas 折算，含园区整体，非单机柜成本。",
            },
            {
              label: "担保时点",
              value: "建成后生效",
              note: "建设期风险由投资者承担。",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "哪些因素会让再融资偏离预期",
          paragraphs: [
            "第一层是市场风险。投机级债券需要足够的需求，建设期资产在利率与信用利差波动时发行窗口更窄。若发行推迟或缩量，银行团将被迫在资产负债表上多持有贷款，再融资路径失去意义。",
            "第二层是完工风险。约 1.6GW 自备电厂与 2000 英亩园区同步建设，施工延误与成本超支会直接侵蚀债券价值；担保只在建成后生效，等于把最大的时间风险留给债券投资者。",
            "第三层是租约与运营风险。Anthropic 是唯一大客户，其需求变化、可用率争议或提前终止都会冲击单一来源现金流；燃气价格与排放监管则决定自备电厂的实际发电成本。",
            "反向证据同样明确：若银行团最终没有公告贷款、债券发行规模小于 150 亿美元、或担保条款与报道不符，说明公开市场对该结构的定价低于预期；若项目提前完工投运，则证明建设风险低于市场担忧。",
          ],
          cards: [
            {
              label: "MARKET",
              title: "发行窗口",
              body: "投机级债券需求不足会推迟或缩量。",
            },
            {
              label: "BUILD",
              title: "完工风险",
              body: "建设延误与超支直接侵蚀债券价值。",
            },
            {
              label: "TENANT",
              title: "单一租户",
              body: "需求变化与可用率争议冲击现金流。",
            },
            {
              label: "FUEL",
              title: "燃气与排放",
              body: "决定自备电厂的实际发电成本。",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "下集：350 亿美元构成 1GW 之后",
          paragraphs: [
            "上一期 Atlas 讨论了 Broadcom-Apollo-Blackstone 把芯片、机房与长期使用承诺装进同一结构。Nexus 案例展示另一条路径：用公开债券为单个大园区再融资，把风险转给资本市场。两者共同说明，AI 基建的信用分层已经发生，融资渠道正在从私募信贷专属走向公开市场。",
            "对银行，贷款转债券可提前回收资本、继续承接下一单，但发行失败的风险留在表内。对债券投资者，获得建设期与爬坡期的信用利差，同时承担完工与单一租户风险。对开发商，融资渠道拓宽可能降低资本成本，但不会改变电力、芯片与客户合同的基本面。",
            "对 2027 年之后的观察者，数据中心债券供应量本身会成为变量：若这一模式复制到更多园区，公开市场将直接参与 AI 基建的风险定价，信用事件对行业的影响半径也随之扩大。",
            "后续跟踪：银行团是否正式公告贷款、债券发行的规模与评级、Google 担保条款的披露、Anthropic 租约的期限与付款结构，以及项目完工与投运时间。",
          ],
        },
      ],
      conclusion: "150 亿美元再融资计划把 AI 数据中心的资本结构推向公开市场：银行放贷、债券接盘、Google 担保在建成后生效。建设期风险因此由投资者承担，债券按投机级定价，每兆瓦约 940 万美元只是量级折算，租约披露才是真正的定价变量。媒体来源仍需官方确认，但方向已经清楚：融资分层与完工概率正在成为 AI 基建的核心信用变量。",
      disclosure: "资料截止：2026 年 8 月 6 日（北京时间）。贷款、再融资路径、园区面积与 Google 担保条款来自 FT 报道（腾讯转载页）与 Reuters 7 月 30 日报道，均为媒体来源；银行团与项目方未发布官方公告。约 1.6GW 自备电厂规模来自 Reuters 报道；每兆瓦约 940 万美元为 Atlas 基于 150 亿美元与 1.6GW 的折算，含园区整体融资。债券评级与最终结构以发行文件为准。",
    },
    en: {
      hero: "A Morgan Stanley-led bank group is preparing to refinance roughly $15 billion of loans for Nexus Data Centers' Hubbard, Texas campus into bonds as soon as possible after drawdown, with part potentially going to leveraged loans. The site is backed by Google and leased to Anthropic, with its own roughly 1.6GW natural-gas plant. The next risk question is clear: construction-period investors carry the risk, and Google's support only starts after completion.",
      thesis: "AI data-center financing is moving from single syndicated loans to a layered structure of loans, bonds and leveraged loans. The $15 billion corresponds to a roughly 2,000-acre campus, about 1.6GW of self-supplied power and one anchor tenant; the bonds are expected to be speculative grade. Credit now turns on who carries construction risk and when the completion guarantee becomes effective; project size alone does not decide it.",
      opening: [
        "The Financial Times reported on August 5 that a Morgan Stanley-led bank group is preparing roughly $15 billion of loans for Nexus Data Centers' Hubbard, Texas campus and plans to refinance them into bonds, partly possibly via leveraged loans, shortly after drawdown. The roughly 2,000-acre site is backed by Google and leased to Anthropic.",
        "This is not the first financing report on the project. Reuters and Bloomberg reported on July 30 that banks were discussing about $15 billion in lending. The FT's new information is the refinancing path: moving the loans into public bonds so banks exit the balance sheet faster.",
        "The campus includes its own roughly 1.6GW natural-gas plant (Reuters, July 30), making power self-supply part of the financing design and putting fuel and generation risk inside the same capital structure. All reports are media sources; the banks and the project company have not issued official statements.",
        "Read alongside the previous Atlas column on the Broadcom-Apollo-Blackstone platform, AI infrastructure financing is forming two parallel paths: private credit packaging silicon, sites and long-term usage commitments into one structure, and public bonds refinancing a single large campus. Both show that credit layering has begun.",
      ],
      sections: [
        {
          label: "01 · THE REFINANCING PATH",
          heading: "How $15B moves from loans to bonds",
          paragraphs: [
            "The flow typically has two stages: banks lend first to fund construction, then the borrower issues bonds (partly possibly leveraged loans) as soon as possible after drawdown to replace bank credit with public-market funding. Banks transfer credit risk to bond investors while keeping underwriting and arrangement fees.",
            "As soon as possible is the operative phrase. The shorter the time loans sit on bank balance sheets, the less capital and regulatory room they consume, and the sooner banks can underwrite the next deal. For bond investors, it means buying an asset that is still under construction and far from steady operating cash flow.",
            "The bonds are expected to be speculative grade, priced on an uncompleted asset with a single anchor tenant. A speculative-grade price compensates completion probability, lease performance and power availability rather than mature-asset cash flow.",
          ],
          steps: [
            {
              title: "Banks lend",
              body: "Morgan Stanley leads roughly $15 billion for construction.",
            },
            {
              title: "Drawdown",
              body: "Funds draw against construction milestones; Google support is not yet in force.",
            },
            {
              title: "Bond refinancing",
              body: "Bonds issue shortly after drawdown; part may go to leveraged loans.",
            },
            {
              title: "Guarantee activates",
              body: "Google's support covers the project only after completion.",
            },
          ],
        },
        {
          label: "02 · RISK OWNERSHIP",
          heading: "Who carries construction risk",
          paragraphs: [
            "The FT reports that Google's guarantee only takes effect after completion. Construction delays and cost overruns sit with investors during construction, consistent with the previous Atlas argument that residual value and utilization decide risk: the earlier capital moves to public markets, the more credit depends on completion probability and tenant performance.",
            "The guarantee's timing splits the same debt into two phases: before completion, credit anchors on the developer's execution and lease commitments; after completion, Google support enters the credit structure. Which phase an investor buys determines what risk they carry.",
            "The $15 billion maps to a roughly 2,000-acre campus and about 1.6GW of self-supplied power, larger in scale and power self-sufficiency than typical campus financing. The on-site plant turns fuel prices, emissions permits and generation availability into credit variables: the plant is not just power infrastructure, it is part of debt-service capacity.",
          ],
          cards: [
            {
              label: "TIMING",
              title: "No guarantee during construction",
              body: "Google support starts only after completion.",
            },
            {
              label: "SIZE",
              title: "$15B / ~2,000 acres",
              body: "Single-campus financing scale.",
            },
            {
              label: "POWER",
              title: "~1.6GW on-site plant",
              body: "Fuel and generation availability enter the credit structure.",
            },
            {
              label: "TENANT",
              title: "Anthropic lease",
              body: "Tenant concentration is a pricing factor.",
            },
          ],
        },
        {
          label: "03 · THE CREDIT MATH",
          heading: "Scaling $15B down to megawatts and the lease",
          paragraphs: [
            "Against 1.6GW, $15 billion converts to roughly $9.4 million per MW. The figure includes land, buildings, the on-site plant and distribution, making it a campus-level financing density rather than a per-server capital cost; it is useful for magnitude only and should not be compared with per-cabinet costs.",
            "What actually determines debt service is the match between lease revenue and debt: the tenure, payment structure and availability terms of the Anthropic lease are undisclosed, so interest coverage cannot be calculated. Lease disclosure will directly set the credit spread when public bonds price.",
            "Unlike a typical corporate bond, cash flow here depends on a single tenant in a project that must be completed, making this project-finance-style credit: value follows the completion schedule, lease cash flow and on-site plant reliability rather than the issuer's balance sheet.",
          ],
          metrics: [
            {
              label: "Financing size",
              value: "~$15B",
              note: "FT and Reuters reporting; no official announcement.",
            },
            {
              label: "Campus size",
              value: "~2,000 acres",
              note: "Hubbard, Texas; backed by Google, leased to Anthropic.",
            },
            {
              label: "On-site power",
              value: "~1.6GW gas",
              note: "Reuters July 30 figure.",
            },
            {
              label: "Converted density",
              value: "~$9.4M/MW",
              note: "Atlas conversion; campus-wide, not per-cabinet.",
            },
            {
              label: "Guarantee timing",
              value: "Effective after completion",
              note: "Construction-period risk sits with investors.",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "What could push the refinancing off course",
          paragraphs: [
            "The first layer is market risk. Speculative-grade bonds need demand, and construction-stage assets have a narrower issuance window when rates or spreads move. If issuance is delayed or shrinks, banks hold the loans longer and the refinancing path loses its point.",
            "The second layer is completion risk. Building a roughly 1.6GW plant and a 2,000-acre campus together means delays and overruns directly erode bond value; a guarantee that only activates after completion leaves the largest timing risk with bond investors.",
            "The third layer is lease and operating risk. Anthropic is the sole anchor tenant; demand changes, availability disputes or early termination would hit single-source cash flow, while gas prices and emissions regulation set the plant's actual generation cost.",
            "Counter-evidence is equally clear: if banks never announce the loan, issuance comes in below $15 billion, or guarantee terms differ from reporting, public-market pricing is weaker than expected; early completion and energization would prove construction risk lower than feared.",
          ],
          cards: [
            {
              label: "MARKET",
              title: "Issuance window",
              body: "Weak demand for speculative bonds delays or shrinks the deal.",
            },
            {
              label: "BUILD",
              title: "Completion risk",
              body: "Delays and overruns directly erode bond value.",
            },
            {
              label: "TENANT",
              title: "Single anchor tenant",
              body: "Demand changes and availability disputes hit cash flow.",
            },
            {
              label: "FUEL",
              title: "Gas and emissions",
              body: "They set the plant's actual generation cost.",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "The follow-up to $35 billion becoming 1GW",
          paragraphs: [
            "The previous Atlas column examined Broadcom-Apollo-Blackstone packaging silicon, sites and long-term usage commitments into one structure. Nexus shows the other path: refinancing a single large campus with public bonds and transferring risk to capital markets. Together they show that credit layering in AI infrastructure has begun and funding channels are moving beyond private-credit-only.",
            "For banks, loan-to-bond conversion frees capital for the next deal, but failed issuance stays on the balance sheet. For bond investors, the construction-and-ramp spread comes with completion and single-tenant risk. For developers, broader funding may lower the cost of capital without changing power, chip or tenant fundamentals.",
            "For 2027 and beyond, data-center bond supply itself becomes a variable: if this model replicates across campuses, public markets directly participate in AI infrastructure risk pricing, and credit events carry a wider industry impact radius.",
            "Watch for official bank announcements, bond size and ratings, disclosure of Google's guarantee terms, the tenure and payment structure of the Anthropic lease, and project completion and energization dates.",
          ],
        },
      ],
      conclusion: "The $15 billion refinancing plan pushes AI data-center capital structure into public markets: banks lend, bonds take over, and Google's guarantee activates only after completion. Construction risk therefore lands on investors, bonds price at speculative grade, and the roughly $9.4 million per MW conversion is magnitude only; lease disclosure is the real pricing variable. Official confirmation is still pending, but the direction is clear: financing layering and completion probability are becoming the core credit variables of AI infrastructure.",
      disclosure: "Information cut-off: August 6, 2026, Beijing time. The loan, refinancing path, site acreage and Google guarantee terms come from FT reporting (via the Tencent relay) and Reuters on July 30; both are media sources, and no official statements have been issued by the banks or the project company. The roughly 1.6GW on-site plant figure is from Reuters; the $9.4 million per MW figure is an Atlas conversion of $15 billion across 1.6GW, campus-wide. Ratings and final structure depend on offering documents.",
    },
  },
  {
    slug: "memory-2027-allocation",
    imageAltZh: "概念体素插画：不同存储配置堆栈与受限的分配通道",
    imageAltEn: "Conceptual voxel illustration of memory allocation carousel with different-sized blank chip stacks",
    articleSectionZh: "存储供需与 HBM",
    articleSectionEn: "Memory supply, demand and HBM",
    topics: ["DRAM", "HBM", "HBM4", "TrendForce", "NVIDIA", "Rubin Ultra", "memory allocation", "2027"],
    sources: [
      {
        url: "https://www.trendforce.com.tw/presscenter/news/20260804-13165.html",
        zh: "TrendForce 8 月 4 日报告：2027 年 DRAM 供给紧张与 Rubin Ultra HBM 配置评估",
        en: "TrendForce (Aug 4): 2027 DRAM tightness and Rubin Ultra HBM configuration review",
        level: "primary",
      },
      {
        url: "https://www.trendforce.com/presscenter/news/20260730-13158.html",
        zh: "TrendForce 7 月 30 日英文报告：2026–2027 年 DRAM 供需缺口",
        en: "TrendForce (July 30, EN): 2026-2027 DRAM supply-demand balance",
        level: "primary",
      },
      {
        url: "https://m.nbd.com.cn/articles/2026-08-04/4531262.html",
        zh: "每日经济新闻：存储原厂完成 2027 全年产能分配",
        en: "National Business Daily: memory makers complete 2027 capacity allocation",
        level: "reported",
      },
    ],
    zh: {
      hero: "“2027 年存储产能全部售罄”的说法来自媒体与行业消息，原厂没有发布官方确认。TrendForce 的官方口径是：DRAM 供不应求将延续到 2027 年，2027 年 HBM 出货位元预计年增 50-60% 仍不足以满足需求，议价权偏向供应商。“售罄”与“供不应求”是两个不同强度的结论。",
      thesis: "2027 年存储分配的关键在配置决策：NVIDIA 自 2026 Q3 起并行评估 Rubin Ultra 的 HBM4e 8hi、HBM4 12hi 与 HBM4 8hi 三种配置，尚未定案；部分 CSP 考虑下调自研 ASIC 的 HBM 配置。需求强度不变，但规格切换会同时影响供给效率与单一供应商份额，也会改变“紧张”实际落到谁头上。",
      opening: [
        "每日经济新闻 8 月 4 日报道，存储三大厂 2027 年 DRAM 与 HBM 产能已全部售罄，NAND 至 8 月底前也基本订完，买家接受预付订金。该报道引用“业界消息与研究机构”，没有原厂公告，因此只能作为行业消息处理。",
        "TrendForce 8 月 4 日的官方报告给出更精确的图景：2027 年 DRAM 供不应求持续；NVIDIA 自 2026 Q3 起把 Rubin Ultra 的 HBM 配置从 HBM4e 12hi 改为并行评估三种方案，尚未定案；部分 CSP 在考虑下调自研 ASIC 的 HBM 配置。",
        "两组信息指向同一结论：2027 年供给紧张是市场共识，但“谁拿到多少、用什么规格”仍在谈判中。把行业消息当成官方确认，会高估确定性并低估配置切换风险。",
        "对 Atlas 读者，这条线值得单独追踪：HBM 是 AI 服务器最稀缺的输入之一，规格切换会改变 GPU 成本、交付节奏和存储原厂的产能分配，最终传导到云厂商的资本开支与算力价格。",
        "这类标题的生成机制也值得留意：研究机构的供需预测被压缩成“售罄”的断言，中间省略了假设与区间。还原后的正确读法是：预测紧张、分配未完成、原厂未确认。市场参与者若基于标题抢订，会进一步推长前置期、推高订金，形成自我实现的价格行为。",
      ],
      sections: [
        {
          label: "01 · THE SOLD-OUT CLAIM",
          heading: "“售罄”与“供不应求”的边界",
          paragraphs: [
            "售罄意味着合同化分配完成、新买家难以进入；供不应求只表示缺口存在，分配仍在进行。媒体稿把前者作为结论，TrendForce 只确认后者。两个词指向不同的市场状态，也对应不同的价格行为：前者接近配额制，后者仍靠价格出清。",
            "预付订金的存在说明买家为锁定产能付款，但它同样可以来自恐慌性预订或退货权。原厂没有披露 2027 年分配比例、合同锁定比例或订金条款，因此“售罄”无法被验证，只能作为行业情绪指标。",
            "判断这条消息是否坐实，需要三类官方证据：原厂对 2027 年产能分配或合同的公告、财报中预收订金与长期供货承诺的披露、以及交期显著拉长的可观察信号。三者出现之前，行业消息保持行业消息的定位。",
          ],
          metrics: [
            {
              label: "DRAM 供需",
              value: "2027 年持续供不应求",
              note: "TrendForce 官方口径。",
            },
            {
              label: "2027 HBM 出货位元",
              value: "年增 50-60%",
              note: "仍不足以满足需求。",
            },
            {
              label: "2026 供需比",
              value: "-1% 至 -2%",
              note: "TrendForce 7 月 30 日英文报告。",
            },
            {
              label: "2027 供需比",
              value: "缺口扩大",
              note: "TrendForce 官方判断。",
            },
          ],
        },
        {
          label: "02 · THE SUPPLY MATH",
          heading: "50-60% 的增长为什么还不够",
          paragraphs: [
            "2027 年 HBM 出货位元预计年增 50-60%，是相对当前基数的高增长。但 TrendForce 判断该增速仍不足以覆盖需求，缺口延续到 2027 年，供需比从 2026 年的 -1% 至 -2% 进一步扩大。",
            "扩产受制于洁净室、测试、封装与设备周期，不是简单增加投片就能解决。HBM 的测试与封装占用更多产能和时间，位元增长与实际可用容量之间存在良率损耗，这一损耗在配置切换时还会放大。",
            "位元增速与供需比放在一起看，含义是：即便原厂全力扩产，2027 年的紧张也不是均衡水平，而是持续短缺。对买方，这支持“提前锁定、接受预付”的行为；对 Atlas 而言，它解释价格与交期压力的来源，而不是为“售罄”背书。",
          ],
          cards: [
            {
              label: "BITS",
              title: "位元 +50-60%",
              body: "高增长但仍低于需求增速。",
            },
            {
              label: "YIELD",
              title: "良率损耗",
              body: "测试与封装消耗产能，配置切换放大损耗。",
            },
            {
              label: "BALANCE",
              title: "2026：-1% 至 -2%",
              body: "2027 缺口进一步扩大。",
            },
            {
              label: "PRICE",
              title: "议价权偏向供应商",
              body: "2027 年价格谈判对买方不利。",
            },
          ],
        },
        {
          label: "03 · NVIDIA'S HBM CHOICE",
          heading: "Rubin Ultra 的规格切换为何重要",
          paragraphs: [
            "TrendForce 称 NVIDIA 自 2026 Q3 起并行评估 HBM4e 8hi、HBM4 12hi 与 HBM4 8hi，替代原定的 HBM4e 12hi。评估未定案意味着采购组合可能改变，也会改变各家供应商的良率与产能分配。",
            "HBM 的堆叠高度与层数影响每片晶圆的可用容量与良率。配置切换若落地，会在 2027 年改变 HBM 的供需平衡与供应商份额，而不是只改变 NVIDIA 的带宽方案：选型直接决定谁获得最大订单、谁承担良率风险。",
            "部分 CSP 考虑下调自研 ASIC 的 HBM 配置，是同一枚硬币的反面：需求总量未必减少，但规格结构会向更易交付的方向移动。若多家 CSP 同时下调，紧张程度会从“绝对短缺”变成“结构性短缺”，对低阶配置的供给压力反而缓解。",
          ],
          cards: [
            {
              label: "ROUTE",
              title: "三种配置并行评估",
              body: "HBM4e 8hi / HBM4 12hi / HBM4 8hi。",
            },
            {
              label: "STATUS",
              title: "尚未定案",
              body: "采购组合仍是变量。",
            },
            {
              label: "ASIC",
              title: "CSP 考虑下调 HBM",
              body: "需求向易交付规格移动。",
            },
            {
              label: "SHARE",
              title: "供应商份额随选型改变",
              body: "谁拿大单、谁担良率风险都在变。",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "哪些因素会让“紧张”判断失效",
          paragraphs: [
            "第一层是需求风险。若模型效率提升、训练需求回落或 CSP 自研芯片放量，HBM 需求增速可能低于预期，2027 年缺口随之收窄。“售罄”说法越被广泛接受，越要警惕其中包含的预期泡沫。",
            "第二层是配置风险。NVIDIA 若最终定案单一配置，或 CSP 集体下调 HBM 含量，供给结构会重新匹配，部分规格从紧张转为过剩，另一部分仍然稀缺。行业级的“紧张”与单品的“过剩”可以同时存在。",
            "第三层是扩产风险的反向：若原厂扩产快于预期，2027 年供需比可能转正。观察指标包括原厂资本开支上调、设备出货加速和新增洁净室的投产时间。",
            "证伪清单同样明确：原厂官方否认售罄、2027 年合同与订金披露低于预期、HBM 交期缩短、或 TrendForce 上调供需比，都会削弱“持续紧张”的结论。",
          ],
          cards: [
            {
              label: "DEMAND",
              title: "需求回落",
              body: "模型效率与 ASIC 放量会收窄缺口。",
            },
            {
              label: "MIX",
              title: "规格过剩并存",
              body: "部分配置转松，另一部分仍稀缺。",
            },
            {
              label: "RAMP",
              title: "扩产快于预期",
              body: "设备与洁净室投产可能提前。",
            },
            {
              label: "DISPROVE",
              title: "证伪信号",
              body: "原厂否认、交期缩短、供需比上调。",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "对产业链的映射",
          paragraphs: [
            "对云厂商与算力买家，2027 年 HBM 紧张意味着内存成本上升与交付前置期拉长，可能影响 GPU 采购节奏；Amazon 管理层已把约 2,200 亿美元 CAPEX 的主要增量归因于内存成本，这条传导链已经进入云厂商的资本开支。",
            "对存储原厂，议价权偏供应商，但配置切换与 ASIC 下调会改变订单组合：押对选型的一方获得份额与溢价，押错的一方承担良率与库存风险。",
            "对 GPU 平台，HBM 选型是成本与供给的双重变量：规格越高，带宽越强，但交付约束越大。NVIDIA 并行评估三种配置，本质是在性能与可交付性之间留出回旋余地。",
            "后续跟踪：NVIDIA 是否公布最终 HBM 配置、原厂是否发布 2027 年分配公告、预付订金与长期合同的官方披露，以及 HBM4 与 HBM4E 的量产节奏。",
          ],
        },
      ],
      conclusion: "2027 年存储格局的确定性在于紧张，不确定性在于配置：NVIDIA 的三种 HBM 方案未定案，部分 CSP 在下调 ASIC 配置。“全部售罄”是行业消息而非官方事实；可引用的官方结论是供不应求延续、位元增长 50-60% 仍不够、议价权偏供应商。判断是否变化，看原厂分配公告、交期与供需比三个信号。",
      disclosure: "资料截止：2026 年 8 月 6 日（北京时间）。TrendForce 的供需判断、HBM 配置评估与位元增速来自其 8 月 4 日繁体中文报告及 7 月 30 日英文报告；“三大厂售罄、NAND 订完、预付订金”来自每日经济新闻引用的行业消息，原厂未确认；Amazon CAPEX 内存驱动为管理层电话会口径。所有产能分配与配置结论均为研究机构判断，非原厂公告。",
    },
    en: {
      hero: "The claim that 2027 memory capacity is fully sold out comes from media and industry sources; no memory maker has confirmed it officially. TrendForce's official view is that DRAM shortage persists into 2027, 2027 HBM bit shipments are expected to grow 50-60% year over year yet remain insufficient, and pricing power favors suppliers. Sold out and undersupplied are conclusions of different strength.",
      thesis: "The key to 2027 memory allocation is configuration decisions: since Q3 2026 NVIDIA is evaluating HBM4e 8-high, HBM4 12-high and HBM4 8-high in parallel for Rubin Ultra, with no final decision; some CSPs are considering lower HBM content in custom ASICs. Demand intensity is unchanged, but a spec switch would alter supply efficiency, individual vendor share, and which buyers actually feel the tightness.",
      opening: [
        "National Business Daily reported on August 4 that the three major memory makers have sold out 2027 DRAM and HBM capacity, with NAND largely booked by end of August and buyers accepting prepayments. The story cites industry sources and research firms, not maker announcements, so it must be treated as industry news.",
        "TrendForce's August 4 official report gives a sharper picture: 2027 DRAM undersupply persists; NVIDIA has moved Rubin Ultra's HBM configuration from HBM4e 12-high to parallel evaluation of three options since Q3 2026, undecided; and some CSPs are considering reducing HBM content in custom ASICs.",
        "Both sets of information point to the same conclusion: tight 2027 supply is consensus, but who gets what and in which configuration is still being negotiated. Treating industry news as official confirmation overstates certainty and understates configuration-switch risk.",
        "For Atlas readers this line matters because HBM is among the scarcest inputs in AI servers: a spec change alters GPU cost, delivery pace and memory makers' capacity allocation, and eventually flows into hyperscaler capex and compute pricing.",
        "The headline mechanics matter too: a research house's supply-demand forecast gets compressed into a sold-out assertion, dropping the assumptions and ranges along the way. Reconstructed, the correct reading is tight forecast, incomplete allocation, unconfirmed by makers. If buyers rush to book on the headline, lead times lengthen and deposits rise, creating self-fulfilling price behavior.",
      ],
      sections: [
        {
          label: "01 · THE SOLD-OUT CLAIM",
          heading: "The boundary between sold out and undersupplied",
          paragraphs: [
            "Sold out means allocation is contractually complete and new buyers struggle to enter; undersupplied only means a gap exists and allocation is still in progress. The media piece states the former as a conclusion, while TrendForce confirms only the latter. The two words describe different market states and different price behavior: one approaches rationing, the other still clears by price.",
            "Prepayments show buyers paying to lock capacity, but they can also reflect panic booking or return rights. Makers have not disclosed 2027 allocation ratios, contract lock-up shares or deposit terms, so sold out cannot be verified and should be read as an industry sentiment indicator.",
            "Three types of official evidence would confirm the claim: maker announcements of 2027 allocation or contracts, financial-statement disclosure of prepayments and long-term supply commitments, and observable lead-time extensions. Until then, industry news stays industry news.",
          ],
          metrics: [
            {
              label: "DRAM balance",
              value: "Undersupply into 2027",
              note: "TrendForce official view.",
            },
            {
              label: "2027 HBM bits",
              value: "+50-60% YoY",
              note: "Still insufficient to cover demand.",
            },
            {
              label: "2026 sufficiency",
              value: "-1% to -2%",
              note: "TrendForce July 30 report.",
            },
            {
              label: "2027 balance",
              value: "Gap widens",
              note: "TrendForce official judgment.",
            },
          ],
        },
        {
          label: "02 · THE SUPPLY MATH",
          heading: "Why 50-60% growth is not enough",
          paragraphs: [
            "A 50-60% year-over-year increase in 2027 HBM bit shipments is high growth off the current base, but TrendForce judges it still insufficient to cover demand, with the gap persisting into 2027 and the balance widening from 2026's -1% to -2%.",
            "Expansion is constrained by cleanrooms, test, packaging and equipment cycles rather than simple wafer starts. HBM test and packaging consume more capacity and time, and yield loss sits between bit growth and usable supply; configuration switches amplify that loss.",
            "Bit growth against the balance means 2027 tightness is not an equilibrium level but a persistent shortage even if makers expand at full tilt. For buyers, that supports early locking and prepayments; for Atlas, it explains price and lead-time pressure without endorsing sold out.",
          ],
          cards: [
            {
              label: "BITS",
              title: "+50-60% bit growth",
              body: "High growth, still below demand growth.",
            },
            {
              label: "YIELD",
              title: "Yield loss",
              body: "Test and packaging consume capacity; switches amplify loss.",
            },
            {
              label: "BALANCE",
              title: "2026: -1% to -2%",
              body: "The 2027 gap widens further.",
            },
            {
              label: "PRICE",
              title: "Pricing power favors suppliers",
              body: "2027 price talks work against buyers.",
            },
          ],
        },
        {
          label: "03 · NVIDIA'S HBM CHOICE",
          heading: "Why the Rubin Ultra spec switch matters",
          paragraphs: [
            "TrendForce says NVIDIA has been evaluating HBM4e 8-high, HBM4 12-high and HBM4 8-high in parallel since Q3 2026, replacing the originally planned HBM4e 12-high. An open evaluation means the procurement mix may change, reshaping vendor yields and capacity allocation.",
            "Stack height and layer count affect usable capacity and yield per wafer. If a switch lands, it changes the 2027 HBM supply-demand balance and vendor share, not merely NVIDIA's bandwidth configuration: the choice decides who gets the largest orders and who carries yield risk.",
            "CSPs considering lower HBM content in custom ASICs is the flip side of the same coin. Total demand may not fall, but the spec structure moves toward easier-to-deliver configurations; if several CSPs cut at once, tightness shifts from absolute shortage to structural shortage and pressure on lower-tier configurations eases.",
          ],
          cards: [
            {
              label: "ROUTE",
              title: "Three configurations in parallel",
              body: "HBM4e 8-high / HBM4 12-high / HBM4 8-high.",
            },
            {
              label: "STATUS",
              title: "Not decided",
              body: "The procurement mix remains a variable.",
            },
            {
              label: "ASIC",
              title: "CSPs considering less HBM",
              body: "Demand shifts toward deliverable specs.",
            },
            {
              label: "SHARE",
              title: "Vendor share follows selection",
              body: "Who gets the big orders and who carries yield risk both change.",
            },
          ],
        },
        {
          label: "04 · RISKS & COUNTER-EVIDENCE",
          heading: "What would break the tightness call",
          paragraphs: [
            "The first layer is demand risk. If model efficiency improves, training demand cools or CSP custom chips ramp, HBM demand growth could undershoot and the 2027 gap narrows. The more widely sold out is repeated, the more expectation bubble it may contain.",
            "The second layer is configuration risk. If NVIDIA finalizes a single option or CSPs cut HBM content across the board, supply rebalances: some specs turn from tight to surplus while others stay scarce. Industry-level tightness and product-level surplus can coexist.",
            "The third layer is the reverse of expansion risk: if makers ramp faster than expected, the 2027 balance could turn positive. Watch capex increases, equipment shipment acceleration and new cleanroom start dates.",
            "The falsification list is equally clear: makers denying sold out, 2027 contracts and deposits below expectations, shorter HBM lead times, or TrendForce revising the balance upward would all weaken the persistent-tightness conclusion.",
          ],
          cards: [
            {
              label: "DEMAND",
              title: "Demand cools",
              body: "Model efficiency and ASIC ramp narrow the gap.",
            },
            {
              label: "MIX",
              title: "Spec-level surplus",
              body: "Some configurations ease while others stay scarce.",
            },
            {
              label: "RAMP",
              title: "Faster expansion",
              body: "Equipment and cleanrooms could come online early.",
            },
            {
              label: "DISPROVE",
              title: "Falsification signals",
              body: "Maker denial, shorter lead times, higher balance.",
            },
          ],
        },
        {
          label: "05 · READ-THROUGH",
          heading: "Mapping into the supply chain",
          paragraphs: [
            "For cloud buyers and compute purchasers, 2027 HBM tightness means higher memory cost and longer lead times, potentially slowing GPU procurement; Amazon management already attributes the main increase in its roughly $220 billion capex guidance to memory costs, so the transmission line has entered hyperscaler budgets.",
            "For memory makers, pricing power favors suppliers, but config switches and ASIC reductions change the order mix: the maker that bets on the winning spec gains share and premium; the one that misses carries yield and inventory risk.",
            "For GPU platforms, HBM selection is a joint cost-and-supply variable: higher specs mean more bandwidth but tighter delivery. NVIDIA's parallel evaluation of three configurations is, in effect, room to maneuver between performance and deliverability.",
            "Watch for NVIDIA's final HBM configuration, official 2027 allocation statements from makers, disclosure of prepayment and long-term contracts, and the HBM4 and HBM4E production ramp.",
          ],
        },
      ],
      conclusion: "The certainty in 2027 memory is tightness; the uncertainty is configuration. NVIDIA's three HBM options are undecided and some CSPs are cutting ASIC HBM content. Sold out is industry news rather than official fact; the citable official conclusions are persistent undersupply, 50-60% bit growth still falling short, and pricing power favoring suppliers. Watch maker allocation statements, lead times and the balance revision to see when the call changes.",
      disclosure: "Information cut-off: August 6, 2026, Beijing time. TrendForce's balance judgments, HBM configuration review and bit-growth figures come from its August 4 traditional-Chinese report and July 30 English report. The sold-out NAND and prepayment claims come from National Business Daily citing industry sources; no maker has confirmed them. The Amazon capex memory attribution is a management call statement. Allocation and configuration conclusions are research-house judgments, not maker announcements.",
    },
  },
{
    slug: "earnings-season-review-2026",
    imageAltZh: "概念体素插画：云服务塔与分化的资金回流通道",
    imageAltEn: "Conceptual voxel illustration of three distinct cloud service towers with unequal return channels",
    articleSectionZh: "财报季综述与基础设施周期",
    articleSectionEn: "Earnings season and the infrastructure cycle",
    topics: ["Microsoft", "Alphabet", "Amazon", "Meta", "Intel", "SK hynix", "cloud CAPEX", "capacity gap", "free cash flow"],
    sources: [
      {
        url: "https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast",
        zh: "Microsoft FY26 Q4 官方财报与电话会",
        en: "Microsoft FY26 Q4 earnings release and webcast",
        level: "primary",
      },
      {
        url: "https://s206.q4cdn.com/479360582/files/doc_financials/2026/q2/2026q2-alphabet-earnings-release.pdf",
        zh: "Alphabet 2026 Q2 官方财报",
        en: "Alphabet Q2 2026 earnings release",
        level: "primary",
      },
      {
        url: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx",
        zh: "Meta 2026 Q2 官方财报",
        en: "Meta Q2 2026 results",
        level: "primary",
      },
      {
        url: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Second-Quarter-Results/default.aspx",
        zh: "Amazon 2026 Q2 官方财报",
        en: "Amazon Q2 2026 results",
        level: "primary",
      },
      {
        url: "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results",
        zh: "Intel 2026 Q2 官方财报",
        en: "Intel Q2 2026 results",
        level: "primary",
      },
      {
        url: "https://news.skhynix.com/en/q2-2026-business-results/",
        zh: "SK hynix 2026 Q2 官方业绩",
        en: "SK hynix Q2 2026 business results",
        level: "primary",
      },
      {
        url: "https://investors.vertiv.com/news/news-details/2026/Vertiv-Announces-Date-of-Second-Quarter-2026-Earnings-Release-and-Conference-Call/default.aspx",
        zh: "Vertiv Q2 财报日期公告（正文未取得，not-determined）",
        en: "Vertiv Q2 earnings date notice (no verifiable release, not-determined)",
        level: "primary",
      },
      {
        url: "https://investors.arm.com/financials/quarterly-annual-results",
        zh: "Arm 季度业绩页（正文未取得，not-determined）",
        en: "Arm quarterly results page (no verifiable release, not-determined)",
        level: "primary",
      },
    ],
    zh: {
      hero: "这轮财报季给出三个具体信号：云收入正在吸收新增容量，供给缺口没有关闭，现金转换开始分化。Azure 增长 43%、Google Cloud 增长 82%、AWS 增长 37%，同时 Alphabet 当季自由现金流转负、Amazon 过去十二个月自由现金流转为流出、Meta 当季自由现金流只有 7.84 亿美元。下一阶段的关键检验，是容量多快上线并变成可计费收入。",
      thesis: "云厂商的约束已从资本预算转向交付速度与现金转换。Microsoft 仍称需求高于供给，Alphabet 需要第三方容量衔接，Amazon 预计 2026 年乃至 2027 年仍受容量限制，Meta 把规划延伸到 2028 年以后。上游并非同步受益：Intel 与 SK hynix 的收入在兑现，而电力、洁净室、封装、设备与良率决定供给真正出现的时间。",
      opening: [
        "本篇综述覆盖 Microsoft、Alphabet、Meta、Amazon、Intel、Tesla 与 SK hynix；Vertiv 与 Arm 因未能取得可核验的官方业绩正文，保留 not-determined，不生成结论。所有财务数字均回到公司官方披露。",
        "三个跨公司信号：云收入吸收新增容量、供给缺口持续、现金转换分化。它们共同说明，资本开支总额不再是唯一变量，交付速度与自由现金流开始决定投资回报。",
        "单家公司深度见已发布的 Microsoft、SK hynix 与 CAPEX 相关专栏，本篇只呈现季节级结论，避免重复。",
        "把三家云厂商的增速放在一起，先回答一个总量问题：投入扩大有没有把需求打下去。答案是没有，这轮财报季最核心的观察就是需求与供给同步扩张，缺口没有被资本开支填平。",
      ],
      sections: [
        {
          label: "01 · THE SEASON'S SIGNAL",
          heading: "云收入正在吸收新增容量",
          paragraphs: [
            "Azure 增长 43%，Google Cloud 增长 82%，AWS 增长 37%（18 个季度以来最快）。需求并没有因为基础设施投入扩大而明显转弱，新增容量仍在被吸收。",
            "三家公司的收入结构不同：Azure 的 43% 建立在更高的绝对基数上，Google Cloud 的 82% 来自更低的基数与积压订单转化，AWS 的 37% 则是三个数字中唯一以加速姿态出现的。增长口径不同，但都指向同一件事：可计费容量没有被闲置。",
            "收入吸收不等于回报兑现。云收入增长先于折旧与能源成本高峰到来，真正的检验是容量上线后毛利率与自由现金流能否同步改善。",
          ],
          metrics: [
            {
              label: "Azure",
              value: "+43%",
              note: "Microsoft FY26 Q4 官方财报。",
            },
            {
              label: "Google Cloud",
              value: "+82%，营收 247.68 亿美元",
              note: "Alphabet Q2 官方财报，营业利润 88.14 亿美元。",
            },
            {
              label: "AWS",
              value: "+37%，营收 422 亿美元",
              note: "Amazon Q2 官方财报，18 个季度以来最快。",
            },
          ],
        },
        {
          label: "02 · THE CAPACITY GAP",
          heading: "供给缺口没有关闭",
          paragraphs: [
            "Microsoft 仍称需求高于供给。管理层预计下一季度 Azure 固定汇率增长约 45%，CAPEX 将超过 500 亿美元；季度内新增 31 个数据中心和约 1GW 容量，大型区域 GPU 从到货到上线的时间在本财年缩短近 50%。公司预计两年内总体容量大致翻倍。",
            "Alphabet 的 Cloud 积压订单达 5,140 亿美元，环比增加约 500 亿美元，超过一半预计在未来 24 个月确认；公司将在第三季度使用第三方容量作为过渡，并预计这会给利润率带来轻微压力。积压订单是管理层披露，不是已确认收入，但它解释了 82% 增速的可持续性来源。",
            "Amazon 管理层预计 2026 年、很可能 2027 年仍会受容量限制。2026 年全公司现金 CAPEX 预期由约 2,000 亿美元上调至约 2,200 亿美元，主要增量来自内存成本；该数字覆盖全公司，不能当作 AWS 独立 CAPEX。",
            "Meta 正最大化 2026 年和 2027 年的容量，并为 2028 年以后提前布局。API、企业代理与对外销售计算能力仍是潜在变现路径，不是已经报告的收入。",
            "四家的共同点是：指引的约束项从“钱够不够”变成“容量什么时候到”。资本预算已经不是稀缺资源，按时交付的电力、芯片与机房才是。",
          ],
          cards: [
            {
              label: "MICROSOFT",
              title: "链条完整",
              body: "投入、交付、收入可同步跟踪：45% 指引、超 500 亿美元 CAPEX、1GW 新增。",
            },
            {
              label: "ALPHABET",
              title: "第三方过渡",
              body: "积压 5,140 亿美元，Q3 起用第三方容量衔接，利润率承压。",
            },
            {
              label: "AMAZON",
              title: "现金转负",
              body: "CAPEX 上调至约 2,200 亿美元，内存成本为主因，2027 年仍可能受限。",
            },
            {
              label: "META",
              title: "2028+ 布局",
              body: "最大化 2026-2027 容量，变现路径仍是选项而非收入。",
            },
          ],
        },
        {
          label: "03 · CASH CONVERSION",
          heading: "现金转换开始分化",
          paragraphs: [
            "Alphabet 当季自由现金流为负 58.55 亿美元：经营现金流 390.69 亿美元，物业与设备采购 449.24 亿美元。Amazon 过去十二个月自由现金流转为流出 76 亿美元。Meta 当季自由现金流仅 7.84 亿美元，全年 CAPEX 区间收窄至 1,300–1,450 亿美元。",
            "自由现金流的三个数字来自不同的会计结构：Alphabet 是当季采购高峰，Amazon 是十二个月滚动口径，Meta 的 CAPEX 含融资租赁本金。直接比较数值没有意义，共同的信号是资本支出已经快于经营现金流，差距靠负债与融资租赁弥补。",
            "Microsoft 的租赁口径提供了一个观察刻度：当季 CAPEX 410 亿美元中，融资租赁 56 亿美元、现金购置物业与设备 358 亿美元。租赁占比上升意味着未来租金义务进入资产负债表，自由现金流会被结构性压低，而不是单纯的投资节奏问题。",
            "资本开支能否快速转成可计费容量，已经成为比预算总额更重要的指标。折旧、能源与租赁成本会滞后反映，当前自由现金流已经计入未来折旧压力的前兆。",
          ],
          metrics: [
            {
              label: "Alphabet 自由现金流",
              value: "-58.55 亿美元（当季）",
              note: "经营现金流与物业设备采购之差。",
            },
            {
              label: "Amazon 自由现金流",
              value: "-76 亿美元（TTM）",
              note: "过去十二个月转负，主因 AI 投资。",
            },
            {
              label: "Meta 自由现金流",
              value: "7.84 亿美元（当季）",
              note: "CAPEX 含融资租赁本金 310.8 亿美元。",
            },
            {
              label: "Microsoft 租赁占比",
              value: "融资租赁 56 亿 / 现金购置 358 亿美元",
              note: "当季 CAPEX 410 亿美元，租赁义务进入资产负债表。",
            },
          ],
        },
        {
          label: "04 · UPSTREAM",
          heading: "上游并非同步受益",
          paragraphs: [
            "Intel Q2 营收 161 亿美元、增长 25%，DCAI 营收 63 亿美元、增长 59%。公司将增加设备、洁净室空间和基板投入，以支持产品与代工业务；收入增长来自数据中心 CPU 产品周期，代工回报仍需验证。",
            "SK hynix Q2 营收 79.32 万亿韩元，营业利润 60.54 万亿韩元，营业利润率 76%。HBM4 已在 Q2 开始出货并计划下半年爬坡，HBM4E 样品已在上半年发出；公司与约十家重点客户采用长期多年供货安排，M15X 加快建设，龙仁一期洁净室预计 2027 年初启用。",
            "Tesla Q2 储能部署 13.5GWh。AI 数据中心对电力质量、调峰和并网时间的要求提高了电网级储能的战略价值，但 Tesla 未披露其中多少部署直接服务数据中心，不能把全部储能增量归因于 AI。",
            "Vertiv 与 Arm 在资料截止前未取得可核验的官方 Q2 业绩正文，标注 not-determined：不写订单、积压、液冷收入、授权版税或全年指引。待官方新闻稿、10-Q 或稳定电话会全文可核验后再行更新。",
            "上游的共同模式：收入先于产能兑现。Intel 与 SK hynix 的订单和出货已经反映在利润里，但洁净室、设备、封装与良率决定下一年的供给；这与云厂商“容量上线”的约束是同一条链。",
          ],
          cards: [
            {
              label: "MICROSOFT",
              title: "链条完整",
              body: "投入、交付、收入可同步跟踪。",
            },
            {
              label: "ALPHABET",
              title: "第三方过渡",
              body: "自有容量未跟上，利润率承压。",
            },
            {
              label: "AMAZON",
              title: "现金转负",
              body: "追赶容量的成本显现。",
            },
            {
              label: "META",
              title: "2028+ 布局",
              body: "变现路径仍是选项而非收入。",
            },
            {
              label: "INTEL",
              title: "收入先行",
              body: "代工回报待验证。",
            },
            {
              label: "SK HYNIX",
              title: "需求可见",
              body: "长期合同与量产纪律并存。",
            },
          ],
        },
        {
          label: "05 · COUNTER-CASE & WATCHLIST",
          heading: "什么情况下这个判断会失效",
          paragraphs: [
            "乐观判断成立的前提是容量按期上线且被吸收。反向情形有三：自有容量交付延迟，迫使 Alphabet 与 Amazon 长期依赖第三方过渡容量；内存与设备成本上涨快于收入转化，压缩毛利率；以及供给放量后云增速回落，让 2027 年出现“容量过剩 + 折旧高峰”的组合。",
            "自由现金流是预警线。若未来两季 Alphabet、Amazon 与 Meta 的自由现金流持续为负，而可计费容量增速没有跟上，说明资本开支没有变成收入，估值逻辑会从“增长故事”回到“现金消耗”。",
            "下一季的观察清单：新增容量的送电与上线时间、GPU 从到货到激活的周期、融资租赁占比的变化、每单位可计费容量的自由现金流，以及 Vertiv 与 Arm 的官方业绩能否补齐。",
            "对 Atlas 而言，这份综述的用途不是预测股价，而是把“AI 基建是否兑现”变成一组可检验的工程问题：容量、电力、芯片、现金流，各自有官方的观察点。",
          ],
          cards: [
            {
              label: "LATE",
              title: "容量延期",
              body: "第三方过渡时间拉长，利润率持续承压。",
            },
            {
              label: "COST",
              title: "成本快于收入",
              body: "内存与设备通胀挤压云毛利率。",
            },
            {
              label: "GLUT",
              title: "供给放量后增速回落",
              body: "2027 年可能同时出现容量与折旧高峰。",
            },
            {
              label: "CASH",
              title: "自由现金流持续为负",
              body: "可计费容量跟不上时，增长叙事转为现金消耗。",
            },
          ],
        },
      ],
      conclusion: "财报季的总结论：AI 基建已从资本承诺进入交付与现金转换阶段。云收入吸收容量、供给缺口延续、自由现金流分化，三者同时成立。下一季度应跟踪新增容量上线、GPU 激活速度、租赁与折旧口径，以及自由现金流能否随可计费容量改善。判断失效的边界同样明确：容量延期、成本快于收入、供给放量后增速回落，三者任一生效都应下调乐观度。",
      disclosure: "资料截止：2026 年 8 月 1 日 23:00（北京时间），各公司后续披露以官方最新页面为准。财务数字来自公司官方财报与新闻稿；电话会内容标注为管理层表示；Alphabet 积压订单与第三方容量、Meta 变现路径、Amazon 约 2,200 亿美元 CAPEX 为管理层口径。Vertiv 与 Arm 在截止时无可核验官方业绩正文，标注 not-determined。本文不含股价、评级、目标价或投资建议。",
    },
    en: {
      hero: "This earnings season delivers three concrete signals: cloud revenue is absorbing new capacity, the supply gap has not closed, and cash conversion is diverging. Azure grew 43%, Google Cloud 82% and AWS 37%, while Alphabet's quarterly free cash flow turned negative, Amazon's trailing twelve months turned to an outflow, and Meta posted only $784 million of quarterly free cash flow. The next test is how fast capacity comes online and turns into billable revenue.",
      thesis: "Cloud constraints have shifted from capital budgets to delivery speed and cash conversion. Microsoft still sees demand above supply, Alphabet is bridging with third-party capacity, Amazon expects constraints through 2026 and likely 2027, and Meta is planning into 2028 and beyond. Upstream does not benefit uniformly: Intel and SK hynix revenue is materializing, but power, cleanrooms, packaging, equipment and yield decide when supply actually appears.",
      opening: [
        "This review covers Microsoft, Alphabet, Meta, Amazon, Intel, Tesla and SK hynix. Vertiv and Arm remain not-determined because no verifiable official earnings release was available at cut-off; no conclusions are drawn for them. All financial figures return to official company disclosures.",
        "Three cross-company signals: cloud revenue absorbing capacity, a persistent supply gap, and diverging cash conversion. Together they show that total capex is no longer the only variable; delivery speed and free cash flow now determine investment returns.",
        "Company-level depth appears in the published Microsoft, SK hynix and capex columns; this review focuses on the seasonal read and does not repeat them.",
        "Placing the three cloud growth rates side by side first answers an aggregate question: has expanding investment killed demand? It has not. The central observation of the season is that demand and supply are expanding together, and the gap has not been closed by capex.",
      ],
      sections: [
        {
          label: "01 · THE SEASON'S SIGNAL",
          heading: "Cloud revenue is absorbing new capacity",
          paragraphs: [
            "Azure grew 43%, Google Cloud 82% and AWS 37%, its fastest growth in 18 quarters. Demand has not visibly weakened as infrastructure spending expanded; new capacity is still being absorbed.",
            "The revenue structures differ: Azure's 43% sits on the largest absolute base, Google Cloud's 82% comes from a lower base plus backlog conversion, and AWS's 37% is the only acceleration of the three. The bases differ, but they point to the same fact: billable capacity is not sitting idle.",
            "Revenue absorption is not return realization. Cloud revenue growth precedes the depreciation and energy cost peak, so the real test is whether gross margin and free cash flow improve after capacity comes online.",
          ],
          metrics: [
            {
              label: "Azure",
              value: "+43%",
              note: "Microsoft FY26 Q4 official release.",
            },
            {
              label: "Google Cloud",
              value: "+82% to $24.768B",
              note: "Alphabet Q2 release; operating income $8.814B.",
            },
            {
              label: "AWS",
              value: "+37% to $42.2B",
              note: "Amazon Q2 release; fastest in 18 quarters.",
            },
          ],
        },
        {
          label: "02 · THE CAPACITY GAP",
          heading: "The supply gap has not closed",
          paragraphs: [
            "Microsoft still says demand exceeds supply. Management guides Azure constant-currency growth of about 45% next quarter with capex above $50 billion; the quarter added 31 data centers and about 1GW, and time from GPU arrival to deployment in large regions shrank nearly 50% during the fiscal year. The company expects overall capacity to roughly double within two years.",
            "Alphabet's cloud backlog reached $514 billion, up about $50 billion quarter over quarter, with more than half expected to recognize within 24 months; the company will use third-party capacity as a bridge in Q3 and expects slight margin pressure. Backlog is a management disclosure, not recognized revenue, but it explains the durability behind 82% growth.",
            "Amazon management expects capacity constraints through 2026 and likely 2027. Full-year company-wide cash capex guidance rose from about $200 billion to about $220 billion, mainly on memory costs; that is a company-wide figure, not AWS capex.",
            "Meta is maximizing 2026 and 2027 capacity and laying groundwork for 2028 and beyond. API, enterprise agents and selling compute remain potential monetization paths, not reported revenue.",
            "Across all four, the binding constraint in guidance has moved from whether capital exists to when capacity arrives. Capital budgets are no longer scarce; power, chips and data halls delivered on time are.",
          ],
          cards: [
            {
              label: "MICROSOFT",
              title: "Complete chain",
              body: "45% guide, $50B+ capex and 1GW added allow spend, delivery and revenue to be tracked together.",
            },
            {
              label: "ALPHABET",
              title: "Third-party bridge",
              body: "$514B backlog; third-party capacity from Q3 puts margin under pressure.",
            },
            {
              label: "AMAZON",
              title: "Cash turned negative",
              body: "Capex raised to ~$220B on memory costs; constraints likely through 2027.",
            },
            {
              label: "META",
              title: "2028+ planning",
              body: "Maximizing 2026-2027 capacity; monetization paths remain options.",
            },
          ],
        },
        {
          label: "03 · CASH CONVERSION",
          heading: "Cash conversion is diverging",
          paragraphs: [
            "Alphabet's quarterly free cash flow was negative $5.855 billion: operating cash flow of $39.069 billion against $44.924 billion of property and equipment purchases. Amazon's trailing-twelve-month free cash flow turned to an outflow of $7.6 billion. Meta posted only $784 million of quarterly free cash flow and narrowed full-year capex to $130-145 billion.",
            "The three cash numbers come from different accounting structures: Alphabet is a quarterly purchase peak, Amazon is a twelve-month rolling measure, and Meta's capex includes finance-lease principal. Direct comparison is meaningless; the common signal is that capital spending has outrun operating cash flow, with the gap covered by debt and finance leases.",
            "Microsoft's lease mix provides a scale for observation: of $41 billion in quarterly capex, $5.6 billion was finance leases and $35.8 billion cash purchases of property and equipment. Rising lease share means future rent obligations enter the balance sheet, structurally compressing free cash flow rather than merely reflecting investment timing.",
            "Whether capex converts quickly into billable capacity has become more important than the budget total. Depreciation, energy and lease costs lag, and current free cash flow already carries the leading edge of future depreciation pressure.",
          ],
          metrics: [
            {
              label: "Alphabet FCF",
              value: "-$5.855B (quarter)",
              note: "Operating cash flow minus property and equipment purchases.",
            },
            {
              label: "Amazon FCF",
              value: "-$7.6B (TTM)",
              note: "Turned negative on AI investment.",
            },
            {
              label: "Meta FCF",
              value: "$784M (quarter)",
              note: "Capex incl. finance-lease principal was $31.08B.",
            },
            {
              label: "Microsoft lease mix",
              value: "$5.6B leases / $35.8B cash",
              note: "Of $41B quarterly capex; lease obligations enter the balance sheet.",
            },
          ],
        },
        {
          label: "04 · UPSTREAM",
          heading: "Upstream does not benefit uniformly",
          paragraphs: [
            "Intel reported Q2 revenue of $16.1 billion, up 25%, with DCAI revenue of $6.3 billion, up 59%. The company will increase equipment, cleanroom and substrate investment to support product and foundry growth; the revenue gain comes from the data-center CPU cycle, while foundry returns still need proof.",
            "SK hynix reported Q2 revenue of 79.32 trillion KRW and operating profit of 60.54 trillion KRW, an operating margin of 76%. HBM4 began shipping in Q2 with an H2 ramp planned and HBM4E samples sent in H1; roughly ten key customers use long-term multi-year supply arrangements, M15X is accelerating, and the Yongin phase-1 cleanroom is expected early 2027.",
            "Tesla deployed 13.5GWh of storage in Q2. AI data centers raise the strategic value of grid-scale storage for power quality, peaking and interconnection, but Tesla does not disclose how much serves data centers, so not all storage growth can be attributed to AI.",
            "Vertiv and Arm are marked not-determined: no verifiable official Q2 release was available at cut-off, so no orders, backlog, liquid-cooling revenue, licensing or full-year guidance conclusions are drawn. Update requires a verifiable release, 10-Q or stable call transcript.",
            "Upstream follows a common pattern: revenue arrives before capacity. Intel and SK hynix orders and shipments are already in profit, but cleanrooms, equipment, packaging and yield decide next year's supply, the same constraint chain as the cloud capacity gap.",
          ],
          cards: [
            {
              label: "MICROSOFT",
              title: "Complete chain",
              body: "Spend, delivery and revenue can be tracked together.",
            },
            {
              label: "ALPHABET",
              title: "Third-party bridge",
              body: "Own capacity lags; margin takes pressure.",
            },
            {
              label: "AMAZON",
              title: "Cash turned negative",
              body: "The cost of catching up on capacity is visible.",
            },
            {
              label: "META",
              title: "2028+ planning",
              body: "Monetization paths remain options, not revenue.",
            },
            {
              label: "INTEL",
              title: "Revenue first",
              body: "Foundry returns still to be proven.",
            },
            {
              label: "SK HYNIX",
              title: "Visible demand",
              body: "Long-term contracts coexist with disciplined capacity.",
            },
          ],
        },
        {
          label: "05 · COUNTER-CASE & WATCHLIST",
          heading: "What would break the call",
          paragraphs: [
            "The constructive view assumes capacity lands on schedule and gets absorbed. The counter-case has three legs: owned capacity arrives late, forcing Alphabet and Amazon to rely on third-party bridging longer; memory and equipment costs rise faster than revenue conversion, compressing gross margin; and cloud growth slows after supply expands, producing a 2027 combination of capacity surplus and a depreciation peak.",
            "Free cash flow is the warning line. If Alphabet, Amazon and Meta stay negative for two more quarters while billable capacity growth fails to catch up, capex is not converting into revenue and the story shifts from growth to cash burn.",
            "Next quarter's watch list: energization and go-live of new capacity, the GPU arrival-to-activation cycle, the finance-lease share, free cash flow per unit of billable capacity, and whether Vertiv and Arm official releases fill their not-determined gaps.",
            "For Atlas, this review is not a price forecast. It turns whether AI infrastructure is delivering into a set of verifiable engineering questions, each with official observation points: capacity, power, chips and cash.",
          ],
          cards: [
            {
              label: "LATE",
              title: "Capacity slips",
              body: "Longer third-party bridging keeps margin under pressure.",
            },
            {
              label: "COST",
              title: "Costs outrun revenue",
              body: "Memory and equipment inflation compress cloud margin.",
            },
            {
              label: "GLUT",
              title: "Growth slows after supply expands",
              body: "2027 could pair capacity surplus with a depreciation peak.",
            },
            {
              label: "CASH",
              title: "Persistent negative FCF",
              body: "Without matching billable capacity, the story turns to cash burn.",
            },
          ],
        },
      ],
      conclusion: "The seasonal conclusion: AI infrastructure has moved from capital commitment to delivery and cash conversion. Cloud revenue absorbing capacity, a persistent supply gap and diverging free cash flow all hold at once. Next quarter, watch capacity energization, GPU activation speed, lease and depreciation accounting, and whether free cash flow improves as billable capacity grows. The boundary of the call is equally clear: late capacity, costs outrunning revenue, or growth slowing after supply expands would each warrant downgrading optimism.",
      disclosure: "Information cut-off: August 1, 2026, 11:00 PM Beijing time; later company disclosures supersede where they appear. Financial figures come from official releases and news; call content is marked as management statements; Alphabet backlog and third-party capacity, Meta monetization paths and Amazon's roughly $220 billion capex are management figures. Vertiv and Arm are not-determined for lack of verifiable official releases at cut-off. This article contains no stock prices, ratings, price targets or investment advice.",
    },
  },

];

export function scheduledResearchBySlug(slug: string): ScheduledResearchRecord | undefined {
  return scheduledResearchRecords.find((record) => record.slug === slug);
}
