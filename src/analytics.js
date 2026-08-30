const ANALYTICS_ENDPOINT = "/api/analytics";
const SESSION_KEY = "gmode_analytics_session_v1";

function referrerHost() {
  if (!document.referrer) return "Direct";
  try {
    const referrer = new URL(document.referrer);
    return referrer.hostname === window.location.hostname ? "Direct" : referrer.hostname;
  } catch {
    return "Direct";
  }
}

export function trackAnalytics(event, details = {}) {
  if (window.location.pathname.startsWith("/admin")) return;
  const payload = JSON.stringify({ event, path: window.location.pathname, referrerHost: referrerHost(), ...details });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export function startAnalytics() {
  let hasSession = false;
  try {
    hasSession = sessionStorage.getItem(SESSION_KEY) === "1";
    if (!hasSession) sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    hasSession = true;
  }

  if (!hasSession) trackAnalytics("session_start");
  trackAnalytics("page_view");
}
