module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		jest: true,
	},
	extends: [
		'plugin:react/recommended', //
		'airbnb',
		'plugin:prettier/recommended',
	],
	plugins: [
		'react', //
		'prettier',
	],
	parserOptions: {
		requireConfigFile: false,
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	overrides: [],
	rules: {
		// prettier configs
		'prettier/prettier': [
			'error',
			{},
			{
				usePrettierrc: true,
			},
		],

		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',

		// react rules
		'react/no-unstable-nested-components': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/function-component-definition': [
			2,
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function',
			},
		],

		// JS rules
		'no-console': 'error',

		// array format rules
		'array-element-newline': [
			'error',
			{
				ArrayExpression: 'consistent',
				ArrayPattern: {
					minItems: 2,
				},
			},
		],

		// reducing code complexity by capping the amount
		// of cyclomatic complexity allowed in a program.
		complexity: ['error', 10],

		// enforces a maximum depth that blocks can be nested to reduce code complexity.
		'max-depth': ['error', 3],

		// enforces a maximum number of lines per file,
		// in order to aid in maintainability and reduce complexity.
		'max-lines': [
			'error',
			{
				max: 1000,
				skipBlankLines: true,
				skipComments: true,
			},
		],

		// enforces a maximum number of lines per function,
		// in order to aid in maintainability and reduce complexity.
		'max-lines-per-function': [
			'error',
			{
				max: 200,
				skipBlankLines: true,
				skipComments: true,
				IIFEs: true,
			},
		],

		// enforces a maximum number of parameters in function definitions
		'max-params': ['error', 3],

		// enforces a maximum number of statements allowed in function blocks.
		'max-statements': ['error', 20],

		//  enforces a maximum depth that callbacks can be nested
		'max-nested-callbacks': ['error', 2],

		// max line length
		'max-len': [
			1,
			120,
			2,
			{
				ignoreComments: true,
			},
		],
	},
};
