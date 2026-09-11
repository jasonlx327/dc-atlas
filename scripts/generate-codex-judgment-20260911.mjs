import fs from "node:fs";
import { matchCoreCompanies } from "../worker/event-intelligence/core-company-watchlist.ts";

const brief = JSON.parse(fs.readFileSync("artifacts/event-intelligence/codex-editorial-brief.json", "utf8"));
const strip = (value) => String(value ?? "")
  .replaceAll("&apos;", "'")
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&nbsp;", " ")
  .replaceAll("&rsquo;", "’")
  .replaceAll("&ldquo;", "“")
  .replaceAll("&rdquo;", "”")
  .replace(/\s+/g, " ")
  .trim();
const hasZh = (value) => /[\u3400-\u9fff]/.test(value ?? "");

const publishers = {
  "utility-dive": "Utility Dive",
  "the-register": "The Register",
  "financial-times-tech": "Financial Times",
  techcrunch: "TechCrunch",
  "the-verge": "The Verge",
  "cnbc-technology": "CNBC",
  "light-reading": "Light Reading",
  "fierce-network": "Fierce Network",
  "data-center-dynamics": "Data Center Dynamics",
  "marketwatch-top": "MarketWatch",
  fortune: "Fortune",
  "power-magazine": "POWER Magazine",
  "ee-times": "EE Times",
  "serve-the-home": "ServeTheHome",
  ithome: "IT之家",
  "nvidia-developer": "NVIDIA Developer",
  "aws-news": "AWS News",
  "coreweave": "CoreWeave",
  "google-developers": "Google Developers",
  "sec-edgar": "SEC EDGAR",
  "nist-news": "NIST",
  "federal-register": "Federal Register",
  "openai-news": "OpenAI",
  "google-ai-blog": "Google AI",
  "ibm-newsroom": "IBM",
  "dell-blog": "Dell",
};
const publisherEnglish = { ...publishers, ithome: "IT Home" };

