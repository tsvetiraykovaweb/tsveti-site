import type { MetadataRoute } from "next";
import { getPublishedServices } from "@/lib/cms/public-content";
import {
  PUBLIC_ABOUT_PATH,
  PUBLIC_CONSULTATION_PATH,
  PUBLIC_CONTACT_PATH,
  PUBLIC_PRIVACY_PATH,
  PUBLIC_USLUGI_BASE,
  getSiteOrigin,
  publicServicePath,
} from "@/lib/cms/public-paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const services = await getPublishedServices();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: origin, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${origin}${PUBLIC_USLUGI_BASE}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}${PUBLIC_ABOUT_PATH}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}${PUBLIC_CONTACT_PATH}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}${PUBLIC_CONSULTATION_PATH}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${origin}${PUBLIC_PRIVACY_PATH}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${origin}${publicServicePath(service.slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
