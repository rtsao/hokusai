const mdToJsx = require('./util/md-to-jsx');

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

function markdownLoader(source) {
  this.cacheable();
  const {html, frontmatter} = mdToJsx(source);

  return `

  const Inferno = require('inferno');

  ${frontmatterExports(frontmatter)}

  export default (\n<div>${html}</div>\n);

`;
}

module.exports = markdownLoader;
