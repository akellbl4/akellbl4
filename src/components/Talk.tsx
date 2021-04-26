import { LangBadge } from './LangBadge'

type Props = React.PropsWithChildren<{
	title: string
	lang?: string
	conferences: {
		name: string
		year: string
	}[]
}>

export function Talk({ title, conferences, lang, children }: Props) {
	return (
		<section>
			<h3 className="flex text-lg">
				{lang && (
					<>
						<LangBadge lang={lang} />{' '}
					</>
				)}
				{title}
			</h3>
			{conferences && (
				<ul>
					{conferences.map(({ name, year }, i) => (
						<li key={i} className="text-gray-700 dark:text-gray-300">
							{name}, <span className="text-gray-500 dark:text-gray-400">{year}</span>
						</li>
					))}
				</ul>
			)}
			<p>{children}</p>
		</section>
	)
}
