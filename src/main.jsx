import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bluetooth,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Download,
  Gauge,
  Github,
  House,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Radio,
  Settings2,
  ShieldCheck,
  Smartphone,
  Wifi,
} from "lucide-react";
import "./styles.css";

const launchEmail = "tim@gmode.ca";
const githubProfile = "https://github.com/gmode2020x-tim";
const githubRepository = "https://github.com/gmode2020x-tim/gmode-trip-recorder";
const githubRelease = `${githubRepository}/releases/tag/v2.0.0`;
const githubInstallZip = `${githubRepository}/releases/download/v2.0.0/GMODE-Trip-Recorder-v2.0.0-install.zip`;

const cockpitViews = [
  {
    id: "attitude",
    label: "3D attitude",
    image: "/app/01-attitude-dashboard.png",
    alt: "GMODE Trip Recorder live 3D attitude cockpit on a Samsung Galaxy S24",
    caption: "Live pitch, roll, course and stability in one central instrument.",
  },
  {
    id: "warning",
    label: "Limit warning",
    image: "/app/02-limit-warning.png",
    alt: "GMODE Trip Recorder red attitude limit warning bezel",
    caption: "The full bezel changes at your configurable caution and limit angles.",
  },
  {
    id: "speed",
    label: "Street speed",
    image: "/app/03-speed-street.png",
    alt: "GMODE Trip Recorder street speed gauge with truck scene",
    caption: "Logical gauge scales and a vehicle scene matched to the trip type.",
  },
  {
    id: "water",
    label: "Water course",
    image: "/app/04-water-course.png",
    alt: "GMODE Trip Recorder water attitude gauge with mini jet boat",
    caption: "The same cockpit follows you from the road to snow, trail and water.",
  },
];

const tripModes = [
  ["Street", "Truck", "Road", "S"],
  ["Off road", "SxS or Sand rail", "Dirt or dunes", "O"],
  ["Snow", "Snowmobile", "Snow trail", "N"],
  ["Water", "Mini jet boat", "Open water", "W"],
];

const productFeatures = [
  {
    icon: House,
    title: "Automatic recording",
    text: "Opt-in GPS and home Wi-Fi departure detection can start and stop a trip without turning every drive into a phone task.",
  },
  {
    icon: Settings2,
    title: "Your cockpit",
    text: "Choose and reorder 13 gauges, calibrate the phone mount, select a colour theme and configure all six side buttons.",
  },
  {
    icon: Download,
    title: "Export your data",
    text: "Save retained trips as GPX, KML, GeoJSON or full-telemetry CSV for navigation, mapping and analysis.",
  },
  {
    icon: CloudCog,
    title: "Home Assistant sync",
    text: "Connect your own Home Assistant server for authenticated trip uploads and automatic retry when the network returns.",
  },
];

function App() {
  return window.location.pathname.startsWith("/admin") ? <Admin /> : <PublicSite />;
}

function PublicSite() {
  return (
    <main className="site-shell">
      <Header />
      <Hero />
      <ProofStrip />
      <CockpitSection />
      <TripModes />
      <FeatureSection />
      <PrivacySection />
      <LaunchSection />
      <Footer />
    </main>
  );
}

