import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Box,
  CalendarDays,
  Code2,
  Download,
  ExternalLink,
  Eye,
  Github,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  Package,
  RefreshCw,
  Route,
  ServerCog,
  ShieldCheck,
  Smartphone,
  User,
  Users,
  X,
} from "lucide-react";
import { startAnalytics, trackAnalytics } from "./analytics.js";
import "./styles.css";

const contactEmail = "tim@gmode.ca";
const githubProfile = "https://github.com/gmode2020x-tim";
const tripRecorderRepository = `${githubProfile}/gmode-trip-recorder`;
const tripRecorderRelease = `${tripRecorderRepository}/releases/tag/v2.0.0`;

const productFacts = [
  [Smartphone, "Android 10+"],
  [Route, "Offline first"],
  [Home, "Home Assistant sync"],
];

const metricDefinitions = [
  [Eye, "Page views", "pageViews"],
  [Users, "Sessions", "sessions"],
  [Package, "Product views", "productViews"],
  [Download, "Download clicks", "downloadClicks"],
];

function App() {
  return window.location.pathname.startsWith("/admin") ? <Admin /> : <PublicSite />;
}

function Brand({ compact = false }) {
  return (
    <span className={`brand${compact ? " brand--compact" : ""}`}>
      <Code2 aria-hidden="true" />
      <strong>GMODE</strong>
    </span>
  );
}

function PublicSite() {
  const productRef = useRef(null);

  useEffect(() => {
    startAnalytics();
  }, []);

  useEffect(() => {
    const product = productRef.current;
    if (!product || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackAnalytics("product_view", { product: "GMODE Trip Recorder", section: "products" });
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(product);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="public-site">
      <SiteHeader />
      <main>
        <Hero />
        <ProductsSection productRef={productRef} />
        <CompanySection />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a href="#top" aria-label="GMODE home" onClick={closeMenu}>
        <Brand compact />
      </a>
      <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
        <a href="#products" onClick={closeMenu}>Products</a>
        <a href="#company" onClick={closeMenu}>Company</a>
        <a href={`mailto:${contactEmail}`} onClick={() => { closeMenu(); trackAnalytics("contact_click", { section: "header" }); }}>Contact</a>
      </nav>
      <a className="sign-in-link" href="/admin"><User size={18} aria-hidden="true" />Sign in</a>
      <button
        className="icon-button menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        title={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title">Software built for<br />the real world.</h1>
        <p>GMODE creates focused tools for navigation, telemetry, automation, and the systems that connect them.</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#products"><Box size={18} aria-hidden="true" />Explore products</a>
          <a className="text-link" href={`mailto:${contactEmail}`} onClick={() => trackAnalytics("contact_click", { section: "hero" })}>Contact GMODE<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function ProductsSection({ productRef }) {
  return (
    <section className="products-section" id="products" aria-labelledby="products-title">
      <div className="section-title-row">
        <h2 id="products-title">Products</h2>
        <span aria-hidden="true" />
      </div>
      <article className="featured-product" ref={productRef} id="trip-recorder">
        <div className="product-media">
          <img
            src="/app/01-attitude-dashboard.png"
            alt="GMODE Trip Recorder live attitude cockpit on Android"
            width="1920"
            height="1080"
          />
        </div>
        <div className="product-details">
          <div className="product-heading">
            <img src="/app/app-icon-512.png" width="64" height="64" alt="GMODE Trip Recorder icon" />
            <div><h3>GMODE Trip Recorder</h3><p>Offline-first GPS recording and live telemetry for Android.</p></div>
          </div>
          <ul className="product-facts">
            {productFacts.map(([Icon, label]) => <li key={label}><Icon aria-hidden="true" /><span>{label}</span></li>)}
          </ul>
          <div className="product-actions">
            <a
              className="button button--primary"
              href={tripRecorderRepository}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackAnalytics("product_click", { product: "GMODE Trip Recorder", section: "products" })}
            >
              <ExternalLink size={17} aria-hidden="true" />View product
            </a>
            <a
              className="text-link"
              href={tripRecorderRelease}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackAnalytics("download_click", { product: "GMODE Trip Recorder", section: "products" })}
            >
              <Github size={18} aria-hidden="true" />Official download
            </a>
          </div>
        </div>
      </article>
      <div className="future-product">
        <span className="future-product__icon" aria-hidden="true"><Box /></span>
        <div><h3>More products coming soon.</h3><p>The product catalog is ready to grow as new GMODE software is released.</p></div>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section className="company-section" id="company" aria-labelledby="company-title">
      <div className="company-copy">
        <h2 id="company-title">Built around<br />useful systems.</h2>
        <p>GMODE is an independent software company building practical tools for navigation, telemetry, automation, and connected systems.</p>
        <p>Our software is privacy-minded, local-first, and designed to stay useful when connectivity is unavailable.</p>
        <p>We keep the work focused, transparent, and directly reachable.</p>
        <a className="text-link" href={`mailto:${contactEmail}`} onClick={() => trackAnalytics("contact_click", { section: "company" })}><Mail size={18} aria-hidden="true" />Contact GMODE<ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <img className="systems-graphic" src="/brand/gmode-connected-systems.png" alt="Connected navigation, telemetry, server, and local automation systems" width="1200" height="1200" />
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><Brand compact /><a href={`mailto:${contactEmail}`} onClick={() => trackAnalytics("contact_click", { section: "footer" })}><Mail size={17} aria-hidden="true" />{contactEmail}</a></div>
      <div className="footer-links">
        <a href={githubProfile} target="_blank" rel="noreferrer" onClick={() => trackAnalytics("github_click", { section: "footer" })}><Github size={17} aria-hidden="true" />GitHub</a>
        <a href="#company"><ShieldCheck size={17} aria-hidden="true" />Privacy</a>
        <a href="/admin"><LockKeyhole size={17} aria-hidden="true" />Admin sign in</a>
      </div>
      <p>© {new Date().getFullYear()} GMODE. All rights reserved.</p>
    </footer>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/me", { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setSession(data);
        setStatus(data ? "signed-in" : "signed-out");
      })
      .catch(() => setStatus("signed-out"));
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setSession(null);
    setStatus("signed-out");
  }

  if (status === "checking") return <AdminLoading />;
  if (!session) return <AdminLogin onAuthenticated={(data) => { setSession(data); setStatus("signed-in"); }} />;
  return <AnalyticsDashboard session={session} onLogout={handleLogout} />;
}

