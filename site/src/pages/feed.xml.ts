import rss from '@astrojs/rss'

const postImportResult = import.meta.globEager('./blog/**/*.md')
const posts = Object.values(postImportResult)

export function get() {
	return rss({
		title: `Paul Mineev's Blog`,
		description: 'A humble Astronaut’s guide to the stars',
		site: import.meta.env.SITE,
		items: posts.map((post) => ({
			link: post.url,
			title: post.frontmatter.title,
			pubDate: post.frontmatter.publishedAt,
		})),
	})
}
