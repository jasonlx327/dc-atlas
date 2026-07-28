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
  assert.match(html, /<title>IDC Atlas｜全球数据中心产业地图与实时情报站<\/title>/i);
  assert.match(html, /Track the/);
  assert.match(html, /class="pulse-trace"/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-XRKL96W42Q/);
  assert.match(html, /gtag\('config', 'G-XRKL96W42Q'\)/);
  assert.match(html, /class="zh-console-sidebar"/);
  assert.match(html, /href="\/pulse"><span>02<\/span><strong>最新脉冲/);
  assert.match(html, /href="\/industry"><span>05<\/span><strong>产业中心/);
  assert.match(html, /EARNINGS WATCH · IDC CALENDAR/);
  assert.match(html, /IDC ATLAS 专栏精选/);
  assert.match(html, /GW 级长租/);
  assert.match(html, /href="\/columns\/hyperscale-idc-leases"/);
  assert.match(html, /今天值得看的脉冲/);
  assert.match(html, /核心 IDC 标的/);
  assert.match(html, /从算力到需求/);
  assert.match(html, /chain-node-icon/);
  assert.match(html, /并购与市场温度/);
  assert.match(html, /每条信息，都能回到出处/);
  assert.doesNotMatch(html, /产品、形态与发布节奏|国产超节点路线|大模型发布与评测|大型园区进度|液冷部署进度/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("publishes focused Pulse and Industry content hubs", async () => {
  const pulse = await render("/pulse");
  assert.equal(pulse.status, 200);
  const pulseHtml = await pulse.text();
  assert.match(pulseHtml, /最新脉冲，/);
  assert.match(pulseHtml, /项目脉冲/);
  assert.match(pulseHtml, /上市公司/);
  assert.match(pulseHtml, /AI 日报/);

  const industry = await render("/industry");
  assert.equal(industry.status, 200);
  const industryHtml = await industry.text();
  assert.match(industryHtml, /产业链，/);
  assert.match(industryHtml, /NVIDIA \/ AMD/);
  assert.match(industryHtml, /中国 GPU/);
  assert.match(industryHtml, /园区容量/);
});

test("renders the English research console and focused content routes", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Track the/);
  assert.match(html, /class="pulse-trace"/);
  assert.match(html, /class="english-console-sidebar"/);
  assert.match(html, /What matters now/);
  assert.match(html, /The next read-throughs/);
  assert.match(html, /console-earnings-strip/);
  assert.doesNotMatch(html, /China and United States · last 45 days/);

  const pulse = await render("/en/pulse");
  assert.equal(pulse.status, 200);
  assert.match(await pulse.text(), /Global project pulse/);

  const industry = await render("/en/industry");
  assert.equal(industry.status, 200);
  const industryHtml = await industry.text();
  assert.match(industryHtml, /Industry/);
  assert.match(industryHtml, /China watch/);
  assert.match(industryHtml, /Six infrastructure nodes/);
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
  assert.match(source, /Gigawatt leases are/);
  assert.match(source, /href="\/en\/columns"/);
  assert.match(source, /className="english-chain-icon"/);
  assert.match(source, /<ChainIcon type=/);
  assert.match(source, /href="\/en\/columns\/hyperscale-idc-leases"/);
  assert.match(source, /view === "pulse"/);
});

test("publishes the bilingual CAPEX Watch column with article metadata and primary sources", async () => {
  const chinese = await render("/columns/ai-capex-power");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /AI 基建竞赛进入电力时代/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/ai-capex-power"/i);
  assert.match(chineseHtml, /"@type":"Article"/);
  assert.match(chineseHtml, /微软 FY2026 Q3 财报电话会/);
  assert.match(chineseHtml, /本网站内容仅用于信息展示与研究/);
  assert.doesNotMatch(chineseHtml, /不在 GPU，而在电网/);

  const english = await render("/en/columns/ai-capex-power");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /The AI Buildout Enters Its Power-Hungry Phase/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns\/ai-capex-power"/i);
  assert.match(englishHtml, /Microsoft FY2026 Q3 earnings call/);
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
  assert.match(html, /lang="zh-CN"/i);
  assert.match(html, /rel="canonical" href="https:\/\/dc-atlas\.example\/"/i);
  assert.match(html, /hrefLang="en" href="https:\/\/dc-atlas\.example\/en"/i);
  assert.match(html, /"@type":"WebSite"/i);
});

test("serves crawl directives and bilingual topic pages", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/idc-index\.com\/sitemap\.xml/i);

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
  assert.match(dataCenterHtml, /Global Data Center Intelligence/);
  assert.match(dataCenterHtml, /"@type":"FAQPage"/);
  assert.match(dataCenterHtml, /Is this investment advice/);
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
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns</);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns</);
});

test("publishes bilingual column indexes with crawl metadata", async () => {
  const chinese = await render("/columns");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /专栏，追踪/);
  assert.match(chineseHtml, /GW 级长租正在改写 IDC 订单/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns"/i);

  const english = await render("/en/columns");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Columns for the/);
  assert.match(englishHtml, /Gigawatt Leases Are Reshaping the Data Center Market/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns"/i);
});

test("gives the earnings calendar and poster route distinct crawl metadata", async () => {
  const calendar = await render("/calendar");
  const calendarHtml = await calendar.text();
  assert.match(calendarHtml, /rel="canonical" href="https:\/\/idc-index\.com\/calendar"/i);
  assert.match(calendarHtml, /property="og:title" content="美股科技财报日历｜IDC Atlas"/i);

  const poster = await render("/calendar/poster");
  const posterHtml = await poster.text();
  assert.match(posterHtml, /<meta name="robots" content="noindex, nofollow"/i);
});