function AdminLoading() {
  return (
    <main className="auth-shell">
      <a href="/" aria-label="Return to gmode.ca"><Brand /></a>
      <section className="login-panel" aria-live="polite"><RefreshCw className="spin" aria-hidden="true" /><p>Checking session</p></section>
    </main>
  );
}

function AdminLogin({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Sign in failed");
      setPassword("");
      onAuthenticated(data);
    } catch (requestError) {
      setError(requestError.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <a href="/" aria-label="Return to gmode.ca"><Brand /></a>
      <section className="login-panel" aria-labelledby="login-title">
        <LockKeyhole aria-hidden="true" />
        <h1 id="login-title">Admin sign in</h1>
        <p>Private access to GMODE site analytics.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tim@gmode.ca" required />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? <RefreshCw className="spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}{submitting ? "Signing in" : "Sign in"}</button>
        </form>
        <a className="text-link" href="/"><ArrowLeft size={17} aria-hidden="true" />Return to gmode.ca</a>
      </section>
    </main>
  );
}

function AnalyticsDashboard({ session, onLogout }) {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/analytics?days=${days}`, { headers: { Accept: "application/json" } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Analytics could not be loaded");
      setReport(data);
    } catch (requestError) {
      setReport(null);
      setError(requestError.message || "Analytics could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const totals = report?.totals || {};

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a href="/" aria-label="GMODE public site"><Brand compact /></a>
        <nav aria-label="Admin navigation">
          <a className="is-active" href="#overview"><BarChart3 aria-hidden="true" />Overview</a>
          <a href="#products-report"><Package aria-hidden="true" />Products</a>
        </nav>
        <p className="admin-identity">Signed in as<br /><strong>{session.email}</strong></p>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <span>Site analytics</span>
          <div>
            <a href="/" target="_blank" rel="noreferrer">View public site<ExternalLink size={16} aria-hidden="true" /></a>
            <button className="header-command" type="button" onClick={onLogout}><LogOut size={17} aria-hidden="true" />Sign out</button>
          </div>
        </header>
        <section className="dashboard-content" id="overview" aria-labelledby="analytics-title">
          <div className="dashboard-title-row">
            <div><h1 id="analytics-title">Site analytics</h1><p>Anonymous, first-party activity from the public website.</p></div>
            <button className="icon-button" type="button" onClick={fetchReport} aria-label="Refresh analytics" title="Refresh analytics" disabled={loading}><RefreshCw className={loading ? "spin" : ""} aria-hidden="true" /></button>
          </div>
          <div className="range-control" aria-label="Analytics date range">
            {[7, 30, 90].map((range) => <button key={range} type="button" className={days === range ? "is-selected" : ""} aria-pressed={days === range} onClick={() => setDays(range)}>{range} days</button>)}
          </div>
          {error ? <DashboardError message={error} onRetry={fetchReport} /> : null}
          {!error ? (
            <>
              <section className="metrics-band" aria-label="Analytics totals">
                {metricDefinitions.map(([Icon, label, key]) => (
                  <article key={key}><div><Icon aria-hidden="true" /><span>{label}</span></div><strong>{loading ? "-" : formatNumber(totals[key] || 0)}</strong></article>
                ))}
              </section>
              <section className="analytics-detail">
                <div className="traffic-panel">
                  <div className="panel-heading"><h2>Traffic over time</h2><span><CalendarDays size={16} aria-hidden="true" />{report?.range ? `${report.range.from} to ${report.range.to}` : `${days} days`}</span></div>
                  <TrafficChart daily={report?.daily || []} loading={loading} />
                </div>
                <div className="report-tables" id="products-report">
                  <ReportTable title="Top pages" rows={report?.topPages || []} loading={loading} />
                  <ReportTable title="Actions" rows={report?.actions || []} loading={loading} />
                </div>
              </section>
              <footer className="dashboard-footer"><span><Activity size={16} aria-hidden="true" />{report?.eventCount ? `${formatNumber(report.eventCount)} events included` : "No events recorded in this range"}</span><span>{report?.generatedAt ? `Updated ${new Date(report.generatedAt).toLocaleString()}` : "Waiting for data"}</span></footer>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function TrafficChart({ daily, loading }) {
  const chart = useMemo(() => {
    if (!daily.length) return null;
    const max = Math.max(1, ...daily.map((day) => day.pageViews));
    const points = daily.map((day, index) => {
      const x = daily.length === 1 ? 400 : 28 + (index / (daily.length - 1)) * 744;
      const y = 248 - (day.pageViews / max) * 202;
      return { x, y, ...day };
    });
    return { points, polyline: points.map(({ x, y }) => `${x},${y}`).join(" ") };
  }, [daily]);

  if (loading) return <div className="chart-empty"><RefreshCw className="spin" aria-hidden="true" /><span>Loading traffic</span></div>;
  if (!chart || chart.points.every((point) => point.pageViews === 0)) return <div className="chart-empty"><BarChart3 aria-hidden="true" /><span>No page views in this range</span></div>;

  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 800 290" role="img" aria-labelledby="traffic-chart-title traffic-chart-desc">
        <title id="traffic-chart-title">Daily page views</title>
        <desc id="traffic-chart-desc">A line chart of page views for the selected date range.</desc>
        {[46, 96, 146, 196, 248].map((y) => <line key={y} className="chart-grid" x1="28" x2="772" y1={y} y2={y} />)}
        <polygon className="chart-area" points={`28,248 ${chart.polyline} 772,248`} />
        <polyline className="chart-line" points={chart.polyline} />
        {chart.points.map((point, index) => <circle key={point.date} className="chart-point" cx={point.x} cy={point.y} r={index === chart.points.length - 1 ? 4 : 2.5}><title>{`${point.date}: ${point.pageViews} page views`}</title></circle>)}
      </svg>
      <div className="chart-axis"><span>{daily[0]?.date}</span><span>{daily.at(-1)?.date}</span></div>
    </div>
  );
}

function ReportTable({ title, rows, loading }) {
  const titleId = `${title.toLowerCase().replace(/\s+/g, "-")}-title`;
  return (
    <section className="report-table" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {loading ? <p className="table-empty">Loading</p> : rows.length ? (
        <table><thead><tr><th scope="col">Name</th><th scope="col">Count</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label}><td>{row.label}</td><td>{formatNumber(row.count)}</td></tr>)}</tbody></table>
      ) : <p className="table-empty">No activity in this range</p>}
    </section>
  );
}

function DashboardError({ message, onRetry }) {
  return (
    <section className="dashboard-error" role="alert"><ServerCog aria-hidden="true" /><div><h2>Analytics unavailable</h2><p>{message}</p></div><button className="button button--secondary" type="button" onClick={onRetry}><RefreshCw size={17} aria-hidden="true" />Retry</button></section>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-CA").format(value || 0);
}

createRoot(document.getElementById("root")).render(<App />);
