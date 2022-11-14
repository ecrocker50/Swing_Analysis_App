module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: ['db', 'mp3', 'ttf', 'obj', 'png', 'jpg'],
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'] //add here
    },
  };