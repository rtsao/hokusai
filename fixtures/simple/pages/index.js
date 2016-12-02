import circle from './circle.svg';
import content from './_content.md';

export const title = 'Index Title';

export default () => (
  <div>
    <h1>Index page</h1>
    <img src={circle}/>
    {content}
    {require('./_partial.js').default}
  </div>
);
