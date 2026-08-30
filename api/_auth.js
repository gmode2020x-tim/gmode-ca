import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const COOKIE_NAME = "gmode_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
let localEnv = null;

function normalizeEnvValue(value) {
  const trimmed = String(value || "").trim();
  const first = trimmed[0];
  const last = trimmed.at(-1);
  return trimmed.length >= 2 && ((first === '"' && last === '"') || (first === "'" && last === "'"))
    ? trimmed.slice(1, -1)
    : trimmed;
}

export function envValue(name) {
  if (process.env.VERCEL) {
    return process.env[name] || "";
  }

  if (localEnv === null) {
    localEnv = {};
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (match) {
          localEnv[match[1]] = normalizeEnvValue(match[2]);
        }
      }
    }
  }

  return localEnv[name] || process.env[name] || "";
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function safeEqualText(a, b) {
  return safeEqual(String(a || ""), String(b || ""));
}

export function createSession(email) {
  const secret = envValue("GMODE_SESSION_SECRET");
  if (!secret) {
    throw new Error("GMODE_SESSION_SECRET is not configured");
  }

  const payload = base64url(
    JSON.stringify({
      sub: email,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    }),
  );

  return `${payload}.${sign(payload, secret)}`;
}

export function readSession(req) {
  const secret = envValue("GMODE_SESSION_SECRET");
  const header = req.headers.cookie || "";
  const match = header.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));

  if (!secret || !match) {
    return null;
  }

  const [payload, signature] = decodeURIComponent(match[1]).split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function requireAdmin(req, res) {
  const session = readSession(req);
  if (session) return session;

  res.writeHead(401, {
    "Content-Type": "application/json",
    "Cache-Control": "private, no-store",
  });
  res.end(JSON.stringify({ error: "Not authenticated" }));
  return null;
}

export function sessionCookie(token, req) {
  const isSecure = Boolean(process.env.VERCEL || req.headers["x-forwarded-proto"] === "https");
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
    isSecure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
