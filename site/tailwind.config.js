
const colors = require('tailwindcss/colors')
const typography = require('@tailwindcss/typography')
const { spacing } = require('tailwindcss/defaultTheme')

module.exports = {
	mode: 'jit',
	purge: ['./public/**/*.html', './src/**/*.{astro,ts,tsx}'],
	darkMode: 'media',
	theme: {
		extend: {
			colors: {
				warmGray: colors.trueGray,
				gray: colors.blueGray,
				cyan: colors.cyan,
				rose: colors.rose,
				sky: colors.sky,
				teal: colors.teal,
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.gray.700'),
						a: {
							color: theme('colors.sky.500'),
							'&:hover': {
								color: theme('colors.sky.700'),
							},
						},
						pre: {
							color: theme('colors.gray.600'),
							backgroundColor: theme('colors.gray.100'),
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
							backgroundColor: theme('colors.gray.100'),
						},
						'code::before': false,
						'code::after': false,
						'h1,h2,h3,h4': {
							width: '100%',
							color: theme('colors.gray.800'),
							'scroll-margin-top': spacing[16],
						},
					},
				},
				dark: {
					css: {
						color: theme('colors.gray.300'),
						a: {
							color: theme('colors.sky.400'),
							transition: 'color 0.15s',
							'&:hover': {
								color: theme('colors.sky.500'),
							},
						},
						pre: {
							color: theme('colors.gray.200'),
							backgroundColor: theme('colors.warmGray.800'),
						},
						code: {
							color: theme('colors.cyan.400'),
							backgroundColor: theme('colors.gray.800'),
						},
						'h1,h2,h3,h4': {
							color: theme('colors.gray.200'),
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
