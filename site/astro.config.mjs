import { defineConfig } from 'astro/config'

import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import compress from 'astro-compress'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism'

export default defineConfig({
  site: 'https://paul.mineev.me',
	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			rehypeSlug,
			rehypeAutoLinkHeadings,
			rehypeCodeTitles,
			rehypePrism,
		],
  },
  integrations: [
    svelte(),
		tailwind({ config: { applyBaseStyles: false } }),
		mdx(),
		sitemap(),
		compress(),
	],
	vite: {
		server: {
			proxy: {
				'/api': 'http://localhost:8787',
			},
		},
	},
})
