const path = require('path');

const getPages = require('./util/get-pages');
const transformPages = require('./util/transformer');

function pageToRoute({pathname, dest}, i) {
  return `'${pathname}': {dest: '${dest}', title: title${i}, description: description${i}, date: date${i}}`;
}

function pageLoader(source) {
  this.cacheable();
  const callback = this.async();
  const pagesDir = this.options.pagesDir;

  const rel = path.relative(process.cwd(), pagesDir);
  this.addContextDependency(pagesDir);

  getPages(pagesDir, (err, pages) => {
    const transformed = transformPages(pages);
    const imports = transformed.map(function pageToImport({entry}, i) {
      const entrypath = path.join(rel, entry);
      return `import {title as title${i}, description as description${i}, date as date${i}} from './${entrypath}'`;
    });
    const routes = transformed.map(pageToRoute);

    const src = `
      ${imports.join('\n')}

      const manifest = {${routes.join(',')}};
      export default manifest;
    `;
    callback(null, src);

  });

}

module.exports = pageLoader;
