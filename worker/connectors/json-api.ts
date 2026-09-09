import { fetchWithRetries, readTextLimited, responseHeaders } from "./http.ts";
import type { ConnectorFetchOptions, ConnectorResult, ObservationEnvelope, SourceDefinition } from "./types.ts";

type JsonApiMapping = {
  maximumTextLength?: number;
  urlFromItem?: (item: unknown) => string | null;
  itemsPath?: string;
  titlePath?: string;
  summaryPath?: string;
  urlPath?: string;
  publishedAtPath?: string;
  idPath?: string;
  authorPath?: string;
  language?: string;
  accessStatus?: ObservationEnvelope["accessStatus"];
  eventType?: string;
};

function valueAt(input: unknown, path: string | undefined): unknown {
  if (!path) return input;
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, input);
}

function stringAt(input: unknown, path: string | undefined): string | null {
  const value = valueAt(input, path);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function inferEntities(text: string): string[] {
  const known = ["NVIDIA", "AMD", "Microsoft", "Amazon", "Google", "Meta", "OpenAI", "Anthropic", "FERC", "EPA", "FCC", "DOE", "ERCOT", "PJM"];
  return known.filter((name) => text.toLowerCase().includes(name.toLowerCase()));
}

export async function fetchJsonApi(
  source: SourceDefinition,
  mapping: JsonApiMapping = {},
  options: ConnectorFetchOptions = {},
): Promise<ConnectorResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const { response, responseMs } = await fetchWithRetries(source.endpoint.url, options);
    const headers = responseHeaders(response);
    if (response.status === 304) return { status: "not-modified", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 304, responseMs, ...headers, observations: [] };
    if (response.status === 401 || response.status === 403 || response.status === 429) {
      return { status: "blocked", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    }
    if (!response.ok) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    const payload: unknown = source.id === "serenity-archive"
      ? JSON.parse(await readTextLimited(response, 16_000_000))
      : await response.json();
    const rawItems = valueAt(payload, mapping.itemsPath ?? "") ?? payload;
    if (!Array.isArray(rawItems)) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: "JSON item array missing" };
    const observations = rawItems.flatMap((item): ObservationEnvelope[] => {
      const originalTitle = stringAt(item, mapping.titlePath ?? "title") ?? stringAt(item, "title") ?? stringAt(item, "name");
      const title = originalTitle?.slice(0, mapping.maximumTextLength);
      const originalUrl = mapping.urlFromItem?.(item) ?? stringAt(item, mapping.urlPath ?? "html_url") ?? stringAt(item, "url") ?? stringAt(item, "links.html");
      if (!title || !originalUrl) return [];
      const summary = stringAt(item, mapping.summaryPath ?? "abstract") ?? stringAt(item, "summary") ?? stringAt(item, "description") ?? "";
      const published = stringAt(item, mapping.publishedAtPath ?? "publication_date") ?? stringAt(item, "published_at") ?? stringAt(item, "updated_at");
      const entityText = `${title} ${summary}`;
      return [{
        sourceId: source.id,
        endpointId: source.endpoint.id,
        canonicalUrl: originalUrl,
        originalUrl,
        externalId: stringAt(item, mapping.idPath ?? "document_number") ?? stringAt(item, "id"),
        titleOriginal: title,
        summaryOriginal: summary.slice(0, mapping.maximumTextLength ?? 800),
        language: mapping.language ?? source.language,
        author: stringAt(item, mapping.authorPath ?? "author"),
        publishedAt: published && Number.isFinite(Date.parse(published)) ? new Date(published).toISOString() : null,
        discoveredAt: fetchedAt,
        fetchedAt,
        rawPayload: { title, summary: summary.slice(0, mapping.maximumTextLength ?? 800), originalUrl, publishedAt: published },
        accessStatus: mapping.accessStatus ?? "public-api",
        eventType: mapping.eventType ?? "json-api-update",
        entities: inferEntities(entityText),
        topics: source.topics,
      }];
    });
    return { status: "ok", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations, error: observations.length ? undefined : "No parseable JSON items" };
  } catch (error) {
    return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: error instanceof Error ? error.message : String(error) };
  }
}
