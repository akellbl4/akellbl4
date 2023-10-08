

/** @type {import("prettier").Config} */
const config = {
  semi: false,
	trailingComma: 'es5',
	singleQuote: true,
	printWidth: 100,
  tailwindConfig: './site/tailwind.config.js',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};

export default config;
