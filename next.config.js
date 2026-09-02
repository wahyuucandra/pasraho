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

      // Ignore warnings dari TensorFlow & node-fetch
      // https://github.com/node-fetch/node-fetch/issues/466
      // Can't resolve 'encoding' in node-fetch/lib
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /node-fetch/ },
        { module: /encoding/ },
        { module: /@tensorflow\/tfjs-core/ },
        { message: /Can't resolve 'encoding'/ },
        { message: /node-fetch/ },
      ];

      // Disable critical dependency warnings dari node-fetch
      config.plugins.push(
        new (require('webpack')).IgnorePlugin({
          resourceRegExp: /^encoding$/,
          contextRegExp: /node-fetch/,
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;