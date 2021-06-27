import { getViews, increseViews } from 'lib/views'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function countVisit(req: VercelRequest, res: VercelResponse) {
	const { slug } = req.query

	if (typeof slug !== 'string') {
		return res.status(422).end()
	}

	if (req.method === 'GET') {
		const count = await getViews(slug)

		return res.status(200).send(count)
	}

	if (req.method === 'POST') {
		increseViews(slug)

		return res.status(200).end()
	}

	return res.status(405).end()
}
