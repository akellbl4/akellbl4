import { Router, IHTTPMethods, Request } from 'itty-router'
import type { Env } from './types'
import { getViews, setViews } from './lib/views'

export const router = Router<Request, IHTTPMethods>({ base: '/api/views' })

router.get('/:slug', async (req: Request, env: Env): Promise<Response> => {
  const { slug } = req.params ?? {}

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const count = await getViews(env.kv, slug)

  return new Response(`${count}`, { status: 200 })
})



router.post('/:slug', async (req: Request, env: Env): Promise<Response> => {
  const { slug } = req.params ?? {}

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const count = await getViews(env.kv, slug)
  let result = 1

  if (count !== null) {
    result = count + 1
  }

  setViews(env.kv, slug, result)

  return new Response(`${result}`, { status: 200 })
})

router.all('*', (req) => new Response(`API ${req.method} ${new URL(req.url).pathname} | ${new Date()}`, { status: 418 }))