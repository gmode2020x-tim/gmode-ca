import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BarChart3,
  CloudSun,
  Download,
  Droplets,
  Film,
  Lock,
  LogOut,
  Mail,
  Map,
  MapPinned,
  Mountain,
  Navigation,
  Play,
  Route,
  Shield,
  Snowflake,
  Sparkles,
} from "lucide-react";
import "./styles.css";

const launchEmail = "tim@gmode.ca";

const tripTypes = [
  {
    name: "Street",
    icon: Route,
    color: "blue",
    copy: "Clean road trips with route cards, distance, duration, and speed context.",
    stats: ["143.6 km", "2:51:09", "63 km/h"],
  },
  {
    name: "Off road",
    icon: Mountain,
    color: "green",
    copy: "Trail rides, imported route groups, and segmented tracks that avoid bad straight-line jumps.",
    stats: ["98.2 km", "2:14:33", "44 km/h"],
  },
  {
    name: "Snow",
    icon: Snowflake,
    color: "ice",
    copy: "Winter routes grouped separately so snowmobile history does not get buried.",
    stats: ["76.8 km", "1:48:24", "42 km/h"],
  },
  {
    name: "Water",
    icon: Droplets,
    color: "cyan",
    copy: "Boat and water routes stay apart from land trips with their own map context.",
    stats: ["32.4 km", "1:02:11", "31 km/h"],
  },
];

const features = [
  {
    icon: Navigation,
    title: "Automatic trip history",
    text: "Record movement into useful trips, then review the routes without digging through raw location data.",
  },
  {
    icon: MapPinned,
    title: "Maps by activity",
    text: "Street, off road, snow, and water views keep the right route types together.",
  },
  {
    icon: BarChart3,
    title: "Readable stats",
    text: "Distance, duration, average speed, route groups, and timeline context are built into every trip card.",
  },
  {
    icon: Shield,
    title: "Private by design",
    text: "The product direction keeps your trip history organized without turning it into a public social feed.",
  },
];

const marketingAssets = [
  {
    title: "Launch Poster",
    size: "1080 x 1350",
    theme: "Every route, sorted.",
    href: "/marketing/gmode-launch-poster.svg",
  },
  {
    title: "Story Ad",
    size: "1080 x 1920",
    theme: "Street. Off road. Snow. Water.",
    href: "/marketing/gmode-story-ad.svg",
  },
  {
    title: "Feature Card",
    size: "1200 x 628",
    theme: "Clean maps. Real history.",
    href: "/marketing/gmode-feature-card.svg",
  },
];

const videoStoryboards = [
  ["01", "Open road", "A clean road route draws itself across a dark map.", "0:00-0:04"],
  ["02", "Trail mode", "The view switches to off-road tracks and route groups.", "0:04-0:08"],
  ["03", "Winter ride", "Snow route stats snap into a dedicated card.", "0:08-0:12"],
  ["04", "Water trip", "A blue water line traces across the map.", "0:12-0:15"],
  ["05", "Organized history", "Trip cards stack by type with distance and duration.", "0:15-0:20"],
  ["06", "Launch soon", "Google Play launch list CTA closes the ad.", "0:20-0:24"],
];

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <Admin />;
  }

  return <PublicSite />;
}

function PublicSite() {
  return (
    <main className="site-shell">
      <Header />
      <Hero />
      <FeatureBand />
      <TripTypes />
      <LaunchSection />
      <MarketingKit />
      <VideoStoryboards />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="GMODE Trip Recorder home">
        <span className="brand-mark">G</span>
        <span>
          <strong>GMODE</strong>
          <small>Trip Recorder</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#features">Features</a>
        <a href="#trips">Trip types</a>
        <a href="#marketing">Marketing kit</a>
        <a href="#video">Videos</a>
      </nav>
      <a className="header-action" href="/admin">
        Login
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1>Every route, sorted the way you ride.</h1>
        <p>
          GMODE Trip Recorder turns movement into clean trip history for street,
          off-road, snow, and water routes. Built for riders, explorers, and
          anyone who wants maps that stay organized.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={`mailto:${launchEmail}?subject=GMODE%20Trip%20Recorder%20Launch%20List`}>
            Join the Google Play launch list
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a className="button secondary" href="#video">
            <Play size={18} aria-hidden="true" />
            Watch the story
          </a>
        </div>
        <dl className="proof-row" aria-label="Product highlights">
          <div>
            <dt>4</dt>
            <dd>Trip modes</dd>
          </div>
          <div>
            <dt>OSRM</dt>
            <dd>Route-ready</dd>
          </div>
          <div>
            <dt>Private</dt>
            <dd>History-first</dd>
          </div>
        </dl>
      </div>
      <div className="hero-visual" aria-label="GMODE Trip Recorder app preview">
        <PhonePreview />
      </div>
    </section>
  );
}

