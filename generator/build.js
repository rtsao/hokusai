const path = require('path');
const webpack = require('webpack');
const Module = require('module');

const serverRender = require('./server-render');

const loadersDir = path.resolve(__dirname, '../loaders');

const pathsToInfo = require('../universal/transformer');

const entry2 = path.resolve(__dirname, '../app/server-entry.js');

const getConfig = require('./get-config');

let compiledServer;

function render(pathname) {
  const {App, Markup, pagesManifest} = compiledServer;
  const yo = pagesManifest[pathname];
  const props = Object.assign({}, yo.title && {title:yo.title}, hokusaiConfig);
  return serverRender(pathname, Markup, App, props);
}

module.exports = function build(basedir, pagesdir) {
  const config = getConfig(basedir, pagesdir, true, false);
  config.entry.server = entry2;
  const compiler = webpack(config);
  compiler.plugin('emit', function(compilation, callback) {
    const bundleSrc = compilation.assets['server.bundle.js']._value || compilation.assets['server.bundle.js']._cachedSource;
    const src = `module.exports = ${bundleSrc};`
    const m = new Module();
    m._compile(src, path.join(compiler.outputPath, 'server.bundle.js'));
    delete compilation.assets['server.bundle.js'];
    compiledServer = m.exports;
    const pagesManifest = compiledServer.pagesManifest;
    const paths = Object.keys(pagesManifest);

    paths.forEach(pathname => {
      const filename = pagesManifest[pathname].dest;
      const source = render(pathname);
      compilation.assets[filename] = {
        source: function() {
          return source;
        },
        size: function() {
          return source.length;
        }
      };
    });
    callback();
  });
  compiler.run(function() {
    console.log('Done!');
  });
}
