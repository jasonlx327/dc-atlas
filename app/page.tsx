"use client";

import { useMemo, useState } from "react";

type Company = {
  name: string;
  ticker: string;
  market: "美股" | "A股";
  segment: string;
  cap: string;
  change: number;
  tone: string;
  initials: string;
};

const companies: Company[] = [
  { name: "Equinix", ticker: "EQIX", market: "美股", segment: "IDC REIT", cap: "$84.9B", change: 1.8, tone: "blue", initials: "EQ" },
  { name: "Digital Realty", ticker: "DLR", market: "美股", segment: "IDC REIT", cap: "$58.6B", change: 0.9, tone: "violet", initials: "DL" },
  { name: "Vertiv", ticker: "VRT", market: "美股", segment: "电力与温控", cap: "$51.2B", change: 3.4, tone: "lime", initials: "VT" },
  { name: "CoreWeave", ticker: "CRWV", market: "美股", segment: "AI 云算力", cap: "$38.7B", change: -1.2, tone: "coral", initials: "CW" },
  { name: "Arista Networks", ticker: "ANET", market: "美股", segment: "高速网络", cap: "$132.4B", change: 2.1, tone: "cyan", initials: "AN" },
  { name: "Applied Digital", ticker: "APLD", market: "美股", segment: "算力园区", cap: "$3.4B", change: 4.7, tone: "amber", initials: "AD" },
  { name: "润泽科技", ticker: "300442", market: "A股", segment: "IDC 运营", cap: "¥84.2B", change: 2.6, tone: "red", initials: "润" },
  { name: "宝信软件", ticker: "600845", market: "A股", segment: "IDC 运营", cap: "¥71.8B", change: 0.6, tone: "blue", initials: "宝" },
  { name: "数据港", ticker: "603881", market: "A股", segment: "IDC 运营", cap: "¥19.3B", change: 3.1, tone: "violet", initials: "数" },
  { name: "奥飞数据", ticker: "300738", market: "A股", segment: "IDC 运营", cap: "¥18.6B", change: -0.8, tone: "cyan", initials: "奥" },
  { name: "光环新网", ticker: "300383", market: "A股", segment: "云与 IDC", cap: "¥27.4B", change: 1.4, tone: "amber", initials: "光" },
  { name: "科华数据", ticker: "002335", market: "A股", segment: "电力与储能", cap: "¥22.1B", change: 2.9, tone: "lime", initials: "科" },
  { name: "英维克", ticker: "002837", market: "A股", segment: "液冷温控", cap: "¥35.7B", change: 5.2, tone: "coral", initials: "英" },
  { name: "中际旭创", ticker: "300308", market: "A股", segment: "光模块", cap: "¥218.5B", change: 1.9, tone: "red", initials: "中" },
];

const sectors = [
  { name: "IDC 运营", count: 18, value: 86 },
  { name: "电力与温控", count: 14, value: 72 },
  { name: "高速网络", count: 11, value: 62 },
  { name: "AI 云算力", count: 9, value: 54 },
  { name: "光模块", count: 8, value: 46 },
];

const trendUs = [18, 23, 21, 29, 32, 37, 35, 44, 48, 54, 58, 64, 62, 71, 78, 76, 84, 91];
const trendCn = [16, 19, 22, 20, 26, 28, 34, 31, 38, 41, 47, 45, 52, 57, 55, 63, 68, 73];

