"use client";

import { NETWORK_EDGES, NETWORK_ENTITIES, estimateFor, type NetworkEdge } from "./industry-network-data";

export function networkIdForProfile(slug: string): string | undefined {
  const hit = Object.values(NETWORK_ENTITIES).find((entity) => entity.profileSlug === slug);
  if (hit) return hit.id;
  return Object.keys(NETWORK_ENTITIES).find((id) => id === slug);
}

function amountShort(edge: NetworkEdge, lang: "zh" | "en") {
  if (edge.amount !== null) return { text: edge.amount, kind: "disclosed" as const };
  const est = estimateFor(edge.from, edge.to, edge.rel);
  if (est) return { text: lang === "zh" ? `${est.range}（估算）` : `${est.range} (est.)`, kind: "estimated" as const };
  return { text: lang === "zh" ? "暂未公开" : "Not public", kind: "empty" as const };
}

function evidenceWord(evidence: NetworkEdge["evidence"], lang: "zh" | "en") {
  const map: Record<string, string> = lang === "zh" ? { official: "官方", management: "管理层", media: "媒体" } : { official: "Official", management: "Management", media: "Media" };
  return map[evidence];
}

export default function IndustryNetworkMini({ slug, lang }: { slug: string; lang: "zh" | "en" }) {
  const isZh = lang === "zh";
  const networkId = networkIdForProfile(slug);
  if (!networkId) {
    return <p className="atlas-entity-empty">{isZh ? "这家公司暂未收录进产业链信息网。" : "This company is not yet in the industry network."}</p>;
  }
  const up = NETWORK_EDGES.filter((edge) => edge.to === networkId).slice(0, 5);
  const down = NETWORK_EDGES.filter((edge) => edge.from === networkId).slice(0, 5);
  const networkHref = lang === "zh" ? `/industry-network?focus=${networkId}` : `/en/industry-network?focus=${networkId}`;

  function renderList(edges: NetworkEdge[], side: "up" | "down") {
    if (!edges.length) return <p className="atlas-entity-empty">{isZh ? "暂未收录。" : "Not yet tracked."}</p>;
    return (
      <div className="atlas-entity-network-list">
        {edges.map((edge) => {
          const counterpartId = side === "up" ? edge.from : edge.to;
          const counterpart = NETWORK_ENTITIES[counterpartId];
          const amount = amountShort(edge, lang);
          return (
            <a href={`${networkHref}`} key={edge.id} className="atlas-entity-network-card">
              <div>
                <strong>{isZh ? counterpart?.name ?? counterpartId : counterpart?.en ?? counterpartId}</strong>
                <span className={`industry-network-evidence ev-${edge.evidence}`}>{evidenceWord(edge.evidence, lang)}</span>
              </div>
              <p>{edge.detail}</p>
              <small className={`industry-network-amount-pill pill-${amount.kind}`}>{amount.text}</small>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="atlas-entity-network">
      <div className="atlas-entity-network-cols">
        <div>
          <h3>{isZh ? "上游" : "Upstream"}</h3>
          <p>{isZh ? "谁在给它供货 / 投资 / 供电" : "Who supplies, invests in or powers it"}</p>
          {renderList(up, "up")}
        </div>
        <div>
          <h3>{isZh ? "下游" : "Downstream"}</h3>
          <p>{isZh ? "它给谁供货 / 投资 / 托管" : "Who it supplies, invests in or hosts"}</p>
          {renderList(down, "down")}
        </div>
      </div>
      <p className="atlas-entity-network-foot">
        {isZh ? "金额为已披露或基于公开资料估算 · 暂未公开的留白，不编造。" : "Amounts are disclosed or estimated from public data · unknown values are left blank, never invented."}
      </p>
    </div>
  );
}
