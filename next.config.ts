import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase Storage images once buckets are configured
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Allow admin image uploads (raw file before sharp optimization).
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Public URLs use Bulgarian transliteration `/uslugi` (DB table stays `services`).
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/uslugi",
        permanent: true,
      },
      {
        source: "/services/:slug",
        destination: "/uslugi/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
