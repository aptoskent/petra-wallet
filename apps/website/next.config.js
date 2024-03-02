/** @type {import('next').NextConfig} */

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

let withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  transpilePackages: ['@petra/core']
}

if (process.env.NODE_ENV === 'production') {
  module.exports = withNextra(nextConfig)
} else if (process.env.NODE_ENV === 'development') {
  module.exports = withBundleAnalyzer(withNextra(nextConfig))
}