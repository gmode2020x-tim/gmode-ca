import { createSession, envValue, sessionCookie } from "./_auth.js";

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    send(res, 405, { error: "Method not allowed" });
    return;
  }

  const configuredPassword = envValue("GMODE_ADMIN_PASSWORD");
  if (!configuredPassword) {
    send(res, 503, { error: "Login is not configured" });
    return;
  }

  try {
    const { password } = await readBody(req);
    if (password !== configuredPassword) {
      send(res, 401, { error: "Invalid password" });
      return;
    }

    const token = createSession("tim@gmode.ca");
    send(res, 200, { email: "tim@gmode.ca" }, { "Set-Cookie": sessionCookie(token, req) });
  } catch {
    send(res, 400, { error: "Invalid request" });
  }
}
