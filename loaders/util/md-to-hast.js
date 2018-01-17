const unified = require('unified');
const markdown = require('remark-parse');
const toHAST = require('mdast-util-to-hast');
const remarkTextr = require('remark-textr');
const typographicBase = require('typographic-base');
const yaml = require('js-yaml');
const jsStringEscape = require('js-string-escape');

const detab = require('detab');
const u = require('unist-builder');

const {parse, run} = unified()
  .use(markdown)
  .use(remarkTextr, {
    plugins: [typographicBase],
    options: {locale: 'en-us'}
  });

function mdToHast(source, opts) {
  const mdast = run(parse(source, {
    footnotes: true
  }));
  const frontmatter = (
    mdast.children.length &&
    mdast.children[0].type === 'yaml' &&
    mdast.children[0].value
  );
  const parsed = frontmatter ? yaml.safeLoad(frontmatter): {};
  let hast = toHAST(mdast, {
    allowDangerousHTML: true,
    handlers: {
      code
    }
  });
  return {hast, frontmatter: parsed};
}

module.exports = mdToHast;


/* Transform a code block. */
function code(h, node) {
  var value = node.value ? detab(node.value + '\n') : '';
  var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
  var props = {};

  if (lang) {
    props.className = ['language-' + lang];
  }

  value = `{"${jsStringEscape(value)}"}`;

  return h(node.position, 'pre', [
    h(node, 'code', props, [u('text', value)])
  ]);
}
