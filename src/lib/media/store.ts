import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_BUCKET } from "@/lib/cms/media";
import {
  assertAllowedImageUpload,
  optimizeImageVariants,
} from "@/lib/media/optimize";

export type UploadedMediaAsset = {
  id: string;
  path: string;
  alt_text: string;
  caption: string | null;
  width: number;
  height: number;
  size_bytes: number;
  mime_type: string;
  bucket: string;
};

function buildFolderPath(assetId: string): string {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `media/${yyyy}/${mm}/${assetId}`;
}

/**
 * Optimize + upload WebP variants to Storage, insert `media_assets` row.
 * Uses service-role client on the server only (caller must verify admin).
 */
export async function processAndStoreMedia(options: {
  fileBuffer: Buffer;
  mimeType: string;
  altText: string;
  caption?: string | null;
  updatedBy: string | null;
}): Promise<UploadedMediaAsset> {
  const alt = options.altText.trim();
  if (!alt) {
    throw new Error("Alt текстът е задължителен.");
  }

  const validationError = assertAllowedImageUpload(
    options.mimeType,
    options.fileBuffer.byteLength,
  );
  if (validationError) {
    throw new Error(validationError);
  }

  const optimized = await optimizeImageVariants(options.fileBuffer);
  const assetId = randomUUID();
  const folder = buildFolderPath(assetId);
  const admin = createAdminClient();

  for (const variant of optimized.variants) {
    const objectPath = `${folder}/${variant.pathSuffix}`;
    const { error } = await admin.storage
      .from(MEDIA_BUCKET)
      .upload(objectPath, variant.buffer, {
        contentType: "image/webp",
        upsert: false,
        cacheControl: "31536000",
      });

    if (error) {
      throw new Error(`Качването към Storage не успя: ${error.message}`);
    }
  }

  const primaryPath = `${folder}/${optimized.primary.pathSuffix}`;
  const caption = options.caption?.trim() || null;

  const { data, error } = await admin
    .from("media_assets")
    .insert({
      id: assetId,
      bucket: MEDIA_BUCKET,
      path: primaryPath,
      alt_text: alt,
      caption,
      mime_type: "image/webp",
      width: optimized.primary.width,
      height: optimized.primary.height,
      size_bytes: optimized.primary.sizeBytes,
      is_public: true,
      updated_by: options.updatedBy,
    })
    .select(
      "id, path, alt_text, caption, width, height, size_bytes, mime_type, bucket",
    )
    .single();

  if (error || !data) {
    throw new Error(
      error?.message?.includes("caption")
        ? "Липсва колона caption — изпълнете supabase/migrations/20260805180000_media_assets_caption.sql"
        : error?.message || "Записът в media_assets не успя.",
    );
  }

  return {
    id: data.id,
    path: data.path,
    alt_text: data.alt_text ?? alt,
    caption: data.caption ?? caption,
    width: data.width ?? optimized.primary.width,
    height: data.height ?? optimized.primary.height,
    size_bytes: data.size_bytes ?? optimized.primary.sizeBytes,
    mime_type: data.mime_type ?? "image/webp",
    bucket: data.bucket,
  };
}
