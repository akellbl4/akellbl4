import NextLink from 'next/link'

type CustomLinkProps = {
	href: string
} & Omit<React.AllHTMLAttributes<HTMLAnchorElement>, 'href'>

export function Link({ rel, href, ...props }: CustomLinkProps) {
	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<NextLink href={href}>
				<a {...props} />
			</NextLink>
		)
	}

	return (
		<a
			target="_blank"
			rel={`noopener noreferrer nofollow${rel ? ' ' + rel : ''}`}
			href={href}
			{...props}
		/>
	)
}
