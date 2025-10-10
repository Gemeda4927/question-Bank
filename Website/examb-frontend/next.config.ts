import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Prevent extension interference
  poweredByHeader: false,
};



export default nextConfig;