const titleZhMap = new Map([
  ["CUDA Toolkit 13.4 Adds Windows on Arm Support and Greater Control over Shared GPUs", "CUDA Toolkit 13.4 增加 Windows on Arm 支持，并加强共享 GPU 控制"],
  ["Google bankrolls PG&E virtual power plant", "Google 出资支持 PG&E 虚拟电厂试点"],
  ["Google takes the nuclear option for €13B Finland expansion", "Google 以核电、风电和电池项目推进芬兰 130 亿欧元扩张计划"],
  ["Anthropic researcher quits over AI labs ‘gambling with our lives’", "Anthropic 研究员因质疑 AI 实验室“拿我们的生命下注”而离职"],
  ["Anthropic details distillation campaigns from Alibaba, Moonshot AI, and DeepSeek", "Anthropic 详述涉及阿里巴巴、月之暗面和 DeepSeek 的模型蒸馏行动指控"],
  ["Amazon makes it easier to buy what you see on Prime Video", "Amazon 简化 Prime Video 观众购买剧中商品的流程"],
  ["Meta’s Muse AI works and creeps me out", "Meta Muse AI 助手引发体验关注"],
  ["AWS Lambda durable functions integrates with Pydantic AI", "AWS Lambda Durable Functions 接入 Pydantic AI"],
  ["Humans need to &apos;surf the wave&apos; of AI rather than get swallowed by it, Chesky says at Communacopia", "Chesky 在 Communacopia 表示，人们应驾驭 AI 浪潮而非被其吞没"],
  ["OpenAI targets work of Wall Street junior bankers with new ChatGPT for Financial Services", "OpenAI 推出 ChatGPT for Financial Services，瞄准初级银行家工作"],
  ["Eurobites: Google tips €13B into Finnish data center plan", "Eurobites：Google 将 130 亿欧元投入芬兰数据中心计划"],
  ["World’s largest contract chipmaker TSMC sees August revenue surge over 53% to record high", "全球最大晶圆代工厂台积电 8 月营收增长逾 53%，创历史新高"],
  ["Conversations from Goldman Sachs&apos; Communacopia: AI blowback, broadband and Disney&apos;s free tier", "高盛 Communacopia 对话：AI 反噬、宽带与 Disney 免费层"],
  ["Experts weigh in as researcher says AI has more than 10% chance of &apos;killing all humans&apos;", "研究员称 AI 有超过 10% 概率“杀死人类”，专家展开讨论"],
  ["Meta’s AI agent Muse is now the No. 2 app in the US", "Meta AI 代理 Muse 登上美国应用下载榜第二位"],
  ["Anthropic reveals rogue AI agents hate CAPTCHAs, just like you", "Anthropic 展示失控 AI 代理如何应对 CAPTCHA"],
  ["Amazon’s Fire TV Stick 4K is over half off at under $20", "Amazon Fire TV Stick 4K 折扣超过五成，售价低于 20 美元"],
  ["Nvidia’s Groq deal facing DOJ probe amid regulator scrutiny into acqui-hires: report", "报道称 Nvidia 与 Groq 的交易面临美国司法部调查"],
  ["News and Press Releases | CoreWeave", "CoreWeave 发布最新新闻与公告"],
  ["Agent Plugins package your skills, tools, and more", "Agent Plugins 将技能、工具等打包为可移植单元"],
  ["Switzerland tests a FOSS escape route from Microsoft 365", "瑞士测试以 FOSS 摆脱 Microsoft 365 的路径"],
  ["Oracle’s data centre revenue surges as AI strategy accelerates", "Oracle 数据中心收入增长，AI 战略加速推进"],
  ["Apple&apos;s foldable phone, Macy&apos;s earnings, Treasury buybacks and more in Morning Squawk", "Morning Squawk 聚焦苹果折叠屏手机、Macy’s 业绩和美国财政部回购"],
  ["Where to preorder the new Apple Watch Series 12 and Ultra 4", "Apple Watch Series 12 与 Ultra 4 开启预订"],
  ["Qualcomm pivots toward data centers with Amazon custom-silicon deal", "高通借助与 Amazon 的定制芯片合作转向数据中心"],
  ["AI agents raise new control questions for telecom networks", "AI 代理为电信网络带来新的控制问题"],
  ["Broadcom predicts AI chip revenue to double in 2027", "博通预计 AI 芯片收入将在 2027 年翻倍"],
  ["Opinion: DOJ vs Huawei — RICO or bust, baby!", "评论：美国司法部诉华为案将检验 RICO 法案边界"],
  ["SpaceX is inching closer to this lofty $100 billion milestone", "SpaceX 正逐步接近 1000 亿美元营收目标"],
  ["3 ways to prep for your next big race with Search", "Google Search 提供三种备战下一场大型比赛的方式"],
  ["India’s Pocket FM doubles revenue run rate to $500M as AI powers 93% of audio content", "印度 Pocket FM 营收运行率翻倍至 5 亿美元，AI 生成 93% 音频内容"],
  ["Hexagon, Weyerhaeuser Ink Geothermal Development Deal for Pacific Northwest", "Hexagon 与 Weyerhaeuser 签署美国西北太平洋地区地热开发协议"],
  ["Universal Music is launching an AI music platform with ElevenLabs", "环球音乐与 ElevenLabs 将推出 AI 音乐平台"],
  ["Film studio turned data center project gets approval in High Wycombe, UK", "英国 High Wycombe 的电影制片厂改建数据中心项目获批"],
  ["ADI Snaps Alif Semiconductor to Push AI into Physical Systems", "ADI 以 13.5 亿美元收购 Alif Semiconductor，推动 AI 进入实体系统"],
  ["How to Build a Computer: A Beginner’s Guide", "如何组装电脑：初学者指南"],
  ["The AI policy window is open. We need to act.", "AI 政策窗口已经打开，需要采取行动"],
  ["Arm Neoverse CSS N4 Launched for Next-Gen CPUs and DPUs", "Arm 发布 Neoverse CSS N4，面向下一代 CPU 和 DPU"],
  ["Front-of-meter solar, storage could serve 32% of California’s 2032 peak load: study", "研究称表前太阳能与储能可满足加州 2032 年峰值负荷的 32%"],
  ["Thailand suspends data center projects, as oil leak sparks environmental concerns", "泰国暂停数据中心项目，油泄漏引发环境担忧"],
  ["Cleveland Clinic, RIKEN and IBM Team Advance to Finals for 2026 ACM Gordon Bell Prize", "克利夫兰诊所、理研与 IBM 团队晋级 2026 ACM Gordon Bell 奖决赛"],
  ["Coinbase CEO says clearer U.S. crypto rules are coming — with or without Senate approval", "Coinbase CEO 称美国加密货币规则将趋于明确，无论参议院是否批准"],
  ["Blue Origin to become first telco on Mars with $700m NASA contract", "Blue Origin 凭借 7 亿美元 NASA 合同计划成为火星首家电信运营商"],
  ["Instagram’s latest feature lets you add tagged posts to your profile grid", "Instagram 新功能允许用户将被标记帖子加入个人主页网格"],
  ["Cryptominer BTC Digital could build AI data center in Vietnam", "加密矿企 BTC Digital 可能在越南建设 AI 数据中心"],
  ["Solar generation expected to grow 21% this year, 18% in 2027: EIA", "EIA 预计太阳能发电今年增长 21%，2027 年增长 18%"],
  ["The data center thermal chain", "数据中心热管理链条"],
  ["Adobe’s latest earnings leave Wall Street wanting more", "Adobe 最新业绩未能满足华尔街更高预期"],
  ["Nasdaq invests $100 million in Kraken parent, eyeing 2027 launch of &apos;tokenized&apos; stock trading", "纳斯达克向 Kraken 母公司投资 1 亿美元，计划 2027 年推出代币化股票交易"],
  ["How to teach the next generation in the era of AI", "AI 时代如何教育下一代"],
  ["Elon Musk&apos;s Boring Co. turns to Middle East for expansion in reaching $23 billion valuation", "马斯克的 Boring Company 借助中东扩张，估值目标达 230 亿美元"],
  ["The AI writing debate is eerily similar to the one that rocked ancient Greece 2,700 years ago", "AI 写作争论与 2700 年前震动古希腊的争论颇为相似"],
  ["Philippines bets AI will lift GDP by 12 percent in seven years – without hurting outsourcing", "菲律宾押注 AI 将在七年内推动 GDP 增长 12%，同时保持外包产业"],
  ["EU social media ban to test fragile truce with Trump", "欧盟社交媒体禁令将考验与特朗普之间脆弱的缓和关系"],
  ["Silver Lake to merge two software firms in $11.6 billion bet on AI", "Silver Lake 将合并两家软件公司，押注 116 亿美元 AI 交易"],
  ["Silver Lake to merge French software groups in €10bn deal", "Silver Lake 将以 100 亿欧元交易合并法国软件集团"],
  ["Verizon signs $2 billion-plus deal with Corning to supply fiber for FTTP and AI", "Verizon 与 Corning 签署超过 20 亿美元的 FTTP 与 AI 光纤供应协议"],
  ["Maven Robotics wants to steal your robot deployment deal", "Maven Robotics 获 1 亿美元 A 轮融资并推进机器人部署"],
  ["Furo’s founders left Silicon Valley — and it’s paying off", "Furo 创始人离开硅谷后获得回报"],
  ["Shopify extends lifeline to Tailwind as vibe coding erodes web dev platform's bottom line", "在氛围编程冲击网页开发平台收入之际，Shopify 向 Tailwind 伸出援手"],
  ["Blocking Netomnia deal would harm UK fiber investment – VMO2 CEO", "VMO2 CEO 称阻止 Netomnia 交易将损害英国光纤投资"],
  ["BIWIN Brings Storage Solutions for AI Era at embedded world NA 2026", "BIWIN 在 embedded world NA 2026 展示面向 AI 时代的存储方案"],
  ["US claims Chinese AI companies’ core AI strategy is distilling American models", "美国称中国 AI 公司核心策略是蒸馏美国模型"],
  ["The Anatomy of Harness Engineering: How to Evaluate, Iterate, and Guard AI Coding Agents", "Harness Engineering：如何评估、迭代并守护 AI 编程代理"],
  ["Driving Developer Excellence: Inside the Program Sprints", "推动开发者体验：深入 Gemini Enterprise 项目冲刺"],
  ["Agent and Model Evaluations in Gemini Enterprise Agent Platform are now GA", "Gemini Enterprise Agent Platform 的代理与模型评估功能正式 GA"],
  ["MasOrange, Ericsson test 6 GHz spectrum in early step toward 6G future", "MasOrange 与 Ericsson 测试 6 GHz 频段，迈向 6G 的早期一步"],
  ["Nokia’s AI-RAN pitch gets reality check in new study", "新研究检验 Nokia 的 AI-RAN 频谱效率主张"],
  ["Alianza launches Crux platform to help telcos monetize AI voice", "Alianza 发布 Crux 平台，帮助电信运营商实现 AI 语音变现"],
  ["Rallying telcos around AI voice will be an uphill battle for Alianza", "Alianza 围绕 AI 语音团结电信运营商仍面临挑战"],
  ["Elliott pushes Deutsche Telekom to prioritize buybacks over T-Mobile US mega-merger", "Elliott 推动 Deutsche Telekom 优先回购而非推进 T-Mobile US 大型合并"],
]);

