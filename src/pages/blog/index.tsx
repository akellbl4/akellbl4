import { BlogItem } from 'components/BlogItem'
import { getAllBlogPostsFrontmatter } from 'lib/mdx'
import type { InferGetStaticPropsType } from 'next'

export async function getStaticProps() {
	const posts = await getAllBlogPostsFrontmatter()

	return { props: { posts } }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export default function Blog({ posts }: Props) {
	return (
		<>
			<h1 className="font-bold text-4xl sm:text-5xl tracking-tight mb-6 sm:mb-10">Blog</h1>
			<ul className="space-y-8 sm:space-y-12">
				{posts.map((p) => (
					<li key={p.slug}>
						<BlogItem {...p} />
					</li>
				))}
			</ul>
		</>
	)
}

Blog.meta = {
	title: 'Blog - Pavel Mineev',
	description: 'Here is my blog. I started to write not so long ago and trying my best',
}
