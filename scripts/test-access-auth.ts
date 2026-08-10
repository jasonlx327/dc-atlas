import assert from "node:assert/strict";
import { verifyAccessJwt } from "../worker/access-auth.ts";

function base64Url(value: Uint8Array | string): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  return Buffer.from(bytes).toString("base64url");
}

const keys = await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["sign", "verify"],
);
const publicJwk = await crypto.subtle.exportKey("jwk", keys.publicKey) as JsonWebKey & { kid: string };
publicJwk.kid = "test-key";
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => Response.json({ keys: [publicJwk] });

const teamDomain = `access-test-${Date.now()}.example.com`;
const options = { teamDomain, audience: "atlas-admin", email: "owner@example.com", now: 1_800_000_000 };

async function token(overrides: Record<string, unknown> = {}): Promise<string> {
  const header = base64Url(JSON.stringify({ alg: "RS256", kid: publicJwk.kid }));
  const payload = base64Url(JSON.stringify({
    aud: options.audience,
    email: options.email,
    exp: options.now + 300,
    iss: `https://${teamDomain}`,
    nbf: options.now - 30,
    ...overrides,
  }));
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keys.privateKey, new TextEncoder().encode(`${header}.${payload}`));
  return `${header}.${payload}.${base64Url(new Uint8Array(signature))}`;
}

try {
  assert.equal(await verifyAccessJwt(await token(), options), true);
  assert.equal(await verifyAccessJwt(await token({ email: "other@example.com" }), options), false);
  assert.equal(await verifyAccessJwt(await token({ aud: "other-app" }), options), false);
  assert.equal(await verifyAccessJwt(await token({ iss: "https://other.example.com" }), options), false);
  assert.equal(await verifyAccessJwt(await token({ exp: options.now }), options), false);
  assert.equal(await verifyAccessJwt(await token({ nbf: options.now + 61 }), options), false);
  const tampered = `${(await token()).slice(0, -1)}x`;
  assert.equal(await verifyAccessJwt(tampered, options), false);
} finally {
  globalThis.fetch = originalFetch;
}

console.log(JSON.stringify({ message: "Access JWT tests passed", checks: 7 }));
