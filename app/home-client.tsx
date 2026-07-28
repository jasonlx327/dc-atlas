"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ChainIcon, type ChainKey } from "./chain-icon";
import { PulseTrace } from "./pulse-trace";

type SignalKey = "capacity" | "power" | "cooling" | "network" | "policy" | "hardware";
type NavGroupKey = "today" | "infrastructure" | "demand" | "capital";
type PulseRegion = "all" | "中国" | "美国";
type ListedMarket = "all" | "A 股" | "美股";
type SiteView = "home" | "pulse" | "industry";
type PulseHubTab = "projects" | "listed" | "daily";
type IndustryHubTab = "chain" | "hardware" | "china" | "models" | "campus" | "cooling";
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
type AihotDaily = { date: string; canonical: string; source: string; lead: NewsItem | null; sections: DailySection[]; flashes: NewsItem[] };

type Benchmark = { code: "CWW" | "CWWCN"; name: string; level: number; dayPct: number; ytdPct: number; count: number };
type SourceRecord = { id: string; title: string; subject: string; metric: string; status: string; publishedAt: string; sourceName: string; sourceUrl: string; note: string };
type NvidiaProduct = { id: string; vendor: string; model: string; form: string; spec: string; release: string; price: string; imageSrc?: string; imageAlt?: string; sourceUrl: string };
type OpenRouterUsage = { status: "live" | "unavailable"; period: string; asOf: string; metric: "weekly-rank"; sourceUrl: string; note: string; models: Array<{ id: string; name: string; rank: number; heat: number; url: string }> };
type ArenaCodeLeaderboard = { status: "live" | "unavailable"; asOf: string; category: "webdev"; sourceUrl: string; note: string; models: Array<{ rank: number; name: string; organization: string; score: number; votes: number; chinaLab: boolean }> };
type AiAdoption = { asOf: "2026 Q1"; sharePct: 17.8; cadence: string; sourceName: "Microsoft AI Economy Institute"; sourceUrl: string; dataUrl: string; visualCredit: "Damian Player"; visualCreditUrl: string; note: string; series: Array<{ period: string; sharePct: number }> };
type SupernodeProduct = { id: string; vendor: string; name: string; status: string; imageSrc: string; imageAlt: string; imageCredit: string; imageFit?: "cover" | "contain"; headlineMetric: string; specs: Array<{ label: string; value: string }>; summary: string; sourceName: string; sourceUrl: string; secondarySourceName?: string; secondarySourceUrl?: string };
type MnaDeal = { id: string; announcedAt: string; buyer: string; target: string; value: string; capacity: string; region: string; status: string; statusAsOf: string; valueBasis: string; capacityBasis: string; rationale: string; sourceName: string; sourceUrl: string };
type TrackedSource = { id: string; name: string; scope: string; mode: string; sourceUrl: string };
type DailySnapshotMeta = { date: string; generatedAt: string; source: "scheduled" | "bootstrap" };
type CalendarEvent = { id: string; startsAt: string; company: string; ticker: string; sector: string; description: string; focus: string; sourceName: string; sourceUrl: string; conclusion?: { summary: string; sourceName: string; sourceUrl: string } };

export type AtlasPayload = {
  generatedAt: string;
  windowLabel: string;
  newsStatus: "ok" | "unavailable";
  benchmarkStatus: "ok" | "unavailable";
  news: NewsItem[];
  positiveNews: NewsItem[];
  positiveNewsStatus: "live" | "official-fallback";
  latestPositiveAt: string | null;
  idcPulse: NewsItem[];
  listedCompanyNews: NewsItem[];
  upcomingEvents: CalendarEvent[];
  pulseWindowDays: number;
  weeklyHighlightCount: number;
  nvidiaNews: NewsItem[];
  chinaChipNews: NewsItem[];
  chinaChipWindowDays: number;
  chinaChipStatus: "live" | "official-only";
  coolingNews: NewsItem[];
  modelNews: NewsItem[];
  openRouterUsage: OpenRouterUsage;
  arenaCodeLeaderboard: ArenaCodeLeaderboard;
  aiAdoption: AiAdoption;
  dailySnapshot: DailySnapshotMeta | null;
  supernodes: SupernodeProduct[];
  trackedSources: TrackedSource[];
  chainWindowDays: number;
  chainNews: Record<ChainKey, NewsItem[]>;
  aiDaily: AihotDaily | null;
  benchmarks: Benchmark[];
  benchmarkDate: string | null;
  benchmarkMethodology: string | null;
  capacityRadar: SourceRecord[];
  coolingProgress: SourceRecord[];
  nvidiaProducts: NvidiaProduct[];
  mnaDeals: MnaDeal[];
};

const signalMeta: Record<SignalKey, { label: string; color: string }> = {
  capacity: { label: "园区与容量", color: "cyan" },
  power: { label: "电力与能源", color: "lime" },
  cooling: { label: "液冷与温控", color: "violet" },
  network: { label: "网络与互联", color: "blue" },
  policy: { label: "政策与审批", color: "amber" },
  hardware: { label: "服务器与存储", color: "coral" },
};

const chainStages: Array<{ key: ChainKey; no: string; title: string; caption: string; className: string }> = [
  { key: "compute", no: "01", title: "GPU 与服务器", caption: "算力底座", className: "compute" },
  { key: "rack", no: "02", title: "机柜与互联", caption: "密度与网络", className: "rack" },
  { key: "cooling", no: "03", title: "液冷与 CDU", caption: "散热瓶颈", className: "cooling" },
  { key: "power", no: "04", title: "供配电与绿电", caption: "并网与能耗", className: "power" },
  { key: "campus", no: "05", title: "IDC 园区", caption: "MW 与交付", className: "campus" },
  { key: "model", no: "06", title: "模型与云厂商", caption: "需求终点", className: "model" },
];

type NavItem = { href: string; no: string; label: string; detail: string };
type NavGroup = { key: NavGroupKey; no: string; label: string; detail: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { key: "today", no: "01", label: "今日情报", detail: "实时新闻与每日更新", items: [
    { href: "#pulse", no: "01", label: "最新脉冲", detail: "园区建设与投运" },
    { href: "#daily", no: "02", label: "AI 日报", detail: "AI HOT 每日更新" },
  ] },
  { key: "infrastructure", no: "02", label: "基础设施", detail: "硬件、园区与制冷", items: [
    { href: "#chain", no: "03", label: "产业链情况", detail: "六个环节联动" },
    { href: "#nvidia", no: "04", label: "NVIDIA / AMD", detail: "硬件与发布节奏" },
    { href: "#china-chips", no: "05", label: "中国 GPU", detail: "芯片、超节点与生态" },
    { href: "#projects", no: "07", label: "大型园区", detail: "容量、招标与进度" },
    { href: "#cooling", no: "09", label: "液冷进展", detail: "产品化与工程落地" },
  ] },
  { key: "demand", no: "03", label: "算力需求", detail: "模型发布、评测与调用", items: [
    { href: "#models", no: "06", label: "大模型发布", detail: "评测与调用热度" },
  ] },
  { key: "capital", no: "04", label: "资本与市场", detail: "并购与每日市场温度", items: [
    { href: "#mna", no: "08", label: "全球并购", detail: "重大交易情报" },
    { href: "#benchmark", no: "10", label: "市场温度", detail: "CWW 每日表现" },
  ] },
];

function ExternalIcon() {
  return <svg className="ui-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 13 14 6M9 6h5v5" /><path d="M13 11v4H5V7h4" /></svg>;
}

function ArrowIcon({ direction = "right" }: { direction?: "right" | "down-right" }) {
  return <svg className={`ui-icon arrow-${direction}`} viewBox="0 0 20 20" aria-hidden="true"><path d={direction === "right" ? "M4 10h11M11 6l4 4-4 4" : "M5 5l10 10M9 15h6V9"} /></svg>;
}

function MenuIcon({ close = false }: { close?: boolean }) {
  return <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">{close ? <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></> : <><path d="M5 7h14" /><path d="M9 12h10" /><path d="M5 17h14" /></>}</svg>;
}

function GithubIcon() {
  return <svg className="github-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.8 0-1.1.4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.8-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.5 1 2.6 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" /></svg>;
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "时间未披露";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

function formatCalendarEvent(value: string): { date: string; time: string } {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("zh-CN", { timeZone: "America/New_York", month: "2-digit", day: "2-digit" }).format(date),
    time: new Intl.DateTimeFormat("zh-CN", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }).format(date),
  };
}

function Brand() {
  return <a className="brand" href="#top" aria-label="IDC Atlas 首页"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /><i /></span><span className="brand-copy"><strong>IDC</strong><b>ATLAS</b></span></a>;
}

