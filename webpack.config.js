const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  entry: {
    app: './public/js/script.js',
  },

  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'public'),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: './public/index.html',
    }),
  ],

};