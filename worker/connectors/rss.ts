import { fetchWithRetries, readTextLimited, responseHeaders } from "./http.ts";
import type { ConnectorFetchOptions, ConnectorResult, ObservationEnvelope, SourceDefinition } from "./types.ts";

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function textOnly(value: string): string {
  return decodeEntities(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tag(block: string, name: string): string | null {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? textOnly(match[1]) : null;
}

function link(block: string): string | null {
  const atom = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i);
  if (atom?.[1]) return decodeEntities(atom[1].trim());
  return tag(block, "link") ?? tag(block, "guid") ?? tag(block, "id");
}

function inferEntities(text: string): string[] {
  const known = [
    "OpenAI", "Anthropic", "Google", "Microsoft", "Amazon", "Meta", "NVIDIA", "AMD", "Intel", "Micron", "SK hynix", "Samsung", "xAI", "Grok", "SpaceXAI",
    "CoreWeave", "Galaxy Digital", "Digital Realty", "Hut 8", "TeraWulf", "MARA", "ERCOT", "PJM", "FERC", "FCC", "DOE", "EPA",
  ];
  return known.filter((name) => new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));
}

function parseItems(source: SourceDefinition, xml: string, fetchedAt: string): ObservationEnvelope[] {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>[\s\S]*?<\/\1>/gi)].map((match) => match[0]);
  return blocks.flatMap((block): ObservationEnvelope[] => {
    const title = tag(block, "title");
    const originalUrl = link(block);
    if (!title || !originalUrl) return [];
    const summary = tag(block, "description") ?? tag(block, "summary") ?? tag(block, "content") ?? "";
    const publishedAt = tag(block, "pubDate") ?? tag(block, "published") ?? tag(block, "updated");
    const entityText = `${title} ${summary}`;
    return [{
      sourceId: source.id,
      endpointId: source.endpoint.id,
      canonicalUrl: originalUrl,
      originalUrl,
      externalId: tag(block, "guid") ?? tag(block, "id"),
      titleOriginal: title,
      summaryOriginal: summary.slice(0, 800),
      language: source.language,
      author: tag(block, "author") ?? tag(block, "dc:creator"),
      publishedAt: publishedAt && Number.isFinite(Date.parse(publishedAt)) ? new Date(publishedAt).toISOString() : null,
      discoveredAt: fetchedAt,
      fetchedAt,
      rawPayload: { title, summary: summary.slice(0, 800), originalUrl, publishedAt },
      accessStatus: "public",
      eventType: "rss-update",
      entities: inferEntities(entityText),
      topics: source.topics,
    }];
  });
}

export async function fetchRss(source: SourceDefinition, options: ConnectorFetchOptions = {}): Promise<ConnectorResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const { response, responseMs } = await fetchWithRetries(source.endpoint.url, { ...options, accept: "application/rss+xml, application/atom+xml, text/xml" });
    const headers = responseHeaders(response);
    if (response.status === 304) return { status: "not-modified", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: 304, responseMs, ...headers, observations: [] };
    if (response.status === 401 || response.status === 403 || response.status === 429) {
      return { status: "blocked", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    }
    if (!response.ok) return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations: [], error: `HTTP ${response.status}` };
    const xml = await readTextLimited(response);
    const observations = parseItems(source, xml, fetchedAt);
    const hasEntries = /<(?:item|entry)\b/i.test(xml);
    if (!observations.length && hasEntries) return { status: "parse-error", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations, error: "RSS/Atom entries were present but none were parseable" };
    if (!observations.length) return { status: "empty", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations };
    return { status: "ok", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, httpStatus: response.status, responseMs, ...headers, observations };
  } catch (error) {
    return { status: "failed", sourceId: source.id, endpointId: source.endpoint.id, fetchedAt, observations: [], error: error instanceof Error ? error.message : String(error) };
  }
}
