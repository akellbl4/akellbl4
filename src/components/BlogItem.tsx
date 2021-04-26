import { Link } from 'components/Link'
import { ViewCounter } from 'components/ViewCounter'
import { LangBadge } from './LangBadge'

type Props = {
	title: string
	summary: string
	slug: string
	hasContent: boolean
	lang?: string
	original?: {
		url: string
	}
}

export function BlogItem({ title, summary, slug, lang, hasContent, original }: Props) {
	return (
		<article className="relative">
			<div className="flex flex-col sm:flex-row justify-between mb-2">
				<h3 className="flex mb-1 sm:mb-0 text-lg sm:text-xl font-bold w-full text-gray-900 dark:text-gray-100">
					<Link
						href={hasContent ? `/blog/${slug}` : original?.url ?? ''}
						className="block-link flex transition-opacity opacity-80 hover:opacity-100"
					>
						{lang && (
							<>
								<LangBadge lang={lang} />{' '}
							</>
						)}
						{title}
						{!hasContent && <svg aria-hidden="true" className="w-6 h-6" />}
					</Link>
				</h3>
				{hasContent && (
					<span className="whitespace-nowrap text-sm sm:text-base text-gray-500 text-left md:text-right">
						<ViewCounter slug={slug} />
					</span>
				)}
			</div>
			<p className="text-gray-600 dark:text-gray-400 max-w-2xl">{summary}</p>
		</article>
	)
}
