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
};

export default nextConfig;
