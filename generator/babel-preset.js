module.exports = {
  presets: [
    [
      require.resolve('babel-preset-es2015'),
      {modules: false}
    ]
  ],
  plugins: [
    require.resolve('babel-plugin-syntax-jsx'),
    require.resolve('babel-plugin-inferno')
  ]
}
