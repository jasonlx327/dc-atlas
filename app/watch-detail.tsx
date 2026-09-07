import { IntelligenceConsoleShell } from "./intelligence-console-overview";
import type { PolicyIndexRecord, RumorWatchItem } from "./watch-data";

type WatchKind = "policy" | "rumors";

type Props = {
  lang: "zh" | "en";
  kind: WatchKind;
  item: PolicyIndexRecord | RumorWatchItem;
  archived?: boolean;
};

function formatDate(value: string, lang: "zh" | "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    timeZone: lang === "zh" ? "Asia/Shanghai" : "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default function WatchDetail({ lang, kind, item, archived = false }: Props) {
  const isZh = lang === "zh";
  const isPolicy = kind === "policy";
  const canonical = `https://idc-index.com${isZh ? "" : "/en"}/${kind}/${item.id}`;
  const title = isZh ? item.title : item.titleEn;
  const summary = isZh ? item.summary : item.summaryEn;
  const indexHref = isZh ? `/${kind}` : `/en/${kind}`;
  const label = isPolicy
    ? (isZh ? "政策简报" : "POLICY BRIEF")
    : (isZh ? "媒体报道线索" : "REPORTED DEVELOPMENT");
  const pageLabel = isPolicy
    ? (isZh ? "政策证据存档" : "Policy evidence archive")
    : (isZh ? "全球情报台" : "Global Intelligence");
  const articleSection = isPolicy
    ? (isZh ? "数据中心政策" : "Data-center policy")
    : (isZh ? "基础设施报道监测" : "Infrastructure reporting watch");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: title,
        description: summary,
        abstract: summary,
        url: canonical,
        inLanguage: isZh ? "zh-CN" : "en",
        articleSection,
        datePublished: item.publishedAt,
        isAccessibleForFree: true,
        citation: item.sourceUrl,
        mentions: isPolicy ? undefined : (item as RumorWatchItem).entities.map((name) => ({ "@type": "Thing", name })),
        author: { "@type": "Organization", "@id": "https://idc-index.com/#organization", name: "IDC Atlas" },
        publisher: { "@type": "Organization", "@id": "https://idc-index.com/#organization", name: "IDC Atlas" },
        isPartOf: { "@type": "CollectionPage", "@id": `https://idc-index.com${isPolicy ? (isZh ? "/pulse" : "/en/pulse") : indexHref}` },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IDC Atlas", item: isZh ? "https://idc-index.com/" : "https://idc-index.com/en" },
          { "@type": "ListItem", position: 2, name: isPolicy ? (isZh ? "事实脉冲" : "Verified Pulse") : (isZh ? "全球情报台" : "Global Intelligence"), item: `https://idc-index.com${isPolicy ? (isZh ? "/pulse" : "/en/pulse") : indexHref}` },
          { "@type": "ListItem", position: 3, name: title, item: canonical },
        ],
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <IntelligenceConsoleShell
      lang={lang}
      activeSection={kind}
      sourceCount={1}
      verifiedCount={isPolicy ? 1 : 0}
      pageLabel={pageLabel}
      className={`atlas-watch-shell atlas-${kind}-shell`}
    >
      <article className={`watch-detail-page ${isPolicy ? "policy-detail" : "rumor-detail"}`}>
        <header className="watch-detail-hero">
          <a className="watch-detail-back" href={isPolicy ? (isZh ? "/pulse" : "/en/pulse") : indexHref}>← {isPolicy ? (isZh ? "返回事实脉冲" : "Back to Verified Pulse") : (isZh ? "返回全球情报台" : "Back to Global Intelligence")}</a>
          <div className="watch-detail-kicker"><span>{label}</span><time dateTime={item.publishedAt}>{formatDate(item.publishedAt, lang)}</time></div>
          <h1>{title}</h1>
          {archived && <aside className="watch-detail-boundary" data-rumor-archive="true">
            <strong>{isZh ? "历史报道" : "ARCHIVED REPORT"}</strong>
            <p>{isZh ? "以下内容保留原报道日期与当时的进展，不代表项目或交易的最新状态。" : "This report retains its original date and the developments recorded at that time. It does not describe the latest project or transaction status."}</p>
          </aside>}
          <p>{summary}</p>
          <div className="watch-detail-source"><span>{isZh ? "原始出处" : "PRIMARY SOURCE"}</span><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName} ↗</a></div>
        </header>

        {isPolicy ? <PolicyDetail lang={lang} item={item as PolicyIndexRecord} /> : <RumorDetail lang={lang} item={item as RumorWatchItem} />}

        <aside className="watch-detail-boundary">
          <strong>{isZh ? "阅读边界" : "READING BOUNDARY"}</strong>
          <p>{isPolicy
            ? (isZh ? "这是保留的政策证据摘要；IDC Atlas 不再单独运营政策索引。新的重大官方政策变化将进入事实脉冲或研究队列。本页不构成法律意见。" : "This is a retained policy evidence brief. IDC Atlas no longer operates a separate Policy Index; material official changes move to Verified Pulse or the research queue. This page is not legal advice.")
            : (isZh ? "这是一条按原始媒体归因公开的情报，不构成投资建议。一手确认不是可见性门槛；后续公司、监管或项目方材料会升级状态并转入对应事实板块。" : "This intelligence is published with attribution to the original media source and is not investment advice. Primary confirmation is not a visibility gate; later company, regulatory or project-owner material upgrades the status and moves it into the relevant fact section.")}</p>
        </aside>
      </article>
    </IntelligenceConsoleShell>
  </>;
}

