import type { ColumnArticle } from "./columns/articles";
import { currentDailyBriefRecord } from "./daily-briefs";
import { entityDirectory, type EntityRecord } from "./entity-directory";

export type ResearchState = "needs-follow-up" | "scheduled" | "published" | "no-research";

export type IntelligenceStory = {
  id: string;
  title: string;
  titleEn?: string;
  summary?: string;
  summaryEn?: string;
  publishedAt?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  permalink?: string;
  listedTicker?: string;
  category?: string | null;
  region?: string;
  score?: number | null;
  entityIds?: string[];
};

export type DailyBrief = {
  id: string;
  editionDate: string;
  publishedAt: string;
  article: ColumnArticle;
  selectedBecauseZh: string;
  selectedBecauseEn: string;
  relatedEntities: EntityRecord[];
  researchState: ResearchState;
};

function timestamp(value: unknown): number {
  if (typeof value !== "string") return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function recordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
}

export function latestContentChangedAt(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const data = payload as Record<string, unknown>;
  const explicit = [data.lastContentChangedAt, data.contentReviewedAt].find((value) => typeof value === "string") as string | undefined;
  const items = ["idcPulse", "listedCompanyNews", "mnaDeals", "rumors", "policyIndex"].flatMap((key) => recordArray(data[key]));
  const newest = items.map((item) => [item.publishedAt, item.announcedAt, item.updatedAt].find((value) => typeof value === "string") as string | undefined)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => timestamp(b) - timestamp(a))[0];
  if (!explicit) return newest;
  if (!newest) return explicit;
  return timestamp(newest) > timestamp(explicit) ? newest : explicit;
}

export function deriveContentVersion(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const data = payload as Record<string, unknown>;
  if (typeof data.contentVersion === "string" && data.contentVersion.trim()) return data.contentVersion;
  const changedAt = latestContentChangedAt(data);
  if (!changedAt) return undefined;
  const counts = ["idcPulse", "listedCompanyNews", "mnaDeals", "rumors"].map((key) => recordArray(data[key]).length).join("-");
  return `${changedAt}::${counts}`;
}

export function shouldAdoptPayload(current: unknown, next: unknown): boolean {
  if (!next || typeof next !== "object") return false;
  if (!current || typeof current !== "object") return true;
  const currentData = current as Record<string, unknown>;
  const nextData = next as Record<string, unknown>;
  const trackedCount = (data: Record<string, unknown>) => ["idcPulse", "listedCompanyNews", "mnaDeals", "rumors"].reduce((sum, key) => sum + recordArray(data[key]).length, 0);
  if (trackedCount(nextData) > trackedCount(currentData)) return true;
  const currentChanged = latestContentChangedAt(current);
  const nextChanged = latestContentChangedAt(next);
  if (!currentChanged) return true;
  if (!nextChanged) return false;
  if (timestamp(nextChanged) !== timestamp(currentChanged)) return timestamp(nextChanged) > timestamp(currentChanged);
  return deriveContentVersion(next) !== deriveContentVersion(current);
}

export function sortNewest<T extends { publishedAt?: string | null }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => timestamp(b.publishedAt) - timestamp(a.publishedAt));
}

function normalized(value: string | null | undefined): string {
  return (value ?? "").trim().toLocaleLowerCase();
}

