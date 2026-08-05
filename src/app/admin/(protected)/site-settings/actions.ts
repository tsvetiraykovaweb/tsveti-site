"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import {
  SITE_SETTING_LABELS,
  type SiteSettingsFormValues,
} from "@/lib/cms/site-settings";

export type SaveSiteSettingsResult =
  | { ok: true }
  | { ok: false; error: string };

export async function saveSiteSettings(
  values: SiteSettingsFormValues,
): Promise<SaveSiteSettingsResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Нямате админ достъп." };
  }

  const official_name = values.official_name.trim();
  const display_name = values.display_name.trim();
  const primary_cta_label = values.primary_cta_label.trim();
  const primary_cta_url = values.primary_cta_url.trim();

  if (!official_name || !display_name) {
    return {
      ok: false,
      error: "Официалното име и името за показване са задължителни.",
    };
  }

  if (!primary_cta_label || !primary_cta_url) {
    return {
      ok: false,
      error: "CTA текстът и линкът са задължителни.",
    };
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Невалиден имейл." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payloads: {
    key: string;
    value: string | { instagram: string; facebook: string };
    label: string;
  }[] = [
    {
      key: "official_name",
      value: official_name,
      label: SITE_SETTING_LABELS.official_name,
    },
    {
      key: "display_name",
      value: display_name,
      label: SITE_SETTING_LABELS.display_name,
    },
    {
      key: "phone",
      value: values.phone.trim(),
      label: SITE_SETTING_LABELS.phone,
    },
    { key: "email", value: email, label: SITE_SETTING_LABELS.email },
    {
      key: "primary_cta_label",
      value: primary_cta_label,
      label: SITE_SETTING_LABELS.primary_cta_label,
    },
    {
      key: "primary_cta_url",
      value: primary_cta_url,
      label: SITE_SETTING_LABELS.primary_cta_url,
    },
    {
      key: "social_links",
      value: {
        instagram: values.social_instagram.trim(),
        facebook: values.social_facebook.trim(),
      },
      label: SITE_SETTING_LABELS.social_links,
    },
    {
      key: "seo_title",
      value: values.seo_title.trim(),
      label: SITE_SETTING_LABELS.seo_title,
    },
    {
      key: "seo_description",
      value: values.seo_description.trim(),
      label: SITE_SETTING_LABELS.seo_description,
    },
  ];

  for (const item of payloads) {
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: item.key,
        value: item.value,
        label: item.label,
        updated_by: user?.id ?? null,
      },
      { onConflict: "key" },
    );

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  revalidatePath("/admin/site-settings");
  revalidatePath("/");
  return { ok: true };
}