function PolicyDetail({ lang, item }: { lang: "zh" | "en"; item: PolicyIndexRecord }) {
  const isZh = lang === "zh";
  return <section className="watch-detail-grid" aria-label={isZh ? "政策摘要" : "Policy brief"}>
    <div className="watch-detail-panel watch-detail-effect">
      <span>{isZh ? "直接影响" : "DIRECT EFFECT"}</span>
      <p>{isZh ? item.impact : item.impactEn}</p>
    </div>
    <dl className="watch-detail-facts">
      <div><dt>{isZh ? "政策范围" : "SCOPE"}</dt><dd>{isZh ? item.scope : item.scopeEn}</dd></div>
      <div><dt>{isZh ? "执行状态" : "STATUS"}</dt><dd>{isZh ? item.status : item.statusEn}</dd></div>
      <div><dt>{isZh ? "生效与复核" : "EFFECTIVE / REVIEW"}</dt><dd>{isZh ? item.effectiveLabel : item.effectiveLabelEn}</dd></div>
      <div><dt>{isZh ? "适用对象" : "WHO IT AFFECTS"}</dt><dd>{isZh ? item.affected : item.affectedEn}</dd></div>
    </dl>
  </section>;
}

function RumorDetail({ lang, item }: { lang: "zh" | "en"; item: RumorWatchItem }) {
  const isZh = lang === "zh";
  return <section className="watch-detail-grid" aria-label={isZh ? "报道边界" : "Reporting boundary"}>
    <div className="watch-detail-panel watch-detail-response">
      <span>{isZh ? "公开回应" : "PUBLIC RESPONSE"}</span>
      <p>{isZh ? item.officialResponse : item.officialResponseEn}</p>
    </div>
    <dl className="watch-detail-facts">
      <div><dt>{isZh ? "涉及主体" : "ENTITIES"}</dt><dd className="watch-detail-entities">{item.entities.map((entity) => <span key={entity}>{entity}</span>)}</dd></div>
      <div><dt>{isZh ? "报道状态" : "REPORTING STATUS"}</dt><dd>{isZh ? item.statusLabel : item.statusLabelEn}</dd></div>
    </dl>
  </section>;
}
