import type { ColumnArticle } from "./columns/articles";
import type { ConsoleOverviewData, ConsoleStory } from "./intelligence-console-overview";

export type DeskRecord = {
  impactLevel?: "high" | "material"; eventKey?: string; id: string; kind: "fact" | "research" | "media"; title: string; summary: string;
  date: string; source: string; href: string; sourceHref?: string; image?: string;
  region?: string; category?: string; response?: string; evidence?: string;
  details?: Array<{ heading: string; body: string }>;
};
export function researchRecord(article: ColumnArticle, lang: "zh" | "en"): DeskRecord {
  return { id: article.href, kind: "research", title: lang === "zh" ? article.title : article.titleEn,
    summary: lang === "zh" ? article.summary : article.summaryEn, date: article.publishAt,
    source: "IDC Atlas", href: lang === "zh" ? article.href : article.hrefEn, image: article.image, category: article.series.split(" · ")[0] };
}
export function buildDeskRecords(data: ConsoleOverviewData, articles: ColumnArticle[], lang: "zh" | "en", translate?: (story: ConsoleStory) => ConsoleStory & {displayTitle?: string; displaySummary?: string}): DeskRecord[] {
  const facts = new Map<string, DeskRecord>();
  for (const original of [...data.pulse, ...data.companies]) {
    const story = translate?.(original) ?? original;
    const translated = story as ConsoleStory & {displayTitle?: string; displaySummary?: string};
    const href = story.sourceUrl || story.permalink;
    if (!href) continue;
    const identity = story.eventKey ? `event:${story.eventKey}` : `${href}#${story.id}`;
    // Only merge exact duplicate records; sharing a company or source is not the same event.
    if (facts.has(identity)) continue;
    facts.set(identity, {impactLevel:story.impactLevel,eventKey:story.eventKey,id:`fact:${story.id}`,kind:"fact", details: lang === "en" ? story.detailsEn : story.details, title: translated.displayTitle || (lang === "en" ? story.titleEn : story.title) || story.title,
      summary: translated.displaySummary || (lang === "en" ? story.summaryEn : story.summary) || "", date:story.publishedAt || "",source:story.sourceName || (lang === "zh" ? "公开披露" : "Public disclosure"),href,sourceHref:href,region:story.region,category:story.category || undefined});
  }
  const media: DeskRecord[] = (data.rumors || []).map(item => ({impactLevel:item.impactLevel,eventKey:item.eventKey,id:`media:${item.id}`,kind:"media", title:lang === "zh" ? item.title : item.titleEn,summary:lang === "zh" ? item.summary : item.summaryEn,date:item.publishedAt,source:item.sourceName,href:item.sourceUrl || (lang === "zh" ? "/rumors" : "/en/rumors"),sourceHref:item.sourceUrl,region:item.region,response:lang === "zh" ? item.officialResponse : item.officialResponseEn,evidence:lang === "zh" ? (item.sourceCount >= 2 ? "媒体 · 多源" : "媒体 · 单一来源") : (item.sourceCount >= 2 ? "Media · multiple sources" : "Media · single source")}));
  const eventKeys = new Set<string>();
  const uniqueEvents = [...facts.values(), ...media].filter(record => {
    if (!record.eventKey) return true;
    if (eventKeys.has(record.eventKey)) return false;
    eventKeys.add(record.eventKey); return true;
  });
  return [...uniqueEvents, ...articles.map(a => researchRecord(a,lang))].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0)||a.id.localeCompare(b.id));
}

export function featuredDeskIds(records: DeskRecord[]): Set<string> {
  return new Set(records.filter(record => record.kind === 'research' || record.impactLevel === 'high' || record.impactLevel === 'material').map(record => record.id));
}
