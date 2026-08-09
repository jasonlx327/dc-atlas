import type { accessStatuses, sourceTiers } from "../../db/schema";

export type SourceTier = (typeof sourceTiers)[number];
export type AccessStatus = (typeof accessStatuses)[number];

export type EndpointType = "rss" | "json-api" | "html" | "sec" | "manual" | "aihot";
export const CONNECTOR_CONTRACT_VERSION = "atlas-connector.v1" as const;

export type SourceDefinition = {
  id: string;
  slug: string;
  name: string;
  tier: SourceTier;
  publisherType: string;
  region: string;
  language: string;
  independenceGroup: string;
  topics: string[];
  endpoint: {
    id: string;
    type: EndpointType;
    url: string;
    parserKey: string;
    pollIntervalMinutes: number;
    accessNotes?: string;
  };
  enabled: boolean;
  shadowEnabled?: boolean;
  accessNotes?: string;
  copyrightNotes?: string;
};

export type ConnectorRequestState = {
  etag?: string | null;
  lastModified?: string | null;
  cursor?: string | null;
};

export type ObservationEnvelope = {
  sourceId: string;
  endpointId: string;
  canonicalUrl: string;
  originalUrl: string;
  externalId?: string | null;
  titleOriginal: string;
  summaryOriginal: string;
  language: string;
  author?: string | null;
  publishedAt?: string | null;
  discoveredAt: string;
  fetchedAt: string;
  rawPayload: Record<string, unknown>;
  accessStatus: AccessStatus;
  eventKey?: string | null;
  eventType?: string | null;
  entities?: string[];
  locations?: string[];
  topics?: string[];
};

export type ConnectorResult = {
  status: "ok" | "empty" | "not-modified" | "parse-error" | "failed" | "blocked";
  sourceId: string;
  endpointId: string;
  fetchedAt: string;
  httpStatus?: number;
  responseMs?: number;
  etag?: string | null;
  lastModified?: string | null;
  cursor?: string | null;
  observations: ObservationEnvelope[];
  error?: string;
};

export type ConnectorHealthRecord = {
  contractVersion: typeof CONNECTOR_CONTRACT_VERSION;
  sourceId: string;
  endpointId: string;
  endpointType: EndpointType;
  parserKey: string;
  url: string;
  tier: SourceTier;
  independenceGroup: string;
  status: ConnectorResult["status"];
  httpStatus?: number;
  responseMs?: number;
  observations: number;
  error?: string;
};

export function connectorHealthRecord(result: ConnectorResult, source: SourceDefinition): ConnectorHealthRecord {
  return {
    contractVersion: CONNECTOR_CONTRACT_VERSION,
    sourceId: result.sourceId,
    endpointId: result.endpointId,
    endpointType: source.endpoint.type,
    parserKey: source.endpoint.parserKey,
    url: source.endpoint.url,
    tier: source.tier,
    independenceGroup: source.independenceGroup,
    status: result.status,
    httpStatus: result.httpStatus,
    responseMs: result.responseMs,
    observations: result.observations.length,
    error: result.error,
  };
}

export type ConnectorFetchOptions = {
  signal?: AbortSignal;
  userAgent?: string;
  requestState?: ConnectorRequestState;
};

export function sourceToDbRow(source: SourceDefinition) {
  return {
    id: source.id,
    slug: source.slug,
    name: source.name,
    tier: source.tier,
    publisherType: source.publisherType,
    region: source.region,
    language: source.language,
    independenceGroup: source.independenceGroup,
    topicsJson: JSON.stringify(source.topics),
    enabled: source.enabled,
    accessNotes: source.accessNotes ?? "",
    copyrightNotes: source.copyrightNotes ?? "",
  };
}
