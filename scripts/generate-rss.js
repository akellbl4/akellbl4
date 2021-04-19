const fs = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

const datapath = path.resolve(__dirname, '../data/blog')
const posts = fs.readdirSync(datapath)
const feed = new RSS({
	title: 'Pavel Mineev',
	site_url: process.env.VERCEL_URL,
	feed_url: `${process.env.VERCEL_URL}/feed.xml`,
})

posts.forEach((name) => {
	const { data } = matter.read(path.resolve(datapath, name))

	feed.item({
		url: `${process.env.VERCEL_URL}/blog/${name.replace(/\.mdx?/, '')}`,
		title: data.title,
		date: data.publishedAt,
		description: data.summary,
	})
})

fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
