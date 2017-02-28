const path = require('path');

module.exports = ({

  entry: [
    __dirname
  ],

  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, '..'),
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.node/,
        loaders: ['node-loader']
      }
    ]
  },

  devtool: 'cheap-module-eval-sourcemap',
});