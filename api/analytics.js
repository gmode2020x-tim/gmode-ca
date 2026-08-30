import { list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "./_auth.js";

const EVENT_PREFIX = "analytics/events/";
const ALLOWED_EVENTS = new Set([
  "session_start",
  "page_view",
  "product_view",
  "product_click",
  "download_click",
  "contact_click",
  "github_click",
]);
const BOT_PATTERN = /bot|crawler|spider|headless|lighthouse|pagespeed|preview/i;
const MAX_REPORT_EVENTS = 7500;

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function normalizePath(value) {
  const path = cleanText(value, 120);
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function normalizeEvent(input) {
  const event = cleanText(input?.event, 40);
  if (!ALLOWED_EVENTS.has(event)) return null;

  return {
    version: 1,
    occurredAt: new Date().toISOString(),
    event,
    path: normalizePath(input?.path),
    product: cleanText(input?.product, 80),
    section: cleanText(input?.section, 50),
    referrerHost: cleanText(input?.referrerHost, 120) || "Direct",
  };
}

function requestIsSameSite(req) {
  const origin = cleanText(req.headers.origin, 180);
  if (!origin) return req.headers["sec-fetch-site"] === "same-origin";

  try {
    const originUrl = new URL(origin);
    const forwardedHost = cleanText(req.headers["x-forwarded-host"] || req.headers.host, 180);
    return originUrl.host === forwardedHost;
  } catch {
    return false;
  }
}

function monthPrefixes(fromDate, toDate) {
  const prefixes = [];
  const cursor = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), 1));
  const finalMonth = Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), 1);
  while (cursor.getTime() <= finalMonth) {
    prefixes.push(`${EVENT_PREFIX}${cursor.toISOString().slice(0, 7)}-`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return prefixes;
}

async function listPrefix(prefix) {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && blobs.length < MAX_REPORT_EVENTS);
  return blobs.slice(0, MAX_REPORT_EVENTS);
}

async function readEvents(days) {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - days + 1);
  fromDate.setUTCHours(0, 0, 0, 0);

  const blobGroups = await Promise.all(monthPrefixes(fromDate, toDate).map(listPrefix));
  const fromKey = fromDate.toISOString().slice(0, 10);
  const toKey = toDate.toISOString().slice(0, 10);
  const blobs = blobGroups
    .flat()
    .filter((blob) => {
      const date = blob.pathname.slice(EVENT_PREFIX.length, EVENT_PREFIX.length + 10);
      return date >= fromKey && date <= toKey;
    })
    .slice(-MAX_REPORT_EVENTS);

  const events = [];
  for (let index = 0; index < blobs.length; index += 50) {
    const results = await Promise.allSettled(
      blobs.slice(index, index + 50).map(async (blob) => {
        const response = await fetch(blob.url, { cache: "no-store" });
        if (!response.ok) throw new Error("Analytics event could not be read");
        return response.json();
      }),
    );
    for (const result of results) {
      if (result.status === "fulfilled" && ALLOWED_EVENTS.has(result.value?.event)) events.push(result.value);
    }
  }
  return { events, fromDate, toDate, truncated: blobs.length >= MAX_REPORT_EVENTS };
}

function rankedCounts(events, key, eventName, limit = 7) {
  const counts = new Map();
  for (const event of events) {
    if (event.event !== eventName) continue;
    const label = cleanText(event[key], 120) || "Unknown";
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, limit);
}

export function summarizeAnalytics(events, days, now = new Date()) {
  const dailyByDate = new Map();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - offset);
    const key = date.toISOString().slice(0, 10);
    dailyByDate.set(key, { date: key, pageViews: 0, sessions: 0, productViews: 0, downloadClicks: 0 });
  }

  const totals = { pageViews: 0, sessions: 0, productViews: 0, productClicks: 0, downloadClicks: 0, contactClicks: 0, githubClicks: 0 };
  const totalKeyByEvent = {
    page_view: "pageViews",
    session_start: "sessions",
    product_view: "productViews",
    product_click: "productClicks",
    download_click: "downloadClicks",
    contact_click: "contactClicks",
    github_click: "githubClicks",
  };

  for (const event of events) {
    const totalKey = totalKeyByEvent[event.event];
    if (totalKey) totals[totalKey] += 1;
    const day = dailyByDate.get(cleanText(event.occurredAt, 24).slice(0, 10));
    if (!day) continue;
    if (event.event === "page_view") day.pageViews += 1;
    if (event.event === "session_start") day.sessions += 1;
    if (event.event === "product_view") day.productViews += 1;
    if (event.event === "download_click") day.downloadClicks += 1;
  }

  const actions = [
    ["View product", totals.productClicks],
    ["Official download", totals.downloadClicks],
    ["Contact", totals.contactClicks],
    ["GitHub profile", totals.githubClicks],
  ].map(([label, count]) => ({ label, count }));

  return {
    totals,
    daily: [...dailyByDate.values()],
    topPages: rankedCounts(events, "path", "page_view"),
    topProducts: rankedCounts(events, "product", "product_view"),
    actions,
  };
}

async function recordEvent(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(202).json({ recorded: false });
    return;
  }
  if (!requestIsSameSite(req)) {
    res.status(403).json({ error: "Cross-site analytics requests are not allowed" });
    return;
  }
  if (BOT_PATTERN.test(cleanText(req.headers["user-agent"], 240))) {
    res.status(202).json({ recorded: false });
    return;
  }

  const event = normalizeEvent(req.body);
  if (!event) {
    res.status(400).json({ error: "Unknown analytics event" });
    return;
  }

  const day = event.occurredAt.slice(0, 10);
  const time = event.occurredAt.slice(11, 23).replace(/[:.]/g, "-");
  await put(`${EVENT_PREFIX}${day}/${time}-${randomUUID()}.json`, JSON.stringify(event), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  res.status(202).json({ recorded: true });
}

async function report(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(503).json({ error: "Analytics storage is not configured" });
    return;
  }

  const requestedDays = Number(req.query?.days || 30);
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const { events, fromDate, toDate, truncated } = await readEvents(days);
  res.status(200).json({
    range: { days, from: fromDate.toISOString().slice(0, 10), to: toDate.toISOString().slice(0, 10) },
    ...summarizeAnalytics(events, days, toDate),
    eventCount: events.length,
    truncated,
    generatedAt: new Date().toISOString(),
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  try {
    if (req.method === "POST") return await recordEvent(req, res);
    if (req.method === "GET") return await report(req, res);
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Analytics request failed" });
  }
}
