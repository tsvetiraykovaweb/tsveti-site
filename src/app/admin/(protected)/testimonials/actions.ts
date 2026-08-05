"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import type { TestimonialFormValues } from "@/lib/cms/testimonials";

export type SaveTestimonialResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function validateTestimonial(values: TestimonialFormValues): string | null {
  if (!values.quote.trim()) return "Цитатът е задължителен.";
  if (!values.author_name.trim()) return "Името на автора е задължително.";
  if (!Number.isFinite(values.sort_order)) {
    return "Редът (sort_order) трябва да е число.";
  }
  return null;
}

async function requireAdminClient() {
  if (!(await isAdmin())) {
    return {
      error: "Нямате админ достъп." as const,
      supabase: null,
      userId: null,
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { error: null, supabase, userId: user?.id ?? null };
}

export async function createTestimonial(
  values: TestimonialFormValues,
): Promise<SaveTestimonialResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateTestimonial(values);
  if (invalid) return { ok: false, error: invalid };

  const { data, error } = await gate.supabase
    .from("testimonials")
    .insert({
      quote: values.quote.trim(),
      author_name: values.author_name.trim(),
      author_role: values.author_role.trim() || null,
      avatar_path: values.avatar_path.trim() || null,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Неуспешно създаване." };
  }

  revalidatePath("/admin/testimonials");
  return { ok: true, id: data.id };
}

export async function updateTestimonial(
  id: string,
  values: TestimonialFormValues,
): Promise<SaveTestimonialResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateTestimonial(values);
  if (invalid) return { ok: false, error: invalid };

  const { error } = await gate.supabase
    .from("testimonials")
    .update({
      quote: values.quote.trim(),
      author_name: values.author_name.trim(),
      author_role: values.author_role.trim() || null,
      avatar_path: values.avatar_path.trim() || null,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath(`/admin/testimonials/${id}`);
  return { ok: true, id };
}

/** Soft action: unpublish instead of hard delete. */
export async function unpublishTestimonial(
  id: string,
): Promise<SaveTestimonialResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const { error } = await gate.supabase
    .from("testimonials")
    .update({
      is_published: false,
      updated_by: gate.userId,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath(`/admin/testimonials/${id}`);
  return { ok: true, id };
}