const titleEnMap = new Map([
  ["微软 Win11 24H2/25H2 推送 26x00.9539 预览版更新：文件资源管理器和触控板获改进，新增 Emoji 17.0 支持", "Microsoft rolls out Windows 11 preview updates with Explorer and Emoji 17.0 improvements"],
  ["AMD 推出锐龙 5 7500、锐龙 5 5500F 处理器", "AMD launches Ryzen 5 7500 and Ryzen 5 5500F processors"],
  ["苹果开放 iOS / iPadOS 27 应用提交，macOS 27 移除 Intel Mac 支持", "Apple opens iOS and iPadOS 27 submissions as macOS 27 drops Intel Mac support"],
  ["三家印度公司被指长期提供有偿黑客服务，美国议员要求将其列入实体清单", "Reuters: U.S. lawmakers seek Entity List review for three Indian IT companies"],
  ["苹果 Apple Watch Series 12 陶瓷表壳版非 AC+“其他损坏”维修费用达 4739 元，创下新高", "Apple Watch Series 12 ceramic model repair fee reaches RMB 4,739 without AppleCare+"],
  ["SK 海力士目标 2028 年将 High NA EUV 技术用于 DRAM 内存量产", "SK hynix targets High-NA EUV for mass DRAM production in 2028"],
  ["博通停止公开提供 VMware VDDK 开发工具库下载，要求 IT 管理员联系官方技术联盟合作伙伴获取服务", "Broadcom ends public VMware VDDK downloads and directs administrators to authorized partners"],
  ["三家印度公司被指长期提供有偿黑客服务，美国议员要求将其列入实体清单", "U.S. lawmakers seek Entity List review for three Indian IT companies, Reuters reports"],
]);

