import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/images/cx-about.png", destination: "/images/service-procurement-20260911.avif" },
        { source: "/images/sourcing.webp", destination: "/images/service-procurement-20260911.avif" },
        { source: "/images/cx-method.png", destination: "/images/service-contracts-20260911.avif" },
        { source: "/images/operations-systems.webp", destination: "/images/service-business-20260911.avif" },
        { source: "/images/brand-presence.webp", destination: "/images/service-brand-20260911.avif" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
