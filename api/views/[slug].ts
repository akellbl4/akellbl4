import { getViews, increseViews } from '../lib/views'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function countVisit(req: VercelRequest, res: VercelResponse) {
	const { slug, count } = req.query

	if (typeof slug !== 'string') {
		return res.status(422).end()
	}

	if (req.method === 'GET') {
		let num = await getViews(slug)

		return res.status(200).send(num)
	}

	if (req.method === 'POST') {
		let num: number | string = await getViews(slug)

		if (count === '1') {
			num = await increseViews(slug)
		}

		return res.status(200).send(num)
	}

	return res.status(405).end()
}
