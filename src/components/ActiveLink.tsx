import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Link } from 'components/Link'

type Props = { href: string } & React.AllHTMLAttributes<HTMLAnchorElement>

export function ActiveLink(props: Props) {
	const { asPath } = useRouter()
	const isActive = props.href !== '/' && asPath.startsWith(props.href)

	return (
		<Link
			className={clsx(
				'inline-block',
				isActive
					? 'text-gray-600 dark:text-gray-100 font-bold'
					: 'text-gray-500 dark:text-gray-300 transition-colors duration-200 border-b dark:border-gray-700 hover:border-current'
			)}
			{...props}
		/>
	)
}
