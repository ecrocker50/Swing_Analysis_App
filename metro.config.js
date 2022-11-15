const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'gltf', 'glb');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'cjs', 'json');

module.exports = config;

// module.exports = {
//     transformer: {
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: false,
//         },
//       }),
//     },
//     resolver: {
//       assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
//       sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'] //add here
//     },
//   };