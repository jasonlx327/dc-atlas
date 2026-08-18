import type { ConnectorResult, SourceDefinition } from "../connectors/types.ts";

export type SourceBatchOptions = {
  concurrency?: number;
  retries?: number;
  retryDelayMs?: number;
};

type SourceFetcher = (source: SourceDefinition) => Promise<ConnectorResult>;

const RETRYABLE = new Set<ConnectorResult["status"]>(["failed"]);

function positiveInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && (value ?? 0) > 0 ? value! : fallback;
}

async function pause(delayMs: number): Promise<void> {
  if (delayMs <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function fetchSourcesBatched(
  sources: SourceDefinition[],
  fetchSource: SourceFetcher,
  options: SourceBatchOptions = {},
): Promise<ConnectorResult[]> {
  const concurrency = Math.min(sources.length || 1, positiveInteger(options.concurrency, 6));
  const retries = Math.max(0, Number.isInteger(options.retries) ? options.retries! : 2);
  const retryDelayMs = Math.max(0, Number.isFinite(options.retryDelayMs) ? options.retryDelayMs! : 500);
  const results = new Array<ConnectorResult>(sources.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < sources.length) {
      const index = nextIndex;
      nextIndex += 1;
      const source = sources[index]!;
      let result: ConnectorResult | null = null;
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          result = await fetchSource(source);
        } catch (error) {
          result = {
            status: "failed",
            sourceId: source.id,
            endpointId: source.endpoint.id,
            fetchedAt: new Date().toISOString(),
            observations: [],
            error: error instanceof Error ? error.message : String(error),
          };
        }
        if (!RETRYABLE.has(result.status) || attempt === retries) break;
        await pause(retryDelayMs * (attempt + 1));
      }
      results[index] = result!;
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}
