import assert from "node:assert/strict";
import { summarizeAnalytics } from "../api/analytics.js";

const report = summarizeAnalytics(
  [
    { event: "session_start", occurredAt: "2026-08-29T12:00:00.000Z", path: "/" },
    { event: "page_view", occurredAt: "2026-08-29T12:00:01.000Z", path: "/" },
    { event: "product_view", occurredAt: "2026-08-29T12:00:10.000Z", product: "GMODE Trip Recorder" },
    { event: "product_click", occurredAt: "2026-08-29T12:00:12.000Z", product: "GMODE Trip Recorder" },
    { event: "download_click", occurredAt: "2026-08-29T12:00:14.000Z", product: "GMODE Trip Recorder" },
    { event: "contact_click", occurredAt: "2026-08-30T09:00:00.000Z", section: "company" },
    { event: "page_view", occurredAt: "2026-08-30T09:01:00.000Z", path: "/" },
  ],
  7,
  new Date("2026-08-30T12:00:00.000Z"),
);

assert.deepEqual(report.totals, {
  pageViews: 2,
  sessions: 1,
  productViews: 1,
  productClicks: 1,
  downloadClicks: 1,
  contactClicks: 1,
  githubClicks: 0,
});
assert.deepEqual(report.topPages, [{ label: "/", count: 2 }]);
assert.deepEqual(report.topProducts, [{ label: "GMODE Trip Recorder", count: 1 }]);
assert.equal(report.daily.at(-1).pageViews, 1);
assert.deepEqual(report.actions[0], { label: "View product", count: 1 });

console.log("GMODE analytics aggregation tests passed");
