/** Created by ge on 2/17/17. */

module.exports = {
  entry: [
    'babel-polyfill',
    './demo-page/index.js'
  ],
  module: {
    loaders: [
      {test: /.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  output: {
    filename: 'index.bundle.js',
    path: './demo-page/'
  }
};
