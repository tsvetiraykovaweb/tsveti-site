"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";
import type { FaqFormValues } from "@/lib/cms/faqs";

export type SaveFaqResult = { ok: true; id: string } | { ok: false; error: string };

function validateFaq(values: FaqFormValues): string | null {
  if (!values.question.trim()) return "Въпросът е задължителен.";
  if (!values.answer.trim()) return "Отговорът е задължителен.";
  if (!Number.isFinite(values.sort_order)) {
    return "Редът (sort_order) трябва да е число.";
  }
  return null;
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

export async function createFaq(
  values: FaqFormValues,
): Promise<SaveFaqResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateFaq(values);
  if (invalid) return { ok: false, error: invalid };

  const { data, error } = await gate.supabase
    .from("faqs")
    .insert({
      question: values.question.trim(),
      answer: values.answer.trim(),
      category: values.category.trim() || null,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Неуспешно създаване." };
  }

  revalidatePath("/admin/faqs");
  return { ok: true, id: data.id };
}

export async function updateFaq(
  id: string,
  values: FaqFormValues,
): Promise<SaveFaqResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const invalid = validateFaq(values);
  if (invalid) return { ok: false, error: invalid };

  const { error } = await gate.supabase
    .from("faqs")
    .update({
      question: values.question.trim(),
      answer: values.answer.trim(),
      category: values.category.trim() || null,
      sort_order: Math.trunc(values.sort_order),
      is_published: values.is_published,
      updated_by: gate.userId,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/faqs");
  revalidatePath(`/admin/faqs/${id}`);
  return { ok: true, id };
}

/** Soft action: unpublish instead of hard delete. */
export async function unpublishFaq(id: string): Promise<SaveFaqResult> {
  const gate = await requireAdminClient();
  if (gate.error || !gate.supabase) {
    return { ok: false, error: gate.error ?? "Грешка." };
  }

  const { error } = await gate.supabase
    .from("faqs")
    .update({
      is_published: false,
      updated_by: gate.userId,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/faqs");
  revalidatePath(`/admin/faqs/${id}`);
  return { ok: true, id };
}
