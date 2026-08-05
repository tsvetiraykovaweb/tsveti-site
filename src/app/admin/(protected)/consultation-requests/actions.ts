"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth/admin";
import { isConsultationStatus } from "@/lib/consultations/admin";
import type { ConsultationStatus } from "@/types/database";

export type UpdateConsultationStatusResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateConsultationRequestStatus(
  id: string,
  status: ConsultationStatus,
): Promise<UpdateConsultationStatusResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Нямате достъп." };
  }

  if (!id.trim()) {
    return { ok: false, error: "Липсва идентификатор." };
  }

  if (!isConsultationStatus(status)) {
    return { ok: false, error: "Невалиден статус." };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("consultation_requests")
    .update({
      status,
      updated_by: user?.id ?? null,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: "Статусът не беше обновен. Опитайте отново." };
  }

  revalidatePath("/admin/consultation-requests");
  revalidatePath(`/admin/consultation-requests/${id}`);
  return { ok: true };
}
