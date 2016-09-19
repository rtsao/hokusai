const path = require('path');
const recursive = require('recursive-readdir');

const isPage = /\/(?!_)[^/]+\.(md|js)$/;

function getPages(dir, cb) {
  recursive(dir, (err, files) => {
    if (err) {
      return cb(err);
    }
    const normalized = files
      .map(file => `/${path.relative(dir, file)}`)
      .filter(file => isPage.exec(file));
    return cb(null, normalized);
  });
}

module.exports = getPages;
