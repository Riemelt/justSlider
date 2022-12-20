const faviconContext = require.context(
  './',
  true,
  /\.(svg|png|ico|xml|json)$/
);

faviconContext.keys().forEach(faviconContext);
