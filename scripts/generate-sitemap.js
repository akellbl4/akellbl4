const fs = require('fs')
const globby = require('globby')
const htmlmin = require('html-minifier')

const pages = globby.sync(['pages/*.tsx', 'data/**/*.mdx', '!src/pages/api'])

const content = pages
	.map((page) => {
		const path = page
			.replace('src/pages', '')
			.replace('data', '')
			.replace('.js', '')
			.replace('.mdx', '')
		const route = path === '/index' ? '' : path
		const url = `${process.env.VERCEL_URL}${route}`

		return `<url><loc>${url}</loc></url>`
	})
	.join('')

const document = `
	<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${content}
	</urlset>
`

const rss = htmlmin.minify(document, { collapseWhitespace: true })

fs.writeFileSync('public/sitemap.xml', rss)
