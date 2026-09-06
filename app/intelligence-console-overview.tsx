"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import QRCode from "qrcode";
import { trackAtlasEvent } from "./atlas-analytics";
import { ChainIcon, type ChainKey } from "./chain-icon";
import { publishedColumnArticles, type ColumnArticle } from "./columns/articles";
import { deriveConsoleMeta, type ConsoleMeta } from "./console-meta";
import { entityDirectory } from "./entity-directory";
import { buildDailyBrief, researchStateForStory, sortNewest, storyEntities } from "./intelligence-model";
import { RUMOR_BRIEFS } from "./watch-data";

export type ConsoleStory = {
  id: string;
  title: string;
  titleEn?: string;
  summary?: string;
  summaryEn?: string;
  publishedAt?: string | null;
  sourceUrl?: string | null;
  permalink?: string;
  sourceName?: string | null;
  region?: string;
  category?: string | null;
  listedTicker?: string;
  milestone?: string;
  scale?: string;
  score?: number | null;
  verifiedAt?: string;
  imageSrc?: string;
  imageAlt?: string;
  entityIds?: string[];
};

export type ConsoleEvent = {
  id: string;
  startsAt: string;
  company: string;
  ticker: string;
  sector: string;
  sourceUrl: string;
  sourceName: string;
  focus?: string;
  conclusion?: { summary: string; summaryEn?: string; sourceName: string; sourceUrl: string };
};

export type ConsoleDeal = {
  id: string;
  announcedAt: string;
  buyer: string;
  target: string;
  value: string;
  capacity: string;
  status: string;
  rationale: string;
  sourceName: string;
  sourceUrl: string;
};

export type ConsoleBenchmark = {
  code: string;
  name: string;
  level: number;
  dayPct: number;
};

export type ConsoleRumor = {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl?: string;
  region: "中国" | "美国" | "全球";
  statusLabel: string;
  statusLabelEn: string;
  sourceCount: number;
  officialResponse: string;
  officialResponseEn: string;
};

function rumorLink(item: ConsoleRumor, isZh: boolean): string {
  const hasDetail = RUMOR_BRIEFS.some((record) => record.id === item.id);
  if (hasDetail) return `${isZh ? "/rumors" : "/en/rumors"}/${item.id}`;
  return item.sourceUrl ?? (isZh ? "/rumors" : "/en/rumors");
}

function intelligenceEvidenceLabel(item: ConsoleRumor, isZh: boolean): string {
  if (item.sourceCount >= 2) return isZh ? "媒体 · 多源" : "MEDIA · MULTI-SOURCE";
  return isZh ? "媒体 · 单一来源" : "MEDIA · SINGLE SOURCE";
}

export type ConsoleOverviewData = {
  generatedAt?: string;
  reviewedAt?: string;
  contentVersion?: string;
  lastContentChangedAt?: string;
  factChangedAt?: string;
  researchPublishedAt?: string;
  briefPublishedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
  pulse: ConsoleStory[];
  companies: ConsoleStory[];
  events: ConsoleEvent[];
  deals: ConsoleDeal[];
  benchmarks: ConsoleBenchmark[];
  rumors?: ConsoleRumor[];
};

type LocalizedStory = ConsoleStory & { displayTitle?: string; displaySummary?: string };

type Props = {
  lang: "zh" | "en";
  data: ConsoleOverviewData;
  translateStory?: (story: ConsoleStory) => LocalizedStory;
};

type ShellProps = {
  lang: "zh" | "en";
  activeSection?: string;
  generatedAt?: string;
  reviewedAt?: string;
  contentVersion?: string;
  lastContentChangedAt?: string;
  factChangedAt?: string;
  researchPublishedAt?: string;
  briefPublishedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
  contextStatus?: {
    title: string;
    subtitle: string;
    languageHref: string;
    items: Array<{ label: string; value: string }>;
  };
  pageLabel?: string;
  className?: string;
  children: ReactNode;
};

function useLiveConsoleMeta(enabled: boolean): ConsoleMeta {
  const [meta, setMeta] = useState<ConsoleMeta>({});

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void fetch("/api/atlas-live-v5?schema=v1", {
      signal: controller.signal,
      cache: "no-store",
      headers: { "cache-control": "no-cache" },
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Atlas unavailable")))
      .then((payload: unknown) => setMeta(deriveConsoleMeta(payload)))
      .catch(() => undefined);
    return () => controller.abort();
  }, [enabled]);

  return meta;
}

const stages: Array<{
  key: ChainKey;
  zh: string;
  en: string;
  zhDetail: string;
  enDetail: string;
}> = [
  { key: "compute", zh: "芯片与半导体", en: "Chips & semiconductors", zhDetail: "GPU / ASIC / 存储 / 网络芯片", enDetail: "GPU / ASIC / memory / NIC" },
  { key: "rack", zh: "服务器与硬件", en: "Servers & hardware", zhDetail: "服务器 / 存储 / 交换机 / 电源", enDetail: "Servers / storage / switch / PSU" },
  { key: "campus", zh: "数据中心基础设施", en: "Data-center infrastructure", zhDetail: "机柜 / 配电 / UPS / 消防 / 安防", enDetail: "Racks / power / UPS / fire / security" },
  { key: "cooling", zh: "制冷与热管理", en: "Cooling & thermal", zhDetail: "风冷 / 液冷 / CDU / 管路", enDetail: "Air / liquid / CRAC / CDU / piping" },
  { key: "power", zh: "电力与能源", en: "Power & energy", zhDetail: "发电 / 电网 / 储能 / 天然气", enDetail: "Generation / grid / storage / gas" },
  { key: "model", zh: "运营与服务", en: "Operations & services", zhDetail: "运维 / 连接 / 安全 / 托管", enDetail: "O&M / connectivity / security / FM" },
];

