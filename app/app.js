import Inferno from 'inferno';

import Router from './router';

import routes from 'routes-loader!';

function App({pathname}) {
  return <Router pathname={pathname} routes={routes}/>;
}

export default App;
