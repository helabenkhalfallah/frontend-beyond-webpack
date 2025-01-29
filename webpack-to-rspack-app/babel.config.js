// eslint-disable-next-line func-names
module.exports = function (api) {
	api.cache(true);

	const presets = [
		[
			'@babel/preset-env',
			{
				targets: '>0.25%',
			},
		],
		'@babel/preset-react',
	];

	const plugins = ['@babel/plugin-transform-regenerator'];

	return {
		presets,
		plugins,
	};
};
