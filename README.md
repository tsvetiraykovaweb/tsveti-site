# Цветелина Райнова — Website

Production-ready foundation for the personal/professional site of **Цветелина Райнова**.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel · GitHub

Brand direction: *Спокойна естествена експертност*

## Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com) project (for auth, DB, storage — later stages)
- A [Vercel](https://vercel.com) account (for deployment)
- A [GitHub](https://github.com) repository as the source of truth

## Local setup

1. Clone the repository and enter the project folder.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Fill in `.env.local` with your Supabase project URL and keys from the Supabase dashboard → Settings → API.

   - `NEXT_PUBLIC_SUPABASE_URL` — project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key (browser-safe)  
   - `SUPABASE_SERVICE_ROLE_KEY` — **server only**; never expose to the client  
   - `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start local dev server   |
| `npm run build` | Production build         |
| `npm run start` | Serve production build   |
| `npm run lint`  | Run ESLint               |

## Brand display name

Official name is always **Цветелина Райнова**. Short display name (e.g. „Цвети“) is configured in `src/lib/brand.ts` via `displayName`.

## Admin routes

| Path | Purpose |
| ---- | ------- |
| `/` | Public home (placeholder) |
| `/admin` | Protected admin dashboard (requires `admin_profiles`) |
| `/admin/login` | Email/password login (Supabase Auth) |
| `/admin/unauthorized` | Logged in but not an admin |

## Supabase setup (admin)

1. **Apply migration** — Supabase Dashboard → **SQL Editor** → paste  
   `supabase/migrations/20260805150000_initial_cms_schema.sql` → **Run**.

2. **Create Auth user** — **Authentication → Users → Add user** (email + password; Auto Confirm on).

3. **Grant admin** — SQL Editor:

   ```sql
   INSERT INTO public.admin_profiles (id, email, full_name, is_active)
   VALUES (
     'PASTE-USER-UUID-HERE',
     'admin@example.com',
     'Цветелина Райнова',
     true
   );
   ```

4. Open `/admin/login` and sign in. Logout is in the admin header.

Full schema/RLS notes: [docs/supabase-schema.md](docs/supabase-schema.md).

## Vercel environment variables

In the Vercel project (**Settings → Environment Variables**), set for Production / Preview / Development:

| Variable | Notes |
| -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role — server only, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | Production site URL (e.g. `https://your-app.vercel.app`) |

Also set Supabase **Authentication → URL Configuration** Site URL + Redirect URLs for localhost and the Vercel domain.

Framework Preset: **Next.js**. Root Directory: **`./`**.

## Documentation

- [Supabase schema (canonical)](docs/supabase-schema.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Draft schema notes (historical)](docs/DATABASE_SCHEMA.md)

## Security notes

- Never prefix the service role key with `NEXT_PUBLIC_`.
- Never import `@/lib/supabase/admin` in Client Components.
- Keep `.env.local` out of git (already covered by `.gitignore`).

## Deploy (GitHub + Vercel + Supabase)

Пълни стъпки: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

Бързо (с **нови** клиентски акаунти — виж `docs/DEPLOYMENT.md`):

1. Попълни `.env.local` от `.env.example` (Supabase keys).
2. `gh auth login` като **tsvetiraykovaweb** → `git push -u origin main` към `tsvetiraykovaweb/tsveti-site`.
3. Import в **нов** Vercel акаунт; добави env vars.
4. Настрой Supabase Auth redirect URLs (localhost + Vercel domain).
