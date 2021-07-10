import { getNowPlaying } from '~lib/spotify'
import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function nowPlayingApi(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'GET') {
		try {
			const track = await getNowPlaying()

			res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=15')

			return res.status(200).json(track)
		} catch (e) {
			return res.status(500).end()
		}
	}

	return res.status(405).end()
}
