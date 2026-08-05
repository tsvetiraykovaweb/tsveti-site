import sharp from "sharp";

export const MEDIA_VARIANT_WIDTHS = [480, 768, 1200, 1600] as const;
export const MEDIA_PRIMARY_WIDTH = 1200;
export const MEDIA_WEBP_QUALITY = 82;
/** Max upload size before processing (raw input). */
export const MEDIA_MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MEDIA_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export type OptimizedVariant = {
  width: number;
  height: number;
  buffer: Buffer;
  sizeBytes: number;
  pathSuffix: string;
};

export type OptimizeResult = {
  variants: OptimizedVariant[];
  /** Preferred public path suffix (primary width, or largest available). */
  primary: OptimizedVariant;
};

function normalizeMime(mime: string): string {
  const lower = mime.toLowerCase();
  if (lower === "image/jpg") return "image/jpeg";
  return lower;
}

export function assertAllowedImageUpload(
  mimeType: string,
  sizeBytes: number,
): string | null {
  if (!MEDIA_ALLOWED_MIME.has(normalizeMime(mimeType))) {
    return "Поддържани формати: JPG, PNG, WebP.";
  }
  if (sizeBytes <= 0) {
    return "Файлът е празен.";
  }
  if (sizeBytes > MEDIA_MAX_UPLOAD_BYTES) {
    return "Файлът е твърде голям (макс. 8 MB).";
  }
  return null;
}

/**
 * Server-side resize + WebP encode. Does not enlarge past source width.
 * Original is not stored for public use — only optimized variants.
 */
export async function optimizeImageVariants(
  input: Buffer,
): Promise<OptimizeResult> {
  const meta = await sharp(input).rotate().metadata();
  if (!meta.width) {
    throw new Error("Невалидно изображение.");
  }

  const variants: OptimizedVariant[] = [];

  for (const width of MEDIA_VARIANT_WIDTHS) {
    const output = await sharp(input)
      .rotate()
      .resize({
        width,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: MEDIA_WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    variants.push({
      width: output.info.width,
      height: output.info.height,
      buffer: output.data,
      sizeBytes: output.data.byteLength,
      pathSuffix: `w${width}.webp`,
    });
  }

  const primary =
    variants.find((v) => v.pathSuffix === `w${MEDIA_PRIMARY_WIDTH}.webp`) ||
    variants[variants.length - 1];

  return { variants, primary };
}
