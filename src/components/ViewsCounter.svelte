<script lang="ts">
	import {onMount} from 'svelte'
	export let slug: string
	export let count: boolean

	let views = '---'

	onMount(() => {
		const baseUrl = import.meta.env.SNOWPACK_PUBLIC_API_URL || window.location.origin;
		const url = new URL(`/api/views/${slug}`, baseUrl)

		if (count) {
			url.searchParams.append('count', '1')
		}

		fetch(url.toString(), { method: count ? 'POST' : 'GET' })
			.then(r => r.text())
			.then((d) => {
				views = d.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			})
	})
</script>

<div>{views} views</div>
