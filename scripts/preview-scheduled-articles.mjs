// Renders the scheduled research records into a standalone bilingual preview page.
// Usage: node scripts/preview-scheduled-articles.mjs [out.html]
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { scheduledResearchRecords } from "../app/columns/scheduled-article-data.ts";

const SLUGS = [
  "caterpillar-ai-power",
  "partners-group-avk-power",
  "anthropic-volta-compute",
  "ai-debt-refinancing",
  "memory-2027-allocation",
  "earnings-season-review-2026",
];

const TITLES = {
  "caterpillar-ai-power": {
    zh: "Caterpillar 发电业务增长 29%，AI CAPEX 流向持续电源与储能",
    en: "Caterpillar's Power-Generation Sales Rose 29%, Sending AI CapEx to Firm Power and Storage",
  },
  "partners-group-avk-power": {
    zh: "超 10 亿美元买下“数据中心电源即服务”：Partners Group 收购 AVK 多数股权",
    en: "Partners Group Buys a Majority Stake in AVK: $1B+ for Data-Center Power as a Service",
  },
  "anthropic-volta-compute": {
    zh: "100 亿美元、6 年、133MW：Volta 与未具名 AI 实验室的算力协议",
    en: "$10 Billion, Six Years, 133MW: Volta's Compute Agreement with an Unnamed AI Lab",
  },
  "ai-debt-refinancing": {
    zh: "150 亿美元数据中心贷款转债券：Nexus 园区的风险归属下集",
    en: "From $15B Loans to Bonds: Refinancing the Nexus Campus and Its Risk",
  },
  "memory-2027-allocation": {
    zh: "2027 存储分配：“售罄”是行业消息，HBM 配置才是变量",
    en: "2027 Memory Allocation: Sold Out Is a Report; HBM Configuration Is the Variable",
  },
  "earnings-season-review-2026": {
    zh: "财报季综述：云收入吸收容量，现金转换开始分化",
    en: "Earnings Season: Capacity Absorption and the Cash-Conversion Divergence",
  },
};

const STATUS = {
  "caterpillar-ai-power": "已排期 2026-08-07 · 本轮优化",
  "partners-group-avk-power": "新稿",
  "anthropic-volta-compute": "新稿",
  "ai-debt-refinancing": "新稿",
  "memory-2027-allocation": "新稿",
  "earnings-season-review-2026": "旧稿补齐 · 新发布形态",
};

