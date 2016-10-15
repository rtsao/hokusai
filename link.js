export default function Link(props, context) {
  const clickHandler = e => {
    if (e.button !== 0 || e.ctrlKey || e.altKey) {
      return;
    }
    e.preventDefault();
    context.routeTo(props.to);
  }
  const activeStyles = props.activeStyles || props.styles;
  const styles = context.currentRoute === props.to ? activeStyles : props.styles;
  const styletron = context.styletron;
  return <a style={styles} href={props.to} onClick={clickHandler}>{props.children}</a>;
}
