const path = require('path');

const ext = /\.(md|js)$/;
const index = /\/index$/;
const trailing = /\/$/;

module.exports = pageInfoFromFilenames;

function pageInfoFromFilenames(filenames) {
  const normalizedNames = sortAndNormalize(filenames);
  const info = normalizedNames.reduce((acc, {pathname, key}, i) => {
    let isTrueIndex = false;
    for (let j = i + 1; j < normalizedNames.length; j++) {
      if (normalizedNames[j].pathname.substring(0, pathname.length) === pathname) {
        isTrueIndex = true;
        break;
      }
    }

    if (isTrueIndex) {
      const indexPath = pathname.replace(trailing, '/index')
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
