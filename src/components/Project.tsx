import { Link } from 'components/Link'

type Props = React.PropsWithChildren<{
	url: string
	title: string
}>

export function Project({ url, title, children }: Props) {
	return (
		<section className="project relative block px-4 py-3 -mx-3 sm:mx-0 sm:px-6 sm:py-5 border border-gray-100 dark:border-gray-700 rounded-lg transition-shadow duration-200 hover:shadow-xl dark:transform dark:transition-transform dark:hover:-translate-y-1">
			<h3 className="flex items-center mb-2 text-xl font-bold">
				<Link href={url} className="block-link">
					{title}
				</Link>
				<svg
					className="ml-auto w-6 h-6 opacity-60"
					dangerouslySetInnerHTML={{ __html: `<use xlink:href="#github-icon"></use>` }}
				/>
			</h3>
			<p>{children}</p>
		</section>
	)
}
