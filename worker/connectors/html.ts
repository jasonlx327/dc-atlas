import { fetchWithRetries, readTextLimited, responseHeaders } from "./http.ts";
import type { ConnectorFetchOptions, ConnectorResult, ObservationEnvelope, SourceDefinition } from "./types.ts";

function decode(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function meta(html: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const first = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"));
  const reversed = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"));
  return decode(first?.[1] ?? reversed?.[1] ?? "") || null;
}

function canonical(html: string, fallback: string): string {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  return decode(match?.[1] ?? fallback);
}

function pageObservation(source: SourceDefinition, html: string, fetchedAt: string): ObservationEnvelope[] {
  const title = meta(html, "og:title") ?? decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!title) return [];
  const summary = meta(html, "og:description") ?? meta(html, "description") ?? "";
  const published = meta(html, "article:published_time");
  const url = canonical(html, source.endpoint.url);
  return [{
    sourceId: source.id,
    endpointId: source.endpoint.id,
    canonicalUrl: url,
    originalUrl: source.endpoint.url,
    titleOriginal: title,
    summaryOriginal: summary.slice(0, 800),
    language: source.language,
    publishedAt: published && Number.isFinite(Date.parse(published)) ? new Date(published).toISOString() : null,
    discoveredAt: fetchedAt,
    fetchedAt,
    rawPayload: { sourceName: source.name, parser: "html-metadata", title, summary: summary.slice(0, 800) },
    accessStatus: "public",
    eventType: source.topics.includes("policy") ? "policy" : "html-update",
    topics: source.topics,
  }];
}

function dateNear(html: string, start: number, end: number): string | null {
  const context = decode(html.slice(Math.max(0, start - 120), Math.min(html.length, end + 160)));
  const match = context.match(/(?:20\d{2})[-/.年](?:1[0-2]|0?[1-9])[-/.月](?:3[01]|[12]\d|0?[1-9])日?(?!\d)/);
  if (!match) return null;
  const parsed = Date.parse(match[0].replace(/年|\//g, "-").replace(/月/g, "-").replace(/日/g, ""));
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function listObservations(source: SourceDefinition, html: string, fetchedAt: string): ObservationEnvelope[] {
  const observations: ObservationEnvelope[] = [];
  const seen = new Set<string>();
  const anchors = html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of anchors) {
    const title = decode(match[2] ?? "");
    if (title.length < 8 || title.length > 260 || /^(?:首页|更多|详情|查看详细|Home|Learn more|Read more)$/i.test(title)) continue;
    let url: string;
    try {
      url = new URL(decode(match[1] ?? ""), source.endpoint.url).toString();
    } catch {
      continue;
    }
    if (!/^https?:/i.test(url) || seen.has(url)) continue;
    seen.add(url);
    const start = match.index ?? 0;
    const end = start + match[0].length;
    observations.push({
      sourceId: source.id,
      endpointId: source.endpoint.id,
      canonicalUrl: url,
      originalUrl: source.endpoint.url,
      externalId: url,
      titleOriginal: title,
      summaryOriginal: "",
      language: source.language,
      publishedAt: dateNear(html, start, end),
      discoveredAt: fetchedAt,
      fetchedAt,
      rawPayload: { sourceName: source.name, parser: "official-list-html", title },
      accessStatus: "public",
      eventType: source.topics.includes("policy") ? "policy" : "html-update",
      topics: source.topics,
    });
    if (observations.length >= 40) break;
  }
  return observations;
}

export async function fetchHtmlMetadata(source: SourceDefinition, options: ConnectorFetchOptions = {}): Promise<ConnectorResult> {
  const fetchedAt = new Date().toISOString();
  if (source.endpoint.parserKey === "licensed-html") {
    return { status: "blocked", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: "Licensed HTML requires an authorized feed or manually supplied public URL" };
  }
  try {
    const { response, responseMs } = await fetchWithRetries(source.endpoint.url, { ...options, accept: "text/html,application/xhtml+xml" });
    const headers = responseHeaders(response);
    if (response.status === 304) return { status: "not-modified", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 304, responseMs, ...headers, observations: [] };
    if (response.status === 401 || response.status === 403 || response.status === 429) return { status: "blocked", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    if (!response.ok) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    const html = await readTextLimited(response);
    const observations = source.endpoint.parserKey === "official-list-html"
      ? listObservations(source, html, fetchedAt)
      : pageObservation(source, html, fetchedAt);
    return observations.length
      ? { status: "ok", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations }
      : { status: "parse-error", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations, error: "No public metadata title was parseable" };
  } catch (error) {
    return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: error instanceof Error ? error.message : String(error) };
  }
}
