const babylon = require('babylon');

module.exports = function getExports(code) {
  const parsed = babylon.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'objectRestSpread'
    ]
  });
  const names = new Set();
  parsed.program.body.forEach(node => {
    if (node.type === 'ExportNamedDeclaration') {
      getExportNames(node).forEach(name => names.add(name));
    }
  });
  return names;
}

function getExportNames(namedExport) {
  const names = [];
  if (namedExport.declaration) {
    namedExport.declaration.declarations.forEach(decl => {
      names.push(decl.id.name);
    });
  } else {
    namedExport.specifiers.forEach(specifier => {
      names.push(specifier.exported.name);
    });
  }
  return names;
}
