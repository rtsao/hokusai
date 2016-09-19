import Inferno from 'inferno'

import content from './_content.md';

export const title = 'Index Title';

export default () => (
  <div>
    <h1>index</h1>
    {content}
  </div>
);
