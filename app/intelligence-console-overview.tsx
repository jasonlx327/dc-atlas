"use client";

import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { trackAtlasEvent } from "./atlas-analytics";
import IntelligenceDesk from "./intelligence-desk";
import { deriveConsoleMeta, type ConsoleMeta } from "./console-meta";
import { entityDirectory } from "./entity-directory";

export type ConsoleStory = {
  eventKey?: string;
  id: string;
  title: string;
  titleEn?: string;
  summary?: string;
  summaryEn?: string;
  details?: Array<{ heading: string; body: string }>;
  detailsEn?: Array<{ heading: string; body: string }>;
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
  eventKey?: string;
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
  return <main className={["atlas-console-overview", "atlas-console-page", "atlas-design-d", navCollapsed ? "rail-collapsed" : "", className].filter(Boolean).join(" ")} lang={isZh ? "zh-CN" : "en"}>
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
  return <IntelligenceConsoleShell lang={lang} activeSection="overview" {...data} pageLabel={lang === "zh" ? "今日情报台" : "Intelligence desk"} className="atlas-desk-shell">
    <IntelligenceDesk lang={lang} data={data} translateStory={translateStory} />
  </IntelligenceConsoleShell>;
}
