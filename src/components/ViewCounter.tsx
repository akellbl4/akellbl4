import { useEffect } from 'react'
import useSWR from 'swr'

import { api } from 'lib/api'
import { formatViews } from 'lib/format-views'

type Props = {
	slug: string
	count?: boolean
}

export function ViewCounter({ slug, count }: Props) {
	const { data } = useSWR<string>(`/views/${slug}`)

	useEffect(() => {
		if (!count) {
			return
		}
		api.post(`/views/${slug}`)
	}, [count, slug])

	return <>{formatViews(data)}</>
}
