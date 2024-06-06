// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'eval',
	entry: {
		'swc-frontend': './src/index.jsx',
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
		filename: 'js-swc-frontend-bundle.js',
		clean: true,
	},
	devServer: {
		port: 9000,
		static: {
			directory: path.resolve(__dirname, '../dist'),
			publicPath: '/',
		},
		historyApiFallback: true,
		allowedHosts: 'all',
		compress: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		},
		devMiddleware: {
			writeToDisk: true,
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,        // 1. Match JavaScript files
				exclude: /(node_modules)/, // 2. Exclude node_modules
				use: {
					loader: "swc-loader",    // 3. Use SWC loader for transformation
					// Optional configuration: `.swcrc` can be used to configure SWC
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				test: /\.css$/i,
				exclude: /node_modules\/(?!react-virtualized|slick-).*/,
				use: [
					'style-loader', //
					'css-loader',
				],
			},
			{
				test: /\.scss$/i,
				exclude: /node_modules\/(?!react-virtualized|slick-).*/,
				use: [
					'style-loader', //
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	resolve: {
		extensions: [
			'.js', //
			'.json',
			'.jsx',
			'.css',
			'.scss',
		],
		fallback: {
			util: false,
			buffer: false,
			stream: false,
		},
	},
	plugins: [
		new HtmlWebPackPlugin({
			publicPath: '.',
			inject: true,
			template: path.resolve(__dirname, '../public/index.html'),
			filename: 'index.html',
		}),
	],
};