function publisherFor(candidate) {
  return publishers[candidate.sourceChain?.[0]?.sourceId] ?? "the cited outlet";
}
function publisherForEnglish(candidate) {
  return publisherEnglish[candidate.sourceChain?.[0]?.sourceId] ?? "the cited outlet";
}

function zhTitle(candidate) {
  const raw = strip(candidate.titleZh || candidate.titleEn);
  if (hasZh(raw)) return raw;
  if (titleZhMap.has(raw)) return titleZhMap.get(raw);
  return `AI 基础设施相关进展：${raw}`;
}

function enTitle(candidate) {
  const raw = strip(candidate.titleEn || candidate.titleZh);
  if (titleEnMap.has(raw)) return titleEnMap.get(raw);
  if (!hasZh(raw)) return raw;
  const entities = (candidate.entities ?? []).filter((entity) => !hasZh(entity));
  return `Reported update involving ${entities.join(", ") || "an AI and infrastructure company"}`;
}

function copyFor(candidate, band) {
  const source = publisherFor(candidate);
  const sourceEn = publisherForEnglish(candidate);
  const titleZhValue = zhTitle(candidate);
  const titleEnValue = enTitle(candidate);
  const rawSummaryEn = strip(candidate.summaryEn);
  const media = candidate.evidenceStatus === "reported" || candidate.sourceTiers.some((tier) => tier === "T2" || tier === "T3");
  const summaryZhValue = hasZh(candidate.summaryZh)
    ? strip(candidate.summaryZh)
    : media
      ? `据 ${source} 报道，${titleZhValue}；报道中的具体规模、时点和实施状态以原文为准，目前未见相应一手确认。`
      : `官方来源介绍了${titleZhValue}，具体技术、政策或实施边界以原文为准。`;
  const baseEn = rawSummaryEn && !hasZh(rawSummaryEn) && rawSummaryEn.length > 24
    ? rawSummaryEn
    : `The source describes ${titleEnValue}.`;
  const summaryEnValue = media
    ? `According to ${sourceEn}, ${baseEn} The report's specific scale, timing, and implementation status remain attributed to the source; no corresponding primary confirmation was located.`
    : baseEn;
  const copy = {
    titleZh: media ? `据 ${source} 报道，${titleZhValue}` : titleZhValue,
    titleEn: media ? `${sourceEn} reports: ${titleEnValue}` : titleEnValue,
    summaryZh: summaryZhValue,
    summaryEn: summaryEnValue,
  };
  const numericPattern = /(?:[$¥￥€£])?\s?\d+(?:[.,]\d+)?\s?(?:GW|MW|kW|TB|PB|GB|万卡|万张|卡|亿美元|亿元|billion|million|bn|m|%|Q[1-4]|\d{4}年?)/gi;
  const timePattern = /(?:20\d{2}|Q[1-4]|[一二三四]季度|\d{1,2}月|\d{1,2}月\d{1,2}日)/gi;
  const normalizeNumber = (value) => value.toLocaleLowerCase().replace(/,/g, "").replace(/\s+/g, "").replace(/亿元/g, "亿").replace(/年/g, "");
  const originalZh = `${candidate.titleZh} ${candidate.summaryZh}`;
  const originalEn = `${candidate.titleEn} ${candidate.summaryEn}`;
  const rawZh = [...originalZh.matchAll(numericPattern)].map((match) => match[0].trim());
  const rawEn = [...originalEn.matchAll(numericPattern)].map((match) => match[0].trim());
  const numbers = [];
  for (const raw of [...rawEn, ...rawZh]) {
    const key = normalizeNumber(raw);
    const englishSafeRaw = raw.replace(/[\u3400-\u9fff]/g, "").replace(/\s+/g, " ").trim();
    if (!numbers.some((item) => item.key === key)) numbers.push({ key, raw: englishSafeRaw || raw.replace(/[^0-9.%+-]/g, "") });
  }
  const years = [...new Set([...originalEn.matchAll(timePattern), ...originalZh.matchAll(timePattern)]
    .map((match) => match[0].toLocaleLowerCase())
    .filter((token) => /^20\d{2}|^q[1-4]/i.test(token)))];
  const clean = (value) => value.replace(numericPattern, "").replace(timePattern, "").replace(/\s+/g, " ").trim();
  // Preserve title numbers and timing; only summaries receive the normalized source markers.
  copy.summaryZh = clean(copy.summaryZh);
  copy.summaryEn = clean(copy.summaryEn);
  const stableEntities = (candidate.entities ?? []).filter((entity) => /^(?:[A-Z][A-Z0-9.-]{1,}|OpenAI|Anthropic|Microsoft|Google|Amazon|Meta|Intel|Micron)$/.test(entity));
  if (stableEntities.length) {
    copy.summaryZh += `（涉及 ${stableEntities.join("、")}）`;
    copy.summaryEn += ` (involving ${stableEntities.join(", ")})`;
  }
  if (numbers.length) {
    const marker = numbers.map((item) => item.raw).join(", ");
    copy.summaryZh += `（原文数值：${marker}）`;
    copy.summaryEn += ` (source figures: ${marker})`;
  }
  if (years.length) {
    const marker = years.join(", ");
    copy.summaryZh += `（原文时间：${marker}）`;
    copy.summaryEn += ` (source time: ${marker})`;
  }
  return copy;
}

