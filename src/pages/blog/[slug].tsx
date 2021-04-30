import Image from 'next/image'
import type { GetStaticPropsContext, InferNextPageStaticProps, NextPageMeta } from 'next'

import { getAllBlogPostsFrontmatter, getFileContent, PostFrontmatter } from 'lib/mdx'
import { Link } from 'components/Link'
import { ViewCounter } from 'components/ViewCounter'

export async function getStaticPaths() {
	const posts = await getAllBlogPostsFrontmatter()

	return {
		paths: posts.filter((p) => !p.original?.external).map(({ slug }) => ({ params: { slug } })),
		fallback: false,
	}
}

type Context = GetStaticPropsContext<{ slug: string }>

export async function getStaticProps({ params }: Context) {
	const { frontmatter, content } = await getFileContent<PostFrontmatter>(
		`blog/${params!.slug}.mdx`,
		true
	)

	const meta: NextPageMeta = {
		title: frontmatter.title,
		date: frontmatter.publishedAt,
	}

	if (frontmatter.original?.url) {
		meta.canonical = frontmatter.original.url
	}

	return {
		props: {
			meta,
			original: frontmatter.original || null,
			readingTime: frontmatter.readingTime,
			publishedAt: frontmatter.publishedAt,
			content,
		},
	}
}

type Props = InferNextPageStaticProps<typeof getStaticProps, { slug: string }>

export default function Blog({ meta, readingTime, publishedAt, original, content, router }: Props) {
	const { slug } = router.query

	return (
		<article
			className="my-6"
			itemProp="blogPost"
			itemScope
			itemType="https://schema.org/BlogPosting"
		>
			<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 " itemProp="name headline">
				{meta.title}
			</h1>
			<header className="flex items-center mb-8 sm:mb-10">
				<figure className="bg-gray-200 w-8 h-8 sm:w-6 sm:h-6 mr-4 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-800">
					<Image alt={process.env.NAME} height={32} width={32} src="/images/photo.jpg" priority />
				</figure>
				<div className="flex flex-col sm:flex-row sm:justify-between sm:w-full text-sm">
					<div className="text-gray-600 dark:text-gray-400">
						<span itemProp="author" itemScope itemType="https://schema.org/Person">
							<span itemProp="name">Pavel Mineev</span>
						</span>
						&nbsp;at&nbsp;
						<time itemProp="datePublished" dateTime={meta.date}>
							{publishedAt}
						</time>
					</div>
					<div className="text-gray-500">
						{readingTime}
						<span className="inline-block mx-2" role="separator">
							•
						</span>
						<ViewCounter slug={slug} count />
					</div>
				</div>
			</header>
			<section
				className="prose dark:prose-dark w-full mb-6 mx-auto"
				itemProp="articleBody"
				dangerouslySetInnerHTML={{ __html: content }}
			/>
			<footer className="max-w-[65ch] w-full mx-auto flex justify-between text-gray-600 dark:text-gray-400">
				<div className="text-sm">
					<Link
						className="transition inline-block border-b border-transparent hover:border-gray-600"
						href={`https://mobile.twitter.com/search?q=${encodeURIComponent(
							`${process.env.NEXT_PUBLIC_VERCEL_URL}/blog/${slug})`
						)}`}
					>
						Discuss on Twitter
					</Link>
					<span className="mx-2" role="separator">
						•
					</span>
					<Link
						className="transition inline-block border-b border-transparent hover:border-gray-600"
						href={`${process.env.GITHUB_REPO_URL}/edit/main/data/blog/${slug}.mdx`}
					>
						Edit on GitHub
					</Link>
				</div>
				{original && (
					<div className="text-sm">
						Originally posted on{' '}
						<Link
							className="transition inline-block border-b border-transparent hover:border-gray-600"
							href={original.url}
						>
							{original.name}
						</Link>
					</div>
				)}
			</footer>
		</article>
	)
}
