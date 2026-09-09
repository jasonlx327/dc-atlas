"use client";
import { industrySources } from "./industry-sources";
import { useMemo, useState } from "react";
import { classifyIndustry, industryItems, industrySegments, type IndustryStory } from "./industry-taxonomy";
function sourceLabel(item: IndustryStory, en: boolean) {
  if (!en || !/[\u3400-\u9fff]/.test(item.sourceName ?? "")) return item.sourceName ?? (en ? "Source" : "来源");
  try { return new URL(item.sourceUrl || item.permalink || "").hostname; } catch { return "Original source"; }
}
export function IndustryBrowser({ items, en = false, loading = false, asOf, segment: controlledSegment, onSegmentChange }: { items: IndustryStory[]; en?: boolean; loading?: boolean; asOf?: string; segment?: string; onSegmentChange?: (segment: string) => void }) {
  const [localSegment, setLocalSegment] = useState("all");
  const segment = controlledSegment ?? localSegment;
  const setSegment = onSegmentChange ?? setLocalSegment;
  const [childSelection, setChildSelection] = useState({segment: "all", id: "all"});
  const child = childSelection.segment === segment ? childSelection.id : "all";
  const setChild = (id: string) => setChildSelection({segment, id});
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(0);
  const records = useMemo(() => industryItems(items).map(item => ({ item, classification: classifyIndustry(item) })), [items]);
  const group = industrySegments.find(s => s.id === segment);
  const visible = records.filter(({ item, classification }) => {
    const age = Date.parse(asOf ?? "") - Date.parse(item.publishedAt ?? "");
    return (!en || !!item.titleEn && !/[\u3400-\u9fff]/.test(item.titleEn)) && (days === 0 || age >= 0 && age <= days * 86400000) && ((segment === "all" && !!classification.primary) || (segment === "unclassified" && !classification.primary) || (segment !== "all" && segment !== "unclassified" && classification.matches.some(m => m.parent === segment && (child === "all" || !group?.children.some(c => c[0] === child) || child === m.id)))) && `${item.title} ${item.titleEn} ${item.summary} ${item.sourceName}`.toLowerCase().includes(query.toLowerCase());
  });
  return <section className="industry-reader" aria-label={en ? "Industry signals" : "产业链动态"}>
    <header><div><span>SUPPLY CHAIN</span><h2>{en ? "What changed across the stack" : "产业链最新变化"}</h2></div><p>{en ? "Source-linked updates · classified by topic" : "按细分环节聚集 · 原始来源可追溯"}</p></header>
    <div className="industry-reader-layout"><nav aria-label={en ? "Industry sectors" : "产业链板块"}>{[{ id: "all", zh: "全部板块", en: "All sectors" }, ...industrySegments, {id: "unclassified", zh: "其他", en: "Other"}].map(s => <button key={s.id} aria-pressed={segment === s.id} onClick={() => {setSegment(s.id); setChild("all");}}>{en ? s.en : s.zh}</button>)}</nav>
    <div className="industry-reader-main"><div className="industry-controls"><label><span>{en ? "Search" : "搜索"}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={en ? "Company, product or keyword" : "公司、产品或关键词"} /></label><label><span>{en ? "Window" : "时间范围"}</span><select value={days} onChange={e => setDays(Number(e.target.value))}><option value={0}>{en ? "All dates" : "全部时间"}</option>{[7,30,90].map(n => <option value={n} key={n}>{en ? `${n} days` : `近 ${n} 天`}</option>)}</select></label></div>
    {group && <div className="industry-subsegments" aria-label={en ? "Subsegments" : "细分环节"}><button aria-pressed={child === "all"} onClick={() => setChild("all")}>{en ? "All" : "全部"}</button>{group.children.map(([id,zh,label]) => <button key={id} aria-pressed={child === id} onClick={() => setChild(id)}>{en ? label : zh}</button>)}</div>}
    <p className="industry-count">{en ? `${visible.length} records in the current dataset. Topic matches are not confirmed supply relationships.` : `当前数据集 ${visible.length} 条。主题匹配用于导航，不代表已确认的供应关系。`}</p>
    {visible.map(({item, classification}) => <article className="industry-story" key={item.id}><div className="industry-story-meta"><time>{item.publishedAt ? new Intl.DateTimeFormat(en ? "en-US" : "zh-CN", { timeZone: en ? "America/New_York" : "Asia/Shanghai", year: "numeric", month: "short", day: "numeric" }).format(new Date(item.publishedAt)) : "—"}</time><span>{sourceLabel(item, en)}</span><span>{classification.primary ? (en ? classification.primary.en : classification.primary.zh) : (en ? "Other" : "其他")}</span></div><h3><a href={item.sourceUrl || item.permalink} target="_blank" rel="noreferrer">{en ? item.titleEn || item.title : item.title} ↗</a></h3><p>{en ? item.summaryEn && !/[\u3400-\u9fff]/.test(item.summaryEn) ? item.summaryEn : "" : item.summary}</p></article>)}
    {!visible.length && <p className="industry-empty">{loading ? (en ? "Loading source-linked records…" : "正在读取动态…") : (en ? "No matching records in this dataset. This does not establish that the market is unchanged." : "当前数据集中没有符合条件的记录，不代表市场没有新变化。")}</p>}
    <details className="industry-source-directory"><summary>{en ? "Research & solution sources" : "专业研究与解决方案来源"}</summary><p>{en ? "Reference directory, not a live feed or a coverage guarantee. Restricted reports require authorized access." : "这是来源目录，不代表已完成实时采集或完整覆盖。受限研报需使用授权渠道。"}</p>{industrySources.filter(s => segment === "all" || s.sectors.includes(segment)).map(s => <a key={s.name} href={s.url} target="_blank" rel="noreferrer"><strong>{s.name} ↗</strong><span>{en ? s.en : s.zh}</span></a>)}</details>
    </div></div>
  </section>;
}
