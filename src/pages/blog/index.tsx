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
			<svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
				<symbol id="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</symbol>
			</svg>
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
