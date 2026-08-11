import {
  publicServicePath,
  PUBLIC_ABOUT_PATH,
  PUBLIC_CONTACT_PATH,
  PUBLIC_USLUGI_BASE,
} from "@/lib/cms/public-paths";

/** Concise labels for known service slugs in secondary services nav. */
export const NAV_SERVICE_LABELS: Record<string, string> = {
  biorezonans: "Биорезонанс",
  "ot-trevoga-kam-spokoystvie": "Тревожност",
  "hranitelna-programa": "Хранене",
  "izberi-sebe-si": "Избери себе си",
};

export type PublicNavItem = {
  href: string;
  label: string;
};

export type NavServiceInput = {
  slug: string;
  title: string;
};

export type ServicesSubnavItem = {
  href: string;
  label: string;
  slug: string;
};

/** Short label for the header CTA button (full CTA copy stays on page sections). */
export const HEADER_CTA_LABEL = "Запази консултация";

/**
 * Main public nav: Home, Услуги (index), About, FAQ, Contact.
 * Individual services live in secondary services nav — not top-level, no dropdown.
 */
export function buildPublicNavItems(): PublicNavItem[] {
  return [
    { href: "/", label: "Начало" },
    { href: PUBLIC_USLUGI_BASE, label: "Услуги" },
    { href: PUBLIC_ABOUT_PATH, label: "За Цвети" },
    { href: "/#faq", label: "Въпроси" },
    { href: PUBLIC_CONTACT_PATH, label: "Контакти" },
  ];
}

/**
 * Secondary services nav items from published CMS services (already sorted by sort_order).
 */
export function buildServicesSubnavItems(
  services: NavServiceInput[],
): ServicesSubnavItem[] {
  return services.map((service) => ({
    slug: service.slug,
    href: publicServicePath(service.slug),
    label: NAV_SERVICE_LABELS[service.slug] ?? service.title,
  }));
}
