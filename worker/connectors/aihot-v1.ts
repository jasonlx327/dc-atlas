import { fetchWithRetries, responseHeaders } from "./http.ts";
import type { ConnectorFetchOptions, ConnectorResult, ObservationEnvelope, SourceDefinition } from "./types.ts";

const AIHOT_BASE = "https://aihot.virxact.com";
const AIHOT_USER_AGENT = "aihot-skill/1.2.2 (+https://aihot.virxact.com/aihot-skill/)";

type AihotItem = Record<string, unknown>;

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function inferEntities(text: string): string[] {
  const known = ["OpenAI", "Anthropic", "Google", "Microsoft", "Amazon", "Meta", "NVIDIA", "AMD", "Intel", "Micron", "DeepSeek", "xAI", "Grok", "SpaceX", "SpaceXAI", "阿里云", "华为", "百度", "腾讯", "字节跳动"];
  return known.filter((name) => text.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
}

function parseAihotItems(source: SourceDefinition, items: unknown[], fetchedAt: string): ObservationEnvelope[] {
  return items.flatMap((raw): ObservationEnvelope[] => {
    const item = objectValue(raw) as AihotItem | null;
    if (!item) return [];
    const title = stringValue(item.title);
    const links = objectValue(item.links);
    const aihotUrl = stringValue(links?.aihot);
    const originalUrl = stringValue(links?.original) ?? aihotUrl;
    const discoveredAt = stringValue(item.discoveredAt) ?? fetchedAt;
    if (!title || !originalUrl || !aihotUrl) return [];
    const summary = stringValue(item.summary) ?? "";
    const sourceObject = objectValue(item.source);
    const sourceName = stringValue(sourceObject?.name) ?? "AI HOT";
    const text = `${title} ${summary}`;
    const publishedAt = stringValue(item.publishedAt);
    return [{
      sourceId: source.id,
      endpointId: source.endpoint.id,
      canonicalUrl: originalUrl,
      originalUrl,
      externalId: stringValue(item.id),
      titleOriginal: title,
      summaryOriginal: summary.slice(0, 800),
      language: source.language,
      author: sourceName,
      publishedAt: publishedAt && Number.isFinite(Date.parse(publishedAt)) ? new Date(publishedAt).toISOString() : null,
      discoveredAt: Number.isFinite(Date.parse(discoveredAt)) ? new Date(discoveredAt).toISOString() : fetchedAt,
      fetchedAt,
      rawPayload: {
        id: stringValue(item.id),
        title,
        originalTitle: stringValue(item.originalTitle),
        summary: summary.slice(0, 800),
        source: sourceName,
        links: { aihot: aihotUrl, original: stringValue(links?.original) },
        publishedAt,
        discoveredAt,
        category: stringValue(item.category),
        selected: item.selected === true,
      },
      accessStatus: "public-api",
      eventType: stringValue(item.category) ?? "aihot-discovery",
      entities: inferEntities(text),
      topics: source.topics,
    }];
  });
}

export async function fetchAihotItems(
  source: SourceDefinition,
  options: ConnectorFetchOptions & { mode?: "selected" | "all"; window?: "24h" | "7d"; query?: string; limit?: number } = {},
): Promise<ConnectorResult> {
  const fetchedAt = new Date().toISOString();
  const url = new URL(`${AIHOT_BASE}/api/v1/items`);
  url.searchParams.set("mode", options.mode ?? "selected");
  url.searchParams.set("window", options.window ?? "24h");
  url.searchParams.set("limit", String(options.limit ?? 50));
  if (options.query) url.searchParams.set("q", options.query);
  try {
    const { response, responseMs } = await fetchWithRetries(url.toString(), { ...options, userAgent: options.userAgent ?? AIHOT_USER_AGENT });
    const headers = responseHeaders(response);
    if (response.status === 304) return { status: "not-modified", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 304, responseMs, ...headers, observations: [] };
    if (!response.ok) return { status: response.status === 429 ? "blocked" : "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `AI HOT v1 HTTP ${response.status}` };
    const payload = objectValue(await response.json());
    if (!payload || !Array.isArray(payload.items)) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: "AI HOT v1 items missing" };
    const observations = parseAihotItems(source, payload.items, fetchedAt);
    return { status: observations.length ? "ok" : "empty", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations };
  } catch (error) {
    return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export async function fetchAihotDailyLatest(
  source: SourceDefinition,
  options: ConnectorFetchOptions = {},
): Promise<ConnectorResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const { response, responseMs } = await fetchWithRetries(`${AIHOT_BASE}/api/v1/dailies/latest`, { ...options, userAgent: options.userAgent ?? AIHOT_USER_AGENT });
    const headers = responseHeaders(response);
    if (response.status === 304) return { status: "not-modified", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 304, responseMs, ...headers, observations: [] };
    if (response.status === 404) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 404, responseMs, ...headers, observations: [], error: "AI HOT latest daily not found; bounded archive fallback required" };
    if (!response.ok) return { status: response.status === 429 ? "blocked" : "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `AI HOT daily HTTP ${response.status}` };
    const payload = objectValue(await response.json());
    const report = objectValue(payload?.report);
    if (!report) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: "AI HOT daily report missing" };
    const sections = Array.isArray(report.sections) ? report.sections : [];
    const flashes = Array.isArray(report.flashes) ? report.flashes : [];
    const observations = parseAihotItems(source, [report.lead, ...sections.flatMap((section) => objectValue(section)?.items ?? []), ...flashes], fetchedAt);
    return { status: "ok", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations, error: observations.length ? undefined : "AI HOT daily contained no parseable items" };
  } catch (error) {
    return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: error instanceof Error ? error.message : String(error) };
  }
}
