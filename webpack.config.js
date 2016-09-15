var path = require('path');

var production = !!~process.argv.indexOf('-p');

// TODO: change this in array rather than clunky option
module.exports = {
  entry: './src/index.js',
  output: {
    filename: production ? 'graphology.min.js' : 'graphology.js',
    path: path.join(__dirname, 'build'),
    library: 'graphology',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};
