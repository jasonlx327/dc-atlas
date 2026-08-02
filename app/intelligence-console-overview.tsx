"use client";

import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { ChainIcon, type ChainKey } from "./chain-icon";
import { columnArticles } from "./columns/articles";
import { deriveConsoleMeta, type ConsoleMeta } from "./console-meta";
import { entityDirectory } from "./entity-directory";

export type ConsoleStory = {
  id: string;
  title: string;
  summary?: string;
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

export type ConsoleOverviewData = {
  generatedAt?: string;
  reviewedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
  pulse: ConsoleStory[];
  companies: ConsoleStory[];
  events: ConsoleEvent[];
  deals: ConsoleDeal[];
  benchmarks: ConsoleBenchmark[];
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
  sourceCount?: number;
  verifiedCount?: number;
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
  { key: "overview", zh: "概览", en: "Overview", hrefZh: "/#overview", hrefEn: "/en#overview" },
  { key: "calendar", zh: "财报 / 资本支出", en: "Earnings / CapEx", hrefZh: "/#calendar", hrefEn: "/en#calendar" },
  { key: "columns", zh: "专栏", en: "Columns", hrefZh: "/#columns", hrefEn: "/en#columns" },
  { key: "pulse", zh: "脉搏监测", en: "Pulse", hrefZh: "/pulse", hrefEn: "/en/pulse" },
  { key: "companies", zh: "公司", en: "Companies", hrefZh: "/#companies", hrefEn: "/en#companies" },
  { key: "industry", zh: "产业链地图", en: "Industry Map", hrefZh: "/industry", hrefEn: "/en/industry" },
  { key: "market", zh: "市场", en: "Markets", hrefZh: "/#market", hrefEn: "/en#market" },
  { key: "rumors", zh: "市场传闻", en: "Rumor Watch", hrefZh: "/rumors", hrefEn: "/en/rumors" },
  { key: "policy", zh: "政策索引", en: "Policy Index", hrefZh: "/policy", hrefEn: "/en/policy" },
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
  const scrollKeys = new Set(["overview", "calendar", "columns", "companies", "market"]);
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
        </section>}
        {shareOpen && <section className="atlas-console-share" role="dialog" aria-label={isZh ? "二维码分享当前页面" : "Share this page with a QR code"}>
          <button type="button" onClick={() => setShareOpen(false)}>{isZh ? "关闭" : "Close"}</button>
          {shareQr ? <img src={shareQr} alt={isZh ? "当前页面分享二维码" : "QR code for this page"} /> : <span className="atlas-console-share-loading">{isZh ? "正在生成二维码…" : "Generating QR code…"}</span>}
          <strong>{isZh ? "扫描分享当前页面" : "Scan to share this page"}</strong>
          <small>{shareUrl.replace("https://", "")}</small>
          <a href={shareUrl} target="_blank" rel="noreferrer">{isZh ? "打开正式链接" : "Open canonical link"}</a>
        </section>}
        <a href="/methodology">{isZh ? "方法论" : "Methodology"}</a>
        <a href="/privacy">{isZh ? "隐私" : "Privacy"}</a>
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
  sourceCount,
  verifiedCount,
  pageLabel,
}: {
  lang: "zh" | "en";
  generatedAt?: string;
  reviewedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
  pageLabel?: string;
}) {
  const isZh = lang === "zh";
  const timezone = isZh ? "Asia/Shanghai" : "America/New_York";
  return <header className="atlas-statusbar">
    <div><strong>{dateLabel(generatedAt, lang, false, timezone)}</strong><span>{pageLabel ?? (isZh ? "每日产业情报" : "Daily industrial intelligence")}{reviewedAt ? ` · ${isZh ? "核验至" : "Verified through"} ${dateLabel(reviewedAt, lang, false, timezone)}` : ""}</span></div>
    <dl>
      <div><dt>{isZh ? "数据刷新" : "Data refreshed"}</dt><dd><i />{dateLabel(generatedAt, lang, true, timezone)}</dd></div>
      <div><dt>{isZh ? "来源覆盖" : "Source coverage"}</dt><dd>{sourceCount == null ? "—" : `${sourceCount} ${isZh ? "个公开来源" : "public sources"}`}</dd></div>
      <div><dt>{isZh ? "已核验记录" : "Verified records"}</dt><dd>{verifiedCount == null ? "—" : verifiedCount}</dd></div>
    </dl>
    <a className="atlas-language" href={isZh ? "/en?lang=en" : "/?lang=zh"}>{isZh ? "EN" : "中文"}</a>
  </header>;
}

