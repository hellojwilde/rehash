var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'App.js'),

  output: {
    filename: 'bundle.js',
    path: __dirname
  },

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader?experimental=true'},
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
};
