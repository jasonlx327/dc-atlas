type AccessClaims = {
  aud?: string | string[];
  email?: string;
  exp?: number;
  iss?: string;
  nbf?: number;
};

type AccessJwk = JsonWebKey & { kid?: string };

const keyCache = new Map<string, { expiresAt: number; keys: AccessJwk[] }>();

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
}

function decodeJson<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

async function accessKeys(teamDomain: string): Promise<AccessJwk[]> {
  const cached = keyCache.get(teamDomain);
  if (cached && cached.expiresAt > Date.now()) return cached.keys;
  const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`Access JWKS unavailable: HTTP ${response.status}`);
  const payload = await response.json<{ keys?: AccessJwk[]; public_certs?: AccessJwk[] }>();
  const keys = payload.keys ?? payload.public_certs ?? [];
  if (!keys.length) throw new Error("Access JWKS did not contain signing keys");
  keyCache.set(teamDomain, { expiresAt: Date.now() + 60 * 60 * 1000, keys });
  return keys;
}

export async function verifyAccessJwt(
  token: string | null,
  options: { teamDomain: string; audience: string; email: string; now?: number },
): Promise<boolean> {
  if (!token || !options.teamDomain || !options.audience || !options.email) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const header = decodeJson<{ alg?: string; kid?: string }>(parts[0]);
    const claims = decodeJson<AccessClaims>(parts[1]);
    if (header.alg !== "RS256" || !header.kid) return false;
    const now = options.now ?? Math.floor(Date.now() / 1000);
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!claims.exp || claims.exp <= now || (claims.nbf !== undefined && claims.nbf > now + 60) || !audience.includes(options.audience)) return false;
    if (claims.iss !== `https://${options.teamDomain}` || claims.email?.toLowerCase() !== options.email.toLowerCase()) return false;
    const key = (await accessKeys(options.teamDomain)).find((candidate) => candidate.kid === header.kid);
    if (!key) return false;
    const cryptoKey = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, decodeBase64Url(parts[2]), signed);
  } catch {
    return false;
  }
}
