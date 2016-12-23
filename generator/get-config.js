const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

const loadersDir = path.resolve(__dirname, '../loaders');
const entry = path.resolve(__dirname, '../app/client-entry.js');

const presetPath = require.resolve('./babel-preset');

const ProvideLoaderConfigPlugin = require('../plugins/provide-loader-config');

module.exports = getConfig;

const devClient = require.resolve('webpack-dev-server/client');

function getConfig(basedir, pagesDir, minify = false, hot = true) {
  return {
    performance: false, // TODO figure out why this has to be disabled?
    entry: {
      client: [entry, hot && `${devClient}?http://localhost:8080/`].filter(Boolean)
    },
    output: {
      path: path.resolve(basedir, 'build'),
      publicPath: '/',
      filename: '[name].bundle.js'
    },
    resolve: {
      modules: ['node_modules', path.resolve('../node_modules')],
      extensions: ['.js', '.md']
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
          include: [basedir, path.resolve(__dirname, '..')],
          exclude: /node_modules\/(!hokusai)/,
          loader: require.resolve('babel-loader'),
          query: {
            presets: [presetPath],
          }
        },
        {
          test: /\.(svg|png|jpg)$/,
          include: [basedir, path.resolve(__dirname, '..')],
          loader: require.resolve('file-loader')
        }
      ]
    },
    resolveLoader: {
      alias: {
        'routes-loader': path.join(loadersDir, 'routes-loader'),
        'pages-manifest-loader': path.join(loadersDir, 'pages-manifest-loader'),
        'toc-loader': path.join(loadersDir, 'toc-loader')
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
          },
          [path.join(loadersDir, 'toc-loader.js')]: {
            pagesDir: path.resolve(basedir, pagesDir),
          }
        }
      }),
      minify && new webpack.EnvironmentPlugin(['NODE_ENV']),
      minify && new BabiliPlugin(),
      new webpack.ProvidePlugin({
        Inferno: require.resolve('inferno'),
        Styletron: require.resolve('styletron-utils'),
        StyletronClient: require.resolve('styletron-client'),
        Component: require.resolve('inferno-component')
      })
    ].filter(Boolean)
  };
}

