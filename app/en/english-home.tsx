"use client";

import { useEffect, useMemo, useState } from "react";

type Story = { id: string; title: string; summary?: string; publishedAt?: string | null; permalink?: string; sourceUrl?: string | null; sourceName?: string | null; category?: string | null; region?: string; milestone?: string; scale?: string; whyItMatters?: string };
type CalendarEvent = { id: string; startsAt: string; company: string; ticker: string; sector: string; sourceUrl: string; sourceName: string; conclusion?: { summary: string; summaryEn?: string; sourceName: string; sourceUrl: string } };
type Record = { id: string; title: string; subject: string; metric: string; status: string; publishedAt: string; sourceName: string; sourceUrl: string; note: string };
type Product = { id: string; vendor: string; name: string; model?: string; form?: string; spec?: string; summary?: string; headlineMetric?: string; sourceName: string; sourceUrl: string; imageSrc?: string; imageAlt?: string };
type Deal = { id: string; announcedAt: string; buyer: string; target: string; value: string; capacity: string; region: string; status: string; rationale: string; sourceName: string; sourceUrl: string };
export type AtlasPayload = {
  generatedAt: string;
  weeklyHighlightCount?: number;
  benchmarks?: Array<{ code: string; name: string; level: number; dayPct: number; count: number }>;
  upcomingEvents?: CalendarEvent[];
  idcPulse?: Story[];
  listedCompanyNews?: Story[];
  nvidiaNews?: Story[];
  chinaChipNews?: Story[];
  modelNews?: Story[];
  chainNews?: Record<string, Story[]>;
  capacityRadar?: Record[];
  coolingProgress?: Record[];
  nvidiaProducts?: Product[];
  supernodes?: Product[];
  mnaDeals?: Deal[];
  aiDaily?: { date: string; canonical: string; lead: Story | null; sections: Array<{ label: string; items: Story[] }>; flashes: Story[] } | null;
  aiAdoption?: { asOf: string; sharePct: number; note: string; sourceUrl: string };
  openRouterUsage?: { period: string; asOf: string; sourceUrl: string; models: Array<{ id: string; name: string; rank: number; heat: number; url: string }> };
  arenaCodeLeaderboard?: { asOf: string; sourceUrl: string; models: Array<{ rank: number; name: string; organization: string; score: number }> };
};

const titleTranslations: Record<string, string> = {
  "中国联通长三角（吴江）智算中心一期启动 EPC 招标": "China Unicom launches EPC tender for Phase I of its Wujiang AI computing campus",
  "Crusoe 与 Lancium 落地德州 Childress 1GW AI 数据中心园区": "Crusoe and Lancium plan a 1GW AI data-center campus in Childress, Texas",
  "CleanSpark 为乔治亚州园区签下 175MW 长期租约": "CleanSpark signs a 175MW long-term lease for its Georgia campus",
  "Meta 将路易斯安那 Hyperion 园区扩至 5GW": "Meta expands its Louisiana Hyperion campus target to 5GW",
  "QTS 与 Lancium 宣布德州 Hall County 超大规模园区": "QTS and Lancium announce a hyperscale campus in Hall County, Texas",
  "中金数据乌兰察布零碳算力基地已有 10 栋投入运营": "CITIC Data reports ten buildings operating at its Ulanqab zero-carbon computing campus",
  "润泽科技数据中心 REIT 扩募申请获受理": "Range Technology data-center REIT follow-on offering application accepted",
  "光环新网披露内蒙古两项智算中心处于前期筹备": "Sinnet says two Inner Mongolia AI-computing projects remain in early preparation",
  "东阳光云智算签署 130–150 亿元算力服务采购合同": "HEC Cloud AI Computing signs RMB13–15bn computing-service procurement contract",
  "万国数据中心 REIT 拟扩募购入廊坊曙成数据中心": "GDS Data Center REIT proposes acquisition of the Langfang Shucheng data center",
  "科华数据称自建 IDC 上架率持续向优": "Kehua Data says utilization at self-built data centers continues to improve",
  "TeraWulf 与 Anthropic 签署 20 年 AI 基础设施租约": "TeraWulf and Anthropic sign a 20-year AI infrastructure lease",
  "昇腾 950 超节点真机首次亮相，扩展至 1024 卡": "Huawei unveils Atlas 950 SuperPoD system, scaling to 1,024 accelerators",
  "长鑫科技登陆科创板，成为 A 股 DRAM 制造标的": "ChangXin Technology lists on STAR Market as an A-share DRAM manufacturer",
  "海光信息：DCU 深算四号相关产品研发进展顺利": "Hygon says development of its Deep Computing Unit 4 products is progressing",
  "摩尔线程完成美团 LongCat-2.0 Day-0 适配": "Moore Threads completes day-zero support for Meituan LongCat-2.0",
  "沐曦更新 MXMACA 3.8 系列开发者工具链文档": "MetaX refreshes MXMACA 3.8 developer-toolchain documentation",
  "壁仞科技壁砺 166 系列完成 GLM-5.2 Day0 适配": "Biren completes day-zero adaptation for GLM-5.2 on its BR166 series",
  "KDA 的误读：K3 让算力需求更大，不是更小": "KDA is not a demand reducer: K3 may increase, not shrink, compute demand",
  "Google DeepMind 发布三款新 Gemini 模型，但未包含 3.5 Pro": "Google DeepMind releases three Gemini models, without Gemini 3.5 Pro",
  "通义千问发布 Qwen-Image-3.0 图像生成模型，核心关键词为\"实\"": "Qwen releases Qwen-Image-3.0 image-generation model",
  "NVIDIA 发布 Cosmos 3 Edge：4B 参数开源世界模型，为机器人及边缘 AI 提供实时推理与动作生成": "NVIDIA releases Cosmos 3 Edge, a 4B open world model for robotics and edge AI",
  "小红书 dots 模型获 IMO 2026 满分金牌": "Xiaohongshu's dots model earns a perfect-score IMO 2026 gold medal",
  "通义千问发布 Qwen-Image-3.0 图像生成模型，核心关键词为“实”": "Qwen releases Qwen-Image-3.0 image-generation model",
  "Google DeepMind 发布 Gemini 3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber 三款新模型": "Google DeepMind releases Gemini 3.6 Flash, 3.5 Flash-Lite and 3.5 Flash Cyber",
  "OpenAI 在 ChatGPT 中正式推出广告服务": "OpenAI formally launches advertising in ChatGPT",
  "OpenRouter 上线 Gemini 3.6 Flash 与 3.5 Flash-Lite": "OpenRouter adds Gemini 3.6 Flash and 3.5 Flash-Lite",
  "Claude Cowork 新增技能录制功能": "Claude Cowork adds skill-recording capability",
  "腾讯混元推出Hyra-1.0递归自我改进研究智能体": "Tencent Hunyuan introduces Hyra-1.0 recursive self-improving research agent",
  "xAI 推出 Grok for Outlook 加载项": "xAI launches Grok for Outlook add-in",
  "数据港参与静安量超智融合算力平台项目签约": "Shanghai DataPort joins a WAIC quantum-supercomputing-AI platform project",
  "Anthropic 锁定 TeraWulf 肯塔基园区约 401MW IT 容量": "Anthropic secures roughly 401MW of IT capacity at TeraWulf's Kentucky campus",
  "Galaxy Helios 一期向 CoreWeave 交付 133MW IT 负载": "Galaxy delivers 133MW of IT load to CoreWeave at Helios Phase I",
  "万界京峰青海智算中心启动建设": "Wanjie Jingfeng begins construction of its Qinghai AI-computing center",
  "广州智晟算力中心获节能审查，计划 11 月投产": "Guangzhou Zhisheng AI-computing center clears energy review, targets November start-up",
  "中国移动长三角（嘉善）智算中心完成首批验收交付": "China Mobile completes first delivery at its Jiashan AI-computing center",
  "Applied Digital 北达科他园区新增 75MW AI 容量投运": "Applied Digital brings an additional 75MW of AI capacity online in North Dakota",
  "中国移动京津冀（北京）国际信息港 6 号地数据中心进入设计阶段": "China Mobile's Beijing International Information Port DC enters the design stage",
  "中国移动宁夏中卫园区全面投用，IT 总功率达 332MW": "China Mobile's Zhongwei campus reaches full operation with 332MW of IT capacity",
  "Amazon 宣布在密苏里州建设新数据中心园区": "Amazon announces a new data-center campus in Missouri",
  "上海同城数据中心启动全过程咨询招标": "Shanghai metro data-center project launches full-process consultancy tender",
  "白城先进智算中心正式投产运营": "Baicheng advanced AI-computing center enters commercial operation",
  "Digital Realty Q2 新签订单与积压租金创高，并披露 288MW 北弗州资产收购": "Digital Realty reports record Q2 leasing and backlog, plus a 288MW Northern Virginia acquisition",
  "数据港参与静安量超智融合算力平台重点项目签约": "Shanghai DataPort joins WAIC's quantum-supercomputing-AI platform project",
  "Applied Digital Polaris Forge 1 在运 AI 容量升至 175MW": "Applied Digital's Polaris Forge 1 operating AI capacity rises to 175MW",
  "Digital Realty 增持北弗吉尼亚 288MW 已出租数据中心组合": "Digital Realty increases its stake in a fully leased 288MW Northern Virginia portfolio",
  "铜牛信息更新自建数据中心与国资云算力服务能力": "Tongniu Information updates its self-built data-center and state-cloud compute offering",
  "Equinix 联合 Cisco 与 NVIDIA 在全球数据中心部署 AI Factory": "Equinix, Cisco and NVIDIA deploy AI Factory infrastructure across global data centers",
  "数据港披露采购算力服务事项": "Shanghai DataPort discloses a compute-services procurement arrangement",
  "世纪互联披露年内新签 517MW 基地型 IDC 订单": "VNET reports 517MW of new campus-scale IDC orders year to date",
  "奥飞数据披露 2026 年多个数据中心交付计划": "Aofei Data outlines multiple 2026 data-center deliveries",
  "Core Scientific 将总电力容量管线扩至 4.5GW": "Core Scientific expands its total power-capacity pipeline to 4.5GW",
  "宝信软件披露宝之云数据中心绿色运营进展": "Baosight Software reports green-operations progress at its Baoshan Cloud data centers",
  "开源模型季度盘点：Kimi K3、Qwen 3.8、WAIC 演讲、知识蒸馏与开源闭源差距": "Quarterly open-model review: Kimi K3, Qwen 3.8 and the open-versus-closed gap",
  "RECAP：通过可解码性监督训练可验证的激活解释": "RECAP: training verifiable activation explanations with decodability supervision",
  "ABot-World-0：单张桌面级GPU实现无限交互式世界生成": "ABot-World-0: unlimited interactive world generation on a single desktop GPU",
  "Black Forest Labs 发布 FLUX 3 多模态模型，支持单次生成 20 秒视频与原生音频": "Black Forest Labs releases FLUX 3 multimodal model with 20-second video and native audio",
  "通义千问发布Qwen-Audio-3.0-TTS，登顶TTS排行榜": "Qwen releases Qwen-Audio-3.0-TTS and tops a public TTS leaderboard",
  "Cactus 发布 Gemma 4 E2B Hybrid：可在设备端为每个回答输出置信度分数，低分时自动路由至更大模型": "Cactus releases Gemma 4 E2B Hybrid with on-device answer-confidence routing",
  "Google 发布三款新模型：3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber": "Google releases Gemini 3.6 Flash, 3.5 Flash-Lite and 3.5 Flash Cyber",
};

