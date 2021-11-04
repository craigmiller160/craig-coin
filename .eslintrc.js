module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	rules: {
		'no-unused-vars': 0,
		'prettier/prettier': ['error', {}, { usePrettierrc: true }],
		'no-console': [
			'error',
			{
				allow: ['error', 'warn', 'info', 'debug']
			}
		]
		// '@typescript-eslint/no-unused-vars': 0
	}
};
