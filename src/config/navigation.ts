export type NavigationItem = {
	title: string
	href: string
	description?: string
	children?: NavigationItem[]
}

export const mainNavigation: NavigationItem[] = [
	{
		title: 'Компоненты',
		href: '/components',
		description: 'Электронные компоненты и их характеристики',
		children: [
			{
				title: 'Категории',
				href: '/categories',
				description: 'Категории электронных компонентов'
			},
			{
				title: 'Производители',
				href: '/manufacturers',
				description: 'Производители электронных компонентов'
			},
			{
				title: 'Даташиты',
				href: '/datasheets',
				description: 'Поиск и просмотр datasheet'
			}
		]
	},

	{
		title: 'Схемы',
		href: '/circuits',
		description: 'Электрические и электронные схемы',
		children: [
			{
				title: 'Все схемы',
				href: '/circuits'
			},
			{
				title: 'Полезные схемы',
				href: '/useful-circuits',
				description: 'Практические схемы для электроники'
			}
		]
	},

	{
		title: 'Калькуляторы',
		href: '/calculators',
		description: 'Онлайн-калькуляторы для электроники',
		children: [
			{
				title: 'Закон Ома',
				href: '/calculators/ohm-law'
			},
			{
				title: 'Резистор',
				href: '/calculators/resistor'
			},
			{
				title: 'Конденсатор',
				href: '/calculators/capacitor'
			}
		]
	},

	{
		title: 'Теория',
		href: '/theory',
		description: 'Теоретические материалы по электронике',
		children: [
			{
				title: 'Закон Ома',
				href: '/calculators/ohm-law'
			},
			{
				title: 'Резистор',
				href: '/calculators/resistor'
			},
			{
				title: 'Конденсатор',
				href: '/calculators/capacitor'
			}
		]
	}
]

export const secondaryNavigation: NavigationItem[] = [
	{
		title: 'Поиск',
		href: '/search'
	},
	{
		title: 'Категории',
		href: '/categories'
	},
	{
		title: 'Производители',
		href: '/manufacturers'
	},
	{
		title: 'Полезные схемы',
		href: '/useful-circuits'
	}
]

export const footerNavigation = {
	resources: [
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
			title: 'Полезные схемы',
			href: '/useful-circuits'
		}
	],

	tools: [
		{
			title: 'Калькуляторы',
			href: '/calculators'
		},
		{
			title: 'Закон Ома',
			href: '/calculators/ohm-law'
		},
		{
			title: 'Резистор',
			href: '/calculators/resistor'
		},
		{
			title: 'Конденсатор',
			href: '/calculators/capacitor'
		}
	],

	information: [
		{
			title: 'Теория',
			href: '/theory'
		},
		{
			title: 'Категории',
			href: '/categories'
		},
		{
			title: 'Производители',
			href: '/manufacturers'
		},
		{
			title: 'Поиск',
			href: '/search'
		}
	]
} as const

export const adminNavigation: NavigationItem[] = [
	{
		title: 'Обзор',
		href: '/admin'
	},
	{
		title: 'Калькуляторы',
		href: '/admin/calculators'
	},
	{
		title: 'Категории',
		href: '/admin/categories'
	},
	{
		title: 'Схемы',
		href: '/admin/circuits'
	},
	{
		title: 'Компоненты',
		href: '/admin/components'
	},
	{
		title: 'Даташиты',
		href: '/admin/datasheets'
	},
	{
		title: 'Производители',
		href: '/admin/manufacturers'
	},
	{
		title: 'Теория',
		href: '/admin/theory'
	},
	{
		title: 'Полезные схемы',
		href: '/admin/useful-circuits'
	},
	{
		title: 'Настройки',
		href: '/admin/settings'
	}
]
