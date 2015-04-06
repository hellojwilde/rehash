var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  resolve: {
    root: __dirname + '/src'
  },
  output: {
    path: __dirname + '/dist',
    publicPath: 'http://localhost:3000/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.js$/, loader: 'react-hot!babel-loader?experimental', exclude: /node_modules/},
      {test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
