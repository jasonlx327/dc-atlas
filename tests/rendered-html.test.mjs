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

test("server-renders the bilingual intelligence-console homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>全球数据中心与 AI 基础设施情报｜IDC Atlas<\/title>/i);
  assert.match(html, /超大规模云厂商 CAPEX/);
  assert.match(html, /hrefLang="x-default" href="https:\/\/dc-atlas\.example\/en"/);
  assert.match(html, /class="atlas-console-overview"/);
  assert.match(html, /class="atlas-console-rail(?: |")/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-XRKL96W42Q/);
  assert.match(html, /gtag\('config', 'G-XRKL96W42Q'\)/);
  assert.match(html, /href="\/#calendar"><span>02<\/span><strong>财报 \/ 资本支出/);
  assert.match(html, /href="\/#columns"><span>03<\/span><strong>专栏/);
  assert.match(html, /href="\/pulse"><span>04<\/span><strong>脉搏监测/);
  assert.match(html, /href="\/industry"><span>06<\/span><strong>产业链地图/);
  assert.match(html, /资本支出与财报日历/);
  assert.match(html, /class="atlas-calendar-viewport"/);
  assert.match(html, /class="atlas-calendar-track"/);
  assert.match(html, /class="atlas-calendar-group" aria-hidden="true"/);
  assert.match(html, /研究队列/);
  assert.match(html, /src="\/lead-amazon-aws-capex\.png"/);
  assert.match(html, /SpaceX 1\.4GW 只押 NVIDIA，Anthropic 2GW 引入 AMD/);
  assert.match(html, /column-accelerator-platform-divergence-v1\.jpg/);
  assert.match(html, /href="\/#columns"/);
  assert.match(html, /href="\/columns\/accelerator-platform-divergence"/);
  assert.doesNotMatch(html, /情报摘要/);
  assert.match(html, /市场脉搏/);
  assert.match(html, /class="atlas-pulse-wave"/);
  assert.match(html, /class="atlas-pulse-viewport"/);
  assert.match(html, /class="atlas-pulse-track"/);
  assert.match(html, /class="atlas-pulse-group" aria-hidden="true"/);
  assert.match(html, /aria-pressed="false">暂停/);
  assert.match(html, /上市公司动态/);
  assert.match(html, /产业链地图/);
  assert.match(html, /atlas-chain-icon/);
  assert.match(html, /href="\/industry\?tab=chain&amp;stage=compute"/);
  assert.match(html, /并购与市场动态/);
  assert.match(html, /信息仅供专业投资者参考，不构成投资建议/);
  assert.doesNotMatch(html, /产品、形态与发布节奏|国产超节点路线|大模型发布与评测|大型园区进度|液冷部署进度/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps mobile pages readable without forced horizontal layouts", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\/\* Mobile readability and overflow guardrails \*\//);
  assert.match(css, /\.columns-index-hero h1:lang\(zh-CN\)[\s\S]*white-space: normal; word-break: normal;/);
  assert.match(css, /\.calendar-share-table-head \{ display: none; \}/);
  assert.match(css, /\.calendar-share-table article \{[\s\S]*min-width: 0;[\s\S]*grid-template-columns: 66px minmax\(0, 1fr\);/);
  assert.match(css, /\.industry-hub \.chain-detail \{ display: grid; grid-template-columns: 1fr;/);
  assert.match(css, /\.industry-hub \.chain-news \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /\.mobile-dock a \{[\s\S]*font-size: 12px;/);
  assert.match(css, /\.compact-footer, \.english-console-footer, footer \{ padding-bottom: calc\(98px \+ env\(safe-area-inset-bottom\)\); \}/);
  assert.match(css, /@keyframes atlasPulseLoop/);
  assert.match(css, /@keyframes atlasPulseSweep/);
  assert.match(css, /@keyframes atlasCalendarLoop/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.atlas-pulse-group\[aria-hidden="true"\] \{ display: none; \}/);
});

test("lets mobile supply-chain nodes expand and collapse", async () => {
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
  assert.match(source, /const \[mobileOpenStage, setMobileOpenStage\] = useState<ChainKey \| null>\(null\)/);
  assert.match(source, /const expanded = mobileOpenStage === stage\.key/);
  assert.match(source, /setMobileOpenStage\(\(current\) => current === stage\.key \? null : stage\.key\)/);
  assert.match(source, /aria-expanded=\{expanded\}/);
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

test("publishes bilingual policy index and rumor watch routes", async () => {
  const policy = await render("/policy");
  assert.equal(policy.status, 200);
  const policyHtml = await policy.text();
  assert.match(policyHtml, /中美数据中心政策追踪/);
  assert.match(policyHtml, /POLICY WATCH · DIRECT IMPACT/);
  assert.match(policyHtml, /弗吉尼亚州开始征收数据中心用电税/);
  assert.match(policyHtml, /直接影响/);
  assert.match(policyHtml, /市场传闻/);

  const rumors = await render("/rumors");
  assert.equal(rumors.status, 200);
  const rumorsHtml = await rumors.text();
  assert.match(rumorsHtml, /市场传闻与待核验线索/);
  assert.match(rumorsHtml, /RUMOR WATCH · SOURCE LINKED/);
  assert.match(rumorsHtml, /长鑫科技据报考虑在北京亦庄建设第二座DRAM晶圆厂/);
  assert.match(rumorsHtml, /Hut 8未披露的得州租户/);
  assert.match(rumorsHtml, /公开回应/);

  const english = await render("/en/rumors");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Rumor Watch/);
  assert.match(englishHtml, /Reported market developments/);
  assert.match(englishHtml, /CXMT is reported to be considering a second DRAM fab in Beijing/);
  assert.match(englishHtml, /Nvidia is reported to be Hut 8/);
  assert.match(englishHtml, /PUBLIC RESPONSE/);

  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.watch-impact \{/);
  assert.match(css, /\.watch-card \{[^}]*background: var\(--atlas-surface\);[^}]*color: var\(--atlas-ink\);/);
  assert.doesNotMatch(css, /\.watch-card \{[^}]*linear-gradient\(145deg, rgba\(17,28,41/);
});

test("publishes shareable bilingual policy and Rumor Watch brief pages", async () => {
  const policy = await render("/policy/us-fcc-covered-list-component-proposal-2026");
  assert.equal(policy.status, 200);
  const policyHtml = await policy.text();
  assert.match(policyHtml, /FCC拟扩大Covered List组件限制/);
  assert.match(policyHtml, /rel="canonical" href="https:\/\/idc-index\.com\/policy\/us-fcc-covered-list-component-proposal-2026"/i);
  assert.match(policyHtml, /"@type":"Article"/);
  assert.match(policyHtml, /"@type":"BreadcrumbList"/);
  assert.match(policyHtml, /直接影响/);
  assert.match(policyHtml, /Federal Communications Commission/);

  const rumor = await render("/rumors/spacex-nvidia-ai-infrastructure-call-2026");
  assert.equal(rumor.status, 200);
  const rumorHtml = await rumor.text();
  assert.match(rumorHtml, /SpaceX据报将AI基础设施部署锁定为NVIDIA路线/);
  assert.match(rumorHtml, /rel="canonical" href="https:\/\/idc-index\.com\/rumors\/spacex-nvidia-ai-infrastructure-call-2026"/i);
  assert.match(rumorHtml, /公开回应/);
  assert.match(rumorHtml, /不等同于已核验事实/);

  const english = await render("/en/rumors/spacex-nvidia-ai-infrastructure-call-2026");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /SpaceX is reported to be choosing Nvidia for its AI-infrastructure buildout/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/rumors\/spacex-nvidia-ai-infrastructure-call-2026"/i);
  assert.match(englishHtml, /PUBLIC RESPONSE/);

  const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.match(sitemap, /publishedColumnArticles/);
  assert.match(sitemap, /POLICY_BRIEFS\.flatMap/);
  assert.match(sitemap, /RUMOR_BRIEFS\.flatMap/);
});

test("renders the English research console and focused content routes", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<title>Data Center Infrastructure Intelligence \| IDC Atlas<\/title>/);
  assert.match(html, /Hyperscaler capital expenditure/);
  assert.match(html, /class="atlas-console-overview"/);
  assert.match(html, /class="atlas-console-rail(?: |")/);
  assert.match(html, /href="\/en#columns"/);
  assert.match(html, /Research queue/);
  assert.match(html, /Qwen3\.8 Is Live: Seven Tests for Alibaba Cloud/);
  assert.match(html, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.equal((html.match(/href="\/en\/columns\/(?!microsoft-ai-capex)[^"]+"/g) ?? []).length >= 4, true);
  assert.match(html, /CapEx &amp; earnings watch/);
  assert.doesNotMatch(html, /Atlas intelligence brief/);
  assert.match(html, /Live infrastructure pulse/);
  assert.match(html, /Industry chain navigator/);
  assert.match(html, /href="\/en\/methodology">Methodology/);
  assert.match(html, /href="\/en\/privacy">Privacy/);
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

test("publishes searchable bilingual entity profiles", async () => {
  const chinese = await render("/companies/microsoft");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /微软/);
  assert.match(chineseHtml, /最新披露/);
  assert.match(chineseHtml, /搜索公司 \/ 项目/);
  assert.match(chineseHtml, /canonical" href="https:\/\/idc-index\.com\/companies\/microsoft"/);

  const english = await render("/en/companies/microsoft");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Microsoft/);
  assert.match(englishHtml, /Latest disclosures/);
  assert.match(englishHtml, /Find company \/ project/);
  assert.match(englishHtml, /canonical" href="https:\/\/idc-index\.com\/en\/companies\/microsoft"/);
});

test("exposes bilingual AI-readable discovery manifests", async () => {
  const chinese = await render("/llms.txt");
  assert.equal(chinese.status, 200);
  assert.match(chinese.headers.get("content-type") ?? "", /^text\/plain/i);
  assert.match(await chinese.text(), /## Core pages/);

  const english = await render("/en/llms.txt");
  assert.equal(english.status, 200);
  assert.equal(english.headers.get("content-language"), "en-US");
  const englishText = await english.text();
  assert.match(englishText, /Where Hyperscaler AI CapEx Actually Goes/);
  assert.match(englishText, /After SK hynix Earnings/);
});

test("keeps bilingual console section navigation stable and readable", async () => {
  const hook = await readFile(new URL("../app/use-section-navigation.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const overview = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");
  assert.match(hook, /history\.replaceState/);
  assert.match(hook, /scrollIntoView\(\{ behavior: "smooth"/);
  assert.match(hook, /pageBottom >= documentBottom - 4/);
  assert.match(overview, /const \[navCollapsed, setNavCollapsed\] = useState\(false\)/);
  assert.match(overview, /window\.matchMedia\("\(max-width: 820px\)"\)/);
  assert.match(overview, /atlas-console-reopen/);
  assert.match(css, /\.atlas-console-overview\.rail-collapsed \{ padding-left: 0; \}/);
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
  assert.match(css, /\.atlas-column-article-shell \.column-fact-table tbody th \{[\s\S]*white-space: normal;[\s\S]*overflow-wrap: anywhere;/);
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
  const overview = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");

  assert.match(source, /year: "numeric", month: "2-digit", day: "2-digit"/);
  assert.doesNotMatch(source, /分钟前|小时前|天前/);
  assert.match(overview, /const timezone = isZh \? "Asia\/Shanghai" : "America\/New_York"/);
});

test("keeps the English site fully translated across the live coverage stack", async () => {
  const source = await readFile(new URL("../app/en/english-home.tsx", import.meta.url), "utf8");
  const overview = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");

  for (const marker of [
    "Amazon Q2: AWS grows 37% as AI infrastructure spending weighs on free cash flow",
    "Meta Q2 capex reaches \\$31.1B; full-year range narrows to \\$130B–\\$145B",
    "Microsoft FY26 Q4: Azure grows 43% and next-quarter capex is set to exceed \\$50B",
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
  assert.match(overview, /publishedColumnArticles\(\)\.slice\(0, 5\)/);
  assert.match(overview, /hrefEn: "\/en#columns"/);
  assert.match(source, /className="english-chain-icon"/);
  assert.match(source, /<ChainIcon type=/);
  assert.match(overview, /article\.hrefEn/);
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
  const overview = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");
  const nav = overview.slice(overview.indexOf("const navItems"), overview.indexOf("] as const;", overview.indexOf("const navItems")));
  const overviewStart = overview.indexOf("export function IntelligenceConsoleOverview");
  const layout = overview.slice(overviewStart, overview.indexOf('<footer className="atlas-console-footer"', overviewStart));

  for (const [first, second] of [["财报 / 资本支出", "专栏"], ["专栏", "脉搏监测"], ["公司", "产业链地图"], ["产业链地图", "市场"]]) assert.ok(nav.indexOf(first) < nav.indexOf(second));
  for (const [first, second] of [["id=\"calendar\"", 'id="columns"'], ['id="columns"', 'id="pulse"'], ['id="pulse"', 'id="companies"'], ['id="companies"', 'id="industry"'], ['id="industry"', 'id="market"']]) assert.ok(layout.indexOf(first) < layout.indexOf(second));
});

test("keeps lightweight RSS and canonical QR sharing in the shared console footer", async () => {
  const overview = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(overview, /订阅研究更新|Subscribe to research/);
  assert.match(overview, /RSS 地址已复制|RSS address copied/);
  assert.match(overview, /feedly\.com\/i\/subscription\/feed/);
  assert.match(overview, /https:\/\/idc-index\.com\$\{path === "\/" \? "" : path\}/);
  assert.match(overview, /二维码分享当前页面/);
  assert.match(overview, /Share this page with a QR code/);
  assert.match(css, /\.atlas-console-tools/);
  assert.match(css, /\.atlas-console-share/);
});

test("keeps the SK hynix earnings column source-led in both languages", async () => {
  const chinese = await render("/columns/sk-hynix-hbm-earnings");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /一份业绩，三层不同的证据/);
  assert.match(chineseHtml, /公司提供电话会音频归档，但未提供稳定可引用的官方全文/);
  assert.match(chineseHtml, /dateModified/);

  const english = await render("/en/columns/sk-hynix-hbm-earnings");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /One earnings release, three layers of evidence/);
  assert.match(englishHtml, /company provides a call archive but no stable official transcript/i);
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

test("publishes the bilingual Alibaba Cloud and Qwen3.8 earnings preview", async () => {
  const chinese = await render("/columns/alibaba-qwen-cloud");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /Qwen3\.8 已上线/);
  assert.match(chineseHtml, /阿里云下一份财报要回答七个问题/);
  assert.match(chineseHtml, /三年 3,800 亿元如何变成可售容量/);
  assert.match(chineseHtml, /Qwen3\.8 在六月季度后发布/);
  assert.match(chineseHtml, /column-alibaba-qwen-cloud-v2\.jpg/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns\/alibaba-qwen-cloud"/i);
  assert.match(chineseHtml, /"@type":"AnalysisNewsArticle"/);

  const english = await render("/en/columns/alibaba-qwen-cloud");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Qwen3\.8 Is Live/);
  assert.match(englishHtml, /Seven Tests for Alibaba Cloud/);
  assert.match(englishHtml, /how RMB380B becomes sellable capacity/);
  assert.match(englishHtml, /Qwen3\.8 arrived after the June quarter/);
  assert.match(englishHtml, /For information and research only/);
});

test("publishes a bilingual frontier-model infrastructure column and excludes rumors from conclusions", async () => {
  const chinese = await render("/columns/frontier-model-economics");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /模型价格正在分层，AI 基建真正要看什么/);
  assert.match(chineseHtml, /RUMOR FILTER|待验证清单/);
  assert.match(chineseHtml, /GPT-5\.6/);
  assert.match(chineseHtml, /Claude Opus 5/);

  const english = await render("/en/columns/frontier-model-economics");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Model Prices Are Fragmenting\. What Changes for AI Infrastructure/);
  assert.match(englishHtml, /Rumors and single-source reports belong on a verification list/);
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
  assert.match(chineseHtml, /Google Cloud \+82%/);
  assert.match(chineseHtml, /Amazon 2026 Q2 业绩公告/);
  assert.match(chineseHtml, /本网站内容仅用于信息展示与研究/);
  assert.doesNotMatch(chineseHtml, /不在 GPU，而在电网/);

  const english = await render("/en/columns/ai-capex-power");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Where Hyperscaler AI CapEx Actually Goes/);
  assert.match(englishHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/columns\/ai-capex-power"/i);
  assert.match(englishHtml, /Microsoft FY2026 Q4 earnings call/);
  assert.match(englishHtml, /Q1 CapEx is expected above \$50 billion/);
  assert.match(englishHtml, /Google Cloud revenue \+82%/);
  assert.match(englishHtml, /Amazon Q2 2026 earnings release/);
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

test("publishes the first scheduled research column and keeps later releases time-gated", async () => {
  const chinese = await render("/columns/accelerator-platform-divergence");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /SpaceX 1\.4GW 只押 NVIDIA，Anthropic 2GW 引入 AMD/);
  assert.match(chineseHtml, /铭牌功率为 1\.4GW/);
  assert.match(chineseHtml, /媒体对电话会的报道/);
  assert.match(chineseHtml, /column-accelerator-platform-divergence-v1\.jpg/);
  assert.match(chineseHtml, /"@type":"AnalysisNewsArticle"/);

  const english = await render("/en/columns/accelerator-platform-divergence");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /SpaceX Standardizes on NVIDIA While Anthropic Brings AMD to 2GW/);
  assert.match(englishHtml, /Nameplate compute draw reached 1\.4GW/);
  assert.match(englishHtml, /media account of the call/);

  const articleSource = await readFile(new URL("../app/columns/articles.ts", import.meta.url), "utf8");
  const routeSource = await readFile(new URL("../app/columns/[slug]/page.tsx", import.meta.url), "utf8");
  const feedSource = await readFile(new URL("../app/feed.xml/route.ts", import.meta.url), "utf8");
  for (const publishAt of [
    "2026-08-05T00:00:00+08:00",
    "2026-08-05T21:00:00+08:00",
    "2026-08-06T09:00:00+08:00",
    "2026-08-06T21:00:00+08:00",
    "2026-08-07T09:00:00+08:00",
  ]) assert.match(articleSource, new RegExp(publishAt.replaceAll("+", "\\+")));
  assert.match(routeSource, /isColumnPublished\(slug\)/);
  assert.match(feedSource, /publishedColumnArticles\(\)/);
});

test("renders every bilingual column inside the shared console reading layout", async () => {
  const slugs = [
    "accelerator-platform-divergence",
    "ai-capex-power",
    "cxmt-us-chip-impact",
    "frontier-model-economics",
    "hyperscale-idc-leases",
    "microsoft-ai-capex",
    "sk-hynix-hbm-earnings",
  ];
  for (const slug of slugs) {
    for (const prefix of ["/columns", "/en/columns"]) {
      const response = await render(`${prefix}/${slug}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /atlas-column-article-shell/);
      assert.match(html, /atlas-console-rail/);
      assert.match(html, /class="column-article-page"/);
    }
  }

  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.atlas-column-article-shell \.column-article-nav \{ display: none; \}/);
  assert.match(css, /\.atlas-column-article-shell \.column-article-body > section > p \{[\s\S]*font-size: 18px;/);
  assert.match(css, /\.atlas-column-article-shell \.column-article-hero h1 br \{ display: none; \}/);
});

test("keeps the homepage earnings watch compact and reachable", async () => {
  const source = await readFile(new URL("../app/intelligence-console-overview.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(source, /const events = data\.events\.slice\(0, 6\)/);
  assert.match(source, /财报结论已更新/);
  assert.match(source, /Post-results read-through/);
  assert.match(source, /className="atlas-calendar" id="calendar"/);
  assert.match(source, /className="atlas-calendar-viewport"/);
  assert.match(source, /--atlas-calendar-visible-rows/);
  assert.match(source, /className="atlas-calendar-track"/);
  assert.match(source, /setCalendarPaused/);
  assert.match(source, /renderCalendarEvents/);
  const calendarClient = await readFile(new URL("../app/calendar/calendar-client.tsx", import.meta.url), "utf8");
  assert.match(calendarClient, /calendarEvents\?: CalendarEvent\[\]/);
  assert.match(calendarClient, /即将发布/);
  assert.match(calendarClient, /已发布结论/);
  assert.match(calendarClient, /event\.conclusion && event\.startsAt && new Date\(event\.startsAt\)/);
  const worker = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  assert.match(worker, /function featuredCalendar/);
  assert.match(worker, /return \[\.\.\.upcoming, \.\.\.concluded\]\.slice\(0, 6\)/);
  assert.match(worker, /calendarEvents: allCalendarEvents/);
  assert.match(worker, /new URL\(request\.url\)\.pathname === "\/calendar"/);
  assert.match(worker, /calendarEvents: firstItems\(payload\.calendarEvents, 20\)/);
  assert.match(worker, /tencent-q2-2026/);
  assert.match(worker, /alibaba-june-quarter-2026-pending/);
  assert.match(source, /isZh \? "\/calendar" : "\/en#calendar"/);
  assert.match(source, /className="atlas-research-queue" id="columns"/);
  assert.match(source, /className="atlas-company-watch" id="companies"/);
  assert.doesNotMatch(source, /className="atlas-brief"/);
  assert.match(css, /\.atlas-calendar, \.atlas-research-queue \{ min-height: 320px/);
  assert.match(css, /\.atlas-decision-grid \{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.atlas-lead-image \{[\s\S]*grid-template-rows: minmax\(0, 1fr\) auto;/);
  assert.match(css, /\.atlas-lead-image img \{ width: 100%; height: 100%; min-height: 180px;/);
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
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const liveCheck = await readFile(new URL("../scripts/check-live-data.mjs", import.meta.url), "utf8");
  assert.match(packageJson.scripts.deploy, /check:live/);
  assert.match(packageJson.scripts.build, /prepare-sites-build/);
  assert.match(liveCheck, /newsStatus !== "ok"/);
  for (const section of ["idcPulse", "listedCompanyNews", "mnaDeals", "capacityRadar", "coolingProgress"]) assert.match(liveCheck, new RegExp(section));
  assert.match(liveCheck, /freshness\.status === "stale"/);
  assert.match(workerSource, /CONTENT_REVIEWED_AT = "2026-08-05"/);
  assert.match(workerSource, /AMD Q2 数据中心收入 67 亿美元/);
  assert.match(workerSource, /Hut 8 Q2 披露 949MW 已签约 IT 容量/);
  assert.match(workerSource, /hut8-q2-2026-construction/);
  assert.match(workerSource, /Amazon Q2 AWS 增长 37%/);
  assert.match(workerSource, /Meta Q2 资本开支 311 亿美元/);
  assert.match(workerSource, /Microsoft FY26 Q4 Azure 增长 43%/);
  assert.match(workerSource, /Core Scientific Q2 已签约容量约 1\.1GW/);
  assert.match(workerSource, /中国移动将于 8 月 13 日披露半年报/);
  assert.match(workerSource, /sectionFreshnessState/);
  for (const marker of ["galaxy-mcgregor-campus-2026", "energy-vault-snyder-ai-groundbreaking", "hut8-beacon-point-second-352mw-lease", "eqt-copia-power"]) assert.match(workerSource, new RegExp(marker));
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
  assert.match(html, /常见问题/);
  const englishChinaTopic = await render("/en/topics/china-ai-silicon");
  assert.equal(englishChinaTopic.status, 200);
  const englishChinaHtml = await englishChinaTopic.text();
  assert.match(englishChinaHtml, /Frequently asked questions/);
  assert.match(englishChinaHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/topics\/china-ai-silicon"/i);

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

  const englishMethodology = await render("/en/methodology");
  assert.equal(englishMethodology.status, 200);
  const englishMethodologyHtml = await englishMethodology.text();
  assert.match(englishMethodologyHtml, /How IDC Atlas[\s\S]*builds a signal/);
  assert.match(englishMethodologyHtml, /rel="canonical" href="https:\/\/idc-index\.com\/en\/methodology"/i);

  const englishPrivacy = await render("/en/privacy");
  assert.equal(englishPrivacy.status, 200);
  const englishPrivacyHtml = await englishPrivacy.text();
  assert.match(englishPrivacyHtml, /Privacy notice/);
  assert.match(englishPrivacyHtml, /<meta name="robots" content="noindex, follow"/i);

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
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns\/alibaba-qwen-cloud/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns\/alibaba-qwen-cloud/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/columns</);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/columns</);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/topics\/data-center-intelligence/);
  assert.match(sitemapXml, /https:\/\/idc-index\.com\/en\/methodology/);
  assert.doesNotMatch(sitemapXml, /https:\/\/idc-index\.com\/privacy/);
});

test("publishes bilingual column indexes with crawl metadata", async () => {
  const chinese = await render("/columns");
  assert.equal(chinese.status, 200);
  const chineseHtml = await chinese.text();
  assert.match(chineseHtml, /专栏，追踪/);
  assert.match(chineseHtml, /GW 级长租正在改写 IDC 订单/);
  assert.match(chineseHtml, /长鑫上市，谁会先感到压力/);
  assert.match(chineseHtml, /模型价格正在分层，AI 基建真正要看什么/);
  assert.match(chineseHtml, /Azure 增长 43% 之后，500 亿美元要兑现什么/);
  assert.match(chineseHtml, /Qwen3\.8 已上线，阿里云下一份财报要回答七个问题/);
  assert.match(chineseHtml, /rel="canonical" href="https:\/\/idc-index\.com\/columns"/i);
  assert.match(chineseHtml, /"@type":"ItemList"/);
  for (const cover of [
    "column-alibaba-qwen-cloud-v2.jpg",
    "column-microsoft-ai-capex-v2.jpg",
    "column-frontier-model-economics-v2.jpg",
    "column-sk-hynix-hbm-v2.jpg",
    "column-cxmt-us-chips-v2.jpg",
    "column-ai-capex-grid-v2.jpg",
    "column-hyperscale-leases-v2.jpg",
  ]) assert.match(chineseHtml, new RegExp(cover.replace(".", "\\.")));

  const english = await render("/en/columns");
  assert.equal(english.status, 200);
  const englishHtml = await english.text();
  assert.match(englishHtml, /Columns for the/);
  assert.match(englishHtml, /Gigawatt Leases Are Reshaping the Data Center Market/);
  assert.match(englishHtml, /CXMT Is Public\. Which US Chip Stocks Actually Feel It/);
  assert.match(englishHtml, /Model Prices Are Fragmenting\. What Changes for AI Infrastructure/);
  assert.match(englishHtml, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.match(englishHtml, /Qwen3\.8 Is Live: Seven Tests for Alibaba Cloud/);
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
  assert.match(chineseXml, /https:\/\/idc-index\.com\/columns\/alibaba-qwen-cloud/);
  assert.match(chineseXml, /atom:link href="https:\/\/idc-index\.com\/feed\.xml"/);
  assert.match(chineseXml, /xml-stylesheet type="text\/xsl" href="https:\/\/idc-index\.com\/rss\.xsl"/);
  assert.match(chineseXml, /<lastBuildDate>/);

  const english = await render("/en/feed.xml");
  assert.equal(english.status, 200);
  assert.match(english.headers.get("content-type") ?? "", /^application\/rss\+xml\b/i);
  const englishXml = await english.text();
  assert.match(englishXml, /<title>IDC Atlas Columns<\/title>/);
  assert.match(englishXml, /Where Hyperscaler AI CapEx Actually Goes/);
  assert.match(englishXml, /CXMT Is Public\. Which US Chip Stocks Actually Feel It/);
  assert.match(englishXml, /Model Prices Are Fragmenting\. What Changes for AI Infrastructure/);
  assert.match(englishXml, /Azure at 43%: What Must the Next \$50B Deliver/);
  assert.match(englishXml, /Qwen3\.8 Is Live: Seven Tests for Alibaba Cloud/);
  assert.match(englishXml, /atom:link href="https:\/\/idc-index\.com\/en\/feed\.xml"/);
  assert.match(englishXml, /xml-stylesheet type="text\/xsl" href="https:\/\/idc-index\.com\/rss\.xsl"/);
});

test("gives the earnings calendar and poster route distinct crawl metadata", async () => {
  const calendar = await render("/calendar");
  const calendarHtml = await calendar.text();
  assert.match(calendarHtml, /rel="canonical" href="https:\/\/idc-index\.com\/calendar"/i);
  assert.match(calendarHtml, /property="og:title" content="全球科技财报日历｜IDC Atlas"/i);
  assert.match(calendarHtml, /"@type":"CollectionPage"/);
  assert.match(calendarHtml, /"@type":"ItemList"/);
  assert.match(calendarHtml, /"@type":"BreadcrumbList"/);
  assert.match(calendarHtml, /href="\/#calendar" class="calendar-share-back">← 返回首页<\/a>/i);

  const poster = await render("/calendar/poster");
  const posterHtml = await poster.text();
  assert.match(posterHtml, /<meta name="robots" content="noindex, nofollow"/i);
  assert.doesNotMatch(posterHtml, /calendar-share-back/);
});

test("makes public intelligence explicitly discoverable to OpenAI search", async () => {
  const robots = await render("/robots.txt");
  const body = await robots.text();
  assert.match(body, /User-Agent: OAI-SearchBot/i);
  assert.match(body, /Allow: \//);

  const llms = await render("/en/llms.txt");
  assert.match(await llms.text(), /source-linked post-results conclusions/);
});