const summaryTranslations: Record<string, string> = {
  "中国联通长三角（吴江）智算中心一期启动 EPC 招标": "Phase I includes a new DC1 building of roughly 55,200 square meters. Construction is scheduled to begin in October 2026 and complete in November 2027.",
  "Crusoe 与 Lancium 落地德州 Childress 1GW AI 数据中心园区": "The partners signed a binding development agreement for a 1GW AI data-center campus in Childress, Texas.",
  "CleanSpark 为乔治亚州园区签下 175MW 长期租约": "The Sandersville campus signed a 20-year triple-net lease with an investment-grade global technology company, with phased delivery expected from the fourth quarter of 2027.",
  "Meta 将路易斯安那 Hyperion 园区扩至 5GW": "Meta increased the Richland Parish data-center target to 5GW, with total regional investment expected to exceed $50 billion.",
  "QTS 与 Lancium 宣布德州 Hall County 超大规模园区": "The new campus is expected to bring more than $10 billion of capital investment and become Lancium's second large Texas Clean Campus project.",
  "中金数据乌兰察布零碳算力基地已有 10 栋投入运营": "Ten of the twelve planned data-center buildings are operating. The campus is planned for 144,000 standard racks and 360MW of IT capacity.",
  "润泽科技数据中心 REIT 扩募申请获受理": "The application to amend the product and list additional units in Range Technology's data-center REIT has been accepted by the CSRC and Shenzhen Stock Exchange.",
  "光环新网披露内蒙古两项智算中心处于前期筹备": "The company says land-related arrangements are complete for two Inner Mongolia AI-computing projects, which remain in early approvals and planning with phased construction based on demand.",
  "东阳光云智算签署 130–150 亿元算力服务采购合同": "Dongguan HEC Cloud AI Computing will procure and deploy high-performance servers and provide lifecycle operations. The service term begins after order acceptance and runs for 60 months.",
  "万国数据中心 REIT 拟扩募购入廊坊曙成数据中心": "The Southern GDS Data Center REIT proposes to acquire the Langfang Shucheng project through a follow-on offering, including three data-center buildings and an associated power building.",
  "科华数据称自建 IDC 上架率持续向优": "Kehua says utilization of its self-built data centers is improving, supported by cooperation with leading internet and cloud companies across IDC leasing, heterogeneous compute and industry applications.",
  "TeraWulf 与 Anthropic 签署 20 年 AI 基础设施租约": "TeraWulf signed a 20-year lease with Anthropic at its Kentucky Justified Data Campus. The initial term is expected to generate about $19 billion of contracted revenue.",
  "昇腾 950 超节点真机首次亮相，扩展至 1024 卡": "Huawei publicly demonstrated the Atlas 950 SuperPoD at WAIC 2026, disclosing 1,024 accelerators, 1 EFLOPS of FP8 compute and 256TB of globally addressable unified memory.",
  "长鑫科技登陆科创板，成为 A 股 DRAM 制造标的": "ChangXin Technology began trading on the Shanghai STAR Market on July 27 under ticker 688825. The exchange announcement states that 4,503.038971 million shares became tradable that day.",
  "海光信息：DCU 深算四号相关产品研发进展顺利": "Hygon said development is progressing smoothly but did not confirm whether related products have entered customer deliveries.",
  "摩尔线程完成美团 LongCat-2.0 Day-0 适配": "Moore Threads announced rapid adaptation for Meituan LongCat-2.0, continuing its effort to support frontier models on domestic full-function GPUs at launch.",
  "沐曦更新 MXMACA 3.8 系列开发者工具链文档": "MetaX refreshed documentation for its MXMACA 3.8 runtime, diagnostics, PyTorch, vLLM, SGLang and communications libraries.",
  "壁仞科技壁砺 166 系列完成 GLM-5.2 Day0 适配": "Biren completed GLM-5.2 inference adaptation on vLLM and says its BIRENSUPA software stack supports more than 500 AI models.",
  "KDA 的误读：K3 让算力需求更大，不是更小": "A research signal on how gains in model efficiency can still expand total compute demand; readers should verify the underlying argument at the original source.",
  "Google DeepMind 发布三款新 Gemini 模型，但未包含 3.5 Pro": "Google DeepMind released Gemini 3.6 Flash, 3.5 Flash-Lite and 3.5 Flash Cyber. The release highlights stronger coding and multimodal performance, lower token use and a cyber-security-focused model for trusted partners.",
  "通义千问发布 Qwen-Image-3.0 图像生成模型，核心关键词为\"实\"": "Qwen introduced its third-generation image foundation model, supporting up to 4.5k-token prompts, complex 3×3 infographic layouts and native text rendering across 12 languages.",
  "NVIDIA 发布 Cosmos 3 Edge：4B 参数开源世界模型，为机器人及边缘 AI 提供实时推理与动作生成": "NVIDIA open-sourced a 4B-parameter world model designed to help robots and visual AI agents understand environments, reason in real time and generate actions on edge devices.",
  "小红书 dots 模型获 IMO 2026 满分金牌": "Xiaohongshu's dots team reports a perfect 42/42 at the 67th International Mathematical Olympiad. Its dots-note 3.0 model works directly from LaTex problems and uses recursive self-critique; the lightweight model is expected to be open-sourced.",
  "通义千问发布 Qwen-Image-3.0 图像生成模型，核心关键词为“实”": "Qwen introduced its third-generation image foundation model, supporting up to 4.5k-token prompts, complex 3×3 infographic layouts and native text rendering across 12 languages.",
  "Google DeepMind 发布 Gemini 3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber 三款新模型": "Google DeepMind introduced a new flagship Flash model, a lower-cost Flash-Lite model and a cyber-security model optimized for selected government and trusted partners, all available through Google AI developer platforms.",
  "OpenAI 在 ChatGPT 中正式推出广告服务": "OpenAI introduced clearly labelled native advertising in ChatGPT, allowing advertisers to reach users as they explore and compare options. Initial advertisers include Best Buy, Lowe's and VistaPrint.",
  "OpenRouter 上线 Gemini 3.6 Flash 与 3.5 Flash-Lite": "Gemini 3.6 Flash and Gemini 3.5 Flash-Lite are now available on OpenRouter, emphasizing high throughput for coding, knowledge work and low-latency agent workloads.",
  "Claude Cowork 新增技能录制功能": "Claude Cowork now lets users record and narrate a workflow, then turn it into a repeatable skill. The feature is available in the Claude desktop application for Pro, Max and Team plans.",
  "腾讯混元推出Hyra-1.0递归自我改进研究智能体": "Tencent Hunyuan introduced Hyra-1.0, a recursive self-improving research agent. The company says it exceeded prior public results across three tasks and open-sourced the related artifacts on GitHub.",
  "xAI 推出 Grok for Outlook 加载项": "xAI released a Microsoft 365 add-in that embeds Grok in Outlook to summarize long email threads, draft replies and organize inboxes for paid X and SuperGrok users.",
  "数据港参与静安量超智融合算力平台项目签约": "Shanghai DataPort, Silex Technology and Boson Quantum jointly proposed a project selected for WAIC's key-signing program. It uses the Shanghai No. 1 AI-computing center as the base layer for coordinated AI, scientific and quantum computing.",
  "Anthropic 锁定 TeraWulf 肯塔基园区约 401MW IT 容量": "Anthropic signed a 20-year lease at TeraWulf's Justified Data Campus in Kentucky, with phased delivery planned from late 2027 to early 2028.",
  "Galaxy Helios 一期向 CoreWeave 交付 133MW IT 负载": "Helios Phase I delivered 200MW of total power and 133MW of critical IT load to CoreWeave on schedule, moving the West Texas campus into revenue operation.",
  "万界京峰青海智算中心启动建设": "The project is planned for 9,338 standard racks and 11,000P of AI-computing capability, with public information indicating roughly RMB4 billion of total investment.",
  "广州智晟算力中心获节能审查，计划 11 月投产": "The project cleared Guangzhou's energy-conservation review and plans 48 liquid-cooled racks, equivalent to about 1,310 standard racks, delivering 4,050 PFLOPS of FP16 training compute.",
  "中国移动长三角（嘉善）智算中心完成首批验收交付": "Phase I carries roughly RMB5 billion of investment and is planned as a 50,000-accelerator cluster. Initial compute is about 15,000 PFLOPS.",
  "Applied Digital 北达科他园区新增 75MW AI 容量投运": "The first phase of Polaris Forge 1's second building reached ready-for-service status, lifting operating AI capacity at the campus to 175MW.",
  "中国移动京津冀（北京）国际信息港 6 号地数据中心进入设计阶段": "Beijing's public-resource platform named candidates for scheme, preliminary and construction-document design for the China Mobile International Information Port site in Changping.",
  "中国移动宁夏中卫园区全面投用，IT 总功率达 332MW": "Following delivery of Campus B, the wider campus has twelve operating data-hall buildings, 132,800 standard racks and more than 100 EFLOPS of AI compute.",
  "Amazon 宣布在密苏里州建设新数据中心园区": "Amazon plans to invest $10 billion in a Montgomery County data-center campus, alongside road, water and community infrastructure.",
  "上海同城数据中心启动全过程咨询招标": "The Jindian Cloud Shanghai project opened a tender for project management and cost consulting, with plans for 598 general-compute racks and 61 25kW AI-compute racks.",
  "白城先进智算中心正式投产运营": "Jilin's largest AI-computing center currently in operation completed commissioning and began operation. Its first compute capacity has been delivered, with a 5,000P target.",
  "Digital Realty Q2 新签订单与积压租金创高，并披露 288MW 北弗州资产收购": "Digital Realty reported $307 million of annualized GAAP-base-rent bookings in Q2 and two hyperscale leases signed in July. Signed but not yet commenced annualized rental revenue reached $1.9 billion at quarter end.",
  "数据港参与静安量超智融合算力平台重点项目签约": "Shanghai DataPort, Silex Technology and Boson Quantum's jointly proposed platform was selected as a WAIC key-signing project, using the Shanghai No. 1 AI-computing center as its compute base.",
  "Applied Digital Polaris Forge 1 在运 AI 容量升至 175MW": "The first phase of the second building at Polaris Forge 1 became ready for service, adding 75MW and lifting operating AI capacity to 175MW.",
  "Digital Realty 增持北弗吉尼亚 288MW 已出租数据中心组合": "Digital Realty plans to acquire an interest in three Northern Virginia data centers from Blackstone. The fully leased portfolio has 288MW of total IT capacity.",
  "铜牛信息更新自建数据中心与国资云算力服务能力": "The company says its self-built data centers and state-cloud platform can provide underlying compute consumption and technical-services support for a range of token-driven workloads.",
  "Equinix 联合 Cisco 与 NVIDIA 在全球数据中心部署 AI Factory": "Equinix announced a collaboration with Cisco and NVIDIA to deploy secure AI Factory infrastructure for enterprises across its global data-center network.",
  "数据港披露采购算力服务事项": "Shanghai DataPort disclosed a compute-services procurement arrangement, reflecting its latest sourcing and operating plan for compute supply.",
  "世纪互联披露年内新签 517MW 基地型 IDC 订单": "VNET said in its first-quarter disclosure that it had signed 517MW of new orders year to date, including a 510MW order in the Beijing region from a leading internet customer.",
  "奥飞数据披露 2026 年多个数据中心交付计划": "At an earnings briefing, Aofei Data said it expects to deliver two to three data-center buildings in Gu'an, Langfang, as well as its Wuxi campus and Phase II in Dingxing, Hebei, during the year.",
  "Core Scientific 将总电力容量管线扩至 4.5GW": "Core Scientific expanded its total power-capacity pipeline to 4.5GW and plans to grow both its Muskogee, Oklahoma and Pecos, Texas campuses to 1.5GW.",
  "宝信软件披露宝之云数据中心绿色运营进展": "The company's ESG report says Baoshan Cloud data centers maintained industry-leading average PUE and continued to lower operating energy use through green-certificate procurement and carbon management.",
  "开源模型季度盘点：Kimi K3、Qwen 3.8、WAIC 演讲、知识蒸馏与开源闭源差距": "A podcast review from Nathan Lambert and Florian Brand covers Kimi K3, Qwen's stated open-weight plans, the economics of open versus closed models, frontier safety and the continuing performance gap between open models and closed-model frontiers.",
  "RECAP：通过可解码性监督训练可验证的激活解释": "The research argues that reconstruction scores from natural-language autoencoders do not verify claim-by-claim faithfulness. RECAP jointly trains a linear head so specified content remains decodable; on Pythia-160M, independent probes separate true from false claims with reported AUC of 0.96.",
  "ABot-World-0：单张桌面级GPU实现无限交互式世界生成": "ABot-World-0 is an action-conditioned video world model that reports running unlimited interactive generation on one NVIDIA RTX 5090 at 720p and up to 16 FPS, with 1.2-second action-to-first-frame latency and about 19 GiB peak VRAM.",
  "Black Forest Labs 发布 FLUX 3 多模态模型，支持单次生成 20 秒视频与原生音频": "Black Forest Labs released FLUX 3 in early access. The unified image, video and audio architecture can generate up to 20 seconds of video with native audio in one pass, including text-to-video, image-to-video and multi-shot workflows.",
  "通义千问发布Qwen-Audio-3.0-TTS，登顶TTS排行榜": "Qwen introduced Qwen-Audio-3.0-TTS in Flash and Plus versions, adding inline emotion tags, natural-language style controls, 16 languages and generation of text up to three minutes long. The company says it is first on the Artificial Analysis TTS leaderboard.",
  "Cactus 发布 Gemma 4 E2B Hybrid：可在设备端为每个回答输出置信度分数，低分时自动路由至更大模型": "Cactus's Gemma 4-based hybrid model embeds a confidence probe that returns a structured 0–1 score for each answer. High-confidence answers run on-device; lower-confidence answers can be routed to a larger model.",
  "Google 发布三款新模型：3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber": "Google introduced three models aimed at better performance, lower latency and lower cost. It says Gemini 3.6 Flash can use up to 65% fewer tokens on complex coding tasks, while 3.5 Flash-Lite reaches 350 output tokens per second.",
};

