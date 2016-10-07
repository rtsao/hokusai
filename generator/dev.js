const path = require('path');
const webpack = require('webpack');
const Module = require('module');
const WebpackDevServer = require('webpack-dev-server');

const ProvideLoaderConfigPlugin = require('../plugins/provide-loader-config');

const serverRender = require('./server-render');

const loadersDir = path.resolve(__dirname, '../loaders');

const pathsToInfo = require('../universal/transformer');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const entry2 = path.resolve(__dirname, '../app/server-entry.js');

const getConfig = require('./get-config');

let state = false;
let compiledServer = null;
let pageCache = {};
let requests = [];

let pages = null;

function getPage(pathname) {
  console.log('GETPAGE', pathname);
  if (!pageCache[pathname]) {
    pageCache[pathname] = new Promise((resolve, reject) => {
      if (!compiledServer) {
        console.log('no render');
        requests.push({pathname, resolve, reject});
      }
      else {
        console.log('render, resolving');
        resolve(render(pathname));
      }
    });
  }
  return pageCache[pathname];
}

function resolveRequests() {
  requests.forEach(({pathname, resolve, reject}) => {
    resolve(render(pathname));
  });
}

function render(pathname) {
  const {App, Markup, pagesManifest} = compiledServer;
  // console.log(pagesManifest);
  const yo = pagesManifest[pathname];
  const props = Object.assign({}, yo.title && {title:yo.title});
  // console.log('dang', App, Markup);
  return serverRender(pathname, Markup, App, props);
}

module.exports = function dev(basedir, pagesdir) {

  const config = getConfig(basedir, pagesdir);
  config.entry.server = entry2;

  const pagesEmitter = new MyEmitter();

  config.plugins.push(
    new ProvideLoaderConfigPlugin({
      options: {
        [path.join(loadersDir, 'routes-loader.js')]: {
          pagesEmitter
        }
      }
    })
  );

  pagesEmitter.on('pages', (newpages) => {
    pages = pathsToInfo(newpages);
  })

  const compiler = webpack(config);

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
    },
    setup: function(app) {
      app.get('*', (req, res, next) => {
        if (!pages) {
          return next();
        }
        else {
          if (pages[req.url]) {
            return getPage(req.url).then(content => {
              console.log('RESOLVED');
              res.send(content);
            }).catch(err => {
              console.log('POOOP', err);
            });
          } else {
            return next();
          }
        }
      });
    }
  });

  server.listen(8080, 'localhost', function() {
    console.log('http://localhost:8080');
  });

  compiler.plugin('invalid', function() {
    state = false;
    pageCache = {};
    requests = [];
    compiledServer = false;
    pages = null;
  });

  compiler.plugin('done', function(stats) {
    state = true;
    process.nextTick(function() {
      // check if still in valid state
      if(!state) return;
        const bundleSrc = stats.compilation.assets['server.bundle.js']._value || stats.compilation.assets['server.bundle.js']._cachedSource;
        const src = `module.exports = ${bundleSrc};`
        const m = new Module();
        m._compile(src, path.join(compiler.outputPath, 'server.bundle.js'));
        compiledServer = m.exports;
        resolveRequests();
    });
  });

}
