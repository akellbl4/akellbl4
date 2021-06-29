export default {
	renderers: ['@astrojs/renderer-preact'],
	buildOptions: {
		sitemap: true,
		site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://pavel.mineev.me',
	},
	markdownOptions: {
		remarkPlugins: [
			// import('remark-slug'),
			import('remark-code-titles'),
			// import('remark-autolink-headings')
		]
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
};
