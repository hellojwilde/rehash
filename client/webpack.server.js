var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var PORT = 3001;
var HOSTNAME = 'localhost';

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  headers: {'Access-Control-Allow-Origin': '*'}
});

server.listen(PORT, HOSTNAME, function(err, result) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(
    'Listening at HOSTNAME:PORT'
      .replace('HOSTNAME', HOSTNAME)
      .replace('PORT', PORT)
  );
})