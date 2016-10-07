import InfernoDOM from 'inferno-dom';
import StyletronClient from 'styletron-client';

import App from './app';

const styletron = new StyletronClient(document.getElementsByClassName('styletron'));

InfernoDOM.render(<App styletron={styletron}/>, document.getElementById('app'));
