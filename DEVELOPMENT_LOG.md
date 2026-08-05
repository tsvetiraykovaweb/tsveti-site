# Development Log — Цветелина Райнова

Shared project memory for Cursor / Codex / developers.  
**Convention:** newest entries at the **top**. Append a new dated entry after every meaningful change; do not rewrite history.

---

## 2026-08-05 — GitHub complete; Supabase/Vercel accounts only (not configured)

**Status:** `tsvetiraykovaweb/tsveti-site` live on GitHub. Supabase + Vercel: registered but no project/env/deploy yet.

### Confirmed ready
- GitHub: https://github.com/tsvetiraykovaweb/tsveti-site (`main`, full codebase)

### Not done yet
- Supabase: no project, no `.env.local`
- Vercel: no client project, CLI still on vemidi account locally

### Next (user)
1. Create Supabase project → `.env.local`
2. Vercel: client login → import repo → env vars → deploy
3. Supabase Auth URLs with Vercel production URL

---

## 2026-08-05 — GitHub push verified; Vercel/Supabase still pending locally

**Status:** Code on `tsvetiraykovaweb/tsveti-site` ✅; local Supabase env and Vercel client link ❌

### Verified
- `gh auth` → **tsvetiraykovaweb**
- Remote `origin` → `tsvetiraykovaweb/tsveti-site`
- GitHub repo not empty; `main` pushed
- Doc updates committed and pushed

### Not ready yet (local check)
- No `.env.local` — Supabase keys not configured locally
- No `.vercel` — project not linked locally
- `vercel whoami` → still **vemidicrafts-3485** / team **ve-mi-di** (vemidi, not client)

### Next for user
1. Supabase: `.env.local` from `.env.example`
2. Vercel: login with **client** account → import `tsvetiraykovaweb/tsveti-site` in dashboard
3. Or locally: `vercel logout` → `vercel login` (client) → `vercel link`

### Checks
- `gh repo view tsvetiraykovaweb/tsveti-site` — OK, has files
- `git push` — OK after tsvetiraykovaweb auth
- Vercel project for tsveti-site on ve-mi-di — not found

---

## 2026-08-05 — Link to tsvetiraykovaweb/tsveti-site (push pending)

**Status:** `origin` → `tsvetiraykovaweb/tsveti-site`; push blocked — local `gh` still authenticated as `vemidi-dev`.

### Completed
- Confirmed empty repo https://github.com/tsvetiraykovaweb/tsveti-site
- Added `git remote origin` → `tsvetiraykovaweb/tsveti-site`
- Updated `docs/DEPLOYMENT.md` and `README.md` with client GitHub account

### Blocker
- `git push` → 403: Permission denied to `vemidi-dev`
- User must `gh auth login` as **tsvetiraykovaweb**, then `git push -u origin main`

### Checks
- `gh repo view tsvetiraykovaweb/tsveti-site` — OK (empty repo)
- `git push` — failed (wrong GitHub account)

### Next
1. `gh auth login` as tsvetiraykovaweb
2. `git push -u origin main`
3. Vercel import from `tsvetiraykovaweb/tsveti-site`

---

## 2026-08-05 — Disconnect from vemidi accounts (client-only setup)

**Status:** Local project detached from vemidi GitHub/Vercel; ready for new client accounts.

**Latest update:** 2026-08-05 (UTC+3)

### Summary of completed work
- Removed `git remote origin` (was `vemidi-dev/cvetelina-raynova`).
- Deleted local `.vercel` link folder.
- Removed Vercel project `cvetelina-raynova` from `ve-mi-di` team via CLI.
- Updated `docs/DEPLOYMENT.md`, `README.md`, `.env.example` — generic client-account instructions, no vemidi URLs.
- Added cleanup checklist for leftover vemidi resources.

### Files created or modified
- `docs/DEPLOYMENT.md` — rewritten for new GitHub/Vercel/Supabase accounts
- `README.md` — deploy steps updated
- `.env.example` — removed hardcoded old Vercel URL
- `DEVELOPMENT_LOG.md` — this entry

