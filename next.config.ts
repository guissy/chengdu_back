import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "build": {
    "env": {
      "TAILWIND_USE_OXIDE": "1"
    }
  }
};

export default nextConfig;
