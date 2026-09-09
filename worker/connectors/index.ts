import { fetchAihotItems } from "./aihot-v1.ts";
import { fetchJsonApi } from "./json-api.ts";
import { fetchHtmlMetadata } from "./html.ts";
import { fetchRss } from "./rss.ts";
import type { ConnectorFetchOptions, ConnectorResult, SourceDefinition } from "./types.ts";

export { sourceRegistry, sourceRegistryById, shadowSources } from "./registry.ts";
export { CONNECTOR_CONTRACT_VERSION } from "./types.ts";
export type * from "./types.ts";

export async function fetchRegisteredSource(source: SourceDefinition, options: ConnectorFetchOptions = {}): Promise<ConnectorResult> {
  if (source.endpoint.type === "aihot") return fetchAihotItems(source, { ...options, mode: "all", window: "24h", limit: 100 });
  if (source.id === "aihot-discovery" && source.endpoint.type !== "rss") return fetchAihotItems(source, { ...options, mode: "all", window: "24h", limit: 100 });
  if (source.endpoint.type === "json-api") {
    if (source.id === "serenity-archive") {
      return fetchJsonApi(source, { titlePath: "text", summaryPath: "text", urlPath: "sourceUrl", publishedAtPath: "createdAtISO", idPath: "id", authorPath: "author.screenName", accessStatus: "public", eventType: "social-research-lead", maximumTextLength: 240, urlFromItem: (item) => {
        const post = item as { id?: string; author?: { screenName?: string } };
        return /^\d+$/.test(post.id ?? "") && /^\w+$/.test(post.author?.screenName ?? "") ? `https://x.com/${post.author!.screenName}/status/${post.id}` : null;
      } }, { ...options, requestTimeoutMs: options.requestTimeoutMs ?? 25_000 });
    }
    if (source.id === "federal-register") {
      return fetchJsonApi(source, {
        itemsPath: "results",
        titlePath: "title",
        summaryPath: "abstract",
        urlPath: "html_url",
        publishedAtPath: "publication_date",
        idPath: "document_number",
        eventType: "policy",
        accessStatus: "public-api",
      }, options);
    }
    return fetchJsonApi(source, {}, options);
  }
  if (source.endpoint.type === "html") return fetchHtmlMetadata(source, options);
  // Coherent IR times out with the Atlas descriptive UA; its public feed accepts the Node default.
  return fetchRss(source, source.id === "coherent-ir" ? { ...options, userAgent: options.userAgent ?? "undici" } : options);
}

export { fetchAihotDailyLatest, fetchAihotItems } from "./aihot-v1.ts";
