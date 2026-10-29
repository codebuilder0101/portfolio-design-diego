import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the "N" route indicator in `next dev` (it never appears in production builds); errors are still shown
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [96, 160, 256, 384, 512],
    qualities: [70, 80],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