function PhonePreview() {
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-top">
          <span>9:41</span>
          <Lock size={15} aria-hidden="true" />
        </div>
        <div className="app-title">
          <span className="brand-mark small">G</span>
          <div>
            <strong>Trip Recorder</strong>
            <small>Today&apos;s routes</small>
          </div>
        </div>
        <div className="map-preview">
          <svg viewBox="0 0 320 230" role="img" aria-label="Route map preview">
            <path className="contour c1" d="M-10 40 C80 0 120 90 210 54 S330 62 350 8" />
            <path className="contour c2" d="M-20 150 C62 94 138 168 224 118 S310 88 350 144" />
            <path className="contour c3" d="M10 210 C74 162 145 226 220 186 S305 178 344 210" />
            <path className="route-blue" d="M30 178 C72 132 101 151 128 101 C151 58 187 64 210 94 C235 126 262 93 290 50" />
            <path className="route-green" d="M62 52 C102 76 107 116 148 121 C195 128 202 166 245 165 C274 164 280 196 302 204" />
            <circle className="pin blue" cx="30" cy="178" r="9" />
            <circle className="pin green" cx="302" cy="204" r="9" />
          </svg>
        </div>
        <div className="phone-stats">
          <span><strong>187.4</strong> km</span>
          <span><strong>3:42</strong> hrs</span>
          <span><strong>68</strong> km/h</span>
        </div>
        <TripMini title="Mountain Pass Run" mode="Off road" color="green" />
        <TripMini title="Lakeside Explorer" mode="Street" color="blue" />
      </div>
    </div>
  );
}

function TripMini({ title, mode, color }) {
  return (
    <article className={`trip-mini ${color}`}>
      <div>
        <h3>{title}</h3>
        <p>{mode} route</p>
      </div>
      <span>Tracked</span>
    </article>
  );
}

function FeatureBand() {
  return (
    <section className="feature-band" id="features" aria-labelledby="features-title">
      <div className="section-heading">
        <h2 id="features-title">Built for clean route history.</h2>
        <p>Not a generic map dump. GMODE Trip Recorder is structured around how you actually travel.</p>
      </div>
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <feature.icon aria-hidden="true" />
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TripTypes() {
  return (
    <section className="trip-section" id="trips" aria-labelledby="trips-title">
      <div className="section-heading">
        <h2 id="trips-title">Street. Off road. Snow. Water.</h2>
        <p>Each activity gets its own map, metrics, and trip cards.</p>
      </div>
      <div className="trip-grid">
        {tripTypes.map((trip) => (
          <article className={`trip-card ${trip.color}`} key={trip.name}>
            <div className="trip-card-top">
              <trip.icon aria-hidden="true" />
              <span>{trip.name}</span>
            </div>
            <p>{trip.copy}</p>
            <div className="trip-stats">
              {trip.stats.map((stat, index) => (
                <span key={stat}>
                  <strong>{stat}</strong>
                  <small>{["Distance", "Duration", "Avg speed"][index]}</small>
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LaunchSection() {
  return (
    <section className="launch-section" aria-labelledby="launch-title">
      <div className="play-symbol" aria-hidden="true">
        <Play />
      </div>
      <div>
        <h2 id="launch-title">Preparing for Google Play.</h2>
        <p>
          The site is now positioned for the app launch. Join the list for launch
          updates, beta notes, screenshots, and release materials.
        </p>
      </div>
      <a className="button primary" href={`mailto:${launchEmail}?subject=GMODE%20Trip%20Recorder%20Google%20Play%20Launch`}>
        Join launch list
      </a>
    </section>
  );
}

function MarketingKit() {
  return (
    <section className="marketing-section" id="marketing" aria-labelledby="marketing-title">
      <div className="section-heading split">
        <div>
          <h2 id="marketing-title">Marketing kit.</h2>
          <p>Launch-ready creative directions for posts, stories, and feature previews.</p>
        </div>
        <a className="text-action" href="/marketing/gmode-marketing-kit.md">
          <Download size={18} aria-hidden="true" />
          Download copy kit
        </a>
      </div>
      <div className="asset-grid">
        {marketingAssets.map((asset) => (
          <a className="asset-card" href={asset.href} key={asset.title}>
            <img src={asset.href} alt={`${asset.title} preview`} loading="lazy" />
            <span>{asset.size}</span>
            <h3>{asset.title}</h3>
            <p>{asset.theme}</p>
            <ArrowRight className="asset-arrow" size={18} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function VideoStoryboards() {
  return (
    <section className="video-section" id="video" aria-labelledby="video-title">
      <div className="section-heading split">
        <div>
          <h2 id="video-title">Video storyboards.</h2>
          <p>Short launch video structures for reels, ads, and app preview cuts.</p>
        </div>
        <div className="link-stack">
          <a className="text-action" href="/marketing/gmode-launch-preview.mp4">
            <Play size={18} aria-hidden="true" />
            Preview MP4
          </a>
          <a className="text-action" href="/marketing/gmode-video-storyboards.md">
            <Film size={18} aria-hidden="true" />
            View scripts
          </a>
        </div>
      </div>
      <div className="storyboard-grid">
        {videoStoryboards.map(([number, title, copy, timing]) => (
          <article className="storyboard-card" key={number}>
            <span>{number}</span>
            <div className="story-visual" aria-hidden="true">
              <CloudSun />
              <Map />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <small>{timing}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand-lockup" href="#top">
        <span className="brand-mark">G</span>
        <span>
          <strong>GMODE</strong>
          <small>Trip Recorder</small>
        </span>
      </a>
      <p>App-focused launch site for GMODE Trip Recorder.</p>
      <a href={`mailto:${launchEmail}`}>
        <Mail size={18} aria-hidden="true" />
        {launchEmail}
      </a>
    </footer>
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
          GMODE
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
              <p>Public homepage is focused on GMODE Trip Recorder and the Google Play launch path.</p>
            </article>
            <article>
              <h2>Contact</h2>
              <p>Primary public contact is {launchEmail}.</p>
            </article>
            <article>
              <h2>Next</h2>
              <p>Add Play Store links, beta signup, and live app screenshots when the release assets are ready.</p>
            </article>
          </div>
          <button className="button secondary admin-button" type="button" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
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
            <button className="button primary" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Signing in" : "Sign in"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
