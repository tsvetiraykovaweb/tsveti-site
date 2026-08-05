import { getPublicEnv } from "@/lib/env";

export const MEDIA_BUCKET = "site-assets";

export type PublicImageRef = {
  /** Absolute URL for next/image, or null when no asset yet */
  src: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  caption: string | null;
};

/**
 * Resolve a storage path (or absolute URL) to a public Supabase Storage URL.
 * Does not hardcode final asset URLs — only builds from env + path.
 */
export function resolvePublicStorageUrl(
  path: string | null | undefined,
  bucket = MEDIA_BUCKET,
): string | null {
  const trimmed = path?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const { supabaseUrl } = getPublicEnv();
  if (!supabaseUrl) return null;

  const cleaned = trimmed
    .replace(/^\/+/, "")
    .replace(new RegExp(`^${bucket}/`), "");

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleaned}`;
}

export function buildImageRef(options: {
  path?: string | null;
  alt: string;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
}): PublicImageRef {
  return {
    src: resolvePublicStorageUrl(options.path),
    alt: options.alt.trim() || "Илюстрация към страницата",
    width: options.width ?? null,
    height: options.height ?? null,
    caption: options.caption ?? null,
  };
}
