const fs = require('fs')
const globby = require('globby')
const htmlmin = require('html-minifier')

const { baseUrl } = require('../src/meta.json')

const pages = globby.sync([
	'src/pages/*.tsx',
	'data/blog/*.mdx',
	'!src/pages/api',
	'!src/pages/_*.tsx',
	'!src/pages/404.tsx',
])

const content = pages
	.map((p) => {
		const path = p
			.replace('src/pages', '')
			.replace('data', '')
			.replace('.tsx', '')
			.replace('.mdx', '')
		const route = path === '/index' ? '' : path
		const url = `${baseUrl}${route}`

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
