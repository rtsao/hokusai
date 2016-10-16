const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');
const getExports = require('./util/get-exports');
const mdToHast = require('./util/md-to-hast');
const hastToJsx = require('./util/hast-to-jsx');

module.exports = markdownLoader;

function markdownLoader(source) {
  this.cacheable();
  const cb = this.async();
  const {hast, frontmatter} = mdToHast(source);
  if (frontmatter.dom) {
    const domPath = path.resolve(this.context, frontmatter.dom);
    this.addDependency(domPath); // make this better? should this be absolute?
    fs.readFile(domPath, 'utf8', (err, content) => {
      if (err) {
        return cb(err);
      }
      const elementMap = createElementMap(getExports(content));
      return cb(null, generateSource(hast, frontmatter, elementMap));
    });
  } else {
    return cb(null, generateSource(hast, frontmatter));
  }
}

function generateSource(hast, frontmatter, elementMap) {
  const jsx = hastToJsx(hast, {elementMap});

  const contentString = `<div>${jsx}</div>`;
  const props = Object.keys(frontmatter).map(key =>
    `${key}={${JSON.stringify(frontmatter[key])}}`
  );
  const allContent = frontmatter.container ? `<Container ${props.join(' ')}>${contentString}</Container>` : contentString;
  return `

    ${elementMap ? importString(elementMap, frontmatter.dom) : ''}

    ${frontmatterExports(frontmatter)}

    ${frontmatter.container ? `import Container from '${frontmatter.container}';` : ''}

    export default (\n${allContent}\n);

  `;
}

function importString(elementMap, source) {
  const imports = [];
  for (let [key, value] of elementMap) {
    imports.push(`${key} as ${value}`);
  }
  return `import {${imports.join(', ')}} from '${source}';`;
}

function createElementMap(names) {
  return new Map(
    Array.from(names.entries())
      .map(([a, b], i) => [a, `${a.toUpperCase()}`])
    );
}

function dateToString(date) {
  return date ? date.toISOString().split('T')[0] : '';
}

function frontmatterExports(fm = {}) {
  const keys = Object.keys(fm);
  return keys.map(key => {
    const val = key === 'date' ? dateToString(fm[key]) : fm[key];
    return `export const ${key} = '${val || ''}';`;
  }).join('\n');
}
