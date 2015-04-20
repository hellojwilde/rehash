var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',

  resolve: {
    root: __dirname + '/src'
  },

  output: {
    path: __dirname + '/../static/bundle',
    publicPath: '/static/bundle/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader'},
      {test: /\.js$/, loader: 'babel-loader?experimental', exclude: /node_modules/},
      {test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/, loader: 'url-loader?limit=8192'}
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};