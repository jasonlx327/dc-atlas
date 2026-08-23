import { deriveContentVersion, latestContentChangedAt } from "./intelligence-model";

export type ConsoleMeta = {
  generatedAt?: string;
  reviewedAt?: string;
  contentVersion?: string;
  lastContentChangedAt?: string;
  factChangedAt?: string;
  researchPublishedAt?: string;
  briefPublishedAt?: string;
  sourceCount?: number;
  verifiedCount?: number;
};

type MetaRecord = Record<string, unknown>;

function records(value: unknown): MetaRecord[] {
  return Array.isArray(value) ? value.filter((item): item is MetaRecord => Boolean(item) && typeof item === "object") : [];
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function deriveConsoleMeta(payload: unknown): ConsoleMeta {
  if (!payload || typeof payload !== "object") return {};
  const data = payload as MetaRecord;
  const tracked = [...records(data.idcPulse), ...records(data.listedCompanyNews), ...records(data.mnaDeals)];
  const sources = new Set(tracked.map((item) => text(item.sourceName)).filter((value): value is string => Boolean(value)));
  const declaredSourceCount = typeof data.sourceCount === "number" ? data.sourceCount : undefined;
  const declaredVerifiedCount = typeof data.verifiedCount === "number" ? data.verifiedCount : undefined;
  return {
    generatedAt: text(data.generatedAt) ?? undefined,
    reviewedAt: text(data.contentReviewedAt) ?? undefined,
    contentVersion: deriveContentVersion(data),
    lastContentChangedAt: latestContentChangedAt(data),
    factChangedAt: text(data.factChangedAt) ?? latestContentChangedAt(data),
    researchPublishedAt: text(data.researchPublishedAt) ?? undefined,
    briefPublishedAt: text(data.briefPublishedAt) ?? undefined,
    sourceCount: declaredSourceCount ?? sources.size,
    verifiedCount: declaredVerifiedCount ?? tracked.length,
  };
}