function compileTerm(term: string): string | RegExp {
  const needle = normalized(term);
  if (/^[a-z0-9.]{2,12}$/.test(needle)) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`);
  }
  return needle;
}

// Versioned public directory only: no per-request data or I/O is retained.
const entityMatchers = entityDirectory.map((entity) => ({
  entity,
  ticker: normalized(entity.ticker),
  terms: [...new Set([entity.name, entity.nameEn, entity.ticker, ...entity.aliases]
    .filter((value): value is string => Boolean(value)).map(normalized))].map(compileTerm),
}));
const entityBySlug = new Map(entityDirectory.map((entity) => [entity.slug, entity]));

function matchesTerms(text: string, terms: readonly (string | RegExp)[]): boolean {
  return terms.some((term) => typeof term === "string" ? Boolean(term) && text.includes(term) : term.test(text));
}

export function storyEntities(story: IntelligenceStory): EntityRecord[] {
  if (story.entityIds?.length) {
    const explicit = story.entityIds.map((slug) => entityBySlug.get(slug)).filter((entity): entity is EntityRecord => Boolean(entity));
    if (explicit.length) return explicit;
  }
  const ticker = normalized(story.listedTicker);
  if (ticker) {
    const exactTicker = entityMatchers.find((matcher) => matcher.ticker && (ticker === matcher.ticker || ticker.includes(matcher.ticker)));
    if (exactTicker) return [exactTicker.entity];
  }
  const haystack = normalized(`${story.title} ${story.titleEn ?? ""} ${story.summary ?? ""} ${story.summaryEn ?? ""} ${story.sourceName ?? ""} ${story.listedTicker ?? ""}`);
  return entityMatchers.filter((matcher) => matchesTerms(haystack, matcher.terms)).map((matcher) => matcher.entity);
}

export function entityStories<T extends IntelligenceStory>(entity: EntityRecord, stories: readonly T[]): T[] {
  return sortNewest(stories.filter((story) => storyEntities(story).some((candidate) => candidate.slug === entity.slug)));
}

export function articleEntities(article: ColumnArticle): EntityRecord[] {
  const haystack = normalized(`${article.title} ${article.titleEn} ${article.summary} ${article.summaryEn}`);
  return entityMatchers.filter(({ entity, terms }) => entity.columnSlugs.some((slug) => article.href.endsWith(`/${slug}`)) || matchesTerms(haystack, terms)).map(({ entity }) => entity);
}

export function relatedResearch(entity: EntityRecord, articles: readonly ColumnArticle[]): ColumnArticle[] {
  const matcher = entityMatchers.find((candidate) => candidate.entity.slug === entity.slug);
  if (!matcher) return [];
  return articles.filter((article) => matcher.entity.columnSlugs.some((slug) => article.href.endsWith(`/${slug}`))
    || matchesTerms(normalized(`${article.title} ${article.titleEn} ${article.summary} ${article.summaryEn}`), matcher.terms));
}

export function researchStateForStory(story: IntelligenceStory, articles: readonly ColumnArticle[]): ResearchState {
  const entities = storyEntities(story);
  if (!entities.length) return "no-research";
  if (entities.some((entity) => relatedResearch(entity, articles).length > 0)) return "published";
  const ageHours = story.publishedAt ? (Date.now() - timestamp(story.publishedAt)) / 3_600_000 : Number.POSITIVE_INFINITY;
  return ageHours <= 72 ? "needs-follow-up" : "scheduled";
}

export function buildDailyBrief(articles: readonly ColumnArticle[]): DailyBrief | null {
  const record = currentDailyBriefRecord();
  const selected = articles.find((article) => article.href === record?.articleHref) ?? articles[0];
  if (!selected) return null;
  return {
    id: record?.id ?? `latest-${selected.date}`,
    editionDate: record?.editionDate ?? selected.date,
    publishedAt: record?.publishedAt ?? selected.publishAt,
    article: selected,
    selectedBecauseZh: record?.selectedBecauseZh ?? "这是当前事实变化、公司影响与后续验证点最完整的一篇分析。",
    selectedBecauseEn: record?.selectedBecauseEn ?? "This analysis best connects the current fact change, company impact and next checkpoint.",
    relatedEntities: articleEntities(selected),
    researchState: "published",
  };
}

export function nextCheckpoint(entity: EntityRecord, lang: "zh" | "en"): string {
  const zh = entity.category.includes("电力") || entity.category.includes("IDC")
    ? "下一份公司披露、送电或交付节点"
    : entity.category.includes("存储") || entity.category.includes("GPU") || entity.category.includes("CPU")
      ? "下一次产品、客户验证或产能披露"
      : "下一份财报、监管文件或正式公告";
  if (lang === "zh") return zh;
  if (zh.includes("送电")) return "Next company disclosure, energization or delivery milestone";
  if (zh.includes("产品")) return "Next product, customer-validation or capacity disclosure";
  return "Next earnings release, filing or official announcement";
}
