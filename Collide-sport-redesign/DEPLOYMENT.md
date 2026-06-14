# Collide Sport — Deployment & Team Workflow

> **Owner:** SebastianLea (Tech Lead)  
> **Stack:** Vite 5 + React 18 + Tailwind v4 · Hosted on Vercel · Repo: `sebastianboswell123-prog/Collide-sport-redesign-`

---

## 1. Vercel Setup (one-time, done by Tech Lead)

### 1a. Import the repository

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Click **Add New → Project** and import `sebastianboswell123-prog/Collide-sport-redesign-`.
3. Vercel auto-detects Vite. Confirm these settings:

| Setting            | Value           |
|--------------------|-----------------|
| Framework Preset   | Vite            |
| Build Command      | `npm run build` |
| Output Directory   | `dist`          |
| Install Command    | `npm ci`        |

4. Set **Root Directory** to `Collide-sport-redesign` (the subfolder containing `package.json`).
5. Click **Deploy**. The first production build will run.

### 1b. GitHub integration (preview deploys)

Vercel's GitHub App is installed automatically on import. It provides:

- **Preview deploy on every PR** — each PR gets a unique `*.vercel.app` URL posted as a GitHub status check within ~90 seconds of push.
- **Production deploy on merge to `main`** — triggers automatically, no manual step.
- **Deploy cancellation** — pushing new commits to an open PR cancels the previous in-flight build.

No workflow file is needed for preview deploys — Vercel handles it natively.

---

## 2. Production Domain

### 2a. Map `collidesport.co.za` in Vercel

1. In the Vercel project dashboard → **Settings → Domains**.
2. Add `collidesport.co.za` and `www.collidesport.co.za`.
3. Vercel will show the DNS records required. Set these at your domain registrar:

| Type  | Name | Value                        |
|-------|------|------------------------------|
| A     | @    | `76.76.21.21`                |
| CNAME | www  | `cname.vercel-dns.com`       |

