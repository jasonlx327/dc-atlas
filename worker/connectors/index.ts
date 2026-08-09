import { fetchAihotItems } from "./aihot-v1.ts";
import { fetchJsonApi } from "./json-api.ts";
import { fetchHtmlMetadata } from "./html.ts";
import { fetchRss } from "./rss.ts";
import type { ConnectorFetchOptions, ConnectorResult, SourceDefinition } from "./types.ts";

export { sourceRegistry, sourceRegistryById, shadowSources } from "./registry.ts";
export { CONNECTOR_CONTRACT_VERSION } from "./types.ts";
export type * from "./types.ts";

export async function fetchRegisteredSource(source: SourceDefinition, options: ConnectorFetchOptions = {}): Promise<ConnectorResult> {
  if (source.endpoint.type === "aihot") return fetchAihotItems(source, { ...options, window: "24h", limit: 100 });
  if (source.id === "aihot-discovery" && source.endpoint.type !== "rss") return fetchAihotItems(source, { ...options, window: "24h", limit: 100 });
  if (source.endpoint.type === "json-api") {
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
  return fetchRss(source, options);
}

export { fetchAihotDailyLatest, fetchAihotItems } from "./aihot-v1.ts";
