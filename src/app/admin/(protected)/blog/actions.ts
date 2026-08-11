"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import {
  isValidBlogSlug,
  type BlogPostFormValues,
} from "@/lib/cms/blog";

export type SaveBlogPostResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function validateBlogPost(values: BlogPostFormValues): string | null {
  if (!values.title.trim()) return "Заглавието е задължително.";
  if (!values.slug.trim()) return "Slug е задължителен.";
  if (!isValidBlogSlug(values.slug.trim())) {
    return "Slug трябва да е с малки латински букви, цифри и тирета.";
  }
  if (!values.content.trim()) return "Съдържанието е задължително.";
  if (!["draft", "published"].includes(values.status)) {
    return "Невалиден статус.";
  }
  return null;
}

function normalizePublishedAtInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

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

function resolvePublishedAt(values: BlogPostFormValues, current?: string | null) {
  const manual = normalizePublishedAtInput(values.published_at);
  if (values.status === "published") {
    return manual || current || new Date().toISOString();
  }
  return manual || current || null;
}

function parseReadingTime(value: string): number | null {
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n < 0 ? null : n;
}

function buildRow(values: BlogPostFormValues, userId: string | null, publishedAt: string | null) {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim() || null,
    content: values.content.trim(),
    featured_image_path: values.featured_image_path.trim() || null,
    status: values.status,
    published_at: publishedAt,
    seo_title: values.seo_title.trim() || null,
    seo_description: values.seo_description.trim() || null,
    category_id: values.category_id.trim() || null,
    author_name: values.author_name.trim() || null,
    reading_time_minutes: parseReadingTime(values.reading_time_minutes),
    is_featured: values.is_featured,
    is_popular: values.is_popular,
    updated_by: userId,
  };
}

export async function createBlogPost(
  values: BlogPostFormValues,
): Promise<SaveBlogPostResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateBlogPost(values);
  if (invalid) return { ok: false, error: invalid };

  const { data, error } = await gate.supabase
    .from("blog_posts")
    .insert(buildRow(values, gate.userId, resolvePublishedAt(values)))
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { ok: false, error: "Този slug вече се използва." };
    }
    return { ok: false, error: error?.message ?? "Неуспешно създаване." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { ok: true, id: data.id };
}

export async function updateBlogPost(
  id: string,
  values: BlogPostFormValues,
): Promise<SaveBlogPostResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateBlogPost(values);
  if (invalid) return { ok: false, error: invalid };

  const { data: existing, error: loadError } = await gate.supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !existing) {
    return { ok: false, error: "Статията не е намерена." };
  }

  const { error } = await gate.supabase
    .from("blog_posts")
    .update(buildRow(values, gate.userId, resolvePublishedAt(values, existing.published_at)))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Този slug вече се използва." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${values.slug.trim()}`);
  return { ok: true, id };
}
