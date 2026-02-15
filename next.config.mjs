import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    'resume-data': {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
  },
  // Enable ESLint and TypeScript checks (fix errors instead of ignoring)
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'praxis.encommun.io',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Extended cache for static images (24 hours)
    minimumCacheTTL: 86400,
  },
  // Compression
  compress: true,
  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},
  // Keep webpack config for explicit webpack builds
  webpack: (config) => {
    // Fix webpack cache warning for large strings
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };
    return config;
  },
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
    // SSG performance optimizations
    optimizeCss: true,
    optimizeServerReact: true,
  },
  // Compiler options to target modern browsers and reduce legacy JavaScript
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

export default nextConfig
