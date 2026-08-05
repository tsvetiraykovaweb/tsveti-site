# Implementation plan — Цветелина Райкова

Short roadmap after this initial setup. Do not treat as a full product spec.

## Phase 0 — Foundation (done)

- [x] Next.js App Router + TypeScript + Tailwind
- [x] Brand tokens and fonts (Cormorant Garamond / Manrope)
- [x] Configurable display name (`src/lib/brand.ts`)
- [x] Supabase SSR clients (browser, server, middleware, service-role)
- [x] Placeholder routes: `/`, `/admin`, `/admin/login`
- [x] Protected admin layout shell
- [x] `.env.example`, README, draft schema docs
- [x] `supabase/migrations` prepared for SQL later

## Phase 1 — Content model & Supabase

- Create Supabase project; link CLI; add CORS / redirect URLs
- Write and apply first migrations from `docs/DATABASE_SCHEMA.md`
- Generate TypeScript types into `src/types/database.ts`
- Storage buckets for images (public site assets + private drafts if needed)
- Seed default site content (BG copy placeholders)

## Phase 2 — Public site

- Marketing layout (header / footer) with brand-first hero
- Pages driven by CMS content: home, services, about, FAQ, contact, testimonials
- SEO metadata from DB (`site_settings` / `seo` tables)
- Contact details and CTAs from editable content
- Image optimization via Next.js `Image` + Supabase Storage URLs

## Phase 3 — Admin CMS

- Supabase Auth email/password (or magic link) for admins only
- Role check (`profiles.role = 'admin'`) before any write
- CRUD UI for: site text blocks, service pages, FAQ, testimonials, SEO, CTAs, contact, images
- Soft preview / publish workflow (optional `status` + `published_at`)
- Audit: never expose service role to the browser; use Server Actions + RLS

## Phase 4 — Hardening & launch

- RLS policies reviewed; service role only for privileged server paths
- Vercel production env vars; custom domain
- Analytics / form handling (e.g. contact form → email or Supabase table)
- Performance, a11y, OG images
- Content handoff to Цветелина

## Conventions

- Official name: **Цветелина Райкова**; short label via `brand.displayName`
- Locale default: `bg`
- Design direction: спокойна естествена експертност — use existing CSS tokens
- Prefer Server Components; Client Components only for interactive admin forms
