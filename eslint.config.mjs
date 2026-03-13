import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const base = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...base,
	{
		files: ['tests/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.test.json',
			},
		},
	},
]
