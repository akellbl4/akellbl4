export default {
	renderers: ['@astrojs/renderer-preact'],
	buildOptions: {
		sitemap: true,
		site: 'http://pavel.mineev.me',
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
};
