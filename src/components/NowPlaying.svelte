<script lang="ts">
	import { onMount } from 'svelte'

	type Track = {
		url: string
		name: string
		artist: string
		coverUrl: string
	}
	let track: undefined | null | Track

	onMount(() => {
		fetch('/api/spotify/now-playing')
			.then((r) => {
				if (!r.ok) {
					throw Error('Request error')
				}
				return r.json()
			})
			.then((t) => {
				track = t
			}).catch(() => {
				track = null
			})
	})
</script>


{#if track}
	<div class="transition-opacity duration-500 opacity-100">
		<a
			href={track.url}
			class="track-link flex items-center"
			title={`${track.name} – ${track.artist}`}
			rel="nofollow"
		>
			<figure class="flex-shrink-0 rounded-sm shadow overflow-hidden h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 transition-transform duration-300 bg-gray-200 dark:bg-gray-600">
				<img
					src={track.coverUrl}
					height={64}
					width={64}
					alt={`${track.name} – ${track.artist}`}
				/>
			</figure>
			<span class="inline-block text-gray-800 dark:text-gray-200 font-medium max-w-xs truncate">
				{track.name}
			</span>
			<span class="inline-block mx-2">–</span>
			<span class="inline-block text-gray-500 dark:text-gray-300 max-w-max truncate">
				{track.artist}
			</span>
		</a>
	</div>
{/if}
{#if track === null}
	<div class="transition-opacity duration-200 flex items-center opacity-60">
		<svg class="opacity-90 flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 168 168">
			<path
				fill="#1ED760"
				d="M84 .28a83.74 83.74 0 100 167.48A83.74 83.74 0 0084 .28zm38.4 120.78a5.22 5.22 0 01-7.18 1.73c-19.66-12.01-44.41-14.73-73.56-8.07a5.22 5.22 0 01-6.25-3.93 5.21 5.21 0 013.92-6.25c31.9-7.3 59.27-4.15 81.34 9.34a5.22 5.22 0 011.73 7.18zm10.25-22.8a6.53 6.53 0 01-8.98 2.15c-22.51-13.84-56.82-17.85-83.45-9.77a6.54 6.54 0 01-8.15-4.35 6.54 6.54 0 014.36-8.14c30.41-9.23 68.22-4.76 94.07 11.13a6.53 6.53 0 012.15 8.97zm.88-23.75C106.54 58.48 62.01 57 36.24 64.82a7.83 7.83 0 01-9.77-5.21 7.83 7.83 0 015.22-9.78c29.58-8.98 78.76-7.24 109.83 11.2a7.82 7.82 0 012.74 10.74 7.83 7.83 0 01-10.73 2.74z"
			/>
		</svg>
		<span class="text-gray-700 dark:text-gray-500">Not Playing</span>
	</div>
{/if}
{#if track === undefined}
	<div class="transition-opacity duration-200 opacity-0 h-5 w-5 sm:h-6 sm:w-6" />
{/if}
