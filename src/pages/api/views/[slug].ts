import { getViews, increseViews } from 'lib/views'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function countVisit(req: NextApiRequest, res: NextApiResponse) {
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