### Important decisions
| Decision | Reason |
| -------- | ------ |
| Separate client accounts for GitHub, Vercel, Supabase | Client project; no tie to vemidi personal/business profiles |
| Local repo kept; only remotes/links removed | Code stays; re-push under new GitHub when ready |
| Vercel production site on vemidi removed | Old URL no longer valid |

### Environment / setup notes
- **No `git remote`** configured — add when new GitHub repo exists.
- **No `.vercel`** — run `vercel link` after logging into new Vercel account.
- **GitHub repo on vemidi-dev** may still exist — delete manually (see below).

### Known issues / blockers
- **Manual:** Delete GitHub repo `vemidi-dev/cvetelina-raynova` if it still exists:
  https://github.com/vemidi-dev/cvetelina-raynova/settings → Delete repository
  (CLI delete failed — needs `delete_repo` scope / manual action)
- New GitHub, Vercel, Supabase accounts not created yet (user action).

### Checks run
- `git remote -v` — empty (no remotes)
- `Test-Path .vercel` — False
- `vercel remove cvetelina-raynova` — success on ve-mi-di
- `gh repo delete` — failed (403 / scope); manual delete required

### Next recommended steps
1. User deletes vemidi-dev GitHub repo (if present).
2. Create new GitHub org/user + repo for client.
3. Create new Vercel team + import; `vercel link` locally.
4. Create new Supabase project; fill `.env.local`.
5. Push and deploy under new accounts.

### Pending tasks
- [ ] Delete `vemidi-dev/cvetelina-raynova` on GitHub (manual)
- [ ] New GitHub repo + remote + push
- [ ] New Vercel project + env vars
- [ ] New Supabase project + Auth URLs
- [ ] Phase 1 migrations (unchanged)

### Assumptions
- Local git history on `main` is retained for convenience.
- Client will use entirely new credentials; no shared vemidi infra.

---

## 2026-08-05 — GitHub, Vercel, Supabase deployment wiring

**Status:** Phase 0 complete; repo on GitHub, live on Vercel; Supabase env vars still need user keys.

**Latest update:** 2026-08-05 (morning, UTC+3)

### Summary of completed work
- Created private GitHub repo and pushed `main` branch.
- Linked Vercel project `ve-mi-di/cvetelina-raynova` to GitHub (auto-connect on `vercel link`).
- First production deploy succeeded.
- Added `docs/DEPLOYMENT.md` (BG) with full wiring steps.
- Added `supabase/config.toml` for future CLI link/migrations.
- Added `src/lib/env.ts` for public env helper.
- Added `scripts/sync-vercel-env.ps1` to push `.env.local` vars to Vercel.
- Renamed default branch from `master` to `main`.

### Files created or modified
- `docs/DEPLOYMENT.md` (new)
- `supabase/config.toml` (new)
- `src/lib/env.ts` (new)
- `scripts/sync-vercel-env.ps1` (new)
- `package.json` — `supabase:link`, `supabase:login` scripts
- `README.md` — deploy section updated
- `.env.example` — production URL note
- `.gitignore` — duplicate `.vercel` entry removed

### Important decisions
| Decision | Reason |
| -------- | ------ |
| GitHub repo `vemidi-dev/cvetelina-raynova` (private) | Personal/pro site with future admin CMS |
| Vercel team `ve-mi-di` | Existing Vercel account scope |
| No env vars on Vercel yet | Supabase keys not available in session; user must add via Dashboard or sync script |
| `vercel link` auto-connected GitHub | Vercel CLI connected repo on link — no manual dashboard import needed |

