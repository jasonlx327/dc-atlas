import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/", host = "dc-atlas.example") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${host}${pathname}`, { headers: { accept: "text/html", host } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished IDC Atlas homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>IDC Atlas｜全球数据中心产业地图与实时情报站<\/title>/i);
  assert.match(html, /Track the/);
  assert.match(html, /class="pulse-trace"/);
  assert.match(html, /aria-controls="site-menu"/);
  assert.match(html, /github\.com\/jasonlx327/);
  assert.match(html, /扫码访问网站/);
  assert.match(html, /SHARE IDC ATLAS/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-XRKL96W42Q/);
  assert.match(html, /gtag\('config', 'G-XRKL96W42Q'\)/);
  assert.match(html, /IDC 最新脉冲/);
  assert.match(html, /近 45 天中国与美国/);
  assert.match(html, /WEEKLY HIGHLIGHT/);
  assert.match(html, /TODAY&#x27;S 3 SIGNALS/);
  assert.match(html, /今日 AI 日报/);
  assert.match(html, /产业链情况/);
  assert.match(html, /只显示最近 30 天/);
  assert.match(html, /SUPPLY CHAIN · 6 NODES/);
  assert.match(html, /chain-node-icon/);
  assert.doesNotMatch(html, /chain-mobile-focus|idc-index-chain-aurora\.png/);
  assert.match(html, /产品、形态与发布节奏/);
  assert.match(html, /真实形态、关键能力/);
  assert.match(html, /中国 GPU \/ 芯片进展/);
  assert.match(html, /CHINA GPU &amp; AI SILICON/);
  assert.match(html, /id="china-chips"/);
  assert.match(html, /国产超节点路线/);
  assert.match(html, /SUPERNODE RADAR/);
  assert.match(html, /OFFICIAL \+ AI HOT \+ 36KR/);
  assert.match(html, /大模型发布与评测/);
  assert.match(html, /OPENROUTER · WEEKLY USAGE/);
  assert.match(html, /真实调用热度/);
  assert.match(html, /GLOBAL AI DIFFUSION/);
  assert.match(html, /17.8%/);
  assert.match(html, /季度追踪/);
  assert.match(html, /前端开发公开评测/);
  assert.match(html, /Source: Arena/);
  assert.match(html, /大型园区进度/);
  assert.match(html, /全球重大并购/);
  assert.match(html, /液冷部署进度/);
  assert.match(html, /每条信息，都能回到出处/);
  assert.doesNotMatch(html, /不再罗列公司和小工程|默认只把公开披露容量|百 MW，不看小工程/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("groups the menu into four themes without changing section links", async () => {
  const source = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  for (const label of ["今日情报", "基础设施", "算力需求", "资本与市场"]) assert.match(source, new RegExp(label));
  for (const href of ["#pulse", "#daily", "#chain", "#nvidia", "#china-chips", "#models", "#projects", "#mna", "#cooling", "#benchmark"]) assert.match(source, new RegExp(href));
  assert.match(source, /site-menu-groups/);
  assert.doesNotMatch(source, /idc-index-chain-aurora\.png/);
});

test("keeps the large-campus radar current and source-backed", async () => {
  const workerSource = await readFile(new URL("../worker/index.ts", import.meta.url), "utf8");
  const pageSource = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");

  for (const marker of ["5 GW 计算容量目标", "175 MW 关键 IT 负载", "133 MW IT 已交付", "332 MW IT 在运", "中国联通长三角（吴江）智算中心一期 EPC"]) assert.match(workerSource, new RegExp(marker));
  assert.match(workerSource, /\/api\/atlas\?schema=v23/);
  assert.match(pageSource, /\/api\/atlas\?schema=v23/);
  assert.match(workerSource, /口罩哥研报60秒/);
  assert.match(pageSource, /TRACKED SOURCES/);
  assert.match(workerSource, /IDC_DAILY_SNAPSHOTS/);
  assert.match(workerSource, /\/api\/daily-snapshot/);
  assert.match(workerSource, /createScheduledSnapshot/);
  assert.match(pageSource, /晨间快照/);
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

test("includes social sharing metadata for the request host", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /property="og:image" content="https:\/\/dc-atlas\.example\/og\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /lang="zh-CN"/i);
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
});
