const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// The Anthropic SDK's credential-chain helpers dynamically import node:*
// builtins (for CLI auth profiles / AWS identity files). Those paths never
// execute in the app — we always pass an explicit API key — but Metro still
// resolves every import statically, so stub them out.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('node:')) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node-shim.js'),
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
