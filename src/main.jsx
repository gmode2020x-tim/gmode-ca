import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight } from "lucide-react";
import "./styles.css";

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <main className="landing-shell">
      <h1>Gmode</h1>
      <a href="/admin">Login</a>
    </main>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setSession(data);
        setStatus(data ? "signed-in" : "signed-out");
      })
      .catch(() => {
        setStatus("signed-out");
      });
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Login failed");
      setStatus("signed-out");
      return;
    }

    setSession(data);
    setPassword("");
    setStatus("signed-in");
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setSession(null);
    setStatus("signed-out");
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/">
          Gmode
        </a>
        <a className="text-link" href="/">
          Public site
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </header>

      {status === "checking" ? (
        <section className="login-panel">
          <p className="admin-kicker">Checking session</p>
        </section>
      ) : session ? (
        <section className="admin-console">
          <div className="admin-title">
            <p>Signed in as {session.email}</p>
            <h1>Owner console</h1>
          </div>
          <div className="admin-grid">
            <article>
              <h2>Site</h2>
              <p>Public homepage is live-ready and routes private admin traffic through signed cookies.</p>
            </article>
            <article>
              <h2>Contact</h2>
              <p>Primary public contact is tim@gmode.ca.</p>
            </article>
            <article>
              <h2>Next</h2>
              <p>Add editable content or status data here when there is a real workflow to manage.</p>
            </article>
          </div>
          <button className="button secondary" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </section>
      ) : (
        <section className="login-panel" aria-labelledby="login-heading">
          <div>
            <h1 id="login-heading">Tim login</h1>
            <p>Private access for managing gmode.ca.</p>
          </div>
          <form onSubmit={handleLogin}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error ? <p className="form-error">{error}</p> : null}
            <button className="button" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Signing in" : "Sign in"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
