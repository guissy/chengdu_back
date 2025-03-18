import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  swcMinify: false,
  compress: false,
  optimize: false, // 假设存在这个选项，但需要确认
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    return config;
  },
};

export default nextConfig;
