import { clearSessionCookie } from "./_auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "POST" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Cache-Control": "private, no-store",
    "Set-Cookie": clearSessionCookie(),
  });
  res.end(JSON.stringify({ ok: true }));
}
