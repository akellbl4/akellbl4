import { type APIRoute } from 'astro'
import rss, { pagesGlobToRssItems } from '@astrojs/rss'
import { z } from 'zod'

const PostsSchema = z.array(
	z.object({
		slug: z.string(),
		frontmatter: z.object({
			title: z.string(),
			summary: z.string(),
			publishedAt: z.string(),
		}),
	})
)

export const GET: APIRoute = async function GET(context) {
	const rawPosts = await pagesGlobToRssItems(import.meta.glob('./blog/*.md'))

	if (context.site === undefined) {
		throw new Error('context.site is undefined')
	}

	const posts = PostsSchema.parse(rawPosts)

	return rss({
		title: `Paul Mineev's Blog`,
		description: "A humble Astronaut's guide to the stars",
		site: context.site,
		items: posts.map((post) => ({
			link: `/blog/${post.slug}/`,
			title: post.frontmatter.title,
			description: post.frontmatter.summary,
			pubDate: new Date(Date.parse(post.frontmatter.publishedAt)),
		})),
	})
}