### Environment / setup notes
- **GitHub:** https://github.com/vemidi-dev/cvetelina-raynova
- **Vercel production:** https://cvetelina-raynova.vercel.app
- **Vercel dashboard:** https://vercel.com/ve-mi-di/cvetelina-raynova
- **Supabase CLI:** not logged in locally (`supabase login` required)
- User must:
  1. Copy `.env.example` → `.env.local` and add Supabase keys from Dashboard → Settings → API
  2. Set Supabase Auth redirect URLs (see `docs/DEPLOYMENT.md`)
  3. Run `.\scripts\sync-vercel-env.ps1` then `vercel --prod` OR add vars in Vercel dashboard
  4. For migrations later: `npx supabase login` + `npx supabase link --project-ref <ref>`

### Known issues / blockers
- Vercel has **no environment variables** yet — admin auth will not work until Supabase keys are set.
- Supabase redirect URLs must be configured manually in Supabase dashboard.
- Next.js middleware deprecation warning unchanged.

### Checks run
- `vercel --prod` — **passed** (production deploy READY)
- Local `npm run build` — not re-run this session
- `vercel env ls` — confirmed empty (expected until user adds keys)

### Next recommended steps
1. User adds Supabase keys to `.env.local`.
2. User configures Supabase Auth URLs for localhost + Vercel domain.
3. Run `.\scripts\sync-vercel-env.ps1` and redeploy.
4. Phase 1: SQL migrations from `docs/DATABASE_SCHEMA.md`.

### Pending tasks
- [ ] Supabase `.env.local` + Vercel env vars (user action)
- [ ] Supabase Auth redirect URL configuration (user action)
- [ ] `supabase login` + `supabase link` (optional, for migrations)
- [ ] Phase 1 migrations, public site, CMS (unchanged from Phase 0)

### Assumptions
- GitHub account `vemidi-dev` and Vercel team `ve-mi-di` are the correct accounts for this project.
- Private GitHub repo is acceptable (can be made public later).

---

## 2026-08-04 — Development log introduced

**Status:** Phase 0 foundation complete; log file now required as ongoing handoff memory.

### Completed
- Created `DEVELOPMENT_LOG.md` in project root.
- Documented current project state from the initial scaffold (see entry below).

### Files created
- `DEVELOPMENT_LOG.md`

### Decisions
- Newest-first log entries for faster handoff scanning.
- Update this file after every meaningful implementation step.

### Checks
- Build/tests: not re-run for this documentation-only change.

### Next recommended steps
1. Create Supabase project and fill `.env.local` from `.env.example`.
2. Push repo to GitHub; connect Vercel.
3. Begin Phase 1: migrations from `docs/DATABASE_SCHEMA.md`.

### Pending
- Full public site, CMS admin, real auth, SQL migrations, seed content.

---

## 2026-08-04 — Phase 0: Initial project setup

**Status:** Clean foundation scaffolded and verified. No full site/CMS yet.

**Latest update:** 2026-08-04 (evening, UTC+3)

### Summary of completed work
- Confirmed target folder was empty, then scaffolded Next.js App Router + TypeScript + Tailwind CSS v4.
- Installed `@supabase/supabase-js` and `@supabase/ssr`.
- Added brand config with official name **Цветелина Райнова** and configurable `displayName`.
- Applied brand design tokens and fonts (Cormorant Garamond headings, Manrope body).
- Prepared SSR-compatible Supabase clients (browser / server / middleware refresh / server-only service role).
- Added placeholder routes: `/`, `/admin`, `/admin/login`.
- Protected admin shell via route group `admin/(protected)` so login is not redirected into itself.
- Added `.env.example`, README, implementation plan, draft DB schema (docs only — no final SQL).
- Prepared `supabase/migrations/` for future migrations.
- Ran production build successfully; started local dev server.

### Files created or modified
**Scaffold / config**
- `package.json` (name: `cvetelina-raynova`)
- `package-lock.json`
- `next.config.ts` (Supabase Storage image remotePatterns)
- `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`
- `.gitignore` (allows `.env.example`; ignores secret env files)
- `.env.example`
- `README.md`

