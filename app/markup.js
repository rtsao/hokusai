export default ({children, links, typekitKey, title, gaKey, appContent, styletronSheets, meta}) => {
  return (
  <html lang="en">
  <head>
  <title>{title}</title>
  {meta ? meta.map(attrs => <meta {...attrs}/>) : ''}
  {styletronSheets.map(sheet =>
    <style className="styletron" media={sheet.media} dangerouslySetInnerHTML={{__html:
    sheet.css
  }}/>
  )}
  {typekitKey ? <link rel="stylesheet" href={
    `https://use.typekit.net/${typekitKey}.css`
  }/> : ''}
  {links ? links.map(attrs => <link {...attrs}/>) : ''}
  </head>
  <body>
  <div
    id="app"
    dangerouslySetInnerHTML={{__html: appContent}}
  />
  </body>
  <script src="/client.bundle.js"></script>
  {gaKey ? <script dangerouslySetInnerHTML={{__html: gaScript(gaKey)}}/> : ''}
  {gaKey ? <script src="https://www.google-analytics.com/analytics.js" async defer/> : ''}
  </html>
)};

function gaScript(key) {
  return [
    `window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;`,
    `ga('create','${key}','auto');ga('send','pageview')`
  ].join('');
}
