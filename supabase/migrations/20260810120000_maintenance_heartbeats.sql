-- Lightweight heartbeat table for scheduled Supabase connectivity checks.
-- No personal data. Writes via service role (Vercel cron); admins can read status.

CREATE TABLE public.maintenance_heartbeats (
  id text PRIMARY KEY,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  run_count integer NOT NULL DEFAULT 1,
  last_status text,
  last_error text
);

ALTER TABLE public.maintenance_heartbeats ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintenance_heartbeats_admin_select
  ON public.maintenance_heartbeats
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Atomic upsert for cron (service_role bypasses RLS; not exposed to anon clients).
CREATE OR REPLACE FUNCTION public.record_maintenance_heartbeat()
RETURNS public.maintenance_heartbeats
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.maintenance_heartbeats;
BEGIN
  INSERT INTO public.maintenance_heartbeats (id, last_seen_at, run_count, last_status, last_error)
  VALUES ('supabase-heartbeat', now(), 1, 'ok', NULL)
  ON CONFLICT (id) DO UPDATE SET
    last_seen_at = excluded.last_seen_at,
    run_count = maintenance_heartbeats.run_count + 1,
    last_status = 'ok',
    last_error = NULL
  RETURNING * INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.record_maintenance_heartbeat() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_maintenance_heartbeat() TO service_role;
