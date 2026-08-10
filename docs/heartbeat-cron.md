# Supabase heartbeat cron

Scheduled lightweight check that keeps minimal activity on the Supabase Free project and verifies database connectivity from production.

## What it does

- Vercel Cron calls `GET /api/cron/supabase-heartbeat` **3× per week** (Mon / Wed / Fri at **07:00 UTC**).
- The route is protected with `CRON_SECRET` (`Authorization: Bearer …`).
- Server-side code upserts one row in `maintenance_heartbeats` (`id = supabase-heartbeat`):
  - updates `last_seen_at`
  - increments `run_count`
  - sets `last_status = ok` (or `error` on failure)
- **No personal data** is stored.

## Schedule

`vercel.json`:

```json
"schedule": "0 7 * * 1,3,5"
```

Numeric day-of-week: `1` = Monday, `3` = Wednesday, `5` = Friday.

## Environment variables

| Variable | Where | Notes |
| -------- | ----- | ----- |
| `CRON_SECRET` | Vercel **Production** (and local for manual tests) | Random long string; never commit |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel Production (server-only) | Used by heartbeat upsert; never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Already required for the site |

Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` when invoking cron jobs (if `CRON_SECRET` is set in the project).

## Database

Apply migration:

`supabase/migrations/20260810120000_maintenance_heartbeats.sql`

Table: `public.maintenance_heartbeats`  
RPC: `record_maintenance_heartbeat()` (service role only)

Admins can read the row in `/admin/readiness`.

## Manual testing

1. Set `CRON_SECRET` in `.env.local` (and restart `next dev`).
2. Apply the migration in Supabase SQL Editor.
3. **Without header** — expect `401`:

```bash
curl -s http://localhost:3000/api/cron/supabase-heartbeat
```

4. **With header** — expect `200` and JSON with `status: "ok"`:

```bash
curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/supabase-heartbeat
```

5. In Supabase → Table Editor → `maintenance_heartbeats` — confirm row `supabase-heartbeat` exists and `run_count` increased.

Production test (after deploy + env vars):

```bash
curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://YOUR_DOMAIN/api/cron/supabase-heartbeat
```

## Vercel cron logs

- Vercel Dashboard → your project → **Logs** (filter by cron / `/api/cron/supabase-heartbeat`)
- Or **Deployments** → Production deployment → **Functions** / runtime logs

**Important:** Vercel Cron runs on **Production** deployments only (not Preview). Hobby plan allows daily cron jobs; this schedule is 3×/week.

## Admin readiness

`/admin/readiness` shows:

- `CRON_SECRET` configured / missing (value never shown)
- last heartbeat time, `run_count`, `last_status`