const recordTranslations: Record<string, { title: string; status: string; metric: string; note: string }> = {
  "digital-realty-q2-2026-capacity": { title: "Digital Realty Q2: new Atlanta land and a 288MW Northern Virginia asset interest", status: "Acquisition / expansion", metric: "Atlanta >1GW IT · Northern Virginia 288MW IT", note: "Digital Realty says it secured adjacent Atlanta land supporting more than 1GW of IT capacity, while completing the acquisition of a 64% interest in three leased Northern Virginia data centers representing 288MW of IT capacity." },
  "cleanspark-sandersville-175mw": { title: "CleanSpark Sandersville AI data-center campus", status: "20-year lease signed", metric: "175MW critical IT load", note: "The base lease term represents approximately $6.6 billion of contracted revenue, with phased delivery expected from the fourth quarter of 2027. Construction and financing remain the next execution milestones." },
  "meta-hyperion-5gw-expansion": { title: "Meta Hyperion data-center campus, Louisiana", status: "Under construction / expanding", metric: "5GW target compute capacity", note: "Meta raised the campus target to 5GW and regional investment to more than $50 billion. Construction began in December 2024 and continues in phases." },
  "galaxy-helios-phase-1": { title: "Galaxy Helios data-center campus, West Texas", status: "Phase I operational", metric: "133MW IT delivered", note: "Phase I delivered 133MW of critical IT load to CoreWeave and began revenue service. The 260MW second phase remains under construction, with delivery expected to begin in the first half of 2027." },
  "cmcc-jiashan-first-delivery": { title: "China Mobile Yangtze River Delta (Jiashan) AI-computing center, Phase I", status: "First delivery accepted", metric: "15,000 PFLOPS initial compute", note: "Phase I carries roughly RMB5 billion of investment and the campus is planned as a 50,000-accelerator cluster. Following first acceptance, the project enters rack deployment and utilization ramp-up." },
  "ningxia-zhongwei-b-202mw": { title: "China Mobile Zhongwei data-center Campus B, Ningxia", status: "Campus fully operational", metric: "332MW operating IT capacity", note: "With Campus B adding 202MW, the wider Zhongwei campus reaches 332MW of operating IT power. Reported green-power use remains above 80%." },
  "datang-zhongwei-500mw": { title: "Datang Zhongwei cloud-base green-power supply project", status: "Direct green-power supply operational", metric: "500MW solar online", note: "The 500MW solar project has been fully connected to the grid. A 1.5GW wind project is planned for grid connection in September 2026; Phase I totals 2GW of supply for the Zhongwei cloud base." },
  "unicom-wujiang-phase-1-epc": { title: "China Unicom Yangtze River Delta (Wujiang) AI-computing center, Phase I EPC", status: "Tender published", metric: "Capacity not disclosed", note: "Phase I includes a roughly 55,200-square-meter DC1 building, scheduled to start in October 2026 and complete in November 2027." },
  "vertiv-tognana-cooling-expansion": { title: "Vertiv expands AI data-center cooling manufacturing and testing in Italy", status: "Manufacturing expansion", metric: "Chiller capacity expected to double by end-2026", note: "The Tognana expansion increases chiller manufacturing and integrated-test capability. A new large laboratory is planned for early 2027 to validate integration with liquid-cooling systems under high-density loads." },
  "odcc-liquid-research": { title: "Liquid-cooling-fluid industry landscape research begins", status: "Industry research", metric: "Standards and supply chain", note: "The program seeks an industry reference across coolant materials, validation and application. It remains at an industry-coordination stage." },
  "zte-liquid-cdu": { title: "Large-capacity modular liquid-cooling CDU launched", status: "Productization", metric: "CDU / cold-plate liquid cooling", note: "The modular CDU targets hyperscale AI-computing centers, showing that supply-side delivery is progressing toward standardized modules." },
  "unicom-ningxia-liquid": { title: "Zhongwei cloud data center DC8 supporting works (liquid cooling)", status: "Engineering deployment", metric: "MEP and HVAC EPC", note: "Public reporting indicates that the MEP and HVAC EPC includes a dedicated liquid-cooling scope. Final contract and operating disclosures remain the confirmation point." },
};