function SiteQrCode() {
  const [image, setImage] = useState("");

  useEffect(() => {
    void QRCode.toDataURL("https://idc-index.com", {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: { dark: "#071019", light: "#eef8f8" },
    }).then(setImage);
  }, []);

  return <div className="site-qr">
    <div className="site-qr-image">{image ? <img src={image} alt="扫描访问 IDC Atlas" /> : <span aria-hidden="true" />}</div>
    <div><span>SHARE IDC ATLAS</span><strong>扫码访问网站</strong><small>idc-index.com</small></div>
  </div>;
}

function SourceRow({ item }: { item: NewsItem }) {
  if (item.curator === "官方来源") return <div className="source-row"><a href={item.permalink} target="_blank" rel="noreferrer"><span>OFFICIAL SOURCE</span> {item.sourceName ?? "公开来源"}<ExternalIcon /></a></div>;
  if (item.curator === "公开来源") return <div className="source-row"><a href={item.permalink} target="_blank" rel="noreferrer"><span>NEWS SOURCE</span> {item.sourceName ?? "公开报道"}<ExternalIcon /></a></div>;
  return <div className="source-row"><a href={item.permalink} target="_blank" rel="noreferrer"><span>CURATED FROM</span> AI HOT<ExternalIcon /></a>{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer"><span>ORIGINAL SOURCE</span> {item.sourceName ?? "原始报道"}<ExternalIcon /></a>}</div>;
}

function TrustMeta({ item }: { item: NewsItem }) {
  return <div className="trust-meta"><span>{item.curator === "官方来源" ? "PRIMARY SOURCE" : item.curator === "公开来源" ? "VERIFIED NEWS" : "AI HOT CURATED"}</span><time>{item.verifiedAt ? `核验至 ${item.verifiedAt}` : "实时来源"}</time></div>;
}

function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  const signal = signalMeta[item.signal];
  return <article className={`news-card ${compact ? "compact" : ""} ${item.weeklyHighlight ? "weekly-highlight" : ""}`}>
    {item.weeklyHighlight && <span className="weekly-flag">WEEKLY HIGHLIGHT</span>}
    <div className="news-meta"><div><span className={`signal-chip ${signal.color}`}>{signal.label}</span>{item.region && <span className="region-chip">{item.region}</span>}{item.listedTicker && <span className="ticker-chip">{item.listedTicker}</span>}</div><time>{formatRelativeTime(item.publishedAt)}</time></div>
    <h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3>
    <p>{item.summary || "AI HOT 暂未提供摘要，请打开来源查看完整内容。"}</p>
    {item.whyItMatters && <div className="impact-note"><small>WHY IT MATTERS</small><p>{item.whyItMatters}</p></div>}
    {(item.milestone || item.scale) && <div className="pulse-facts">{item.milestone && <span><small>阶段</small><strong>{item.milestone}</strong></span>}{item.scale && <span><small>规模</small><strong>{item.scale}</strong></span>}</div>}
    {item.lifecycle && (compact || item.weeklyHighlight) && <div className="lifecycle" aria-label="项目生命周期">{item.lifecycle.map((stage) => <span className={stage.state} key={stage.label}><i />{stage.label}</span>)}</div>}
    {(item.region || item.verifiedAt) && <TrustMeta item={item} />}
    <SourceRow item={item} />
  </article>;
}

function ChinaChipCard({ item, index }: { item: NewsItem; index: number }) {
  return <article className="china-chip-card">
    <div className="china-chip-head"><span>CN SILICON · {String(index + 1).padStart(2, "0")}</span><time>{formatRelativeTime(item.publishedAt)}</time></div>
    {item.imageSrc ? <div className="china-chip-media"><img src={item.imageSrc} alt={item.imageAlt ?? item.title} loading="lazy" /><span>{item.imageCredit ?? item.sourceName}</span></div> : <div className="silicon-die" aria-hidden="true">{Array.from({ length: 9 }, (_, cell) => <i key={cell} />)}</div>}
    <p>{item.listedTicker ?? item.sourceName ?? "中国算力芯片"}</p>
    <h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3>
    <div className="china-chip-summary">{item.summary}</div>
    {(item.milestone || item.scale) && <div className="china-chip-facts">{item.milestone && <span><small>进展</small><strong>{item.milestone}</strong></span>}{item.scale && <span><small>信号</small><strong>{item.scale}</strong></span>}</div>}
    {item.whyItMatters && <div className="china-chip-impact"><span>IDC IMPACT</span><p>{item.whyItMatters}</p></div>}
    <SourceRow item={item} />
  </article>;
}

function SupernodeCard({ product, index }: { product: SupernodeProduct; index: number }) {
  return <article className={`supernode-card ${product.imageFit === "contain" ? "contain-image" : ""}`}>
    <div className="supernode-media"><img src={product.imageSrc} alt={product.imageAlt} loading="lazy" /><span>{product.imageCredit}</span></div>
    <div className="supernode-copy"><div className="supernode-head"><span>SUPERNODE · {String(index + 1).padStart(2, "0")}</span><small>{product.status}</small></div><p>{product.vendor}</p><h3>{product.name}</h3><strong>{product.headlineMetric}</strong><div className="supernode-specs">{product.specs.map((spec) => <span key={spec.label}><small>{spec.label}</small><b>{spec.value}</b></span>)}</div><p className="supernode-summary">{product.summary}</p><div className="supernode-sources"><a href={product.sourceUrl} target="_blank" rel="noreferrer">Source: {product.sourceName}<ExternalIcon /></a>{product.secondarySourceUrl && <a href={product.secondarySourceUrl} target="_blank" rel="noreferrer">Verify: {product.secondarySourceName ?? "官方披露"}<ExternalIcon /></a>}</div></div>
  </article>;
}

function RecordSource({ record }: { record: SourceRecord }) {
  return <a className="record-source" href={record.sourceUrl} target="_blank" rel="noreferrer"><span>SOURCE</span>{record.sourceName}<ExternalIcon /></a>;
}

function benchmarkLine(item: NewsItem): string | null {
  const sentence = item.summary.split(/(?<=[。！？])/).find((part) => /评测|基准|榜|排名|得分|arena|mmlu|swe|rteb|ndcg/i.test(part));
  return sentence?.trim() || null;
}

