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
        encoding: false,
        canvas: false,
        buffer: require.resolve('buffer/'),
      };

      // Externals untuk modules yang tidak perlu di-bundle di browser
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'node-fetch': 'node-fetch',
          'encoding': 'encoding',
        });
      }

      // Alias untuk menghindari bundling TensorFlow node-specific code
      config.resolve.alias = {
        ...config.resolve.alias,
        'encoding': false,
      };

      // Ignore warnings dari TensorFlow
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /node-fetch/ },
        { module: /encoding/ },
        { module: /@tensorflow\/tfjs-core/ },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;