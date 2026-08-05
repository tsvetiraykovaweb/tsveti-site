import { redirect } from "next/navigation";
import { brand } from "@/lib/brand";
import { getCurrentUser, isAdmin } from "@/lib/auth/admin";
import { getPublicEnv } from "@/lib/env";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const { isSupabaseConfigured } = getPublicEnv();

  if (isSupabaseConfigured) {
    const user = await getCurrentUser();
    if (user && (await isAdmin())) {
      redirect("/admin");
    }
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <h1 className="font-heading text-3xl text-primary">Вход в админ</h1>
      <p className="mt-2 max-w-md text-center text-text-muted">
        Административен вход за {brand.officialName}
      </p>

      {!isSupabaseConfigured ? (
        <p className="mt-8 max-w-sm rounded border border-border bg-bg-secondary px-4 py-3 text-sm text-text-muted">
          Липсват Supabase env vars. Попълни `.env.local` и променливите в
          Vercel.
        </p>
      ) : (
        <AdminLoginForm />
      )}
    </main>
  );
}