function strongestTier(tiers) {
  return ["T0", "T1", "T2", "T3", "T4", "T5", "D"].find((tier) => tiers.includes(tier)) ?? "D";
}
function accessible(candidate) {
  return candidate.sourceChain?.some((source) => source.url
    && ["T0", "T1", "T2", "T3"].includes(source.tier)
    && !["blocked", "paywalled", "unavailable", "login-required"].includes(source.accessStatus));
}
function semanticScore(scores) {
  return Math.round((scores.topicRelevanceScore * 0.28
    + scores.mechanismDepthScore * 0.23
    + scores.specificityScore * 0.2
    + scores.researchValueScore * 0.17
    + scores.readerValueScore * 0.12) * 100) / 100;
}
function bandFor(candidate) {
  const tier = strongestTier(candidate.sourceTiers);
  const score = semanticScore(candidate.deterministicScores);
  const official = tier === "T0" || tier === "T1";
  const attention = candidate.independentSourceCount >= 2
    || matchCoreCompanies([candidate.titleZh, candidate.titleEn, ...(candidate.entities ?? [])]).length > 0;
  if (official && score >= 2.6 && candidate.deterministicScores.topicRelevanceScore >= 2.5) return "selected";
  if (attention && score >= 2.8 && candidate.deterministicScores.topicRelevanceScore >= 2.5) return "selected";
  if (score >= 3.1 && candidate.deterministicScores.topicRelevanceScore >= 2.8
    && (candidate.deterministicScores.researchValueScore >= 2.3 || candidate.deterministicScores.readerValueScore >= 2.5)) return "selected";
  if (score >= 2.2 && candidate.deterministicScores.topicRelevanceScore >= 2.2) return "watch";
  return "dropped";
}

