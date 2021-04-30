const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const datapath = path.resolve(__dirname, '../data/blog')
const filepaths = fs.readdirSync(datapath)

module.exports = {
	posts: filepaths.map((name) => {
		const { data } = matter.read(path.resolve(datapath, name))
		return {
			slug: name.replace(/\.mdx$/, ''),
			...data,
		}
	}),
}
