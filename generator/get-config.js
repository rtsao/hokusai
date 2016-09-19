const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

const loadersDir = path.resolve(__dirname, '../loaders');
const entry = path.resolve(__dirname, '../app/entry.js');

const presetPath = require.resolve('./babel-preset');

module.exports = getConfig;

function getConfig(basedir, pagesDir) {
  return {
    entry: entry,
    pagesDir: path.resolve(basedir, pagesDir),
    output: {
      path: path.resolve(basedir, 'build'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      preLoaders: [
        {
          test: /\.md$/,
          loader: path.join(loadersDir, 'md-loader.js')
        }
      ],
      loaders: [
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
    // devtool: 'source-map',
    devtool: false,
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new BabiliPlugin()
    ]
  };
}
