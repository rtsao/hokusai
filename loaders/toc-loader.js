const path = require('path');

const getPages = require('./util/get-pages');
const transformPages = require('./util/transformer');

function tocLoader(source) {
  this.cacheable();
  const callback = this.async();
  const pagesDir = this.options.pagesDir;
  const rel = path.relative(pagesDir, this.context);

  getPages(this.context, (err, pages) => {
    const filtered = pages.filter(page => page !== '/index.md');

    const transformed = transformPages(filtered);

    const imports = transformed.map(function pageToImport({entry}, i) {
      return `import {title as title${i}, description as description${i}, date as date${i}} from './${entry}'`;
    });

    function pageToInfo({pathname}, i) {
      return `{pathname: '/${path.join(rel, pathname)}', title: title${i}, description: description${i}, date: date${i}}`;
    }

    const arr = transformed.map(pageToInfo);

    const src = `
      ${imports.join('\n')}

      const manifest = [${arr.join(',')}];
      export default manifest;
    `;

    callback(null, src);
  });

}

module.exports = tocLoader;
