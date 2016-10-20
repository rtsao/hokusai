import App from './app';

const styletron = new StyletronClient(document.getElementsByClassName('styletron'));

Inferno.render(<App styletron={styletron}/>, document.getElementById('app'));
