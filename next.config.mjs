/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    // 禁用 ESLint 检查
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
