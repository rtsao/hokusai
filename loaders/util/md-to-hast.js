const unified = require('unified');
const markdown = require('remark-parse');
const toHAST = require('mdast-util-to-hast');
const remarkTextr = require('remark-textr');
const typographicBase = require('typographic-base');
const yaml = require('js-yaml');

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
  let hast = toHAST(mdast, {allowDangerousHTML: true});
  return {hast, frontmatter: parsed};
}

module.exports = mdToHast;
