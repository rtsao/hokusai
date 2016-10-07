const path = require('path');

const ext = /\.(md|js)$/;
const index = /\/index$/;
const trailing = /\/$/;

module.exports = transformPages;

function transformPages(pages) {
  const normalized = sortAndNormalize(pages);
  const info = normalized.reduce((acc, {pathname, key}, i) => {
    let isTrueIndex = false;
    for (let j = i + 1; j < normalized.length; j++) {
      if (normalized[j].pathname.substring(0, pathname.length) === pathname) {
        isTrueIndex = true;
        break;
      }
    }

    if (isTrueIndex) {
      const indexPath = pathname.replace(trailing, '/index')
      // return {
      //   entry: key,
      //   pathname: pathname,
      //   dest: `.${indexPath}.html`
      // }
      acc[pathname] = {
        entry: key,
        dest: `.${indexPath}.html`
      }
      return acc;
    }

    const shortPath = pathname.replace(trailing, '');
    acc[pathname] = {
      entry: key,
      dest: `.${shortPath}.html`
    };
    return acc;
    // return {
    //   entry: key,
    //   pathname: shortPath,
    //   dest: `.${shortPath}.html`
    // }
  }, {});

  return info;
}

function normalizePathname(url) {
  return url.replace(ext, '').replace(index, '/');
}

function sortAndNormalize(pages) {
  return pages
    .map(key => ({key: `.${key}`, pathname: normalizePathname(key)}))
    .sort((a, b) => {
      if (a.pathname.length > b.pathname.length) {
        return 1;
      }
      if (a.pathname.length < b.pathname.length) {
        return -1;
      }
      return 0;
    });
}
