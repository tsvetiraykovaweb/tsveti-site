import { redirect } from "next/navigation";
import Link from "next/link";
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
          <p className="font-heading text-xl text-primary">
            <Link href="/admin" className="hover:opacity-80">
              Админ панел
            </Link>
          </p>
          <p className="text-sm text-text-muted">
            {profile?.full_name ?? profile?.email ?? user.email}
          </p>
          <nav className="mt-2 flex flex-wrap gap-4 text-sm">
            <Link
              href="/admin"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Табло
            </Link>
            <Link
              href="/admin/site-settings"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Настройки
            </Link>
            <Link
              href="/admin/services"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Услуги
            </Link>
            <Link
              href="/admin/faqs"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              FAQ
            </Link>
            <Link
              href="/admin/testimonials"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Отзиви
            </Link>
            <Link
              href="/admin/consultation-requests"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Заявки
            </Link>
            <Link
              href="/admin/media"
              className="text-text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              Медия
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </header>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
