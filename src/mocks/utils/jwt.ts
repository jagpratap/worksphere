import { ACCESS_TOKEN_TTL_SEC } from "./constants";

export type JWTPayload = {
  sub: string; // user id
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expiry
};

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);

  const claims: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SEC,
  };

  const encodedPayload = base64url(JSON.stringify(claims));
  const signature = await sign(header, encodedPayload);

  return `${header}.${encodedPayload}.${signature}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const [header, payload, sig] = token.split(".");
    if (!header || !payload || !sig)
      return null;

    const valid = await verify(header, payload, sig);
    if (!valid)
      return null;

    const claims: JWTPayload = JSON.parse(decodeBase64url(payload));

    if (claims.exp < Math.floor(Date.now() / 1000))
      return null; // expired

    return claims;
  }
  catch {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(decodeBase64url(payload));
  }
  catch {
    return null;
  }
}

export function extractBearer(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer "))
    return null;
  return authHeader.slice(7);
}

/* =============================================================================
  Internal helpers
============================================================================= */

const SECRET = "msw-mock-secret-key";

const RE_PLUS = /\+/g;
const RE_SLASH = /\//g;
const RE_TRAILING_EQ = /=+$/;
const RE_DASH = /-/g;
const RE_UNDERSCORE = /_/g;

function base64url(input: string | Uint8Array): string {
  const str
    = typeof input === "string"
      ? input
      : String.fromCharCode(...input);
  return btoa(str).replace(RE_PLUS, "-").replace(RE_SLASH, "_").replace(RE_TRAILING_EQ, "");
}

function decodeBase64url(input: string): string {
  const padded = input.replace(RE_DASH, "+").replace(RE_UNDERSCORE, "/").padEnd(
    input.length + ((4 - (input.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

async function sign(header: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(SECRET);
  const data = enc.encode(`${header}.${payload}`);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  return base64url(new Uint8Array(signature));
}

async function verify(header: string, payload: string, sig: string): Promise<boolean> {
  const expected = await sign(header, payload);
  return expected === sig;
}
