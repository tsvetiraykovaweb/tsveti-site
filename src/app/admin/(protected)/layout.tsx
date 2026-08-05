import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Protected admin layout placeholder.
 * Full CMS auth/roles will be implemented later.
 *
 * Route group `(protected)` keeps `/admin/login` outside this layout
 * so unauthenticated users can reach the login page.
 */
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabase) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }
  }

  return (
    <div className="min-h-full bg-bg-secondary">
      <header className="border-b border-border bg-bg px-6 py-4">
        <p className="font-heading text-xl text-primary">Админ панел</p>
        <p className="text-sm text-text-muted">
          Защитен layout (placeholder) — CMS предстои
        </p>
      </header>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