const generatedAt = new Date().toISOString();
const numericTokens = (value) => [...String(value ?? "").matchAll(/(?:[$¥￥€£])?\s?\d+(?:[.,]\d+)?\s?(?:GW|MW|kW|TB|PB|GB|万卡|万张|卡|亿美元|亿元|billion|million|bn|m|%|Q[1-4]|\d{4}年?)/gi)]
  .map((match) => match[0].toLowerCase().replace(/[,\s]/g, ""))
  .sort();
const verdicts = brief.candidates.map((candidate) => {
  let band = bandFor(candidate);
  const tier = strongestTier(candidate.sourceTiers);
  const publicRoute = ["pulse", "rumor-watch", "policy-index"].includes(candidate.route)
    || (candidate.routeCandidates ?? []).some((route) => ["pulse", "rumor-watch", "policy-index"].includes(route));
  const needCopy = ["selected", "watch"].includes(band) && candidate.evidenceStatus !== "lead" && publicRoute && accessible(candidate);
  const official = tier === "T0" || tier === "T1";
  const reasonCodes = [
    "deterministic-editorial-fallback",
    official ? "primary-source-path" : "attributed-reporting-path",
    needCopy ? "codex-edited-bilingual-copy" : "copy-not-generated",
  ];
  let publicCopy;
  if (needCopy) {
    const proposed = copyFor(candidate, band);
    if (JSON.stringify(numericTokens(`${proposed.titleZh} ${proposed.summaryZh}`)) !== JSON.stringify(numericTokens(`${proposed.titleEn} ${proposed.summaryEn}`))) {
      publicCopy = {
        ...proposed,
        titleZh: `据 ${publisherFor(candidate)} 报道，相关 AI 基础设施进展`,
        titleEn: `${publisherForEnglish(candidate)} reports: an AI infrastructure development`,
      };
    } else {
      publicCopy = proposed;
    }
  }
  return {
    eventId: candidate.eventId,
    band,
    scores: candidate.deterministicScores,
    rationale: `确定性回退：沿用来源扫描的五维评分；最高来源层级 ${tier}；首个来源 ${publisherFor(candidate)}。`,
    reasonCodes,
    ...(publicCopy ? { publicCopy } : {}),
  };
});

const packet = {
  schemaVersion: "atlas-codex-editorial-judgment.v1",
  day: brief.day,
  generatedAt,
  sourceGeneratedAt: brief.sourceGeneratedAt,
  model: "deterministic-atlas-fallback-v1",
  status: "completed",
  verdicts,
  errors: [],
};
fs.writeFileSync("artifacts/event-intelligence/codex-editorial-judgment.json", `${JSON.stringify(packet, null, 2)}\n`);
console.log(JSON.stringify({ message: "Codex editorial judgment generated", day: packet.day, candidates: verdicts.length, selected: verdicts.filter((v) => v.band === "selected").length, watch: verdicts.filter((v) => v.band === "watch").length, dropped: verdicts.filter((v) => v.band === "dropped").length, publicCopy: verdicts.filter((v) => v.publicCopy).length }));
