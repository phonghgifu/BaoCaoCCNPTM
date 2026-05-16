import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 5,
  },
  // Disable prerendering if Supabase env vars are not set
  experimental: {
    // Allow components to skip prerendering if needed
  },
};

export default nextConfig;
