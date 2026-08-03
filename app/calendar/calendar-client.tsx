"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import type { ConsoleMeta } from "../console-meta";

type CalendarEvent = {
  id: string;
  startsAt: string;
  company: string;
  ticker: string;
  sector: string;
  description: string;
  focus: string;
  sourceName: string;
  sourceUrl: string;
  conclusion?: { summary: string; sourceName: string; sourceUrl: string };
};

function formatEvent(value: string) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("zh-CN", { timeZone: "America/New_York", month: "2-digit", day: "2-digit" }).format(date),
    weekday: new Intl.DateTimeFormat("zh-CN", { timeZone: "America/New_York", weekday: "short" }).format(date),
    time: new Intl.DateTimeFormat("zh-CN", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }).format(date),
  };
}

export default function CalendarClient({ poster = false, initialMeta }: { poster?: boolean; initialMeta?: ConsoleMeta }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<"upcoming" | "results">("results");
  const [qr, setQr] = useState("");

  useEffect(() => {
    void fetch("/api/atlas-live-v5?schema=v1", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Calendar unavailable")))
      .then((payload: unknown) => {
        const data = payload as { calendarEvents?: CalendarEvent[]; upcomingEvents?: CalendarEvent[] };
        setEvents(data.calendarEvents ?? data.upcomingEvents ?? []);
      })
      .catch(() => setEvents([]));
    void QRCode.toDataURL("https://idc-index.com", { errorCorrectionLevel: "M", margin: 1, width: 360, color: { dark: "#06101a", light: "#effbfa" } }).then(setQr);
  }, []);

  const now = Date.now();
  const upcoming = events
    .filter((event) => new Date(event.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const results = events
    .filter((event) => event.conclusion && new Date(event.startsAt).getTime() < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  const visibleEvents = poster ? [...upcoming, ...results].slice(0, 6) : view === "upcoming" ? upcoming : results;

  const calendar = <div className={`calendar-share-page atlas-console-content-page${poster ? " poster-export" : ""}`} id="calendar">
    <div className="calendar-share-grid" aria-hidden="true" />
    <header className="calendar-share-nav"><Link className="calendar-share-brand" href="/">IDC <b>ATLAS</b></Link><span>US TECH EARNINGS · CAPEX WATCH</span>{!poster && <Link className="calendar-share-back" href="/#calendar">← 返回首页</Link>}</header>
    <section className="calendar-share-card">
      <div className="calendar-share-heading"><span>IDC ATLAS · EARNINGS WATCH</span><h1>美股科技<br /><em>财报日历</em></h1><p>云厂商、半导体与数据中心基础设施公司的关键财报节点；重点追踪 CAPEX、AI 基建、订单与供给。</p></div>
      {!poster && <nav className="calendar-share-tabs" aria-label="财报日历视图">
        <button type="button" aria-pressed={view === "upcoming"} onClick={() => setView("upcoming")}>即将发布 <span>{upcoming.length}</span></button>
        <button type="button" aria-pressed={view === "results"} onClick={() => setView("results")}>已发布结论 <span>{results.length}</span></button>
      </nav>}
      <div className="calendar-share-table" role="table" aria-label={view === "upcoming" ? "即将发布的美股科技财报" : "已发布的美股科技财报结论"}><div className="calendar-share-table-head" role="row"><span>时间</span><span>公司名称</span><span>所属行业</span><span>CAPEX 关注 / 财报结论</span></div>{visibleEvents.map((event) => { const timing = formatEvent(event.startsAt); return <article key={event.id} role="row"><time><strong>{timing.date}</strong><small>{timing.weekday} · 美东 {timing.time}</small></time><div><a href={event.sourceUrl} target="_blank" rel="noreferrer"><strong>{event.company}</strong><small>{event.ticker}</small></a></div><p>{event.sector}</p><div><p>{event.conclusion?.summary ?? event.description}</p><small>{event.conclusion ? `财报结论 · ${event.conclusion.sourceName}` : `CAPEX WATCH · ${event.focus}`}</small></div></article>})}{!visibleEvents.length && <div className="calendar-share-empty">{view === "upcoming" ? "当前没有已确认的下一场财报，新增日程核验后会自动出现。" : "正在读取本轮财报结论…"}</div>}</div>
      <aside className="calendar-share-qr"><div>{qr ? <img src={qr} alt="扫描访问 IDC Atlas" /> : <i aria-hidden="true" />}</div><span>SCAN TO VISIT</span><strong>扫码访问 IDC Atlas</strong><small>实时项目脉冲 · 上市公司 · AI 基建情报</small><a href="https://idc-index.com">idc-index.com</a></aside>
    </section>
    <footer className="calendar-share-footer"><span>时间以公司官方公告为准 · 美东时间</span><span>本网站数据仅用于信息展示与研究，不构成任何投资建议。</span></footer>
  </div>;

  if (poster) return calendar;
  return <IntelligenceConsoleShell
    lang="zh"
    activeSection="calendar"
    generatedAt={initialMeta?.generatedAt}
    reviewedAt={initialMeta?.reviewedAt}
    sourceCount={initialMeta?.sourceCount}
    verifiedCount={initialMeta?.verifiedCount ?? events.length}
    pageLabel="资本支出与财报日历"
    className="atlas-calendar-shell"
  >{calendar}</IntelligenceConsoleShell>;
}
