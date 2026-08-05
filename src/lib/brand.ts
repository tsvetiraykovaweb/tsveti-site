/**
 * Central brand configuration.
 * Official legal/marketing name stays fixed; short display name is configurable.
 */
export const brand = {
  /** Official full name — use in legal, SEO title defaults, formal contexts */
  officialName: "Цветелина Райнова",

  /**
   * Short display name used in nav, hero, informal copy.
   * Change this when the site should prefer “Цвети” or another short form.
   */
  displayName: "Цветелина Райнова",

  /** Brand direction tagline (internal / design reference) */
  direction: "Спокойна естествена експертност",

  /** Default site language */
  locale: "bg",
} as const;

export type BrandConfig = typeof brand;
