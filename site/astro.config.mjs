import { defineConfig } from 'astro/config'

import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import compress from 'astro-compress'

export default defineConfig({
	site: 'https://astro.mineev.me',
	integrations: [
		svelte(),
		tailwind({ config: { applyBaseStyles: false } }),
		sitemap(),
		image(),
		mdx(),
		compress({ img: false }),
	],
	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			'rehype-slug',
			'rehype-autolink-headings',
			'rehype-code-titles',
			'rehype-prism',
		],
	},
	vite: {
		server: {
			proxy: {
				'/api': 'http://localhost:8787',
			},
		},
	},
})
