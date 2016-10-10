import App from './app';

const styletron = new StyletronClient(document.getElementsByClassName('styletron'));

InfernoDOM.render(<App styletron={styletron}/>, document.getElementById('app'));
