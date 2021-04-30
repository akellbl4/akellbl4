import * as next from 'next'
import type { Router as NextRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'

export module 'next' {
	interface Router<Q> extends Omit<NextRouter, 'query'> {
		query: Q & ParsedUrlQuery
	}

	export type InferNextPageStaticProps<T, Q> = next.InferGetStaticPropsType<T> & {
		router: Router<Q>
	}

	export type NextPageMeta = {
		url?: string
		baseUrl?: string
		name?: string
		description?: string
		twitterAccount?: string
		sharingImageUrl?: string
		type?: 'article'
		canonical?: string
		date?: string
	} & (
		| {
				title: string
				overrideTitle: true
		  }
		| {
				title?: string
				overrideTitle?: never
		  }
	)

	export type NextGetStaticPropsResult<P> = next.GetStaticPropsResult<P & { meta: NextPageMeta }>

	export type AppProps = next.AppProps<{ meta: NextPageMeta }> & {
		Component: next.AppProps['Component'] & {
			meta: NextPageMeta
		}
	}
}
