import { headers } from "next/headers";

type LivePayload = Record<string, unknown>;

function isLivePayload(value: unknown): value is LivePayload {
  return Boolean(value) && typeof value === "object" && typeof (value as LivePayload).generatedAt === "string";
}

function requestCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const entry of cookieHeader.split(";")) {
    const separator = entry.indexOf("=");
    if (separator < 0 || entry.slice(0, separator).trim() !== name) continue;
    return entry.slice(separator + 1).trim() || null;
  }
  return null;
}

export async function loadInitialAtlasPayload(encodedFromUrl?: string | null): Promise<LivePayload | null> {
  const requestHeaders = await headers();
  const encoded = requestHeaders.get("x-idc-atlas-prime")
    ?? requestCookieValue(requestHeaders.get("cookie"), "__idc_atlas_prime")
    ?? encodedFromUrl;
  const meta = requestHeaders.get("x-idc-atlas-meta");
  if (!encoded) {
    if (!meta) return null;
    try {
      const payload: unknown = JSON.parse(meta);
      return isLivePayload(payload) ? payload : null;
    } catch {
      return null;
    }
  }

  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const payload: unknown = await new Response(stream).json();
    if (!isLivePayload(payload)) return null;

    return payload;
  } catch {
    return null;
  }
}
