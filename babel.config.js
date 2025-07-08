module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-react'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@components': './src/components',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@context': './src/context',
          },
        },
      ],
    ],
  };
};