const dealTranslations: Record<string, { buyer: string; value: string; capacity: string; region: string; status: string; rationale: string }> = {
  "stt-gdc-kkr-singtel": { buyer: "KKR-led consortium / Singtel", value: "S$13.8bn enterprise value", capacity: "95+ data centers / 11 markets", region: "Asia-Pacific / Europe", status: "Signed · pending close", rationale: "A control transaction for a large cross-regional data-center platform that materially expands Singtel's digital-infrastructure footprint." },
  "stark-sagebrush": { buyer: "Stark Power", value: "Not disclosed", capacity: "5.6GW development pipeline", region: "Central United States", status: "Signed · pending close", rationale: "The transaction secures five hyperscale campuses under development and integrates data-center development with on-site power capability." },
  "alphabet-intersect": { buyer: "Alphabet", value: "$4.75bn cash plus assumed debt", capacity: "Multi-GW energy and data-center projects", region: "United States", status: "Completed", rationale: "The acquisition further combines power development with data-center construction, aiming to shorten the delivery cycle for new capacity." },
  "aip-aligned": { buyer: "AIP (BlackRock / Microsoft / NVIDIA and others)", value: "Approximately $40bn", capacity: "51 campuses / more than 6.4GW", region: "United States / Latin America", status: "Completed", rationale: "AIP, MGX and BlackRock GIP completed the acquisition of 100% of Aligned and committed an additional $5 billion of growth capital at closing to expand AI-ready capacity." },
};

