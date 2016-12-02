import circle from './circle.svg';
import content from './_content.md';

export const title = 'Index Title';

export default () => (
  <div>
    <h1>Index page</h1>
    <img width={200} src={circle}/>
    {content}
    {require('./_partial.js').default}
  </div>
);
