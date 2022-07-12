import { Router, IHTTPMethods, Request as IRequest } from 'itty-router'
import type { Env } from './types'
import { getNowPlaying } from './lib/spotify'

export const router = Router<IRequest, IHTTPMethods>({ base: '/api/spotify' })

router.get('/now-playing', async (_: Request, env: Env): Promise<Response> => {
  let track = await env.kv.get<ReturnType<typeof getNowPlaying>>('spotify-now-playing', 'json')

  if (!track) {
    track = await getNowPlaying(env)
    await env.kv.put('spotify-now-playing', JSON.stringify(track), { expirationTtl: 30 })
  }

  if (track === null) {
    return new Response(null, { status: 204 })
  }

  return new Response(JSON.stringify(track), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=30',
    }
  })
})

