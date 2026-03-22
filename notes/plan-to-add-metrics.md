# Adding Analytics to My Astro Site

## Problem Statement

My website has no analytics. I can't see which pages are popular, where visitors come from, or how they interact with content. I want visibility into:

1. Page views per page
2. Load speed / Core Web Vitals
3. 404 errors
4. Device/browser breakdown (mobile vs desktop)
5. Exit pages — where people leave
6. Click heatmaps — what do people click on?
7. Reading time — are blog posts too long/short?
8. Time on page — are people actually reading?
9. Scroll depth — how far down do they get?
10. Bounce rate — do they leave immediately?
11. Pages per session — are they exploring?
12. Return visitors vs new
13. Traffic sources — organic search, direct, referral, social, email
14. Top landing pages — where people enter the site
15. Search keywords — what queries bring people in

Constraints:
- Must cost $0/month
- Prefer not to rely on Google or Microsoft products
- Okay to write code from scratch
- Visitor data must not be sent to third-party analytics providers. Using a hosting provider (Railway, Fly.io, Render, etc.) to run self-controlled infrastructure is acceptable — the distinction is whether a third party processes or has access to the data vs. merely running the server.
- All infrastructure must be defined as code (IaC) — no clickops. The entire setup should be reproducible by running a command, not by following a checklist of manual steps. This makes it easy to rebuild from scratch, replicate, and understand what's running when something breaks.

---

## Solutions

### Option A: Self-hosted Umami
**Effort: medium | Cost: $0**

Umami is a lightweight open source analytics tool. Privacy-focused, no cookies by default, GDPR-friendly. It's a separate deployment from the Astro site — you just add a `<script>` tag to `BaseLayout.astro` pointing at your Umami instance.

**Deployment options:**

| Option | Notes | IaC |
|--------|-------|-----|
| Railway (one-click template) | Easiest — Umami maintains an official Railway template that provisions the app + Postgres together. | Weak. Railway has a CLI but no proper config-as-code file. Setup is largely clickops. |
| Fly.io | Free tier includes 3 shared VMs + small Postgres. More CLI-driven. | Good. Config lives in `fly.toml` in your repo. Deploy with `fly deploy`. |
| Render | Free web service tier exists but spins down after inactivity — will drop events during cold starts. Not recommended. | Moderate. Supports a `render.yaml` blueprint file, but less mature than Fly.io. |
| VPS + Docker | Rent a VPS (Oracle Cloud always-free tier, or Hetzner at ~€4/mo), run Umami and Postgres as Docker containers via `docker-compose`. Most control, no platform lock-in. Umami ships an official `docker-compose.yml`. | Best. `docker-compose.yml` is fully declarative. Pair with Terraform/OpenTofu to provision the VPS itself. Entire setup lives in git. |
| Homelab k3s cluster (starcommand) | Deploy Umami as a Kubernetes manifest (`services/umami.yml`) to the existing k3s cluster. No new infra needed — Traefik handles routing, Grafana is already running. Requires the homelab to be publicly reachable (port forwarding + DDNS). | Best. IaC is already fully solved by starcommand. Adding Umami is just a `kubectl apply`. |

Covers: 1, 4, 5, 8, 10, 11, 12, 13, 14
Doesn't cover: 2, 3, 6 (no heatmaps), 7, 9, 15

Tradeoff: No heatmaps. You manage the hosting infra.

---

### Option B: Hand-rolled
**Effort: high | Cost: $0**

Build your own event tracking pipeline. You own everything: the data, the schema, the dashboard. This site already had a partial implementation (a Netlify edge function posting page views to Supabase), so there's a head start.

The first architectural decision — runtime — determines what else is available to you.

---

#### Path 1: Serverless

Edge functions (Netlify, Cloudflare Workers, Vercel) receive POST requests from the client and write to an external database. No persistent server required. Closest to what this site already had.

**IaC:** Good. Netlify config lives in `netlify.toml`, Cloudflare in `wrangler.toml`. The edge function code itself is in the repo. Database schema can be managed with versioned migration files. Nothing requires clickops.

**Pick a database:**

