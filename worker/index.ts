/** Cloudflare Worker entry point for IDC Atlas. */
import handler from "vinext/server/app-router-entry";

const AIHOT_ENDPOINT = "https://aihot.virxact.com/api/public/items";
const AIHOT_DAILY_ENDPOINT = "https://aihot.virxact.com/api/public/daily";
const AIHOT_USER_AGENT = "aihot-skill/0.3.6 (+https://aihot.virxact.com/aihot-skill/)";
const CWW_ENDPOINT = "https://cwwindex.today/data/latest.json";
const OPENROUTER_MODELS_ENDPOINT = "https://openrouter.ai/api/v1/models?sort=top-weekly";
const ARENA_CODE_ENDPOINT = "https://arena.ai/leaderboard/code/webdev";
const LLMS_TXT = `# IDC Atlas

> IDC Atlas is a bilingual, source-first intelligence site for global data-center construction, AI infrastructure, power, cooling, networking and China AI silicon. Content is for public-information research and industry observation only, not investment advice.

Use original disclosure links attached to individual updates to verify capacity, delivery, commissioning, product specifications and financial claims. The site separates news leads from verified public information. Time-sensitive content is refreshed continuously; dates and status should be checked on the linked source.

## Core pages

- [Chinese intelligence portal](https://idc-index.com/): Compact entry point for the current project pulse, listed-company watch, industry chain and market signals.
- [Project and company pulse](https://idc-index.com/pulse): Full Chinese project pulse, A-share and US-listed company updates, plus the daily AI briefing.
- [Infrastructure center](https://idc-index.com/industry): Topic tabs for the supply chain, NVIDIA and AMD products, China GPU, model demand, campuses and liquid cooling.
- [English investor console](https://idc-index.com/en): US- and global-first overview of project signals, listed-company disclosures, earnings CAPEX watch and market indices.
- [English infrastructure pulse](https://idc-index.com/en/pulse): Verified global projects, leases, US-listed company updates and daily AI-demand signals.
- [English infrastructure industry map](https://idc-index.com/en/industry): Compute, networking, power, cooling, campus capacity and selective China supply-chain coverage.
- [Global Data Center Intelligence](https://idc-index.com/topics/data-center-intelligence): Bilingual guide to global data-center projects and infrastructure signals.
- [China AI Silicon](https://idc-index.com/topics/china-ai-silicon): Bilingual guide to China GPU, DCU, AI accelerators, supernodes and developer ecosystem updates.
- [Methodology and sources](https://idc-index.com/methodology): Source hierarchy, verification principles, update cadence and research boundaries.
- [US tech earnings calendar](https://idc-index.com/calendar): Upcoming cloud, semiconductor and data-center-infrastructure earnings events, CAPEX watch items and source-linked post-results conclusions.
- [IDC Atlas Columns](https://idc-index.com/columns): Chinese index of original, source-linked research on the data-center and AI-infrastructure cycle.
- [IDC Atlas Columns in English](https://idc-index.com/en/columns): English index of original research for global investors.
- [CAPEX Watch: AI infrastructure enters the power era](https://idc-index.com/columns/ai-capex-power): Chinese analysis of hyperscaler spending, grid access, campuses, cooling and commissioning.
- [CAPEX Watch: The AI Buildout Enters Its Power-Hungry Phase](https://idc-index.com/en/columns/ai-capex-power): English edition with source-linked company disclosures and earnings watch items.
- [Lease Watch: Gigawatt leases reshape IDC orders](https://idc-index.com/columns/hyperscale-idc-leases): Chinese analysis of large internet and cloud capacity leases, contract structure, delivery and concentration risk.
- [Lease Watch: Gigawatt Leases Are Reshaping the Data Center Market](https://idc-index.com/en/columns/hyperscale-idc-leases): English edition covering recent CoreWeave, Digital Realty and VNET disclosures.

## Interpretation

- Primary sources control factual claims. News items are discovery signals and may require further verification.
- This site does not provide investment advice, trading recommendations or guarantees about future outcomes.
- Live and daily-snapshot data are distinct from research conclusions; read each item’s source and timestamp before relying on it.
`;
const PRODUCT_IMAGE_SOURCES: Record<string, string> = {
  "/media/china/huawei-atlas-950.jpg": "https://www-file.huawei.com/dam/asset/view/260717-01.png",
  "/media/china/sugon-scalex640.png": "https://img1.mydrivers.com/img/20251223/0dc36481138640e19718364ea19e1254.png",
  "/media/china/moore-longcat.png": "https://mt-website-prod.mthreads.com/uploaded/news/cover/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20260710101818_141_329.png",
  "/media/china/biren-glm52.jpg": "https://cms-prod.birentech.com/img/2026/06/26/1782458556651_WMpfr56V_%E6%99%BA%E8%B0%B11.jpg",
  "/media/china/t-head-roadmap.jpg": "https://np-newspic.dfcfw.com/download/D25485387680011156456_w2148h680.jpg",
};

type SignalKey = "capacity" | "power" | "cooling" | "network" | "policy" | "hardware";
type ChainKey = "compute" | "rack" | "cooling" | "power" | "campus" | "model";
type LifecycleStage = { label: string; state: "done" | "current" | "next" };

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string | null;
  category: string | null;
  score: number | null;
  permalink: string;
  sourceUrl: string | null;
  sourceName: string | null;
  signal: SignalKey;
  curator: "AI HOT" | "官方来源" | "公开来源";
  region?: "中国" | "美国" | "全球";
  milestone?: string;
  scale?: string;
  weeklyHighlight?: boolean;
  listedTicker?: string;
  whyItMatters?: string;
  verifiedAt?: string;
  lifecycle?: LifecycleStage[];
  imageSrc?: string;
  imageAlt?: string;
  imageCredit?: string;
};

type DailySection = { label: string; items: NewsItem[] };
type AihotDaily = {
  date: string;
  canonical: string;
  source: string;
  lead: NewsItem | null;
  sections: DailySection[];
  flashes: NewsItem[];
};

type DailySnapshotMeta = {
  date: string;
  generatedAt: string;
  source: "scheduled" | "bootstrap";
};

type Benchmark = {
  code: "CWW" | "CWWCN";
  name: string;
  level: number;
  dayPct: number;
  ytdPct: number;
  count: number;
};

type SourceRecord = {
  id: string;
  title: string;
  subject: string;
  metric: string;
  status: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
  note: string;
};

type NvidiaProduct = {
  id: string;
  vendor: string;
  model: string;
  form: string;
  spec: string;
  release: string;
  price: string;
  imageSrc?: string;
  imageAlt?: string;
  sourceUrl: string;
};

type OpenRouterUsage = {
  status: "live" | "unavailable";
  period: string;
  asOf: string;
  metric: "weekly-rank";
  sourceUrl: string;
  note: string;
  models: Array<{ id: string; name: string; rank: number; heat: number; url: string }>;
};

type ArenaCodeLeaderboard = {
  status: "live" | "unavailable";
  asOf: string;
  category: "webdev";
  sourceUrl: string;
  note: string;
  models: Array<{ rank: number; name: string; organization: string; score: number; votes: number; chinaLab: boolean }>;
};

type AiAdoption = {
  asOf: "2026 Q1";
  sharePct: 17.8;
  cadence: string;
  sourceName: "Microsoft AI Economy Institute";
  sourceUrl: string;
  dataUrl: string;
  visualCredit: "Damian Player";
  visualCreditUrl: string;
  note: string;
  series: Array<{ period: string; sharePct: number }>;
};

type SupernodeProduct = {
  id: string;
  vendor: string;
  name: string;
  status: string;
  imageSrc: string;
  imageAlt: string;
  imageCredit: string;
  imageFit?: "cover" | "contain";
  headlineMetric: string;
  specs: Array<{ label: string; value: string }>;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  secondarySourceName?: string;
  secondarySourceUrl?: string;
};

type MnaDeal = {
  id: string;
  announcedAt: string;
  buyer: string;
  target: string;
  value: string;
  capacity: string;
  region: string;
  status: string;
  statusAsOf: string;
  valueBasis: string;
  capacityBasis: string;
  rationale: string;
  sourceName: string;
  sourceUrl: string;
};

type TrackedSource = {
  id: string;
  name: string;
  scope: string;
  mode: string;
  sourceUrl: string;
};

type CalendarEvent = {
  id: string;
  startsAt: string;
  company: string;
  ticker: string;
  sector: string;
  description: string;
  focus: string;
  sourceName: string;
  sourceUrl: string;
  conclusion?: {
    summary: string;
    summaryEn?: string;
    sourceName: string;
    sourceUrl: string;
  };
};

type JsonObject = { [key: string]: unknown };

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function classifySignal(title: string, summary: string): SignalKey {
  const text = `${title} ${summary}`.toLowerCase();
  const groups: Array<[SignalKey, string[]]> = [
    ["power", ["电力", "电费", "电网", "能源", "核电", "天然气", "power", "energy", "grid"]],
    ["cooling", ["液冷", "冷却", "温控", "散热", "cooling", "thermal"]],
    ["policy", ["暂停", "审批", "监管", "禁令", "政策", "许可", "regulation", "permit", "moratorium"]],
    ["network", ["光模块", "交换机", "网络", "互联", "network", "optical", "ethernet"]],
    ["hardware", ["内存", "存储", "服务器", "gpu", "hbm", "memory", "storage", "server"]],
  ];
  return groups.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))?.[0] ?? "capacity";
}

function parseAihotItems(items: unknown[], take: number): NewsItem[] {
  return items.flatMap((raw, index): NewsItem[] => {
    if (!isObject(raw)) return [];
    const title = stringValue(raw.title);
    const permalink = stringValue(raw.permalink) ?? (isObject(raw.attribution) ? stringValue(raw.attribution.canonical) : null) ?? stringValue(raw.sourceUrl) ?? stringValue(raw.url);
    if (!title || !permalink) return [];
    const summary = stringValue(raw.summary) ?? "";
    return [{
      id: stringValue(raw.id) ?? `aihot-${index}-${title.slice(0, 16)}`,
      title,
      summary,
      publishedAt: stringValue(raw.publishedAt),
      category: stringValue(raw.category),
      score: numberValue(raw.score),
      permalink,
      sourceUrl: stringValue(raw.url) ?? stringValue(raw.sourceUrl),
      sourceName: stringValue(raw.source) ?? stringValue(raw.sourceName),
      signal: classifySignal(title, summary),
      curator: "AI HOT",
    }];
  }).slice(0, take);
}

async function fetchAihotNews(query: string, take = 8, windowHours = 72): Promise<NewsItem[]> {
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1_000).toISOString();
  const url = new URL(AIHOT_ENDPOINT);
  url.searchParams.set("mode", "selected");
  url.searchParams.set("q", query);
  url.searchParams.set("since", since);
  url.searchParams.set("take", "20");

  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": AIHOT_USER_AGENT },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`AI HOT HTTP ${response.status}`);

  const payload: unknown = await response.json();
  if (!isObject(payload) || !Array.isArray(payload.items)) throw new Error("AI HOT payload invalid");

  return parseAihotItems(payload.items, take);
}

async function fetchAihotCategory(category: string, take = 8): Promise<NewsItem[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1_000).toISOString();
  const url = new URL(AIHOT_ENDPOINT);
  url.searchParams.set("mode", "selected");
  url.searchParams.set("category", category);
  url.searchParams.set("since", since);
  url.searchParams.set("take", String(take));

  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": AIHOT_USER_AGENT },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`AI HOT category HTTP ${response.status}`);
  const payload: unknown = await response.json();
  if (!isObject(payload) || !Array.isArray(payload.items)) throw new Error("AI HOT category payload invalid");
  return parseAihotItems(payload.items, take);
}

