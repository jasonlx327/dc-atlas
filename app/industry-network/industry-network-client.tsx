"use client";

import { useMemo, useRef, useState } from "react";
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from "react";
import { IntelligenceConsoleShell } from "../intelligence-console-overview";
import {
  NETWORK_EDGES,
  NETWORK_ENTITIES,
  REL_LABELS,
  SCENARIOS,
  estimateFor,
  networkStats,
  recentEdgeCount,
  type NetworkEdge,
} from "../industry-network-data";

const REL_COLORS: Record<string, string> = {
  供货: "#1D433A",
  订单: "#7A5C8A",
  投资: "#C65D3A",
  租约: "#9A7B4F",
  冷却: "#3E6E7E",
  供电: "#B08A2E",
  合作: "#78877D",
  并购: "#6E5B7B",
};

const SVG_W = 1000;
const SVG_H = 760;

// Demo data has a fixed reference date; recent-count is computed against it so the UI stays deterministic.
const REFERENCE_NOW = Date.parse("2026-08-06T12:00:00+08:00");

type Props = {
  lang: "zh" | "en";
  initialFocus?: string;
  initialScenario?: string;
};

function dateLabel(value: string, lang: "zh" | "en") {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function edgeTitle(edge: NetworkEdge, lang: "zh" | "en") {
  const from = NETWORK_ENTITIES[edge.from];
  const to = NETWORK_ENTITIES[edge.to];
  const rel = REL_LABELS[edge.rel]?.en ?? edge.rel;
  return lang === "zh"
    ? `${from?.name ?? edge.from} 与 ${to?.name ?? edge.to}：${edge.rel}`
    : `${from?.en ?? edge.from} → ${to?.en ?? edge.to} · ${rel}`;
}

function amountLine(edge: NetworkEdge, lang: "zh" | "en") {
  if (edge.amount !== null) {
    return { text: edge.amount, kind: "disclosed" as const, hint: lang === "zh" ? "已披露" : "Disclosed" };
  }
  const est = estimateFor(edge.from, edge.to, edge.rel);
  if (est) {
    return {
      text: lang === "zh" ? `${est.range}（估算）` : `${est.range} (est.)`,
      kind: "estimated" as const,
      hint: lang === "zh" ? "基于公开资料推算，非公司披露" : "Estimated from public data, not company-disclosed",
      method: est.method,
    };
  }
  return { text: lang === "zh" ? "暂未公开" : "Not public yet", kind: "empty" as const, hint: "" };
}

function evidenceText(evidence: NetworkEdge["evidence"], lang: "zh" | "en") {
  const map: Record<string, string> = lang === "zh" ? { official: "官方披露", management: "管理层表述", media: "媒体报道" } : { official: "Official", management: "Management", media: "Media" };
  return map[evidence];
}

export default function IndustryNetworkClient({ lang, initialFocus = "nvidia", initialScenario = "all" }: Props) {
  const isZh = lang === "zh";
  const stats = useMemo(() => networkStats(), []);
  const [focus, setFocus] = useState<string>(NETWORK_ENTITIES[initialFocus] ? initialFocus : "nvidia");
  const [scenarioKey, setScenarioKey] = useState<string>(SCENARIOS.some((s) => s.key === initialScenario) ? initialScenario : "all");
  const [dataFilter, setDataFilter] = useState<"all" | "amount" | "official">("all");
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const [query, setQuery] = useState("");
  const [nodePos, setNodePos] = useState<Record<string, { x: number; y: number }>>({});
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const movedRef = useRef(false);

  const focusEntity = NETWORK_ENTITIES[focus];
  const scenario = SCENARIOS.find((s) => s.key === scenarioKey) ?? SCENARIOS[0];

  const ego = useMemo(() => {
    const up = NETWORK_EDGES.filter((e) => e.to === focus);
    const down = NETWORK_EDGES.filter((e) => e.from === focus);
    return { up, down };
  }, [focus]);

  const visibleEdges = useMemo(() => {
    const filter = (e: NetworkEdge) => {
      if (dataFilter === "amount") return e.amount !== null || estimateFor(e.from, e.to, e.rel);
      if (dataFilter === "official") return e.evidence === "official";
      return true;
    };
    return { up: ego.up.filter(filter), down: ego.down.filter(filter) };
  }, [ego, dataFilter]);

  const recentByScenario = useMemo(() => {
    const cutoff = REFERENCE_NOW - 30 * 86400000;
    const ids = new Set(scenario.expand);
    if (scenario.focus) ids.add(scenario.focus);
    return NETWORK_EDGES.filter((e) => {
      if (!ids.has(e.from) || !ids.has(e.to)) return false;
      if (scenario.rel && e.rel !== scenario.rel) return false;
      const t = Date.parse(e.observed);
      return Number.isFinite(t) && t >= cutoff;
    }).length;
  }, [scenario]);

  const activeEdge = activeEdgeId ? NETWORK_EDGES.find((e) => e.id === activeEdgeId) : null;

  const focusEntityName = isZh ? focusEntity?.name ?? focus : focusEntity?.en ?? focus;
  const focusStat = focusEntity?.stat;

  function nodeView(id: string, side: "up" | "down", index: number, count: number) {
    const entity = NETWORK_ENTITIES[id];
    const y = count <= 1 ? SVG_H / 2 : 70 + (index * (SVG_H - 140)) / (count - 1);
    const x = side === "up" ? 170 : 830;
    return { x, y, entity, dense: count > 10 };
  }

  const upNodes = Array.from(new Set(visibleEdges.up.map((e) => e.from)));
  const downNodes = Array.from(new Set(visibleEdges.down.map((e) => e.to)));
  const focusPos = nodePos[focus] ?? { x: 500, y: 280 };

  const activeEdgeAmount = activeEdge ? amountLine(activeEdge, lang) : null;
  const moveNode = (id: string, nx: number, ny: number) => setNodePos((prev) => ({ ...prev, [id]: { x: nx, y: ny } }));

  return (
    <IntelligenceConsoleShell
      lang={lang}
      activeSection="network"
      pageLabel={isZh ? "产业链信息网" : "Industry network"}
      className="industry-network-shell"
    >
      <div className="industry-network-page" lang={isZh ? "zh-CN" : "en"}>
        <header className="industry-network-head">
          <div>
            <span>{isZh ? "IDC ATLAS · INDUSTRY NETWORK" : "IDC ATLAS · INDUSTRY NETWORK"}</span>
            <h1>{isZh ? "产业链信息网" : "Industry network"}</h1>
            <p>{isZh ? "从一家公司出发，看它和上下游之间的公开关系、金额与来源。" : "Start from one company and see its public upstream / downstream relationships, amounts and sources."}</p>
          </div>
          <dl>
            <div><dt>{isZh ? "收录公司" : "Companies"}</dt><dd>{stats.entities}</dd></div>
            <div><dt>{isZh ? "公开关系" : "Relationships"}</dt><dd>{stats.edges}</dd></div>
            <div><dt>{isZh ? "有金额" : "With amount"}</dt><dd>{stats.disclosed + stats.estimated}</dd></div>
            <div><dt>{isZh ? "近 30 天新增" : "New in 30d"}</dt><dd>{recentEdgeCount(30, REFERENCE_NOW)}</dd></div>
          </dl>
        </header>

        <div className="industry-network-tools">
          <div className="industry-network-scenarios" role="tablist" aria-label={isZh ? "选择场景" : "Scenarios"}>
            {SCENARIOS.map((s) => (
              <button
                type="button"
                role="tab"
                aria-selected={s.key === scenarioKey}
                className={s.key === scenarioKey ? "on" : ""}
                key={s.key}
                onClick={() => {
                  setScenarioKey(s.key);
                  if (s.focus) setFocus(s.focus);
                  setActiveEdgeId(null);
                }}
              >
                {isZh ? s.zh : s.en}
              </button>
            ))}
          </div>
          <div className="industry-network-filters">
            {(["all", "amount", "official"] as const).map((key) => (
              <button
                type="button"
                key={key}
                className={dataFilter === key ? "on" : ""}
                onClick={() => setDataFilter(key)}
              >
                {key === "all" ? (isZh ? "全部" : "All") : key === "amount" ? (isZh ? "有金额" : "With amount") : isZh ? "仅官方" : "Official only"}
              </button>
            ))}
          </div>
        </div>

        {scenarioKey !== "all" && (
          <p className="industry-network-scenario-note">
            {isZh ? scenario.noteZh : scenario.noteEn}
            {" · "}
            <b>{isZh ? `近 30 天新增 ${recentByScenario} 条` : `${recentByScenario} new in the last 30 days`}</b>
          </p>
        )}

        <div className={`industry-network-main${showGraph ? " graph-open" : ""}`}>
          <section className="industry-network-graph-wrap">
            <div className="industry-network-graph-head">
              <div>
                <strong>{focusEntityName}</strong>
                <span>{focusEntity?.tick}</span>
              </div>
              <div className="industry-network-focus-actions">
                {Object.keys(nodePos).length > 0 && (
                  <button type="button" className="industry-network-reset" onClick={() => setNodePos({})}>{isZh ? "重置布局" : "Reset layout"}</button>
                )}
                <input
                  list="industry-network-entities"
                  value={query}
                  placeholder={isZh ? "输入公司名，回车切换" : "Type a company and press Enter"}
                  aria-label={isZh ? "切换焦点公司" : "Switch focus company"}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    const hit = Object.values(NETWORK_ENTITIES).find((e) => e.name.includes(query) || e.en.toLowerCase().includes(query.toLowerCase()) || e.tick.toLowerCase().includes(query.toLowerCase()));
                    if (hit) {
                      setFocus(hit.id);
                      setQuery("");
                    }
                  }}
                />
                <datalist id="industry-network-entities">
                  {Object.values(NETWORK_ENTITIES).map((e) => <option key={e.id} value={e.name} />)}
                </datalist>
                {focusStat && <span className="industry-network-focus-stat">{focusStat}</span>}
              </div>
            </div>
            <p className="industry-network-guide">{isZh ? "上游在左 · 下游在右 · 拖动节点调整 · 点公司切换 · 点下方关系卡片看金额和来源" : "Upstream left · downstream right · drag nodes to rearrange · click a company to switch · click a card below for amount and source"}</p>
            <div className="industry-network-canvas" aria-label={isZh ? "产业链关系图" : "Industry network graph"}>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img" aria-label={`${focusEntityName} ${isZh ? "上下游关系图" : "network"}`}>
                {upNodes.map((id, index) => {
                  const { x, y } = nodePos[id] ?? nodeView(id, "up", index, upNodes.length);
                  const rels = Array.from(new Set(NETWORK_EDGES.filter((e) => e.from === id && e.to === focus).map((e) => e.rel)));
                  const color = REL_COLORS[rels[0]] ?? "#78877D";
                  const label = rels.map((r) => (isZh ? r : REL_LABELS[r]?.en ?? r)).join(" · ");
                  return (
                    <g key={`${id}-edge`}>
                      <line x1={focusPos.x} y1={focusPos.y} x2={x} y2={y} stroke={color} strokeWidth={1.5} opacity={0.45} />
                      <text x={(focusPos.x + x) / 2} y={(focusPos.y + y) / 2 - 5} textAnchor="middle" className={`industry-network-edge-label${upNodes.length > 10 ? " dense" : ""}`} fill={color}>{label}</text>
                    </g>
                  );
                })}
                {downNodes.map((id, index) => {
                  const { x, y } = nodePos[id] ?? nodeView(id, "down", index, downNodes.length);
                  const rels = Array.from(new Set(NETWORK_EDGES.filter((e) => e.from === focus && e.to === id).map((e) => e.rel)));
                  const color = REL_COLORS[rels[0]] ?? "#78877D";
                  const label = rels.map((r) => (isZh ? r : REL_LABELS[r]?.en ?? r)).join(" · ");
                  return (
                    <g key={`${id}-edge`}>
                      <line x1={focusPos.x} y1={focusPos.y} x2={x} y2={y} stroke={color} strokeWidth={1.5} opacity={0.45} />
                      <text x={(focusPos.x + x) / 2} y={(focusPos.y + y) / 2 - 5} textAnchor="middle" className={`industry-network-edge-label${downNodes.length > 10 ? " dense" : ""}`} fill={color}>{label}</text>
                    </g>
                  );
                })}
                {upNodes.map((id, index) => {
                  const { x, y, entity, dense } = nodeView(id, "up", index, upNodes.length);
                  const p = nodePos[id] ?? { x, y };
                  return <NodeCircle key={id} id={id} x={p.x} y={p.y} label={isZh ? entity.short : entity.en.split(" ")[0]} dense={dense} dragRef={dragRef} movedRef={movedRef} onMove={moveNode} onClick={() => { setFocus(id); setActiveEdgeId(null); }} />;
                })}
                {downNodes.map((id, index) => {
                  const { x, y, entity, dense } = nodeView(id, "down", index, downNodes.length);
                  const p = nodePos[id] ?? { x, y };
                  return <NodeCircle key={id} id={id} x={p.x} y={p.y} label={isZh ? entity.short : entity.en.split(" ")[0]} dense={dense} dragRef={dragRef} movedRef={movedRef} onMove={moveNode} onClick={() => { setFocus(id); setActiveEdgeId(null); }} />;
                })}
                <NodeCircle id={focus} x={focusPos.x} y={focusPos.y} label={isZh ? focusEntity?.short ?? focus : focusEntity?.en.split(" ")[0] ?? focus} main dragRef={dragRef} movedRef={movedRef} onMove={moveNode} onClick={() => undefined} />
              </svg>
            </div>
            <div className="industry-network-legend">
              {Object.entries(REL_COLORS).map(([rel, color]) => (
                <span key={rel}><i style={{ background: color }} />{isZh ? rel : REL_LABELS[rel]?.en ?? rel}</span>
              ))}
            </div>
          </section>

          <section className="industry-network-cards" aria-label={isZh ? "上下游关系列表" : "Upstream / downstream list"}>
            <div className="industry-network-col">
              <div className="industry-network-col-head"><span>{isZh ? "上游" : "Upstream"}</span><small>{isZh ? "给它供货 / 投资 / 供电的公司" : "Suppliers, investors and power providers"}</small></div>
              <EdgeList edges={visibleEdges.up} side="up" lang={lang} onOpen={setActiveEdgeId} />
            </div>
            <div className="industry-network-col">
              <div className="industry-network-col-head"><span>{isZh ? "下游" : "Downstream"}</span><small>{isZh ? "它给谁供货 / 投资 / 托管" : "Customers, tenants and partners"}</small></div>
              <EdgeList edges={visibleEdges.down} side="down" lang={lang} onOpen={setActiveEdgeId} />
            </div>
          </section>
        </div>

        <button type="button" className="industry-network-mobile-graph-toggle" onClick={() => setShowGraph((v) => !v)}>
          {showGraph ? (isZh ? "收起图谱" : "Hide graph") : (isZh ? "查看图谱" : "View graph")}
        </button>

        <footer className="industry-network-foot">
          <p>{isZh ? `数据来自公司披露与公开报道 · 估算仅供参考，非公司披露 · 更新于 ${stats.updatedAt}` : `Data from company disclosures and public reports · estimates are indicative only · updated ${stats.updatedAt}`}</p>
        </footer>
      </div>

      {activeEdge && activeEdgeAmount && (
        <div className="industry-network-drawer-wrap">
          <button type="button" className="industry-network-drawer-scrim" aria-label={isZh ? "关闭详情" : "Close"} onClick={() => setActiveEdgeId(null)} />
          <aside className="industry-network-drawer" aria-label={isZh ? "关系详情" : "Relationship detail"}>
            <header>
              <span>{edgeTitle(activeEdge, lang)}</span>
              <button type="button" onClick={() => setActiveEdgeId(null)}>{isZh ? "关闭" : "Close"}</button>
            </header>
            <dl>
              <div><dt>{isZh ? "关系" : "Relationship"}</dt><dd>{isZh ? `${NETWORK_ENTITIES[activeEdge.from]?.name ?? activeEdge.from} ${activeEdge.rel} ${NETWORK_ENTITIES[activeEdge.to]?.name ?? activeEdge.to}` : `${NETWORK_ENTITIES[activeEdge.from]?.en ?? activeEdge.from} → ${NETWORK_ENTITIES[activeEdge.to]?.en ?? activeEdge.to} · ${REL_LABELS[activeEdge.rel]?.en ?? activeEdge.rel}`}</dd></div>
              <div><dt>{isZh ? "具体内容" : "Detail"}</dt><dd>{activeEdge.detail}</dd></div>
              <div className={`industry-network-amount amount-${activeEdgeAmount.kind}`}>
                <dt>{isZh ? "金额" : "Amount"}</dt>
                <dd>
                  <strong>{activeEdgeAmount.text}</strong>
                  {activeEdgeAmount.kind === "estimated" && <small>{activeEdgeAmount.hint}{activeEdgeAmount.method ? ` · ${activeEdgeAmount.method}` : ""}</small>}
                  {activeEdgeAmount.kind === "disclosed" && <small>{activeEdgeAmount.hint}</small>}
                </dd>
              </div>
              <div><dt>{isZh ? "时间" : "Observed"}</dt><dd>{dateLabel(activeEdge.observed, lang)}</dd></div>
              <div><dt>{isZh ? "进展" : "Stage"}</dt><dd>{activeEdge.ladder.slice(0, activeEdge.status + 1).join(" → ")}</dd></div>
              <div><dt>{isZh ? "来源" : "Source"}</dt><dd><b>{evidenceText(activeEdge.evidence, lang)}</b> · {activeEdge.source}</dd></div>
            </dl>
          </aside>
        </div>
      )}
    </IntelligenceConsoleShell>
  );
}

