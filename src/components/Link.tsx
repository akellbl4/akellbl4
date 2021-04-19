import NextLink from 'next/link'

type CustomLinkProps = {
	href: string
} & Omit<React.AllHTMLAttributes<HTMLAnchorElement>, 'href'>

export function Link({ href, ...props }: CustomLinkProps) {
	if (href.startsWith('/') || href.startsWith('#')) {
		return (
			<NextLink href={href}>
				<a {...props} />
			</NextLink>
		)
	}

	return <a target="_blank" rel="noopener noreferrer" href={href} {...props} />
}
