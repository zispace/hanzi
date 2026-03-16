import type { NextConfig } from "next";

export const urlBase = process.env.NODE_ENV === 'production' ? '/learn-hanzi' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: urlBase,
  basePath: urlBase,
};

export default nextConfig;