function NodeCircle({ id, x, y, label, main, dense, dragRef, movedRef, onMove, onClick }: {
  id: string;
  x: number;
  y: number;
  label: string;
  main?: boolean;
  dense?: boolean;
  dragRef: MutableRefObject<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>;
  movedRef: MutableRefObject<boolean>;
  onMove: (id: string, x: number, y: number) => void;
  onClick: () => void;
}) {
  const startDrag = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    movedRef.current = false;
    dragRef.current = { id, startX: event.clientX, startY: event.clientY, origX: x, origY: y };
  };
  const moveDrag = (event: ReactPointerEvent<SVGGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const sx = SVG_W / rect.width;
    const sy = SVG_H / rect.height;
    const nx = drag.origX + (event.clientX - drag.startX) * sx;
    const ny = drag.origY + (event.clientY - drag.startY) * sy;
    if (Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) > 4) movedRef.current = true;
    onMove(id, nx, ny);
  };
  return (
    <g
      className={main ? "industry-network-node main" : "industry-network-node"}
      onClick={() => { if (movedRef.current) { movedRef.current = false; return; } onClick(); }}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => { dragRef.current = null; }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onClick(); }}
      aria-label={label}
    >
      <circle cx={x} cy={y} r={main ? 32 : dense ? 20 : 26} />
      <text x={x} y={y + 4} textAnchor="middle" className={dense ? "dense" : ""}>{label}</text>
    </g>
  );
}