const navItems = [
  { key: "overview", zh: "今日", en: "Today", hrefZh: "/#overview", hrefEn: "/en#overview" },
  { key: "pulse", zh: "事实", en: "Facts", hrefZh: "/pulse", hrefEn: "/en/pulse" },
  { key: "companies", zh: "公司", en: "Companies", hrefZh: "/companies", hrefEn: "/en/companies" },
  { key: "industry", zh: "产业链", en: "Industry", hrefZh: "/industry", hrefEn: "/en/industry" },
  { key: "columns", zh: "研究", en: "Research", hrefZh: "/columns", hrefEn: "/en/columns" },
  { key: "rumors", zh: "情报", en: "Intelligence", hrefZh: "/rumors", hrefEn: "/en/rumors" },
] as const;

function dateLabel(value: string | null | undefined, lang: "zh" | "en", includeTime = false, timezone?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    timeZone: timezone ?? (lang === "zh" ? "Asia/Shanghai" : "America/New_York"),
    year: includeTime ? undefined : "numeric",
    month: includeTime ? "2-digit" : "short",
    day: "2-digit",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
    hour12: lang === "en",
  }).format(date);
}

function eventDate(value: string, lang: "zh" | "en") {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      timeZone: "America/New_York",
      month: "numeric",
      day: "numeric",
    }).format(date),
    weekday: new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      timeZone: "America/New_York",
      weekday: "short",
    }).format(date),
    time: new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: lang === "en",
    }).format(date),
  };
}

function storyLink(story: ConsoleStory) {
  return story.sourceUrl ?? story.permalink ?? "#";
}

function disclosedMetric(story: ConsoleStory, lang: "zh" | "en") {
  if (story.scale) return story.scale;
  const text = `${story.title} ${story.summary ?? ""}`;
  const match = text.match(/(?:[$¥￥]\s?)?[\d,.]+\s?(?:GW|MW|亿元|亿美元|billion|million|机柜|racks)/i);
  return match?.[0] ?? (lang === "zh" ? "规模待披露" : "Not disclosed");
}

function storyTitle(story: LocalizedStory) {
  return story.displayTitle ?? story.title;
}

function storySummary(story: LocalizedStory, lang: "zh" | "en") {
  return story.displaySummary ?? story.summary ?? (lang === "zh" ? "打开来源查看完整披露。" : "Open the source for the full disclosure.");
}

type ColumnEvidenceBrief = {
  thesisZh: string;
  thesisEn: string;
  confirmedZh: string;
  confirmedEn: string;
  unknownZh: string;
  unknownEn: string;
  nextZh: string;
  nextEn: string;
  sourceZh: string;
  sourceEn: string;
  cutoff: string;
};

const columnEvidenceByHref: Partial<Record<ColumnArticle["href"], ColumnEvidenceBrief>> = {
  "/columns/ai-financing-platforms": {
    thesisZh: "资本平台扩大的是可融资项目的边界；真正决定容量兑现的，仍是项目合同、抵押结构、送电节点与客户现金流。",
    thesisEn: "The platform can widen the financeable project set; project contracts, collateral, energization and customer cash flow still decide delivery.",
    confirmedZh: "NVIDIA 与六家金融机构签署谅解备忘录，目标是长期动员超过 5,000 亿美元第三方资本。",
    confirmedEn: "NVIDIA and six financial institutions signed MOUs targeting more than $500B of third-party capital over time.",
    unknownZh: "基金规模、已承诺资金、项目清单、对应 MW 与已交割金额均未披露。",
    unknownEn: "Fund size, committed capital, project list, associated MW and closed funding remain undisclosed.",
    nextZh: "等待项目级客户合同、资产所有权、完工支持、首次送电与现金流安排。",
    nextEn: "Watch for project contracts, asset ownership, completion support, first energization and cash-flow terms.",
    sourceZh: "NVIDIA 与 Apollo 官方公告",
    sourceEn: "NVIDIA and Apollo announcements",
    cutoff: "2026-08-16",
  },
};

function columnEvidence(article: ColumnArticle, lang: "zh" | "en") {
  const specific = columnEvidenceByHref[article.href];
  if (specific) return {
    thesis: lang === "zh" ? specific.thesisZh : specific.thesisEn,
    confirmed: lang === "zh" ? specific.confirmedZh : specific.confirmedEn,
    unknown: lang === "zh" ? specific.unknownZh : specific.unknownEn,
    next: lang === "zh" ? specific.nextZh : specific.nextEn,
    source: lang === "zh" ? specific.sourceZh : specific.sourceEn,
    cutoff: specific.cutoff,
  };
  return {
    thesis: lang === "zh" ? article.summary : article.summaryEn,
    confirmed: lang === "zh" ? "文章以公开、可追溯材料建立已披露事实。" : "The article establishes disclosed facts from public, traceable records.",
    unknown: lang === "zh" ? "公开材料未披露的条款、容量与交付节点保持未知。" : "Undisclosed terms, capacity and delivery milestones remain unknown.",
    next: lang === "zh" ? "以后续一手公告、监管文件和项目记录更新判断。" : "The next judgment will follow primary announcements, filings and project records.",
    source: lang === "zh" ? "文章来源台账" : "Article source ledger",
    cutoff: article.date,
  };
}

