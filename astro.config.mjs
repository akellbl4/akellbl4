export default {
	renderers: ['@astrojs/renderer-preact'],
	buildOptions: {
		site: 'http://pavel.mineev.me',
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
};