**App**
- `src/app/layout.tsx` — BG locale, fonts, metadata from brand
- `src/app/globals.css` — centralized brand tokens via CSS vars + `@theme inline`
- `src/app/page.tsx` — home placeholder
- `src/app/admin/login/page.tsx` — login placeholder
- `src/app/admin/(protected)/layout.tsx` — auth gate when env present
- `src/app/admin/(protected)/page.tsx` — admin dashboard placeholder
- `src/middleware.ts` — session refresh via Supabase helper
- `src/components/.gitkeep`

**Lib / types**
- `src/lib/brand.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/admin.ts` (service role — server only)
- `src/types/database.ts` (placeholder; generate from CLI later)

**Docs / Supabase prep**
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DATABASE_SCHEMA.md` (draft model only)
- `supabase/.gitkeep`
- `supabase/migrations/.gitkeep`

### Important decisions
| Decision | Reason |
| -------- | ------ |
| Official name fixed; `displayName` configurable | Site may use „Цвети“ in informal UI without changing legal/SEO default |
| Brand tokens as CSS custom props + Tailwind `@theme inline` | Avoid circular vars; single source for color/font utilities |
| Admin auth in `admin/(protected)` route group | Keeps `/admin/login` outside redirect loop |
| Service role only in `admin.ts`, never `NEXT_PUBLIC_*` | Prevent key exposure in the browser |
| Schema in markdown first, not SQL migrations yet | Approve content model before locking migrations |
| Stack: Next.js 16 + React 19 + Tailwind 4 + Supabase + Vercel/GitHub | Per project requirements |
| Direction: „Спокойна естествена експертност“ | Brand guidance for future UI |

### Environment / setup notes
- Copy `.env.example` → `.env.local` and set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)
- Without Supabase env vars, admin protection is skipped so local browsing of `/admin` works during setup.
- Local URL used at setup: **http://localhost:3000**
- Deploy path: GitHub repo → Vercel import → same env vars in Vercel dashboard.

### Known issues / blockers
- Next.js 16 build warning: `middleware` file convention deprecated in favor of `proxy`. Supabase SSR still uses middleware pattern; left as-is for now — revisit when migrating to Next.js “proxy” convention.
- No real Supabase project / `.env.local` yet — auth and CMS cannot be tested end-to-end.
- No GitHub remote / Vercel project documented as connected yet.
- Placeholder Database types are empty until migrations exist.
- Full site UI and CMS not started (intentional).

### Checks run
- `npm run build` — **passed** (Next.js 16.3.0 / Turbopack).
- `npm run dev` — **started successfully** at http://localhost:3000.
- Automated tests — **not added / not run** (none in project yet).

### Next recommended steps
1. Create Supabase project; add keys to `.env.local`.
2. Create GitHub repository; push; connect Vercel.
3. Phase 1: turn `docs/DATABASE_SCHEMA.md` into first SQL migration(s); enable RLS sketch; generate types.
4. Phase 2: public marketing layout and content-driven pages.
5. Phase 3: real admin login + CMS CRUD.

### Pending tasks
- [ ] Supabase project + env configuration
- [ ] GitHub remote + Vercel deployment wiring
- [ ] SQL migrations + RLS + Storage buckets
- [ ] Generate `src/types/database.ts` from schema
- [ ] Public site pages (home, services, about, FAQ, contact, testimonials)
- [ ] Admin auth UI + role checks
- [ ] CMS editors for text, services, FAQ, testimonials, SEO, CTAs, contact, images
- [ ] Seed Bulgarian placeholder content
- [ ] Address Next.js middleware → proxy deprecation when appropriate

### Assumptions
- Primary locale is Bulgarian (`bg`).
- Single-admin (or few admins) CMS is sufficient at launch; no multi-tenant.
- Content will live in Supabase (not a separate headless CMS).
- Display name may later switch to „Цвети“ via `brand.displayName` and/or `site_settings`.
- No commit/push was required beyond what `create-next-app` initialized locally.