4. SSL is provisioned automatically by Vercel (Let's Encrypt). It activates within minutes of DNS propagating (up to 48h for full propagation).
5. Vercel automatically redirects `www` → apex (or apex → `www`, configurable in dashboard).

### 2b. Verify production is live

```bash
curl -I https://collidesport.co.za
# Expected: HTTP/2 200 with x-vercel-id header
```

---

## 3. Performance Budget

The team builds against **Lighthouse 90+ on all four categories** for the three key pages: Home, Catalogue, About.

### Targets

| Category        | Target | CI gate |
|-----------------|--------|---------|
| Performance     | ≥ 90   | Error   |
| SEO             | ≥ 90   | Error   |
| Best Practices  | ≥ 90   | Error   |
| Accessibility   | ≥ 90   | Warning |

### Core Web Vitals targets

| Metric                      | Target       | CI gate |
|-----------------------------|--------------|---------|
| Largest Contentful Paint    | < 2.5 s      | Error   |
| Total Blocking Time         | < 300 ms     | Error   |
| Cumulative Layout Shift     | < 0.1        | Error   |
| First Contentful Paint      | < 2.0 s      | Warning |
| Time to Interactive         | < 3.5 s      | Warning |

**Error** = PR is blocked. **Warning** = PR can merge but issue must be tracked.

### Run Lighthouse locally

```bash
npm run build
npx serve -s dist -l 5173 &
npx lhci autorun
```

Or use Chrome DevTools → Lighthouse tab against `http://localhost:5173` during `npm run dev`.

### What the CI workflow does

`.github/workflows/lighthouse-ci.yml` runs on every PR targeting `main`:
1. Installs deps and runs `npm run build`
2. Serves `dist/` via `serve -s` (SPA routing supported)
3. Runs `@lhci/cli` against `/`, `/catalogue`, `/about`
4. Posts results as a GitHub status check
5. Uploads the full HTML report as a workflow artifact (14-day retention)

To view the report: PR page → **Checks → Lighthouse CI → Summary → Artifacts → lighthouse-report**.

---

## 4. Branch & PR Review Flow

### 4a. Branch naming

```
main                           ← production (protected)
SebastianLea/tech-lead-design  ← Tech Lead working branch
kiang007/<feature-name>        ← Dev 2 feature branches
Lomelele1738/<feature-name>    ← Dev 3 feature branches
```

Do not push directly to `main`. All work must go through a PR.

### 4b. PR checklist (required before requesting review)

Before opening a PR, the author must confirm:

- [ ] `npm run build` passes locally with no errors
- [ ] Lighthouse score ≥ 90 on affected pages (run locally if CI hasn't run yet)
- [ ] No console errors on the feature path (mobile + desktop viewport)
- [ ] All links/routes in the change are valid (no 404s)
- [ ] Mobile layout tested at 375 px (iPhone SE) and 390 px (iPhone 14)
- [ ] Images have `alt` text
- [ ] New components use Tailwind tokens (navy, blue, green, lavender) — no raw hex colours in JSX

### 4c. Review rules

| Rule | Detail |
|------|--------|
| Reviewer | Every PR must be approved by **SebastianLea** before merge |
| Draft PRs | Use draft PRs for work in progress — no review required yet |
| Preview URL | Always include the Vercel preview URL in the PR description |
| Merge strategy | **Squash and merge** — keeps `main` history clean |
| Delete branch | Delete the feature branch after merge |

### 4d. PR description template

```markdown
## What changed
<!-- One paragraph summary -->

## Preview
<!-- Paste the Vercel preview URL here -->
https://collide-sport-redesign-xxxxx.vercel.app

## Acceptance criteria
- [ ] ...

## Lighthouse (if run locally)
| Page | Perf | SEO | A11y | BP |
|------|------|-----|------|----|
| /    |      |     |      |    |
```

---

## 5. Unblocking Protocol

The Tech Lead is responsible for unblocking any BLOCKED task across roles.

### How to flag a blocked task

1. Open a GitHub Issue titled: `[BLOCKED] <task name> — <short reason>`
2. Label it `blocked` and `@mention SebastianLea`
3. Describe: what is blocked, what was tried, what decision/resource/access is needed

### Common block types and resolutions

| Block type | Resolution owner | Typical turnaround |
|---|---|---|
| Merge conflict on `src/pages/Home.jsx` | SebastianLea | Same day — pull `SebastianLea/tech-lead-design` and rebase |
| Missing Vercel preview URL | SebastianLea | Check Vercel dashboard for failed build log |
| Lighthouse CI failing below 90 | Author (with TL help) | See §3 for local debugging steps |
| Real WhatsApp number / VAT number needed | Store owner | `WHATSAPP_NUMBER` in `WhatsAppButton.jsx` + `Footer.jsx`; `VAT_NUMBER` in `Footer.jsx` |
| Formspree ID needed for contact form | Store owner | Replace `YOUR_FORM_ID` in `About.jsx` + `Contact.jsx` |
| New route added but 404 on Vercel | Author | Add route to `src/App.jsx`; `vercel.json` rewrites handle the rest |
| `main` branch build failing | SebastianLea | Hotfix directly on `main` with `[hotfix]` commit prefix |

### High-conflict files (coordinate before touching)

These files are frequently changed by multiple roles — pull latest before editing:

- `src/pages/Home.jsx` — hero, featured products, trust strip
- `src/components/layout/Navbar.jsx` — nav links
- `src/components/layout/Footer.jsx` — links, payment badges, VAT number
- `src/data/products.js` — product catalogue data
- `src/App.jsx` — route table

---

## 6. Environment Variables

No secret environment variables are currently required (the app is fully client-side). If a backend/API is added later, variables must be:

1. Added to Vercel dashboard → **Settings → Environment Variables**
2. Scoped to the correct environment (Production / Preview / Development)
3. Prefixed with `VITE_` to be accessible in the client bundle
4. Never committed to the repo

---

## 7. Quick Reference

```bash
# Local dev
npm run dev                  # http://localhost:5173

# Production build + serve
npm run build
npx serve -s dist -l 5173   # http://localhost:5173

# Lighthouse audit locally
npx lhci autorun             # requires dist/ to exist

# Pull latest from main before starting work
git fetch origin
git rebase origin/main
```

---

_Last updated: 2026-06-12 — SebastianLea_
