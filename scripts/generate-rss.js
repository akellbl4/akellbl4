const fs = require('fs')
const RSS = require('rss')

const { posts } = require('./get-blog-frontmatters')
const { baseUrl } = require('../src/meta.json')

const feed = new RSS({
	title: 'Pavel Mineev',
	site_url: baseUrl,
	feed_url: `${baseUrl}/feed.xml`,
})

posts.forEach((data) => {
	feed.item({
		url: `${baseUrl}/blog/${data.slug}`,
		title: data.title,
		date: data.publishedAt,
		description: data.summary,
	})
})

fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
