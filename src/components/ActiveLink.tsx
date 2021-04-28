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
				isActive
					? 'border-none text-gray-600 dark:text-gray-100 font-bold'
					: 'border-b text-gray-500 dark:text-gray-200'
			)}
			{...props}
		/>
	)
}
