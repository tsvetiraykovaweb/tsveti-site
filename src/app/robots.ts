import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/cms/public-paths";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
