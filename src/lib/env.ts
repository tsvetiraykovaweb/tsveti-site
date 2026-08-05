/**
 * Public env vars required for Supabase in the browser and SSR.
 * Server-only vars (e.g. SUPABASE_SERVICE_ROLE_KEY) are validated where used.
 */
export function getPublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    supabaseUrl: url,
    supabaseAnonKey: anonKey,
    siteUrl,
    isSupabaseConfigured: Boolean(url && anonKey),
  };
}
