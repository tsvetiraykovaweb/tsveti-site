# Production checklist — Цветелина Райнова

Quick readiness check before relying on production admin login / CMS.

## Vercel environment variables

Set in **Project → Settings → Environment Variables** for **Production**, **Preview**, and **Development**:

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | anon / public key (safe for browser) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, e.g. `https://your-app.vercel.app` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | **Never** prefix with `NEXT_PUBLIC_`. Never import in Client Components. Use only via `src/lib/supabase/admin.ts` when elevated privileges are required. Normal CMS edits use the logged-in admin session + RLS (anon key). |

Local mirror: copy `.env.example` → `.env.local` (never commit `.env.local`).

## Vercel project settings

| Setting | Value |
| ------- | ----- |
| Framework Preset | **Next.js** |
| Root Directory | **`./`** |
| Production Branch | `main` |

## Supabase Auth URLs

**Authentication → URL Configuration**

| Field | Example |
| ----- | ------- |
| Site URL | `https://your-production-domain.vercel.app` |
| Redirect URLs | `http://localhost:3000/**` |
| | `https://your-production-domain.vercel.app/**` |
| | `https://*.vercel.app/**` |

## Database / CMS

- [ ] Migration `20260805150000_initial_cms_schema.sql` applied
- [ ] Seed `supabase/seed/001_initial_content.sql` applied (optional but recommended)
- [ ] At least one row in `admin_profiles`
- [ ] `/admin/login` works on production with admin credentials

## Security

- [ ] Service role key not in any `NEXT_PUBLIC_*` var
- [ ] Service role not visible in client bundles
- [ ] Deployment Protection disabled if the public site must be open without Vercel login

## Smoke test

1. Open production `/` — homepage loads.
2. Open `/admin/login` — sign in as admin → `/admin`.
3. Open `/admin/site-settings` — save a change.
4. Sign out → `/admin` redirects to login.
