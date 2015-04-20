var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3001',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  resolve: {
    root: __dirname + '/src'
  },
  output: {
    path: __dirname + '/../static/bundle',
    publicPath: 'http://localhost:3001/static/bundle/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader'},
      {test: /\.js$/, loader: 'react-hot!babel-loader?experimental', exclude: /node_modules/},
      {test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
