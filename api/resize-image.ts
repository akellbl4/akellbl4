import https from 'https'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function resizeImage(req: VercelRequest, res: VercelResponse) {
	const url = new URL(`/_next/image`, 'https://resize.mineev.me')

	if (req.query.w === undefined) {
		return res.status(400).end()
	}

	Object.entries(req.query).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			v.forEach((i) => url.searchParams.append(k, i))
			return
		}
		url.searchParams.append(k, v)
	})

	if (!url.searchParams.has('q')) {
		url.searchParams.append('q', '75')
	}

	https.get(url, (r) => {
		res.setHeader('content-type', r.headers['content-type']!)
		r.pipe(res)
		r.on('end', () => res.end())
	})
}
