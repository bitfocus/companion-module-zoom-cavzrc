import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableJest: true,
	enableTypescript: true,
})

const customConfig = [
	...baseConfig,
	{
		files: ['!.squad/**', 'src/**/*.ts', 'src/**/*.js', 'src/**/*.mjs', 'tests/**/*.ts', 'jest.config.ts'],
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		},
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.test.json',
			},
		},
	},
]

export default customConfig
