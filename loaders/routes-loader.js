const path = require('path');

const getPages = require('./util/get-pages');
const yolo = require('./util/transformer');

function pageToRoute({pathname, entry}, i) {
  if (path.parse(entry).ext === '.md') {
    return `'${pathname}': {title: title${i}, component: () => page${i}}`;
  }
  return `'${pathname}': {title: title${i}, component: page${i}}`;
}

function routesLoader(content) {
  this.cacheable();
  const callback = this.async();
  const pagesDir = this.options.pagesDir;

  this.addContextDependency(pagesDir);

  const rel = path.relative(process.cwd(), pagesDir);

  const pageToImport = ({entry}, i) => {
    const entrypath = path.join(rel, entry);
    return `import page${i}, {title as title${i}} from './${entrypath}'`;
  }

  getPages(pagesDir, (err, pages) => {
    const squad = yolo(pages);
    const imports = squad.map(pageToImport);
    const routes = squad.map(pageToRoute);

    const src = `

      ${imports.join('\n')}

      const routes = {${routes.join(',')}};

      export default routes;
    `;

    callback(null, src);

  });

}

module.exports = routesLoader;
