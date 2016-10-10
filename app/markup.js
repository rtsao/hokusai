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
  {typekitKey ? <script src={
    `https://use.typekit.net/${typekitKey}.js`
  }/> : ''}
  {typekitKey ? <script dangerouslySetInnerHTML={{__html:
    'try{Typekit.load({async:true});}catch(e){}'
  }}/> : ''}
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
  </html>
)};

function gaScript(key) {
  return (
    `
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', '${key}', 'auto');
    ga('send', 'pageview');

    `);
}
