import { headers } from "next/headers";

type LivePayload = Record<string, unknown>;

function isLivePayload(value: unknown): value is LivePayload {
  return Boolean(value) && typeof value === "object" && typeof (value as LivePayload).generatedAt === "string";
}

export async function loadInitialAtlasPayload(): Promise<LivePayload | null> {
  const requestHeaders = await headers();
  const encoded = requestHeaders.get("x-idc-atlas-prime");
  if (!encoded) return null;

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
