const path = require('path');

const getPages = require('./util/get-pages');
const transformPages = require('./util/transformer');

function pageToImport({entry}, i) {
  return `import {title as title${i}, description as description${i}, date as date${i}} from '${entry}'`;
}

function pageToRoute({pathname, dest}, i) {
  return `{pathname: '${pathname}', dest: '${dest}', title: title${i}, description: description${i}, date: date${i}}`;
}

function pageLoader(source) {
  this.cacheable();
  const callback = this.async();
  getPages(this.context, (err, pages) => {
    const transformed = transformPages(pages);
    const imports = transformed.map(pageToImport);
    const routes = transformed.map(pageToRoute);

    const src = `
      ${imports.join('\n')}

      const manifest = [${routes.join(',')}];
      export default manifest;
    `;
    callback(null, src);

  });

}

module.exports = pageLoader;
