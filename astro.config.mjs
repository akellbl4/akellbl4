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

/**
 * @type {import('astro/dist/types/@types/astro').AstroConfig}
 **/
const config = {
	renderers: ['@astrojs/renderer-preact', '@astrojs/renderer-svelte'],
	buildOptions: {
		sitemap: true,
		site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://pavel.mineev.me',
	},
	markdownOptions: {
		rehypePlugins: [
			[{ default: codeTitle }, { className: 'code-title' }],
			import('rehype-slug'),
			[
				import('rehype-autolink-headings'),
				{
					behavior: 'wrap',
					content: { type: 'text', value: '🔗' },
					linkProperties: { className: 'anchor' },
				},
			],
		],
	},
	devOptions: {
		tailwindConfig: './tailwind.config.js',
	},
}

export default config