export function IntelligenceConsoleShell({
  lang,
  activeSection = "",
  generatedAt,
  reviewedAt,
  sourceCount,
  verifiedCount,
  pageLabel,
  className = "",
  children,
}: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);
  const isZh = lang === "zh";
  const liveMeta = useLiveConsoleMeta(!generatedAt || !reviewedAt || sourceCount == null || verifiedCount == null);
  const resolvedGeneratedAt = generatedAt ?? liveMeta.generatedAt;
  const resolvedReviewedAt = reviewedAt ?? liveMeta.reviewedAt;
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
        sourceCount={resolvedSourceCount}
        verifiedCount={resolvedVerifiedCount}
        pageLabel={pageLabel}
      />
      {children}
      <footer className="atlas-console-footer">
        <p>{isZh ? "信息仅供专业投资者参考，不构成投资建议。" : "Data for professional research only. Nothing here constitutes investment advice."}</p>
        <nav><a href="/methodology">{isZh ? "方法论" : "Methodology"}</a><a href="/privacy">{isZh ? "隐私" : "Privacy"}</a></nav>
      </footer>
    </div>
  </main>;
}

export function IntelligenceConsoleOverview({ lang, data, translateStory }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const isZh = lang === "zh";
  const pulse = data.pulse.slice(0, 8).map((story) => translateStory?.(story) ?? story);
  const companies = data.companies.slice(0, 4).map((story) => translateStory?.(story) ?? story);
  const lead = [...pulse, ...companies].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())[0];
  const events = data.events.slice(0, 6);
  const deals = data.deals.slice(0, 5);
  const articles = columnArticles.slice(0, 5);
  const uniqueSources = new Set([...data.pulse, ...data.companies, ...data.deals].map((item) => item.sourceName).filter(Boolean));
  const verifiedCount = data.pulse.length + data.companies.length + data.deals.length;
  const leadImage = lead?.imageSrc ?? "/column-ai-capex-grid.png";
  const contextualImages = ["/column-hyperscale-leases.png", "/column-sk-hynix-hbm.png", "/products/nvidia-dgx-b200.jpg", "/column-ai-capex-grid.png", "/column-microsoft-ai-capex.png"];

  useEffect(() => {
    const sectionIds = ["overview", "calendar", "columns", "pulse", "companies", "industry", "market"];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.2, 0.5] });
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return <main className={navCollapsed ? "atlas-console-overview rail-collapsed" : "atlas-console-overview"} lang={isZh ? "zh-CN" : "en"}>
    <ShellNav lang={lang} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={navCollapsed} setCollapsed={setNavCollapsed} activeSection={activeSection} setActiveSection={setActiveSection} />
    <div className="atlas-console-canvas">
      <div id="overview"><ConsoleStatusbar lang={lang} generatedAt={data.generatedAt} reviewedAt={data.reviewedAt} sourceCount={data.sourceCount ?? uniqueSources.size} verifiedCount={data.verifiedCount ?? verifiedCount} /></div>

      <section className="atlas-lead" aria-labelledby="atlas-lead-title">
        <div className="atlas-lead-copy">
          <span>{isZh ? "今日首要信号" : "LEAD SIGNAL"}</span>
          <h1 id="atlas-lead-title"><a href={lead ? storyLink(lead) : "#"} target="_blank" rel="noreferrer">{lead ? storyTitle(lead) : isZh ? "正在连接最新基础设施信号" : "Connecting to the latest infrastructure signal"}</a></h1>
          <p>{lead ? storySummary(lead, lang) : isZh ? "数据连接后将显示最新已核验项目。" : "The latest verified project will appear when data connects."}</p>
          {lead && <div className="atlas-lead-meta"><span>{lead.region ?? (isZh ? "全球" : "Global")}</span><span>{lead.category ?? (isZh ? "项目脉冲" : "Project pulse")}</span><time>{dateLabel(lead.publishedAt, lang)}</time></div>}
        </div>
        <figure className="atlas-lead-image">
          <img className={leadImage.startsWith("/column-") ? "contain-art" : ""} src={leadImage} alt={lead?.imageAlt ?? (isZh ? "数据中心基础设施项目" : "Data-center infrastructure project")} />
          <figcaption>{lead?.sourceName ?? (isZh ? "IDC Atlas 研究图示" : "IDC Atlas research visual")}</figcaption>
        </figure>
        <dl className="atlas-lead-facts">
          <div><dt>{isZh ? "披露指标" : "Disclosed metric"}</dt><dd>{lead ? disclosedMetric(lead, lang) : "—"}</dd></div>
          <div><dt>{isZh ? "项目状态" : "Status"}</dt><dd>{lead?.milestone ?? (isZh ? "公开披露" : "Public update")}</dd></div>
          <div><dt>{isZh ? "主要来源" : "Primary source"}</dt><dd>{lead?.sourceName ?? "—"}<small>{dateLabel(lead?.publishedAt, lang)}</small></dd></div>
          <div><dt>{isZh ? "核验状态" : "Verification"}</dt><dd className="verified">{isZh ? "已核验" : "Verified"}<i><b /><b /><b /><b /></i></dd></div>
        </dl>
      </section>

      <section className="atlas-decision-grid">
        <div className="atlas-calendar" id="calendar">
          <header><strong>{isZh ? "资本支出与财报日历" : "CapEx & earnings watch"}</strong><a href="/calendar">{isZh ? "查看全部" : "View all"} →</a></header>
          <div>{events.map((event) => {
            const timing = eventDate(event.startsAt, lang);
            return <a href={event.conclusion?.sourceUrl ?? event.sourceUrl} target="_blank" rel="noreferrer" key={event.id}>
              <time><b>{timing.day}</b><span>{timing.weekday}</span><small>{isZh ? `美东 ${timing.time}` : `${timing.time} ET`}</small></time>
              <div className="atlas-calendar-company"><strong>{event.company} <small>{event.ticker}</small></strong><em>{event.sector}</em></div>
              <div className="atlas-calendar-focus"><span>{event.focus ?? event.sector}</span>{event.conclusion && <small>{isZh ? "财报结论已更新" : "Post-results read-through"}</small>}</div>
            </a>;
          })}</div>
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

      <section className="atlas-live-pulse" id="pulse">
        <header><strong>{isZh ? "市场脉搏" : "Live infrastructure pulse"} <small>{isZh ? "按信号强度排序" : "ranked for fast reading"}</small></strong><a href={isZh ? "/pulse" : "/en/pulse"}>{isZh ? "查看全部信号" : "View all signals"} →</a></header>
        <div className="atlas-pulse-table">
          <div className="atlas-pulse-table-head"><span>#</span><span>{isZh ? "日期" : "Date"}</span><span>{isZh ? "信号" : "Signal"}</span><span>{isZh ? "公司 / 项目" : "Company / project"}</span><span>{isZh ? "类别" : "Category"}</span><span>{isZh ? "地区" : "Region"}</span><span>{isZh ? "披露指标" : "Disclosed metric"}</span><span>{isZh ? "来源" : "Primary source"}</span></div>
          {pulse.map((story, index) => <a className="atlas-pulse-row" href={storyLink(story)} target="_blank" rel="noreferrer" key={story.id}>
            <span>{index + 1}</span>
            <time>{dateLabel(story.publishedAt, lang)}</time>
            <b>{index < 2 ? (isZh ? "新增" : "NEW") : (isZh ? "更新" : "UPD")}</b>
            <strong>{storyTitle(story)}</strong>
            <span>{story.category ?? (isZh ? "项目" : "Project")}</span>
            <span>{story.region ?? (isZh ? "全球" : "Global")}</span>
            <em>{disclosedMetric(story, lang)}</em>
            <span>{story.sourceName ?? "—"}</span>
          </a>)}
        </div>
      </section>

      <section className="atlas-company-watch" id="companies">
        <header><strong>{isZh ? "上市公司动态" : "Listed-company watch"}</strong><a href={isZh ? "/pulse" : "/en/pulse"}>{isZh ? "进入公司脉冲" : "Open company watch"} →</a></header>
        <div>{companies.map((story, index) => <a href={storyLink(story)} target="_blank" rel="noreferrer" key={story.id}>
          <span>{story.listedTicker ?? String(index + 1).padStart(2, "0")}</span>
          <strong>{storyTitle(story)}</strong>
          <p>{storySummary(story, lang)}</p>
          <time>{dateLabel(story.publishedAt, lang)}</time>
        </a>)}</div>
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
        <nav><a href="/methodology">{isZh ? "方法论" : "Methodology"}</a><a href="/privacy">{isZh ? "隐私" : "Privacy"}</a></nav>
      </footer>
    </div>
  </main>;
}
