import { NextPageMeta } from 'next'
import DEFAULT_META from 'meta.json'

export function composeMeta(
	path: string,
	...args: NextPageMeta[]
): NextPageMeta & { canonical: string } {
	const meta = { canonical: `${DEFAULT_META.baseUrl}${path}`, ...(DEFAULT_META as NextPageMeta) }

	args.forEach((m) => m && Object.assign(meta, m))

	if (!meta.overrideTitle) {
		meta.title = `${meta.title} - Pavel Mineev`
	}

	return meta
}
