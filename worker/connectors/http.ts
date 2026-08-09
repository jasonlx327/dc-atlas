import type { ConnectorFetchOptions } from "./types";

const DEFAULT_USER_AGENT = "IDC-Atlas-Event-Intelligence/0.1 (+https://idc-index.com/methodology)";

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function fetchWithRetries(
  url: string,
  options: ConnectorFetchOptions & { accept?: string } = {},
): Promise<{ response: Response; responseMs: number }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const started = performance.now();
    try {
      const headers = new Headers({
        Accept: options.accept ?? "application/json, application/atom+xml, application/rss+xml, text/xml",
        "User-Agent": options.userAgent ?? DEFAULT_USER_AGENT,
      });
      if (options.requestState?.etag) headers.set("If-None-Match", options.requestState.etag);
      if (options.requestState?.lastModified) headers.set("If-Modified-Since", options.requestState.lastModified);
      const response = await fetch(url, {
        headers,
        signal: options.signal ?? AbortSignal.timeout(15_000),
      });
      const responseMs = Math.round(performance.now() - started);
      if (response.status >= 500 && attempt < 2) {
        await delay(250 * (attempt + 1));
        continue;
      }
      return { response, responseMs };
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await delay(250 * (attempt + 1));
        continue;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError ?? "request failed"));
}

export function responseHeaders(response: Response) {
  return {
    etag: response.headers.get("etag"),
    lastModified: response.headers.get("last-modified"),
  };
}

export async function readTextLimited(response: Response, maximumBytes = 2_000_000): Promise<string> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maximumBytes) throw new Error(`Response exceeds ${maximumBytes} byte limit`);
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maximumBytes) throw new Error(`Response exceeds ${maximumBytes} byte limit`);
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}