async function fetchAihotDaily(): Promise<AihotDaily> {
  const headers = { Accept: "application/json", "User-Agent": AIHOT_USER_AGENT };
  let response = await fetch(AIHOT_DAILY_ENDPOINT, {
    headers,
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status === 404) {
    const archiveResponse = await fetch("https://aihot.virxact.com/api/public/dailies?take=1", {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    const archive: unknown = archiveResponse.ok ? await archiveResponse.json() : null;
    const latest = isObject(archive) && Array.isArray(archive.items) && isObject(archive.items[0])
      ? stringValue(archive.items[0].date)
      : null;
    if (latest) response = await fetch(`${AIHOT_DAILY_ENDPOINT}/${latest}`, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
  }
  if (!response.ok) throw new Error(`AI HOT daily HTTP ${response.status}`);
  const payload: unknown = await response.json();
  if (!isObject(payload) || !Array.isArray(payload.sections)) throw new Error("AI HOT daily payload invalid");

  const attribution = isObject(payload.attribution) ? payload.attribution : {};
  const sections = payload.sections.flatMap((raw): DailySection[] => {
    if (!isObject(raw) || !Array.isArray(raw.items)) return [];
    const label = stringValue(raw.label);
    if (!label) return [];
    return [{ label, items: parseAihotItems(raw.items, 8) }];
  }).filter((section) => section.items.length > 0);
  const date = stringValue(payload.date);
  const canonical = stringValue(attribution.canonical);
  if (!date || !canonical) throw new Error("AI HOT daily attribution missing");
  return {
    date,
    canonical,
    source: stringValue(attribution.source) ?? "AI HOT",
    lead: isObject(payload.lead) ? (parseAihotItems([payload.lead], 1)[0] ?? null) : null,
    sections,
    flashes: Array.isArray(payload.flashes) ? parseAihotItems(payload.flashes, 6) : [],
  };
}

async function fetchCwwBenchmark(): Promise<{ benchmarks: Benchmark[]; date: string | null; methodology: string | null }> {
  const response = await fetch(CWW_ENDPOINT, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`CWW HTTP ${response.status}`);

  const payload: unknown = await response.json();
  if (!isObject(payload) || !isObject(payload.indices)) throw new Error("CWW payload invalid");
  const indices = payload.indices;

  const benchmarks = (["CWW", "CWWCN"] as const).flatMap((code): Benchmark[] => {
    const raw = indices[code];
    if (!isObject(raw)) return [];
    const name = stringValue(raw.name);
    const level = numberValue(raw.level);
    const dayPct = numberValue(raw.dayPct);
    const ytdPct = numberValue(raw.ytdPct);
    const count = numberValue(raw.count);
    if (!name || level === null || dayPct === null || ytdPct === null || count === null) return [];
    return [{ code, name, level, dayPct, ytdPct, count }];
  });

  if (!benchmarks.length) throw new Error("CWW indices missing");
  return {
    benchmarks,
    date: stringValue(payload.indexDate),
    methodology: stringValue(payload.methodologyVersion),
  };
}

async function fetchOpenRouterUsage(): Promise<OpenRouterUsage> {
  const response = await fetch(OPENROUTER_MODELS_ENDPOINT, {
    headers: { Accept: "application/json", "User-Agent": "idc-index/1.0 (+https://idc-index.com)" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`OpenRouter HTTP ${response.status}`);

  const payload: unknown = await response.json();
  if (!isObject(payload) || !Array.isArray(payload.data)) throw new Error("OpenRouter payload invalid");
  const heatScale = [100, 88, 78, 69, 61, 54, 48, 42];
  const models = payload.data.flatMap((raw, index): OpenRouterUsage["models"] => {
    if (index >= heatScale.length || !isObject(raw)) return [];
    const id = stringValue(raw.id);
    const name = stringValue(raw.name);
    if (!id || !name) return [];
    return [{
      id,
      name,
      rank: index + 1,
      heat: heatScale[index],
      url: `https://openrouter.ai/${id.replace(/:.*$/, "")}`,
    }];
  });
  if (!models.length) throw new Error("OpenRouter rankings missing");

  return {
    status: "live",
    period: "近7日",
    asOf: new Date().toISOString(),
    metric: "weekly-rank",
    sourceUrl: "https://openrouter.ai/rankings/",
    note: "按 OpenRouter 近一周 Token 使用量公开排序归一化展示，不代表全市场份额。",
    models,
  };
}

async function fetchArenaCodeLeaderboard(): Promise<ArenaCodeLeaderboard> {
  const response = await fetch(ARENA_CODE_ENDPOINT, {
    headers: { Accept: "text/html", "User-Agent": "idc-index/1.0 (+https://idc-index.com)" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Arena HTTP ${response.status}`);

  const html = await response.text();
  const rowPattern = /\\"rank\\":(\d+),\\"rankUpper\\":\d+,\\"rankLower\\":\d+,\\"modelKey\\":\\"[^\"]+\\",\\"modelDisplayName\\":\\"([^\"]+)\\",\\"rating\\":([\d.]+),\\"ratingUpper\\":[\d.]+,\\"ratingLower\\":[\d.]+,\\"votes\\":(\d+),\\"modelOrganization\\":\\"([^\"]+)\\"/g;
  const models: ArenaCodeLeaderboard["models"] = [];
  const seenRanks = new Set<number>();

  for (const match of html.matchAll(rowPattern)) {
    const rank = Number(match[1]);
    if (rank > 8 || seenRanks.has(rank)) continue;
    const organization = match[5];
    models.push({
      rank,
      name: match[2],
      organization,
      score: Math.round(Number(match[3])),
      votes: Number(match[4]),
      chinaLab: /Moonshot|Z\.ai|Alibaba|MiniMax|DeepSeek|Xiaomi|Tencent|ByteDance/i.test(organization),
    });
    seenRanks.add(rank);
  }
  models.sort((a, b) => a.rank - b.rank);
  if (models.length < 5) throw new Error("Arena leaderboard rows missing");

  const dateMatch = html.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, 20\d{2}\b/);
  return {
    status: "live",
    asOf: dateMatch?.[0] ?? new Date().toISOString().slice(0, 10),
    category: "webdev",
    sourceUrl: ARENA_CODE_ENDPOINT,
    note: "Arena 匿名对战投票形成的 WebDev 排名；分数会随新增投票变化，不代表所有编码任务。",
    models,
  };
}

function aiAdoption(): AiAdoption {
  return {
    asOf: "2026 Q1",
    sharePct: 17.8,
    cadence: "季度追踪 · 随报告发布更新",
    sourceName: "Microsoft AI Economy Institute",
    sourceUrl: "https://blogs.microsoft.com/on-the-issues/2026/05/07/the-state-of-global-ai-diffusion-in-2026/",
    dataUrl: "https://github.com/microsoft/ai-diffusion-report",
    visualCredit: "Damian Player",
    visualCreditUrl: "https://www.damianplayer.com/",
    note: "微软以 15–64 岁工作年龄人口为基准，使用匿名汇总遥测并校正设备、网络渗透率与人口差异；该指标随报告发布更新，通常每 3–6 个月一次。",
    series: [
      { period: "2025 H1", sharePct: 15.1 },
      { period: "2025 H2", sharePct: 16.3 },
      { period: "2026 Q1", sharePct: 17.8 },
    ],
  };
}

function supernodeProducts(): SupernodeProduct[] {
  return [
    {
      id: "huawei-atlas-superpod-roadmap",
      vendor: "华为昇腾",
      name: "Atlas 900 A3 → Atlas 950 SuperPoD",
      status: "现有部署 → 2026 真机",
      imageSrc: "/media/china/huawei-atlas-950.jpg",
      imageAlt: "华为 Atlas 950 SuperPoD 官方展示图",
      imageCredit: "华为官方",
      headlineMetric: "384 → 1024 NPU",
      specs: [
        { label: "Atlas 950", value: "1 EFLOPS FP8" },
        { label: "统一内存", value: "256 TB" },
        { label: "Atlas 900 A3", value: "300+ 套部署" },
      ],
      summary: "华为把昇腾路线从 Atlas 900 A3 的 384 卡液冷超节点，推进到 Atlas 950 的 1024 卡系统，竞争焦点转向互联、统一内存与系统级扩展。",
      sourceName: "华为",
      sourceUrl: "https://www.huawei.com/cn/news/2026/7/atlas-950-superpod",
    },
    {
      id: "sugon-scalex640",
      vendor: "中科曙光",
      name: "scaleX640 超节点",
      status: "已发布 · 万卡集群核心单元",
      imageSrc: "/media/china/sugon-scalex640.png",
      imageAlt: "中科曙光 scaleX640 超节点产品展示图",
      imageCredit: "中科曙光 / 快科技",
      headlineMetric: "640 卡 / 单机柜",
      specs: [
        { label: "液冷 PUE", value: "1.04" },
        { label: "MoE 性能", value: "+30–40%" },
        { label: "集群扩展", value: "10,240 卡" },
      ],
      summary: "scaleX640 采用浸没相变液冷和高密度互联，可由 16 个节点扩展为万卡集群；其价值在于兼容多品牌加速卡并降低大模型集群的部署门槛。",
      sourceName: "中科曙光",
      sourceUrl: "https://www.sugon.com/x640",
    },
    {
      id: "alibaba-panjiu-al128",
      vendor: "阿里平头哥 / 阿里云",
      name: "真武 M890 / 磐久 AL128",
      status: "2026 阿里云峰会发布",
      imageSrc: "/media/china/t-head-roadmap.jpg",
      imageAlt: "平头哥真武系列 AI 芯片路线图",
      imageCredit: "阿里云峰会 / 第一财经",
      imageFit: "contain",
      headlineMetric: "128 卡超节点",
      specs: [
        { label: "单卡显存", value: "144 GB" },
        { label: "片间互联", value: "800 GB/s" },
        { label: "后续路线", value: "V900 / J900" },
      ],
      summary: "真武 M890 配合 ICN Switch 1.0 构成磐久 AL128 超节点；阿里官方财报同时确认平头哥自研 GPU 已规模化量产，覆盖训练、微调和推理。",
      sourceName: "36Kr",
      sourceUrl: "https://www.36kr.com/p/3817305707430790",
      secondarySourceName: "阿里巴巴财报",
      secondarySourceUrl: "https://www.alibabagroup.com/zh-HK/document-1971014025827319808",
    },
  ];
}

function capacityRadar(): SourceRecord[] {
  return [
    {
      id: "digital-realty-q2-2026-capacity",
      title: "Digital Realty Q2 披露新增园区地块与北弗吉尼亚 288MW 资产权益",
      subject: "Digital Realty · NYSE: DLR",
      metric: "亚特兰大园区 >1GW IT · 北弗州 288MW IT",
      status: "收购 / 扩容推进",
      publishedAt: "2026-07-23",
      sourceName: "Digital Realty",
      sourceUrl: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-second-quarter-2026-results",
      note: "公司披露已取得亚特兰大相邻地块，合计可支持超过 1GW IT 容量；同时完成北弗吉尼亚三座已出租数据中心 64% 权益收购，对应 288MW IT 容量。",
    },
    {
      id: "cleanspark-sandersville-175mw",
      title: "CleanSpark Sandersville AI 数据中心园区",
      subject: "CleanSpark · Nasdaq: CLSK",
      metric: "175 MW 关键 IT 负载",
      status: "20 年租约签署",
      publishedAt: "2026-07-14",
      sourceName: "CleanSpark",
      sourceUrl: "https://investors.cleanspark.com/news/news-details/2026/CleanSpark-Secures-Twenty-Year-Lease-with-High-Investment-Grade-Global-Technology-Company-for-Data-Center-in-Sandersville-Georgia/default.aspx",
      note: "基础租期合同收入约 66 亿美元，预计从 2027 年第四季度起分期交付；建设和融资仍是后续关键节点。",
    },
    {
      id: "meta-hyperion-5gw-expansion",
      title: "Meta 路易斯安那 Hyperion 数据中心园区",
      subject: "Meta · Richland Parish",
      metric: "5 GW 计算容量目标",
      status: "在建 · 扩建",
      publishedAt: "2026-07-13",
      sourceName: "Meta",
      sourceUrl: "https://about.fb.com/news/2026/07/teachers-local-businesses-win-as-meta-expands-louisiana-data-center/",
      note: "Meta 将园区目标扩至 5GW，区域投资超过 500 亿美元；项目自 2024 年 12 月开工并继续分期建设。",
    },
    {
      id: "galaxy-helios-phase-1",
      title: "Galaxy Helios 西德州数据中心园区",
      subject: "Galaxy Digital · Nasdaq: GLXY",
      metric: "133 MW IT 已交付",
      status: "一期投运",
      publishedAt: "2026-07-06",
      sourceName: "Galaxy",
      sourceUrl: "https://www.galaxy.com/newsroom/galaxy-completes-phase-i-of-its-helios-data-center-campus",
      note: "一期向 CoreWeave 交付 133MW 关键 IT 负载并开始计租；二期 260MW 正在建设，预计 2027 年上半年开始交付。",
    },
    {
      id: "cmcc-jiashan-first-delivery",
      title: "中国移动长三角（嘉善）智算中心一期",
      subject: "中国移动嘉善智算中心",
      metric: "15000 PFLOPS 首期算力",
      status: "首批验收交付",
      publishedAt: "2026-07-02",
      sourceName: "人民网浙江频道",
      sourceUrl: "https://zj.people.com.cn/n2/2026/0702/c186327-41627255.html",
      note: "项目一期总投资约 50 亿元，整体按 5 万卡级集群规划；首批验收后进入算力上架与利用率爬坡阶段。",
    },
    {
      id: "ningxia-zhongwei-b-202mw",
      title: "中国移动（宁夏中卫）数据中心 B 园区",
      subject: "中国移动宁夏中卫",
      metric: "332 MW IT 在运",
      status: "园区全面投用",
      publishedAt: "2026-06-26",
      sourceName: "国家能源局西北监管局",
      sourceUrl: "https://xbj.nea.gov.cn/dtyw/hyxx/202606/t20260626_303639.html",
      note: "B 园区新增 202MW 后，整体园区投产 IT 总功率达到 332MW；绿电使用率稳定在 80% 以上。",
    },
    {
      id: "datang-zhongwei-500mw",
      title: "大唐中卫云基地数据中心绿电供应项目",
      subject: "大唐中卫新能源",
      metric: "500 MW 光伏已投运",
      status: "绿电直供投运",
      publishedAt: "2026-05-07",
      sourceName: "国务院国资委 / 中国大唐",
      sourceUrl: "https://wap.sasac.gov.cn/n2588025/n2588124/c35420702/content.html",
      note: "50万千瓦光伏已全容量并网，150万千瓦风电计划 2026 年 9 月并网；一期合计 2GW 为中卫云基地供电。",
    },
    {
      id: "unicom-wujiang-phase-1-epc",
      title: "中国联通长三角（吴江）智算中心一期 EPC",
      subject: "中国联通苏州市分公司",
      metric: "容量待披露",
      status: "招标已发布",
      publishedAt: "2026-07-16",
      sourceName: "江苏省公共资源交易网",
      sourceUrl: "https://jsggzy.jszwfw.gov.cn/jyxx/003001/003001001/20260716/e9c2e43a-d76d-4db4-a6cd-ed711463025d.html",
      note: "一期新建 DC1 机房楼约 5.52 万平方米，计划 2026 年 10 月开工、2027 年 11 月竣工。",
    },
  ];
}

function coolingProgress(): SourceRecord[] {
  return [
    {
      id: "vertiv-tognana-cooling-expansion",
      title: "Vertiv 扩建意大利 AI 数据中心冷却制造与测试能力",
      subject: "Vertiv · NYSE: VRT",
      metric: "2026 年底冷水机产能预计翻倍",
      status: "制造扩产",
      publishedAt: "2026-07-21",
      sourceName: "Vertiv",
      sourceUrl: "https://www.vertiv.com/en-us/about/news-and-events/corporate-news/2026/vertiv-expands-global-manufacturing-capacity-for-ai-ready-data-center-cooling-solutions/",
      note: "Tognana 园区扩建将提升冷水机制造和集成测试能力；新大型实验室计划于 2027 年初完成，用于验证高密度负载下与液冷系统的集成。",
    },
    {
      id: "odcc-liquid-research",
      title: "液冷冷却液产业全景研究启动",
      subject: "ODCC / 中国移动设计院",
      metric: "标准与供应链",
      status: "产业研究",
      publishedAt: "2026-01-09",
      sourceName: "开放数据中心委员会",
      sourceUrl: "https://www.odcc.org.cn/news/p-2009441893269463042.html",
      note: "从冷却液材料、验证与应用维度建立行业参考，仍属于产业协同阶段。",
    },
    {
      id: "zte-liquid-cdu",
      title: "大容量模块化液冷 CDU 发布",
      subject: "中兴通讯",
      metric: "CDU / 冷板液冷",
      status: "产品化",
      publishedAt: "2026-03-06",
      sourceName: "中兴通讯",
      sourceUrl: "https://www.zte.com.cn/china/about/news/20260306C2.html",
      note: "面向超大规模智算中心的模块化液冷 CDU，说明供给侧已推进到标准化模块交付。",
    },
    {
      id: "unicom-ningxia-liquid",
      title: "中卫云数据中心 DC8 配套新建工程（液冷）",
      subject: "中国联通宁夏",
      metric: "机电与暖通 EPC",
      status: "工程落地",
      publishedAt: "2026-06-03",
      sourceName: "C114 / 新浪科技",
      sourceUrl: "https://finance.sina.com.cn/tech/roll/2026-06-03/doc-iniacnus0910829.shtml",
      note: "公开报道显示机电与暖通 EPC 已出现液冷专项工程；仍需以最终合同与投运披露为准。",
    },
  ];
}

function nvidiaProducts(): NvidiaProduct[] {
  return [
    {
      id: "gb200-nvl72",
      vendor: "NVIDIA",
      model: "GB200 NVL72",
      form: "液冷机柜级系统",
      spec: "面向大规模训练与推理的 Blackwell 平台",
      release: "已进入部署周期",
      price: "官方未公布统一 MSRP · 项目询价",
      imageSrc: "/products/nvidia-gb200-nvl72.jpg",
      imageAlt: "NVIDIA GB200 NVL72 液冷机柜官方产品图",
      sourceUrl: "https://www.nvidia.com/en-gb/data-center/gb200-nvl72/",
    },
    {
      id: "dgx-b200",
      vendor: "NVIDIA",
      model: "DGX B200",
      form: "AI 工厂计算节点",
      spec: "Blackwell 架构 DGX 系统",
      release: "官方产品页持续更新",
      price: "官方未公布统一 MSRP · 项目询价",
      imageSrc: "/products/nvidia-dgx-b200.jpg",
      imageAlt: "NVIDIA DGX B200 官方产品图",
      sourceUrl: "https://www.nvidia.com/en-us/data-center/dgx-b200/",
    },
    {
      id: "vera-rubin",
      vendor: "NVIDIA",
      model: "Vera Rubin",
      form: "下一代 AI 工厂平台",
      spec: "Vera CPU、Rubin GPU 与互联芯片组合",
      release: "GTC 2026 发布节奏",
      price: "官方未披露定价",
      imageSrc: "/products/nvidia-vera-rubin.jpg",
      imageAlt: "NVIDIA Vera Rubin 平台官方产品图",
      sourceUrl: "https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform",
    },
    {
      id: "amd-helios-mi400-2026",
      vendor: "AMD",
      model: "Instinct MI400 / Helios",
      form: "面向前沿 AI 的机架级平台",
      spec: "MI400 系列 GPU、EPYC 9006、Pensando 网络与 ROCm 开放软件",
      release: "2026-07-23 · Advancing AI 发布",
      price: "官方未披露统一定价",
      sourceUrl: "https://newsroom.amd.com/press-kits/advancing-ai-2026-all-news/",
    },
  ];
}

function officialChinaChipNews(): NewsItem[] {
  return [
    {
      id: "cxmt-star-market-listing-2026-07",
      title: "长鑫科技登陆科创板，成为 A 股 DRAM 制造标的",
      summary: "长鑫科技于 7 月 27 日在上交所科创板上市交易，证券简称“长鑫科技”，证券代码 688825；公告显示，450,303.8971 万股自当日起上市交易。",
      publishedAt: "2026-07-27T09:00:00+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://stcn.com/xinpi/jg-detail.html?id=9272870",
      sourceUrl: "https://stcn.com/xinpi/jg-detail.html?id=9272870",
      sourceName: "上海证券交易所",
      signal: "hardware",
      curator: "官方来源",
      region: "中国",
      listedTicker: "长鑫科技 · 688825.SH",
      milestone: "科创板上市交易",
      scale: "450,303.8971 万股首日上市流通",
      whyItMatters: "长鑫为国内 DRAM 制造商，上市后其产能建设、服务器 DRAM 产品结构与先进存储研发将形成更连续的公开披露线索；这不是投资建议。",
    },
    {
      id: "huawei-atlas-950-superpod-waic-2026",
      title: "昇腾 950 超节点真机首次亮相，扩展至 1024 卡",
      summary: "华为在 WAIC 2026 首次公开展示 Atlas 950 SuperPoD 真机，披露 1024 卡、1 EFLOPS FP8 算力和 256TB 全局统一内存编址空间。",
      publishedAt: "2026-07-17T09:00:00+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://www.huawei.com/cn/news/2026/7/atlas-950-superpod",
      sourceUrl: "https://www.huawei.com/cn/news/2026/7/atlas-950-superpod",
      sourceName: "华为",
      signal: "hardware",
      curator: "官方来源",
      region: "中国",
      milestone: "首次真机亮相",
      scale: "1024 卡 · 1 EFLOPS FP8",
      whyItMatters: "国产 AI 芯片竞争正在从单卡参数转向超节点、互联、内存和系统软件的整体能力。",
      imageSrc: "/media/china/huawei-atlas-950.jpg",
      imageAlt: "华为 Atlas 950 SuperPoD 官方展示图",
      imageCredit: "华为官方",
    },
    {
      id: "hygon-dcu-4-development-2026-07",
      title: "海光信息：DCU 深算四号相关产品研发进展顺利",
      summary: "海光信息在交易所互动平台回应称相关产品研发进展顺利，但没有确认是否已开始向客户交付。",
      publishedAt: "2026-07-10T15:58:21+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://yuanchuang.10jqka.com.cn/20260710/c678099376.shtml",
      sourceUrl: "https://yuanchuang.10jqka.com.cn/20260710/c678099376.shtml",
      sourceName: "上证e互动 / 同花顺 iNews",
      signal: "hardware",
      curator: "公开来源",
      region: "中国",
      listedTicker: "海光信息 · 688041.SH",
      milestone: "研发推进",
      scale: "交付状态未披露",
      whyItMatters: "深算四号的研发与后续交付，将影响国产 DCU 在大型智算集群中的下一阶段供给节奏。",
      imageSrc: "/media/china/hygon-dcu-visual.png",
      imageAlt: "用于海光 DCU 研发进展的国产 AI 加速卡示意图",
      imageCredit: "IDC Atlas 原创示意图",
    },
    {
      id: "moore-threads-longcat-2-day0",
      title: "摩尔线程完成美团 LongCat-2.0 Day-0 适配",
      summary: "摩尔线程宣布完成美团 LongCat-2.0 的快速适配，继续推进国产全功能 GPU 对前沿模型的同步支持。",
      publishedAt: "2026-07-06T09:00:00+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://www.mthreads.com/news/327",
      sourceUrl: "https://www.mthreads.com/news/327",
      sourceName: "摩尔线程",
      signal: "hardware",
      curator: "官方来源",
      region: "中国",
      listedTicker: "摩尔线程 · 688795.SH",
      milestone: "模型 Day-0 适配",
      scale: "LongCat-2.0",
      whyItMatters: "模型发布后的适配速度，是衡量国产 GPU 软件栈成熟度和实际部署门槛的重要信号。",
      imageSrc: "/media/china/moore-longcat.png",
      imageAlt: "摩尔线程 LongCat-2.0 适配官方发布配图",
      imageCredit: "摩尔线程官方",
    },
    {
      id: "biren-glm-52-day0",
      title: "壁仞科技壁砺 166 系列完成 GLM-5.2 Day0 适配",
      summary: "壁仞科技基于 vLLM 完成 GLM-5.2 推理适配，并披露 BIRENSUPA 软件栈已支持 500 多个 AI 模型。",
      publishedAt: "2026-06-26T15:25:00+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://www.birentech.com/news/cxrfex7rmzwuuhx1oedkdmsq/",
      sourceUrl: "https://www.birentech.com/news/cxrfex7rmzwuuhx1oedkdmsq/",
      sourceName: "壁仞科技",
      signal: "hardware",
      curator: "官方来源",
      region: "中国",
      listedTicker: "壁仞科技 · 06082.HK",
      milestone: "模型 Day0 适配",
      scale: "500+ AI 模型",
      whyItMatters: "主流推理框架与模型覆盖度，决定国产 GPGPU 从芯片可用走向集群易用的速度。",
      imageSrc: "/media/china/biren-glm52.jpg",
      imageAlt: "壁仞科技 GLM-5.2 适配官方发布配图",
      imageCredit: "壁仞科技官方",
    },
    {
      id: "metax-mxmaca-38-docs-2026-07",
      title: "沐曦更新 MXMACA 3.8 系列开发者工具链文档",
      summary: "沐曦开发者站集中更新运行时、诊断工具、PyTorch、vLLM、SGLang 与通信库等 MXMACA 3.8 系列文档。",
      publishedAt: "2026-07-01T17:40:00+08:00",
      category: "china-ai-chip",
      score: null,
      permalink: "https://developer.metax-tech.com/doc",
      sourceUrl: "https://developer.metax-tech.com/doc",
      sourceName: "沐曦股份",
      signal: "hardware",
      curator: "官方来源",
      region: "中国",
      listedTicker: "沐曦股份 · 688802.SH",
      milestone: "软件栈文档更新",
      scale: "MXMACA 3.8.x",
      whyItMatters: "框架、编译器、通信库和运维工具的持续更新，是国产 GPU 从硬件可用走向工程可部署的重要基础。",
      imageSrc: "/media/china/metax-c600.jpg",
      imageAlt: "沐曦曦云 C600 通用 GPU 官方产品图",
      imageCredit: "沐曦官方",
    },
  ];
}

function chinaChipPulse(liveNews: NewsItem[], days = 30): NewsItem[] {
  const chinaChip = /寒武纪|海光|昇腾|华为|摩尔线程|沐曦|壁仞|燧原|天数智芯|平头哥|真武|阿里云.{0,6}(?:GPU|芯片)|国产.{0,6}(?:GPU|芯片)|(?:GPU|芯片).{0,6}国产/i;
  return recentNews([
    ...liveNews.filter((item) => chinaChip.test(item.title)),
    ...officialChinaChipNews(),
  ], days, 10).sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
}

function mnaDeals(): MnaDeal[] {
  return [
    {
      id: "stt-gdc-kkr-singtel",
      announcedAt: "2026-02-04",
      buyer: "KKR 领衔财团 / Singtel",
      target: "ST Telemedia Global Data Centres",
      value: "S$138 亿企业价值",
      capacity: "95+ 数据中心 / 11 个市场",
      region: "亚太 / 欧洲",
      status: "已签署 · 待交割",
      statusAsOf: "2026-07-18",
      valueBasis: "企业价值",
      capacityBasis: "标的现有全球设施与市场覆盖",
      rationale: "大型跨区域数据中心平台控制权交易，显著扩充 Singtel 的数字基础设施版图。",
      sourceName: "Singtel",
      sourceUrl: "https://www.singtel.com/about-us/media-centre/news-releases/kkr-led-consortium-with-singtel-group-to-fully-acquire-st-telemedia-global-data-centres",
    },
    {
      id: "stark-sagebrush",
      announcedAt: "2026-06-08",
      buyer: "Stark Power",
      target: "Sagebrush Infrastructure Partners",
      value: "未披露",
      capacity: "5.6 GW 开发管线",
      region: "美国中部",
      status: "已签署 · 待交割",
      statusAsOf: "2026-07-18",
      valueBasis: "交易金额未披露",
      capacityBasis: "五个在建园区的规划 IT 容量",
      rationale: "一次性取得五个在建超大规模园区，并把数据中心开发与现场电源能力整合。",
      sourceName: "Stark Power",
      sourceUrl: "https://www.prnewswire.com/news-releases/stark-power-to-acquire-sagebrush-infrastructure-partners-securing-5-6-gw-us-data-center-pipeline-302793790.html",
    },
    {
      id: "alphabet-intersect",
      announcedAt: "2025-12-22",
      buyer: "Alphabet",
      target: "Intersect",
      value: "$47.5 亿现金 + 承担债务",
      capacity: "数 GW 能源与数据中心项目",
      region: "美国",
      status: "已完成",
      statusAsOf: "2026-03-10",
      valueBasis: "公告现金对价，另承担债务",
      capacityBasis: "纳入交易的在建与开发项目",
      rationale: "通过并购把电源开发与数据中心建设进一步绑定，缩短新增容量的交付周期。",
      sourceName: "TPG",
      sourceUrl: "https://www.tpg.com/news-and-insights/tpg-announces-completion-of-4-75-billion-sale-of-intersect-to-google-launches-ipx-power-as-independent-power-producer",
    },
    {
      id: "aip-aligned",
      announcedAt: "2025-10-15",
      buyer: "AIP（BlackRock / Microsoft / NVIDIA 等）",
      target: "Aligned Data Centers",
      value: "约 $400 亿",
      capacity: "51 个园区 / 超 6.4 GW",
      region: "美国 / 拉丁美洲",
      status: "已完成",
      statusAsOf: "2026-07-21",
      valueBasis: "企业价值（含债务）",
      capacityBasis: "在运及规划容量合计",
      rationale: "AIP、MGX 与 BlackRock GIP 已完成对 Aligned 的 100% 股权收购，并在交割时承诺额外 50 亿美元增长资本支持 AI-ready 容量扩张。",
      sourceName: "Aligned Data Centers / AIP / MGX / BlackRock GIP",
      sourceUrl: "https://aligneddc.com/press-release/aip-mgx-and-blackrocks-gip-close-acquisition-of-aligned-data-centers/",
    },
  ];
}

function officialProjectNews(records: SourceRecord[]): NewsItem[] {
  return records.map((record) => ({
    id: `official-${record.id}`,
    title: record.title,
    summary: `${record.status} · ${record.metric}。${record.note}`,
    publishedAt: `${record.publishedAt}T00:00:00+08:00`,
    category: "idc-project",
    score: null,
    permalink: record.sourceUrl,
    sourceUrl: record.sourceUrl,
    sourceName: record.sourceName,
    signal: record.metric.includes("绿电") ? "power" : "capacity",
    curator: "官方来源",
  }));
}

function uniqueNews(items: NewsItem[], take = 8): NewsItem[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values()).slice(0, take);
}

function trackedSources(): TrackedSource[] {
  return [{
    id: "mask-brother-report-60s",
    name: "口罩哥研报60秒",
    scope: "模型效率 · KDA · 算力需求",
    mode: "公众号追踪 · 人工校验",
    sourceUrl: "https://mp.weixin.qq.com/s/ObUwbJR2mLpekMh5PX4l3g",
  }];
}

function trackedSourceNews(): NewsItem[] {
  return [{
    id: "mask-brother-k3-kda-demand",
    title: "KDA 的误读：K3 让算力需求更大，不是更小",
    summary: "围绕 KDA 与模型效率提升的关系，作为观察模型能力演进如何传导至算力需求的补充线索；具体观点请回到原文核验。",
    publishedAt: "2026-07-19T20:53:18+08:00",
    category: "model-demand-watch",
    score: null,
    permalink: "https://mp.weixin.qq.com/s/ObUwbJR2mLpekMh5PX4l3g",
    sourceUrl: "https://mp.weixin.qq.com/s/ObUwbJR2mLpekMh5PX4l3g",
    sourceName: "口罩哥研报60秒",
    signal: "hardware",
    curator: "公开来源",
  }];
}

function recentNews(items: NewsItem[], days: number, take = 3): NewsItem[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1_000;
  return uniqueNews(items.filter((item) => {
    if (!item.publishedAt) return false;
    const publishedAt = new Date(item.publishedAt).getTime();
    return Number.isFinite(publishedAt) && publishedAt >= cutoff && publishedAt <= Date.now() + 24 * 60 * 60 * 1_000;
  }), take);
}

function positiveIdcNews(liveNews: NewsItem[], records: SourceRecord[]): NewsItem[] {
  const positive = /投运|投入运营|建成|封顶|开工|签约|扩建|扩容|新建|部署|上线|获批|交付|租赁|合作|投资|增至|新增|园区|基地/i;
  const negative = /灾难|事故|暂停|短缺|涨价|推高|困难|裁员|封禁|起诉|电费增加/i;
  const livePositive = liveNews.filter((item) => {
    const text = `${item.title} ${item.summary}`;
    return positive.test(text) && !negative.test(text);
  });
  return uniqueNews([...livePositive, ...officialProjectNews(records)], 8);
}

function constructionPulse(): NewsItem[] {
  const items: NewsItem[] = [
    {
      id: "dataport-jingan-quantum-hybrid-platform-waic",
      title: "数据港参与静安量超智融合算力平台项目签约",
      summary: "数据港、思朗科技与玻色量子联合申报的项目入选 WAIC 重点签约项目，依托上海一号智算中心的存量算力底座，推进智算、科算与量算协同调度。",
      publishedAt: "2026-07-23T00:00:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.shanghai.gov.cn/nw15343/20260723/9d9df31d0e4b4a50a3bb16673c55b89b.html",
      sourceUrl: "https://www.shanghai.gov.cn/nw15343/20260723/9d9df31d0e4b4a50a3bb16673c55b89b.html",
      sourceName: "静安区人民政府",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "WAIC 重点项目签约",
      scale: "上海一号智算中心底座",
      listedTicker: "数据港 · 603881.SH",
      whyItMatters: "该项目以存量数据中心算力为底座接入异构资源，后续关注平台实际部署规模、客户导入和调度利用率。",
    },
    {
      id: "unicom-wujiang-phase-1-epc",
      title: "中国联通长三角（吴江）智算中心一期启动 EPC 招标",
      summary: "一期新建 DC1 机房楼，总建筑面积约 5.52 万平方米，计划 2026 年 10 月开工、2027 年 11 月竣工。",
      publishedAt: "2026-07-16T11:13:05+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://jsggzy.jszwfw.gov.cn/jyxx/003001/003001001/20260716/e9c2e43a-d76d-4db4-a6cd-ed711463025d.html",
      sourceUrl: null,
      sourceName: "江苏省公共资源交易网",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "一期 EPC 招标",
      scale: "5.52 万㎡ · 2.78 亿元",
      listedTicker: "中国联通 · 600050.SH",
      whyItMatters: "长三角算力枢纽从规划进入实体采购，后续将逐步形成土建、机电、供配电与制冷订单。",
      lifecycle: [
        { label: "项目备案", state: "done" },
        { label: "EPC 招标", state: "current" },
        { label: "2026-10 开工", state: "next" },
        { label: "2027-11 竣工", state: "next" },
      ],
    },
    {
      id: "crusoe-lancium-childress-1gw",
      title: "Crusoe 与 Lancium 落地德州 Childress 1GW AI 数据中心园区",
      summary: "双方宣布签署具有约束力的开发协议，在德州 Childress 建设一座 1GW AI 数据中心园区。",
      publishedAt: "2026-07-15T09:00:00-05:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.globenewswire.com/news-release/2026/07/15/3327869/0/en/Crusoe-and-Lancium-Announce-1-0-Gigawatt-AI-Data-Center-Campus-in-Childress-Texas.html",
      sourceUrl: null,
      sourceName: "Crusoe / Lancium",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "开发协议签署",
      scale: "1 GW",
    },
    {
      id: "cleanspark-sandersville-175mw-lease",
      title: "CleanSpark 为乔治亚州园区签下 175MW 长期租约",
      summary: "Sandersville 园区与一家投资级全球科技公司签署 20 年三净租赁，预计自 2027 年第四季度起分期交付。",
      publishedAt: "2026-07-14T09:00:00-04:00",
      category: "idc-construction",
      score: null,
      permalink: "https://investors.cleanspark.com/news/news-details/2026/CleanSpark-Secures-Twenty-Year-Lease-with-High-Investment-Grade-Global-Technology-Company-for-Data-Center-in-Sandersville-Georgia/default.aspx",
      sourceUrl: null,
      sourceName: "CleanSpark",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "20 年租约签署",
      scale: "175 MW IT · $66 亿",
      listedTicker: "CleanSpark · CLSK",
      whyItMatters: "20 年租约把开发容量转化为长期收入可见性，也验证了高密度 AI 园区的客户需求。",
      lifecycle: [
        { label: "场址与电力", state: "done" },
        { label: "长期租约", state: "current" },
        { label: "建设交付", state: "next" },
        { label: "2027Q4 起租", state: "next" },
      ],
    },
    {
      id: "meta-hyperion-5gw-expansion",
      title: "Meta 将路易斯安那 Hyperion 园区扩至 5GW",
      summary: "Meta 把 Richland Parish 数据中心的计算容量目标提高到 5GW，区域总投资将超过 500 亿美元。",
      publishedAt: "2026-07-13T09:00:00-05:00",
      category: "idc-construction",
      score: null,
      permalink: "https://about.fb.com/news/2026/07/teachers-local-businesses-win-as-meta-expands-louisiana-data-center/",
      sourceUrl: null,
      sourceName: "Meta",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "扩建",
      scale: "5 GW 计算容量 · $500 亿+",
      listedTicker: "Meta · META",
      whyItMatters: "单体园区进一步迈向多 GW，直接放大电源、液冷、机柜和高速互联的长期采购需求。",
      lifecycle: [
        { label: "2024 开工", state: "done" },
        { label: "在建", state: "current" },
        { label: "扩至 5GW", state: "current" },
        { label: "分期投运", state: "next" },
      ],
    },
    {
      id: "chindata-ulaanqab-operating-update",
      title: "中金数据乌兰察布零碳算力基地已有 10 栋投入运营",
      summary: "园区最新披露显示，规划 12 栋数据中心中已有 10 栋投运，整体规划 14.4 万标准机架与 360MW IT 容量。",
      publishedAt: "2026-07-13T10:00:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://topics.gmw.cn/2026-07/13/content_38882359.htm",
      sourceUrl: null,
      sourceName: "光明网",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "运营进度更新",
      scale: "360 MW IT · 14.4 万机架",
    },
    {
      id: "qts-lancium-hall-county",
      title: "QTS 与 Lancium 宣布德州 Hall County 超大规模园区",
      summary: "新园区预计带来超过 100 亿美元资本投入，成为 Lancium 在德州落地的第二个大型 Clean Campus 项目。",
      publishedAt: "2026-07-13T09:00:00-05:00",
      category: "idc-construction",
      score: null,
      permalink: "https://q.com/news/qts-and-lancium-announce-data-center-campus-in-hall-county-texas/",
      sourceUrl: null,
      sourceName: "QTS / Lancium",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "园区官宣",
      scale: "$100 亿+",
    },
    {
      id: "terawulf-anthropic-401mw-lease",
      title: "Anthropic 锁定 TeraWulf 肯塔基园区约 401MW IT 容量",
      summary: "Anthropic 签署 20 年租赁，Justified Data Campus 计划于 2027 年末至 2028 年初分期交付。",
      publishedAt: "2026-07-06T17:00:00-04:00",
      category: "idc-construction",
      score: null,
      permalink: "https://investors.terawulf.com/sec-filings/all-sec-filings/content/0001104659-26-080583/tm2619468d1_8k.htm",
      sourceUrl: null,
      sourceName: "TeraWulf / SEC",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "20 年租约签署",
      scale: "约 401 MW IT",
      listedTicker: "TeraWulf · WULF",
      whyItMatters: "大模型公司以 20 年合同锁定 401MW IT 负载，使模型需求直接转化为数据中心租赁与建设订单。",
      lifecycle: [
        { label: "项目开发", state: "done" },
        { label: "Anthropic 租约", state: "current" },
        { label: "园区建设", state: "next" },
        { label: "2027-28 交付", state: "next" },
      ],
    },
    {
      id: "galaxy-helios-phase-1-133mw",
      title: "Galaxy Helios 一期向 CoreWeave 交付 133MW IT 负载",
      summary: "西德州 Helios 一期按计划完成 200MW 总电力、133MW 关键 IT 负载交付，园区进入收入运营阶段。",
      publishedAt: "2026-07-06T16:30:00-04:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.galaxy.com/newsroom/galaxy-completes-phase-i-of-its-helios-data-center-campus",
      sourceUrl: null,
      sourceName: "Galaxy",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "一期投运",
      scale: "133 MW IT",
      listedTicker: "Galaxy · GLXY",
      whyItMatters: "一期从建设转入计租运营，成为检验 AI 数据中心资本开支能否兑现为现金流的重要节点。",
      lifecycle: [
        { label: "一期建设", state: "done" },
        { label: "133MW 交付", state: "current" },
        { label: "二期 260MW", state: "next" },
        { label: "后续扩容", state: "next" },
      ],
    },
    {
      id: "wanjie-qinghai-ai-campus",
      title: "万界京峰青海智算中心启动建设",
      summary: "项目规划 9338 个标准机架与 11000P 智算能力，公开信息显示总投资约 40 亿元。",
      publishedAt: "2026-07-06T10:00:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.qhdzzbfw.gov.cn/hain/xwzx/006002/006002001/20260706/12e28719-5177-4928-a4d9-56dd19cd4131.html",
      sourceUrl: null,
      sourceName: "海南州公共资源交易网",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "启动建设",
      scale: "11000P · 9338 机架",
    },
    {
      id: "cmcc-jiashan-first-delivery",
      title: "中国移动长三角（嘉善）智算中心完成首批验收交付",
      summary: "项目一期总投资约 50 亿元，整体规划 5 万卡级集群，首期算力约 15000 PFLOPS。",
      publishedAt: "2026-07-02T09:06:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://zj.people.com.cn/n2/2026/0702/c186327-41627255.html",
      sourceUrl: null,
      sourceName: "人民网浙江频道",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "首批交付",
      scale: "15000 PFLOPS · 50 亿元",
      listedTicker: "中国移动 · 600941.SH / 0941.HK",
      whyItMatters: "首批验收意味着长三角 5 万卡级规划开始形成可调用算力，项目进入持续上架与利用率爬坡阶段。",
      lifecycle: [
        { label: "一期建设", state: "done" },
        { label: "首批验收", state: "current" },
        { label: "算力上架", state: "next" },
        { label: "5 万卡扩容", state: "next" },
      ],
    },
    {
      id: "applied-digital-polaris-forge-1",
      title: "Applied Digital 北达科他园区新增 75MW AI 容量投运",
      summary: "Polaris Forge 1 二号楼一期达到 Ready for Service，园区在运营 AI 容量由此提高到 175MW。",
      publishedAt: "2026-07-01T09:00:00-05:00",
      category: "idc-construction",
      score: null,
      permalink: "https://ir.applieddigital.com/news-events/press-releases/detail/157/applied-digital-delivers-second-building-at-polaris-forge-1",
      sourceUrl: null,
      sourceName: "Applied Digital",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "二号楼一期投运",
      scale: "新增 75 MW · 在运 175 MW",
      listedTicker: "Applied Digital · APLD",
      whyItMatters: "新增容量达到可服务状态，园区由建设进度正式转化为可交付的 AI 托管能力。",
      lifecycle: [
        { label: "一号楼运营", state: "done" },
        { label: "二号楼一期 RFS", state: "current" },
        { label: "后续机房交付", state: "next" },
        { label: "400MW 满建", state: "next" },
      ],
    },
    {
      id: "cmcc-zhongwei-campus-live",
      title: "中国移动宁夏中卫园区全面投用，IT 总功率达 332MW",
      summary: "B 园区正式交付后，整体园区已投产 12 栋机房楼、13.28 万标准机架，智算规模超过 100 EFLOPS。",
      publishedAt: "2026-06-26T15:30:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://xbj.nea.gov.cn/dtyw/hyxx/202606/t20260626_303639.html",
      sourceUrl: null,
      sourceName: "国家能源局西北监管局",
      signal: "power",
      curator: "官方来源",
      region: "中国",
      milestone: "园区全面投用",
      scale: "332 MW IT",
      listedTicker: "中国移动 · 600941.SH / 0941.HK",
      whyItMatters: "园区完成大规模投运并形成 100EFLOPS 以上智算能力，进入利用率、客户导入和绿电成本验证阶段。",
      lifecycle: [
        { label: "园区建设", state: "done" },
        { label: "B 园区交付", state: "done" },
        { label: "全面运营", state: "current" },
        { label: "利用率爬坡", state: "next" },
      ],
    },
    {
      id: "cmcc-beijing-international-information-port-land-6-design",
      title: "中国移动京津冀（北京）国际信息港 6 号地数据中心进入设计阶段",
      summary: "北京市公共资源交易平台公示项目方案、初步及施工图设计中标候选人，项目位于昌平区中国移动国际信息港 6 号地。",
      publishedAt: "2026-06-29T14:00:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://ggzyfw.beijing.gov.cn/jyxxzbhxrgs/20260629/5600768.html",
      sourceUrl: null,
      sourceName: "北京市公共资源交易服务平台",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "设计中标候选人公示",
      scale: "北京国际信息港 6 号地",
      listedTicker: "中国移动 · 600941.SH / 0941.HK",
      whyItMatters: "项目完成设计采购的关键节点，为后续土建、机电及算力设备建设形成明确的落地路径。",
      lifecycle: [
        { label: "项目立项", state: "done" },
        { label: "设计采购", state: "current" },
        { label: "工程建设", state: "next" },
        { label: "分期投运", state: "next" },
      ],
    },
    {
      id: "guangzhou-zhisheng-compute-center-energy-approval",
      title: "广州智晟算力中心获节能审查，计划 11 月投产",
      summary: "项目获广州市发改委原则同意，拟建设 48 个液冷机柜，折合约 1310 个标准机柜，形成 4050PFlops@FP16 智能训练算力。",
      publishedAt: "2026-07-06T00:00:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://fgw.gz.gov.cn/gkmlpt/content/10/10888/post_10888922.html",
      sourceUrl: null,
      sourceName: "广州市发展和改革委员会",
      signal: "cooling",
      curator: "官方来源",
      region: "中国",
      milestone: "节能审查通过",
      scale: "4050PFlops · 约 1310 标准机柜",
      whyItMatters: "项目明确采用高密度液冷机柜并给出投产计划，是广州城区智算基础设施与液冷落地的可核验节点。",
    },
    {
      id: "jindian-cloud-shanghai-colocation-data-center-consulting",
      title: "上海同城数据中心启动全过程咨询招标",
      summary: "金电云（上海）项目启动项目管理及造价咨询招标，规划建设 598 个通算机柜与 61 个 25kW 智算机柜。",
      publishedAt: "2026-06-12T18:09:22+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://jzcg.pbc.gov.cn/freecms/site/rmyh/ggxx/info/2026/12d3427f5d174b78930c588a5fa634e3.html?Type=fzjggg&noticeId=c9275ccd-6646-11f1-88d4-b4055dfb2cc6&noticeType=001011",
      sourceUrl: null,
      sourceName: "中国人民银行采购网",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "全过程咨询招标",
      scale: "659 机柜 · 1.8 亿元",
      whyItMatters: "项目进入建设管理与造价咨询采购，提前释放了通算、智算和机电工程的具体建设参数。",
    },
    {
      id: "amazon-missouri-campus",
      title: "Amazon 宣布在密苏里州建设新数据中心园区",
      summary: "Amazon 计划在 Montgomery County 投资 100 亿美元建设数据中心园区，并配套道路、水务和社区基础设施。",
      publishedAt: "2026-06-15T19:03:00-05:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.aboutamazon.com/news/company-news/amazon-data-center-missouri-new-jobs",
      sourceUrl: null,
      sourceName: "Amazon",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "新园区官宣",
      scale: "$100 亿",
      listedTicker: "Amazon · AMZN",
      whyItMatters: "新区域园区继续扩大 AWS 在美国的基础设施投入，并拉动当地电力、水务和施工资源配置。",
      lifecycle: [
        { label: "选址", state: "done" },
        { label: "投资官宣", state: "current" },
        { label: "园区建设", state: "next" },
        { label: "分期投运", state: "next" },
      ],
    },
    {
      id: "baicheng-ai-compute-live",
      title: "白城先进智算中心正式投产运营",
      summary: "吉林省现阶段建成规模最大的智算中心完成调试并投产，首批算力已交付，目标形成 5000P 智算能力。",
      publishedAt: "2026-06-11T09:38:00+08:00",
      category: "idc-construction",
      score: null,
      permalink: "https://www.jl.gov.cn/szfzt/tzcj/tpxwx/202606/t20260611_3639087.html",
      sourceUrl: null,
      sourceName: "吉林省人民政府",
      signal: "power",
      curator: "官方来源",
      region: "中国",
      milestone: "正式投产",
      scale: "5000P",
    },
  ];

  const now = Date.now();
  const day = 24 * 60 * 60 * 1_000;
  return items
    .filter((item) => item.publishedAt && now - new Date(item.publishedAt).getTime() <= 45 * day)
    .map((item) => ({
      ...item,
      verifiedAt: item.verifiedAt ?? "2026-07-18",
      weeklyHighlight: Boolean(item.publishedAt && now - new Date(item.publishedAt).getTime() <= 7 * day),
    }))
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
}

function listedCompanyPulse(): NewsItem[] {
  const items: NewsItem[] = [
    {
      id: "digital-realty-q2-2026-leasing-capacity",
      title: "Digital Realty Q2 新签订单与积压租金创高，并披露 288MW 北弗州资产收购",
      summary: "公司披露 Q2 签约订单对应年化 GAAP 基础租金 3.07 亿美元，并在 7 月签署两份 hyperscale 租约；期末签约未起租积压租金达 19 亿美元。",
      publishedAt: "2026-07-23T16:05:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-second-quarter-2026-results",
      sourceUrl: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-second-quarter-2026-results",
      sourceName: "Digital Realty",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "Q2 业绩与租赁进展",
      scale: "积压年化租金 $19 亿 · 北弗州 288MW IT",
      listedTicker: "Digital Realty · DLR",
      whyItMatters: "租赁积压与已租满资产收购共同提高未来投运和收入兑现的可见度；后续仍需跟踪起租时点与新增电力接入。",
    },
    {
      id: "dataport-jingan-quantum-hybrid-platform-waic",
      title: "数据港参与静安量超智融合算力平台重点项目签约",
      summary: "数据港、思朗科技与玻色量子联合申报的量超智融合算力平台入选 WAIC 重点签约项目，项目以上海一号智算中心为算力底座。",
      publishedAt: "2026-07-23T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://www.shanghai.gov.cn/nw15343/20260723/9d9df31d0e4b4a50a3bb16673c55b89b.html",
      sourceUrl: "https://www.shanghai.gov.cn/nw15343/20260723/9d9df31d0e4b4a50a3bb16673c55b89b.html",
      sourceName: "静安区人民政府",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "WAIC 重点项目签约",
      scale: "异构算力协同平台",
      listedTicker: "数据港 · 603881.SH",
      whyItMatters: "项目指向存量 IDC 算力与智算、科算、量算资源协同调度，后续以实际部署与商业化进展为准。",
    },
    {
      id: "dongyangguang-compute-service-contract-july",
      title: "东阳光云智算签署 130–150 亿元算力服务采购合同",
      summary: "东莞东阳光云智算将采购、部署高性能算力服务器并提供全周期运维，合同在订单验收后进入为期 60 个月的服务期。",
      publishedAt: "2026-07-10T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://vip.stock.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12441363&stockid=600673",
      sourceUrl: null,
      sourceName: "东阳光公告（上交所披露）",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "算力服务合同签署",
      scale: "130–150 亿元 · 60 个月",
      listedTicker: "东阳光 · 600673.SH",
      whyItMatters: "合同把高性能算力服务器部署、验收和长期运维连接为完整交付链条，后续关注实际订单与验收节奏。",
    },
    {
      id: "runze-reit-expansion-accepted-july",
      title: "润泽科技数据中心 REIT 扩募申请获受理",
      summary: "南方基金公告显示，润泽科技数据中心 REIT 的产品变更暨扩募份额上市申请已获中国证监会和深交所受理。",
      publishedAt: "2026-07-18T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://pdf.dfcfw.com/pdf/H2_AN202607171827058095_1.pdf",
      sourceUrl: null,
      sourceName: "南方基金公告",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "REIT 扩募申请受理",
      scale: "拟注入 A-7 / A-8 数据中心",
      listedTicker: "润泽科技 · 300442.SZ",
      whyItMatters: "申请受理是资产注入流程的监管节点；交易仍须完成注册、交易所审核和持有人大会审议。",
    },
    {
      id: "dataport-compute-service-purchase-june",
      title: "数据港披露采购算力服务事项",
      summary: "上海数据港公告披露采购算力服务事项，反映其围绕算力服务供给的最新采购与运营安排。",
      publishedAt: "2026-06-04T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://www.sse.com.cn/disclosure/listedinfo/announcement/c/new/2026-06-04/603881_20260604_532A.pdf",
      sourceUrl: null,
      sourceName: "上海证券交易所",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "算力服务采购",
      scale: "服务采购推进",
      listedTicker: "数据港 · 603881.SH",
      whyItMatters: "采购动作是数据中心运营商将资源配置转向算力服务的重要可披露节点，具体交付以公司后续公告为准。",
    },
    {
      id: "vnet-hyperscale-orders-may",
      title: "世纪互联披露年内新签 517MW 基地型 IDC 订单",
      summary: "世纪互联一季度披露，年初至今累计新签 517MW，其中环京地区一笔头部互联网客户订单为 510MW。",
      publishedAt: "2026-05-26T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://www.vnet.com/portal/article/index/cid/14/id/1081.html",
      sourceUrl: null,
      sourceName: "世纪互联",
      signal: "capacity",
      curator: "官方来源",
      region: "中国",
      milestone: "基地型 IDC 新签订单",
      scale: "517 MW · 单笔 510 MW",
      listedTicker: "世纪互联 · VNET",
      whyItMatters: "大额预签订单直接提高未来交付与上架的可见度，仍需持续跟踪客户验收、供电和建设进度。",
    },
    {
      id: "gds-creit-langfang-shucheng-expansion",
      title: "万国数据中心 REIT 拟扩募购入廊坊曙成数据中心",
      summary: "南方万国数据中心 REIT 披露拟通过扩募新购入廊坊曙成数据中心项目，标的包括 3 栋数据中心楼及配套动力楼。",
      publishedAt: "2026-07-10T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://finance.sina.com.cn/stock/estate/integration/2026-07-10/doc-inihinfu7082377.shtml?froms=ggmp",
      sourceUrl: null,
      sourceName: "南方基金公告（公开转引）",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "REIT 扩募拟购入资产",
      scale: "3 栋数据中心楼 + 动力楼",
      listedTicker: "万国数据 · GDS / 9698.HK",
      whyItMatters: "若完成审批，资产池将从长三角延伸至京津冀；该事项尚待监管和持有人大会程序完成。",
    },
    {
      id: "aofei-2026-delivery-plan",
      title: "奥飞数据披露 2026 年多个数据中心交付计划",
      summary: "奥飞数据在业绩说明会披露，廊坊固安预计交付 2–3 栋数据中心，无锡数据中心及河北定兴二期也计划在年内交付。",
      publishedAt: "2026-05-08T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://pdf.dfcfw.com/pdf/H2_AN202605081822074118_1.pdf",
      sourceUrl: null,
      sourceName: "奥飞数据投资者关系公告",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "年度交付计划披露",
      scale: "固安 2–3 栋 · 无锡 / 定兴二期",
      listedTicker: "奥飞数据 · 300738.SZ",
      whyItMatters: "年度交付计划给出了多地园区由建设转向可服务容量的路线，后续以定期报告和项目公告核验实际交付。",
    },
    {
      id: "sinnet-inner-mongolia-compute-centers-progress",
      title: "光环新网披露内蒙古两项智算中心处于前期筹备",
      summary: "公司在互动平台表示，内蒙古两项智算中心已完成土地相关安排，正处于前期审批筹划阶段，并将按需求分期建设。",
      publishedAt: "2026-07-17T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://vip.stock.finance.sina.com.cn/corp/go.php/vCB_AllNewsStock/symbol/sz300383.phtml",
      sourceUrl: null,
      sourceName: "光环新网互动平台（公开转引）",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "项目前期审批筹划",
      scale: "内蒙古两项智算中心",
      listedTicker: "光环新网 · 300383.SZ",
      whyItMatters: "新增枢纽节点项目仍处于前期阶段，后续关注核准、开工和客户订单等可量化节点。",
    },
    {
      id: "kehua-idc-rack-utilization-july",
      title: "科华数据称自建 IDC 上架率持续向优",
      summary: "公司披露自建数据中心上架率持续改善，并与头部互联网企业及云厂商合作，覆盖 IDC 租赁、异构算力平台和行业应用服务。",
      publishedAt: "2026-07-07T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://www.xiaojingji.com/stock/one/notice?code=002335&type=5",
      sourceUrl: null,
      sourceName: "科华数据互动平台（公开转引）",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "IDC 上架率更新",
      scale: "自建 IDC · 算力服务",
      listedTicker: "科华数据 · 002335.SZ",
      whyItMatters: "上架率改善是已建 IDC 容量由资源储备转化为经营性服务能力的关键运营信号。",
    },
    {
      id: "baosight-baoscloud-green-operations",
      title: "宝信软件披露宝之云数据中心绿色运营进展",
      summary: "公司 ESG 报告披露，宝之云数据中心全年平均 PUE 处于行业先进水平，并通过绿证采购与碳管理持续降低运营能耗。",
      publishedAt: "2026-04-18T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12040275&stockid=900926",
      sourceUrl: null,
      sourceName: "宝信软件 ESG 报告（公开转引）",
      signal: "power",
      curator: "公开来源",
      region: "中国",
      milestone: "绿色运营披露",
      scale: "宝之云数据中心",
      listedTicker: "宝信软件 · 600845.SH",
      whyItMatters: "对大型存量园区而言，PUE 与绿电采购直接影响长期电力成本、合规和扩容可行性。",
    },
    {
      id: "tongniu-state-cloud-compute-service",
      title: "铜牛信息更新自建数据中心与国资云算力服务能力",
      summary: "公司表示，依托自建数据中心和国资云计算平台，可为多类词元业务提供底层算力消耗与技术服务支撑。",
      publishedAt: "2026-06-17T00:00:00+08:00",
      category: "idc-company",
      score: null,
      permalink: "https://vip.stock.finance.sina.com.cn/corp/go.php/vCB_AllNewsStock/symbol/sz300895.phtml",
      sourceUrl: null,
      sourceName: "铜牛信息互动平台（公开转引）",
      signal: "capacity",
      curator: "公开来源",
      region: "中国",
      milestone: "算力服务能力更新",
      scale: "自建数据中心 · 国资云",
      listedTicker: "铜牛信息 · 300895.SZ",
      whyItMatters: "该类政企算力服务的关注点在于实际客户导入、资源利用率与持续交付，而非单次技术表述。",
    },
    {
      id: "equinix-cisco-nvidia-ai-factories",
      title: "Equinix 联合 Cisco 与 NVIDIA 在全球数据中心部署 AI Factory",
      summary: "Equinix 宣布与 Cisco、NVIDIA 协作，在其全球数据中心网络中部署面向企业的安全 AI Factory 基础设施。",
      publishedAt: "2026-06-16T00:00:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://investor.equinix.com/news-events/press-releases",
      sourceUrl: null,
      sourceName: "Equinix",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "AI Factory 部署合作",
      scale: "全球数据中心网络",
      listedTicker: "Equinix · EQIX",
      whyItMatters: "互联型 IDC 平台将 AI 基础设施能力嵌入既有全球节点网络，关注后续可用区域和客户采用情况。",
    },
    {
      id: "digital-realty-northern-virginia-acquisition",
      title: "Digital Realty 增持北弗吉尼亚 288MW 已出租数据中心组合",
      summary: "Digital Realty 拟向 Blackstone 收购三座北弗吉尼亚数据中心权益；组合总 IT 容量 288MW，已全部出租。",
      publishedAt: "2026-06-29T00:00:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-announces-purchase-blackstone-interest-three",
      sourceUrl: null,
      sourceName: "Digital Realty",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "已出租园区权益收购",
      scale: "288 MW IT · $78 亿组合价值",
      listedTicker: "Digital Realty · DLR",
      whyItMatters: "交易增加了北弗吉尼亚紧俏市场中已签长租的容量敞口，后续关注交割与项目稳定化进度。",
    },
    {
      id: "applied-digital-polaris-forge-company-update",
      title: "Applied Digital Polaris Forge 1 在运 AI 容量升至 175MW",
      summary: "Polaris Forge 1 二号楼一期达到可服务状态，新增 75MW，园区在运 AI 容量提升至 175MW。",
      publishedAt: "2026-07-01T00:00:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://ir.applieddigital.com/news-events/press-releases/detail/157/applied-digital-delivers-second-building-at-polaris-forge-1",
      sourceUrl: null,
      sourceName: "Applied Digital",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "二号楼一期投运",
      scale: "新增 75 MW · 在运 175 MW",
      listedTicker: "Applied Digital · APLD",
      whyItMatters: "从建设转为可服务容量是 AI IDC 执行能力的直接检验，园区满建合同容量为 400MW。",
    },
    {
      id: "core-scientific-power-pipeline-may",
      title: "Core Scientific 将总电力容量管线扩至 4.5GW",
      summary: "公司披露总电力容量管线扩至 4.5GW，并计划在 Oklahoma Muskogee 与 Texas Pecos 园区各扩展至 1.5GW。",
      publishedAt: "2026-05-06T00:00:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://investors.corescientific.com/news-events/press-releases/detail/136/core-scientific-announces-first-quarter-fiscal-year-2026-results",
      sourceUrl: null,
      sourceName: "Core Scientific",
      signal: "power",
      curator: "官方来源",
      region: "美国",
      milestone: "园区电力容量扩展",
      scale: "4.5 GW 管线 · 两园区各 1.5GW",
      listedTicker: "Core Scientific · CORZ",
      whyItMatters: "对高密度托管平台而言，获电与并网能力是比机房面积更前置的扩张约束。",
    },
    {
      id: "terawulf-anthropic-company-update",
      title: "TeraWulf 与 Anthropic 签署 20 年 AI 基础设施租约",
      summary: "TeraWulf 在肯塔基 Justified Data Campus 与 Anthropic 签订 20 年租约，初始期限预计带来约 190 亿美元合同收入。",
      publishedAt: "2026-07-06T00:00:00-04:00",
      category: "idc-company",
      score: null,
      permalink: "https://investors.terawulf.com/news-events/press-releases/detail/142/terawulf-announces-anthropic-lease-at-justified-data-campus-and-sale-of-majority-interest-in-abernathy-joint-venture-to-fluidstack",
      sourceUrl: null,
      sourceName: "TeraWulf",
      signal: "capacity",
      curator: "官方来源",
      region: "美国",
      milestone: "20 年 AI 基础设施租约",
      scale: "约 $190 亿合同收入",
      listedTicker: "TeraWulf · WULF",
      whyItMatters: "长期合约将 AI 客户需求转化为园区现金流可见度，仍需跟踪建设交付、融资和执行节奏。",
    },
  ];

  return items
    .map((item) => ({ ...item, verifiedAt: "2026-07-21" }))
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
}

function calendarEvents(): CalendarEvent[] {
  return [
    { id: "tesla-q2-2026", startsAt: "2026-07-22T21:30:00.000Z", company: "Tesla", ticker: "TSLA", sector: "新能源 / 储能", description: "全球电动车与储能龙头，Megapack 是电网级储能的重要供给。", focus: "储能部署、能源业务扩产与 AI 基础设施投入", sourceName: "Tesla Investor Relations · Q2 results", sourceUrl: "https://ir.tesla.com/press-release/tesla-releases-second-quarter-2026-financial-results", conclusion: { summary: "Q2 储能部署达 13.5GWh，电网级储能需求仍是最明确的基础设施读数；后续持续核验 Megapack 交付、扩产与能源业务资本投入。", summaryEn: "Q2 energy-storage deployments reached 13.5GWh, keeping grid-scale storage the clearest infrastructure read-through. Next checks: Megapack deliveries, capacity expansion and energy-business capital deployment.", sourceName: "Tesla Investor Relations · production & deployments", sourceUrl: "https://ir.tesla.com/press-release/tesla-second-quarter-2026-production-deliveries-and-deployments" } },
    { id: "alphabet-q2-2026", startsAt: "2026-07-22T20:00:00.000Z", company: "Alphabet", ticker: "GOOGL", sector: "互联网 / 云计算", description: "Google Cloud 位居全球主要云服务商之列，AI 基建投入的重要风向标。", focus: "Google Cloud 增长、全年 CAPEX 指引与 AI 算力供给", sourceName: "Alphabet Investor Relations · Q2 results", sourceUrl: "https://s206.q4cdn.com/479360582/files/doc_financials/2026/q2/2026q2-alphabet-earnings-release.pdf", conclusion: { summary: "Google Cloud 营收同比增长 82% 至 248 亿美元、积压订单升至 5,140 亿美元；Q2 资本开支为 449 亿美元，全年指引上调至 1,950–2,050 亿美元。云端 AI 需求仍超过既有产能，数据中心、服务器与加速器投入维持高强度。", summaryEn: "Google Cloud revenue rose 82% to $24.8B and backlog reached $514B. Q2 capex was $44.9B; full-year 2026 guidance was raised to $195B–$205B. AI-cloud demand remains ahead of existing capacity, keeping data-center, server and accelerator buildout at high intensity.", sourceName: "Alphabet Q2 results & earnings call · Reuters", sourceUrl: "https://wdez.com/2026/07/22/google-quarterly-cloud-revenue-growth-beats-expectations/" } },
    { id: "intel-q2-2026", startsAt: "2026-07-23T20:00:00.000Z", company: "Intel", ticker: "INTC", sector: "半导体", description: "全球重要芯片制造商，PC 与数据中心 CPU 的关键供应商。", focus: "数据中心产品节奏、先进制程投入与资本开支安排", sourceName: "Intel Investor Relations · Q2 results", sourceUrl: "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results", conclusion: { summary: "Q2 数据中心与 AI（DCAI）营收同比增长 59% 至 63 亿美元；公司称 AI 算力需求继续增强，并将增加设备、洁净室空间和基板投入，以支持产品与代工业务后续增长。", summaryEn: "Q2 Data Center and AI revenue rose 59% year over year to $6.3B. Intel said AI-driven compute demand continues to strengthen and that it is increasing investment in equipment, clean-room space and substrates to support product and foundry growth.", sourceName: "Intel Investor Relations · Q2 2026 results", sourceUrl: "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results" } },
    { id: "vertiv-q2-2026", startsAt: "2026-07-29T12:00:00.000Z", company: "Vertiv", ticker: "VRT", sector: "数据中心基础设施", description: "数据中心电力、散热、液冷与关键基础设施解决方案供应商。", focus: "订单、积压、液冷交付与全年需求指引", sourceName: "Vertiv Investor Relations", sourceUrl: "https://investors.vertiv.com/news/news-details/2026/Vertiv-Announces-Date-of-Second-Quarter-2026-Earnings-Release-and-Conference-Call/default.aspx" },
    { id: "meta-q2-2026", startsAt: "2026-07-29T20:00:00.000Z", company: "Meta", ticker: "META", sector: "社交媒体 / AI", description: "全球社交平台龙头，前沿模型、广告 AI 与大规模数据中心建设并进。", focus: "AI 基础设施 CAPEX、数据中心容量和全年投入节奏", sourceName: "Meta Investor Relations", sourceUrl: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-to-Announce-Second-Quarter-2026-Results/default.aspx" },
    { id: "microsoft-fy26-q4", startsAt: "2026-07-29T20:00:00.000Z", company: "Microsoft", ticker: "MSFT", sector: "云计算 / 软件", description: "Azure 是全球主要云平台，Copilot 与 AI 服务驱动基础设施扩张。", focus: "Azure 需求、资本开支、融资租赁与供给受限表述", sourceName: "Microsoft Investor Relations", sourceUrl: "https://news.microsoft.com/source/2026/07/08/microsoft-announces-quarterly-earnings-release-date-68/" },
    { id: "arm-q1-fy27", startsAt: "2026-07-29T21:00:00.000Z", company: "Arm", ticker: "ARM", sector: "芯片 IP", description: "CPU 架构授权龙头，AI 服务器与移动芯片的重要底层技术提供商。", focus: "数据中心授权收入、AI 服务器渗透与客户产品节奏", sourceName: "Arm Investor Relations", sourceUrl: "https://investors.arm.com/financials/quarterly-annual-results" },
    { id: "amazon-q2-2026", startsAt: "2026-07-30T21:00:00.000Z", company: "Amazon", ticker: "AMZN", sector: "电商 / 云计算", description: "AWS 是全球最大的云服务商之一，AI 基础设施投资的核心风向标。", focus: "AWS 增长、基础设施 CAPEX 与 AI 数据中心建设", sourceName: "Amazon Investor Relations", sourceUrl: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-to-Webcast-Second-Quarter-2026-Financial-Results-Conference-Call/default.aspx" },
  ];
}

function upcomingCalendar(now = new Date()): CalendarEvent[] {
  const events = calendarEvents();
  const end = now.getTime() + 9 * 24 * 60 * 60 * 1_000;
  return events.filter((event) => {
    const time = new Date(event.startsAt).getTime();
    return time >= now.getTime() - 4 * 24 * 60 * 60 * 1_000 && time <= end;
  });
}

function chainFallbackNews(records: SourceRecord[], cooling: SourceRecord[]): Pick<Record<ChainKey, NewsItem[]>, "rack" | "cooling" | "power"> {
  const toNews = (record: SourceRecord, signal: SignalKey): NewsItem => ({
    id: `official-${record.id}-${signal}`,
    title: record.title,
    summary: `${record.status} · ${record.metric}。${record.note}`,
    publishedAt: `${record.publishedAt}T00:00:00+08:00`,
    category: `idc-${signal}`,
    score: null,
    permalink: record.sourceUrl,
    sourceUrl: record.sourceUrl,
    sourceName: record.sourceName,
    signal,
    curator: "官方来源",
  });
  const powerRecord = records.find((record) => record.metric.includes("绿电")) ?? records[0];
  return {
    rack: [
      {
        id: "official-nvidia-noetra-vera-rubin",
        title: "NVIDIA 与 Noetra 启动 Vera Rubin AI 工厂",
        summary: "项目规划部署 13,750 颗 Vera CPU 与 27,500 颗 Rubin GPU，带动整机柜、互联与配套基础设施需求。",
        publishedAt: "2026-07-16T09:00:00-07:00",
        category: "idc-rack",
        score: null,
        permalink: "https://nvidianews.nvidia.com/news/nvidia-vera-rubin-opens-agentic-ai-frontier",
        sourceUrl: "https://nvidianews.nvidia.com/news/nvidia-vera-rubin-opens-agentic-ai-frontier",
        sourceName: "NVIDIA",
        signal: "network",
        curator: "官方来源",
      },
      {
        id: "official-smci-rdhx-rack",
        title: "Supermicro 扩展机柜级后门液冷产品线",
        summary: "十款 RDHx 覆盖 10kW 至 120kW 门级散热，并支持最高 240kW 机柜级冷却，面向新建及存量数据中心。",
        publishedAt: "2026-07-15T09:00:00-07:00",
        category: "idc-rack",
        score: null,
        permalink: "https://ir.supermicro.com/news/news-details/2026/Supermicro-Expands-End-to-End-DCBBS-Liquid-Cooling-Portfolio-with-Rear-Door-Heat-Exchangers-for-High-Density-AI-and-HPC-Infrastructure/default.aspx",
        sourceUrl: "https://ir.supermicro.com/news/news-details/2026/Supermicro-Expands-End-to-End-DCBBS-Liquid-Cooling-Portfolio-with-Rear-Door-Heat-Exchangers-for-High-Density-AI-and-HPC-Infrastructure/default.aspx",
        sourceName: "Supermicro",
        signal: "network",
        curator: "官方来源",
      },
      {
        id: "official-drivenets-ai-fabric-2026",
        title: "DriveNets 推出高容量 AI Fabric 平台",
        summary: "2600SL 与 2601S 面向数十万 XPU 规模的 AI 基础设施，补充高密度机柜间的开放以太网互联能力。",
        publishedAt: "2026-07-01T09:00:00+03:00",
        category: "idc-network",
        score: null,
        permalink: "https://drivenets.com/news-and-events/press-release/drivenets-extends-ai-networking-portfolio-with-high-capacity-ai-fabric-platforms/",
        sourceUrl: "https://drivenets.com/news-and-events/press-release/drivenets-extends-ai-networking-portfolio-with-high-capacity-ai-fabric-platforms/",
        sourceName: "DriveNets",
        signal: "network",
        curator: "官方来源",
      },
    ],
    cooling: [
      {
        id: "official-smci-rdhx-cooling",
        title: "Supermicro 扩展后门换热器液冷组合",
        summary: "新系列覆盖 10kW 至 120kW 门级散热，并可与冷板式直触液冷组合，支持高密度 AI 与 HPC 机柜。",
        publishedAt: "2026-07-15T09:00:00-07:00",
        category: "idc-cooling",
        score: null,
        permalink: "https://ir.supermicro.com/news/news-details/2026/Supermicro-Expands-End-to-End-DCBBS-Liquid-Cooling-Portfolio-with-Rear-Door-Heat-Exchangers-for-High-Density-AI-and-HPC-Infrastructure/default.aspx",
        sourceUrl: "https://ir.supermicro.com/news/news-details/2026/Supermicro-Expands-End-to-End-DCBBS-Liquid-Cooling-Portfolio-with-Rear-Door-Heat-Exchangers-for-High-Density-AI-and-HPC-Infrastructure/default.aspx",
        sourceName: "Supermicro",
        signal: "cooling",
        curator: "官方来源",
      },
      {
        id: "official-daikin-ntt-cooling-poc",
        title: "大金与 NTT DATA 启动 AI 数据中心制冷优化验证",
        summary: "双方将在 NTT DATA 机房联动服务器热状态预测、冷机与液冷控制，验证节能和自动化运行效果。",
        publishedAt: "2026-07-06T09:00:00+09:00",
        category: "idc-cooling",
        score: null,
        permalink: "https://www.daikin.com/press/2026/20260706",
        sourceUrl: "https://www.daikin.com/press/2026/20260706",
        sourceName: "Daikin / NTT DATA",
        signal: "cooling",
        curator: "官方来源",
      },
      {
        id: "official-ecolab-coolit-close",
        title: "Ecolab 完成收购 CoolIT，强化 AI 直接液冷平台",
        summary: "约 47.5 亿美元交易完成；CoolIT 年内销售增长超过 100%，Ecolab 计划整合 CDU、冷板、冷却液与数字优化。",
        publishedAt: "2026-07-02T09:00:00-05:00",
        category: "idc-cooling",
        score: null,
        permalink: "https://en-uk.ecolab.com/news/2026/07/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform",
        sourceUrl: "https://en-uk.ecolab.com/news/2026/07/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform",
        sourceName: "Ecolab",
        signal: "cooling",
        curator: "官方来源",
      },
      ...cooling.slice(0, 3).map((record) => toNews(record, "cooling")),
    ],
    power: powerRecord ? [toNews(powerRecord, "power")] : [],
  };
}

function beijingDate(value: number | Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dailySnapshotKey(date: string): string {
  return `daily:${date}`;
}

async function persistDailySnapshot(env: Env, meta: DailySnapshotMeta, body: string): Promise<void> {
  await Promise.all([
    env.IDC_DAILY_SNAPSHOTS.put(dailySnapshotKey(meta.date), body),
    env.IDC_DAILY_SNAPSHOTS.put("latest", body),
    env.IDC_DAILY_SNAPSHOTS.put("latest-meta", JSON.stringify(meta)),
  ]);
}

async function dailySnapshotApi(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405 });
  const requested = new URL(request.url).searchParams.get("date") ?? "latest";
  const key = requested === "latest" ? "latest" : /^\d{4}-\d{2}-\d{2}$/.test(requested) ? dailySnapshotKey(requested) : null;
  if (!key) return Response.json({ error: "Invalid snapshot date" }, { status: 400 });

  const snapshot = await env.IDC_DAILY_SNAPSHOTS.get(key);
  if (!snapshot) return Response.json({ error: "Daily snapshot not available yet" }, { status: 404 });
  return new Response(snapshot, { headers: { "Cache-Control": "public, max-age=300, s-maxage=900", "Content-Type": "application/json; charset=utf-8", "Content-Language": "zh-CN", "X-Content-Type-Options": "nosniff" } });
}

type AtlasApiOptions = {
  forceRefresh?: boolean;
  allowBootstrapSnapshot?: boolean;
  snapshotMeta?: DailySnapshotMeta;
};

function staticAtlasContent(): Record<string, unknown> {
  return {
    calendar: calendarEvents(),
    capacity: capacityRadar(),
    cooling: coolingProgress(),
    chinaChip: officialChinaChipNews(),
    nvidiaProducts: nvidiaProducts(),
    supernodes: supernodeProducts(),
    mna: mnaDeals(),
    aiAdoption: aiAdoption(),
    trackedSources: trackedSources(),
  };
}

async function atlasApi(request: Request, env: Env, ctx: ExecutionContext, options: AtlasApiOptions = {}): Promise<Response> {
  if (request.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const staticContentVersion = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(staticAtlasContent()))).then((digest) => Array.from(new Uint8Array(digest)).slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join(""));
  const cacheKey = new Request(new URL(`/api/atlas-live-v5?schema=v1&content=${staticContentVersion}`, request.url), { method: "GET" });
  const edgeCache = (caches as unknown as { default: Cache }).default;
  if (!options.forceRefresh) {
    const cached = await edgeCache.match(cacheKey);
    if (cached) return cached;
  }

  const [newsResult, benchmarkResult, nvidiaResult, coolingResult, networkResult, powerResult, modelResult, dailyResult, openRouterResult, arenaResult, chinaChipResult] = await Promise.allSettled([
    fetchAihotNews("数据中心", 8, 14 * 24),
    fetchCwwBenchmark(),
    fetchAihotNews("NVIDIA", 5),
    fetchAihotNews("液冷", 5),
    fetchAihotNews("光模块", 5),
    fetchAihotNews("电力", 5),
    fetchAihotCategory("ai-models", 8),
    fetchAihotDaily(),
    fetchOpenRouterUsage(),
    fetchArenaCodeLeaderboard(),
    fetchAihotNews("芯片", 20, 7 * 24),
  ]);

  if (newsResult.status === "rejected") {
    console.error(JSON.stringify({ message: "AI HOT unavailable", error: String(newsResult.reason) }));
  }
  if (benchmarkResult.status === "rejected") {
    console.error(JSON.stringify({ message: "CWW unavailable", error: String(benchmarkResult.reason) }));
  }

  if (nvidiaResult.status === "rejected") {
    console.error(JSON.stringify({ message: "NVIDIA feed unavailable", error: String(nvidiaResult.reason) }));
  }
  if (coolingResult.status === "rejected") {
    console.error(JSON.stringify({ message: "Cooling feed unavailable", error: String(coolingResult.reason) }));
  }
  if (dailyResult.status === "rejected") {
    console.error(JSON.stringify({ message: "AI HOT daily unavailable", error: String(dailyResult.reason) }));
  }
  if (openRouterResult.status === "rejected") {
    console.error(JSON.stringify({ message: "OpenRouter rankings unavailable", error: String(openRouterResult.reason) }));
  }
  if (arenaResult.status === "rejected") {
    console.error(JSON.stringify({ message: "Arena Code leaderboard unavailable", error: String(arenaResult.reason) }));
  }
  if (chinaChipResult.status === "rejected") {
    console.error(JSON.stringify({ message: "China chip feed unavailable", error: String(chinaChipResult.reason) }));
  }

  const benchmark = benchmarkResult.status === "fulfilled"
    ? benchmarkResult.value
    : { benchmarks: [], date: null, methodology: null };
  const records = capacityRadar();
  const coolingRecords = coolingProgress();
  const news = newsResult.status === "fulfilled" ? newsResult.value : [];
  const nvidiaNews = nvidiaResult.status === "fulfilled" ? nvidiaResult.value : [];
  const coolingNews = coolingResult.status === "fulfilled" ? coolingResult.value : [];
  const networkNews = networkResult.status === "fulfilled" ? networkResult.value : [];
  const powerNews = powerResult.status === "fulfilled" ? powerResult.value : [];
  const modelNews = uniqueNews([
    ...trackedSourceNews(),
    ...(modelResult.status === "fulfilled"
      ? modelResult.value.filter((item) => /发布|推出|上线|开源|更新|开放权重|登顶|release|introduc|checkpoint/i.test(`${item.title} ${item.summary}`))
      : []),
  ], 6);
  const chinaChipNews = chinaChipPulse(chinaChipResult.status === "fulfilled" ? chinaChipResult.value : []);
  const positiveNews = positiveIdcNews(news, records);
  const idcPulse = constructionPulse();
  const listedCompanyNews = listedCompanyPulse();
  const upcomingEvents = upcomingCalendar();
  const fallback = chainFallbackNews(records, coolingRecords);
  const chainWindowDays = 30;
  const computeNews = nvidiaNews.filter((item) => /GPU|服务器|机柜|算力芯片|AI\s*工厂|Vera\s*Rubin|Blackwell|Rubin/i.test(item.title));
  const chainNews: Record<ChainKey, NewsItem[]> = {
    compute: recentNews([...chinaChipNews, ...computeNews, ...fallback.rack.slice(0, 2)], chainWindowDays),
    rack: recentNews([...networkNews, ...fallback.rack], chainWindowDays),
    cooling: recentNews([...coolingNews, ...fallback.cooling], chainWindowDays),
    power: recentNews([
      ...powerNews,
      ...idcPulse.filter((item) => item.signal === "power" || /GW|MW|电力|供电|绿电/i.test(`${item.title} ${item.summary} ${item.scale ?? ""}`)),
      ...fallback.power,
    ], chainWindowDays),
    campus: recentNews([...idcPulse, ...positiveNews, ...news], chainWindowDays),
    model: recentNews(modelNews, chainWindowDays),
  };

  const latestSnapshot = await env.IDC_DAILY_SNAPSHOTS.get<DailySnapshotMeta>("latest-meta", "json");
  const coreSourcesHealthy = newsResult.status === "fulfilled" && benchmarkResult.status === "fulfilled";
  const response = Response.json({
    generatedAt: new Date().toISOString(),
    windowLabel: "近45天",
    newsStatus: newsResult.status === "fulfilled" ? "ok" : "unavailable",
    benchmarkStatus: benchmarkResult.status === "fulfilled" ? "ok" : "unavailable",
    news,
    positiveNews,
    positiveNewsStatus: positiveNews.some((item) => item.curator === "AI HOT") ? "live" : "official-fallback",
    latestPositiveAt: positiveNews[0]?.publishedAt ?? null,
    idcPulse,
    listedCompanyNews,
    upcomingEvents,
    pulseWindowDays: 45,
    weeklyHighlightCount: idcPulse.filter((item) => item.weeklyHighlight).length,
    nvidiaNews,
    chinaChipNews,
    chinaChipWindowDays: 30,
    chinaChipStatus: chinaChipNews.some((item) => item.curator === "AI HOT") ? "live" : "official-only",
    coolingNews,
    modelNews,
    chainWindowDays,
    openRouterUsage: openRouterResult.status === "fulfilled" ? openRouterResult.value : {
      status: "unavailable",
      period: "近7日",
      asOf: new Date().toISOString(),
      metric: "weekly-rank",
      sourceUrl: "https://openrouter.ai/rankings/",
      note: "OpenRouter 公开周排名暂时不可用。",
      models: [],
    },
    arenaCodeLeaderboard: arenaResult.status === "fulfilled" ? arenaResult.value : {
      status: "unavailable",
      asOf: new Date().toISOString().slice(0, 10),
      category: "webdev",
      sourceUrl: ARENA_CODE_ENDPOINT,
      note: "Arena Code 公开榜单暂时不可用。",
      models: [],
    },
    aiAdoption: aiAdoption(),
    dailySnapshot: options.snapshotMeta ?? latestSnapshot,
    supernodes: supernodeProducts(),
    trackedSources: trackedSources(),
    chainNews,
    aiDaily: dailyResult.status === "fulfilled" ? dailyResult.value : null,
    benchmarks: benchmark.benchmarks,
    benchmarkDate: benchmark.date,
    benchmarkMethodology: benchmark.methodology,
    capacityRadar: records,
    coolingProgress: coolingRecords,
    nvidiaProducts: nvidiaProducts(),
    mnaDeals: mnaDeals(),
  }, {
    headers: {
      "Cache-Control": coreSourcesHealthy ? "public, max-age=60, s-maxage=300, stale-while-revalidate=300" : "no-store",
      "Content-Language": "zh-CN",
      "X-Content-Type-Options": "nosniff",
    },
  });

  if (coreSourcesHealthy) ctx.waitUntil(edgeCache.put(cacheKey, response.clone()));
  const today = beijingDate(new Date());
  if (coreSourcesHealthy && options.allowBootstrapSnapshot !== false && (!latestSnapshot || latestSnapshot.date !== today)) {
    const meta: DailySnapshotMeta = { date: today, generatedAt: new Date().toISOString(), source: "bootstrap" };
    ctx.waitUntil(response.clone().text().then((body) => persistDailySnapshot(env, meta, body)));
  }
  return response;
}

async function createScheduledSnapshot(env: Env, scheduledTime: number, ctx: ExecutionContext): Promise<void> {
  const meta: DailySnapshotMeta = { date: beijingDate(scheduledTime), generatedAt: new Date(scheduledTime).toISOString(), source: "scheduled" };
  const response = await atlasApi(new Request("https://idc-index.com/api/atlas-live-v5?schema=v1"), env, ctx, { forceRefresh: true, allowBootstrapSnapshot: false, snapshotMeta: meta });
  if (!response.ok) throw new Error(`Snapshot request failed: HTTP ${response.status}`);
  await persistDailySnapshot(env, meta, await response.text());
  console.log(JSON.stringify({ message: "Daily snapshot saved", ...meta }));
}

async function productImage(request: Request, ctx: ExecutionContext, sourceUrl: string): Promise<Response> {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const edgeCache = (caches as unknown as { default: Cache }).default;
  const cached = await edgeCache.match(request);
  if (cached) return cached;

  const upstream = await fetch(sourceUrl, {
    headers: { "User-Agent": "IDC-Atlas/1.0 (+https://idc-index.com/)" },
  });
  const contentType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !contentType.startsWith("image/")) {
    return new Response("Image temporarily unavailable", { status: 502 });
  }

  const response = new Response(upstream.body, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
  ctx.waitUntil(edgeCache.put(request, response.clone()));
  return response;
}

const INITIAL_ATLAS_HEADER = "x-idc-atlas-prime";

function firstItems(value: unknown, count: number): unknown[] {
  return Array.isArray(value) ? value.slice(0, count) : [];
}

function compactInitialAtlasPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const daily = payload.aiDaily as Record<string, unknown> | null;
  const sections = Array.isArray(daily?.sections)
    ? daily.sections.map((section) => {
      const item = section as Record<string, unknown>;
      return { ...item, items: firstItems(item.items, 2) };
    })
    : [];

  return {
    generatedAt: payload.generatedAt,
    weeklyHighlightCount: payload.weeklyHighlightCount,
    idcPulse: firstItems(payload.idcPulse, 12),
    positiveNews: firstItems(payload.positiveNews, 3),
    listedCompanyNews: firstItems(payload.listedCompanyNews, 8),
    upcomingEvents: firstItems(payload.upcomingEvents, 6),
    chainNews: payload.chainNews,
    nvidiaProducts: firstItems(payload.nvidiaProducts, 4),
    supernodes: firstItems(payload.supernodes, 2),
    chinaChipNews: firstItems(payload.chinaChipNews, 4),
    modelNews: firstItems(payload.modelNews, 4),
    capacityRadar: firstItems(payload.capacityRadar, 4),
    coolingProgress: firstItems(payload.coolingProgress, 3),
    aiDaily: daily ? { ...daily, sections, flashes: [] } : null,
  };
}

function bytesToBase64(bytes: Uint8Array): string {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

async function initialAtlasHeader(request: Request, env: Env, ctx: ExecutionContext): Promise<string | null> {
  try {
    const response = await atlasApi(new Request(new URL("/api/atlas-live-v5?schema=v1", request.url)), env, ctx);
    if (!response.ok) return null;
    const payload = await response.json() as Record<string, unknown>;
    const json = new TextEncoder().encode(JSON.stringify(compactInitialAtlasPayload(payload)));
    const compressed = new Blob([json]).stream().pipeThrough(new CompressionStream("gzip"));
    return bytesToBase64(new Uint8Array(await new Response(compressed).arrayBuffer()));
  } catch (error) {
    console.error(JSON.stringify({ message: "Initial atlas payload unavailable", error: String(error) }));
    return null;
  }
}

function shouldPrimeHomepage(request: Request, url: URL): boolean {
  return request.method === "GET"
    && ["/", "/en", "/pulse", "/industry", "/en/pulse", "/en/industry"].includes(url.pathname)
    && request.headers.get("accept")?.includes("text/html") === true;
}

const LANGUAGE_COOKIE = "idc_lang";

function cookieValue(request: Request, name: string): string | null {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function languageCookie(value: "zh" | "en"): string {
  return `${LANGUAGE_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
}

function languagePreferenceResponse(request: Request, url: URL): Response | null {
  if (request.method !== "GET" || request.headers.get("accept")?.includes("text/html") !== true) return null;

  const queryLanguage = url.searchParams.get("lang");
  if ((url.pathname === "/" && queryLanguage === "zh") || (url.pathname === "/en" && queryLanguage === "en")) {
    url.searchParams.delete("lang");
    const headers = new Headers({
      location: url.toString(),
      "cache-control": "private, no-store",
      "set-cookie": languageCookie(queryLanguage),
      vary: "Cookie",
    });
    return new Response(null, { status: 302, headers });
  }

  if (url.pathname !== "/") return null;
  const preference = cookieValue(request, LANGUAGE_COOKIE);
  if (preference === "zh") return null;

  type RequestWithCountry = Request & { cf?: IncomingRequestCfProperties };
  const country = (request as RequestWithCountry).cf?.country;
  if (preference !== "en" && (!country || country === "CN")) return null;

  url.pathname = "/en";
  const headers = new Headers({
    location: url.toString(),
    "cache-control": "private, no-store",
    vary: "Cookie",
  });
  return new Response(null, { status: 307, headers });
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.hostname === "dc-atlas-cn-us.catknowspray.chatgpt.site") {
        url.protocol = "https:";
        url.hostname = "idc-index.com";
        return Response.redirect(url, 308);
      }
      const languageResponse = languagePreferenceResponse(request, url);
      if (languageResponse) return languageResponse;
      if (url.pathname === "/api/daily-snapshot") return await dailySnapshotApi(request, env);
      if (url.pathname === "/api/atlas" || url.pathname === "/api/atlas-live" || url.pathname === "/api/atlas-live-v2" || url.pathname === "/api/atlas-live-v3" || url.pathname === "/api/atlas-live-v4" || url.pathname === "/api/atlas-live-v5") return await atlasApi(request, env, ctx);
      if (url.pathname === "/llms.txt") return new Response(LLMS_TXT, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
      const productImageSource = PRODUCT_IMAGE_SOURCES[url.pathname];
      if (productImageSource) return await productImage(request, ctx, productImageSource);
      if (shouldPrimeHomepage(request, url)) {
        const prime = await initialAtlasHeader(request, env, ctx);
        if (prime) {
          const headers = new Headers(request.headers);
          headers.set(INITIAL_ATLAS_HEADER, prime);
          return await handler.fetch(new Request(request, { headers }), env, ctx);
        }
      }
      return await handler.fetch(request, env, ctx);
    } catch (error) {
      console.error(JSON.stringify({ message: "Unhandled request error", path: url.pathname, error: String(error) }));
      if (url.pathname.startsWith("/api/")) return Response.json({ error: "Service temporarily unavailable" }, { status: 503 });
      throw error;
    }
  },
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    await createScheduledSnapshot(env, controller.scheduledTime, ctx);
  },
} satisfies ExportedHandler<Env>;

export default worker;
