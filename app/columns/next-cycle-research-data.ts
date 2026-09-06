import type { ScheduledResearchRecord } from "./scheduled-article-data";

type Input = Omit<ScheduledResearchRecord, "topics"> & { topics?: string[] };
const record = (input: Input): ScheduledResearchRecord => ({ ...input, topics: input.topics ?? [] });
const primary = (url: string, zh: string, en: string) => ({ url, zh, en, level: "primary" as const });

export const nextCycleResearchRecords: ScheduledResearchRecord[] = [
  record({
    slug: "singapore-200mw-allocation",
    imageAltZh: "新加坡裕廊岛数据中心园区、电网和海上绿色能源连接的建筑剖面",
    imageAltEn: "Architectural cutaway of a Singapore data-center campus, grid and offshore green-energy links",
    articleSectionZh: "主权容量与电力政策",
    articleSectionEn: "Sovereign capacity and power policy",
    topics: ["Singapore", "EDB", "IMDA", "data centers", "power", "AI infrastructure"],
    sources: [
      primary("https://www.edb.gov.sg/en/about-edb/media-releases-publications/four-data-centre-proposals-selected-as-part-of-second-data-centre.html", "新加坡 EDB：DC-CFA2 四个暂定入选项目", "Singapore EDB: four provisional DC-CFA2 selections"),
      primary("https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2025/launch-of-second-data-centre", "新加坡 IMDA：DC-CFA2 申请要求", "Singapore IMDA: DC-CFA2 requirements"),
    ],
    zh: {
      hero: "新加坡没有重新打开一条无限扩张的通道。它只暂定释放 200MW，并把每一个 50MW 名额与绿色电力、IT 能效、AI 经济价值和项目执行绑定。容量不再是开发商先拿地、后找客户的商品，而是一项需要持续证明公共回报的稀缺许可。",
      thesis: "DC-CFA2 的意义不在于四家运营商名单，而在于政府把数据中心审批从单一的建筑许可升级为产业政策工具。未来在电力紧张市场里，赢家不只是拥有土地和资本的运营商，而是能同时证明可交付电力、可核验效率、优质客户和本地产业贡献的项目组合。",
      opening: [
        "2026 年 8 月 21 日，新加坡经济发展局与资讯通信媒体发展局宣布，通过第二轮数据中心申请暂定向四家运营商分配 200MW 新容量。每家获得 50MW，项目落在 Jurong Island，且“暂定”意味着仍要完成后续条件，而不是已经送电或开始计费。",
        "这 200MW 应与 2025 年 12 月启动 DC-CFA2 时的制度设计一起阅读。申请文件要求项目强化新加坡作为可信 AI 与数据中心枢纽的地位，带来创新、人才和生态贡献，并加速绿色能源使用；IT 设备还要达到或超过 SS 715:2025 的能效要求，同时通过客户协作提高设备利用率。",
        "所以，200MW 不是需求上限，也不是四个项目的运营容量。它是监管者愿意在现阶段分配的资源额度。项目从暂定分配到建设、送电、IT 部署和收入确认，仍有一条很长的转换链。",
      ],
      sections: [
        {
          label: "01 · ALLOCATION",
          heading: "四个 50MW 名额，首先是一张政策选择表",
          paragraphs: [
            "平均分配并不意味着项目价值完全相同。50MW 只是每家被允许推进的容量边界，运营商仍需在设计、客户、能源采购和施工进度上竞争。监管者通过小批量释放容量，保留了根据项目兑现情况调整下一轮供给的权力。",
            "这种机制改变了开发商的期权价值。在传统市场，开发商可以把已控土地和潜在电力包装成远期管线；在新加坡，稀缺资源先由政策筛选，未满足效率和产业贡献的方案即使有资本也无法自然转化为容量。",
          ],
          metrics: [
            { label: "暂定新增容量", value: "200MW", note: "DC-CFA2 总分配；不等于已建成或已送电容量。" },
            { label: "入选运营商", value: "4 家", note: "每家暂定 50MW，后续条件与交付仍需跟踪。" },
            { label: "项目地点", value: "Jurong Island", note: "工业岛带来电力与能源整合机会，也强化资源约束。" },
          ],
        },
        {
          label: "02 · ECONOMIC GATE",
          heading: "审批标准正在替新加坡挑选“什么样的 AI 需求”",
          paragraphs: [
            "DC-CFA2 没有把所有算力需求视为同质。战略价值、经济贡献和可持续性被放进同一评分框架，意味着低附加值、低利用率的纯托管负载会面对更高解释成本；能够带来区域总部、研发、模型服务、网络互联和人才投入的客户更有优势。",
            "SS 715:2025 和利用率要求同样关键。监管者不仅关心 PUE，还要求运营商关注服务器与存储设备本身的效率以及用户实际利用。这样，节能责任从建筑侧延伸到 IT 采购和客户调度，运营商需要用合同、计量和平台能力证明效率，而不是只提交一张设计图。",
            "这会推高优质客户的重要性。一个拥有明确 AI 工作负载、长期用量和可迁移调度能力的客户，可以帮助运营商证明公共资源不会被闲置；反过来，缺少终端需求的投机项目更难通过下一轮审查。",
          ],
          cards: [
            { label: "POWER", title: "绿色电力必须可追踪", body: "新增容量与新的绿色能源路径挂钩，证书、合同与实际供电结构需要分开核验。" },
            { label: "IT", title: "效率深入服务器层", body: "设备标准与利用率要求使运营商必须管理客户侧 IT 效率，而不仅是设施 PUE。" },
            { label: "ECONOMY", title: "容量换产业贡献", body: "研发、人才、区域连接和 AI 服务价值成为稀缺电力的竞争变量。" },
          ],
        },
        {
          label: "03 · CONVERSION CHAIN",
          heading: "从暂定 50MW 到可计费 50MW，至少还要跨过五道门",
          paragraphs: [
            "第一是分配条件落地，第二是土地与设计审批，第三是绿色能源和电网方案，第四是建设与设备交付，第五才是客户验收和计费。任何一环延迟，都会让新闻标题中的 50MW 停留在政策容量，而非运营容量。",
            "对上市运营商而言，资本支出可能先发生，收入却按机房和客户分期上线。投资者应区分政府分配、签署电力协议、开工、送电、IT ready、客户装机和收入确认，不应把其中任一节点直接乘以市场租金。",
          ],
          steps: [
            { title: "暂定分配", body: "监管允许项目继续推进，但仍保留条件和撤回空间。" },
            { title: "能源与许可", body: "绿色电力路径、并网和环境要求决定项目能否进入施工。" },
            { title: "设施交付", body: "建筑、冷却、配电和网络需要达到设计与验收标准。" },
            { title: "客户转化", body: "只有客户装机、验收并开始计费，容量才成为收入。" },
          ],
        },
        {
          label: "04 · ANALYST WATCH",
          heading: "下一步不看总量故事，盯四类兑现证据",
          paragraphs: [
            "第一，四家运营商分别承诺了什么能源组合；第二，项目是否披露明确客户和 AI 工作负载；第三，50MW 是设施总功率还是关键 IT 负荷；第四，工程节点是否出现可验证日期。只有这些信息齐备，才能比较各项目的经济性。",
            "更长远看，新加坡提供了一种可复制的监管模板：不是全面禁止数据中心，也不是无条件放开，而是用小批量容量换取更高质量的项目。如果该机制运行顺利，东京、首尔、都柏林和美国电力紧张地区都可能采用更强的项目排序与成本归属规则。",
          ],
        },
      ],
      conclusion: "200MW 的核心信号是容量定价权回到了拥有电网与许可权的公共部门。运营商只有把能源、效率、客户和本地价值组织成一套可审计的交付方案，才可能把暂定配额变成长期现金流。",
      disclosure: "资料截止 2026 年 8 月 23 日（北京时间）。200MW 与四个 50MW 均为政府暂定分配，不代表项目已开工、已送电、已装机或已产生收入。",
    },
    en: {
      hero: "Singapore has not reopened an unlimited growth corridor. It provisionally released 200MW and tied each 50MW award to green power, IT efficiency, AI economic value and execution. Capacity is becoming a scarce public license that must keep proving its return, not a commodity secured first and filled later.",
      thesis: "DC-CFA2 matters less for the operator list than for the policy architecture. Singapore has turned data-center approval into an industrial-policy instrument. In power-constrained markets, the winning project will combine deliverable electricity, auditable efficiency, credible customers and local economic contribution.",
      opening: [
        "On August 21, 2026, Singapore's Economic Development Board and Infocomm Media Development Authority said four operators had received provisional allocations totaling 200MW under the second data-center call for application. Each received 50MW at Jurong Island. Provisional allocation is not energization, IT installation or billing.",
        "The result should be read with the rules published when DC-CFA2 opened in December 2025. Applicants were asked to strengthen Singapore as a trusted AI and data-center hub, contribute innovation, talent and ecosystem investment, and accelerate green energy. IT equipment must meet or exceed SS 715:2025 efficiency standards, while operators must work with users to improve equipment utilization.",
        "The 200MW is therefore neither a demand ceiling nor operating capacity. It is the amount of scarce resource the government is willing to allocate at this stage. A long conversion chain remains between selection and revenue.",
      ],
      sections: [
        {
          label: "01 · ALLOCATION", heading: "Four equal awards form a policy-selection table first",
          paragraphs: [
            "Equal 50MW awards do not make the projects economically identical. They set a boundary within which each operator still competes on design, customer mix, energy procurement and construction. Small-batch allocation preserves the regulator's ability to condition future supply on actual delivery.",
            "That changes the option value of development. In an open market, controlled land and prospective power can be marketed as pipeline. In Singapore, public screening comes first. Capital alone cannot convert a low-efficiency or low-contribution plan into permitted capacity.",
          ],
          metrics: [
            { label: "Provisional capacity", value: "200MW", note: "Total DC-CFA2 allocation, not built or energized load." },
            { label: "Selected operators", value: "4", note: "Each provisionally receives 50MW, subject to delivery conditions." },
            { label: "Location", value: "Jurong Island", note: "An industrial-energy cluster with both integration advantages and resource constraints." },
          ],
        },
        {
          label: "02 · ECONOMIC GATE", heading: "The process is selecting which AI demand deserves scarce power",
          paragraphs: [
            "DC-CFA2 does not treat every compute workload as equal. Strategic value, broader economic contribution and sustainability sit in one assessment. Low-utilization commodity hosting faces a higher burden of proof than workloads that bring regional operations, R&D, model services, connectivity and skilled employment.",
            "SS 715:2025 and utilization requirements are equally consequential. The government is looking beyond facility PUE into server and storage efficiency and customer use. Operators will need contracts, measurement and platform controls to demonstrate efficiency, not merely an efficient design drawing.",
            "Credible customers therefore become part of the permit case. A buyer with identifiable AI workloads, long-duration use and flexible scheduling helps an operator show that scarce public resources will not sit idle. Speculative capacity without end demand becomes harder to justify.",
          ],
          cards: [
            { label: "POWER", title: "Green power must be traceable", body: "Certificates, commercial contracts and the physical supply mix should be verified separately." },
            { label: "IT", title: "Efficiency reaches the server layer", body: "Equipment standards and utilization make customer-side IT performance part of the operator's case." },
            { label: "ECONOMY", title: "Capacity is exchanged for contribution", body: "R&D, talent, regional connectivity and AI services compete for scarce electricity." },
          ],
        },
        {
          label: "03 · CONVERSION CHAIN", heading: "At least five gates remain between 50MW awarded and 50MW billable",
          paragraphs: [
            "Allocation conditions, land and design approvals, energy and grid arrangements, construction and equipment delivery, and customer acceptance all remain. A delay at any gate leaves the headline 50MW as policy capacity rather than operating capacity.",
            "For listed operators, capital spending can arrive well before revenue. Investors should separate government allocation, power contract, groundbreaking, energization, IT readiness, customer installation and revenue recognition. None should be multiplied directly by a market rent.",
          ],
          steps: [
            { title: "Provisional allocation", body: "The project may proceed, but conditions and withdrawal risk remain." },
            { title: "Energy and permits", body: "Green-power pathways, grid arrangements and environmental rules determine construction readiness." },
            { title: "Facility delivery", body: "Buildings, cooling, distribution and networks must pass design and acceptance tests." },
            { title: "Customer conversion", body: "Capacity becomes revenue only after installation, acceptance and billing." },
          ],
        },
        {
          label: "04 · ANALYST WATCH", heading: "The next evidence is project-specific, not another aggregate target",
          paragraphs: [
            "Watch the energy mix each operator commits, whether identifiable AI customers appear, whether 50MW means facility load or critical IT load, and whether construction milestones gain verifiable dates. Those four disclosures are necessary for project economics.",
            "Singapore also offers a regulatory template: neither a blanket moratorium nor unrestricted building, but staged capacity in exchange for better projects. If it works, other constrained markets may adopt stronger project ranking and cost-allocation rules.",
          ],
        },
      ],
      conclusion: "The central signal is that pricing power over capacity has moved back to institutions controlling grids and permits. Operators must assemble energy, efficiency, customer demand and local value into an auditable delivery plan before a provisional award becomes durable cash flow.",
      disclosure: "Cutoff: August 23, 2026, Beijing time. The 200MW total and four 50MW awards are provisional government allocations, not evidence of construction, energization, installation or revenue.",
    },
  }),
  record({
    slug: "ports-pike-8gw-risk-stack",
    imageAltZh: "俄亥俄超大型 AI 园区、变电站、建设分期与资本结构的剖面",
    imageAltEn: "Cutaway of an Ohio hyperscale AI campus, substations, phased construction and capital stack",
    articleSectionZh: "AI 园区融资与风险分配",
    articleSectionEn: "AI campus finance and risk allocation",
    topics: ["NVIDIA", "OpenAI", "SB Energy", "PORTS-Pike", "8GW", "project finance"],
    sources: [
      primary("https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute", "NVIDIA 与 SB Energy 的 PORTS-Pike 公告", "NVIDIA and SB Energy PORTS-Pike announcement"),
      primary("https://sbenergy.com/nvidia-ai-compute-ports-pike-ohio/", "SB Energy 的 PORTS-Pike 公告", "SB Energy PORTS-Pike announcement"),
    ],
    zh: {
      hero: "8 IT-GW 看起来像一张超级订单，实质上是一套分层风险结构：OpenAI 提供终端需求，NVIDIA 提供平台与信用支持，SB Energy 负责土地、电力和外壳，资本市场为漫长建设期定价。最大的数字不是收入，而是尚未完成的义务。",
      thesis: "PORTS-Pike 把 NVIDIA 从设备供应商推向容量组织者。它通过信用支持锁定初期 4.25 IT-GW，并拥有余下 3.75 IT-GW 选择权；OpenAI 被列为 8 IT-GW 客户。这个安排提高项目可融资性，也把客户集中、完工、残值与信用传染风险连到同一平台。",
      opening: [
        "NVIDIA 与 SB Energy 在 8 月 17 日的共同公告中给出一组前所未有的结构化数字：PORTS-Pike 计划容纳 8 IT-GW NVIDIA 算力；NVIDIA 为最初 4.25 IT-GW 的土地、电力和外壳建设提供信用支持，并可选择剩余 3.75 IT-GW；OpenAI 是 8 IT-GW 的客户；NVIDIA 还将向 SB Energy 投资 15 亿美元。",
        "公告确认了主体和目标，却没有披露信用支持形式、建设总成本、客户付款义务、租期、分期送电表、融资利率、担保触发条件或退出机制。专业分析不能把这些空白补成确定性合同。",
        "8 IT-GW 也不是园区总取电。IT 负荷之外还有冷却、配电损耗、网络和辅助设施。即使采用较低 PUE，物理电力需求也会高于 8GW；而且容量将在多年内分期形成，不能被当作单一时点的运行规模。",
      ],
      sections: [
        {
          label: "01 · CONTRACT MAP", heading: "先看四个主体分别承诺了什么",
          paragraphs: [
            "OpenAI 的位置是需求端，但公告没有给出它是直接承租人、算力购买方还是通过其他平台采购。NVIDIA 是独家 AI 计算基础设施供应商，同时以信用支持帮助 LPS 建设融资。SB Energy 控制项目开发与土地、电力、外壳。最终贷款人和基础设施投资者则承担建设期与结构性风险。",
            "这种分工让项目更容易启动。设备供应商的资产负债表和平台锁定降低融资人对空置风险的担忧，终端客户名称提高需求可信度，开发商可以更早采购土地、电网和建筑。但同一结构也会把任何一方的延迟传导给其他参与者。",
          ],
          metrics: [
            { label: "计划 IT 容量", value: "8GW", note: "目标规模，不是当前运营负荷或已交付容量。" },
            { label: "初期信用支持", value: "4.25GW", note: "支持土地、电力和外壳建设；条款未公开。" },
            { label: "后续选择权", value: "3.75GW", note: "NVIDIA 可选择取得，不能视为已承诺。" },
            { label: "NVIDIA 投资", value: "15 亿美元", note: "支持 SB Energy 增长与社区承诺，不等于园区总资本。" },
          ],
        },
        {
          label: "02 · CREDIT", heading: "NVIDIA 提供的不是 5000 亿美元现金，而是融资可见度",
          paragraphs: [
            "信用支持的价值在于改变贷款人看到的风险。如果土地、电力和外壳建设背后有高信用质量的技术平台承诺，项目融资成本可能下降，提款条件可能更容易满足。但公告没有说明支持是担保、租赁义务、容量承诺、回购安排还是其他形式，因此不能计算 NVIDIA 的最大损失。",
            "这与此前“动员第三方资本”的平台逻辑一致：NVIDIA 不需要自己支付全部建设成本，也能帮助客户和开发商锁定容量。其回报可能来自 GPU、网络、软件、服务和平台排他性，而风险则通过信用支持、股权投资和客户关系回到资产负债表。",
            "多头看到的是更高的建设兑现率和独家平台收入；空头看到的是循环融资与尾部信用风险。两种解释可以同时成立，关键取决于客户是否持续付费、资产是否按期交付以及担保是否被触发。",
          ],
          cards: [
            { label: "DEMAND", title: "OpenAI 需求承诺", body: "客户名称提高融资可信度，但付款、期限和最低用量仍未公开。" },
            { label: "PLATFORM", title: "NVIDIA 独家供货", body: "排他性把 GPU、网络和软件收入锁进同一园区，也提高单一平台集中度。" },
            { label: "DEVELOPER", title: "SB Energy 交付 LPS", body: "土地、电力和外壳是前置资产，工期与成本超支先在项目层暴露。" },
            { label: "CAPITAL", title: "贷款人与基金定价", body: "融资人需要判断完工、客户集中、担保边界与技术残值。" },
          ],
        },
        {
          label: "03 · DELIVERY", heading: "8GW 必须被拆成一系列可验收的容量批次",
          paragraphs: [
            "一个 8 IT-GW 园区不会一次上线。每个批次都需要电源、变电、建筑、冷却、机架、网络和加速器同步。公告中的选择权说明后半段容量仍带有条件，早期批次的成本和运行结果可能决定后续扩张。",
            "真正的收入节奏取决于 acceptance，而不是 headline。开发商可能在建设期确认有限收入，NVIDIA 设备收入取决于系统交付，OpenAI 的费用取决于可用算力，债务偿付则依赖合同现金流。四条曲线不会自动同步。",
          ],
          steps: [
            { title: "LPS 锁定", body: "土地、电力与建筑壳体进入可融资、可施工状态。" },
            { title: "设施验收", body: "变电、配电和冷却达到目标冗余与负载。" },
            { title: "平台部署", body: "NVIDIA 系统与网络完成安装、调试和可用性测试。" },
            { title: "客户计费", body: "OpenAI 接受容量并开始承担合同现金流。" },
          ],
        },
        {
          label: "04 · FALSIFIABLE CHECKS", heading: "下一阶段需要六项公开证据",
          paragraphs: [
            "应依次追踪信用支持法律形式、OpenAI 最低付款义务、每批 MW 和日期、项目融资规模与利率、设施总负荷与 IT 负荷差异、以及余下 3.75GW 选择权何时行使。缺少这些字段，任何收入或估值模型都只是情景分析。",
            "如果早期 4.25GW 获得低成本融资并按期上线，NVIDIA 会证明自己能用信用和平台优势压缩 AI 园区的资本成本；如果送电、融资或客户承诺延迟，市场则会重新定价供应商参与项目融资的风险。",
          ],
        },
      ],
      conclusion: "PORTS-Pike 不是 NVIDIA 自掏 8GW 的钱，也不只是 OpenAI 下单。它是一套把需求、平台、建设和信用拼成可融资资产的结构。最重要的后续读数是每一批真正验收并开始付费的 IT MW。",
      disclosure: "资料截止 2026 年 8 月 23 日（北京时间）。公告未披露信用支持、客户合同、融资与交付的完整条款；8 IT-GW、4.25GW 与 3.75GW 均为前瞻规模，不代表当前运营容量。",
    },
    en: {
      hero: "Eight IT gigawatts looks like a single giant order. It is actually a layered risk structure: OpenAI supplies end demand, NVIDIA supplies the platform and credit support, SB Energy develops land, power and shell, and capital markets price a long construction period. The largest number describes obligations still to be completed, not revenue already earned.",
      thesis: "PORTS-Pike moves NVIDIA from equipment vendor toward capacity organizer. It provides credit support for the initial 4.25 IT-GW and holds an option on the remaining 3.75 IT-GW, while OpenAI is named as customer for the full 8 IT-GW. The structure improves financeability but connects customer concentration, completion, residual value and credit contagion.",
      opening: [
        "The August 17 announcement from NVIDIA and SB Energy disclosed an unusual structure. PORTS-Pike is planned for 8 IT-GW of NVIDIA compute. NVIDIA will provide credit support for land, power and shell supporting the initial 4.25 IT-GW and may take the remaining 3.75 IT-GW. OpenAI is named as the customer for 8 IT-GW. NVIDIA will also invest $1.5 billion in SB Energy.",
        "The announcement identifies parties and targets but does not disclose the form of credit support, total project cost, customer payment obligations, term, phased energization schedule, financing rate, guarantee triggers or exit mechanics. Those blanks cannot be converted into contractual certainty.",
        "Eight IT-GW is not total campus draw. Cooling, electrical losses, networking and auxiliary systems sit above IT load. Even at a relatively low PUE, physical demand exceeds 8GW, and capacity will be phased over years rather than operating at one point in time.",
      ],
      sections: [
        {
          label: "01 · CONTRACT MAP", heading: "Four parties make four different commitments",
          paragraphs: [
            "OpenAI sits at the demand end, but the announcement does not say whether it is a direct tenant, a compute buyer or a customer through another platform. NVIDIA is the exclusive AI infrastructure provider and supports LPS finance. SB Energy controls project development. Lenders and infrastructure investors ultimately price construction and structural risk.",
            "The division accelerates a project. A technology platform's balance sheet and exclusivity reduce vacancy concerns, a named end customer improves demand credibility, and the developer can commit earlier to land, grid and construction. It also transmits a delay by any one participant to all others.",
          ],
          metrics: [
            { label: "Planned IT capacity", value: "8GW", note: "Target scale, not current operating or delivered load." },
            { label: "Initial credit support", value: "4.25GW", note: "Supports land, power and shell; legal terms are undisclosed." },
            { label: "Later option", value: "3.75GW", note: "NVIDIA may take it; it is not a firm commitment today." },
            { label: "NVIDIA investment", value: "$1.5B", note: "Supports SB Energy and community commitments, not total campus capital." },
          ],
        },
        {
          label: "02 · CREDIT", heading: "NVIDIA is supplying financeability, not writing every construction check",
          paragraphs: [
            "Credit support changes a lender's risk view. If land, power and shell are backed by a high-quality technology platform, borrowing costs may fall and draw conditions may become easier. Yet the announcement does not identify a guarantee, lease obligation, capacity commitment, repurchase or another mechanism, so maximum NVIDIA exposure cannot be calculated.",
            "This extends the company's third-party capital mobilization logic. NVIDIA need not fund every asset to help customers and developers reserve capacity. The return can come through GPUs, networking, software, services and platform exclusivity. Exposure returns through credit support, equity investment and customer concentration.",
            "The bullish reading is a higher probability of construction and exclusive platform revenue. The bearish reading is circular financing and tail credit risk. Both can be true; the resolution depends on customer payments, delivery and whether support is ever called.",
          ],
          cards: [
            { label: "DEMAND", title: "OpenAI commitment", body: "A named customer improves credibility, while payment, duration and minimum use remain undisclosed." },
            { label: "PLATFORM", title: "NVIDIA exclusivity", body: "GPU, network and software revenue are bundled, increasing platform concentration." },
            { label: "DEVELOPER", title: "SB Energy delivers LPS", body: "Land, power and shell carry early construction and cost-overrun exposure." },
            { label: "CAPITAL", title: "Lenders set the price", body: "Finance depends on completion, concentration, support boundaries and technology residual value." },
          ],
        },
        {
          label: "03 · DELIVERY", heading: "Eight gigawatts must become a sequence of accepted tranches",
          paragraphs: [
            "An 8 IT-GW campus cannot switch on at once. Every tranche requires synchronized generation, substations, buildings, cooling, racks, networking and accelerators. The option on the later 3.75GW shows that conditions remain; early cost and performance can determine later expansion.",
            "Revenue follows acceptance, not the headline. Developer revenue, NVIDIA equipment delivery, OpenAI usage fees and debt service follow different curves. They do not become synchronized because they appear in one announcement.",
          ],
          steps: [
            { title: "LPS secured", body: "Land, power and shell reach financeable and buildable status." },
            { title: "Facility accepted", body: "Substations, distribution and cooling achieve required redundancy and load." },
            { title: "Platform deployed", body: "NVIDIA systems and networks pass installation and availability testing." },
            { title: "Customer billed", body: "OpenAI accepts capacity and begins supporting contractual cash flow." },
          ],
        },
        {
          label: "04 · FALSIFIABLE CHECKS", heading: "Six disclosures will determine whether the structure works",
          paragraphs: [
            "Track the legal form of credit support, OpenAI minimum payments, MW and dates for each tranche, project-finance size and pricing, facility-versus-IT load, and exercise of the 3.75GW option. Without those fields, revenue and valuation remain scenarios.",
            "Low-cost finance and on-time delivery of the first 4.25GW would show that NVIDIA can use credit and platform power to lower campus capital costs. A delay in power, funding or customer commitment would force the market to reprice supplier participation in project finance.",
          ],
        },
      ],
      conclusion: "PORTS-Pike is neither NVIDIA paying for 8GW itself nor a simple OpenAI purchase order. It assembles demand, platform, construction and credit into a financeable asset. The decisive evidence will be each IT megawatt accepted and paid for.",
      disclosure: "Cutoff: August 23, 2026, Beijing time. Complete credit-support, customer, financing and delivery terms are not public. The 8 IT-GW, 4.25GW and 3.75GW figures are forward-looking, not current operating capacity.",
    },
  }),
  record({
    slug: "nvidia-fy27-q2-five-tests",
    imageAltZh: "NVIDIA AI 工厂从芯片、网络、服务器到电力园区的分析师仪表剖面",
    imageAltEn: "Analyst cutaway of an NVIDIA AI factory from chips and networking to servers and power campus",
    articleSectionZh: "AI 芯片财报前瞻",
    articleSectionEn: "AI semiconductor earnings preview",
    topics: ["NVIDIA", "earnings", "Blackwell", "networking", "gross margin", "AI factories"],
    sources: [
      primary("https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx", "NVIDIA FY2027 Q1 官方业绩", "NVIDIA FY2027 Q1 results"),
      primary("https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Second-Quarter-Financial-Results/default.aspx", "NVIDIA FY2027 Q2 财报时间公告", "NVIDIA FY2027 Q2 earnings-call notice"),
      primary("https://nvidianews.nvidia.com/news/nvidia-guarantees-sb-energy-s-ports-pike-technology-campus-in-ohio-to-exclusively-host-nvidia-ai-compute", "NVIDIA PORTS-Pike 公告", "NVIDIA PORTS-Pike announcement"),
    ],
    zh: {
      hero: "NVIDIA 将在北京时间 8 月 27 日清晨公布 FY2027 Q2。收入是否再创新高当然重要，但决定估值持续性的，是五条转换链能否同时成立：芯片变成整机、网络跟上计算、毛利率守住、客户融到钱、园区按时得到电。",
      thesis: "Q1 的 816 亿美元收入和 752 亿美元数据中心收入把基线抬得极高。Q2 的核心问题不再是 AI 需求是否存在，而是 NVIDIA 能否在更大规模上管理产品切换、供应链、融资和项目交付。单一收入超预期不足以证明整个系统没有形成新瓶颈。",
      opening: [
        "NVIDIA 已确认将在美国西部时间 8 月 26 日 13:20 左右发布 FY2027 Q2 业绩，并于 14:00 举行电话会。换算到北京时间，正式数据将在 8 月 27 日清晨出现。因此本文是事件前的验证框架，不包含尚未公布的 Q2 数字。",
        "可比基线来自 Q1：总收入 816.15 亿美元，环比增长 20%、同比增长 85%；数据中心收入 752 亿美元，其中计算 604 亿美元、网络 148 亿美元；非 GAAP 毛利率 75.0%；经营现金流 503.44 亿美元，自由现金流 485.54 亿美元。",
        "这些数字证明需求与盈利能力，但也改变了判断门槛。随着 NVIDIA 开始为超大型园区提供信用支持并参与第三方资本平台，公司的经济边界正从芯片毛利延伸到客户融资和基础设施兑现。",
      ],
      sections: [
        {
          label: "01 · PRODUCT CONVERSION", heading: "第一项验证：Blackwell 交付是否转成可持续平台收入",
          paragraphs: [
            "产品周期的真正风险不只是缺货，而是系统切换。新一代 GPU 需要与 CPU、交换机、光模块、机架、电源和液冷同步；如果任一环节延迟，客户可能已经下单却无法形成可用集群。Q2 应关注出货结构、系统收入和客户上线节奏，而不是只听“需求强劲”。",
            "另一个变量是旧代产品。旧 GPU 仍可能在推理、微调和较低成本场景中保有价值，但生命周期取决于电力效率、维护、软件支持和替代价格。除非公司给出具体 SKU 和收入拆分，不应把市场线索直接当作旧代产品已经锁定多年收入。",
          ],
          metrics: [
            { label: "Q1 总收入", value: "$81.6B", note: "FY2027 Q1 官方口径；Q2 需在更高基线上增长。" },
            { label: "Q1 数据中心", value: "$75.2B", note: "占收入绝大部分，放大平台执行的重要性。" },
            { label: "计算 / 网络", value: "$60.4B / $14.8B", note: "网络增速和收入比例是系统化销售的重要证据。" },
          ],
        },
        {
          label: "02 · NETWORK AND MARGIN", heading: "第二、三项验证：网络能否保持同步，毛利率是否仍有质量",
          paragraphs: [
            "Q1 网络收入同比增长 199%，快于计算。这个结构说明大型 AI 工厂的价值正从单卡扩展到互联、交换和系统。若 Q2 网络继续快于或接近计算增长，平台份额更可信；若明显掉队，则可能意味着客户在网络方案上出现替代或系统交付不均衡。",
            "毛利率要与产品切换、库存和一次性项目一起读。75% 的非 GAAP 毛利率提供强大缓冲，但更大规模的整机、服务和信用支持可能改变收入组合。分析师应把价格、产品结构、供应成本、库存减值和项目支持分开，不能只用一个百分点判断竞争力。",
          ],
          cards: [
            { label: "NETWORK", title: "系统附加率", body: "网络收入与计算收入的相对速度，揭示 NVIDIA 是否仍在扩大平台价值。" },
            { label: "MARGIN", title: "毛利率桥梁", body: "产品组合、供应成本与一次性项目应分别解释，避免把结构变化误判为降价。" },
            { label: "CASH", title: "现金转换", body: "经营现金流和应收、库存变化决定利润是否同步转成可用资本。" },
          ],
        },
        {
          label: "03 · CUSTOMER FINANCE", heading: "第四项验证：客户的融资能力是否开始进入 NVIDIA 风险表",
          paragraphs: [
            "PORTS-Pike 显示 NVIDIA 为初期 4.25 IT-GW 土地、电力和外壳提供信用支持，并向 SB Energy 投资 15 亿美元。公司还与大型资本管理机构建立第三方融资平台。它不等于 NVIDIA 自己支付全部 CAPEX，却意味着供应商正在帮助需求转化为可融资项目。",
            "电话会需要回答的不是“资本是否充足”这句口号，而是信用支持的规模、会计处理、触发条件和回报。若客户必须依赖更多私人信贷、基础设施基金和 SPV，融资成本会成为 GPU 需求的新敏感变量。",
          ],
          steps: [
            { title: "客户承诺", body: "模型公司或云商形成长期算力需求，但不等于即时收入。" },
            { title: "项目融资", body: "贷款人根据合同、担保、完工和残值决定资本成本。" },
            { title: "系统交付", body: "GPU、网络和设施按批次验收后，供应商收入才兑现。" },
            { title: "终端现金流", body: "客户最终需要用模型或云收入覆盖算力付款。" },
          ],
        },
        {
          label: "04 · POWER", heading: "第五项验证：订单能否跨过土地、电力和建设约束",
          paragraphs: [
            "NVIDIA 正在把“AI 工厂”从营销概念变成项目组合，但 GPU 制造节奏与园区送电节奏并不相同。即使订单和资金到位，变电站、燃气、输电、冷却和施工许可也可能延迟可用算力。",
            "最有信息量的披露将是已经通电、已安装、已验收和已计费的容量，而不是远期 GW 管线。若管理层能把订单、系统出货和客户上线联系起来，估值对超长期容量故事的依赖会下降；反之，市场会继续用融资和电网折现远期收入。",
          ],
        },
      ],
      conclusion: "这次财报的高质量答案不是一个更大的收入数字，而是一条更清楚的转换桥：晶圆和 HBM 进入系统，系统进入园区，园区进入客户工作负载，客户工作负载变成现金。五项验证越同步，NVIDIA 的平台溢价越可靠。",
      disclosure: "本文为财报前瞻，资料截止 2026 年 8 月 23 日（北京时间）。FY2027 Q2 尚未公布；文中所有 Q1 数字来自 NVIDIA 官方业绩，项目规模与信用支持为前瞻安排。",
    },
    en: {
      hero: "NVIDIA reports fiscal Q2 2027 early on August 27 Beijing time. Another revenue record matters, but durability depends on five conversion chains moving together: chips into systems, networking with compute, margins holding, customers financing commitments, and campuses receiving power.",
      thesis: "Q1 revenue of $81.6 billion and Data Center revenue of $75.2 billion set an exceptionally high base. Q2 is no longer a referendum on whether AI demand exists. It tests whether NVIDIA can manage product transition, supply, finance and physical delivery at a larger scale. A revenue beat alone cannot prove that the system has no new bottleneck.",
      opening: [
        "NVIDIA says it will release fiscal Q2 2027 results at about 1:20 p.m. Pacific on August 26 and hold its call at 2 p.m. That is early August 27 in Beijing. This is therefore a pre-event framework and contains no unpublished Q2 figures.",
        "The comparison base is Q1: revenue of $81.615 billion, up 20% sequentially and 85% year over year; Data Center revenue of $75.2 billion; compute of $60.4 billion and networking of $14.8 billion; non-GAAP gross margin of 75.0%; operating cash flow of $50.344 billion and free cash flow of $48.554 billion.",
        "Those figures establish demand and profitability while raising the burden of proof. As NVIDIA provides credit support to large campuses and participates in third-party financing platforms, its economic perimeter is expanding from silicon margin into customer finance and infrastructure execution.",
      ],
      sections: [
        {
          label: "01 · PRODUCT CONVERSION", heading: "Test one: Blackwell delivery must become durable platform revenue",
          paragraphs: [
            "The product-cycle risk is a system transition, not just chip scarcity. New GPUs must synchronize with CPUs, switches, optics, racks, power and liquid cooling. A delay anywhere can leave an ordered cluster unavailable. Q2 commentary should connect product mix and system revenue to customer go-live dates rather than repeat that demand is strong.",
            "Older GPUs are another variable. They can retain value in inference, tuning and lower-cost work, but longevity depends on power efficiency, maintenance, software support and replacement pricing. Without disclosed SKU and revenue detail, market chatter cannot establish multi-year old-generation economics.",
          ],
          metrics: [
            { label: "Q1 revenue", value: "$81.6B", note: "Official fiscal Q1 baseline; Q2 grows from a much higher level." },
            { label: "Q1 Data Center", value: "$75.2B", note: "Its dominant share magnifies platform execution." },
            { label: "Compute / network", value: "$60.4B / $14.8B", note: "Relative network growth is evidence of system-level selling." },
          ],
        },
        {
          label: "02 · NETWORK AND MARGIN", heading: "Tests two and three: networking keeps pace and margin quality holds",
          paragraphs: [
            "Q1 networking revenue rose 199% year over year, faster than compute. That mix shows value spreading from accelerators into interconnect and switching. Continued network momentum would support the platform thesis. A sharp divergence could signal alternative network architectures or uneven system delivery.",
            "Gross margin must be read through transition, inventory and one-time project effects. A 75% non-GAAP margin provides room, but larger system, service and credit-support activity can change mix. Price, supply cost, inventory charges and project support should be separated before competition is inferred from one percentage point.",
          ],
          cards: [
            { label: "NETWORK", title: "System attach", body: "Network growth relative to compute reveals whether platform value is still expanding." },
            { label: "MARGIN", title: "Margin bridge", body: "Mix, supply cost and project effects should be separated from price." },
            { label: "CASH", title: "Cash conversion", body: "Operating cash flow, receivables and inventory determine how much accounting profit becomes deployable capital." },
          ],
        },
        {
          label: "03 · CUSTOMER FINANCE", heading: "Test four: customer finance enters NVIDIA's risk perimeter",
          paragraphs: [
            "At PORTS-Pike, NVIDIA will support land, power and shell for the initial 4.25 IT-GW and invest $1.5 billion in SB Energy. It has also formed a third-party infrastructure financing platform. That is not NVIDIA paying every capital dollar, but it is the supplier helping demand become financeable projects.",
            "The useful call answer is not that capital is available. It is the size, accounting, trigger and return on credit support. If customers require more private credit, infrastructure funds and SPVs, financing cost becomes a new sensitivity for GPU demand.",
          ],
          steps: [
            { title: "Customer commitment", body: "A model company or cloud provider commits to compute, not immediate revenue." },
            { title: "Project finance", body: "Lenders price contracts, support, completion and residual value." },
            { title: "System delivery", body: "Supplier revenue follows phased acceptance of hardware and networks." },
            { title: "End cash flow", body: "Model and cloud revenue ultimately must fund compute payments." },
          ],
        },
        {
          label: "04 · POWER", heading: "Test five: orders cross land, power and construction constraints",
          paragraphs: [
            "NVIDIA is turning the AI-factory concept into a project portfolio, but semiconductor output and campus energization follow different clocks. Even funded orders can wait on substations, gas, transmission, cooling and permits.",
            "The most informative disclosure is energized, installed, accepted and billable capacity, not a distant gigawatt pipeline. A bridge from orders to systems and customer go-lives would reduce dependence on long-duration stories. Without it, the market will keep discounting future revenue through finance and grid risk.",
          ],
        },
      ],
      conclusion: "The highest-quality answer is not a larger revenue number but a clearer bridge: wafers and HBM become systems, systems enter campuses, campuses enter customer workloads, and workloads generate cash. The more synchronized the five tests, the more durable NVIDIA's platform premium.",
      disclosure: "This is an earnings preview with an August 23, 2026 Beijing-time cutoff. Fiscal Q2 results were not public at writing. Q1 figures are official NVIDIA disclosures; campus scale and credit support remain forward-looking.",
    },
  }),
  record({
    slug: "anthropic-compute-commitment-gap",
    imageAltZh: "概念体素插画：服务机房与分期算力底座之间的未接通桥梁，表现现金流与交付缺口",
    imageAltEn: "Conceptual voxel illustration of an unfinished bridge between a service pod and staged compute foundations, representing the cash-flow and delivery gap",
    articleSectionZh: "模型收入与算力承诺",
    articleSectionEn: "Model revenue and compute commitments",
    topics: ["Anthropic", "Claude", "AWS", "Google", "Broadcom", "SpaceX", "run-rate revenue"],
    sources: [
      primary("https://www.anthropic.com/news/series-h", "Anthropic Series H 融资与算力安排", "Anthropic Series H and compute commitments"),
      primary("https://www.anthropic.com/news/google-broadcom-partnership-compute", "Anthropic 与 Google、Broadcom 算力合作", "Anthropic Google-Broadcom compute partnership"),
      primary("https://www.anthropic.com/news/anthropic-amazon-compute", "Anthropic 与 Amazon 算力合作", "Anthropic Amazon compute partnership"),
      primary("https://www.anthropic.com/news/higher-limits-spacex", "Anthropic 使用 SpaceX Colossus 算力", "Anthropic use of SpaceX Colossus compute"),
    ],
    zh: {
      hero: "Anthropic 披露的收入运行率在半年内从约 90 亿美元跃升至超过 470 亿美元，同时签下 AWS 最高 5GW、Google 与 Broadcom 5GW，以及 SpaceX GPU 容量。需求与供给都在爆发，但两者之间仍缺合同期限、上线节奏、使用率、价格和现金流。",
      thesis: "运行率可以证明商业动量，GW 可以证明管理层愿意锁定远期供给；二者都不能单独证明单位经济性。专业判断需要构造一张 compute coverage ratio：把可验证收入、合同付款、已上线容量和远期容量按时间对齐，再测试每 GW 需要产生多少毛利和现金。",
      opening: [
        "Anthropic 在 4 月披露收入运行率超过 300 亿美元，高于 2025 年末约 90 亿美元；5 月 Series H 公告称运行率在当月早些时候已超过 470 亿美元。公司还说年化支出超过 100 万美元的企业客户从 2 月的 500 多家增至 1000 多家。",
        "同一阶段，Anthropic 披露与 Amazon 达成最高 5GW 新容量，与 Google 和 Broadcom 达成 5GW 下一代 TPU 容量，并使用 SpaceX Colossus 1 和 2 的 GPU；Amazon 仍是主要云和训练合作伙伴。把这些数字相加可以得到十余 GW 的组合，但不能得到同一时间点的可用功率。",
        "运行率不是季度收入，也不是 GAAP 指标。它通常将近期收入水平年化，容易放大快速增长期的退出速度。GW 则可能包含远期上限、分期交付和不同硬件平台。两类数据都需要转换，而不是直接相除。",
      ],
      sections: [
        {
          label: "01 · REVENUE QUALITY", heading: "470 亿美元首先要被拆成客户、价格与留存",
          paragraphs: [
            "企业大客户数量翻倍表明增长不完全来自单一客户，但外部仍不知道前十大客户占比、API 与订阅结构、折扣、算力转售比例和净留存。运行率可以方向性证明需求，却无法替代季度损益和现金流。",
            "Claude Code 和长任务代理可能提高每个客户的调用深度，也可能通过更高成功率降低重试。收入增长不能自动换算为 token 增长，更不能进一步换算为 GPU 或 MW。定价、缓存、模型路由、推理效率和工作负载结构会改变每一层转换。",
          ],
          metrics: [
            { label: "2025 年末运行率", value: "约 $9B", note: "Anthropic 公司披露的年化口径。" },
            { label: "2026 年 4 月", value: ">$30B", note: "Google/Broadcom 合作公告中的运行率。" },
            { label: "2026 年 5 月", value: ">$47B+", note: "Series H 公告；不是季度收入或利润。" },
            { label: "高价值企业客户", value: "1,000+", note: "年化支出超过 100 万美元；客户集中度仍未披露。" },
          ],
        },
        {
          label: "02 · COMPUTE PORTFOLIO", heading: "多平台不是重复采购，而是供应与工作负载的组合保险",
          paragraphs: [
            "AWS Trainium、Google TPU 与 NVIDIA GPU 的价值不仅是性能差异。多平台可以降低单一供应商和单一区域风险，让训练、推理和客户云分发在不同环境运行。代价是编译、内核、网络、调度和运维需要跨平台适配。",
            "Amazon 的最高 5GW 和 Google/Broadcom 的 5GW 都是未来容量安排，SpaceX 则提供已有 Colossus 集群的访问。它们可能在年份、地区和任务类型上重叠或互补。因此“十余 GW”应被视为组合上限与路径图，不是今天同时满载的设施。",
          ],
          cards: [
            { label: "AWS", title: "主要训练伙伴", body: "最高 5GW 新容量把 Trainium 与长期云关系绑定，实际交付仍按项目分期。" },
            { label: "GOOGLE", title: "下一代 TPU", body: "5GW 计划从 2027 年开始形成，强调价格性能与平台多元化。" },
            { label: "SPACEX", title: "GPU 访问", body: "Colossus 提供不同平台和较快容量路径，但合同容量与价格未完整公开。" },
          ],
        },
        {
          label: "03 · CASH-FLOW BRIDGE", heading: "收入覆盖算力承诺，需要一张四层时间表",
          paragraphs: [
            "第一层是客户收入：何时签约、何时调用、何时回款。第二层是云和芯片合同：最低购买、预付款、租赁和可取消条件。第三层是容量上线：土地、电力、建筑、设备和验收。第四层是融资：股权、战略投资、债务和合作伙伴资产负担。",
            "Series H 的 650 亿美元融资提高了流动性缓冲，且包含来自超大规模云商的战略投资；它不等于未来所有算力成本已经覆盖。若容量承诺先于收入回款，Anthropic 仍需要资本市场或供应商承担时间差。",
            "一个有用但目前无法精确计算的指标是 compute coverage ratio：可持续毛利现金流除以未来十二个月不可取消算力付款。没有合同和成本披露，外部只能做范围情景，不能给出确定倍数。",
          ],
          steps: [
            { title: "客户运行率", body: "近期商业活动年化，先检验集中度、留存与回款。" },
            { title: "合同承诺", body: "区分最高容量、最低付款、选择权与可取消条款。" },
            { title: "可用容量", body: "只有上线并通过验收的集群可以承接收入。" },
            { title: "现金覆盖", body: "毛利现金与融资共同覆盖预付款、租赁和服务费。" },
          ],
        },
        {
          label: "04 · BULL AND BEAR", heading: "融资瓶颈与循环融资叙事，都需要可证伪条件",
          paragraphs: [
            "多头情景是：企业代理任务带来高价值收入，单位 GW 收入显著高于算力租赁与运营成本，因此最优策略是尽快融资和建设。此时资本而非终端需求限制增长，多平台采购降低供给风险。",
            "空头情景是：运行率高估稳定收入，客户集中或价格竞争压低毛利，巨额算力承诺依赖云商投资和供应商融资，最终形成相互持股与采购的循环。此时利用率或融资成本上升会迅速放大现金缺口。",
            "证伪点很明确：季度收入和现金回款、客户集中度、每个平台已上线 MW、不可取消付款、推理毛利和续约。只要这些指标逐步公开，就能把叙事转成可检验模型。",
          ],
        },
      ],
      conclusion: "Anthropic 最强的信号不是一个单独的 470 亿美元或 5GW，而是收入、融资和多平台容量同时加速。最重要的缺口也因此更清楚：公司必须证明远期算力承诺能够被稳定毛利和现金覆盖，而不是只被下一轮融资覆盖。",
      disclosure: "资料截止 2026 年 8 月 23 日（北京时间）。Anthropic 为私有公司；运行率、客户数和容量均来自公司公告。运行率不等于季度收入，容量上限不等于已上线或满载 MW。",
    },
    en: {
      hero: "Anthropic's disclosed run-rate rose from about $9 billion to more than $47 billion within half a year while it arranged up to 5GW with AWS, 5GW with Google and Broadcom, and GPU access from SpaceX. Demand and supply are both accelerating, but contract duration, delivery, utilization, pricing and cash flow remain missing.",
      thesis: "Run-rate demonstrates commercial momentum and gigawatt commitments show management's willingness to reserve future supply. Neither proves unit economics. A professional framework needs a compute coverage ratio: align verifiable revenue, contractual payments, live capacity and future capacity over time, then test the gross profit and cash required per gigawatt.",
      opening: [
        "Anthropic said in April that run-rate revenue exceeded $30 billion, up from about $9 billion at the end of 2025. Its May Series H announcement said the figure had crossed $47 billion earlier that month. It also said customers spending more than $1 million annualized had risen from more than 500 in February to more than 1,000.",
        "Over the same period, Anthropic disclosed up to 5GW of new Amazon capacity, 5GW of next-generation TPU capacity with Google and Broadcom, and access to GPU capacity at SpaceX Colossus 1 and 2. Amazon remains its primary cloud and training partner. Adding the numbers produces a portfolio above ten gigawatts, not capacity simultaneously available today.",
        "Run-rate is neither quarterly revenue nor GAAP. It usually annualizes a recent activity level and can magnify exit velocity in a rapid-growth period. Gigawatts may be future ceilings, phased delivery and different hardware platforms. Both sets of figures require conversion before they are compared.",
      ],
      sections: [
        {
          label: "01 · REVENUE QUALITY", heading: "$47 billion must be decomposed into customer, price and retention",
          paragraphs: [
            "The doubling of large enterprise accounts indicates breadth beyond one customer, but outsiders still lack top-ten concentration, API-versus-subscription mix, discounts, compute-resale share and net retention. Run-rate supports demand directionally; it does not replace quarterly P&L and cash flow.",
            "Claude Code and long-running agents may increase workload depth, while better success rates may reduce retries. Revenue growth cannot be mapped directly to tokens and then to GPUs or MW. Pricing, caching, model routing, inference efficiency and workload mix change each conversion.",
          ],
          metrics: [
            { label: "End-2025 run-rate", value: "~$9B", note: "Company-disclosed annualized measure." },
            { label: "April 2026", value: ">$30B", note: "Disclosed with the Google-Broadcom partnership." },
            { label: "May 2026", value: ">$47B", note: "Series H disclosure; not quarterly revenue or profit." },
            { label: "Large enterprise accounts", value: "1,000+", note: ">$1M-plus annualized spend; concentration remains undisclosed." },
          ],
        },
        {
          label: "02 · COMPUTE PORTFOLIO", heading: "Multi-platform compute is supply and workload insurance, not duplication",
          paragraphs: [
            "AWS Trainium, Google TPU and NVIDIA GPU differ in more than performance. A portfolio reduces vendor and regional concentration and distributes training, inference and customer-cloud delivery. It also requires compiler, kernel, network, scheduler and operational work across platforms.",
            "The Amazon and Google-Broadcom 5GW figures are future arrangements. SpaceX offers access to existing Colossus clusters. They can overlap or complement one another across years, regions and workloads. More than ten gigawatts is a portfolio ceiling and roadmap, not today's simultaneously loaded facilities.",
          ],
          cards: [
            { label: "AWS", title: "Primary training partner", body: "Up to 5GW links Trainium to a long cloud relationship, with delivery phased by project." },
            { label: "GOOGLE", title: "Next-generation TPU", body: "The 5GW plan begins from 2027 and emphasizes price-performance and platform diversity." },
            { label: "SPACEX", title: "GPU access", body: "Colossus offers a distinct and potentially faster path, while price and contracted capacity are not fully disclosed." },
          ],
        },
        {
          label: "03 · CASH-FLOW BRIDGE", heading: "Revenue covers compute commitments through a four-layer schedule",
          paragraphs: [
            "Layer one is customer revenue: contract, use and collection. Layer two is cloud and silicon commitments: minimum purchases, prepayments, leases and cancellation. Layer three is capacity delivery: land, power, building, equipment and acceptance. Layer four is finance: equity, strategic investment, debt and partner-owned assets.",
            "The $65 billion Series H expands liquidity and includes hyperscaler strategic capital. It does not mean every future compute payment is funded. If capacity commitments lead collections, Anthropic still needs capital markets or suppliers to carry timing risk.",
            "A useful but currently unobservable metric is compute coverage ratio: sustainable gross cash generation divided by non-cancellable compute payments over the next twelve months. Without contracts and costs, only ranges are defensible.",
          ],
          steps: [
            { title: "Customer run-rate", body: "Annualized recent activity must be tested for concentration, retention and collection." },
            { title: "Contract commitment", body: "Separate maximum capacity, minimum payment, option and cancellation." },
            { title: "Available capacity", body: "Only energized and accepted clusters can serve revenue." },
            { title: "Cash coverage", body: "Gross cash and financing together fund prepayments, leases and service fees." },
          ],
        },
        {
          label: "04 · BULL AND BEAR", heading: "Both the financing-bottleneck and circular-finance theses need falsification",
          paragraphs: [
            "The bull case says high-value enterprise agents generate revenue far above annual compute and operating cost per GW. The rational strategy is maximum finance and construction speed; capital, not end demand, limits growth, and hardware diversity reduces supply risk.",
            "The bear case says run-rate overstates durable revenue, customer concentration or pricing pressure compresses margin, and giant compute commitments depend on cloud-provider investment and supplier finance. Higher utilization risk or funding cost then widens the cash gap quickly.",
            "The tests are concrete: quarterly revenue and collections, concentration, live MW by platform, non-cancellable payments, inference margin and renewal. As those appear, narrative can become a model.",
          ],
        },
      ],
      conclusion: "Anthropic's strongest signal is not a single $47 billion or 5GW figure but the simultaneous acceleration of revenue, funding and multi-platform capacity. The most important gap is equally clear: future compute must be covered by durable gross cash, not only the next financing round.",
      disclosure: "Cutoff: August 23, 2026, Beijing time. Anthropic is private. Run-rate, customer counts and capacity are company disclosures. Run-rate is not quarterly revenue; capacity ceilings are not live or fully utilized MW.",
    },
  }),
  record({
    slug: "nebius-asset-light-factory",
    imageAltZh: "概念体素分层示意：模块化机架与园区底座分离，表现云运营与实体资产的不同层次",
    imageAltEn: "Conceptual exploded voxel illustration separating modular racks from the campus foundation to distinguish cloud operations from physical assets",
    articleSectionZh: "新云资本效率",
    articleSectionEn: "Neocloud capital efficiency",
    topics: ["Nebius", "neocloud", "asset-light", "GPU finance", "Bloom Energy", "AI cloud"],
    sources: [
      primary("https://nebius.com/newsroom/nebius-introduces-business-model-to-scale-ai-cloud-globally-through-infrastructure-partnerships", "Nebius 合作伙伴持有基础设施模式", "Nebius partner-owned infrastructure model"),
      primary("https://nebius.com/newsroom/nebius-raises-775-million-in-first-secured-debt-financing-to-accelerate-global-buildout", "Nebius 7.75 亿美元首笔担保债务融资", "Nebius $775M first secured debt financing"),
      primary("https://nebius.com/newsroom/nebius-reports-first-quarter-2026-financial-results", "Nebius 2026 Q1 业绩与 Pennsylvania 园区", "Nebius Q1 2026 results and Pennsylvania campus"),
      primary("https://nebius.com/newsroom/nebius-and-bloom-energy-partner-to-power-ai-infrastructure-build-out", "Nebius 与 Bloom Energy 328MW 背表电源", "Nebius and Bloom Energy 328MW behind-the-meter power"),
    ],
    zh: {
      hero: "新云公司的下一个竞争单位不只是 GPU 数量，而是谁承担资产。Nebius 正同时使用自建园区、传统托管、合作伙伴持有基础设施、GPU 抵押贷款和背表电源。容量可以更快扩张，但风险不会消失，只会被重新分配给伙伴、贷款人、客户和 Nebius 的服务承诺。",
      thesis: "Nebius 的资产轻模式试图把云平台的高毛利与基础设施资产的长期资本分开：伙伴出资并持有硬件与数据中心，Nebius 提供架构、供应链、软件、销售和 SLA。它能否改善资本回报，取决于平台是否拥有真实定价权，以及伙伴容量能否达到与自营设施相同的可靠性和客户利用率。",
      opening: [
        "7 月 15 日，Nebius 宣布允许基础设施伙伴在自己的 AI 数据中心部署 Nebius 全栈平台。伙伴融资并持有设施和硬件、运营机房；Nebius 提供系统架构与供应链渠道，部署和维护软硬件设计，并通过全球销售体系出售容量。经济安排可以是分成、许可费、佣金或承诺容量。",
        "两天后，公司宣布首笔约 7.75 亿美元高级担保债务。贷款由已部署 GPU 和一个投资级客户合同现金流支持，期限至 2030 年 10 月 31 日，利率为 SOFR 加 250 个基点；公司称该设施与客户现金流合计覆盖底层 GPU 资本支出的 100% 以上。",
        "这两项安排与自建并存。Q1 公司披露 Pennsylvania 新园区已取得最高 1.2GW 土地与电力，计划自 2027 年起分期交付；同季还预计年末形成 800MW 至 1GW 已连接电力。5 月又与 Bloom Energy 签约，计划今年部署 328MW 背表燃料电池。Nebius 不是从重资产切换到轻资产，而是在建立多层资产组合。",
      ],
      sections: [
        {
          label: "01 · OWNERSHIP MAP", heading: "同一个 Nebius 云，可以落在四种资产负担上",
          paragraphs: [
            "自建园区给予公司最大的设计和运营控制，也要求土地、电力、建筑和设备资本。托管模式减少建筑所有权，却可能锁定长期租约和预付款。伙伴持有模式把设施与硬件资本交给第三方，Nebius 保留平台和客户界面。担保债务则把已运营 GPU 与客户现金流变成可重复融资资产。",
            "四种模式的会计和现金节奏不同。收入可以看起来相似，但资本支出、租赁负债、折旧、利息、最低承诺和残值风险不同。比较新云公司时，只用收入增速或 MW 会把资产负担差异隐藏起来。",
          ],
          metrics: [
            { label: "首笔担保债务", value: "$775M", note: "由 GPU 资产与投资级客户合同现金流支持。" },
            { label: "贷款定价", value: "SOFR + 2.50%", note: "期限至 2030 年 10 月 31 日；体现合同资产的融资价值。" },
            { label: "Pennsylvania", value: "最高 1.2GW", note: "已取得土地与电力，2027 年起分期；非当前运营容量。" },
            { label: "Bloom Energy", value: "328MW", note: "计划 2026 年投入运行的背表电源，仍需交付验证。" },
          ],
        },
        {
          label: "02 · ASSET-LIGHT ECONOMICS", heading: "轻资产只有在平台掌握客户和 SLA 时才有溢价",
          paragraphs: [
            "伙伴愿意出资的前提，是 Nebius 能把原始 GPU 容量变成更高价值的生产云。它需要证明调度、网络、存储、开发工具、推理服务、治理和支持可以提高利用率与价格，而不仅是转售裸金属。",
            "Nebius 保留软件与服务级别责任，这一点阻止模式退化成纯许可。即使伙伴管理设施和硬件，客户体验仍归 Nebius。若伙伴交付不一致，SLA 赔付、客户流失和品牌损失可能留在平台公司，而资产本身不在其控制范围内。",
            "因此，轻资产不是低风险的同义词。它降低前期资本，却增加供应商治理、质量控制、合同协调和地域一致性。真正的资本效率要用自由现金流、已投入资本回报和客户续约检验。",
          ],
          cards: [
            { label: "PARTNER", title: "持有设施与 GPU", body: "伙伴承担建设、硬件和部分残值风险，换取分成、许可或容量收益。" },
            { label: "NEBIUS", title: "持有平台与客户", body: "公司负责架构、软件、销售和 SLA，保留定价与品牌责任。" },
            { label: "CUSTOMER", title: "购买一致服务", body: "客户不应因底层所有者不同而感受到明显差异，这是模式最难的执行要求。" },
          ],
        },
        {
          label: "03 · SECURITIZATION", heading: "GPU 和合同现金流正在变成新云公司的融资底座",
          paragraphs: [
            "7.75 亿美元贷款把已部署 GPU 与投资级客户付款放进同一抵押结构。由于客户合同已进入服务阶段，融资人不再只押注未来建设，而是可以观察设备和现金流。较低利差反映了这类资产的可融资性，但不说明所有 GPU 项目都能复制。",
            "重复融资需要满足三项条件：客户合同期限覆盖债务、设备在合同期内保持经济价值、资产现金流与公司其他风险有效隔离。若硬件快速贬值、客户集中或利用率下降，下一笔融资成本会高于第一笔。",
            "公司称已有超过 400 亿美元额外投资级客户承诺，可为类似融资提供基础。这个数字仍应与已交付容量、合同付款和融资文件逐项核对，不能直接视为等额可借款额度。",
          ],
          steps: [
            { title: "签署客户合同", body: "期限、付款与信用质量决定债务可见度。" },
            { title: "交付 GPU 资产", body: "只有投入服务的设备才能形成可观察现金流。" },
            { title: "资产级融资", body: "贷款人以合同和设备为抵押，降低公司层股权需求。" },
            { title: "回收资本", body: "释放的资金投入新容量，但也形成持续杠杆和再融资需求。" },
          ],
        },
        {
          label: "04 · POWER AND CONTROL", heading: "背表电源加速送电，也把运营边界向能源侧延伸",
          paragraphs: [
            "Bloom 的 328MW 燃料电池方案旨在减少对新输电建设的依赖，并替代原计划的燃烧式发电。模块化和较轻许可有望缩短 time-to-power，但天然气供应、设备交付、长期维护、排放核算和电价仍决定经济性。",
            "把自建园区、伙伴资产、担保债务和背表电源叠加，Nebius 可以更快扩大容量池。与此同时，公司需要在更多资产所有者、能源系统和地域之间维持同一云体验。规模越快，运营控制就越重要。",
            "未来四个硬指标是：伙伴容量实际上线 MW、与自营设施的毛利差、SLA 与利用率、以及每新增美元收入需要的净资本。它们将决定所谓资产轻模式是平台溢价，还是把复杂性移到表外。",
          ],
        },
      ],
      conclusion: "Nebius 提供了新云资本结构最清晰的实验之一：拥有软件和客户，不必拥有每一座楼和每一张 GPU。若平台能控制服务质量并用合同现金流低成本融资，容量增长可脱离股权融资；若不能，资产轻只会把风险变得更难看见。",
      disclosure: "资料截止 2026 年 8 月 23 日（北京时间）。1.2GW、328MW、400 亿美元客户承诺与伙伴模式均含前瞻部分；贷款条款来自公司公告，未替代完整融资文件。",
    },
    en: {
      hero: "The next competitive unit for a neocloud is not just GPU count but who owns the assets. Nebius is combining owned campuses, colocation, partner-owned infrastructure, GPU-backed debt and behind-the-meter power. Capacity can scale faster, but risk is redistributed to partners, lenders, customers and Nebius's service promise.",
      thesis: "Nebius's asset-light model separates the cloud platform's potential margin from the infrastructure asset's long-duration capital. Partners finance and own hardware and facilities; Nebius supplies architecture, procurement access, software, sales and SLA. Better returns depend on real platform pricing power and partner capacity matching the reliability and utilization of owned sites.",
      opening: [
        "On July 15, Nebius announced that infrastructure partners could deploy its full-stack platform in their own AI data centers. Partners finance and own facilities and hardware and operate the sites. Nebius supplies system architecture and supply-chain access, deploys and maintains hardware design and software, and sells the capacity globally. Economics can include revenue share, licensing, commissions or committed capacity.",
        "Two days later, Nebius announced its first approximately $775 million senior secured facility. Deployed GPUs and contracted cash flow from an investment-grade customer support the loan. It matures on October 31, 2030 and is priced at SOFR plus 250 basis points. Nebius says the facility and customer cash flows cover more than 100% of capital expenditure for the underlying GPU infrastructure.",
        "These structures coexist with ownership. In Q1, Nebius said it had secured land and power for up to 1.2GW in Pennsylvania, phased from 2027, and expected 800MW to 1GW of connected power by year-end. In May it arranged 328MW of Bloom Energy behind-the-meter fuel cells targeted for this year. The company is building a portfolio, not switching from heavy to light assets.",
      ],
      sections: [
        {
          label: "01 · OWNERSHIP MAP", heading: "One Nebius cloud can sit on four different capital burdens",
          paragraphs: [
            "Owned campuses provide maximum design and operating control while requiring land, power, buildings and equipment capital. Colocation reduces building ownership but can create long leases and prepayments. Partner ownership moves facility and hardware capital to a third party while Nebius retains platform and customer control. Secured debt converts operating GPUs and customer cash flow into repeatable finance.",
            "The accounting and cash curves differ. Revenue may look similar while capital expenditure, lease liabilities, depreciation, interest, minimum commitments and residual-value risk do not. Comparing neoclouds only on revenue growth or megawatts hides asset burden.",
          ],
          metrics: [
            { label: "First secured facility", value: "$775M", note: "Backed by GPU assets and an investment-grade customer contract." },
            { label: "Loan pricing", value: "SOFR + 2.50%", note: "Maturity October 31, 2030; a signal of contract financeability." },
            { label: "Pennsylvania", value: "Up to 1.2GW", note: "Land and power secured, phased from 2027; not operating capacity." },
            { label: "Bloom Energy", value: "328MW", note: "Behind-the-meter power planned for 2026 and still subject to delivery." },
          ],
        },
        {
          label: "02 · ASSET-LIGHT ECONOMICS", heading: "Asset-light earns a premium only if the platform controls customers and SLA",
          paragraphs: [
            "Partners invest because Nebius aims to turn raw GPU capacity into a higher-value production cloud. Scheduling, networking, storage, developer tools, inference, governance and support must improve utilization and price beyond bare-metal resale.",
            "Nebius retains software and service-level responsibility, preventing the model from becoming a pure license. Even when a partner manages facilities and hardware, customer experience belongs to Nebius. Inconsistent delivery can leave SLA credits, churn and brand damage with a platform that does not own the asset.",
            "Asset-light is therefore not a synonym for low risk. It reduces upfront capital but adds vendor governance, quality control, contract coordination and geographic consistency. Free cash flow, return on invested capital and renewal must validate the benefit.",
          ],
          cards: [
            { label: "PARTNER", title: "Owns facility and GPUs", body: "The partner carries construction, hardware and some residual-value risk for revenue share or capacity economics." },
            { label: "NEBIUS", title: "Owns platform and customer", body: "Architecture, software, sales and SLA preserve pricing power and brand responsibility." },
            { label: "CUSTOMER", title: "Buys one service", body: "The customer should not feel a material difference by underlying owner—the hardest execution requirement." },
          ],
        },
        {
          label: "03 · SECURITIZATION", heading: "GPUs and contracts are becoming the neocloud financing base",
          paragraphs: [
            "The $775 million loan places deployed GPUs and investment-grade customer payments in one collateral package. Because the contract is in service, lenders can observe assets and cash rather than finance construction alone. The spread demonstrates financeability but does not make every GPU project replicable.",
            "Repeat finance requires contract duration covering debt, equipment retaining economic value through the term, and asset cash flow being isolated from wider company risk. Faster obsolescence, concentration or lower utilization would reprice the next facility.",
            "Nebius says more than $40 billion of additional investment-grade commitments may support similar financing. That total should be reconciled to delivered capacity, payments and financing documents rather than treated as an equal borrowing base.",
          ],
          steps: [
            { title: "Customer contract", body: "Duration, payment and credit quality create debt visibility." },
            { title: "GPU delivery", body: "Only in-service equipment produces observable cash flow." },
            { title: "Asset-level finance", body: "Lenders take contracts and equipment as collateral, reducing corporate equity needs." },
            { title: "Capital recycled", body: "Proceeds fund new capacity while creating leverage and refinancing obligations." },
          ],
        },
        {
          label: "04 · POWER AND CONTROL", heading: "Behind-the-meter power accelerates delivery and extends the operating boundary",
          paragraphs: [
            "The 328MW Bloom fuel-cell plan is intended to reduce dependence on new transmission and replace combustion equipment previously planned. Modular deployment and lighter permitting may shorten time-to-power, while gas supply, equipment delivery, maintenance, emissions accounting and price determine economics.",
            "Combining owned sites, partner assets, secured debt and on-site power can expand Nebius's capacity pool faster. It also requires a consistent cloud experience across more owners, energy systems and regions. Faster scale increases the value of operating control.",
            "Four hard measures matter next: partner capacity actually live, gross-margin difference versus owned facilities, SLA and utilization, and net capital required per incremental revenue dollar. They will show whether asset-light is platform value or off-balance-sheet complexity.",
          ],
        },
      ],
      conclusion: "Nebius is running one of the clearest neocloud capital experiments: own the software and customer without owning every building and GPU. If the platform controls service quality and finances contracts cheaply, capacity growth can separate from equity issuance. If not, asset-light merely makes risk less visible.",
      disclosure: "Cutoff: August 23, 2026, Beijing time. The 1.2GW, 328MW, $40B customer commitments and partner model include forward-looking elements. Loan terms are from the company announcement, not a substitute for full financing documents.",
    },
  }),
];
