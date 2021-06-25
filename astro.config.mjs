import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

function codeTitle() {
	return function (tree) {
		visit(tree, { tagName: 'pre' }, visitor)

		function visitor(node, index) {
			if (node.children && node.children.length > 0) {
				const { properties } = node.children[0]
				if (properties.className && properties.className.length > 0) {
					const [lang, filename] = properties.className[0].split(':').map((e) => e.trim())
					properties.className = lang

					if (!filename) return

					tree.children[index] = h('section', { class: 'code-section' }, [
						h('h5', { class: 'code-section-title' }, [filename]),
						node,
					])
				}
			}
		}
	}
}

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ {
	renderers: ['@astrojs/renderer-preact', '@astrojs/renderer-svelte'],
	buildOptions: {
		sitemap: true,
		site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://pavel.mineev.me',
	},
	markdownOptions: {
		rehypePlugins: [
			[{ default: codeTitle }, { className: 'code-title' }],
			'rehype-slug',
			[
				'rehype-autolink-headings',
				{
					behavior: 'wrap',
					content: { type: 'text', value: '' },
					properties: {
						'aria-hidden': 'true',
						'data-sign': '🔗',
						className:
							'anchor !text-gray-800 dark:!text-gray-200 !font-bold !no-underline inset-0 text-initial after:pl-1 after:opacity-0 after:transition-opacity hover:after:opacity-100 after:inline-block hover:after:content-[attr(data-sign)] md:after:absolute md:after:right-full md:after:pr-1 md:after:pl-0',
					},
				},
			],
		],
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
}
