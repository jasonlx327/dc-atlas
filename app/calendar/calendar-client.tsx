"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

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

export default function CalendarClient({ poster = false }: { poster?: boolean }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [qr, setQr] = useState("");

  useEffect(() => {
    void fetch("/api/atlas-live-v5?schema=v1", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Calendar unavailable")))
      .then((payload: { upcomingEvents?: CalendarEvent[] }) => setEvents(payload.upcomingEvents ?? []))
      .catch(() => setEvents([]));
    void QRCode.toDataURL("https://idc-index.com", { errorCorrectionLevel: "M", margin: 1, width: 360, color: { dark: "#06101a", light: "#effbfa" } }).then(setQr);
  }, []);

  return <main className={`calendar-share-page${poster ? " poster-export" : ""}`}>
    <div className="calendar-share-grid" aria-hidden="true" />
    <header className="calendar-share-nav"><a href="/">IDC <b>ATLAS</b></a><span>JULY 2026 · US TECH EARNINGS</span></header>
    <section className="calendar-share-card">
      <div className="calendar-share-heading"><span>IDC ATLAS · EARNINGS WATCH</span><h1>美股科技<br /><em>财报日历</em></h1><p>云厂商、半导体与数据中心基础设施公司的关键财报节点；重点追踪 CAPEX、AI 基建、订单与供给。</p></div>
      <div className="calendar-share-table" role="table" aria-label="美股科技财报日历"><div className="calendar-share-table-head" role="row"><span>时间</span><span>公司名称</span><span>所属行业</span><span>CAPEX 关注 / 财报结论</span></div>{events.map((event) => { const timing = formatEvent(event.startsAt); return <article key={event.id} role="row"><time><strong>{timing.date}</strong><small>{timing.weekday} · 美东 {timing.time}</small></time><div><a href={event.sourceUrl} target="_blank" rel="noreferrer"><strong>{event.company}</strong><small>{event.ticker}</small></a></div><p>{event.sector}</p><div><p>{event.conclusion?.summary ?? event.description}</p><small>{event.conclusion ? `财报结论 · ${event.conclusion.sourceName}` : `CAPEX WATCH · ${event.focus}`}</small></div></article>})}{!events.length && <div className="calendar-share-empty">正在读取本轮财报季节点…</div>}</div>
      <aside className="calendar-share-qr"><div>{qr ? <img src={qr} alt="扫描访问 IDC Atlas" /> : <i aria-hidden="true" />}</div><span>SCAN TO VISIT</span><strong>扫码访问 IDC Atlas</strong><small>实时项目脉冲 · 上市公司 · AI 基建情报</small><a href="https://idc-index.com">idc-index.com</a></aside>
    </section>
    <footer className="calendar-share-footer"><span>时间以公司官方公告为准 · 美东时间</span><span>本网站数据仅用于信息展示与研究，不构成任何投资建议。</span></footer>
  </main>;
}
