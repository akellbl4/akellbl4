import { Link } from 'components/Link'
import { ViewCounter } from 'components/ViewCounter'

type Props = {
	title: string
	summary: string
	slug: string
}

export function BlogItem({ title, summary, slug }: Props) {
	return (
		<article className="relative">
			<div className="flex flex-col sm:flex-row justify-between mb-2">
				<h3 className="mb-1 sm:mb-0 text-lg sm:text-xl font-bold w-full text-gray-900 dark:text-gray-100">
					<Link
						href={`/blog/${slug}`}
						className="block-link block transition-opacity opacity-80 hover:opacity-100"
					>
						{title}
					</Link>
				</h3>
				<span className="whitespace-nowrap text-sm sm:text-base text-gray-500 text-left md:text-right">
					<ViewCounter slug={slug} />
				</span>
			</div>
			<p className="text-gray-600 dark:text-gray-400">{summary}</p>
		</article>
	)
}
