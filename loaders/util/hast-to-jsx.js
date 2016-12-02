const path = require('path');
const unified = require('unified');
const htmlParse = require('rehype-parse');
const visit = require('unist-util-visit');
const toHTML = require('hast-util-to-html');

const htmlParser = unified()
  .use(htmlParse).parse;

module.exports = hastToJsx;

function hastToJsx(hast, opts) {
  hast = loadRelativeImages(hast);
  if (opts.elementMap) {
    hast = remapHast(hast, opts.elementMap);
  }
  hast = replaceRawComments(hast);
  return toHTML(hast, {
    closeSelfClosing: true,
    allowDangerousHTML: true
  });
}

function loadRelativeImages(hast) {
  visit(hast, 'element', node => {
    if (node.tagName === 'img' && node.properties.src && !path.isAbsolute(node.properties.src)) {
      node.type = 'raw';
      node.value = `<img src={require('${node.properties.src}')}/>`;
    }
  });
  return hast;
}

function remapHast(hast, elementMap) {
  visit(hast, 'element', node => {
    if (elementMap.has(node.tagName)) {
      node.tagName = elementMap.get(node.tagName);
    }
  });
  return hast;
}

function replaceRawComments(hast) {
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
  return hast;
} 
