export default ({children, title, appContent, styletronSheets}) => {
  return (
  <html lang="en">
  <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>{title}</title>
  {styletronSheets.map(sheet =>
    <style className="styletron" media={sheet.media}>{sheet.css}</style>
  )}
  </head>
  <body>
  <div
    id="app"
    dangerouslySetInnerHTML={{__html: appContent}}
  />
  </body>
  <script src="/client.bundle.js"></script>
  </html>
)};
