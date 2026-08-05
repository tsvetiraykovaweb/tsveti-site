import { brand } from "@/lib/brand";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <h1 className="font-heading text-3xl text-primary">Вход в админ</h1>
      <p className="mt-2 text-center text-text-muted">
        Вход за {brand.officialName} — автентикацията ще бъде свързана със
        Supabase Auth.
      </p>
      <p className="mt-8 rounded border border-border bg-bg-secondary px-4 py-3 text-sm text-text-muted">
        Login UI placeholder — без имплементация в този етап.
      </p>
    </main>
  );
}
