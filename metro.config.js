const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'jpeg', 'png', 'json', 'ttf', 'otf', 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
