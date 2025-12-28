/**
 * Metro configuration for React Native 0.71
 * https://github.com/facebook/react-native
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  return config;
})();
