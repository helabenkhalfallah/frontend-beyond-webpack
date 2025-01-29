/* eslint-disable import/no-extraneous-dependencies */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import zlib from 'zlib';
import CompressionPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer-brotli';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

export default defineConfig({
	context: __dirname,
	entry: {
		main: '../src/index.js',
	},
	resolve: {
		extensions: ['...', '.ts', '.tsx', '.js', '.jsx'],
	},
	devServer: {
		hot: true,
		port: 9001,
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: 'asset',
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: 'builtin:swc-loader',
						options: {
							jsc: {
								parser: {
									syntax: 'typescript',
									tsx: true,
								},
								transform: {
									react: {
										runtime: 'automatic',
										development: false,
										refresh: false,
									},
								},
							},
							env: { targets },
						},
					},
				],
			},
		],
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: '../public/index.html',
		}),
		// Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
		process.env.RSDOCTOR &&
			new RsdoctorRspackPlugin({
				// plugin options
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
		process.env.BUNDLEANALYZE &&
			new BundleAnalyzerPlugin({
				analyzerPort: 9003,
			}),
	].filter(Boolean),
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets },
			}),
		],
	},
	experiments: {
		css: true,
	},
});
