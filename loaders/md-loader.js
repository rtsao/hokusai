const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');
const getExports = require('./util/get-exports');
const mdToHast = require('./util/md-to-hast');
const hastToJsx = require('./util/hast-to-jsx');

module.exports = markdownLoader;

function markdownLoader(source) {
  this.cacheable();
  const {hast, frontmatter} = mdToHast(source);

  let elementMap;
  if (frontmatter.dom) {
    const domPath = path.resolve(this.context, frontmatter.dom);
    this.addDependency(domPath); // make this better? should this be absolute?
    let stuff;
    try {
      stuff = fs.readFileSync(domPath, 'utf8');
    } catch (e) {

    }
    if (stuff) {
      elementMap = createElementMap(getExports(stuff));
      visit(hast, 'element', function(node) {
        if (elementMap.has(node.tagName)) {
          node.tagName = elementMap.get(node.tagName);
        }
      });
    }
  }


  let yoyo = '';
  if (elementMap) {
    const woot = [];
    for (let [key, value] of elementMap) {
      woot.push(`${key} as ${value}`);
    }
    yoyo = `import {${woot.join(', ')}} from '${frontmatter.dom}';`;
    // console.log(elementMap.entries());
    // elementMap.entries().forEach(([a, b]) => {
    //   console.log('zz', a, b);
    // });
  }

  const jsx = hastToJsx(hast, {elementMap});

  console.log(yoyo);
  return `

  import Inferno from 'inferno';

  ${yoyo}

  ${frontmatterExports(frontmatter)}

  export default (\n<div>${jsx}</div>\n);

`;
}

function createElementMap(names) {
  console.log(names);
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
