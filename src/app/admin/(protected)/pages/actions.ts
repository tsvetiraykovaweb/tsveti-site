"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import {
  buildSectionContentJson,
  normalizeSectionKey,
  normalizeSlug,
  validatePageForm,
  validateSectionForm,
  type PageFormValues,
  type SectionFormValues,
} from "@/lib/cms/pages";
import type { ContentStatus } from "@/types/database";
import {
  PUBLIC_ABOUT_PATH,
  PUBLIC_CONTACT_PATH,
  PUBLIC_PRIVACY_PATH,
} from "@/lib/cms/public-paths";

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

const ALLOWED_STATUS: ContentStatus[] = ["draft", "published", "archived"];

const PUBLIC_SLUG_PATHS: Record<string, string> = {
  home: "/",
  "za-cveti": PUBLIC_ABOUT_PATH,
  kontakti: PUBLIC_CONTACT_PATH,
  "politika-za-poveritelnost": PUBLIC_PRIVACY_PATH,
};

async function requireAdminClient() {
  if (!(await isAdmin())) {
    return { error: "Нямате админ достъп." as const, supabase: null, userId: null };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { error: null, supabase, userId: user?.id ?? null };
}

function revalidatePublicForSlug(slug: string) {
  const path = PUBLIC_SLUG_PATHS[slug];
  if (path) revalidatePath(path);
  if (slug === "home") revalidatePath("/");
}

export async function updatePage(
  id: string,
  values: PageFormValues,
): Promise<SaveResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validatePageForm(values);
  if (invalid) return { ok: false, error: invalid };
  if (!ALLOWED_STATUS.includes(values.status)) {
    return { ok: false, error: "Невалиден статус." };
  }

  const slug = normalizeSlug(values.slug);
  const { data: existing } = await gate.supabase
    .from("pages")
    .select("id, status, published_at, slug")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return { ok: false, error: "Страницата не е намерена." };

  let published_at = existing.published_at as string | null;
  if (values.status === "published" && !published_at) {
    published_at = new Date().toISOString();
  }

  const { error } = await gate.supabase
    .from("pages")
    .update({
      title: values.title.trim(),
      slug,
      status: values.status,
      seo_title: values.seo_title.trim() || null,
      seo_description: values.seo_description.trim() || null,
      sort_order: Math.trunc(values.sort_order),
      published_at,
      updated_by: gate.userId,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Този slug вече се ползва." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
  revalidatePublicForSlug(slug);
  revalidatePublicForSlug(existing.slug as string);
  return { ok: true, id };
}

export async function createPageSection(
  pageId: string,
  values: SectionFormValues,
): Promise<SaveResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateSectionForm(values);
  if (invalid) return { ok: false, error: invalid };

  const key = normalizeSectionKey(values.key);
  const content = buildSectionContentJson({ ...values, key });

  const { data, error } = await gate.supabase
    .from("page_sections")
    .insert({
      page_id: pageId,
      key,
      section_type: values.section_type,
      content,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { ok: false, error: "Този ключ вече съществува за страницата." };
    }
    return { ok: false, error: error?.message ?? "Неуспешно създаване." };
  }

  const { data: page } = await gate.supabase
    .from("pages")
    .select("slug")
    .eq("id", pageId)
    .maybeSingle();

  revalidatePath(`/admin/pages/${pageId}`);
  if (page?.slug) revalidatePublicForSlug(page.slug);
  return { ok: true, id: data.id };
}

export async function updatePageSection(
  pageId: string,
  sectionId: string,
  values: SectionFormValues,
): Promise<SaveResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateSectionForm(values);
  if (invalid) return { ok: false, error: invalid };

  const key = normalizeSectionKey(values.key);
  const content = buildSectionContentJson({ ...values, key });

  const { error } = await gate.supabase
    .from("page_sections")
    .update({
      key,
      section_type: values.section_type,
      content,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .eq("id", sectionId)
    .eq("page_id", pageId);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Този ключ вече съществува за страницата." };
    }
    return { ok: false, error: error.message };
  }

  const { data: page } = await gate.supabase
    .from("pages")
    .select("slug")
    .eq("id", pageId)
    .maybeSingle();

  revalidatePath(`/admin/pages/${pageId}`);
  revalidatePath(`/admin/pages/${pageId}/sections/${sectionId}`);
  if (page?.slug) revalidatePublicForSlug(page.slug);
  return { ok: true, id: sectionId };
}
