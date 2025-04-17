module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // reanimated kullanıyorsanız bırakın
      // module-resolver kullanıyorsanız, örneğin:
      ['module-resolver', {
        root: ['./'],
        alias: {
          // Kendi alias'larınız, örneğin:
          // '@components': './components',
        },
      }],
    ],
  };
};