const records = SLUGS.map((slug) => scheduledResearchRecords.find((r) => r.slug === slug)).filter(Boolean);

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const data = records.map((record) => ({
  slug: record.slug,
  titleZh: TITLES[record.slug].zh,
  titleEn: TITLES[record.slug].en,
  status: STATUS[record.slug],
  sectionZh: record.articleSectionZh,
  sectionEn: record.articleSectionEn,
  topics: record.topics,
  sources: record.sources.map((source) => ({ url: source.url, zh: source.zh, en: source.en, level: source.level })),
  zh: record.zh,
  en: record.en,
}));

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IDC Atlas 稿件预览 · 2026-08-06</title>
<style>
  :root { color-scheme: light; --ink:#14171c; --muted:#5b6470; --line:#e4e7ec; --accent:#b45309; --paper:#ffffff; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Segoe UI", sans-serif; color:var(--ink); background:#f4f5f7; line-height:1.75; }
  .topbar { background:var(--ink); color:#fff; padding:14px 22px; display:flex; justify-content:space-between; align-items:center; gap:12px; position:sticky; top:0; z-index:20; }
  .topbar b { letter-spacing:.08em; }
  .topbar .meta { font-size:12px; opacity:.75; }
  .wrap { max-width:980px; margin:0 auto; padding:22px 20px 70px; }
  .picker { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
  .picker button { border:1px solid var(--line); background:var(--paper); padding:7px 12px; border-radius:999px; font-size:13px; cursor:pointer; color:var(--ink); }
  .picker button.active { background:var(--accent); border-color:var(--accent); color:#fff; }
  .lang { margin-bottom:16px; display:flex; gap:8px; align-items:center; }
  .lang button { border:1px solid var(--line); background:var(--paper); padding:5px 14px; border-radius:999px; font-size:13px; cursor:pointer; }
  .lang button.active { background:var(--ink); color:#fff; border-color:var(--ink); }
  article.view { display:none; }
  article.view.active { display:block; }
  .head { border-bottom:2px solid var(--ink); padding-bottom:14px; margin-bottom:14px; }
  .head .kicker { font-size:12px; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .head .kicker .status { color:var(--accent); font-weight:600; letter-spacing:.02em; }
  .head h1 { font-size:30px; line-height:1.3; margin:10px 0 8px; }
  .head .hero { font-size:17px; color:#2a2f37; margin:0; }
  .thesis { background:#fdf6ec; border-left:4px solid var(--accent); padding:14px 18px; margin:16px 0; font-size:15px; }
  .thesis span { display:block; font-size:11px; letter-spacing:.16em; color:var(--accent); margin-bottom:6px; }
  .opening p { margin:0 0 12px; }
  .sources { background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px 16px; margin:16px 0; font-size:13px; }
  .sources .lbl { font-size:11px; letter-spacing:.16em; color:var(--muted); display:block; margin-bottom:8px; }
  .sources a { display:inline-block; margin:0 8px 6px 0; color:#1f4e79; text-decoration:none; border:1px solid #d5dce4; border-radius:6px; padding:4px 8px; }
  .sources a small { color:var(--muted); margin-left:4px; }
  section.sec { margin-top:26px; }
  .sec-label { font-size:11px; letter-spacing:.18em; color:var(--accent); margin-bottom:4px; }
  .sec h2 { font-size:21px; margin:0 0 10px; }
  .sec p { margin:0 0 12px; }
  table { width:100%; border-collapse:collapse; margin:12px 0; font-size:14px; background:var(--paper); }
  th, td { border:1px solid var(--line); padding:8px 10px; text-align:left; vertical-align:top; }
  thead th { background:#f0f1f4; font-size:12px; letter-spacing:.04em; }
  td strong { color:var(--ink); }
  ol.steps { list-style:none; counter-reset:step; padding:0; margin:14px 0; display:grid; gap:10px; }
  ol.steps li { display:flex; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:10px 14px; }
  ol.steps li > span { font-variant-numeric:tabular-nums; color:var(--accent); font-weight:700; }
  ol.steps strong { display:block; }
  ol.steps p { margin:2px 0 0; font-size:14px; color:#3a414b; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:10px; margin:12px 0; }
  .cards article { background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:12px 14px; }
  .cards span { font-size:10px; letter-spacing:.18em; color:var(--accent); }
  .cards h3 { font-size:15px; margin:4px 0 4px; }
  .cards p { font-size:13px; color:#3a414b; margin:0; }
  .conclusion { border-top:1px solid var(--line); margin-top:28px; padding-top:14px; }
  .conclusion .lbl { font-size:11px; letter-spacing:.18em; color:var(--accent); margin-bottom:6px; }
  .conclusion p { font-size:16px; }
  .disclosure { margin-top:18px; padding:12px 14px; background:#eef0f3; border-radius:8px; font-size:12px; color:var(--muted); }
  .disclaimer { margin-top:8px; font-size:12px; color:var(--muted); }
  @media (max-width:640px) { .head h1 { font-size:24px; } }
</style>
</head>
<body>
<div class="topbar"><b>IDC ATLAS</b><span class="meta">稿件预览 · 2026-08-06 · 双语正文</span></div>
<div class="wrap">
  <div class="picker" id="picker"></div>
  <div class="lang"><button data-lang="zh" class="active">中文</button><button data-lang="en">English</button></div>
  <div id="views"></div>
</div>
<script>
const DATA = ${JSON.stringify(data)};
const picker = document.getElementById("picker");
const views = document.getElementById("views");
const langBtns = [...document.querySelectorAll(".lang button")];
let current = 0;

function esc(value) {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

function render(lang) {
  const record = DATA[current];
  const copy = lang === "zh" ? record.zh : record.en;
  const title = lang === "zh" ? record.titleZh : record.titleEn;
  const section = lang === "zh" ? record.sectionZh : record.sectionEn;
  const sourceLabel = lang === "zh" ? "来源" : "SOURCES";
  const sections = copy.sections.map((section) => \`
    <section class="sec">
      <div class="sec-label">\${esc(section.label)}</div>
      <h2>\${esc(section.heading)}</h2>
      \${section.paragraphs.map((p) => \`<p>\${esc(p)}</p>\`).join("")}
      \${section.metrics?.length ? \`<table><thead><tr><th>\${lang === "zh" ? "指标" : "Metric"}</th><th>\${lang === "zh" ? "本次披露" : "Disclosure"}</th><th>\${lang === "zh" ? "口径与边界" : "Basis and boundary"}</th></tr></thead><tbody>\${section.metrics.map((m) => \`<tr><th>\${esc(m.label)}</th><td><strong>\${esc(m.value)}</strong></td><td>\${esc(m.note)}</td></tr>\`).join("")}</tbody></table>\` : ""}
      \${section.steps?.length ? \`<ol class="steps">\${section.steps.map((s, i) => \`<li><span>\${String(i + 1).padStart(2, "0")}</span><div><strong>\${esc(s.title)}</strong><p>\${esc(s.body)}</p></div></li>\`).join("")}</ol>\` : ""}
      \${section.cards?.length ? \`<div class="cards">\${section.cards.map((c) => \`<article><span>\${esc(c.label)}</span><h3>\${esc(c.title)}</h3><p>\${esc(c.body)}</p></article>\`).join("")}</div>\` : ""}
    </section>\`).join("");
  const html = \`
    <article class="view active">
      <header class="head">
        <div class="kicker"><span>IDC ATLAS · \${esc(section)}</span><span class="status">\${esc(record.status)}</span></div>
        <h1>\${esc(title)}</h1>
        <p class="hero">\${esc(copy.hero)}</p>
      </header>
      <aside class="thesis"><span>\${lang === "zh" ? "核心判断" : "THE TAKEAWAY"}</span><p>\${esc(copy.thesis)}</p></aside>
      <div class="opening">\${copy.opening.map((p) => \`<p>\${esc(p)}</p>\`).join("")}</div>
      <div class="sources"><span class="lbl">\${sourceLabel} · \${lang === "zh" ? "一手 / 媒体报道标注" : "primary / reported"} · \${record.topics.join(" · ")}</span>\${record.sources.map((s) => \`<a href="\${esc(s.url)}" target="_blank" rel="noreferrer">\${esc(lang === "zh" ? s.zh : s.en)}<small>\${s.level === "primary" ? (lang === "zh" ? "一手" : "primary") : (lang === "zh" ? "媒体" : "reported")}</small></a>\`).join("")}</div>
      \${sections}
      <div class="conclusion"><div class="lbl">IDC ATLAS VIEW</div><p>\${esc(copy.conclusion)}</p></div>
      <div class="disclosure">\${esc(copy.disclosure)}</div>
      <p class="disclaimer">\${lang === "zh" ? "本网站内容仅用于信息展示与研究，不构成任何投资建议。" : "For information and research only. This is not investment advice."}</p>
    </article>\`;
  views.innerHTML = html;
}

DATA.forEach((record, index) => {
  const button = document.createElement("button");
  button.textContent = record.titleZh;
  button.className = index === 0 ? "active" : "";
  button.addEventListener("click", () => {
    current = index;
    picker.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === index));
    render(langBtns.find((b) => b.classList.contains("active")).dataset.lang);
  });
  picker.appendChild(button);
});

langBtns.forEach((button) => {
  button.addEventListener("click", () => {
    langBtns.forEach((b) => b.classList.toggle("active", b === button));
    render(button.dataset.lang);
  });
});

render("zh");
</script>
</body>
</html>`;

const out = resolve(process.argv[2] ?? "artifacts/2026-08-06-column-drafts-preview.html");
await writeFile(out, html);
console.log(`Wrote ${out} (${records.length} articles)`);
