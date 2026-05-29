import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 5,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bwsuuckbekvfgahwawvl.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable prerendering if Supabase env vars are not set
  experimental: {
    // Allow components to skip prerendering if needed
  },
};

export default nextConfig;
