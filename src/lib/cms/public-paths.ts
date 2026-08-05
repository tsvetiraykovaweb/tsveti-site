/** Public URL prefix for service pages (BG transliteration). DB table remains `services`. */
export const PUBLIC_USLUGI_BASE = "/uslugi";

/** Public consultation request form (BG transliteration). */
export const PUBLIC_CONSULTATION_PATH = "/bezplatna-konsultatsia";

export const PUBLIC_ABOUT_PATH = "/za-cveti";
export const PUBLIC_CONTACT_PATH = "/kontakti";
export const PUBLIC_PRIVACY_PATH = "/politika-za-poveritelnost";

const LEGACY_CONSULTATION_HREFS = new Set([
  "#consultation",
  "/#consultation",
  "/consultation",
]);

export function publicServicePath(slug: string): string {
  return `${PUBLIC_USLUGI_BASE}/${slug}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Maps empty/legacy homepage-anchor CTAs to the consultation form.
 * Leaves external landing URLs and other paths unchanged.
 */
export function normalizePublicCtaHref(
  href: string | null | undefined,
): string {
  const trimmed = (href ?? "").trim();
  if (!trimmed || LEGACY_CONSULTATION_HREFS.has(trimmed)) {
    return PUBLIC_CONSULTATION_PATH;
  }
  return trimmed;
}

/** Absolute site origin without trailing slash. */
export function getSiteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
