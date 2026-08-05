import { publicServicePath, PUBLIC_ABOUT_PATH, PUBLIC_CONTACT_PATH } from "@/lib/cms/public-paths";

/** Concise top-level nav labels for known service slugs (no dropdown). */
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

/** Short label for the header CTA button (full CTA copy stays on page sections). */
export const HEADER_CTA_LABEL = "Запази консултация";

/**
 * Builds flat desktop/mobile nav: Home, each published service, About, FAQ, Contact.
 * No services dropdown — each service is its own top-level item.
 */
export function buildPublicNavItems(
  services: NavServiceInput[],
): PublicNavItem[] {
  const serviceItems = services.map((service) => ({
    href: publicServicePath(service.slug),
    label: NAV_SERVICE_LABELS[service.slug] ?? service.title,
  }));

  return [
    { href: "/", label: "Начало" },
    ...serviceItems,
    { href: PUBLIC_ABOUT_PATH, label: "За Цвети" },
    { href: "/#faq", label: "Въпроси" },
    { href: PUBLIC_CONTACT_PATH, label: "Контакти" },
  ];
}
