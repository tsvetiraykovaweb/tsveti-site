"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import {
  isValidSlug,
  normalizeSlug,
  type ServiceFormValues,
  type ServiceStatus,
} from "@/lib/cms/services";

export type SaveServiceResult =
  | { ok: true }
  | { ok: false; error: string };

const ALLOWED_STATUS: ServiceStatus[] = ["draft", "published", "archived"];

export async function saveService(
  id: string,
  values: ServiceFormValues,
): Promise<SaveServiceResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Нямате админ достъп." };
  }

  const title = values.title.trim();
  const slug = normalizeSlug(values.slug);

  if (!title) {
    return { ok: false, error: "Заглавието е задължително." };
  }

  if (!slug) {
    return { ok: false, error: "Slug е задължителен." };
  }

  if (!isValidSlug(slug)) {
    return {
      ok: false,
      error:
        "Slug трябва да е URL-safe: малки латински букви, цифри и тирета (напр. biorezonans).",
    };
  }

  if (!Number.isFinite(values.sort_order)) {
    return { ok: false, error: "Редът (sort_order) трябва да е число." };
  }

  const sort_order = Math.trunc(values.sort_order);
  if (!ALLOWED_STATUS.includes(values.status)) {
    return { ok: false, error: "Невалиден статус." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: existing, error: loadError } = await supabase
    .from("services")
    .select("id, status, published_at")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !existing) {
    return { ok: false, error: "Услугата не е намерена." };
  }

  let published_at = existing.published_at as string | null;
  if (values.status === "published" && !published_at) {
    published_at = new Date().toISOString();
  }
  if (values.status !== "published") {
    // keep historical published_at when unpublishing; only clear if never needed
    published_at = existing.published_at as string | null;
  }

  const { error } = await supabase
    .from("services")
    .update({
      title,
      slug,
      summary: values.summary.trim() || null,
      body: values.body.trim() || null,
      image_path: values.image_path.trim() || null,
      cta_label: values.cta_label.trim() || null,
      cta_href: values.cta_href.trim() || null,
      sort_order,
      status: values.status,
      seo_title: values.seo_title.trim() || null,
      seo_description: values.seo_description.trim() || null,
      published_at,
      updated_by: user?.id ?? null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Този slug вече се ползва от друга услуга." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  revalidatePath("/");
  revalidatePath("/uslugi");
  if (values.slug.trim()) {
    revalidatePath(`/uslugi/${values.slug.trim()}`);
  }
  return { ok: true };
}
