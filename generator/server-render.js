const Inferno = require('inferno');
const InfernoServer = require('inferno-server');
const createElement = require('inferno-create-element');
const StyletronServer = require('styletron-server');

module.exports = render;

function render(pathname, Markup, App, props) {
  const styletron = new StyletronServer();
  const appContent = InfernoServer.renderToString(createElement(App, {pathname, styletron}));
  const styletronSheets = styletron.getStylesheets();
  const markupProps = Object.assign({}, props, {appContent, styletronSheets});
  return '<!doctype html>' + InfernoServer.renderToStaticMarkup(createElement(Markup, markupProps));
}
