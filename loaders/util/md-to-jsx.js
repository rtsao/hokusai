const path = require('path');
const unified = require('unified');
const markdown = require('remark-parse');
const htmlParse = require('rehype-parse');
const toHAST = require('mdast-util-to-hast');
const remarkTextr = require('remark-textr');
const typographicBase = require('typographic-base');
const toHTML = require('hast-util-to-html');
const yaml = require('js-yaml');

const {parse, run} = unified()
  .use(markdown)
  .use(remarkTextr, {
    plugins: [typographicBase],
    options: {locale: 'en-us'}
  });

const htmlParser = unified()
  .use(htmlParse).parse;

function mdToJsx(source, opts) {
  const mdast = run(parse(source, {
    footnotes: true
  }));

  const frontmatter = (
    mdast.children.length &&
    mdast.children[0].type === 'yaml' &&
    mdast.children[0].value
  );

  const parsed = frontmatter ? yaml.safeLoad(frontmatter): {};
  
  const hast = toHAST(mdast, {allowDangerousHTML: true});

  hast.children = hast.children.map(node => {
    if (node.type !== 'raw') {
      return node;
    }
    const val = htmlParser(node.value, {fragment: true});
    if (val.children.length && val.children[0].type === 'comment') {
      const comment = val.children[0].value.trim();
      return {
        type: 'text',
        value: comment
      };
    }
    return node;
  });

  const html = toHTML(hast, {
    closeSelfClosing: true
  });
  return {html, frontmatter: parsed};
}

module.exports = mdToJsx;
