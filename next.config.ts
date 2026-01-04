// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  turbopack: {
  },
  webpack: (config: any, { isServer }: { isServer: any }) => {
    // If compiling for the client (browser), exclude 'fs', 'net', and 'tls'
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;