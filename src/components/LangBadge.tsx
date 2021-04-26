type Props = { lang: string }

export function LangBadge({ lang }: Props) {
	return (
		<span className="inline-flex items-center mr-2 uppercase font-medium text-base text-gray-600 bg-gray-200 dark:bg-gray-400 dark:text-gray-900 px-2 rounded ">
			{lang}
		</span>
	)
}
