export const siteConfig = {
	name: 'ElectronHub',
	shortName: 'ElectronHub',

	description:
		'ElectronHub — электронные компоненты, даташиты, схемы, полезные схемы, калькуляторы и теория электроники.',

	url: 'https://electronhub.ru',

	locale: 'ru-RU',
	language: 'ru',

	author: {
		name: 'ElectronHub',
		url: 'https://electronhub.ru'
	},

	keywords: [
		'электроника',
		'электронные компоненты',
		'даташиты',
		'datasheets',
		'схемы',
		'электрические схемы',
		'радиоэлектроника',
		'калькуляторы',
		'закон Ома',
		'резисторы',
		'конденсаторы',
		'микросхемы',
		'теория электроники'
	],

	navigation: {
		main: [
			{
				title: 'Компоненты',
				href: '/components'
			},
			{
				title: 'Даташиты',
				href: '/datasheets'
			},
			{
				title: 'Схемы',
				href: '/circuits'
			},
			{
				title: 'Калькуляторы',
				href: '/calculators'
			},
			{
				title: 'Теория',
				href: '/theory'
			}
		]
	},

	links: {
		home: '/',
		search: '/search',
		components: '/components',
		datasheets: '/datasheets',
		circuits: '/circuits',
		calculators: '/calculators',
		theory: '/theory',
		usefulCircuits: '/useful-circuits',
		manufacturers: '/manufacturers',
		categories: '/categories'
	},

	metadata: {
		titleTemplate: '%s | ElectronHub',
		defaultTitle: 'ElectronHub — электроника, схемы, даташиты и калькуляторы',

		description:
			'Справочник по электронике: электронные компоненты, даташиты, электрические схемы, калькуляторы и теория.',

		openGraph: {
			type: 'website',
			locale: 'ru_RU',
			siteName: 'ElectronHub',
			url: 'https://electronhub.ru'
		},

		robots: {
			index: true,
			follow: true
		}
	}
} as const

export type SiteConfig = typeof siteConfig
