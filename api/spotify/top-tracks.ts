import { getTopTracks } from '../lib/spotify'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function topTracks(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'GET') {
		const items = await getTopTracks()

		res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200')

		return res.status(200).json({ items })
	}

	return res.status(405).end()
}
