const headers = [
	{
		key: 'Content-Security-Policy',
		value:
			"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'unsafe-eval' 'self' https://static.cloudflareinsights.com; img-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://cloudflareinsights.com",
	},
	{ key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-DNS-Prefetch-Control', value: 'on' },
	{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
	{ key: 'Permissions-Policy', value: 'geolocation=()' },
]

module.exports = {
	images: {
		domains: [
			'i.scdn.co', // Spotify Albums Covers
		],
	},
	headers() {
		if (process.env.NODE_ENV !== 'production') {
			return []
		}

		return [
			{ source: '/', headers },
			{ source: '/:path*', headers },
		]
	},
	redirects() {
		const { posts } = require('./scripts/get-blog-frontmatters')

		const externalPosts = posts
			.filter((p) => p.original?.external)
			.map((p) => ({ source: `/blog/${p.slug}`, destination: p.original.url, permanent: false }))

		return [
			{
				source: '/1h',
				destination: 'https://calendly.com/akellbl4/1h',
				permanent: false,
			},
			{
				source: '/resume',
				destination: '/resume-2021.pdf',
				permanent: false,
			},
			...externalPosts,
		]
	},
	webpack(config, { dev, isServer }) {
		if (isServer) {
			require('./scripts/generate-sitemap')
			require('./scripts/generate-rss')
		}

		if (!dev && !isServer) {
			Object.assign(config.resolve.alias, {
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
			})
		}

		return config
	},
}
