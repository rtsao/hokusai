module.exports = {
  presets: [
    [
      require.resolve('babel-preset-es2015'),
      {modules: false}
    ]
  ],
  plugins: [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-syntax-jsx'),
    require.resolve('babel-plugin-styletron'),
    require.resolve('babel-plugin-inferno')
  ]
}
