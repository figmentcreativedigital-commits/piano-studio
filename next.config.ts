import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The day-one check is a standalone page; keep the short address working too.
  async redirects() {
    return [{ source: "/baseline", destination: "/baseline.html", permanent: false }];
  },
};

export default nextConfig;
