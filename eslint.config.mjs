import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({ enableTypescript: true }).then((base) => [
	...base,
	{
		files: ['tests/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.test.json',
			},
		},
	},
])
