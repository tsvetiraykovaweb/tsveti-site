/** Public URL prefix for service pages (BG transliteration). DB table remains `services`. */
export const PUBLIC_USLUGI_BASE = "/uslugi";

export function publicServicePath(slug: string): string {
  return `${PUBLIC_USLUGI_BASE}/${slug}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
