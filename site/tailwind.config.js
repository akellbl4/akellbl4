import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config ={
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'media',
	theme: {
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.slate.700'),
						a: {
							color: theme('colors.sky.500'),
							'&:hover': {
								color: theme('colors.sky.700'),
							},
						},
						pre: {
							color: theme('colors.slate.600'),
							backgroundColor: theme('colors.slate.100'),
							'&::-webkit-scrollbar': {
								display: 'none',
							},
						},
						code: {
							color: theme('colors.teal.400'),
							padding: theme('spacing.1'),
							paddingLeft: theme('spacing.2'),
							paddingRight: theme('spacing.2'),
							borderRadius: theme('spacing.1'),
							fontWeight: 600,
							color: theme('colors.cyan.700'),
							backgroundColor: theme('colors.slate.100'),
						},
						'code::before': false,
						'code::after': false,
						'h1,h2,h3,h4': {
							width: '100%',
							color: theme('colors.slate.800'),
							'scroll-margin-top': theme('spacing.16'),
						},
					},
				},
				dark: {
					css: {
						color: theme('colors.slate.300'),
						a: {
							color: theme('colors.sky.400'),
							transition: 'color 0.15s',
							'&:hover': {
								color: theme('colors.sky.500'),
							},
						},
						pre: {
							color: theme('colors.slate.200'),
							backgroundColor: theme('colors.slate.800'),
						},
						code: {
							color: theme('colors.cyan.400'),
							backgroundColor: theme('colors.slate.800'),
						},
						'h1,h2,h3,h4': {
							color: theme('colors.slate.200'),
						},
					},
				},
			}),
		},
	},
	variants: {
		typography: ['dark'],
	},
	plugins: [typography],
}

export default config