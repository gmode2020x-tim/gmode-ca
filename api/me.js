import { readSession } from "./_auth.js";

export default function handler(req, res) {
  const session = readSession(req);
  res.writeHead(session ? 200 : 401, { "Content-Type": "application/json" });
  res.end(JSON.stringify(session ? { email: session.sub } : { error: "Not authenticated" }));
}
