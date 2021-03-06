/**
 * Possibly eliminate w/ server-side rewrites
 */

const ext = /\.html$/;
const index = /\/index$/;

function normalizePathname(url) {
  return url.replace(ext, '').replace(index, '/');
}

export default class StaticRouter extends Component {
  constructor(props, context) {
    super(props, context);
    this.handlePopState = this.handlePopState.bind(this);
    this.routeTo = this.routeTo.bind(this);
    this.state = {
      pathname: props.pathname || normalizePathname(window.location.pathname)
    };
  }

  getChildContext() {
    return {
      routeTo: this.routeTo,
      currentRoute: this.state.pathname
    };
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
     window.addEventListener('popstate', this.handlePopState); 
   }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
     window.removeEventListesner('popstate', this.handlePopState);   
    }
  }

  handlePopState() {
    this.setRoute(window.location.pathname)
  }

  routeTo(pathname) {
    if (pathname !== this.state.pathname) {
      this.setRoute(pathname, true);
    }
  }

  setRoute(pathname, pushState) {
    const {title} = this.props.routes[pathname];
    if (pushState) {
      window.history.pushState({}, title, pathname);
    }
    document.title = title;
    this.setState({pathname});
    if (window.ga) {
      window.ga('send', 'pageview');
    }
  }

  render() {
    const {component: RouteHandler} = this.props.routes[this.state.pathname] || this.props.routes['/404'];
    return <RouteHandler/>;
  }
}
