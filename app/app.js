import Router from './router';
import StyletronProvider from './styletron-provider';

import routes from 'routes-loader!';

function App({pathname, styletron}) {
  return (
    <StyletronProvider styletron={styletron}>
      <Router pathname={pathname} routes={routes}/>
    </StyletronProvider>
  );
}

export default App;
