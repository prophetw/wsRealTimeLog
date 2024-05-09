const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './logReader/index.js',
	mode: "development",
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './logReader/index.html',
			filename: 'index.html',
		}),
	],
	devServer: {
		port: 4003,
	},
};