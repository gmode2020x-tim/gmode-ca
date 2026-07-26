import { clearSessionCookie } from "./_auth.js";

export default function handler(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Set-Cookie": clearSessionCookie(),
  });
  res.end(JSON.stringify({ ok: true }));
}
