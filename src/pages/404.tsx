import { Link } from 'components/Link'

export default function NotFound() {
	return (
		<div className="flex flex-col justify-center items-center max-w-2xl m-auto">
			<h1 className="font-bold text-8xl md:text-9xl tracking-tight mb-4 text-black dark:text-white">
				418
			</h1>
			<h2 className="font-bold text-3xl md:text-4xl tracking-tight mb-4">I'm a Teapot</h2>
			<p className="text-gray-700 dark:text-gray-300 mb-8">
				Actually, page haven't been found but error 404 is too boring.
			</p>
			<Link href="/">
				<a className="p-2 sm:p-4 w-64 font-bold mx-auto bg-gray-100 dark:bg-gray-900 text-center rounded-md">
					Return Home
				</a>
			</Link>
		</div>
	)
}

NotFound.meta = {
	title: 'Page not found – Pavel Mineev',
	description: 'Probably this page never exists try to check the URL',
}
