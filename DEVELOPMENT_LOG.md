# Development Log — Цветелина Райнова

Shared project memory for Cursor / Codex / developers.  
**Convention:** newest entries at the **top**. Append a new dated entry after every meaningful change; do not rewrite history.

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
