"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth/admin";
import { processAndStoreMedia } from "@/lib/media/store";
import { MEDIA_MAX_UPLOAD_BYTES } from "@/lib/media/optimize";

export type MediaActionResult =
  | { ok: true; path?: string }
  | { ok: false; error: string };

export async function uploadMediaAsset(
  formData: FormData,
): Promise<MediaActionResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Нямате админ достъп." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "Моля, изберете файл." };
  }

  if (file.size > MEDIA_MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Файлът е твърде голям (макс. 8 MB)." };
  }

  const altText = String(formData.get("alt_text") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const user = await getCurrentUser();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await processAndStoreMedia({
      fileBuffer: buffer,
      mimeType: file.type || "application/octet-stream",
      altText,
      caption,
      updatedBy: user?.id ?? null,
    });

    revalidatePath("/admin/media");
    return { ok: true, path: uploaded.path };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Качването не успя. Опитайте отново.";
    return { ok: false, error: message };
  }
}

export async function updateMediaAssetMeta(
  id: string,
  values: { alt_text: string; caption: string },
): Promise<MediaActionResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Нямате админ достъп." };
  }

  const alt = values.alt_text.trim();
  if (!alt) {
    return { ok: false, error: "Alt текстът е задължителен." };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("media_assets")
    .update({
      alt_text: alt,
      caption: values.caption.trim() || null,
      updated_by: user?.id ?? null,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      error:
        error.message.includes("caption")
          ? "Колоната caption липсва — изпълнете миграцията 20260805180000_media_assets_caption.sql."
          : "Метаданните не бяха обновени.",
    };
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}`);
  return { ok: true };
}
