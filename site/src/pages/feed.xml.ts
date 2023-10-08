import rss from '@astrojs/rss'


export async function GET(context) {
  const posts = await import.meta.glob('./blog/*.md');
  const items = await Promise.all(Object.values(posts).map(async (post) => await post()));

  console.log(items)
	return rss({
		title: `Paul Mineev's Blog`,
		description: "A humble Astronaut's guide to the stars",
		site: context.site,
		items: items.map((post) => ({
      link: `/blog/${post.slug}/`,
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      pubDate: new Date(Date.parse(post.frontmatter.publishedAt)),
    }))
	})
}
