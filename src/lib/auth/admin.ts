import { createClient } from "@/lib/supabase/server";
import { getPublicEnv } from "@/lib/env";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
};

/**
 * Returns the current session user, or null if logged out / Supabase not configured.
 */
export async function getCurrentUser() {
  const { isSupabaseConfigured } = getPublicEnv();
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Loads the admin_profiles row for the current user when they are an active admin.
 */
export async function getAdminProfile(): Promise<AdminProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id, email, full_name, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as AdminProfile;
}

/**
 * True when the signed-in user has an active row in admin_profiles.
 * Authenticated ≠ admin.
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getAdminProfile();
  return profile !== null;
}
