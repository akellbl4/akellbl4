import Image from 'next/image'

import { Link } from 'components/Link'

import avatar from '@public/images/avatar.png'
import photo from '@public/images/photo.jpg'

export default function Home() {
	return (
		<article className="my-auto pt-2">
			<Link href="/about" className="inline-block text-gray-800">
				<h1 className="title relative inline-flex flex-col-reverse sm:flex-row mb-3">
					<div className="relative inline-block text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
						<span className="title-gradient">Pavel Mineev</span>
						<span className="title-cover absolute inset-0 transition-opacity duration-500">
							Pavel Mineev
						</span>
					</div>
					<div className="relative flex w-10 h-10 mb-2 sm:w-16 sm:h-16 sm:-mt-10">
						<div className="avatar absolute inset-0 h-full w-full flex rounded-full overflow-hidden">
							<Image
								src={avatar}
								width={64}
								height={64}
								priority
								loading="eager"
								alt="Pavel Mineev"
								placeholder="blur"
							/>
						</div>
						<div className="photo h-full w-full flex rounded-full overflow-hidden">
							<Image
								src={photo}
								width={64}
								height={64}
								priority
								loading="eager"
								alt="Pavel Mineev"
								placeholder="blur"
							/>
						</div>
					</div>
				</h1>
			</Link>
			<p className="block text-md w-[80%] md:w-[85%] sm:text-xl font-medium sm:leading-relaxed text-gray-400">
				<span className="transition-color duration-300 hover:text-gray-600 dark:hover:text-gray-200">
					I&apos;m a Software Engineer.
				</span>{' '}
				<span className="transition-color duration-300 hover:text-gray-600 dark:hover:text-gray-200">
					I work at{' '}
					<Link
						className="border-b dark:border-gray-600 dark:hover:border-gray-400"
						href="https://junehomes.com"
					>
						June Homes{' '}
					</Link>
					as&nbsp;a&nbsp;team&nbsp;leader.
				</span>{' '}
				<br className="hidden md:inline" />
				<span className="transition-color duration-300 hover:text-gray-600 dark:hover:text-gray-200">
					I like to contribute to{' '}
					<Link
						href="/about#projects"
						className="border-b dark:border-gray-600 dark:hover:border-gray-400"
					>
						open-source
					</Link>{' '}
					and&nbsp;
					<Link href="/blog" className="border-b dark:border-gray-600 dark:hover:border-gray-400">
						write
					</Link>{' '}
					about web development.
				</span>
			</p>
		</article>
	)
}

Home.meta = {
	title: 'Pavel Mineev - Software Engineer, Open Source Contributor, Mentor, and sometimes Writer',
	overrideTitle: true,
}
