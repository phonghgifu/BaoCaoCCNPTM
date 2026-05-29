import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* config options here */
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 5,
  },
  turbopack: {
    root: projectRoot,
  },
  // Disable prerendering if Supabase env vars are not set
  experimental: {
    // Allow components to skip prerendering if needed
  },
};

export default nextConfig;