function pathFrom(values: number[]) {
  const width = 700;
  const height = 210;
  const min = Math.min(...values) - 5;
  const max = Math.max(...values) + 5;
  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export default function Home() {
  const [market, setMarket] = useState("全部");
  const [query, setQuery] = useState("");
  const [activeRange, setActiveRange] = useState("1Y");

  const filtered = useMemo(() => companies.filter((company) => {
    const marketMatch = market === "全部" || company.market === market;
    const queryMatch = `${company.name}${company.ticker}${company.segment}`.toLowerCase().includes(query.toLowerCase());
    return marketMatch && queryMatch;
  }), [market, query]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="DC Atlas 首页">
          <span className="brand-mark"><i /><i /><i /></span>
          <span><b>DC</b> ATLAS</span>
        </a>
        <nav aria-label="主导航">
          <a className="active" href="#overview">总览</a>
          <a href="#markets">双市场</a>
          <a href="#companies">公司库</a>
          <a href="#methodology">数据说明</a>
        </nav>
        <div className="top-actions">
          <span className="status-dot">演示快照</span>
          <button className="icon-button" aria-label="搜索公司" onClick={() => document.getElementById("company-search")?.focus()}>⌕</button>
        </div>
      </header>

      <section className="hero" id="overview">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> CHINA × U.S. DATA CENTER INTELLIGENCE</div>
          <h1>看懂全球算力<br />基础设施版图</h1>
          <p>聚合美股与 A 股数据中心产业链上市公司，从运营商、电力温控到高速网络，用一张可下钻的地图追踪行业结构。</p>
          <div className="hero-actions">
            <a className="primary-button" href="#companies">浏览公司库 <span>↘</span></a>
            <a className="text-button" href="#markets">查看市场对比 <span>→</span></a>
          </div>
        </div>

        <div className="hero-dashboard" aria-label="双市场总览">
          <div className="dash-top">
            <div><small>覆盖公司</small><strong>68</strong><span>家上市公司</span></div>
            <div className="live-pill"><i /> SNAPSHOT · 2026.07.17</div>
          </div>
          <div className="market-cards">
            <article>
              <div className="flag us">US</div>
              <div><small>美国市场</small><strong>31</strong></div>
              <span className="positive">+2.4%</span>
            </article>
            <article>
              <div className="flag cn">CN</div>
              <div><small>中国 A 股</small><strong>37</strong></div>
              <span className="positive">+1.7%</span>
            </article>
          </div>
          <div className="mini-chart">
            <div className="chart-label"><span>产业链热度</span><b>过去 12 个月</b></div>
            <div className="bars">{[38, 46, 43, 52, 49, 58, 64, 61, 73, 78, 84, 92].map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</div>
          </div>
        </div>

        <div className="hero-stats">
          <div><span>总市值</span><strong>$1.84T</strong><small>跨市场折算 · 示例</small></div>
          <div><span>核心赛道</span><strong>7</strong><small>产业链细分</small></div>
          <div><span>近 30 日事件</span><strong>126</strong><small>公告与新闻</small></div>
          <div><span>数据来源</span><strong>8</strong><small>公开可复核源</small></div>
        </div>
      </section>

      <section className="section market-section" id="markets">
        <div className="section-heading">
          <div><span className="section-index">01</span><p>MARKET OVERVIEW</p><h2>双市场，一条算力主线</h2></div>
          <p className="section-lead">美股更集中于全球化运营、AI 云与网络设备；A 股覆盖运营、电力、温控与光通信，产业链颗粒度更细。</p>
        </div>

        <div className="market-grid">
          <article className="trend-panel">
            <div className="panel-head">
              <div><small>市场热度指数</small><h3>中美数据中心产业链</h3></div>
              <div className="range-tabs">{["1M", "3M", "6M", "1Y"].map(range => <button key={range} className={activeRange === range ? "active" : ""} onClick={() => setActiveRange(range)}>{range}</button>)}</div>
            </div>
            <div className="legend"><span className="us-line">美股 · 148.6</span><span className="cn-line">A 股 · 132.4</span></div>
            <div className="line-chart">
              <div className="grid-lines"><i /><i /><i /><i /></div>
              <svg viewBox="0 0 700 210" preserveAspectRatio="none" aria-label="中美数据中心产业链示意走势">
                <path className="area-path" d={`${pathFrom(trendUs)} L700,210 L0,210 Z`} />
                <path className="line-us" d={pathFrom(trendUs)} />
                <path className="line-cn" d={pathFrom(trendCn)} />
              </svg>
              <div className="axis"><span>2025.07</span><span>2025.10</span><span>2026.01</span><span>2026.04</span><span>2026.07</span></div>
            </div>
          </article>

          <aside className="sector-panel">
            <div className="panel-head"><div><small>产业链分布</small><h3>重点赛道覆盖</h3></div><span className="count-badge">60 / 68</span></div>
            <div className="sector-list">{sectors.map((sector, index) => (
              <div className="sector-row" key={sector.name}>
                <span className="rank">0{index + 1}</span>
                <div><p><b>{sector.name}</b><em>{sector.count} 家</em></p><i><span style={{ width: `${sector.value}%` }} /></i></div>
              </div>
            ))}</div>
            <a href="#companies" className="panel-link">查看全部产业链分类 <span>↗</span></a>
          </aside>
        </div>
      </section>

      <section className="section companies-section" id="companies">
        <div className="section-heading compact">
          <div><span className="section-index">02</span><p>COMPANY UNIVERSE</p><h2>上市公司全景库</h2></div>
          <p className="section-lead">按市场与产业链角色筛选，先建立公司地图，再进入财务、产能和事件层。</p>
        </div>

        <div className="company-toolbar">
          <div className="market-tabs">{["全部", "美股", "A股"].map(item => <button key={item} className={market === item ? "active" : ""} onClick={() => setMarket(item)}>{item}<span>{item === "全部" ? 68 : item === "美股" ? 31 : 37}</span></button>)}</div>
          <label className="search-box" htmlFor="company-search"><span>⌕</span><input id="company-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索公司、代码或赛道" /></label>
        </div>

        <div className="company-table" role="table" aria-label="数据中心上市公司列表">
          <div className="table-head" role="row"><span>公司 / 代码</span><span>市场</span><span>产业链角色</span><span>市值 · 示例</span><span>快照涨跌</span><span /></div>
          {filtered.slice(0, 10).map(company => (
            <article className="company-row" role="row" key={company.ticker}>
              <div className="company-name"><span className={`logo ${company.tone}`}>{company.initials}</span><div><b>{company.name}</b><small>{company.ticker}</small></div></div>
              <span><i className={`market-dot ${company.market === "美股" ? "us" : "cn"}`} />{company.market}</span>
              <span className="segment-chip">{company.segment}</span>
              <strong>{company.cap}</strong>
              <span className={company.change >= 0 ? "positive" : "negative"}>{company.change >= 0 ? "+" : ""}{company.change.toFixed(1)}%</span>
              <button aria-label={`查看 ${company.name} 详情`}>↗</button>
            </article>
          ))}
          {filtered.length === 0 && <div className="empty-state">没有找到匹配的公司，请换个关键词。</div>}
        </div>
        <div className="table-foot"><span>当前展示 {Math.min(filtered.length, 10)} / {filtered.length || 0} 条匹配结果</span><button>加载更多 <span>↓</span></button></div>
      </section>

      <section className="method-section" id="methodology">
        <div>
          <p>DATA BOUNDARY</p>
          <h2>数据有边界，结论才可信。</h2>
        </div>
        <div className="method-copy">
          <p>首版页面用于验证信息架构，市值、涨跌与热度均为演示快照，不代表实时行情，也不构成投资建议。正式数据层建议以交易所公告、公司定期报告和授权行情源为准。</p>
          <div><span>01</span> 公司与证券主上市地明确区分 <span>02</span> 行情与基本面标注数据时点 <span>03</span> 每项指标保留来源与口径</div>
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark"><i /><i /><i /></span><span><b>DC</b> ATLAS</span></div>
        <p>美股 × A 股数据中心产业链情报站</p>
        <span>© 2026 · RESEARCH PREVIEW</span>
      </footer>
    </main>
  );
}