export default function Home({ initialPayload = null, view = "home" }: { initialPayload?: Partial<AtlasPayload> | null; view?: SiteView }) {
  const [payload, setPayload] = useState<Partial<AtlasPayload> | null>(initialPayload);
  const [loadError, setLoadError] = useState(false);
  const [activeStage, setActiveStage] = useState<ChainKey>("compute");
  const [pulseRegion, setPulseRegion] = useState<PulseRegion>("all");
  const [listedMarket, setListedMarket] = useState<ListedMarket>("all");
  const [mobilePulseExpanded, setMobilePulseExpanded] = useState(false);
  const [mobileListedExpanded, setMobileListedExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuGroup, setActiveMenuGroup] = useState<NavGroupKey>("today");
  const [pulseHubTab, setPulseHubTab] = useState<PulseHubTab>("projects");
  const [industryHubTab, setIndustryHubTab] = useState<IndustryHubTab>("chain");

  useEffect(() => {
    if (view !== "industry") return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const stage = params.get("stage");
    const frame = window.requestAnimationFrame(() => {
      if (tab && ["chain", "hardware", "china", "models", "campus", "cooling"].includes(tab)) setIndustryHubTab(tab as IndustryHubTab);
      if (stage && chainStages.some((item) => item.key === stage)) setActiveStage(stage as ChainKey);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        let lastError: unknown = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            const response = await fetch("/api/atlas-live-v5?schema=v1", { signal: controller.signal, cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            setPayload(await response.json() as AtlasPayload);
            setLoadError(false);
            return;
          } catch (error) {
            lastError = error;
            if (error instanceof DOMException && error.name === "AbortError") throw error;
            if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 900 * (attempt + 1)));
          }
        }
        throw lastError ?? new Error("Data source unavailable");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setLoadError(true);
      }
    })();
    return () => controller.abort();
  }, []);

  const news = payload?.idcPulse ?? payload?.positiveNews ?? [];
  const listedCompanyNews = payload?.listedCompanyNews ?? [];
  const aShareCompanyNews = listedCompanyNews.filter((item) => /\.(SH|SZ)\b/.test(item.listedTicker ?? ""));
  const usShareCompanyNews = listedCompanyNews.filter((item) => !/\.(SH|SZ)\b/.test(item.listedTicker ?? ""));
  const listedMarketCounts = { all: listedCompanyNews.length, "A 股": aShareCompanyNews.length, "美股": usShareCompanyNews.length };
  const visibleListedCompanyNews = listedMarket === "all" ? listedCompanyNews : listedMarket === "A 股" ? aShareCompanyNews : usShareCompanyNews;
  const pulseRegionCounts = {
    all: news.length,
    中国: news.filter((item) => item.region === "中国").length,
    美国: news.filter((item) => item.region === "美国").length,
  };
  const visiblePulseNews = pulseRegion === "all" ? news : news.filter((item) => item.region === pulseRegion);
  const upcomingEvents = payload?.upcomingEvents ?? [];
  const heroCalendarEvents = upcomingEvents.slice(0, 3);
  const currentStage = chainStages.find((stage) => stage.key === activeStage) ?? chainStages[0];
  const activeNews = useMemo(() => payload?.chainNews?.[activeStage] ?? [], [activeStage, payload]);
  const capacityRecords = payload?.capacityRadar ?? [];
  const includedCapacity = capacityRecords.filter((record) => record.metric !== "容量待披露");
  const coolingRecords = payload?.coolingProgress ?? [];
  const products = payload?.nvidiaProducts ?? [];
  const nvidiaNews = payload?.nvidiaNews ?? [];
  const chinaChipNews = payload?.chinaChipNews ?? [];
  const modelNews = payload?.modelNews ?? [];
  const openRouterUsage = payload?.openRouterUsage ?? null;
  const arenaCodeLeaderboard = payload?.arenaCodeLeaderboard ?? null;
  const aiAdoption = payload?.aiAdoption ?? null;
  const supernodes = payload?.supernodes ?? [];
  const aiShare = aiAdoption?.sharePct ?? 17.8;
  const aiFullDots = Math.floor(aiShare);
  const aiPartialShare = Math.round((aiShare - aiFullDots) * 100);
  const arenaScores = arenaCodeLeaderboard?.models.map((model) => model.score) ?? [];
  const arenaFloor = arenaScores.length ? Math.min(...arenaScores) - 20 : 0;
  const arenaCeiling = arenaScores.length ? Math.max(...arenaScores) : 1;
  const daily = payload?.aiDaily ?? null;
  const dailyItems = daily?.sections.flatMap((section) => section.items.map((item) => ({ ...item, dailySection: section.label }))).slice(0, 8) ?? [];
  const deals = payload?.mnaDeals ?? [];
  const currentMenuGroup = navGroups.find((group) => group.key === activeMenuGroup) ?? navGroups[0];
  const homePulseNews = [...news.filter((item) => item.region === "中国").slice(0, 3), ...news.filter((item) => item.region === "美国").slice(0, 3)];
  const homeListedNews = [...aShareCompanyNews.slice(0, 2), ...usShareCompanyNews.slice(0, 2)];
  const compactHeader = <><aside className="zh-console-sidebar">
    <div className="zh-console-brand"><Brand /><span>数据中心研究控制台</span></div>
    <nav aria-label="IDC Atlas Console 导航">
      <p>工作台</p>
      <a className={view === "home" ? "active" : ""} href="/"><span>01</span><strong>总览</strong></a>
      <a className={view === "pulse" ? "active" : ""} href="/pulse"><span>02</span><strong>最新脉冲</strong></a>
      <a href="/#market"><span>03</span><strong>市场温度</strong></a>
      <a href="/#calendar"><span>04</span><strong>财报日历</strong></a>
      <p>研究</p>
      <a className={view === "industry" ? "active" : ""} href="/industry"><span>05</span><strong>产业中心</strong></a>
      <a href="/#columns"><span>06</span><strong>专栏</strong></a>
    </nav>
    <div className="zh-console-foot"><div className="top-status"><span className={`live-dot ${loadError ? "warn" : ""}`} /><span>{loadError ? "部分数据暂不可用" : payload ? "EDGE DATA LIVE" : "CONNECTING"}</span></div><small>{payload ? `UPDATED ${formatDateTime(payload.generatedAt)}` : "SOURCE-LINKED RESEARCH"}</small><a className="language-switch" href="/en?lang=en" lang="en">ENGLISH</a></div>
  </aside><header className="zh-console-mobile-head"><Brand /><span>{view === "home" ? "总览" : view === "pulse" ? "最新脉冲" : "产业中心"}</span><a href="/en?lang=en" lang="en">EN</a></header></>;
  const compactFooter = <><section className="method-section compact-method" id="method"><div><p>SOURCE-FIRST INTELLIGENCE</p><h2>每条信息，都能回到出处。</h2></div><div className="method-copy"><p>公开来源优先，媒体线索与官方披露分层展示；规模、交付、投运和产品参数均保留原始出处。</p><div className="source-legend"><span>RESEARCH ONLY <b>NOT INVESTMENT ADVICE</b></span><a href="/methodology">查看方法与数据来源 →</a></div></div></section><footer className="compact-footer"><Brand /><p>全球数据中心产业地图与实时情报站</p><div><a href="/privacy">隐私说明</a><span>本网站数据仅用于信息展示与研究，不构成任何投资建议。</span></div></footer></>;

  if (view === "home") return <main id="top" className="compact-home zh-console">
    {compactHeader}
    <section className="hero compact-hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" /><div className="hero-glow glow-a" aria-hidden="true" /><div className="hero-glow glow-b" aria-hidden="true" />
      <div className="hero-copy"><p className="eyebrow"><span /> GLOBAL DATA CENTER INTELLIGENCE</p><h1 id="hero-title">Track the <span className="hero-pulse-line">pulse<PulseTrace label="实时基础设施脉冲" /></span> of <em>infrastructure.</em></h1><p className="hero-lead">IDC Atlas 每日汇集全球数据中心项目、上市公司、算力硬件、电力与液冷的公开进展。</p><div className="hero-actions"><a className="primary-action" href="/pulse">进入最新脉冲 <span><ArrowIcon /></span></a><a className="secondary-action" href="/industry">进入产业中心<ArrowIcon /></a></div><div className="hero-footnote"><span>DAILY SOURCE REFRESH</span><span>{payload ? `UPDATED ${formatDateTime(payload.generatedAt)}` : "CONNECTING TO EDGE"}</span></div></div>
      <aside className="hero-signal hero-calendar" id="calendar" aria-label="未来一周 IDC 重要时间日历"><div className="signal-head"><span><i /> EARNINGS WATCH · IDC CALENDAR</span><time>{payload ? `AS OF ${formatDateTime(payload.generatedAt)}` : "连接中"}</time></div>{heroCalendarEvents.length ? <><div className="hero-calendar-list">{heroCalendarEvents.map((event) => { const timing = formatCalendarEvent(event.startsAt); return <article key={event.id}><time><strong>{timing.date}</strong><small>美东 {timing.time}</small></time><div><div className="hero-calendar-meta"><span>{event.sector}</span><b>{event.ticker}</b></div><h2><a href={event.sourceUrl} target="_blank" rel="noreferrer">{event.company} 财报</a></h2><p>{event.description}</p><small>CAPEX WATCH · {event.focus}</small></div></article>; })}</div><a className="hero-calendar-more" href="/calendar">查看完整财报日历 <ArrowIcon /></a></> : <div className="signal-loading"><p>正在整理未来一周的重要节点…</p></div>}</aside>
      <div className="hero-metrics"><div><small>VERIFIED PROJECT PULSE</small><strong>{news.length || "—"}</strong><span>近 45 天中美已核验项目</span></div><div><small>LISTED COMPANIES</small><strong>{listedCompanyNews.length || "—"}</strong><span>A 股与美股核心标的</span></div><div><small>SUPPLY CHAIN</small><strong>6</strong><span>算力到模型需求</span></div><div><small>AI HOT DAILY</small><strong>{dailyItems.length || "—"}</strong><span>{daily?.date ?? "今日内容连接中"}</span></div></div>
    </section>

    <section className="column-feature compact-column-feature" id="columns" aria-labelledby="featured-column-title"><div className="column-feature-head"><span>IDC ATLAS 专栏精选</span><time dateTime="2026-07-28">2026 / 07 / 28</time></div><div className="column-teaser-card"><div><p>LEASE WATCH · 02</p><h2 id="featured-column-title">GW 级长租，正在改写 IDC 订单。</h2><p>头部互联网与云客户正把算力需求提前落到未来数年的电力资源上。合同期限、送电进度与已计费容量成为判断订单质量的关键证据。</p><div className="column-teaser-actions"><a href="/columns/hyperscale-idc-leases" target="_blank" rel="noreferrer">继续阅读 <ArrowIcon /></a><a href="/columns" target="_blank" rel="noreferrer">全部专栏</a></div></div><a className="column-teaser-image" href="/columns/hyperscale-idc-leases" target="_blank" rel="noreferrer"><img src="/column-hyperscale-leases.png" alt="由长期容量合同连接的超大规模数据中心园区" loading="eager" /><span>APLD 400MW · CORZ 590MW · VNET 510MW</span></a></div></section>

    <section className="section home-pulse-preview" id="pulse"><div className="section-title"><div><span className="section-no">01</span><p>EDITOR&apos;S SNAPSHOT</p><h2>今天值得看的脉冲</h2></div><p>已核验的中美项目进展，以及 A 股和美股核心 IDC 标的最新披露。</p></div><div className="news-grid">{homePulseNews.map((item) => <NewsCard key={item.id} item={item} />)}</div><div className="home-subsection-head"><div><span>LISTED COMPANY WATCH</span><h3>核心 IDC 标的</h3></div><a href="/pulse">查看全部项目与上市公司动态 <ArrowIcon /></a></div><div className="news-grid">{homeListedNews.map((item) => <NewsCard key={item.id} item={item} compact />)}</div></section>

    <section className="section home-industry-preview" id="industry"><div className="section-title inverse"><div><span className="section-no">02</span><p>INFRASTRUCTURE MAP</p><h2>从算力到需求</h2></div><p>连接算力硬件、网络、液冷、电力、园区与模型需求的最新公开信号。</p></div><div className="industry-gateway-grid">{chainStages.map((stage) => { const item = payload?.chainNews?.[stage.key]?.[0]; return <a href={`/industry?tab=chain&stage=${stage.key}`} key={stage.key}><span>{stage.no}</span><i><ChainIcon type={stage.key} /></i><div><strong>{stage.title}</strong><small>{stage.caption}</small>{item && <p>{item.title}</p>}</div><ArrowIcon /></a>; })}</div><a className="section-more-link" href="/industry">进入完整产业中心 <ArrowIcon /></a></section>

    <section className="section home-market-summary" id="market"><div className="section-title"><div><span className="section-no">03</span><p>CAPITAL &amp; MARKET</p><h2>并购与市场温度</h2></div><p>用重大交易理解资产控制权，用 CWW 与 CWWCN 观察每日市场温度。</p></div><div className="home-capital-grid"><div className="home-deal-list">{deals.slice(0, 2).map((deal) => <article key={deal.id}><span>{deal.status}</span><h3>{deal.buyer} → {deal.target}</h3><p>{deal.rationale}</p><a href={deal.sourceUrl} target="_blank" rel="noreferrer">{deal.sourceName}<ExternalIcon /></a></article>)}</div><div className="benchmark-cards">{(payload?.benchmarks ?? []).map((item) => <article className="benchmark-card" key={item.code}><div className="benchmark-head"><span>{item.code}</span><small>{item.count} 成分</small></div><p>{item.name}</p><strong>{item.level.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong><div className="benchmark-change"><span className={item.dayPct >= 0 ? "up" : "down"}>{item.dayPct >= 0 ? "+" : ""}{item.dayPct.toFixed(2)}%</span><small>较前收</small></div></article>)}</div></div></section>
    {compactFooter}
    <nav className="mobile-dock compact-mobile-dock" aria-label="移动端快速导航"><a href="/"><span>01</span>首页</a><a href="/pulse"><span>02</span>脉冲</a><a href="/industry"><span>03</span>产业</a><a href="/#market"><span>04</span>市场</a><a href="/#columns"><span>05</span>专栏</a></nav>
  </main>;

  if (view === "pulse") return <main id="top" className="content-hub pulse-hub zh-console">
    {compactHeader}
    <section className="hub-hero"><p>IDC ATLAS · LIVE INTELLIGENCE</p><h1>最新脉冲，<br /><em>集中阅读。</em></h1><p>已核验的项目进展、上市公司披露与每日 AI 资讯。</p><div><span>{news.length} 条项目</span><span>{listedCompanyNews.length} 条公司动态</span><span>{dailyItems.length} 条今日 AI</span></div></section>
    <nav className="hub-tabs" aria-label="最新脉冲内容分类">{([["projects", "项目脉冲", news.length], ["listed", "上市公司", listedCompanyNews.length], ["daily", "AI 日报", dailyItems.length]] as const).map(([key, label, count]) => <button key={key} className={pulseHubTab === key ? "active" : ""} aria-pressed={pulseHubTab === key} onClick={() => setPulseHubTab(key)}><span>{label}</span><b>{count}</b></button>)}</nav>
    {pulseHubTab === "projects" && <section className="section hub-content-section"><div className="hub-filter-row"><div><span>45-DAY VERIFIED PROJECT PULSE</span><h2>中美大型项目进展</h2></div><div className="pulse-region-tabs" aria-label="IDC 脉冲地区筛选">{(["all", "中国", "美国"] as const).map((region) => <button key={region} className={pulseRegion === region ? "active" : ""} aria-pressed={pulseRegion === region} onClick={() => setPulseRegion(region)}><span>{region === "all" ? "全部" : region}</span><b>{pulseRegionCounts[region]}</b></button>)}</div></div><div className="news-grid">{visiblePulseNews.map((item) => <NewsCard key={item.id} item={item} />)}</div></section>}
    {pulseHubTab === "listed" && <section className="section hub-content-section"><div className="hub-filter-row"><div><span>CORE IDC LISTED COMPANIES</span><h2>A 股与美股动态</h2></div><div className="pulse-region-tabs" aria-label="上市公司市场筛选">{(["all", "A 股", "美股"] as const).map((market) => <button key={market} className={listedMarket === market ? "active" : ""} aria-pressed={listedMarket === market} onClick={() => setListedMarket(market)}><span>{market === "all" ? "全部" : market}</span><b>{listedMarketCounts[market]}</b></button>)}</div></div><div className="news-grid">{visibleListedCompanyNews.map((item) => <NewsCard key={item.id} item={item} />)}</div></section>}
    {pulseHubTab === "daily" && <section className="section daily-section hub-content-section"><div className="hub-filter-row inverse"><div><span>AI HOT · DAILY EDITION</span><h2>今日 AI 日报</h2></div>{daily && <a href={daily.canonical} target="_blank" rel="noreferrer">查看完整日报<ExternalIcon /></a>}</div>{daily?.lead && <article className="daily-lead"><span>LEAD STORY</span><h3><a href={daily.lead.permalink} target="_blank" rel="noreferrer">{daily.lead.title}</a></h3><p>{daily.lead.summary}</p><SourceRow item={daily.lead} /></article>}<div className="daily-grid">{dailyItems.map((item) => <article className="daily-card" key={`${item.dailySection}-${item.id}`}><span>{item.dailySection}</span><h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3><p>{item.summary}</p><SourceRow item={item} /></article>)}</div></section>}
    {compactFooter}
    <nav className="mobile-dock compact-mobile-dock" aria-label="移动端快速导航"><a href="/"><span>01</span>首页</a><a href="/pulse"><span>02</span>脉冲</a><a href="/industry"><span>03</span>产业</a><a href="/#market"><span>04</span>市场</a><a href="/#columns"><span>05</span>专栏</a></nav>
  </main>;

  if (view === "industry") return <main id="top" className="content-hub industry-hub zh-console">
    {compactHeader}
    <section className="hub-hero industry-hub-hero"><p>IDC ATLAS · INFRASTRUCTURE CENTER</p><h1>产业链，<br /><em>按主题展开。</em></h1><p>算力硬件、国产 GPU、模型需求、大型园区与液冷工程的最新公开进展。</p><div><span>6 个产业节点</span><span>{products.length} 个硬件产品</span><span>{includedCapacity.length} 个园区进展</span></div></section>
    <nav className="hub-tabs industry-tabs" aria-label="产业中心内容分类">{([["chain", "产业链"], ["hardware", "NVIDIA / AMD"], ["china", "中国 GPU"], ["models", "模型需求"], ["campus", "园区容量"], ["cooling", "液冷"]] as const).map(([key, label]) => <button key={key} className={industryHubTab === key ? "active" : ""} aria-pressed={industryHubTab === key} onClick={() => setIndustryHubTab(key)}><span>{label}</span></button>)}</nav>
    {industryHubTab === "chain" && <section className="section chain-section hub-content-section"><div className="hub-filter-row inverse"><div><span>SUPPLY CHAIN · 6 NODES</span><h2>产业链最新信号</h2></div><p>点击节点切换最近 {payload?.chainWindowDays ?? 30} 天动态。</p></div><div className="chain-stage-row">{chainStages.map((stage) => <button key={stage.key} className={`chain-stage ${stage.className} ${activeStage === stage.key ? "active" : ""}`} onClick={() => setActiveStage(stage.key)} aria-pressed={activeStage === stage.key}><span>{stage.no}</span><i className="chain-stage-icon"><ChainIcon type={stage.key} /></i><strong>{stage.title}</strong><small>{stage.caption}</small></button>)}</div><div className="chain-detail"><div className="chain-detail-head"><span>SELECTED NODE</span><h3>{currentStage.title}</h3><p>{currentStage.caption} · 最近公开动态</p></div><div className="chain-news">{activeNews.map((item) => <NewsCard key={item.id} item={item} compact />)}</div></div></section>}
    {industryHubTab === "hardware" && <section className="section hub-content-section"><div className="hub-filter-row"><div><span>NVIDIA &amp; AMD PRODUCT RADAR</span><h2>产品与发布节奏</h2></div></div><div className="product-stack hub-product-grid">{products.map((product, index) => <article className="product-card" key={product.id}><div className="product-art">{product.imageSrc && <img src={product.imageSrc} alt={product.imageAlt ?? `${product.vendor} 产品图`} loading="lazy" />}</div><div className="product-copy"><p>{product.vendor} · PRODUCT {String(index + 1).padStart(2, "0")}</p><h3>{product.model}</h3><strong>{product.form}</strong><span>{product.spec}</span><dl><div><dt>发布</dt><dd>{product.release}</dd></div><div><dt>价格</dt><dd>{product.price}</dd></div></dl><a href={product.sourceUrl} target="_blank" rel="noreferrer">{product.vendor} 官方资料<ExternalIcon /></a></div></article>)}</div></section>}
    {industryHubTab === "china" && <section className="section china-chip-section hub-content-section"><div className="hub-filter-row inverse"><div><span>CHINA GPU &amp; AI SILICON</span><h2>中国 GPU 与超节点</h2></div></div><div className="supernode-grid">{supernodes.map((product, index) => <SupernodeCard key={product.id} product={product} index={index} />)}</div><div className="china-chip-grid hub-secondary-grid">{chinaChipNews.map((item, index) => <ChinaChipCard key={item.id} item={item} index={index} />)}</div></section>}
    {industryHubTab === "models" && <section className="section model-section hub-content-section"><div className="hub-filter-row inverse"><div><span>MODEL DEMAND &amp; CAPABILITY</span><h2>模型需求与公开评测</h2></div></div><div className="model-grid">{modelNews.map((item, index) => <article className="model-card" key={item.id}><div className="model-card-top"><span>{String(index + 1).padStart(2, "0")}</span><time>{formatRelativeTime(item.publishedAt)}</time></div><h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3><p>{item.summary}</p>{benchmarkLine(item) && <div className="benchmark-line"><span>PUBLIC BENCHMARK</span><strong>{benchmarkLine(item)}</strong></div>}<SourceRow item={item} /></article>)}</div></section>}
    {industryHubTab === "campus" && <section className="section project-section hub-content-section"><div className="hub-filter-row inverse"><div><span>LARGE-SCALE CAMPUS RADAR</span><h2>大型园区进度</h2></div></div><div className="capacity-grid">{includedCapacity.map((record) => <article className="capacity-card" key={record.id}><div><span>{record.status}</span><strong>{record.metric}</strong></div><p>{record.publishedAt}</p><h3>{record.title}</h3><h4>{record.subject}</h4><p className="capacity-note">{record.note}</p><RecordSource record={record} /></article>)}</div></section>}
    {industryHubTab === "cooling" && <section className="section cooling-section hub-content-section"><div className="hub-filter-row"><div><span>LIQUID COOLING ADOPTION</span><h2>液冷部署进度</h2></div></div><div className="cooling-journey">{coolingRecords.map((record, index) => <article className="cooling-step" key={record.id}><span>{String(index + 1).padStart(2, "0")}</span><i /><p>{record.status}</p><h3>{record.metric}</h3><h4>{record.title}</h4><small>{record.subject} · {record.publishedAt}</small><p className="cooling-note">{record.note}</p><RecordSource record={record} /></article>)}</div></section>}
    {compactFooter}
    <nav className="mobile-dock compact-mobile-dock" aria-label="移动端快速导航"><a href="/"><span>01</span>首页</a><a href="/pulse"><span>02</span>脉冲</a><a href="/industry"><span>03</span>产业</a><a href="/#market"><span>04</span>市场</a><a href="/#columns"><span>05</span>专栏</a></nav>
  </main>;

  return <main id="top">
    <header className="topbar">
      <Brand />
      <div className="topbar-actions"><a className="top-column-link" href="/columns" target="_blank" rel="noreferrer">专栏 <ExternalIcon /></a><a className="language-switch" href="/en" lang="en">EN</a><div className="top-status"><span className={`live-dot ${loadError ? "warn" : ""}`} /><span>{loadError ? "部分数据暂不可用" : payload ? "EDGE DATA LIVE" : "CONNECTING"}</span></div><button className="menu-toggle" type="button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? "CLOSE" : "MENU"}</span><MenuIcon close={menuOpen} /></button></div>
    </header>
    {menuOpen && <><button className="menu-backdrop open" type="button" aria-label="关闭导航" onClick={() => setMenuOpen(false)} />
    <nav className="site-menu open" id="site-menu" aria-label="折叠导航">
      <div className="site-menu-head"><span>EXPLORE IDC ATLAS</span><strong>快速前往</strong></div>
      <div className="site-menu-body"><div className="site-menu-groups" aria-label="导航主题">{navGroups.map((group) => <button key={group.key} type="button" aria-pressed={activeMenuGroup === group.key} onClick={() => setActiveMenuGroup(group.key)}><span>{group.no}</span><div><strong>{group.label}</strong><small>{group.detail}</small></div></button>)}</div><div className="site-menu-panel"><div className="site-menu-panel-head"><strong>{currentMenuGroup.label}</strong><small>{currentMenuGroup.items.length} 个模块</small></div><div className="site-menu-grid">{currentMenuGroup.items.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>{item.no}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div><ArrowIcon /></a>)}</div></div></div>
      <a className="site-menu-github" href="https://github.com/jasonlx327" target="_blank" rel="noreferrer"><GithubIcon /><span><strong>GitHub</strong><small>@jasonlx327</small></span><ExternalIcon /></a>
    </nav></>}

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" /><div className="hero-glow glow-a" aria-hidden="true" /><div className="hero-glow glow-b" aria-hidden="true" />
      <div className="hero-copy"><p className="eyebrow"><span /> GLOBAL DATA CENTER INTELLIGENCE</p><h1 id="hero-title">Track the <span className="hero-pulse-line">pulse<PulseTrace /></span> of <em>infrastructure.</em></h1><p className="hero-lead">IDC Atlas 每日汇集全球数据中心的新项目、投运进展、液冷部署、算力硬件与模型需求动态。</p><div className="hero-actions"><a className="primary-action" href="#pulse">查看今日脉冲 <span><ArrowIcon direction="down-right" /></span></a><a className="secondary-action" href="#chain">查看产业链情况<ArrowIcon /></a></div><div className="hero-footnote"><span>DAILY SOURCE REFRESH</span><span>{payload ? `UPDATED ${formatDateTime(payload.generatedAt)}` : "CONNECTING TO EDGE"}</span></div></div>
      <aside className="hero-signal hero-calendar" id="calendar" aria-label="未来一周 IDC 重要时间日历"><div className="signal-orbit" aria-hidden="true"><i className="orbit-one" /><i className="orbit-two" /><i className="orbit-core" /></div><div className="signal-head"><span><i /> EARNINGS WATCH · IDC CALENDAR</span><time>{payload ? `AS OF ${formatDateTime(payload.generatedAt)}` : "连接中"}</time></div>{heroCalendarEvents.length ? <><div className="hero-calendar-list">{heroCalendarEvents.map((event) => { const timing = formatCalendarEvent(event.startsAt); return <article key={event.id}><time><strong>{timing.date}</strong><small>美东 {timing.time}</small></time><div><div className="hero-calendar-meta"><span>{event.sector}</span><b>{event.ticker}</b></div><h2><a href={event.sourceUrl} target="_blank" rel="noreferrer">{event.company} 财报</a></h2><p>{event.description}</p><small>CAPEX WATCH · {event.focus}</small>{event.conclusion && <a className="earnings-conclusion" href={event.conclusion.sourceUrl} target="_blank" rel="noreferrer"><span>财报结论 · 已更新</span><strong>{event.conclusion.summary}</strong><small>Source · {event.conclusion.sourceName}<ExternalIcon /></small></a>}</div><a className="calendar-source" href={event.sourceUrl} target="_blank" rel="noreferrer" aria-label={`查看 ${event.company} 官方日程`}><ExternalIcon /></a></article>; })}</div><a className="hero-calendar-more" href="/calendar">查看完整财报日历 <ArrowIcon /></a></> : <div className="signal-loading"><span /><span /><span /><p>{loadError ? "重要日历暂时无法连接。" : "正在整理未来一周的重要节点…"}</p></div>}</aside>
      <div className="hero-metrics"><div><small>VERIFIED PROJECT PULSE</small><strong>{news.length || "—"}</strong><span>近 45 天中美已核验项目</span></div><div><small>WEEKLY HIGHLIGHT</small><strong>{payload?.weeklyHighlightCount ?? "—"}</strong><span>最近 7 天重点项目</span></div><div><small>LIQUID COOLING</small><strong>{coolingRecords.length || "—"}</strong><span>标准、产品、工程</span></div><div><small>AI HOT DAILY</small><strong>{dailyItems.length || "—"}</strong><span>{daily?.date ?? "今日内容连接中"}</span></div></div><details className="hero-mobile-overview"><summary>展开今日概览 <span>+2 项指标</span></summary><div><span><small>LIQUID COOLING</small><strong>{coolingRecords.length || "—"}</strong><b>标准、产品、工程</b></span><span><small>AI HOT DAILY</small><strong>{dailyItems.length || "—"}</strong><b>{daily?.date ?? "今日内容连接中"}</b></span></div></details>
    </section>

    <section className="column-feature" id="columns" aria-labelledby="featured-column-title"><div className="column-feature-head"><span>IDC ATLAS 专栏精选</span><time dateTime="2026-07-28">2026 / 07 / 28</time></div><div className="column-teaser-card"><div><p>LEASE WATCH · 02</p><h2 id="featured-column-title">GW 级长租，正在改写 IDC 订单。</h2><p>头部互联网与云客户正把算力需求提前落到未来数年的电力资源上。传统云巨头的名称往往没有公开，合同期限、送电进度与已计费容量因此成为判断订单质量的关键证据。</p><div className="column-teaser-actions"><a href="/columns/hyperscale-idc-leases" target="_blank" rel="noreferrer">继续阅读 <ArrowIcon /></a><a href="/columns" target="_blank" rel="noreferrer">查看全部专栏</a></div></div><a className="column-teaser-image" href="/columns/hyperscale-idc-leases" target="_blank" rel="noreferrer" aria-label="阅读 GW 级长租正在改写 IDC 订单"><img src="/column-hyperscale-leases.png" alt="由长期容量合同连接的超大规模数据中心园区" loading="eager" /><span>APLD 400MW · CORZ 590MW · VNET 510MW</span></a></div><a className="column-archive-link" href="/columns/ai-capex-power" target="_blank" rel="noreferrer"><span>PREVIOUS · CAPEX WATCH 01</span><strong>AI 基建竞赛进入电力时代</strong><small>Microsoft、Alphabet、Meta 与 Amazon 的资本开支传导 →</small></a></section>

    <section className="section pulse-section" id="pulse"><div className="section-title"><div><span className="section-no">01</span><p>45-DAY VERIFIED PROJECT PULSE</p><h2>IDC 最新脉冲</h2></div><p>追踪近 45 天中国与美国已核验的大型园区建设、扩建、租赁、交付和投运；上市公司与关键非上市项目均会纳入，最近 7 天的重要进展自动高亮。</p></div>{news.length ? <><div className="pulse-window"><div className="pulse-window-meta"><span><i /> VERIFIED PROJECTS · LAST 45 DAYS</span><strong>{visiblePulseNews.length} 条已核验项目进展</strong></div><div className="pulse-region-tabs" aria-label="IDC 脉冲地区筛选">{(["all", "中国", "美国"] as const).map((region) => <button key={region} type="button" data-region={region} className={pulseRegion === region ? "active" : ""} aria-pressed={pulseRegion === region} onClick={() => { setPulseRegion(region); setMobilePulseExpanded(false); }}><span>{region === "all" ? "全部" : region}</span><b>{pulseRegionCounts[region]}</b></button>)}</div><small>更新至 {payload ? formatDateTime(payload.generatedAt) : "—"}</small></div><div className={`news-grid mobile-preview-grid ${mobilePulseExpanded ? "mobile-expanded" : ""}`}>{visiblePulseNews.map((item) => <NewsCard key={item.id} item={item} />)}</div>{visiblePulseNews.length > 3 && <button className="mobile-expand" type="button" aria-expanded={mobilePulseExpanded} onClick={() => setMobilePulseExpanded((expanded) => !expanded)}>{mobilePulseExpanded ? "收起项目进展" : `查看全部 ${visiblePulseNews.length} 条项目进展`}<ArrowIcon direction="down-right" /></button>}</> : <div className="data-empty"><i /><p>{loadError ? "实时资讯暂时不可用，请稍后刷新。" : "正在读取最新项目动态…"}</p></div>}{listedCompanyNews.length > 0 && <div className="industry-pulse core-company-pulse" id="listed"><div><span>CORE IDC LISTED COMPANIES</span><h3>核心 IDC 标的最新进展</h3><p>按上市市场筛选最近一次可核验披露，不构成投资建议。</p></div><div className="pulse-window company-market-window"><div className="pulse-window-meta"><span><i /> LISTED COMPANY WATCH</span><strong>{visibleListedCompanyNews.length} 条核心标的进展</strong></div><div className="pulse-region-tabs" aria-label="IDC 上市公司市场筛选">{(["all", "A 股", "美股"] as const).map((market) => <button key={market} type="button" data-market={market} className={listedMarket === market ? "active" : ""} aria-pressed={listedMarket === market} onClick={() => { setListedMarket(market); setMobileListedExpanded(false); }}><span>{market === "all" ? "全部" : market}</span><b>{listedMarketCounts[market]}</b></button>)}</div><small>覆盖 15 家核心 IDC 标的</small></div><div className={`news-grid mobile-preview-grid ${mobileListedExpanded ? "mobile-expanded" : ""}`}>{visibleListedCompanyNews.map((item) => <NewsCard key={item.id} item={item} />)}</div>{visibleListedCompanyNews.length > 3 && <button className="mobile-expand" type="button" aria-expanded={mobileListedExpanded} onClick={() => setMobileListedExpanded((expanded) => !expanded)}>{mobileListedExpanded ? "收起核心标的" : `查看全部 ${visibleListedCompanyNews.length} 条核心标的`}<ArrowIcon direction="down-right" /></button>}</div>}</section>

    <section className="section daily-section" id="daily"><div className="section-title inverse"><div><span className="section-no">02</span><p>AI HOT · DAILY EDITION</p><h2>今日 AI 日报</h2></div><p>每天同步 AI HOT 日报，快速浏览模型、产品、行业与研究进展，并保留每条内容的原始出处。</p></div>{daily ? <><div className="daily-head"><div><span>BEIJING DATE</span><strong>{daily.date}</strong><small>{payload?.dailySnapshot ? `晨间快照 · ${formatDateTime(payload.dailySnapshot.generatedAt)}` : "晨间快照准备中"}</small></div><a href={daily.canonical} target="_blank" rel="noreferrer">查看 AI HOT 完整日报<ExternalIcon /></a></div>{daily.lead && <article className="daily-lead"><span>LEAD STORY</span><h3><a href={daily.lead.permalink} target="_blank" rel="noreferrer">{daily.lead.title}</a></h3><p>{daily.lead.summary}</p><SourceRow item={daily.lead} /></article>}<div className="daily-grid">{dailyItems.map((item) => <article className="daily-card" key={`${item.dailySection}-${item.id}`}><span>{item.dailySection}</span><h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3><p>{item.summary}</p><SourceRow item={item} /></article>)}</div>{daily.flashes.length > 0 && <div className="daily-flashes"><span>FLASH</span>{daily.flashes.map((item) => <a key={item.id} href={item.permalink} target="_blank" rel="noreferrer">{item.title}<ExternalIcon /></a>)}</div>}</> : <div className="data-empty dark"><i /><p>正在读取 AI HOT 今日 AI 日报…</p></div>}</section>

    <section className="section chain-section" id="chain"><div className="section-title inverse"><div><span className="section-no">03</span><p>INTERACTIVE SUPPLY CHAIN</p><h2>产业链情况</h2></div><p>从服务器、机柜和液冷，到电力、IDC 园区与大模型需求；点击任一环节，下方只显示最近 30 天的公开信息。</p></div><div className="chain-visual"><div className="chain-flow-head"><span>SUPPLY CHAIN · 6 NODES</span><p>点击节点查看最近 30 天动态</p></div><div className="chain-stage-row" aria-label="IDC 产业链六个环节">{chainStages.map((stage) => <button key={stage.key} className={`chain-stage ${stage.className} ${activeStage === stage.key ? "active" : ""}`} onClick={() => setActiveStage(stage.key)} aria-pressed={activeStage === stage.key}><span>{stage.no}</span><i className="chain-stage-icon"><ChainIcon type={stage.key} /></i><strong>{stage.title}</strong><small>{stage.caption}</small></button>)}</div></div><div className="mobile-chain-list" aria-label="IDC 产业链移动端节点列表">{chainStages.map((stage) => <article className={`mobile-chain-node ${activeStage === stage.key ? "active" : ""}`} key={stage.key}><button type="button" onClick={() => setActiveStage(stage.key)} aria-expanded={activeStage === stage.key}><span>{stage.no}</span><i className="chain-stage-icon"><ChainIcon type={stage.key} /></i><div><strong>{stage.title}</strong><small>{stage.caption}</small></div><b>{activeStage === stage.key ? "收起" : "展开"}</b></button>{activeStage === stage.key && <div className="mobile-chain-detail"><p>近 {payload?.chainWindowDays ?? 30} 天 · {stage.caption} 最新公开动态</p>{activeNews.length ? <div>{activeNews.slice(0, 3).map((item) => <NewsCard key={item.id} item={item} compact />)}</div> : <span>近 30 天暂无新的公开动态。</span>}</div>}</article>)}</div><div className="chain-detail"><div className="chain-detail-head"><span>SELECTED NODE · LAST {payload?.chainWindowDays ?? 30} DAYS</span><h3>{currentStage.title}</h3><p>{currentStage.caption} · 近 30 天最新公开动态</p></div><div className="chain-news">{activeNews.length ? activeNews.map((item) => <NewsCard key={item.id} item={item} compact />) : <div className="chain-empty">近 30 天暂无新的公开动态。</div>}</div></div></section>

    <section className="section nvidia-section" id="nvidia"><div className="section-title"><div><span className="section-no">04</span><p>NVIDIA &amp; AMD PRODUCT RADAR</p><h2>产品、形态与发布节奏</h2></div><p>追踪 NVIDIA 与 AMD 数据中心产品的真实形态、关键能力、发布节点和公开价格信息。</p></div><div className="nvidia-layout"><div className="product-stack">{products.map((product, index) => <article className="product-card" key={product.id}><div className="product-art">{product.imageSrc ? <><img src={product.imageSrc} alt={product.imageAlt ?? `${product.vendor} 产品图`} loading="lazy" /><span>{product.vendor} 官方产品图</span></> : <div className="product-art-fallback"><strong>{product.vendor}</strong><small>HELIOS / MI400</small></div>}</div><div className="product-copy"><p>{product.vendor} · PRODUCT {String(index + 1).padStart(2, "0")}</p><h3>{product.model}</h3><strong>{product.form}</strong><span>{product.spec}</span><dl><div><dt>发布</dt><dd>{product.release}</dd></div><div><dt>价格</dt><dd>{product.price}</dd></div></dl><a href={product.sourceUrl} target="_blank" rel="noreferrer">{product.vendor} 官方资料<ExternalIcon /></a></div></article>)}</div><aside className="nvidia-news"><span>NVIDIA NOW · AI HOT</span><h3>发布会与产品动态</h3>{nvidiaNews.length ? nvidiaNews.slice(0, 3).map((item) => <a className="nvidia-news-item" key={item.id} href={item.permalink} target="_blank" rel="noreferrer"><time>{formatRelativeTime(item.publishedAt)}</time><strong>{item.title}</strong><small>CURATED FROM AI HOT<ExternalIcon /></small></a>) : <p>NVIDIA 最新内容正在更新中。</p>}</aside></div></section>

    <section className="section china-chip-section" id="china-chips"><div className="section-title inverse"><div><span className="section-no">05</span><p>CHINA GPU &amp; AI SILICON</p><h2>中国 GPU / 芯片进展</h2></div><p>聚焦近 {payload?.chinaChipWindowDays ?? 30} 天国产 GPU、DCU、AI 加速芯片与超节点的产品、集群、模型适配和开发者生态进展。</p></div><div className="supernode-radar"><div className="supernode-radar-head"><span>SUPERNODE RADAR</span><div><h3>国产超节点路线</h3><p>从单卡参数转向高密度互联、统一内存、液冷和万卡扩展能力。</p></div></div><div className="supernode-grid">{supernodes.map((product, index) => <SupernodeCard key={product.id} product={product} index={index} />)}</div></div><div className="china-chip-status"><span><i /> OFFICIAL + AI HOT + 36KR</span><strong>{chinaChipNews.length} 条近期进展</strong><small>{payload?.chinaChipStatus === "live" ? "AI HOT 实时线索已接入" : "厂商披露优先 · 媒体线索复核"}</small></div>{chinaChipNews.length ? <div className="china-chip-grid">{chinaChipNews.slice(0, 6).map((item, index) => <ChinaChipCard key={item.id} item={item} index={index} />)}</div> : <div className="data-empty dark"><i /><p>正在读取中国 GPU 与 AI 芯片最新进展…</p></div>}</section>

    <section className="section model-section" id="models"><div className="section-title inverse"><div><span className="section-no">06</span><p>MODEL DEMAND &amp; CAPABILITY</p><h2>大模型发布与评测</h2></div><p>用全球 AI 渗透率观察长期需求空间，用 OpenRouter 看近一周真实调用热度，再用 Arena 匿名对战榜单比较前端开发能力。</p></div><div className="adoption-panel"><div className="adoption-copy"><span>GLOBAL AI DIFFUSION · {aiAdoption?.asOf ?? "2026 Q1"}</span><strong>{aiShare}%</strong><h3>全球生成式 AI 使用率继续上升</h3><p>{aiAdoption?.note ?? "微软全球 AI 使用指标按季度追踪，并随报告发布更新。"}</p><div className="adoption-trend" aria-label="全球生成式 AI 使用率季度趋势">{(aiAdoption?.series ?? [{ period: "2025 H1", sharePct: 15.1 }, { period: "2025 H2", sharePct: 16.3 }, { period: "2026 Q1", sharePct: 17.8 }]).map((point) => <span key={point.period}><small>{point.period}</small><i><b style={{ width: `${(point.sharePct / 20) * 100}%` }} /></i><strong>{point.sharePct}%</strong></span>)}</div><div className="adoption-links"><a href={aiAdoption?.sourceUrl ?? "https://blogs.microsoft.com/on-the-issues/2026/05/07/the-state-of-global-ai-diffusion-in-2026/"} target="_blank" rel="noreferrer">Data: Microsoft<ExternalIcon /></a><a href={aiAdoption?.dataUrl ?? "https://github.com/microsoft/ai-diffusion-report"} target="_blank" rel="noreferrer">Quarterly data<ExternalIcon /></a><a href={aiAdoption?.visualCreditUrl ?? "https://www.damianplayer.com/"} target="_blank" rel="noreferrer">Visual idea: Damian Player<ExternalIcon /></a></div></div><div className="adoption-visual"><span>{aiAdoption?.cadence ?? "季度追踪 · 随报告发布更新"}</span><div className="adoption-dots" role="img" aria-label={`100 个点中约 ${aiShare} 个高亮，表示全球生成式 AI 使用率为 ${aiShare}%`}>{Array.from({ length: 100 }, (_, index) => <i key={index} className={index < aiFullDots ? "active" : index === aiFullDots && aiPartialShare > 0 ? "partial" : ""} style={index === aiFullDots && aiPartialShare > 0 ? { background: `linear-gradient(135deg, #72d690 0 ${aiPartialShare}%, #26313e ${aiPartialShare + 1}%)` } : undefined} />)}</div></div></div><div className="model-signal-grid"><div className="openrouter-panel"><div className="openrouter-head"><div><span>OPENROUTER · WEEKLY USAGE</span><h3>真实调用热度</h3></div><div><strong>{openRouterUsage?.period ?? "近7日"}</strong><small>{openRouterUsage ? `更新 ${formatDateTime(openRouterUsage.asOf)}` : "连接中"}</small></div></div>{openRouterUsage?.models.length ? <div className="openrouter-bars">{openRouterUsage.models.map((model) => <a key={model.id} href={model.url} target="_blank" rel="noreferrer"><span>{String(model.rank).padStart(2, "0")}</span><strong>{model.name}</strong><div><i style={{ width: `${model.heat}%` }} /></div><b>#{model.rank}</b></a>)}</div> : <div className="openrouter-empty">正在读取 OpenRouter 近一周热门模型排序…</div>}<div className="openrouter-foot"><p>{openRouterUsage?.note ?? "按 OpenRouter 公开周排名归一化展示，不代表全市场份额。"}</p><a href={openRouterUsage?.sourceUrl ?? "https://openrouter.ai/rankings/"} target="_blank" rel="noreferrer">Source: OpenRouter<ExternalIcon /></a></div></div><div className="arena-panel"><div className="arena-head"><div><span>ARENA · CODE / WEBDEV</span><h3>前端开发公开评测</h3></div><div><strong>{arenaCodeLeaderboard?.asOf ?? "连接中"}</strong><small>{arenaCodeLeaderboard?.models.length ? "TOP 8 · 动态榜单" : "实时连接中"}</small></div></div>{arenaCodeLeaderboard?.models.length ? <div className="arena-bars">{arenaCodeLeaderboard.models.map((model) => { const width = 34 + ((model.score - arenaFloor) / Math.max(1, arenaCeiling - arenaFloor)) * 66; return <div className={model.chinaLab ? "china-lab" : ""} key={`${model.rank}-${model.name}`}><span>{String(model.rank).padStart(2, "0")}</span><p><strong>{model.name}</strong><small>{model.organization}</small></p><div><i style={{ width: `${width}%` }} /></div><b>{model.score}</b></div>; })}</div> : <div className="openrouter-empty">正在读取 Arena Code 公开榜单…</div>}<div className="arena-foot"><p>{arenaCodeLeaderboard?.note ?? "Arena Code 公开榜单暂时不可用。"}</p><a href={arenaCodeLeaderboard?.sourceUrl ?? "https://arena.ai/leaderboard/code/webdev"} target="_blank" rel="noreferrer">Source: Arena<ExternalIcon /></a></div></div></div><div className="model-grid">{modelNews.slice(0, 6).map((item, index) => <article className="model-card" key={item.id}><div className="model-card-top"><span>{String(index + 1).padStart(2, "0")}</span><time>{formatRelativeTime(item.publishedAt)}</time></div><h3><a href={item.permalink} target="_blank" rel="noreferrer">{item.title}</a></h3><p>{item.summary}</p>{benchmarkLine(item) && <div className="benchmark-line"><span>PUBLIC BENCHMARK</span><strong>{benchmarkLine(item)}</strong></div>}<SourceRow item={item} /></article>)}</div>{!modelNews.length && <div className="data-empty dark"><i /><p>正在同步最新模型发布与公开评测…</p></div>}</section>

    <section className="section project-section" id="projects"><div className="section-title inverse"><div><span className="section-no">07</span><p>LARGE-SCALE CAMPUS RADAR</p><h2>大型园区进度</h2></div><p>追踪大型 IDC 园区和关键能源配套的建设、招标、交付与投运进度。</p></div><div className="capacity-grid">{includedCapacity.map((record) => <article className="capacity-card" key={record.id}><div><span>{record.status}</span><strong>{record.metric}</strong></div><p>{record.publishedAt}</p><h3>{record.title}</h3><h4>{record.subject}</h4><p className="capacity-note">{record.note}</p><RecordSource record={record} /></article>)}</div><div className="disclosure-queue"><span>招标与前期项目</span>{capacityRecords.filter((record) => record.metric === "容量待披露").map((record) => <a key={record.id} href={record.sourceUrl} target="_blank" rel="noreferrer"><strong>{record.title}</strong><small>{record.status} · {record.sourceName}<ExternalIcon /></small></a>)}</div></section>

    <section className="section mna-section" id="mna"><div className="section-title"><div><span className="section-no">08</span><p>GLOBAL IDC M&amp;A INTELLIGENCE</p><h2>全球重大并购</h2></div><p>关注会改变区域容量、平台控制权或能源获取能力的重大交易，展示买方、标的、交易规模与资产体量。</p></div><div className="mna-grid">{deals.map((deal) => <article className="mna-card" key={deal.id}><div className="mna-card-head"><span>{deal.status}</span><time>公告 {deal.announcedAt}</time></div><p>{deal.region}</p><h3>{deal.buyer}<i><ArrowIcon /></i>{deal.target}</h3><div className="mna-metrics"><div><small>DEAL VALUE · {deal.valueBasis}</small><strong>{deal.value}</strong></div><div><small>ASSET SCALE · {deal.capacityBasis}</small><strong>{deal.capacity}</strong></div></div><p className="mna-rationale">{deal.rationale}</p><a href={deal.sourceUrl} target="_blank" rel="noreferrer"><span>SOURCE</span>{deal.sourceName}<ExternalIcon /></a><small className="mna-verified">状态核验至 {deal.statusAsOf}</small></article>)}</div></section>

    <section className="section cooling-section" id="cooling"><div className="section-title"><div><span className="section-no">09</span><p>LIQUID COOLING ADOPTION</p><h2>液冷部署进度</h2></div><p>从标准与材料、产品化到工程落地，持续更新液冷产业从验证走向规模应用的关键节点。</p></div><div className="cooling-journey">{coolingRecords.map((record, index) => <article className="cooling-step" key={record.id}><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /><p>{record.status}</p><h3>{record.metric}</h3><h4>{record.title}</h4><small>{record.subject} · {record.publishedAt}</small><p className="cooling-note">{record.note}</p><RecordSource record={record} /></article>)}</div></section>

    <section className="benchmark-section section" id="benchmark"><div className="section-title"><div><span className="section-no">10</span><p>DAILY MARKET TEMPERATURE</p><h2>每日市场温度</h2></div><p>用 CWW 与 CWWCN 观察算力、存储和相关基础设施公司的当日整体表现。</p></div><div className="benchmark-layout"><div className="benchmark-cards">{(payload?.benchmarks ?? []).map((item) => <article className="benchmark-card" key={item.code}><div className="benchmark-head"><span>{item.code}</span><small>{item.count} 成分</small></div><p>{item.name}</p><strong>{item.level.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong><div className="benchmark-change"><span className={item.dayPct >= 0 ? "up" : "down"}>{item.dayPct >= 0 ? "+" : ""}{item.dayPct.toFixed(2)}%</span><small>较前收</small></div><div className="micro-bars" aria-hidden="true">{[34, 46, 40, 58, 52, 63, 49, 72, 67, 82, 75, 91].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article>)}{!payload?.benchmarks?.length && <div className="benchmark-placeholder">正在读取 CWW 官方收盘数据…</div>}</div><aside className="benchmark-note"><span>MARKET SNAPSHOT</span><h3>今天市场在交易什么？</h3><p>指数变化与产业新闻并列展示，帮助快速理解当日市场温度。</p><div className="data-source"><a href="https://cwwindex.today/" target="_blank" rel="noreferrer"><span>DATA FROM</span> CWW INDEX<ExternalIcon /></a><small>截至 {payload?.benchmarkDate ?? "—"} · Methodology v{payload?.benchmarkMethodology ?? "—"}</small></div></aside></div></section>

    <section className="method-section" id="method"><div><p>SOURCE-FIRST INTELLIGENCE</p><h2>每条信息，都能回到出处。</h2></div><div className="method-copy"><p>AI HOT 与 36Kr 提供每日资讯线索；GPU 厂商、交易所、政府、项目和交易公告负责关键参数核验；Microsoft、OpenRouter、Arena 与 CWW 分别提供 AI 渗透率、模型热度、公开评测和每日市场表现。</p><div className="source-legend"><span>CURATED FROM <b>AI HOT / 36KR</b></span><span>OFFICIAL <b>GPU 厂商 / 交易所 / 项目公告</b></span><span>MODEL SIGNALS <b>MICROSOFT / OPENROUTER / ARENA</b></span><span>DATA FROM <b>CWW INDEX</b></span></div></div></section>
    <footer><Brand /><p>全球数据中心产业地图与实时情报站</p><div className="footer-contact"><SiteQrCode /><a href="https://github.com/jasonlx327" target="_blank" rel="noreferrer"><GithubIcon /><span><strong>GitHub</strong><small>@jasonlx327</small></span><ExternalIcon /></a><div className="seo-topic-links"><a href="/topics/data-center-intelligence">数据中心情报 / Data Center Intelligence</a><a href="/topics/china-ai-silicon">中国 GPU / China AI Silicon</a><a href="/methodology">方法与数据来源 / Methodology</a></div><a className="privacy-link" href="/privacy">隐私说明</a><span>本网站数据仅用于信息展示与研究，不构成任何投资建议。</span><span>RESEARCH ONLY · NOT INVESTMENT ADVICE</span></div></footer><nav className="mobile-dock" aria-label="移动端快速导航"><a href="#top"><span>01</span>首页</a><a href="#pulse"><span>02</span>脉冲</a><a href="#listed"><span>03</span>标的</a><a href="#daily"><span>04</span>日报</a><a href="#method"><span>05</span>更多</a></nav>
  </main>;
}
