import { redirect } from "next/navigation";
import { getAdminProfile, getCurrentUser, isAdmin } from "@/lib/auth/admin";
import { getPublicEnv } from "@/lib/env";
import { AdminLogoutButton } from "@/components/admin/logout-button";

/**
 * Protected admin layout.
 * - No session → /admin/login
 * - Session but not in admin_profiles → /admin/unauthorized
 * - Active admin → render children
 *
 * Route group `(protected)` keeps `/admin/login` outside this layout.
 */
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSupabaseConfigured } = getPublicEnv();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-full bg-bg-secondary">
        <header className="border-b border-border bg-bg px-6 py-4">
          <p className="font-heading text-xl text-primary">Админ панел</p>
          <p className="text-sm text-text-muted">
            Supabase env vars липсват — конфигурирай `.env.local` / Vercel.
          </p>
        </header>
        <div className="px-6 py-8">{children}</div>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/unauthorized");
  }

  const profile = await getAdminProfile();

  return (
    <div className="min-h-full bg-bg-secondary">
      <header className="flex items-start justify-between gap-4 border-b border-border bg-bg px-6 py-4">
        <div>
          <p className="font-heading text-xl text-primary">Админ панел</p>
          <p className="text-sm text-text-muted">
            {profile?.full_name ?? profile?.email ?? user.email}
          </p>
        </div>
        <AdminLogoutButton />
      </header>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
