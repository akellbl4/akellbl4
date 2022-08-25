module.exports = {
	semi: false,
	trailingComma: 'es5',
	singleQuote: true,
	printWidth: 100,
	tailwindConfig: './site/tailwind.config.cjs',
	plugins: [require('prettier-plugin-astro'), require('prettier-plugin-tailwindcss')],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
}
