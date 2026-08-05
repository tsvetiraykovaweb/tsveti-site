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

## Placeholder routes

| Path            | Purpose                          |
| --------------- | -------------------------------- |
| `/`             | Public home (placeholder)        |
| `/admin`        | Protected admin dashboard shell  |
| `/admin/login`  | Admin login (placeholder)        |

## Documentation

- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Draft database schema](docs/DATABASE_SCHEMA.md)

## Security notes

- Never prefix the service role key with `NEXT_PUBLIC_`.
- Never import `@/lib/supabase/admin` in Client Components.
- Keep `.env.local` out of git (already covered by `.gitignore`).

## Deploy (GitHub + Vercel + Supabase)

Пълни стъпки: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

Бързо:

1. Попълни `.env.local` от `.env.example` (Supabase keys).
2. Push към GitHub: `vemidi-dev/cvetelina-raynova`.
3. Import в Vercel от GitHub; добави същите env vars.
4. Настрой Supabase Auth redirect URLs (localhost + Vercel domain).
