import { getTopTracks } from 'lib/spotify'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function topTracks(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const items = await getTopTracks()

		res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200')

		return res.status(200).json({ items })
	}

	return res.status(405).end()
}
