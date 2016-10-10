export default class StyletronProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.styletron = props.styletron;
  }

  getChildContext() {
    return {
      styletron: this.styletron
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
