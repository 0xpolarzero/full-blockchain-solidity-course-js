/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
    domains: ['cdn.jsdelivr.net'],
  },
};

module.exports = nextConfig;
