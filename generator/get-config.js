const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

const loadersDir = path.resolve(__dirname, '../loaders');
const entry = path.resolve(__dirname, '../app/client-entry.js');

const presetPath = require.resolve('./babel-preset');

const ProvideLoaderConfigPlugin = require('../plugins/provide-loader-config');

module.exports = getConfig;

function getConfig(basedir, pagesDir, minify = false, hot = true) {
  return {
    entry: {
      client: [entry, hot && 'webpack-dev-server/client/index.js?http://localhost:8080/'].filter(Boolean)
    },
    output: {
      path: path.resolve(basedir, 'build'),
      publicPath: '/',
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.md$/,
          loader: path.join(loadersDir, 'md-loader.js')
        },
        {
          test: /\.(js|md)$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: [presetPath],
          }
        }
      ]
    },
    resolveLoader: {
      alias: {
        'routes-loader': path.join(loadersDir, 'routes-loader'),
        'pages-manifest-loader': path.join(loadersDir, 'pages-manifest-loader')
      }
    },
    devtool: minify ? false : 'eval-source-map',
    plugins: [
      new ProvideLoaderConfigPlugin({
        options: {
          [path.join(loadersDir, 'routes-loader.js')]: {
            pagesDir: path.resolve(basedir, pagesDir),
          },
          [path.join(loadersDir, 'pages-manifest-loader.js')]: {
            pagesDir: path.resolve(basedir, pagesDir),
          }
        }
      }),
      minify && new webpack.EnvironmentPlugin(['NODE_ENV']),
      minify && new BabiliPlugin(),
      new webpack.ProvidePlugin({
        Inferno: require.resolve('inferno'),
        Styletron: require.resolve('styletron-utils')
      })
    ].filter(Boolean)
  };
}

