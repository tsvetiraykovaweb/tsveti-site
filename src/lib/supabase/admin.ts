import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with the service role key.
 *
 * NEVER import this module from Client Components or any browser code.
 * NEVER expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_* variables.
 *
 * Use only in trusted server contexts (Server Actions, Route Handlers,
 * scripts) when elevated privileges are required.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
