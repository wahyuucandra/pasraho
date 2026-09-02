/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  webpack: (config, { isServer }) => {
    // Fix untuk face-api.js yang import Node.js modules di browser
    if (!isServer) {
      // Fallback untuk Node.js built-in modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
        buffer: require.resolve('buffer/'),
        encoding: false,
      };

      // Alias for node-fetch's optional dep — stub as empty to eliminate warning
      config.resolve.alias = {
        ...config.resolve.alias,
        encoding: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;