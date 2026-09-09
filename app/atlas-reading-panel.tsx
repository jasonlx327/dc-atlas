"use client";
import { useEffect, useRef } from "react";
import type { DeskRecord } from "./desk-model";
import { trackAtlasEvent } from "./atlas-analytics";

export function AtlasReadingPanel({ record, lang, onClose }: { record: DeskRecord | null; lang:"zh"|"en"; onClose:()=>void }) {
  const closeButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!record) return;
    const previous=document.activeElement as HTMLElement | null;
    document.body.classList.add("atlas-reading-open");
    closeButton.current?.focus({preventScroll:true});
    const listener=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose();};
    window.addEventListener("keydown",listener);
    trackAtlasEvent("atlas_preview_open", {content_type:record.kind,content_id:record.id,language:lang});
    return ()=>{document.body.classList.remove("atlas-reading-open");window.removeEventListener("keydown",listener);if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[record,lang,onClose]);
  if(!record)return null;
  const zh=lang==="zh";
  return <aside className="atlas-reading-panel" role="dialog" aria-labelledby="atlas-reading-title">
    <header><span>READING DESK <small>{zh?"保留信息流位置":"Keep your place in the feed"}</small></span><button ref={closeButton} onClick={onClose}>{zh?"关闭":"Close"} ×</button></header>
    <div className="atlas-reading-body"><div className="desk-meta"><span className={`desk-badge ${record.kind}`}>{record.evidence || (record.kind==="research"?(zh?"研究":"Research"):record.kind==="media"?(zh?"媒体":"Media"):(zh?"事实":"Fact"))}</span><span>{record.source}</span></div>
    <h2 id="atlas-reading-title">{record.title}</h2>{record.image&&<img src={record.image} alt={record.title}/>}
    <section><h3>01 / {record.kind==="research"?(zh?"核心判断":"Research thesis"):(zh?"内容摘要":"Summary")}</h3><p>{record.summary || (zh?"摘要尚未提供，请查看来源原文。":"No summary is available. Read the source document.")}</p></section>
    {record.details?.map(detail=><section key={detail.heading}><h3>{detail.heading}</h3><p>{detail.body}</p></section>)}
    {record.response&&<section><h3>02 / {zh?"公开回应与确认状态":"Public response and evidence status"}</h3><p>{record.response}</p></section>}
    <section><h3>{record.response?"03":"02"} / {record.kind==="research"?(zh?"完整分析与来源":"Full analysis and sources"):(zh?"来源入口":"Source document")}</h3><a className="desk-source-link" href={record.sourceHref || record.href} target={record.href.startsWith("/")&&!record.sourceHref?undefined:"_blank"} rel="noreferrer" onClick={()=>trackAtlasEvent("atlas_source_open",{content_type:record.kind,content_id:record.id,language:lang})}>{record.kind==="research"?(zh?"阅读全文及引用资料":"Read the full analysis and references"):record.source} ↗</a></section>
    <a className="desk-solid" href={record.href}>{record.kind==="research"?(zh?"进入完整研究":"Open full research"):(zh?"打开原始页面":"Open original page")} ↗</a>
    </div></aside>;
}
