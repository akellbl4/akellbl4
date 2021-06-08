import chromium from 'chrome-aws-lambda'
import type { NextApiRequest, NextApiResponse } from 'next'
import render from 'preact-render-to-string'

import { SharingImage } from 'components/SharingImage'

import interRegularUrl from 'fonts/Inter/Inter-Regular.ttf'

export default async function sharingImage(_: NextApiRequest, res: NextApiResponse) {
	const browser = await chromium.puppeteer.launch({
		args: [...(chromium.args || []), '--font-render-hinting=none', '--force-color-profile=srgb'],
		executablePath: await chromium.executablePath,
		headless: true,
	})
	await chromium.font(interRegularUrl)
	const page = await browser.newPage()
	const image = render(SharingImage())

	await page.setViewport({ width: 1200, height: 630 })
	await page.setContent(image)

	const data = await page.screenshot({ type: 'png' })

	browser.close()
	res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate')
	res.setHeader('Content-Type', 'image/png')
	res.end(data)
}
