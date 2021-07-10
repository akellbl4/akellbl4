<script lang="typescript">
	import {onMount} from 'svelte'
	export let slug: string
	export let count: boolean

	let views = '--- views'

	onMount(async () => {
		debugger
		const url = new URL(`/api/views/${slug}`, window.location.origin)

		if (count) {
			url.searchParams.append('count', '1')
		}
		views = await fetch(url.toString()).then((r) => r.text())
		views = views.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	})
</script>

{views}
