var path = require('path');

var production = !!~process.argv.indexOf('-p');

module.exports = {
  mode: production ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: production ? 'graphology.min.js' : 'graphology.js',
    path: path.join(__dirname, 'build'),
    library: 'graphology',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
