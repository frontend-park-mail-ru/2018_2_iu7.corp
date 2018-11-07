const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
		main: './src/js/script.js'
	},

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},

			{
				test: /\.pug$/,
				use: 'pug-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
				  loader: 'babel-loader',
				  options: {
					presets: ['@babel/preset-env']
				  }
				}
			}

		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html'
		})
	]

};
