import Head from 'next/head'
import { SWRConfig } from 'swr'
import type { AppProps } from 'next'

import 'styles.css'
import { fetcher } from 'lib/api'
import { Container } from 'components/Container'

export default function MyApp({ Component, pageProps, router }: AppProps) {
	const meta = { ...(pageProps.meta || {}), ...(Component.meta || {}) }
	const [path] = router.asPath.split('?')
	const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${path}`
	const canonical = meta.canonical || url

	if (typeof window !== 'undefined' && document.body.classList.contains('preload-transitions')) {
		document.body.classList.remove('preload-transitions')
	}

	return (
		<SWRConfig value={{ fetcher }}>
			<Head>
				<meta name="viewport" content="width=device-width" />
				<title>{meta.title}</title>
				<meta name="description" content={meta.description} />
				<meta property="og:url" content={url} />
				<meta property="og:type" content={meta.type || 'website'} />
				<meta property="og:title" content={meta.title} />
				<meta property="og:image" content={meta.imageUrl} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:site_name" content="Pavel Mineev" />
				<meta name="twitter:site" content="@akellbl4" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="author" content="Pavel Mineev" />
				<link href={canonical} rel="canonical" />
				{meta.date && <meta property="article:published_time" content={meta.date} />}
			</Head>
			<Container isHome={path === '/'}>
				<Component {...pageProps} router={router} />
			</Container>
		</SWRConfig>
	)
}
