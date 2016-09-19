const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const getConfig = require('./get-config');

module.exports = function dev(basedir, pagesdir) {
  const compiler = webpack(getConfig(basedir, pagesdir));

  const server = new WebpackDevServer(compiler, {
    contentBase: 'build',
    hot: false,
    historyApiFallback: true,
    compress: true,
    quiet: false,
    noInfo: false,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
      colors: true
    }
  });
  server.listen(8080, 'localhost', function() {
    console.log('http://localhost:8080');
  });

}