const supernodeTranslations: Record<string, { status: string; summary: string }> = {
  "huawei-atlas-superpod-roadmap": { status: "Existing deployment → 2026 system debut", summary: "Huawei is advancing from the 384-accelerator liquid-cooled Atlas 900 A3 supernode to the 1,024-accelerator Atlas 950 system, shifting the competitive focus to interconnect, unified memory and system-scale expansion." },
  "sugon-scalex640": { status: "Launched · core building block for 10,000-accelerator clusters", summary: "scaleX640 combines immersion phase-change cooling with dense interconnect and can scale from 16 nodes to a 10,000-accelerator cluster. Its proposition is multi-vendor accelerator compatibility and lower deployment friction for large-model clusters." },
  "alibaba-panjiu-al128": { status: "Launched at Alibaba Cloud Summit 2026", summary: "The Zhenwu M890 with ICN Switch 1.0 forms the Panjiu AL128 supernode. Alibaba has also said its T-Head in-house GPUs are in scaled production for training, fine-tuning and inference." },
};

const storyImages: Record<string, { src: string; alt: string }> = {
  "海光信息：DCU 深算四号相关产品研发进展顺利": { src: "/media/china/hygon-dcu-visual.png", alt: "Hygon DCU accelerator visual" },
  "沐曦更新 MXMACA 3.8 系列开发者工具链文档": { src: "/media/china/metax-c600.jpg", alt: "MetaX C600 accelerator system" },
};

const storyFieldTranslations: Record<string, string> = {
  "WAIC 重点项目签约": "WAIC key-project signing",
  "科创板上市交易": "STAR Market trading begins",
  "一期 EPC 招标": "Phase I EPC tender",
  "开发协议签署": "Development agreement signed",
  "20 年租约签署": "20-year lease signed",
  "扩建": "Expansion",
  "园区官宣": "Campus announced",
  "运营进度更新": "Operating-progress update",
  "一期投运": "Phase I operational",
  "启动建设": "Construction started",
  "节能审查通过": "Energy review approved",
  "首批交付": "First delivery accepted",
  "二号楼一期投运": "Building 2, Phase I operational",
  "设计中标候选人公示": "Design award candidates announced",
  "园区全面投用": "Campus fully operational",
  "新园区官宣": "New campus announced",
  "全过程咨询招标": "Full-process consultancy tender",
  "正式投产": "Commercial operation started",
  "Q2 业绩与租赁进展": "Q2 results and leasing update",
  "REIT 扩募申请受理": "REIT follow-on application accepted",
  "项目前期审批筹划": "Early-stage approvals and planning",
  "算力服务合同签署": "Compute-services contract signed",
  "REIT 扩募拟购入资产": "REIT follow-on asset acquisition proposed",
  "IDC 上架率更新": "IDC utilization update",
  "20 年 AI 基础设施租约": "20-year AI infrastructure lease",
  "已出租园区权益收购": "Acquisition of a leased-campus interest",
  "算力服务能力更新": "Compute-services capability update",
  "AI Factory 部署合作": "AI Factory deployment partnership",
  "算力服务采购": "Compute-services procurement",
  "基地型 IDC 新签订单": "New campus-scale IDC orders",
  "年度交付计划披露": "Annual delivery plan disclosed",
  "园区电力容量扩展": "Campus power-capacity expansion",
  "绿色运营披露": "Green-operations disclosure",
  "上海一号智算中心底座": "Shanghai No. 1 AI-computing center base",
  "450,303.8971 万股首日上市流通": "4,503.038971m shares tradable on listing day",
  "5.52 万㎡ · 2.78 亿元": "55,200 sq m · RMB 278m",
  "175 MW IT · $66 亿": "175MW IT · $6.6bn",
  "5 GW 计算容量 · $500 亿+": "5GW compute target · $50bn+",
  "$100 亿+": "$10bn+",
  "360 MW IT · 14.4 万机架": "360MW IT · 144,000 racks",
  "约 401 MW IT": "Approximately 401MW IT",
  "11000P · 9338 机架": "11,000P · 9,338 racks",
  "4050PFlops · 约 1310 标准机柜": "4,050 PFLOPS · approximately 1,310 standard racks",
  "15000 PFLOPS · 50 亿元": "15,000 PFLOPS · RMB 5bn",
  "新增 75 MW · 在运 175 MW": "75MW added · 175MW operating",
  "北京国际信息港 6 号地": "Beijing International Information Port, Site 6",
  "$100 亿": "$10bn",
  "659 机柜 · 1.8 亿元": "659 racks · RMB 180m",
  "5000P": "5,000P",
  "积压年化租金 $19 亿 · 北弗州 288MW IT": "$1.9bn signed backlog · 288MW Northern Virginia IT",
  "异构算力协同平台": "Heterogeneous-compute coordination platform",
  "拟注入 A-7 / A-8 数据中心": "Proposed A-7 / A-8 data-center injection",
  "内蒙古两项智算中心": "Two Inner Mongolia AI-computing centers",
  "130–150 亿元 · 60 个月": "RMB 13–15bn · 60 months",
  "3 栋数据中心楼 + 动力楼": "Three data-center buildings plus power building",
  "自建 IDC · 算力服务": "Self-built IDC · compute services",
  "约 $190 亿合同收入": "Approximately $19bn contracted revenue",
  "288 MW IT · $78 亿组合价值": "288MW IT · $7.8bn portfolio value",
  "自建数据中心 · 国资云": "Self-built data centers · state-cloud platform",
  "全球数据中心网络": "Global data-center network",
  "服务采购推进": "Service procurement progressing",
  "517 MW · 单笔 510 MW": "517MW total · 510MW single order",
  "固安 2–3 栋 · 无锡 / 定兴二期": "2–3 Gu'an buildings · Wuxi / Dingxing Phase II",
  "4.5 GW 管线 · 两园区各 1.5GW": "4.5GW pipeline · 1.5GW at each of two campuses",
  "宝之云数据中心": "Baoshan Cloud data centers",
};

