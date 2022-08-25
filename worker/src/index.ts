import { Router, IHTTPMethods, Request } from 'itty-router'

import * as views from './views'
import * as spotify from './spotify'

const router = Router<Request, IHTTPMethods>({ base: '/api' })

router.all('/views/*', views.router.handle)
router.all('/spotify/*', spotify.router.handle)
router.all('*', () => new Response('Method Not Allowed', { status: 405 }))

export default {
	fetch: router.handle,
}
