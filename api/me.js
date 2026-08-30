import { readSession } from "./_auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "GET" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  const session = readSession(req);
  res.writeHead(session ? 200 : 401, { "Content-Type": "application/json", "Cache-Control": "private, no-store" });
  res.end(JSON.stringify(session ? { email: session.sub } : { error: "Not authenticated" }));
}
