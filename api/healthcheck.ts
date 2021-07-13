import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function nowPlayingApi(_: VercelRequest, res: VercelResponse) {
	return res.status(200).end()
}