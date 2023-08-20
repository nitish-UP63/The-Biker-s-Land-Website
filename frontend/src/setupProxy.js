const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://the-bikers-land.onrender.com',
      changeOrigin: true,
    })
  );
};
