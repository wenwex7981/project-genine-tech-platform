import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-293ff9f36332435ebbd7beaf90122481.r2.dev',
      },
    ],
  },
};

export default nextConfig;