| Option | Notes |
|--------|-------|
| Postgres on Neon | Generous free tier, doesn't pause on inactivity |
| Postgres on Supabase | Free tier pauses after 1 week of inactivity — bad for a quiet personal site |
| Postgres on Railway/Render | Free tiers available, you manage the instance |
| Turso (hosted SQLite) | Free tier, doesn't pause, accessed via HTTP — works well with serverless |

**Pick a visualization tool:**

| Option | Notes |
|--------|-------|
| Custom Astro dashboard | A password-protected `/analytics` route that queries the DB directly. Most flexible. |
| Metabase (self-hosted) | Open source BI tool. Connect to your Postgres DB and build dashboards without writing SQL. Free to self-host on Railway/Render. |
| Grafana (self-hosted) | Has a Postgres datasource. More ops overhead than Metabase. Free to self-host. |

**Note:** Prometheus is not compatible with this path. Prometheus works by scraping a persistent metrics endpoint — serverless functions are ephemeral and can't expose one.

---

#### Path 2: Persistent server

Run Astro in SSR mode on a persistent host (Railway, Render, Fly.io — all have free tiers). More ops overhead, but opens up options that aren't possible with serverless.

**IaC:** Depends on host. Fly.io (`fly.toml`) and a VPS + Docker (`docker-compose.yml` + Terraform) are both fully declarative. Railway is weak on this front. If IaC is a priority, Fly.io or VPS + Docker are the right picks here too.

**Pick a database:**

| Option | Notes |
|--------|-------|
| All options from Path 1 | Still fully compatible |
| Local SQLite file | Simplest possible setup — no external service, just a file on disk. Only works with a persistent server. |
| Prometheus TSDB | Prometheus scrapes a `/metrics` endpoint you expose on your server. Stores its own time-series data — you don't manage a separate DB. Tightly coupled to Grafana for visualization. |

**Pick a visualization tool:**

| Option | Notes |
|--------|-------|
| All options from Path 1 | Still compatible with Postgres/SQLite |
| Grafana + Prometheus | The standard pairing if you go the Prometheus route. Prometheus is the datasource, Grafana is the dashboard. |

---

#### How each metric works client-side

Regardless of which path you take, the client-side tracking is the same. Events are POSTed from `BaseLayout.astro` to your endpoint.

*Page views, time on page, bounce rate, pages per session* — fire a `pageview` event on load with a session ID (stored in `sessionStorage`), and a `pageleave` event on `beforeunload` with time elapsed. Session ID ties them together.

*Scroll depth* — place invisible marker elements at 25/50/75/100% of page height, observe with `IntersectionObserver`, fire a `scroll` event when each becomes visible.

*Traffic sources* — read `document.referrer` on load and bucket it (empty = direct, known search engines = organic, known social domains = social, else = referral). UTM params (`?utm_source=`) cover cases where referrer is stripped.

*Return visitors vs new* — store a flag in `localStorage` on first visit. Include `visitor: "returning"` in subsequent event payloads.

*Click heatmaps* — listen to `click` events, record `x`/`y` as percentages of page dimensions. To visualize, render a canvas overlay colored by click density. This is the most complex metric to visualize.

*404 errors* — fire a custom event from the 404 page.

*Load speed / Core Web Vitals* — use the `web-vitals` npm package (`onLCP`, `onFID`, `onCLS`), send values as events.

*Device/browser breakdown* — read `navigator.userAgent` on the client or the `User-Agent` header server-side.

*Search keywords* — not possible without Google Search Console regardless of approach.

**Covers:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 (everything except 15)

**Tradeoff:** Significant upfront build time. You maintain it forever.

---

### Recommendation

**If you have your homelab (starcommand) publicly reachable:** deploy Umami there as a k8s manifest. Zero new infra, IaC already solved, $0 forever. Just add a `<script>` tag to `BaseLayout.astro`. Tradeoff: analytics go down when the homelab goes down.

**If you want something more reliable:** self-hosted Umami on Fly.io or VPS + Docker is the next best option. Covers the same metrics with better uptime guarantees.

**If you want full coverage** (heatmaps, scroll depth, everything): go with Option B hand-rolled, Path 1 (serverless) — closest to what this site already had.

Add **Google Search Console** separately for search keyword data (item 15) — that requires Google verification regardless of which approach you use.
