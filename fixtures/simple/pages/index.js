import content from './_content.md';

export const title = 'Index Title';

// const content = (
//   <div><p>Hello world<sup><a>Foo</a></sup></p></div>
// // <div><p>Here is a footnote reference,<sup><a>1</a></sup></p></div>
// );

// const yo = (
//   <sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup>
// )

export default () => (
  <div>
    <h1>index</h1>
    {content}
  </div>
);
