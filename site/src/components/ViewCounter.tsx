import { h, Fragment } from 'preact'
// import { useEffect } from 'react'
// import useSWR from 'swr'

// import { api } from '../lib/api'
function formatViews(num: string | undefined) {
	if (num === undefined) {
		return '––– views'
	}

	const formattedNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

	return `${formattedNum} views`
}

type Props = {
	slug: string
	count?: boolean
}

export function ViewCounter({ slug, count }: Props) {
	// const { data } = useSWR<string>(`/views/${slug}`)

	// useEffect(() => {
	// 	if (!count) {
	// 		return
	// 	}
	// 	api.post(`/views/${slug}`)
	// }, [count, slug])
	// console.log(slug, count)

	return <>{formatViews('1')}</>
}
