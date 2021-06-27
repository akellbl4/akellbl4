export default {
	renderers: ['@astrojs/renderer-preact'],
	buildOptions: {
		sitemap: true,
		site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://pavel.mineev.me',
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
};
