import Inferno from 'inferno'

export default function Link(props, context) {
  const clickHandler = e => {
    if (e.button !== 0 || e.ctrlKey || e.altKey) {
      return;
    }
    e.preventDefault();
    context.routeTo(props.to);
  }
  return <a href={props.to} onClick={clickHandler}>{props.children}</a>;
}
