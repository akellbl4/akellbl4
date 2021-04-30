import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link href="/favicon.ico" rel="icon" />
					<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
					<link href="/favicon-mask.svg" rel="mask-icon" color="##ce6fea" />
					<link href="/touch-180x180.png" rel="apple-touch-icon" />
					<link href="/manifest.json" rel="manifest" />
					<meta content="##ce6fea" name="theme-color" />
				</Head>
				<body className="preload-transitions bg-white text-gray-800 dark:text-gray-200 dark:bg-warmGray-900 min-w-[20rem] antialiased">
					<Main />
					<NextScript />
					{process.env.NODE_ENV === 'production' && (
						<script
							defer
							src="https://static.cloudflareinsights.com/beacon.min.js"
							data-cf-beacon='{"token": "76d7c53c33994ba987887d0298985b3c"}'
						/>
					)}
				</body>
			</Html>
		)
	}
}
