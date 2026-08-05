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
  {
    slug: "accelerator-platform-divergence",
    imageAltZh: "两套独立 AI 计算集群通过园区电力与冷却基础设施连接",
    imageAltEn: "Two distinct AI compute clusters linked through shared campus power and cooling",
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
    imageAltZh: "配有自备电源、储能和独立变电设施的美国数据中心园区",
    imageAltEn: "A U.S. data-center campus with dedicated generation, storage and substations",
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
    imageAltZh: "数据中心、AI 计算机架和分层资本结构形成一套基础设施平台",
    imageAltEn: "A data center, AI racks and layered capital structure joined in one infrastructure platform",
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
    imageAltZh: "由公共访问设施、多座计算机房与能源系统构成的欧洲 AI 算力园区",
    imageAltEn: "A European AI compute campus with public access, data halls and energy systems",
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
    imageAltZh: "大型燃气发电机组、储能与数据中心机房构成的 AI 电力园区",
    imageAltEn: "Large gas generators, battery storage and data halls forming an AI power campus",
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
      thesis: "数据中心电力瓶颈正在把 AI CAPEX 从加速器扩展到发电机组、燃气接入、储能、排放控制、配电和长期服务。设备收入先确认，园区算力收入后兑现。Caterpillar 的增长证明订单已经进入工业设备层，项目风险仍集中在许可、燃料与按时投运。",
      opening: [
        "先纠正数字。Caterpillar 8 月 4 日提交的 Q2 8-K 附件显示，Power Generation 销售为 30.98 亿美元，去年同期为 24.07 亿美元，同比增长 29%。公司明确表示，增长来自大型往复式发动机、燃机与燃机服务，主要应用于数据中心。",
        "Power & Energy 分部总销售为 82.38 亿美元，同比增长 17%；分部利润为 20.27 亿美元，增长 30%。公司整体销售和收入达到 205.43 亿美元，增长 24%。官方文件不支持“发电业务增长 72%”的说法。",
        "29% 仍然具有结构性意义。它来自可交付的发动机、燃机和服务，不是尚未投运的园区容量。设备商在数据中心开始收费前便获得订单，因此能更早观察 AI 基建支出向电力层传导。",
      ],
      sections: [
        {
          label: "01 · THE OFFICIAL PRINT",
          heading: "电力设备已经成为增长主轴",
          paragraphs: [
            "Power Generation 是 Power & Energy 分部增长最快的主要应用。Oil and Gas 与 Industrial 均增长 9%，对比显示数据中心相关发电需求明显更强。分部利润增速高于销售，也说明销量和定价暂时覆盖了制造成本上升。",
            "该口径覆盖大型往复式发动机、燃机与相关服务，不能全部归入 AI 数据中心。公司只说明增长“主要”来自数据中心应用，没有披露数据中心收入占比、客户数量或各类设备的拆分。",
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
          ],
        },
        {
          label: "02 · FROM GPU TO FIRM POWER",
          heading: "下一美元 AI CAPEX 正沿着电力路径拆分",
          paragraphs: [
            "一座高密度 AI 园区需要的不只是发电机。持续电源方案通常包括天然气供应、发动机或燃机、储能、开关设备、变压器、控制系统、排放治理、备件和长期运维。每个环节都有独立的交付与收入节奏。",
            "Caterpillar 与 American Intelligence & Power 的 Monarch 项目展示了这条路径。AIP 已订购 2GW 快速响应天然气发电机组，计划从 2026 年 9 月至 2027 年 8 月交付，并配套电池储能处理 AI 负荷波动。项目方称初期 2GW 在 2027 年上线，远期目标为 8GW。",
            "2GW 是采购与项目计划，远期 8GW 更是前瞻目标。只有设备交付、空气许可、燃气、调试和机房负载完成，才能视为可用电源。",
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
          label: "04 · READ-THROUGH",
          heading: "这组数字如何映射到数据中心产业链",
          paragraphs: [
            "对园区开发商，持续电源可以缩短并网等待，却提高前期资本、燃料和许可风险。对设备商，订单能在机房收入前确认，但制造扩产与现场服务必须跟上。对云厂商，电力方案会进入每一单位可用算力的全生命周期成本。",
            "下一季应跟踪 Power Generation 的增速、分部积压订单、产能扩张、项目交付和服务收入。若设备销售继续快于油气与工业应用，同时更多项目完成许可和投运，AI CAPEX 向电力设备外溢的判断会得到加强。",
          ],
        },
      ],
      conclusion: "Caterpillar 的 29% 说明 AI 基建已经进入重型工业设备。下一美元支出会流向能把 GPU 持续点亮的发电、储能、配电与服务；订单增长能否变成园区运行，还要过燃料、许可和调试三道门。",
      disclosure: "资料截止：2026 年 8 月 5 日 17:40（北京时间）。财务数字来自 Caterpillar 2026 Q2 SEC 8-K 附件；2GW 项目、交付时间和设备性能来自 Caterpillar 与 AIP 的官方公告。项目远期规模与投运时间属于前瞻计划。",
    },
    en: {
      hero: "Caterpillar's official Q2 figure is 29%, not the 72% circulating in secondary feeds. Power-generation sales reached $3.098 billion, led by large reciprocating engines, turbines and services for data-center applications. It is clear evidence that GPU capex is spilling into firm power.",
      thesis: "Power constraints are extending AI capex into generation, gas delivery, storage, emissions controls, distribution and service. Equipment revenue can arrive before campus compute revenue. Caterpillar confirms that orders have entered the industrial-equipment layer; permitting, fuel and commissioning still hold project risk.",
      opening: [
        "Start with the corrected figure. Caterpillar's August 4 SEC earnings exhibit reports Power Generation sales of $3.098 billion, up 29% from $2.407 billion. The company says the increase came from large reciprocating engines, turbines and turbine services, primarily in data-center applications.",
        "Total Power & Energy sales were $8.238 billion, up 17%, while segment profit reached $2.027 billion, up 30%. Company sales and revenues were $20.543 billion, up 24%. The official filing does not support a 72% power-generation growth claim.",
        "The 29% still carries structural weight. It represents deliverable engines, turbines and service rather than announced campus capacity. Equipment suppliers receive orders before data centers begin billing, making them an earlier read on AI spending moving into power.",
      ],
      sections: [
        {
          label: "01 · THE OFFICIAL PRINT",
          heading: "Power equipment has become a growth axis",
          paragraphs: [
            "Power Generation was the fastest-growing major application inside Power & Energy. Oil and Gas and Industrial each rose 9%, showing a much stronger data-center-related power trend. Segment profit grew faster than sales as volume and price more than offset higher manufacturing costs.",
            "The category includes large reciprocating engines, turbines and related services and cannot be assigned entirely to AI data centers. Caterpillar says data-center applications were the primary driver without disclosing customer count, revenue share or equipment mix.",
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
          ],
        },
        {
          label: "02 · FROM GPU TO FIRM POWER",
          heading: "The next AI dollar splits along the power path",
          paragraphs: [
            "A high-density AI campus needs more than generators. Firm-power systems typically include gas supply, engines or turbines, batteries, switchgear, transformers, controls, emissions treatment, spares and long-term service. Each layer has its own delivery and revenue schedule.",
            "Caterpillar's Monarch project with American Intelligence & Power illustrates the chain. AIP ordered 2GW of fast-response natural-gas generator sets for delivery from September 2026 through August 2027, paired with battery storage for AI load swings. The project targets the first 2GW online in 2027 and 8GW over time.",
            "The 2GW is a purchase and project plan; 8GW is a longer-term objective. Equipment delivery, air permits, gas, commissioning and data-hall load must close before either becomes usable power.",
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
          label: "04 · READ-THROUGH",
          heading: "How the print maps into the data-center chain",
          paragraphs: [
            "For campus developers, firm power can shorten grid waits and raise upfront capital, fuel and permitting exposure. For equipment suppliers, orders arrive ahead of data-hall revenue and require manufacturing plus field service to keep pace. For cloud companies, power enters the lifetime cost of usable compute.",
            "Next quarter, watch Power Generation growth, segment backlog, capacity expansion, project deliveries and service revenue. Continued outgrowth versus oil-and-gas and industrial applications, paired with permitted and commissioned projects, would strengthen the AI-power-spillover thesis.",
          ],
        },
      ],
      conclusion: "Caterpillar's 29% shows that AI infrastructure has entered heavy industrial equipment. The next dollar goes to generation, storage, distribution and service that keep GPUs on. Fuel, permits and commissioning still separate orders from operating campuses.",
      disclosure: "Information cut-off: August 5, 2026, 5:40 PM Beijing time. Financial figures come from Caterpillar's Q2 2026 SEC earnings exhibit. The 2GW project, delivery schedule and equipment performance come from the Caterpillar-AIP announcement. Long-term capacity and in-service dates are forward-looking.",
    },
  },
];

export function scheduledResearchBySlug(slug: string): ScheduledResearchRecord | undefined {
  return scheduledResearchRecords.find((record) => record.slug === slug);
}
