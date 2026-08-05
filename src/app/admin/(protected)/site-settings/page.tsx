import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  SITE_SETTING_KEYS,
  rowsToFormValues,
  type SiteSettingsFormValues,
} from "@/lib/cms/site-settings";
import { SiteSettingsForm } from "./site-settings-form";

const emptyValues: SiteSettingsFormValues = {
  official_name: "Цветелина Райкова",
  display_name: "Цвети",
  phone: "",
  email: "",
  primary_cta_label: "Запиши консултация",
  primary_cta_url: "/#consultation",
  social_instagram: "",
  social_facebook: "",
  seo_title: "Цветелина Райкова",
  seo_description: "",
};

export default async function SiteSettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [...SITE_SETTING_KEYS]);

  const initialValues =
    !error && data && data.length > 0
      ? { ...emptyValues, ...rowsToFormValues(data) }
      : emptyValues;

  return (
    <section>
      <div className="mb-2">
        <Link
          href="/admin"
          className="text-sm text-text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          ← Табло
        </Link>
      </div>
      <h1 className="font-heading text-3xl text-primary">Настройки на сайта</h1>
      <p className="mt-2 text-text-muted">
        Редактируеми данни за име, контакт, CTA и базово SEO. Съдържанието се
        пази в Supabase.
      </p>
      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Неуспешно зареждане: {error.message}. Провери дали seed-ът е приложен.
        </p>
      ) : null}
      {!error && (!data || data.length === 0) ? (
        <p className="mt-6 rounded border border-border bg-bg px-3 py-2 text-sm text-text-muted">
          Няма записи в <code>site_settings</code>. Приложи{" "}
          <code>supabase/seed/001_initial_content.sql</code>, след което
          презареди страницата.
        </p>
      ) : null}
      <SiteSettingsForm initialValues={initialValues} />
    </section>
  );
}
