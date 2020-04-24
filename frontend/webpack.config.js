const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'build'
  },
  devtool: "source-map",
  module: {
      rules: [
          { test: /\.jsx?$/, exclude: /node_modules/, include: /src/, loader: "babel-loader" },
          {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ],
          }
      ],
  },
};