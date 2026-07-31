import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/", host = "dc-atlas.example", country = null, cookie = null) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const headers = { accept: "text/html", host };
  if (cookie) headers.cookie = cookie;
  const request = new Request(`https://${host}${pathname}`, { headers });
  if (country) Object.defineProperty(request, "cf", { value: { country } });

  return worker.fetch(
    request,
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the compact IDC Atlas portal homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>全球数据中心与 AI 基础设施情报｜IDC Atlas<\/title>/i);
  assert.match(html, /超大规模云厂商 CAPEX/);
  assert.match(html, /hrefLang="x-default" href="https:\/\/dc-atlas\.example\/en"/);
  assert.match(html, /Track the/);
  assert.match(html, /class="pulse-trace"/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-XRKL96W42Q/);
  assert.match(html, /gtag\('config', 'G-XRKL96W42Q'\)/);
  assert.match(html, /class="zh-console-sidebar"/);
  assert.match(html, /href="\/pulse"><span>04<\/span><strong>最新脉冲/);
  assert.match(html, /href="\/industry"><span>05<\/span><strong>产业中心/);
  assert.match(html, /EARNINGS WATCH · IDC CALENDAR/);
  assert.match(html, /href="\/#calendar"><span>02<\/span><strong>财报日历/);
  assert.match(html, /class="hero-signal hero-calendar" id="calendar"/);
  assert.match(html, /IDC ATLAS 深度研究 · 最新 5 篇/);
  assert.match(html, /Azure 增长 43% 之后，500 亿美元要兑现什么/);
  assert.match(html, /Claude 与 GPT 都在降价，AI 基建真正要看什么/);
  assert.match(html, /href="\/#columns"/);
  assert.equal((html.match(/class="column-archive-link"/g) ?? []).length, 4);
  assert.match(html, /href="\/columns\/microsoft-ai-capex"/);
  assert.match(html, /href="\/columns\/frontier-model-economics"/);
  assert.match(html, /今天值得看的脉冲/);
  assert.match(html, /核心 IDC 标的/);
  assert.match(html, /从算力到需求/);
  assert.match(html, /chain-node-icon/);
  assert.match(html, /href="\/industry\?tab=chain&amp;stage=compute"/);
  assert.match(html, /并购与市场温度/);
  assert.match(html, /每条信息，都能回到出处/);
  assert.doesNotMatch(html, /产品、形态与发布节奏|国产超节点路线|大模型发布与评测|大型园区进度|液冷部署进度/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("publishes focused Pulse and Industry content hubs", async () => {
  const pulse = await render("/pulse");
  assert.equal(pulse.status, 200);
  const pulseHtml = await pulse.text();
  assert.match(pulseHtml, /扩建、签约、投运，/);
  assert.match(pulseHtml, /hrefLang="en" href="https:\/\/idc-index\.com\/en\/pulse"/);
  assert.match(pulseHtml, /"@type":"CollectionPage"/);
  assert.match(pulseHtml, /"@type":"BreadcrumbList"/);
  assert.match(pulseHtml, /项目脉冲/);
  assert.match(pulseHtml, /上市公司/);
  assert.match(pulseHtml, /AI 日报/);

  const industry = await render("/industry");
  assert.equal(industry.status, 200);
  const industryHtml = await industry.text();
  assert.match(industryHtml, /从芯片到电网，/);
  assert.match(industryHtml, /hrefLang="en" href="https:\/\/idc-index\.com\/en\/industry"/);
  assert.match(industryHtml, /"@type":"CollectionPage"/);
  assert.match(industryHtml, /NVIDIA \/ AMD/);
  assert.match(industryHtml, /中国 GPU/);
  assert.match(industryHtml, /园区容量/);
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
  assert.match(source, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(source, /setIndustryHubTab\(tab as IndustryHubTab\)/);
  assert.match(source, /setActiveStage\(stage as ChainKey\)/);
});

test("renders the English research console and focused content routes", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Data Center Infrastructure Intelligence \| IDC Atlas<\/title>/);
  assert.match(html, /Hyperscaler capital expenditure/);
  assert.match(html, /Track the/);
  assert.match(html, /class="pulse-trace"/);
  assert.match(html, /class="english-console-sidebar"/);
  assert.match(html, /href="\/en#columns"/);
  assert.match(html, /class="console-column-card" id="columns"/);
  assert.match(html, /IDC ATLAS DEEP RESEARCH · LATEST 5/);
  assert.match(html, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.equal((html.match(/class="console-column-archive"/g) ?? []).length, 1);
  assert.equal((html.match(/href="\/en\/columns\/(?!microsoft-ai-capex)[^"]+"/g) ?? []).length >= 4, true);
  assert.match(html, /What matters now/);
  assert.match(html, /The next read-throughs/);
  assert.match(html, /console-earnings-strip/);
  assert.doesNotMatch(html, /China and United States · last 45 days/);

  const pulse = await render("/en/pulse");
  assert.equal(pulse.status, 200);
  const pulseHtml = await pulse.text();
  assert.match(pulseHtml, /Build\. Lease\./);
  assert.match(pulseHtml, /hrefLang="zh-CN" href="https:\/\/idc-index\.com\/pulse"/);
  assert.match(pulseHtml, /"@type":"CollectionPage"/);
  assert.match(pulseHtml, /Global project pulse/);

  const industry = await render("/en/industry");
  assert.equal(industry.status, 200);
  const industryHtml = await industry.text();
  assert.match(industryHtml, /From silicon to grid,/);
  assert.match(industryHtml, /hrefLang="zh-CN" href="https:\/\/idc-index\.com\/industry"/);
  assert.match(industryHtml, /"@type":"CollectionPage"/);
  assert.match(industryHtml, /Industry/);
  assert.match(industryHtml, /China watch/);
  assert.match(industryHtml, /Six infrastructure nodes/);
});

test("keeps bilingual console section navigation stable and readable", async () => {
  const hook = await readFile(new URL("../app/use-section-navigation.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(hook, /history\.replaceState/);
  assert.match(hook, /scrollIntoView\(\{ behavior: "smooth"/);
  assert.match(hook, /pageBottom >= documentBottom - 4/);
  assert.match(css, /\.english-console-mobile-dock a \{[^}]*font: 650 11px/);
  assert.match(css, /\.mobile-dock a \{[^}]*font-size: 11px/);
  assert.match(css, /\.english-console-sidebar nav strong \{ font-size: 13px/);
});

test("uses resilient typography rules across columns, console pages and calendar tables", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.column-article-body h2 \{ max-width: none/);
  assert.match(css, /\.column-article-body h2:lang\(zh-CN\) \{ word-break: keep-all; line-break: strict/);
  assert.match(css, /\.columns-index-hero h1:lang\(zh-CN\) \{[^}]*max-width: 1240px;[^}]*word-break: keep-all;[^}]*line-break: strict/);
  assert.match(css, /\.columns-index-hero h1:lang\(zh-CN\) > span, \.columns-index-hero h1:lang\(zh-CN\) > em \{ white-space: nowrap/);
  assert.match(css, /\.console-hero h1 \{ max-width: 1120px;[^}]*96px/);
  assert.match(css, /\.console-story-row p \{[^}]*font-size: 13\.5px/);
  assert.match(css, /\.calendar-share-table article > p,[\s\S]*font-size: 12px/);
  assert.match(css, /\.column-fact-table table \{[^}]*table-layout: auto/);
  assert.match(css, /\.column-article-thesis span, \.column-section-label \{[^}]*font: 700 12px/);
  assert.match(css, /\.column-article-hero > div \{[^}]*font: 650 11px/);
  assert.match(css, /\.column-article-body \{ width: min\(920px[^}]*padding: 54px 0 86px/);
  assert.match(css, /\.column-article-body > section \{ padding: 46px 0/);
  assert.match(css, /\.column-article-body > section, \.column-article-body > section:first-of-type \{ padding: 38px 0/);
  assert.doesNotMatch(css, /\.column-fact-table th:first-child/);
  assert.doesNotMatch(css, /\.column-article-body h2 \{ max-width: 22ch/);
});

test("groups the menu into four themes without changing section links", async () => {
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  for (const label of ["今日情报", "基础设施", "算力需求", "资本与市场"]) assert.match(source, new RegExp(label));
  for (const href of ["#pulse", "#daily", "#chain", "#nvidia", "#china-chips", "#models", "#projects", "#mna", "#cooling", "#benchmark"]) assert.match(source, new RegExp(href));
  assert.match(source, /site-menu-groups/);
  assert.match(source, /aria-label="IDC 脉冲地区筛选"/);
  assert.match(source, /pulseRegionCounts/);
  assert.doesNotMatch(source, /idc-index-chain-aurora\.png/);
});

test("uses explicit Beijing dates instead of relative timestamps", async () => {
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  assert.match(source, /year: "numeric", month: "2-digit", day: "2-digit"/);
  assert.doesNotMatch(source, /分钟前|小时前|天前/);
});

test("keeps the English site fully translated across the live coverage stack", async () => {
  const source = await readFile(new URL("../app/en/english-home.tsx", import.meta.url), "utf8");

  for (const marker of [
    "Digital Realty reports record Q2 leasing and backlog",
    "ChangXin Technology lists on STAR Market as an A-share DRAM manufacturer",
    "Shanghai DataPort joins a WAIC quantum-supercomputing-AI platform project",
    "ABot-World-0: unlimited interactive world generation on a single desktop GPU",
    "China Mobile Zhongwei data-center Campus B, Ningxia",
    "Vertiv expands AI data-center cooling manufacturing and testing in Italy",
    '"/media/china/hygon-dcu-visual.png"',
    '"/media/china/metax-c600.jpg"',
    '"一期 EPC 招标": "Phase I EPC tender"',
    '"科创板上市交易": "STAR Market trading begins"',
    '"5.52 万㎡ · 2.78 亿元": "55,200 sq m · RMB 278m"',
  ]) assert.match(source, new RegExp(marker));

  assert.doesNotMatch(source, /editorial English translation is pending/);
  assert.doesNotMatch(source, /lang="zh-CN"/);
  assert.match(source, /columnArticles\.slice\(0, 5\)/);
  assert.match(source, /href="\/en#columns"/);
  assert.match(source, /className="english-chain-icon"/);
  assert.match(source, /<ChainIcon type=/);
  assert.match(source, /article\.hrefEn/);
  assert.match(source, /view === "pulse"/);
});

test("publishes the bilingual CXMT impact column with ranked US chip exposure", async () => {
  const chinese = await render("/columns/cxmt-us-chip-impact");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /长鑫上市，谁会先感到压力/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/cxmt-us-chip-impact"/i);
  assert.match(chineseHtml, /Micron 承受的是价格与中国份额的双重压力/);
  assert.match(chineseHtml, /AMAT \/ LRCX \/ KLAC/);
  assert.match(chineseHtml, /当前判断/);
  assert.match(chineseHtml, /产能、bit 出货、收入份额和利润份额均为不同口径/);
  assert.doesNotMatch(chineseHtml, /不是.+而是|不是什么/);

  const english = await render("/en/columns/cxmt-us-chip-impact");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /CXMT Is Public\. Which US Chip Stocks Actually Feel It/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns\/cxmt-us-chip-impact"/i);
  assert.match(englishHtml, /Micron faces both pricing pressure and China substitution/);
  assert.match(englishHtml, /CXMT CapEx cannot be mapped dollar-for-dollar/);
  assert.match(englishHtml, /For information and research only/);
  assert.doesNotMatch(englishHtml, /isn.t the .+[,;:] it.s|is not the .+[,;:] it is/i);
});

test("keeps console navigation in the same order as the home-page reading sequence", async () => {
  const chinese = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
  const english = await readFile(new URL("../app/en/english-home.tsx", import.meta.url), "utf8");
  const chineseNav = chinese.slice(chinese.indexOf('aria-label="IDC Atlas Console 导航"'), chinese.indexOf("</nav>", chinese.indexOf('aria-label="IDC Atlas Console 导航"')));
  const englishNav = english.slice(english.indexOf('aria-label="English console navigation"'), english.indexOf("</nav>", english.indexOf('aria-label="English console navigation"')));

  for (const [first, second] of [["财报日历", "专栏"], ["专栏", "最新脉冲"], ["产业中心", "市场温度"]]) assert.ok(chineseNav.indexOf(first) < chineseNav.indexOf(second));
  for (const [first, second] of [["Company watch", "Columns"], ["Columns", "Markets"], ["Markets", "Industry map"]]) assert.ok(englishNav.indexOf(first) < englishNav.indexOf(second));
});

test("keeps the SK hynix earnings column source-led in both languages", async () => {
  const chinese = await render("/columns/sk-hynix-hbm-earnings");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /一份业绩，三层不同的证据/);
  assert.match(chineseHtml, /未取得可可靠核验的完整电话会问答文本/);
  assert.match(chineseHtml, /dateModified/);

  const english = await render("/en/columns/sk-hynix-hbm-earnings");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /One earnings release, three layers of evidence/);
  assert.match(englishHtml, /No complete earnings-call Q&amp;A transcript was reliably available/);
  assert.match(englishHtml, /For information and research only/);
});

test("publishes the deep Microsoft Azure and AI-capex column in both languages", async () => {
  const chinese = await render("/columns/microsoft-ai-capex");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /Azure 增长 43% 之后/);
  assert.match(chineseHtml, /从 1900 亿到 1750 亿美元/);
  assert.match(chineseHtml, /供给仍紧，微软用“延后绑定”控制过度建设风险/);
  assert.match(chineseHtml, /微软 FY2026 Q4 电话会/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/microsoft-ai-capex"/i);
  assert.match(chineseHtml, /"@type":"AnalysisNewsArticle"/);
  assert.match(chineseHtml, /本网站数据与内容仅用于信息展示与研究/);

  const english = await render("/en/columns/microsoft-ai-capex");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Azure at 43%/);
  assert.match(englishHtml, /The move from \$190B to \$175B is largely classification/);
  assert.match(englishHtml, /“late binding” is the overbuild defense/);
  assert.match(englishHtml, /Microsoft FY2026 Q4 earnings call/);
  assert.match(englishHtml, /For information and research only/);
});

test("publishes a bilingual frontier-model infrastructure column and excludes rumors from conclusions", async () => {
  const chinese = await render("/columns/frontier-model-economics");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /Claude 与 GPT 都在降价，AI 基建真正要看什么/);
  assert.match(chineseHtml, /Rumor Filter|传闻的正确位置是待验证清单/);
  assert.match(chineseHtml, /GPT-5\.6/);
  assert.match(chineseHtml, /Claude Opus 5/);

  const english = await render("/en/columns/frontier-model-economics");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Claude and GPT Are Getting Cheaper\. What Changes for AI Infrastructure/);
  assert.match(englishHtml, /Rumors belong on a verification list/);
  assert.match(englishHtml, /For information and research only/);
});

test("publishes the bilingual CAPEX Watch column with article metadata and primary sources", async () => {
  const chinese = await render("/columns/ai-capex-power");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /四大云厂商的 AI CAPEX/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/ai-capex-power"/i);
  assert.match(chineseHtml, /"@type":"Article"/);
  assert.match(chineseHtml, /Microsoft FY2026 Q4 财报电话会/);
  assert.match(chineseHtml, /下一季度资本开支超过 500 亿美元/);
  assert.match(chineseHtml, /未投运资产 \$108\.6B/);
  assert.match(chineseHtml, /Amazon 2026 Q1 业绩公告/);
  assert.match(chineseHtml, /本网站内容仅用于信息展示与研究/);
  assert.doesNotMatch(chineseHtml, /不在 GPU，而在电网/);

  const english = await render("/en/columns/ai-capex-power");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Where Hyperscaler AI CapEx Actually Goes/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns\/ai-capex-power"/i);
  assert.match(englishHtml, /Microsoft FY2026 Q4 earnings call/);
  assert.match(englishHtml, /Q1 CapEx is expected above \$50 billion/);
  assert.match(englishHtml, /\$75\.6B of future payments/);
  assert.match(englishHtml, /Amazon Q1 2026 earnings release/);
  assert.match(englishHtml, /For information and research only/);
  assert.doesNotMatch(englishHtml, /Isn.t the GPU/);
});

test("publishes the bilingual Lease Watch column with contract-level sourcing", async () => {
  const chinese = await render("/columns/hyperscale-idc-leases");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /GW 级长租正在改写 IDC 订单/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/hyperscale-idc-leases"/i);
  assert.match(chineseHtml, /APPLIED DIGITAL × COREWEAVE/);
  assert.match(chineseHtml, /VNET × LEADING INTERNET CUSTOMER/);
  assert.match(chineseHtml, /公司未披露的客户名称保持匿名/);
  assert.doesNotMatch(chineseHtml, /不是.+而是|不是什么/);

  const english = await render("/en/columns/hyperscale-idc-leases");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Gigawatt Leases Are Reshaping the Data Center Market/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns\/hyperscale-idc-leases"/i);
  assert.match(englishHtml, /More than 185MW was active and billable/);
  assert.match(englishHtml, /For information and research only/);
  assert.doesNotMatch(englishHtml, /isn.t the .+[,;:] it.s|is not the .+[,;:] it is/i);
});

test("keeps the homepage earnings watch compact and reachable", async () => {
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(source, /const heroCalendarEvents = upcomingEvents\.slice\(0, 3\)/);
  assert.match(source, /hero-calendar-more" href="\/calendar"/);
  assert.match(source, /aria-label=\{menuOpen \? "关闭导航菜单" : "打开导航菜单"\}/);
  assert.match(source, /core-company-pulse" id="listed"/);
  assert.match(source, /href="#listed"><span>03<\/span>标的/);
  assert.match(css, /\.hero \{ padding-bottom: 78px; \}/);
  assert.match(css, /\.compact-hero \.hero-signal \{ min-height: 0; \}/);
  assert.doesNotMatch(source, /一次只加载当前阅读区|减少在首页连续滚动|首页只保留中美各三条|切换标签时只显示当前主题/);
});

test("server-primes the bilingual homepages with the live first-screen payload", async () => {
  const initialAtlas = await readFile(new URL("../app/initial-atlas.ts", import.meta.url), "utf8");
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const homePage = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const englishPage = await readFile(new URL("../app/en/page.tsx", import.meta.url), "utf8");

  assert.match(initialAtlas, /x-idc-atlas-prime/);
  assert.match(initialAtlas, /DecompressionStream\("gzip"\)/);
  assert.match(workerSource, /const INITIAL_ATLAS_HEADER = "x-idc-atlas-prime"/);
  assert.match(workerSource, /function compactInitialAtlasPayload/);
  assert.match(workerSource, /new CompressionStream\("gzip"\)/);
  for (const key of ["idcPulse", "listedCompanyNews", "upcomingEvents", "aiDaily"]) assert.match(workerSource, new RegExp(key));
  assert.match(homePage, /<Home initialPayload=\{initialPayload\}/);
  assert.match(englishPage, /<EnglishHome initialPayload=\{initialPayload\}/);
});

test("uses source-linked earnings conclusions instead of stock-direction voting", async () => {
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  assert.match(workerSource, /conclusion:/);
  assert.match(workerSource, /13\.5GWh/);
  assert.match(workerSource, /alphabet-q2-2026[\s\S]*1,950–2,050/);
  assert.match(workerSource, /intel-q2-2026[\s\S]*DCAI[\s\S]*59%/);
  assert.match(workerSource, /function staticAtlasContent/);
  for (const source of ["calendarEvents", "capacityRadar", "coolingProgress", "officialChinaChipNews", "nvidiaProducts", "supernodeProducts", "mnaDeals"]) assert.match(workerSource, new RegExp(source));
  assert.match(workerSource, /content=\$\{staticContentVersion\}/);
  assert.doesNotMatch(workerSource, /earnings-polls|EARNINGS_VOTES|idc_vote_token/);
  assert.match(pageSource, /财报结论 · 已更新/);
  assert.doesNotMatch(pageSource, /预测上涨|预测下跌|earningsPolls|earnings-vote/);
});

test("keeps the large-campus radar current and source-backed", async () => {
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  for (const marker of ["5 GW 计算容量目标", "175 MW 关键 IT 负载", "133 MW IT 已交付", "332 MW IT 在运", "中国联通长三角（吴江）智算中心一期 EPC"]) assert.match(workerSource, new RegExp(marker));
  assert.match(workerSource, /\/api\/atlas-live-v5\?schema=v1/);
  assert.match(pageSource, /\/api\/atlas-live-v5\?schema=v1/);
  assert.match(workerSource, /口罩哥研报60秒/);
  assert.doesNotMatch(pageSource, /TRACKED SOURCES|source-watchlist/);
  assert.match(workerSource, /IDC_DAILY_SNAPSHOTS/);
  assert.match(workerSource, /\/api\/daily-snapshot/);
  assert.match(workerSource, /createScheduledSnapshot/);
  assert.match(workerSource, /forceRefresh: true, allowBootstrapSnapshot: false/);
  assert.match(pageSource, /晨间快照/);
});

test("keeps the ChangXin Technology listing in China AI silicon coverage", async () => {
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");

  for (const marker of ["长鑫科技登陆科创板", "688825.SH", "450,303.8971 万股", "科创板上市交易"]) assert.match(workerSource, new RegExp(marker));
});

test("keeps live-data validation in the deployment path", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJson.scripts.deploy, /check:live/);
  assert.match(await readFile(new URL("../scripts/check-live-data.mjs", import.meta.url), "utf8"), /newsStatus !== \"ok\"/);
});

test("redirects the Sites fallback host to the canonical production domain", async () => {
  const response = await render("/?source=sites", "dc-atlas-cn-us.catknowspray.chatgpt.site");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://idc-index.com/?source=sites");
});

test("defaults overseas readers to English and remembers explicit language choice", async () => {
  const overseas = await render("/", "dc-atlas.example", "US");
  assert.equal(overseas.status, 307);
  assert.equal(overseas.headers.get("location"), "https://dc-atlas.example/en");
  assert.match(overseas.headers.get("cache-control") ?? "", /no-store/);

  const mainland = await render("/", "dc-atlas.example", "CN");
  assert.equal(mainland.status, 200);

  const chinesePreference = await render("/", "dc-atlas.example", "US", "idc_lang=zh");
  assert.equal(chinesePreference.status, 200);

  const rememberEnglish = await render("/en?lang=en", "dc-atlas.example", "CN");
  assert.equal(rememberEnglish.status, 302);
  assert.equal(rememberEnglish.headers.get("location"), "https://dc-atlas.example/en");
  assert.match(rememberEnglish.headers.get("set-cookie") ?? "", /idc_lang=en/);
});

test("includes social sharing metadata for the request host", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /property="og:image" content="https:\/\/dc-atlas\.example\/og\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/i);
  assert.match(html, /lang="zh-CN"/i);
  assert.match(html, /rel="canonical" href="https:\/\/dc-atlas\.example\/"/i);
  assert.match(html, /hrefLang="en" href="https:\/\/dc-atlas\.example\/en"/i);
  assert.match(html, /"@type":"WebSite"/i);
});

test("serves crawl directives and bilingual topic pages", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/idc-index\.com\/sitemap\.xml/i);

  const privacy = await render("/privacy");
  assert.equal(privacy.status, 200);
  assert.match(await privacy.text(), /<meta name="robots" content="noindex, follow"/i);

  const topic = await render("/topics/china-ai-silicon");
  assert.equal(topic.status, 200);
  const html = await topic.text();
  assert.match(html, /中国 GPU 与 AI 芯片进展/);
  assert.match(html, /China GPU &amp; AI Silicon/);
  assert.match(html, /rel="canonical" href="https:\/\/idc-index\.com\/topics\/china-ai-silicon"/i);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /Frequently asked questions/);

  const dataCenterTopic = await render("/topics/data-center-intelligence");
  assert.equal(dataCenterTopic.status, 200);
  const dataCenterHtml = await dataCenterTopic.text();
  assert.match(dataCenterHtml, /数据中心市场追踪/);
  assert.match(dataCenterHtml, /"@type":"FAQPage"/);
  assert.match(dataCenterHtml, /hrefLang="x-default" href="https:\/\/idc-index\.com\/en\/topics\/data-center-intelligence"/i);

  const englishDataCenterTopic = await render("/en/topics/data-center-intelligence");
  assert.equal(englishDataCenterTopic.status, 200);
  const englishDataCenterHtml = await englishDataCenterTopic.text();
  assert.match(englishDataCenterHtml, /Data Center Market Tracker/);
  assert.match(englishDataCenterHtml, /International Data Corporation/);
  assert.match(englishDataCenterHtml, /"@type":"FAQPage"/);
  assert.match(englishDataCenterHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/topics\/data-center-intelligence"/i);
});

test("publishes the source methodology and includes it in the sitemap", async () => {
  const methodology = await render("/methodology");
  assert.equal(methodology.status, 200);
  const html = await methodology.text();
  assert.match(html, /方法与数据来源/);
  assert.match(html, /How we build the signal/);
  assert.match(html, /rel="canonical" href="https:\/\/idc-index\.com\/methodology"/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /https:\/\/idc-index\.com\/methodology/);
  const sitemapXml = await (await render("/sitemap.xml")).text();
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/ai-capex-power/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/ai-capex-power/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/hyperscale-idc-leases/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/hyperscale-idc-leases/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/cxmt-us-chip-impact/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/cxmt-us-chip-impact/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/frontier-model-economics/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/frontier-model-economics/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/microsoft-ai-capex/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/microsoft-ai-capex/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns</);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns</);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/topics\/data-center-intelligence/);
  assert.doesNotMatch(sitemapXml, /https:\/\/idc-index\.com\/privacy/);
});

test("publishes bilingual column indexes with crawl metadata", async () => {
  const chinese = await render("/columns");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /专栏，追踪/);
  assert.match(chineseHtml, /GW 级长租正在改写 IDC 订单/);
  assert.match(chineseHtml, /长鑫上市，谁会先感到压力/);
  assert.match(chineseHtml, /Claude 与 GPT 都在降价，AI 基建真正要看什么/);
  assert.match(chineseHtml, /Azure 增长 43% 之后，500 亿美元要兑现什么/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns"/i);
  assert.match(chineseHtml, /"@type":"ItemList"/);
  assert.match(chineseHtml, /column-cxmt-us-chips\.png/);

  const english = await render("/en/columns");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Columns for the/);
  assert.match(englishHtml, /Gigawatt Leases Are Reshaping the Data Center Market/);
  assert.match(englishHtml, /CXMT Is Public\. Which US Chip Stocks Actually Feel It/);
  assert.match(englishHtml, /Claude and GPT Are Getting Cheaper\. What Changes for AI Infrastructure/);
  assert.match(englishHtml, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns"/i);
  assert.match(englishHtml, /"@type":"ItemList"/);
});

test("publishes bilingual RSS feeds for original research", async () => {
  const chinese = await render("/feed.xml");
  assert.equal(chinese.status, 200);
  assert.match(chinese.headers.get("content-type") ?? "", /^application\/rss\+xml\b/i);
  const chineseXml = await chinese.text();
  assert.match(chineseXml, /<title>IDC Atlas 专栏<\/title>/);
  assert.match(chineseXml, /四大云厂商的 AI CAPEX/);
  assert.match(chineseXml, /https:\/\/idc-index\.com\/columns\/hyperscale-idc-leases/);
  assert.match(chineseXml, /https:\/\/idc-index\.com\/columns\/cxmt-us-chip-impact/);
  assert.match(chineseXml, /https:\/\/idc-index\.com\/columns\/frontier-model-economics/);
  assert.match(chineseXml, /https:\/\/idc-index\.com\/columns\/microsoft-ai-capex/);
  assert.match(chineseXml, /atom:link href="https:\/\/idc-index\.com\/feed\.xml"/);
  assert.match(chineseXml, /<lastBuildDate>/);

  const english = await render("/en/feed.xml");
  assert.equal(english.status, 200);
  assert.match(english.headers.get("content-type") ?? "", /^application\/rss\+xml\b/i);
  const englishXml = await english.text();
  assert.match(englishXml, /<title>IDC Atlas Columns<\/title>/);
  assert.match(englishXml, /Where Hyperscaler AI CapEx Actually Goes/);
  assert.match(englishXml, /CXMT Is Public\. Which US Chip Stocks Actually Feel It/);
  assert.match(englishXml, /Claude and GPT Are Getting Cheaper\. What Changes for AI Infrastructure/);
  assert.match(englishXml, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.match(englishXml, /atom:link href="https:\/\/idc-index\.com\/en\/feed\.xml"/);
});

test("gives the earnings calendar and poster route distinct crawl metadata", async () => {
  const calendar = await render("/calendar");
  const calendarHtml = await calendar.text();
  assert.match(calendarHtml, /rel="canonical" href="https:\/\/idc-index\.com\/calendar"/i);
  assert.match(calendarHtml, /property="og:title" content="美股科技财报日历｜IDC Atlas"/i);
  assert.match(calendarHtml, /href="\/#calendar" class="calendar-share-back">← 返回首页<\/a>/i);

  const poster = await render("/calendar/poster");
  const posterHtml = await poster.text();
  assert.match(posterHtml, /<meta name="robots" content="noindex, nofollow"/i);
  assert.doesNotMatch(posterHtml, /calendar-share-back/);
});
