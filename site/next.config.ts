import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export: no server runtime, served from S3 through CloudFront.
  output: 'export',
  // Directory URLs (/en/) map to /en/index.html in S3.
  trailingSlash: true,
  // The image optimizer needs a server; assets are pre-sized instead.
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // Multiple root layouts ((root) and [locale]) need a global 404.
  experimental: { globalNotFound: true },
};

export default nextConfig;