const calendarNotes: Record<string, { sector: string; summary: string; focus: string }> = {
  TSLA: { sector: "Energy storage", summary: "Tesla earnings with a read-through to grid-scale storage demand and deployment cadence.", focus: "Megapack deployment, energy-storage backlog and capex." },
  GOOGL: { sector: "Cloud / AI", summary: "Alphabet earnings with the clearest public read-through to Google Cloud AI infrastructure spending.", focus: "Cloud growth, capex guidance and AI capacity." },
  INTC: { sector: "Semiconductors", summary: "Intel earnings covering PC and data-center CPU demand, foundry execution and supply plans.", focus: "Data-center demand, foundry capex and product roadmap." },
  VRT: { sector: "Data-center infrastructure", summary: "Vertiv earnings on power, thermal management and liquid-cooling demand from AI data centers.", focus: "Orders, backlog, liquid-cooling delivery and margin." },
  META: { sector: "Internet / AI", summary: "Meta earnings with a direct view into frontier-model infrastructure and data-center buildout.", focus: "AI capex, data-center capacity and power demand." },
  MSFT: { sector: "Cloud / software", summary: "Microsoft earnings on Azure demand and the pace of AI infrastructure expansion.", focus: "Azure growth, capex, availability and AI supply." },
  ARM: { sector: "Chip IP", summary: "Arm earnings on the architecture layer supporting AI servers and mobile compute.", focus: "Data-center royalties, AI server adoption and partner demand." },
  AMZN: { sector: "Cloud / e-commerce", summary: "Amazon earnings with AWS as a core marker for hyperscale AI infrastructure investment.", focus: "AWS growth, capex, AI services and capacity additions." },
};

const sectionCopy = {
  pulse: ["01 · 45-DAY VERIFIED PROJECT PULSE", "IDC project pulse", "Verified campus construction, expansion, leases, commissioning and operations across China and the United States."],
  daily: ["02 · AI HOT DAILY EDITION", "Daily AI briefing", "The complete daily edition, with original-source links retained for every item."],
  chain: ["03 · INTERACTIVE SUPPLY CHAIN", "Infrastructure supply chain", "Compute, racks, cooling, power, campuses and model demand — with the same live source layer as the Chinese site."],
  nvidia: ["04 · NVIDIA PRODUCT RADAR", "NVIDIA product radar", "Product form factors, specifications and the latest AI-infrastructure context."],
  silicon: ["05 · CHINA GPU & AI SILICON", "China AI silicon", "Accelerators, supernodes, software stacks and ecosystem progress, with English editorial coverage and original-source links."],
  models: ["06 · MODEL DEMAND & CAPABILITY", "Model demand signals", "Global AI adoption, live model usage and public evaluation data alongside release activity."],
  projects: ["07 · LARGE-SCALE CAMPUS RADAR", "Large-campus progress", "Construction, energy, tendering, delivery and operations at major data-center campuses."],
  mna: ["08 · GLOBAL IDC M&A INTELLIGENCE", "Global strategic transactions", "Transactions that can change platform control, regional capacity or energy access."],
  cooling: ["09 · LIQUID COOLING ADOPTION", "Liquid-cooling deployment", "Standards, modular products and engineering delivery from validation to production rollout."],
  market: ["10 · DAILY MARKET TEMPERATURE", "Market temperature", "Daily public-market signals for compute, storage and related infrastructure."],
} as const;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" }).format(date) : value;
}

function formatEvent(value: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short" }).format(new Date(value));
}

function englishTitle(title: string) { return titleTranslations[title] ?? "Source-linked infrastructure update"; }
function englishField(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  return storyFieldTranslations[value] ?? (/[一-鿿]/.test(value) ? fallback : value);
}
function recordCopy(record: Record) { return recordTranslations[record.id] ?? { title: record.title, status: record.status, metric: record.metric, note: record.note }; }
function dealCopy(deal: Deal) { return dealTranslations[deal.id] ?? { buyer: deal.buyer, value: deal.value, capacity: deal.capacity, region: deal.region, status: deal.status, rationale: deal.rationale }; }
function supernodeCopy(node: Product) { return supernodeTranslations[node.id] ?? { status: "Public update", summary: node.summary ?? "Source-linked product update." }; }

function StoryCard({ item, eyebrow = "SOURCE-LINKED SIGNAL" }: { item: Story; eyebrow?: string }) {
  const translated = titleTranslations[item.title];
  const source = item.sourceUrl ?? item.permalink ?? "#";
  const image = storyImages[item.title];
  return <article className="english-story-card">
    {image && <img className="english-story-card-image" src={image.src} alt={image.alt} loading="lazy" />}
    <div><span>{eyebrow}</span><time>{formatDate(item.publishedAt)}</time></div>
    <h3><a href={source} target="_blank" rel="noreferrer">{englishTitle(item.title)}</a></h3>
    <p>{translated ? summaryTranslations[item.title] ?? "Source-linked editorial signal." : "A new source-linked update is being reviewed for English editorial coverage."}</p>
    {(item.milestone || item.scale) && <dl><div><dt>STAGE</dt><dd>{englishField(item.milestone, "Public update")}</dd></div><div><dt>SCALE</dt><dd>{englishField(item.scale, "Not disclosed")}</dd></div></dl>}
    <a className="english-source" href={source} target="_blank" rel="noreferrer">{item.sourceName ?? "Open source"} ↗</a>
  </article>;
}

