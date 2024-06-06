// eslint-disable-next-line import/no-extraneous-dependencies
const TerserPlugin = require('terser-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebPackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CompressionPlugin = require('compression-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const WorkboxPlugin = require('workbox-webpack-plugin');

const zlib = require('zlib');
const path = require('path');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: {
		'swc-frontend': './src/index.jsx',
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: 'swc-frontend-[id].chunk.js',
		clean: true,
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
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].[contenthash:8].css',
			chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
		}),
		new CssMinimizerPlugin(),
		new WorkboxPlugin.GenerateSW({
			// these options encourage the ServiceWorkers to get in there fast
			// and not allow any straggling "old" SWs to hang around
			clientsClaim: true,
			skipWaiting: true,
		}),
		new CompressionPlugin({
			filename: '[path][base].gz',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
		new CompressionPlugin({
			filename: '[path][base].br',
			algorithm: 'brotliCompress',
			test: /\.(js|css|html|svg)$/,
			compressionOptions: {
				params: {
					[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
				},
			},
			threshold: 10240,
			minRatio: 0.8,
		}),
	],
	optimization: {
		realContentHash: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				test: /\.js(\?.*)?$/i,
			}),
		],
	},
};
