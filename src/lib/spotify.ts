import { request } from 'lib/request'

const {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token }).toString()

async function getAccessToken() {
	const { data } = await request.post<{ access_token: string }>(
		'https://accounts.spotify.com/api/token',
		body,
		{
			headers: {
				Authorization: `Basic ${basic}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	)

	return data.access_token
}

export type Track = {
	isPlaying?: boolean
	name: string
	album: string
	artist: string
	coverUrl: string
	url: string
}

function formatTrack({ name, album, artists, external_urls }: SpotifyApi.TrackObjectFull): Track {
	return {
		name,
		album: album.name,
		artist: artists.map((a) => a.name).join(', '),
		coverUrl: album.images[0].url,
		url: external_urls.spotify,
	}
}

function formatPlayingTrack(t: SpotifyApi.CurrentlyPlayingResponse): Track | null {
	if (t.currently_playing_type !== 'track') {
		return null
	}

	return Object.assign(
		{ isPlaying: t.is_playing },
		formatTrack(t.item as SpotifyApi.TrackObjectFull)
	)
}

function formatTopTracks({ items }: SpotifyApi.UsersTopTracksResponse): Track[] {
	return items.slice(0, 10).map(formatTrack)
}

export async function getNowPlaying(): Promise<Track | null> {
	const accessToken = await getAccessToken()
	const { data, status } = await request.get<SpotifyApi.CurrentlyPlayingResponse>(
		'https://api.spotify.com/v1/me/player/currently-playing',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	if (status !== 200) {
		return null
	}

	return formatPlayingTrack(data)
}

export async function getTopTracks() {
	const accessToken = await getAccessToken()
	const { data } = await request.get<SpotifyApi.UsersTopTracksResponse>(
		'https://api.spotify.com/v1/me/top/tracks',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	return formatTopTracks(data)
}