function Brand({ compact = false }) {
  return (
    <span className={`brand-lockup${compact ? " compact" : ""}`}>
      <img src="/app/app-icon-512.png" alt="" width={compact ? 42 : 54} height={compact ? 42 : 54} />
      <span>
        <strong>GMODE</strong>
        <small>Trip Recorder</small>
      </span>
    </span>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a href="#top" aria-label="GMODE Trip Recorder home"><Brand compact /></a>
      <nav aria-label="Primary navigation">
        <a href="#cockpit">Cockpit</a>
        <a href="#modes">Trip modes</a>
        <a href="#features">Features</a>
        <a href="#privacy">Privacy</a>
      </nav>
      <a className="outline-action" href={githubRelease} target="_blank" rel="noreferrer">
        Official GitHub download
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1>Your phone.<br />Your cockpit.</h1>
        <p>Offline-first GPS trip recording, live S24 telemetry, 3D attitude, and Home Assistant sync.</p>
        <div className="hero-actions">
          <a className="button primary" href={githubRelease} target="_blank" rel="noreferrer"><Github size={18} aria-hidden="true" />Download on GitHub</a>
          <a className="button secondary" href="#cockpit">See the cockpit<ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <p className="device-note"><Smartphone size={17} aria-hidden="true" />Designed around the Galaxy S24 in landscape. Supports Android 10+.</p>
      </div>
      <div className="hero-media">
        <img src="/app/01-attitude-dashboard.png" alt="GMODE Trip Recorder v2 cockpit showing live 3D attitude on a Galaxy S24" width="1920" height="1080" />
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [[Wifi, "Offline first"], [Gauge, "13 live gauges"], [MapPin, "4 trip modes"], [ShieldCheck, "No ads"]];
  return (
    <section className="proof-strip" aria-label="Product highlights">
      {items.map(([Icon, label]) => <div key={label}><Icon aria-hidden="true" /><span>{label}</span></div>)}
    </section>
  );
}

function CockpitSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = cockpitViews[activeIndex];
  function showOffset(offset) {
    setActiveIndex((current) => (current + offset + cockpitViews.length) % cockpitViews.length);
  }
  return (
    <section className="cockpit-section" id="cockpit" aria-labelledby="cockpit-title">
      <div className="section-heading">
        <h2 id="cockpit-title">A real instrument panel, built from the S24 sensors.</h2>
        <p>GMODE opens directly into a full-screen landscape cockpit. GPS course, magnetic heading, speed, altitude, pitch, roll, satellites, battery, network and recording state stay visible without changing screens.</p>
      </div>
      <div className="cockpit-stage">
        <figure>
          <img src={active.image} alt={active.alt} width="1920" height="1080" />
          <figcaption><strong>{active.label}</strong><span>{active.caption}</span></figcaption>
        </figure>
        <button className="gallery-arrow previous" type="button" onClick={() => showOffset(-1)} aria-label="Previous cockpit view"><ChevronLeft aria-hidden="true" /></button>
        <button className="gallery-arrow next" type="button" onClick={() => showOffset(1)} aria-label="Next cockpit view"><ChevronRight aria-hidden="true" /></button>
      </div>
      <div className="cockpit-tabs" role="tablist" aria-label="Cockpit screenshots">
        {cockpitViews.map((view, index) => (
          <button key={view.id} type="button" role="tab" aria-selected={activeIndex === index} onClick={() => setActiveIndex(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{view.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function TripModes() {
  return (
    <section className="modes-section" id="modes" aria-labelledby="modes-title">
      <div className="section-heading centered"><h2 id="modes-title">Four trip modes. One cockpit.</h2><p>The central vehicle and scene follow the trip you choose.</p></div>
      <div className="mode-rail">
        {tripModes.map(([name, vehicle, scene, code]) => (
          <article key={name}>
            <span className="mode-code" aria-hidden="true">{code}</span><h3>{name}</h3>
            <dl><div><dt>Vehicle</dt><dd>{vehicle}</dd></div><div><dt>Scene</dt><dd>{scene}</dd></div></dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="feature-intro">
        <h2 id="features-title">It records the whole trip, even when the network disappears.</h2>
        <p>Every route point is stored on the phone first. Connectivity can drop on a trail, snow route or water crossing without ending the recording.</p>
        <div className="telemetry-list" aria-label="Recorded telemetry">
          <span>GPS accuracy</span><span>Altitude</span><span>Speed</span><span>Bearing</span><span>Satellites</span><span>Barometer</span><span>Motion</span><span>Battery</span><span>Network</span>
        </div>
      </div>
      <div className="feature-list">
        {productFeatures.map(({ icon: Icon, title, text }, index) => (
          <article key={title}><span className="feature-number">{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>
        ))}
      </div>
    </section>
  );
}

function PrivacySection() {
  return (
    <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
      <div className="privacy-mark" aria-hidden="true"><LockKeyhole /></div>
      <div><h2 id="privacy-title">No ads. No account.<br />No GMODE cloud.</h2><p>GMODE has no advertising, analytics or account system. Your data stays on the phone unless you export it or send it to the Home Assistant server you configure.</p></div>
      <div className="privacy-signals" aria-label="Privacy commitments">
        <span><Radio aria-hidden="true" />Local-first storage</span><span><Bluetooth aria-hidden="true" />Your connections</span><span><ShieldCheck aria-hidden="true" />Your data</span>
      </div>
    </section>
  );
}

function LaunchSection() {
  return (
    <section className="launch-section" id="launch" aria-labelledby="launch-title">
      <Brand />
      <div><h2 id="launch-title">Built for the road.<br />Ready for anything.</h2><p>GMODE Trip Recorder v2.0 is preparing for Google Play. Public GitHub releases are the official download source.</p></div>
      <div className="launch-actions">
        <a className="button primary" href={githubInstallZip} target="_blank" rel="noreferrer"><Download size={18} aria-hidden="true" />Download v2.0</a>
        <a className="release-link" href={githubRelease} target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" />Release notes + checksums</a>
        <a className="email-link" href={`mailto:${launchEmail}`}><Mail size={17} aria-hidden="true" />{launchEmail}</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} GMODE</p>
      <div><a href={githubProfile} target="_blank" rel="noreferrer">GitHub profile</a><a href={githubRelease} target="_blank" rel="noreferrer">Official downloads</a><a href="/marketing/gmode-marketing-kit.md">Media kit</a><a href="/admin">Admin</a></div>
    </footer>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me").then((response) => (response.ok ? response.json() : null)).then((data) => {
      setSession(data);
      setStatus(data ? "signed-in" : "signed-out");
    }).catch(() => setStatus("signed-out"));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setStatus("submitting");
    const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
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
      <header className="admin-header"><a href="/"><Brand compact /></a><a className="admin-public-link" href="/">Public site <ArrowRight size={18} aria-hidden="true" /></a></header>
      {status === "checking" ? (
        <section className="login-panel"><p>Checking session</p></section>
      ) : session ? (
        <section className="admin-console">
          <p className="admin-status">Signed in as {session.email}</p><h1>Owner console</h1>
          <div className="admin-grid">
            <article><h2>Public site</h2><p>The website now matches the real GMODE Trip Recorder v2.0 cockpit and S24 workflow.</p></article>
            <article><h2>Launch</h2><p>Google Play is shown as coming soon. Public GitHub releases are the official download source, and contact mail goes to {launchEmail}.</p></article>
            <article><h2>Source</h2><p>App screenshots and product claims are sourced from the current Jarvis Android project.</p></article>
          </div>
          <button className="button secondary" type="button" onClick={handleLogout}><LogOut size={18} aria-hidden="true" />Sign out</button>
        </section>
      ) : (
        <section className="login-panel" aria-labelledby="login-heading">
          <h1 id="login-heading">Tim login</h1><p>Private access for managing gmode.ca.</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error ? <p className="form-error">{error}</p> : null}
            <button className="button primary" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Signing in" : "Sign in"}</button>
          </form>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