function ShellNav({
  lang,
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
  activeSection,
  setActiveSection,
}: {
  lang: "zh" | "en";
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const isZh = lang === "zh";
  const scrollKeys = new Set(["overview"]);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareQr, setShareQr] = useState("");
  const [shareUrl, setShareUrl] = useState("https://idc-index.com");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rssOpen, setRssOpen] = useState(false);
  const [rssCopied, setRssCopied] = useState(false);
  const rssUrl = `https://idc-index.com${isZh ? "/feed.xml" : "/en/feed.xml"}`;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const searchResults = entityDirectory.filter((entity) => {
    if (!normalizedQuery) return true;
    return [entity.name, entity.nameEn, entity.ticker, ...entity.aliases].filter((value): value is string => Boolean(value)).some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  }).slice(0, 8);

  function toggleShare() {
    if (shareOpen) {
      setShareOpen(false);
      return;
    }
    const path = window.location.pathname;
    const url = `https://idc-index.com${path === "/" ? "" : path}`;
    setShareUrl(url);
    setShareQr("");
    setShareOpen(true);
    void QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
      color: { dark: "#19362f", light: "#faf8f2" },
    }).then(setShareQr);
  }

  function toggleRss() {
    setRssOpen((open) => !open);
    setRssCopied(false);
  }

  function toggleSearch() {
    setSearchOpen((open) => !open);
    setSearchQuery("");
    setRssOpen(false);
    setShareOpen(false);
  }

  async function copyRssUrl() {
    try {
      await navigator.clipboard.writeText(rssUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = rssUrl;
      input.setAttribute("readonly", "true");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setRssCopied(true);
  }

  return <>
    <aside className={`atlas-console-rail ${mobileOpen ? "open" : ""}`}>
      <a className="atlas-console-brand" href={isZh ? "/" : "/en"} aria-label="IDC Atlas">
        <strong>IDC</strong><b>ATLAS</b>
        <small>INTELLIGENCE CONSOLE · LIVE</small>
        <span>{isZh ? "全球数据中心基础设施情报" : "Global data-center infrastructure intelligence"}</span>
      </a>
      <nav aria-label={isZh ? "IDC Atlas 主导航" : "IDC Atlas primary navigation"}>
        {navItems.map((item) => <a className={item.key === activeSection ? "active" : ""} href={isZh ? item.hrefZh : item.hrefEn} key={item.key} onClick={(event) => {
          setMobileOpen(false);
          if (!scrollKeys.has(item.key)) return;
          const target = document.getElementById(item.key);
          if (!target) return;
          event.preventDefault();
          setActiveSection(item.key);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", `#${item.key}`);
        }}>
          <span>{String(navItems.indexOf(item) + 1).padStart(2, "0")}</span>
          <strong>{isZh ? item.zh : item.en}</strong>
        </a>)}
      </nav>
      <div className="atlas-console-rail-foot">
        <div className="atlas-console-tools">
          <button type="button" aria-expanded={searchOpen} onClick={toggleSearch}>
            <span>⌕</span><strong>{isZh ? "搜索公司 / 项目" : "Find company / project"}</strong>
          </button>
          <button type="button" aria-expanded={rssOpen} onClick={toggleRss}>
            <span>RSS</span><strong>{isZh ? "订阅研究更新" : "Subscribe to research"}</strong>
          </button>
          <button type="button" aria-expanded={shareOpen} onClick={toggleShare}>
            <span>QR</span><strong>{isZh ? "二维码分享" : "Share with QR"}</strong>
          </button>
        </div>
        {searchOpen && <section className="atlas-console-search" role="dialog" aria-label={isZh ? "搜索公司和项目" : "Search companies and projects"}>
          <button type="button" onClick={() => setSearchOpen(false)}>{isZh ? "关闭" : "Close"}</button>
          <strong>{isZh ? "搜索公司 / 项目" : "Search companies / projects"}</strong>
          <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={isZh ? "名称、代码或别名" : "Name, ticker or alias"} aria-label={isZh ? "搜索名称、代码或别名" : "Search name, ticker or alias"} />
          <div className="atlas-console-search-results">
            {searchResults.map((entity) => <a href={isZh ? `/companies/${entity.slug}` : `/en/companies/${entity.slug}`} key={entity.slug} onClick={() => { setSearchOpen(false); setMobileOpen(false); }}>
              <span>{entity.kind === "company" ? (isZh ? "公司" : "COMPANY") : (isZh ? "项目" : "PROJECT")}</span>
              <strong>{isZh ? entity.name : entity.nameEn}</strong>
              <small>{entity.ticker ?? entity.categoryEn}</small>
            </a>)}
            {!searchResults.length && <p>{isZh ? "没有匹配实体" : "No matching entity"}</p>}
          </div>
        </section>}
        {rssOpen && <section className="atlas-console-rss" role="dialog" aria-label={isZh ? "RSS 订阅" : "RSS subscription"}>
          <button type="button" onClick={() => setRssOpen(false)}>{isZh ? "关闭" : "Close"}</button>
          <strong>{isZh ? "轻量 RSS 订阅" : "Lightweight RSS subscription"}</strong>
          <p>{isZh ? "复制地址后粘贴到 Feedly、NetNewsWire 或其他阅读器。浏览器打开 XML 是正常的。" : "Copy this address into Feedly, NetNewsWire or another reader. Raw XML in a browser is expected."}</p>
          <code>{rssUrl}</code>
          <button type="button" className="atlas-console-rss-copy" onClick={copyRssUrl}>{rssCopied ? (isZh ? "RSS 地址已复制" : "RSS address copied") : (isZh ? "复制订阅地址" : "Copy RSS address")}</button>
          <a href={`https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`} target="_blank" rel="noreferrer">{isZh ? "在 Feedly 中添加 ↗" : "Add to Feedly ↗"}</a>
          <a href={rssUrl} target="_blank" rel="noreferrer">{isZh ? "直接打开 RSS XML ↗" : "Open RSS XML ↗"}</a>
          <a href={isZh ? "/companies" : "/en/companies"}>{isZh ? "关注公司与下一验证点 →" : "Follow companies and checkpoints →"}</a>
        </section>}
        {shareOpen && <section className="atlas-console-share" role="dialog" aria-label={isZh ? "二维码分享当前页面" : "Share this page with a QR code"}>
          <button type="button" onClick={() => setShareOpen(false)}>{isZh ? "关闭" : "Close"}</button>
          {shareQr ? <img src={shareQr} alt={isZh ? "当前页面分享二维码" : "QR code for this page"} /> : <span className="atlas-console-share-loading">{isZh ? "正在生成二维码…" : "Generating QR code…"}</span>}
          <strong>{isZh ? "扫描分享当前页面" : "Scan to share this page"}</strong>
          <small>{shareUrl.replace("https://", "")}</small>
          <a href={shareUrl} target="_blank" rel="noreferrer">{isZh ? "打开正式链接" : "Open canonical link"}</a>
        </section>}
        <a href={isZh ? "/methodology" : "/en/methodology"}>{isZh ? "方法论" : "Methodology"}</a>
        <a href={isZh ? "/privacy" : "/en/privacy"}>{isZh ? "隐私" : "Privacy"}</a>
        <button type="button" onClick={() => {
          if (window.matchMedia("(max-width: 820px)").matches) {
            setMobileOpen(false);
            return;
          }
          setCollapsed(true);
        }}>{isZh ? "收起导航" : "Close navigation"}</button>
      </div>
    </aside>
    {mobileOpen && <button className="atlas-console-scrim" type="button" aria-label={isZh ? "关闭导航" : "Close navigation"} onClick={() => setMobileOpen(false)} />}
    {collapsed && <button className="atlas-console-reopen" type="button" onClick={() => setCollapsed(false)}>
      <span>IDC ATLAS</span>
      <strong>{isZh ? "展开导航" : "Open navigation"}</strong>
    </button>}
    <header className="atlas-console-mobile-head">
      <a href={isZh ? "/" : "/en"}><strong>IDC</strong> <b>ATLAS</b></a>
      <span>{isZh ? "产业情报控制台" : "INTELLIGENCE CONSOLE"}</span>
      <button type="button" aria-expanded={mobileOpen} onClick={() => {
        setCollapsed(false);
        setMobileOpen(!mobileOpen);
      }}>{isZh ? "目录" : "Menu"}</button>
    </header>
  </>;
}

function ConsoleStatusbar({
  lang,
  generatedAt,
  reviewedAt,
  contentVersion,
  lastContentChangedAt,
  factChangedAt,
  researchPublishedAt,
  briefPublishedAt,
  sourceCount,
  verifiedCount,
  pageLabel,
  contextStatus,
}: {
  lang: "zh" | "en";
  generatedAt?: string;
  reviewedAt?: string;
  contentVersion?: string;
  lastContentChangedAt?: string;
  factChangedAt?: string;
  researchPublishedAt?: string;
  briefPublishedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
  pageLabel?: string;
  contextStatus?: ShellProps["contextStatus"];
}) {
  const isZh = lang === "zh";
  const timezone = isZh ? "Asia/Shanghai" : "America/New_York";
  if (contextStatus) return <header className="atlas-statusbar atlas-context-statusbar">
    <div><strong>{contextStatus.title}</strong><span>{contextStatus.subtitle}</span></div>
    <dl>{contextStatus.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    <a className="atlas-language" href={contextStatus.languageHref}>{isZh ? "EN" : "中文"}</a>
  </header>;
  const hasEdition = Boolean(lastContentChangedAt ?? researchPublishedAt ?? briefPublishedAt ?? factChangedAt ?? reviewedAt ?? generatedAt);
  return <header className="atlas-statusbar" data-state={hasEdition ? "ready" : "syncing"}>
    <div><strong>{hasEdition ? dateLabel(lastContentChangedAt ?? reviewedAt ?? generatedAt, lang, false, timezone) : (isZh ? "正在同步" : "Syncing")}</strong><span>{pageLabel ?? (isZh ? "最新内容版本" : "Latest content edition")}</span></div>
    <dl>
      <div><dt>{isZh ? "事实变更" : "Fact change"}</dt><dd>{dateLabel(factChangedAt, lang, false, timezone)}</dd></div>
      <div><dt>{isZh ? "研究发布" : "Research published"}</dt><dd>{dateLabel(researchPublishedAt, lang, false, timezone)}</dd></div>
      <div><dt>{isZh ? "日报版本" : "Brief edition"}</dt><dd>{dateLabel(briefPublishedAt, lang, false, timezone)}</dd></div>
      <div><dt>{isZh ? "系统扫描" : "System scan"}</dt><dd><i />{dateLabel(generatedAt, lang, true, timezone)}</dd></div>
      <div><dt>{isZh ? "核验覆盖" : "Verification"}</dt><dd data-content-version={contentVersion}>{verifiedCount == null ? "—" : verifiedCount}<small>{sourceCount == null ? "" : ` · ${sourceCount} ${isZh ? "源" : "sources"}`}</small></dd></div>
    </dl>
    <a className="atlas-language" href={isZh ? "/en?lang=en" : "/?lang=zh"}>{isZh ? "EN" : "中文"}</a>
  </header>;
}

export function IntelligenceConsoleShell({
  lang,
  activeSection = "",
  generatedAt,
  reviewedAt,
  contentVersion,
  lastContentChangedAt,
  factChangedAt,
  researchPublishedAt,
  briefPublishedAt,
  sourceCount,
  verifiedCount,
  contextStatus,
  pageLabel,
  className = "",
  children,
}: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);
  const isZh = lang === "zh";
  const liveMeta = useLiveConsoleMeta(!contextStatus && (!generatedAt || !reviewedAt || !factChangedAt || !researchPublishedAt || !briefPublishedAt || sourceCount == null || verifiedCount == null));
  const resolvedGeneratedAt = generatedAt ?? liveMeta.generatedAt;
  const resolvedReviewedAt = reviewedAt ?? liveMeta.reviewedAt;
  const resolvedContentVersion = contentVersion ?? liveMeta.contentVersion;
  const resolvedLastContentChangedAt = lastContentChangedAt ?? liveMeta.lastContentChangedAt;
  const resolvedFactChangedAt = factChangedAt ?? liveMeta.factChangedAt;
  const resolvedResearchPublishedAt = researchPublishedAt ?? liveMeta.researchPublishedAt;
  const resolvedBriefPublishedAt = briefPublishedAt ?? liveMeta.briefPublishedAt;
  const resolvedSourceCount = sourceCount ?? liveMeta.sourceCount;
  const resolvedVerifiedCount = verifiedCount ?? liveMeta.verifiedCount;
  return <main className={["atlas-console-overview", "atlas-console-page", navCollapsed ? "rail-collapsed" : "", className].filter(Boolean).join(" ")} lang={isZh ? "zh-CN" : "en"}>
    <ShellNav
      lang={lang}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      collapsed={navCollapsed}
      setCollapsed={setNavCollapsed}
      activeSection={currentSection}
      setActiveSection={setCurrentSection}
    />
    <div className="atlas-console-canvas">
      <ConsoleStatusbar
        lang={lang}
        generatedAt={resolvedGeneratedAt}
        reviewedAt={resolvedReviewedAt}
        contentVersion={resolvedContentVersion}
        lastContentChangedAt={resolvedLastContentChangedAt}
        factChangedAt={resolvedFactChangedAt}
        researchPublishedAt={resolvedResearchPublishedAt}
        briefPublishedAt={resolvedBriefPublishedAt}
        sourceCount={resolvedSourceCount}
        verifiedCount={resolvedVerifiedCount}
        pageLabel={pageLabel}
        contextStatus={contextStatus}
      />
      {children}
      <footer className="atlas-console-footer">
        <p>{isZh ? "信息仅供专业投资者参考，不构成投资建议。" : "Data for professional research only. Nothing here constitutes investment advice."}</p>
        <nav><a href={isZh ? "/topics/data-center-intelligence" : "/en/topics/data-center-intelligence"}>{isZh ? "数据中心指南" : "Data center guide"}</a><a href={isZh ? "/topics/data-center-glossary" : "/en/topics/data-center-glossary"}>{isZh ? "术语表" : "Glossary"}</a><a href={isZh ? "/methodology" : "/en/methodology"}>{isZh ? "方法论" : "Methodology"}</a><a href={isZh ? "/privacy" : "/en/privacy"}>{isZh ? "隐私" : "Privacy"}</a></nav>
      </footer>
    </div>
  </main>;
}

export function IntelligenceConsoleOverview({ lang, data, translateStory }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [calendarPaused, setCalendarPaused] = useState(false);
  const [calendarPointerHeld, setCalendarPointerHeld] = useState(false);
  const [pulsePaused, setPulsePaused] = useState(false);
  const [pulsePointerHeld, setPulsePointerHeld] = useState(false);
  const isZh = lang === "zh";
  const pulse = data.pulse.slice(0, 8).map((story) => translateStory?.(story) ?? story);
  const companies = data.companies.slice(0, 4).map((story) => translateStory?.(story) ?? story);
  const lead = [...pulse, ...companies].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())[0];
  const events = data.events.slice(0, 6);
  const deals = data.deals.slice(0, 5);
  const rumors = sortNewest(data.rumors ?? []).slice(0, 6);
  const articles = publishedColumnArticles().slice(0, 5);
  const dailyBrief = buildDailyBrief(articles);
  const featuredResearch = dailyBrief?.article;
  const featuredEvidence = featuredResearch ? columnEvidence(featuredResearch, lang) : null;
  const keyChanges = Array.from(new Map([...pulse, ...companies].map((story) => [story.sourceUrl ?? story.id, story])).values())
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, 3);
  const companyResearch = companies.slice(0, 3).map((story) => {
    const entity = storyEntities(story)[0];
    const article = entity ? articles.find((candidate) => entity.columnSlugs.some((slug) => candidate.href.endsWith(`/${slug}`))) : undefined;
    return {
      story,
      entity,
      article,
      state: researchStateForStory(story, articles),
      name: entity ? (isZh ? entity.name : entity.nameEn) : story.sourceName ?? (isZh ? "重点公司" : "Priority company"),
      ticker: entity?.ticker ?? story.listedTicker ?? "IDC",
    };
  });
  const uniqueSources = new Set([...data.pulse, ...data.companies, ...data.deals].map((item) => item.sourceName).filter(Boolean));
  const verifiedCount = data.pulse.length + data.companies.length + data.deals.length;
  const dataConnected = Boolean(data.generatedAt || data.reviewedAt || verifiedCount);
  const leadImage = lead?.imageSrc ?? "/lead-amazon-aws-capex.png";
  const contextualImages = ["/column-hyperscale-idc-leases-voxel-palette-v1.jpg", "/column-sk-hynix-hbm-earnings-voxel-palette-v1.jpg", "/products/nvidia-dgx-b200.jpg", "/column-ai-capex-power-voxel-palette-v1.jpg", "/column-microsoft-ai-capex-voxel-palette-v1.jpg"];

  function categoryLabel(value?: string | null): string {
    if (!value) return isZh ? "项目" : "Project";
    const labels: Record<string, [string, string]> = {
      "idc-construction": ["数据中心项目", "Data-center project"],
      "idc-project": ["数中心项目", "Data-center project"],
      "idc-company": ["上市公司", "Listed company"],
      "idc-company-risk": ["公司风险", "Company risk"],
      "idc-financing": ["融资与资本", "Financing & capital"],
      "idc-power": ["电力与能源", "Power & energy"],
      "idc-cooling": ["液冷与温控", "Cooling"],
      "idc-network": ["网络与互联", "Networking"],
      "idc-rack": ["机柜与互联", "Racks & interconnect"],
      "idc-supply-chain": ["产业链", "Supply chain"],
      "china-ai-chip": ["中国 AI 芯片", "China AI silicon"],
      "model-demand-watch": ["模型需求", "Model demand"],
    };
    const label = labels[value];
    return label ? label[isZh ? 0 : 1] : value;
  }

  useEffect(() => {
    const sectionMap: Record<string, string> = {
      overview: "overview",
      pulse: "pulse",
      calendar: "pulse",
      columns: "columns",
      companies: "companies",
      industry: "industry",
      market: "pulse",
    };
    const sectionIds = Object.keys(sectionMap);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(sectionMap[visible.target.id]);
    }, { rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.2, 0.5] });
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  function renderCalendarEvents(clone = false) {
    return events.map((event) => {
      const timing = eventDate(event.startsAt, lang);
      return <a
        href={event.conclusion?.sourceUrl ?? event.sourceUrl}
        target="_blank"
        rel="noreferrer"
        key={`${clone ? "clone-" : ""}${event.id}`}
        tabIndex={clone ? -1 : undefined}
      >
        <time><b>{timing.day}</b><span>{timing.weekday}</span><small>{isZh ? `美东 ${timing.time}` : `${timing.time} ET`}</small></time>
        <div className="atlas-calendar-company"><strong>{event.company} <small>{event.ticker}</small></strong><em>{event.sector}</em></div>
        <div className="atlas-calendar-focus"><span>{event.focus ?? event.sector}</span>{event.conclusion && <small>{isZh ? "财报结论已更新" : "Post-results read-through"}</small>}</div>
      </a>;
    });
  }

  function renderPulseRows(clone = false) {
    return pulse.map((story, index) => <a
      className="atlas-pulse-row"
      href={storyLink(story)}
      target="_blank"
      rel="noreferrer"
      key={`${clone ? "clone-" : ""}${story.id}`}
      tabIndex={clone ? -1 : undefined}
    >
      <span>{index + 1}</span>
      <time>{dateLabel(story.publishedAt, lang)}</time>
      <b>{index < 2 ? (isZh ? "新增" : "NEW") : (isZh ? "更新" : "UPD")}</b>
      <strong>{storyTitle(story)}</strong>
      <span>{categoryLabel(story.category)}</span>
      <span>{story.region ?? (isZh ? "全球" : "Global")}</span>
      <em>{disclosedMetric(story, lang)}</em>
      <span>{story.sourceName ?? "—"}</span>
    </a>);
  }

  return <main className={navCollapsed ? "atlas-console-overview rail-collapsed" : "atlas-console-overview"} lang={isZh ? "zh-CN" : "en"}>
    <ShellNav lang={lang} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={navCollapsed} setCollapsed={setNavCollapsed} activeSection={activeSection} setActiveSection={setActiveSection} />
    <div className="atlas-console-canvas">
      <div id="overview"><ConsoleStatusbar lang={lang} generatedAt={data.generatedAt} reviewedAt={data.reviewedAt} contentVersion={data.contentVersion} lastContentChangedAt={data.lastContentChangedAt} factChangedAt={data.factChangedAt} researchPublishedAt={data.researchPublishedAt} briefPublishedAt={data.briefPublishedAt} sourceCount={data.sourceCount ?? (dataConnected ? uniqueSources.size : undefined)} verifiedCount={data.verifiedCount ?? (dataConnected ? verifiedCount : undefined)} /></div>

      <section className="atlas-rumor-desk" id="rumors" aria-labelledby="atlas-rumor-desk-title">
        <header>
          <div><span>GLOBAL INTELLIGENCE · LIVE DESK</span><strong id="atlas-rumor-desk-title">{isZh ? "全球情报流" : "Global intelligence feed"}</strong></div>
          <p>{isZh ? "重要媒体情报默认公开展示；一手披露用于升级状态，而不是决定是否可见。" : "Material media intelligence is visible by default; primary disclosure upgrades its status rather than deciding visibility."}</p>
          <a href={isZh ? "/rumors" : "/en/rumors"}>{isZh ? `查看全部 ${data.rumors?.length ?? rumors.length} 条` : `View all ${data.rumors?.length ?? rumors.length}`} →</a>
        </header>
        {rumors.length ? <div className="atlas-rumor-desk-grid">{rumors.map((item, index) => <a href={rumorLink(item, isZh)} key={item.id} target={RUMOR_BRIEFS.some((record) => record.id === item.id) ? undefined : "_blank"} rel={RUMOR_BRIEFS.some((record) => record.id === item.id) ? undefined : "noreferrer"}>
          <div><span>{String(index + 1).padStart(2, "0")}</span><time>{dateLabel(item.publishedAt, lang)}</time></div>
          <strong>{isZh ? item.title : item.titleEn}</strong>
          <p>{isZh ? item.summary : item.summaryEn}</p>
          <footer><span>{intelligenceEvidenceLabel(item, isZh)}</span><span>{item.sourceCount} {isZh ? "个独立来源组" : "source groups"}</span><b>{item.sourceName}</b></footer>
        </a>)}</div> : <div className="atlas-rumor-desk-empty">{isZh ? "当前没有达到公开归因与双语门槛的新情报。" : "No new intelligence currently clears attribution and bilingual-copy gates."}</div>}
      </section>

      {featuredResearch && featuredEvidence ? <section className="atlas-research-lead" aria-labelledby="atlas-lead-title">
        <div className="atlas-research-lead-copy">
          <span>{isZh ? "今日重点研究" : "TODAY'S LEAD RESEARCH"}</span>
          <h1 id="atlas-lead-title"><a href={isZh ? featuredResearch.href : featuredResearch.hrefEn}>{isZh ? featuredResearch.title : featuredResearch.titleEn}</a></h1>
          <p><strong>{isZh ? "核心判断" : "ATLAS VIEW"}</strong>{featuredEvidence.thesis}</p>
          {dailyBrief && <div className="atlas-brief-selection"><strong>{isZh ? `${dailyBrief.editionDate} 日报版本 · 为何今天读它` : `${dailyBrief.editionDate} EDITION · WHY THIS TODAY`}</strong><span>{isZh ? dailyBrief.selectedBecauseZh : dailyBrief.selectedBecauseEn}</span>{dailyBrief.relatedEntities.length > 0 && <nav>{dailyBrief.relatedEntities.slice(0, 4).map((entity) => <a href={isZh ? `/companies/${entity.slug}` : `/en/companies/${entity.slug}`} key={entity.slug}>{isZh ? entity.name : entity.nameEn}</a>)}</nav>}</div>}
          <div className="atlas-research-lead-actions">
            <a href={isZh ? featuredResearch.href : featuredResearch.hrefEn} onClick={() => trackAtlasEvent("daily_brief_open", { article_path: featuredResearch.href, language: lang })}>{isZh ? "阅读完整分析" : "Read the full analysis"} →</a>
            <time dateTime={featuredResearch.publishAt}>{isZh ? "发布于 " : "Published "}{dateLabel(featuredResearch.publishAt, lang)}</time>
          </div>
        </div>
        <figure className="atlas-research-lead-image">
          <img src={featuredResearch.image} alt={isZh ? featuredResearch.title : featuredResearch.titleEn} />
          <figcaption>{featuredResearch.series}</figcaption>
        </figure>
        <div className="atlas-evidence-summary">
          <header><strong>{isZh ? "证据摘要" : "EVIDENCE SUMMARY"}</strong><span>{isZh ? "把事实、未知与下一步分开" : "Facts, unknowns and the next test"}</span></header>
          <dl>
            <div><dt>01 · {isZh ? "已确认" : "CONFIRMED"}</dt><dd>{featuredEvidence.confirmed}</dd></div>
            <div><dt>02 · {isZh ? "尚未确认" : "NOT DISCLOSED"}</dt><dd>{featuredEvidence.unknown}</dd></div>
            <div><dt>03 · {isZh ? "下一验证点" : "NEXT CHECKPOINT"}</dt><dd>{featuredEvidence.next}</dd></div>
          </dl>
          <div className="atlas-evidence-source"><span>{isZh ? "主要来源" : "PRIMARY SOURCES"} · {featuredEvidence.source}</span><time>{isZh ? "资料截止" : "Cutoff"} · {featuredEvidence.cutoff}</time></div>
        </div>
      </section> : <section className="atlas-lead" aria-labelledby="atlas-lead-title">
        <div className="atlas-lead-copy">
          <span>{isZh ? "今日首要信号" : "LEAD SIGNAL"}</span>
          <h1 id="atlas-lead-title"><a href={lead ? storyLink(lead) : "#"} target="_blank" rel="noreferrer">{lead ? storyTitle(lead) : isZh ? "正在连接最新基础设施信号" : "Connecting to the latest infrastructure signal"}</a></h1>
          <p>{lead ? storySummary(lead, lang) : isZh ? "数据连接后将显示最新已核验项目。" : "The latest verified project will appear when data connects."}</p>
        </div>
        <figure className="atlas-lead-image"><img src={leadImage} alt={lead?.imageAlt ?? (isZh ? "数据中心基础设施项目" : "Data-center infrastructure project")} /></figure>
      </section>}

      <section className="atlas-editorial-desk" aria-label={isZh ? "今日关键变化与公司研究" : "Key changes and company research"}>
        <div className="atlas-key-changes">
          <header><strong>{isZh ? "今日关键变化" : "KEY CHANGES"}</strong><a href={isZh ? "/pulse" : "/en/pulse"}>{isZh ? "查看全部" : "View all"} →</a></header>
          <div>{keyChanges.map((story, index) => <a href={storyLink(story)} target="_blank" rel="noreferrer" key={story.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{storyTitle(story)}</strong><small>{story.sourceName ?? (isZh ? "公开来源" : "Public source")} · {dateLabel(story.publishedAt, lang)}</small></div>
            <b>{index === 0 ? (isZh ? "最新" : "LATEST") : (isZh ? "已核验" : "VERIFIED")}</b>
          </a>)}</div>
        </div>
        <div className="atlas-company-research">
          <header><strong>{isZh ? "公司热点 → 深度研究" : "COMPANY CHANGE → RESEARCH"}</strong><a href={isZh ? "/columns" : "/en/columns"}>{isZh ? "研究中心" : "Research"} →</a></header>
          <div>{companyResearch.map(({ story, entity, name, ticker, state }) => <a href={entity ? (isZh ? `/companies/${entity.slug}` : `/en/companies/${entity.slug}`) : storyLink(story)} target={entity ? undefined : "_blank"} rel={entity ? undefined : "noreferrer"} key={story.id}>
            <span>{ticker}</span>
            <div><strong>{name}</strong><small>{storyTitle(story)}</small></div>
            <b className={state === "published" ? "published" : "queued"}>{state === "published" ? (isZh ? "分析已发布" : "ANALYSIS LIVE") : state === "needs-follow-up" ? (isZh ? "待跟进" : "FOLLOW-UP") : (isZh ? "研究排期" : "SCHEDULED")}</b>
          </a>)}</div>
          <p>{isZh ? "专栏优先级由公司重要性、事实变化幅度与一手材料完整度共同决定。" : "Research priority follows company importance, the size of the change and primary-source completeness."}</p>
        </div>
      </section>

      <section className="atlas-live-pulse" id="pulse" data-paused={pulsePaused || pulsePointerHeld ? "true" : undefined}>
        <header>
          <strong>{isZh ? "市场脉搏" : "Live infrastructure pulse"} <small>{isZh ? "按信号强度排序" : "ranked for fast reading"}</small></strong>
          <span className="atlas-pulse-wave" aria-hidden="true">
            <svg viewBox="0 0 600 36" preserveAspectRatio="none">
              <polyline points="0,18 100,18 130,18 145,3 160,34 175,18 240,18 252,10 264,26 276,18 340,18 354,2 369,35 384,18 450,18 462,12 474,24 486,18 600,18" />
              <polyline className="active" points="0,18 100,18 130,18 145,3 160,34 175,18 240,18 252,10 264,26 276,18 340,18 354,2 369,35 384,18 450,18 462,12 474,24 486,18 600,18" />
            </svg>
          </span>
          <span className="atlas-pulse-actions">
            <button type="button" aria-pressed={pulsePaused} onClick={() => setPulsePaused((paused) => !paused)}>
              {pulsePaused ? (isZh ? "继续" : "Resume") : (isZh ? "暂停" : "Pause")}
            </button>
            <a href={isZh ? "/pulse" : "/en/pulse"}>{isZh ? "查看全部信号" : "View all signals"} →</a>
          </span>
        </header>
        <div className="atlas-pulse-table">
          <div className="atlas-pulse-table-head"><span>#</span><span>{isZh ? "日期" : "Date"}</span><span>{isZh ? "信号" : "Signal"}</span><span>{isZh ? "公司 / 项目" : "Company / project"}</span><span>{isZh ? "类别" : "Category"}</span><span>{isZh ? "地区" : "Region"}</span><span>{isZh ? "披露指标" : "Disclosed metric"}</span><span>{isZh ? "来源" : "Primary source"}</span></div>
          <div
            className="atlas-pulse-viewport"
            onPointerDown={() => setPulsePointerHeld(true)}
            onPointerUp={() => setPulsePointerHeld(false)}
            onPointerCancel={() => setPulsePointerHeld(false)}
            onPointerLeave={() => setPulsePointerHeld(false)}
          >
            <div className="atlas-pulse-track">
              <div className="atlas-pulse-group">{renderPulseRows()}</div>
              <div className="atlas-pulse-group" aria-hidden="true">{renderPulseRows(true)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="atlas-decision-grid">
        <div className="atlas-calendar" id="calendar" data-paused={calendarPaused || calendarPointerHeld ? "true" : undefined}>
          <header>
            <strong>{isZh ? "资本支出与财报日历" : "CapEx & earnings watch"}</strong>
            <span className="atlas-calendar-actions">
              <button type="button" aria-pressed={calendarPaused} onClick={() => setCalendarPaused((paused) => !paused)}>
                {calendarPaused ? (isZh ? "继续" : "Resume") : (isZh ? "暂停" : "Pause")}
              </button>
              <a href={isZh ? "/calendar" : "/en#calendar"}>{isZh ? "查看全部" : "View all"} →</a>
            </span>
          </header>
          <div
            className="atlas-calendar-viewport"
            style={{ "--atlas-calendar-visible-rows": Math.min(events.length, 5) } as CSSProperties}
            onPointerDown={() => setCalendarPointerHeld(true)}
            onPointerUp={() => setCalendarPointerHeld(false)}
            onPointerCancel={() => setCalendarPointerHeld(false)}
            onPointerLeave={() => setCalendarPointerHeld(false)}
          >
            <div className="atlas-calendar-track">
              <div className="atlas-calendar-group">{renderCalendarEvents()}</div>
              <div className="atlas-calendar-group" aria-hidden="true">{renderCalendarEvents(true)}</div>
            </div>
          </div>
        </div>
        <div className="atlas-research-queue" id="columns">
          <header><strong>{isZh ? "研究队列" : "Research queue"} (5)</strong><a href={isZh ? "/columns" : "/en/columns"}>{isZh ? "查看全部" : "View all"} →</a></header>
          <div className="atlas-research-content">
            {articles[0] && <a className="atlas-research-feature" href={isZh ? articles[0].href : articles[0].hrefEn}>
              <img src={articles[0].image} alt={isZh ? articles[0].title : articles[0].titleEn} />
              <span>01 · {articles[0].series}</span>
              <strong>{isZh ? articles[0].title : articles[0].titleEn}</strong>
              <p>{isZh ? articles[0].summary : articles[0].summaryEn}</p>
              <time>{articles[0].date}</time>
            </a>}
            <div className="atlas-research-list">{articles.slice(1).map((article, index) => <a href={isZh ? article.href : article.hrefEn} key={article.href}>
              <span>{String(index + 2).padStart(2, "0")}</span>
              <div><small>{article.series}</small><strong>{isZh ? article.title : article.titleEn}</strong></div>
              <time>{article.date}</time>
            </a>)}</div>
          </div>
        </div>
      </section>

      <section className="atlas-company-watch" id="companies">
        <header><strong>{isZh ? "上市公司动态" : "Listed-company watch"}</strong><a href={isZh ? "/companies" : "/en/companies"}>{isZh ? "打开公司库" : "Open company library"} →</a></header>
        <div>{companies.map((story, index) => {
          const entity = storyEntities(story)[0];
          const href = entity ? `${isZh ? "/companies" : "/en/companies"}/${entity.slug}` : storyLink(story);
          return <a href={href} target={entity ? undefined : "_blank"} rel={entity ? undefined : "noreferrer"} key={story.id}>
            <span>{story.listedTicker ?? String(index + 1).padStart(2, "0")}</span>
            <strong>{storyTitle(story)}</strong>
            <p>{storySummary(story, lang)}</p>
            <time>{dateLabel(story.publishedAt, lang)}</time>
          </a>;
        })}</div>
      </section>

      <section className="atlas-industry-chain" id="industry">
        <header><strong>{isZh ? "产业链地图" : "Industry chain navigator"}</strong><a href={isZh ? "/industry" : "/en/industry"}>{isZh ? "探索完整产业链" : "Explore industry map"} →</a></header>
        <div>{stages.map((stage, index) => <a href={`${isZh ? "/industry" : "/en/industry"}?tab=chain&stage=${stage.key}`} key={stage.key}>
          <span className="atlas-chain-icon"><ChainIcon type={stage.key} /></span>
          <b>{String(index + 1).padStart(2, "0")}</b>
          <strong>{isZh ? stage.zh : stage.en}</strong>
          <small>{isZh ? stage.zhDetail : stage.enDetail}</small>
        </a>)}</div>
      </section>

      <section className="atlas-market-strip" id="market">
        <header><strong>{isZh ? "并购与市场动态" : "M&A and market movers"}</strong>{data.benchmarks.length > 0 && <span>{data.benchmarks.map((item) => `${item.code} ${item.dayPct >= 0 ? "+" : ""}${item.dayPct.toFixed(2)}%`).join(" · ")}</span>}</header>
        <div>{deals.map((deal, index) => <a href={deal.sourceUrl} target="_blank" rel="noreferrer" key={deal.id}>
          <div><time>{deal.announcedAt}</time><strong>{deal.buyer} → {deal.target}</strong><span>{deal.value} · {deal.capacity}</span><small>{deal.sourceName}</small></div>
          <img src={contextualImages[index]} alt="" />
        </a>)}</div>
      </section>

      <footer className="atlas-console-footer">
        <p>{isZh ? "信息仅供专业投资者参考，不构成投资建议。" : "Data for professional research only. Nothing here constitutes investment advice."}</p>
        <nav><a href={isZh ? "/topics/data-center-intelligence" : "/en/topics/data-center-intelligence"}>{isZh ? "数据中心指南" : "Data center guide"}</a><a href={isZh ? "/topics/data-center-glossary" : "/en/topics/data-center-glossary"}>{isZh ? "术语表" : "Glossary"}</a><a href={isZh ? "/methodology" : "/en/methodology"}>{isZh ? "方法论" : "Methodology"}</a><a href={isZh ? "/privacy" : "/en/privacy"}>{isZh ? "隐私" : "Privacy"}</a></nav>
      </footer>
    </div>
  </main>;
}
