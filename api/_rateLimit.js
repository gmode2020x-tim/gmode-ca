import crypto from "node:crypto";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();

function clientAddress(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || String(req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown");
}

export function getLoginKey(req) {
  const addressHash = crypto.createHash("sha256").update(clientAddress(req)).digest("hex");
  return addressHash;
}

export function loginLimit(key, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    if (entry) attempts.delete(key);
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count < MAX_ATTEMPTS) return { allowed: true, retryAfter: 0 };
  return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.startedAt + WINDOW_MS - now) / 1000)) };
}

export function recordLoginFailure(key, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    attempts.set(key, { count: 1, startedAt: now });
    return;
  }
  entry.count += 1;
}

export function clearLoginFailures(key) {
  attempts.delete(key);
}

export function resetLoginFailuresForTests() {
  attempts.clear();
}