function SectionHead({ copy }: { copy: readonly [string, string, string] }) {
  return <div className="english-full-head"><div><span>{copy[0]}</span><h2>{copy[1]}</h2></div><p>{copy[2]}</p></div>;
}

export default function EnglishHome({ initialPayload = null }: { initialPayload?: Partial<AtlasPayload> | null }) {
  const [payload, setPayload] = useState<Partial<AtlasPayload> | null>(initialPayload);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    void fetch("/api/atlas-live-v5?schema=v1", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Atlas unavailable")))
      .then((data: AtlasPayload) => setPayload(data))
      .catch(() => setLoadError(true));
  }, []);

  const dailyItems = useMemo(() => payload?.aiDaily ? [payload.aiDaily.lead, ...payload.aiDaily.sections.flatMap((section) => section.items), ...payload.aiDaily.flashes].filter((item): item is Story => Boolean(item)).slice(0, 9) : [], [payload]);
  const chainGroups = Object.entries(payload?.chainNews ?? {});
  const eventList = payload?.upcomingEvents ?? [];
  const pulse = payload?.idcPulse ?? [];
  const listed = payload?.listedCompanyNews ?? [];
  const nvidiaProducts = payload?.nvidiaProducts ?? [];
  const nvidiaNews = payload?.nvidiaNews ?? [];
  const silicon = payload?.chinaChipNews ?? [];
  const supernodes = payload?.supernodes ?? [];
  const models = payload?.modelNews ?? [];
  const capacity = payload?.capacityRadar ?? [];
  const cooling = payload?.coolingProgress ?? [];
  const deals = payload?.mnaDeals ?? [];
  const market = payload?.benchmarks ?? [];

  return <main className="english-home-page english-full-page" lang="en">
    <header className="english-nav"><a href="/en" aria-label="IDC Atlas English home">IDC <b>ATLAS</b></a><nav aria-label="English site navigation"><a href="#pulse">Pulse</a><a href="#calendar">CAPEX calendar</a><a href="#silicon">China silicon</a><a href="#market">Markets</a></nav><a className="language-switch active" href="/">中文</a></header>

    <section className="english-hero english-full-hero"><p>GLOBAL DATA CENTER INTELLIGENCE · SOURCE FIRST</p><h1>AI infrastructure<br /><em>through an investor lens.</em></h1><p>IDC Atlas now exposes the same full data coverage in English: project pulse, daily AI news, supply-chain signals, products, China AI silicon, campuses, M&amp;A, cooling and market temperature. English editorial translations are added first to the highest-value signals; otherwise the original Chinese source is retained transparently.</p><div><a href="#pulse">Explore the full intelligence stack</a><a href="#calendar">US earnings &amp; CAPEX watch</a></div><dl><div><dt>PROJECT PULSE</dt><dd>{pulse.length || "—"}</dd><small>verified project signals</small></div><div><dt>LISTED COMPANIES</dt><dd>{listed.length || "—"}</dd><small>China and US disclosures</small></div><div><dt>LAST UPDATE</dt><dd>{payload ? "LIVE" : loadError ? "OFFLINE" : "…"}</dd><small>{payload ? formatDate(payload.generatedAt) : "connecting"}</small></div></dl></section>

    <section className="column-feature english-column-feature" id="columns" aria-labelledby="english-featured-column-title"><div className="column-feature-head"><span>NEW · IDC ATLAS COLUMN</span><time dateTime="2026-07-27">JULY 27, 2026</time></div><a className="column-feature-card" href="/en/columns/ai-capex-power"><div><p>CAPEX WATCH · 01</p><h2 id="english-featured-column-title">The AI Buildout Enters <em>Its Power-Hungry Phase.</em></h2><p>Microsoft, Alphabet, Meta and Amazon show how AI spending is moving from chip orders into power, campuses, cooling and billable capacity.</p><dl><div><dt>MICROSOFT</dt><dd>≈ $190B</dd></div><div><dt>ALPHABET</dt><dd>$175–185B</dd></div><div><dt>META</dt><dd>$125–145B</dd></div></dl><span>READ THE COLUMN →</span></div><figure><img src="/column-ai-capex-grid.png" alt="AI data centers connected to a constrained electric grid" loading="eager" /><figcaption>ORIGINAL IDC ATLAS EDITORIAL</figcaption></figure></a></section>

    <section className="english-calendar" id="calendar"><div className="english-section-head"><div><span>UPCOMING EVENTS</span><h2>US tech earnings &amp; CAPEX watch</h2></div><p>Company dates link to official investor-relations sources. After results, the card adds a source-linked infrastructure conclusion. Time shown in US Eastern Time.</p></div><div className="english-event-list">{eventList.map((event) => { const note = calendarNotes[event.ticker] ?? { sector: event.sector, summary: "Officially scheduled earnings event.", focus: "Capex, demand and forward guidance." }; return <article key={event.id}><time>{formatEvent(event.startsAt)}</time><div><span>{note.sector}</span><h3>{event.company} <small>{event.ticker}</small></h3><p>{note.summary}</p></div><div><strong>{event.conclusion ? "POST-RESULT CONCLUSION" : "CAPEX WATCH"}</strong><p>{event.conclusion?.summaryEn ?? event.conclusion?.summary ?? note.focus}</p><a href={event.conclusion?.sourceUrl ?? event.sourceUrl} target="_blank" rel="noreferrer">Official source · {event.conclusion?.sourceName ?? event.sourceName} ↗</a></div></article>; })}{!eventList.length && <p className="english-loading">Loading the next official earnings events…</p>}</div></section>

    <section className="section pulse-section english-full-section" id="pulse"><SectionHead copy={sectionCopy.pulse} /><div className="english-full-subhead"><strong>Verified projects</strong><span>China and United States · last 45 days</span></div><div className="english-story-grid">{pulse.map((item) => <StoryCard key={item.id} item={item} eyebrow="VERIFIED PROJECT" />)}</div><div className="english-full-subhead"><strong>Core listed-company watch</strong><span>{listed.length} source-linked disclosures</span></div><div className="english-story-grid">{listed.map((item) => <StoryCard key={item.id} item={item} eyebrow="LISTED COMPANY" />)}</div></section>

    <section className="section daily-section english-full-section" id="daily"><SectionHead copy={sectionCopy.daily} />{payload?.aiDaily && <div className="english-daily-meta"><span>BEIJING DATE · {payload.aiDaily.date}</span><a href={payload.aiDaily.canonical} target="_blank" rel="noreferrer">Full AI HOT edition ↗</a></div>}<div className="english-story-grid">{dailyItems.map((item) => <StoryCard key={item.id} item={item} eyebrow="AI HOT DAILY" />)}</div>{!dailyItems.length && <p className="english-loading">{loadError ? "Daily briefing unavailable." : "Loading the daily AI briefing…"}</p>}</section>

    <section className="section chain-section english-full-section" id="chain"><SectionHead copy={sectionCopy.chain} /><div className="english-chain-grid">{chainGroups.map(([stage, items]) => <article key={stage}><div><span>SUPPLY CHAIN NODE</span><h3>{stage}</h3></div><div>{items.slice(0, 3).map((item) => <a href={item.sourceUrl ?? item.permalink ?? "#"} target="_blank" rel="noreferrer" key={item.id}>{englishTitle(item.title)} <small>↗</small></a>)}</div></article>)}</div></section>

    <section className="section english-light-section english-full-section" id="nvidia"><SectionHead copy={sectionCopy.nvidia} /><div className="english-product-grid">{nvidiaProducts.map((product) => <article key={product.id}>{product.imageSrc && <img src={product.imageSrc} alt={product.imageAlt ?? product.model ?? "NVIDIA product"} loading="lazy" />}<span>NVIDIA PRODUCT</span><h3>{product.model}</h3><strong>{product.form}</strong><p>{product.spec}</p><a href={product.sourceUrl} target="_blank" rel="noreferrer">{product.sourceName} ↗</a></article>)}</div><div className="english-story-grid english-compact-grid">{nvidiaNews.map((item) => <StoryCard key={item.id} item={item} eyebrow="NVIDIA NOW" />)}</div></section>

    <section className="section china-chip-section english-full-section" id="silicon"><SectionHead copy={sectionCopy.silicon} /><div className="english-supernode-grid">{supernodes.map((node) => { const copy = supernodeCopy(node); return <article key={node.id}>{node.imageSrc && <img src={node.imageSrc} alt={node.imageAlt ?? node.name} loading="lazy" />}<span>CHINA SUPERNODE · {copy.status}</span><h3>{node.name}</h3><strong>{node.headlineMetric}</strong><p>{copy.summary}</p><a href={node.sourceUrl} target="_blank" rel="noreferrer">{node.sourceName} ↗</a></article>; })}</div><div className="english-story-grid">{silicon.map((item) => <StoryCard key={item.id} item={item} eyebrow="CHINA AI SILICON" />)}</div></section>

    <section className="section model-section english-full-section" id="models"><SectionHead copy={sectionCopy.models} /><div className="english-model-overview"><article><span>GLOBAL AI DIFFUSION</span><strong>{payload?.aiAdoption?.sharePct ?? "—"}%</strong><h3>Generative-AI adoption</h3><p>{payload?.aiAdoption?.note ?? "Quarterly public adoption indicator."}</p><a href={payload?.aiAdoption?.sourceUrl ?? "https://blogs.microsoft.com/on-the-issues/2026/05/07/the-state-of-global-ai-diffusion-in-2026/"} target="_blank" rel="noreferrer">Microsoft source ↗</a></article><article><span>OPENROUTER · WEEKLY USAGE</span><h3>{payload?.openRouterUsage?.period ?? "Loading"}</h3><div className="english-rank-list">{(payload?.openRouterUsage?.models ?? []).slice(0, 6).map((model) => <a key={model.id} href={model.url} target="_blank" rel="noreferrer"><b>#{model.rank}</b><span>{model.name}</span><i style={{ width: `${model.heat}%` }} /></a>)}</div><a href={payload?.openRouterUsage?.sourceUrl ?? "https://openrouter.ai/rankings/"} target="_blank" rel="noreferrer">OpenRouter source ↗</a></article><article><span>ARENA · CODE / WEBDEV</span><h3>Public evaluation</h3><div className="english-rank-list">{(payload?.arenaCodeLeaderboard?.models ?? []).slice(0, 6).map((model) => <a key={`${model.rank}-${model.name}`} href={payload?.arenaCodeLeaderboard?.sourceUrl ?? "https://arena.ai/leaderboard/code/webdev"} target="_blank" rel="noreferrer"><b>#{model.rank}</b><span>{model.name}</span><i style={{ width: `${Math.min(100, model.score / 15)}%` }} /></a>)}</div><a href={payload?.arenaCodeLeaderboard?.sourceUrl ?? "https://arena.ai/leaderboard/code/webdev"} target="_blank" rel="noreferrer">Arena source ↗</a></article></div><div className="english-story-grid">{models.map((item) => <StoryCard key={item.id} item={item} eyebrow="MODEL RELEASE" />)}</div></section>

    <section className="section project-section english-full-section" id="projects"><SectionHead copy={sectionCopy.projects} /><div className="english-record-grid">{capacity.map((record) => { const copy = recordCopy(record); return <article key={record.id}><div><span>{copy.status}</span><strong>{copy.metric}</strong></div><small>{formatDate(record.publishedAt)}</small><h3>{copy.title}</h3><p>{copy.note}</p><a href={record.sourceUrl} target="_blank" rel="noreferrer">{record.sourceName} ↗</a></article>; })}</div></section>

    <section className="section mna-section english-full-section" id="mna"><SectionHead copy={sectionCopy.mna} /><div className="english-deal-grid">{deals.map((deal) => { const copy = dealCopy(deal); return <article key={deal.id}><div><span>{copy.status}</span><time>Announced {formatDate(deal.announcedAt)}</time></div><p>{copy.region}</p><h3>{copy.buyer} <b>→</b> {deal.target}</h3><dl><div><dt>DEAL VALUE</dt><dd>{copy.value}</dd></div><div><dt>ASSET SCALE</dt><dd>{copy.capacity}</dd></div></dl><p>{copy.rationale}</p><a href={deal.sourceUrl} target="_blank" rel="noreferrer">{deal.sourceName} ↗</a></article>; })}</div></section>

    <section className="section cooling-section english-full-section" id="cooling"><SectionHead copy={sectionCopy.cooling} /><div className="english-record-grid english-cooling-grid">{cooling.map((record) => { const copy = recordCopy(record); return <article key={record.id}><span>{copy.status}</span><h3>{copy.metric}</h3><h4>{copy.title}</h4><p>{copy.note}</p><a href={record.sourceUrl} target="_blank" rel="noreferrer">{record.sourceName} ↗</a></article>; })}</div></section>

    <section className="benchmark-section section english-full-section" id="market"><SectionHead copy={sectionCopy.market} /><div className="english-market-grid">{market.map((item) => <article key={item.code}><span>{item.code} · {item.count} constituents</span><h3>{item.name}</h3><strong>{item.level.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong><p className={item.dayPct >= 0 ? "up" : "down"}>{item.dayPct >= 0 ? "+" : ""}{item.dayPct.toFixed(2)}% <small>vs. prior close</small></p></article>)}</div></section>

    <section className="english-method"><span>RESEARCH BOUNDARY</span><h2>Full coverage, traceable sources, no investment advice.</h2><p>IDC Atlas separates discovery signals from verified public facts. The English site carries the same coverage stack as the Chinese site, while retaining the original public-source link for every item.</p><a href="/methodology">Methodology &amp; sources →</a></section>
    <footer className="english-footer"><a href="/">中文站 / Chinese site</a><span>IDC ATLAS · RESEARCH ONLY · NOT INVESTMENT ADVICE</span><a href="/llms.txt">LLM guide</a></footer>
  </main>;
}
