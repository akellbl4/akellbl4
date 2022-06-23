import type { Env } from '../types'

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";


export type PlaybackState = {
  progress: number
  duration: number
  isPlaying: boolean
}

type Track = {
  name: string
  url: string
  album: string
  artist: string
  coverUrl: string
}

type NowPlaying = {
  state: PlaybackState
  track: Track | null
}

async function getAccessToken(env: Env) {
  const payload = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: env.SPOTIFY_REFRESH_TOKEN,
  })
  const token = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  })

  const { access_token } = await res.json()

  return access_token
}

function formatTrack({ name, album, artists, external_urls }: SpotifyApi.TrackObjectFull): Track {
  return {
    name,
    album: album.name,
    artist: artists.map((a) => a.name).join(', '),
    coverUrl: album.images[album.images.length - 1]?.url,
    url: external_urls.spotify,
  }
}

function formatPlaybackState(data: SpotifyApi.CurrentlyPlayingResponse): PlaybackState {
  const { progress_ms, is_playing, item } = data

  return {
    duration: item?.duration_ms ?? 0,
    progress: progress_ms ?? 0,
    isPlaying: is_playing,
  }
}

function formatNowPlaying(data: SpotifyApi.CurrentlyPlayingResponse): NowPlaying {
  return {
    state: formatPlaybackState(data),
    track:
      data.item !== null || data.currently_playing_type === 'track'
        ? formatTrack(data.item as SpotifyApi.TrackObjectFull)
        : null,
  }
}


export async function getNowPlaying(env: Env): Promise<NowPlaying | null> {
  const token = await getAccessToken(env)
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })


  if (res.status !== 200) {
    return null
  }

  const data: SpotifyApi.CurrentlyPlayingResponse = await res.json()

  return formatNowPlaying(data)
}