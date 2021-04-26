type Props = { lang: string }

export function LangBadge({ lang }: Props) {
	return (
		<span className="inline-flex items-center mr-2 uppercase font-medium text-base bg-gray-200 text-gray-500 px-2 rounded">
			{lang}
		</span>
	)
}
