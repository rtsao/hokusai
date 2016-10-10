const path = require('path');
const loadersDir = path.resolve(__dirname, '../loaders');

class ProvideLoaderConfigPlugin {
  constructor(options) {
    if (typeof options !== 'object') {
      options = {};
    }
    this.options = options;
  }

  apply(compiler) {
    const options = this.options;
    compiler.plugin('compilation', compilation => {
      compilation.plugin('normal-module-loader', (context, module) => {
        if (module.resource || module.loaders.length !== 1) {
          return;
        }
        const loaderpath = module.loaders[0].loader;
        const found = options.options[loaderpath];
        if (found) {
          Object.assign(context.options, found);
        }
      });
    });
  }
}

module.exports = ProvideLoaderConfigPlugin;
