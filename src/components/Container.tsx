import clsx from 'clsx'
import { Link } from 'components/Link'
import { NowPlaying } from 'components/NowPlaying'

type Props = React.PropsWithChildren<{
	isHome: boolean
}>

export function Container({ children, isHome }: Props) {
	return (
		<>
			<div
				className={clsx(
					'h-full w-full  m-auto p-6 flex-grow flex flex-col max-w-3xl lg:max-w-4xl',
					isHome && 'max-h-[44rem]'
				)}
			>
				<header>
					<a href="#skip" className="sr-only focus:not-sr-only">
						Skip to content
					</a>
					<nav className="text-sm sm:text-base">
						<ul className="flex w-full space-x-4">
							<li>
								<Link
									href="/blog"
									className="transition-color duration-200 inline-block text-gray-500 dark:text-gray-200 transition-color border-b dark:border-gray-700 hover:border-gray-400"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="transition-color duration-200 inline-block text-gray-500 dark:text-gray-200 transition-color border-b dark:border-gray-700 hover:border-gray-400"
								>
									About
								</Link>
							</li>
							{!isHome && (
								<li>
									<Link
										href="/"
										className="transition-color duration-200 inline-block text-gray-500 dark:text-gray-200 transition-color border-b dark:border-gray-700 hover:border-gray-400"
									>
										Home
									</Link>
								</li>
							)}
						</ul>
					</nav>
				</header>
				<main id="skip" className="flex flex-col flex-grow py-12">
					{children}
				</main>
				<footer className="flex text-sm sm:text-base flex-col justify-between sm:flex-row sm:items-end">
					<ul className="flex flex-wrap flex-shrink-0 max-w-full mr-6">
						{SOCIAL_LINK.map(([emoji, label, href]) => (
							<li key={label} className="mr-4 mt-2">
								<Link
									href={href}
									data-emoji={emoji}
									className="link-emoji relative inline-block text-gray-500 transition-color duration-200 border-b hover:text-transparent hover:border-transparent dark:text-gray-300  dark:border-gray-700 hover:border-gray-400"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
					<section className="max-w-full overflow-hidden p-1 -m-1 mt-4 mr-auto sm:mr-0 sm:mt-0">
						<NowPlaying />
					</section>
				</footer>
			</div>
		</>
	)
}

const SOCIAL_LINK = [
	['👤', 'Facebook', 'https://facebook.com'],
	['📷', 'Instagram', 'https://www.instargram.com'],
	['🐦', 'Twitter', 'https://twitter.com'],
	['🐙', 'GitHub', 'https://github.com'],
	['👨‍💻', 'LinkedIn', 'https://linkedin.com'],
]