function EdgeList({ edges, side, lang, onOpen }: { edges: NetworkEdge[]; side: "up" | "down"; lang: "zh" | "en"; onOpen: (id: string) => void }) {
  const isZh = lang === "zh";
  return (
    <div className="industry-network-edge-list">
      {edges.map((edge) => {
        const counterpartId = side === "up" ? edge.from : edge.to;
        const counterpart = NETWORK_ENTITIES[counterpartId];
        const amount = amountLine(edge, lang);
        return (
          <button type="button" key={edge.id} className="industry-network-edge-card" onClick={() => onOpen(edge.id)}>
            <div className="industry-network-edge-card-top">
              <strong>{isZh ? counterpart?.name ?? counterpartId : counterpart?.en ?? counterpartId}</strong>
              <span className={`industry-network-evidence ev-${edge.evidence}`}>{evidenceText(edge.evidence, lang)}</span>
            </div>
            <p>{edge.detail}</p>
            <div className="industry-network-edge-card-bottom">
              <span className={`industry-network-amount-pill pill-${amount.kind}`}>{amount.text}</span>
              <time>{dateLabel(edge.observed, lang)}</time>
            </div>
          </button>
        );
      })}
      {!edges.length && <p className="industry-network-empty">{isZh ? "当前筛选下没有关系。" : "No relationships under the current filter."}</p>}
    </div>
  );
}
