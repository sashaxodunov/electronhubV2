export interface Category {
	title: string
	slug: string
	image: string
	alt: string
}

export const datasheetCategories: Category[] = [
	{
		title: 'Резисторы',
		slug: 'resistors',
		image: '/images/home/datasheet/resistor.jpg',
		alt: 'Резистор'
	},
	{
		title: 'Конденсаторы',
		slug: 'capacitors',
		image: '/images/home/datasheet/capacitor.jpg',
		alt: 'Конденсаторы'
	},
	{
		title: 'Индуктивности',
		slug: 'inductances',
		image: '/images/home/datasheet/inductance.jpg',
		alt: 'Индуктивности'
	},
	{
		title: 'Диоды',
		slug: 'diodes',
		image: '/images/home/datasheet/diode.jpg',
		alt: 'Диоды'
	},
	{
		title: 'Тиристоры',
		slug: 'thyristors',
		image: '/images/home/datasheet/thyristors.jpg',
		alt: 'Тиристоры'
	},
	{
		title: 'Транзисторы',
		slug: 'transistors',
		image: '/images/home/datasheet/transistor.jpg',
		alt: 'Транзисторы'
	},
	{
		title: 'Оптоэлектроника',
		slug: 'optoelectronic',
		image: '/images/home/datasheet/optoelectronic.jpg',
		alt: 'Оптоэлектронные компоненты'
	},
	{
		title: 'Микросхемы',
		slug: 'microchips',
		image: '/images/home/datasheet/microcircuits.jpg',
		alt: 'Микросхемы'
	},
	{
		title: 'Датчики',
		slug: 'sensors',
		image: '/images/home/datasheet/sensor.jpg',
		alt: 'Датчики'
	},
	{
		title: 'Электромеханика',
		slug: 'electromechanical',
		image: '/images/home/datasheet/electomechanical.jpg',
		alt: 'Электромеханические компоненты'
	},
	{
		title: 'Антенны',
		slug: 'antennas',
		image: '/images/home/datasheet/antenna.jpg',
		alt: 'Антенны'
	},
	{
		title: 'Защитные устройства',
		slug: 'protective',
		image: '/images/home/datasheet/fuses.jpg',
		alt: 'Предохранители'
	},
	{
		title: 'Кварцевые и частотные элементы',
		slug: 'quartz',
		image: '/images/home/datasheet/quartz.jpg',
		alt: 'Кварцевые и частотные элементы'
	},
	{
		title: 'Источники питания',
		slug: 'powers',
		image: '/images/home/datasheet/power.jpg',
		alt: 'Источники питания'
	},
	{
		title: 'Лампы',
		slug: 'lamps',
		image: '/images/home/datasheet/lamps.jpg',
		alt: 'Лампы'
	}
]

export const documentationCategories: Category[] = [
	{
		title: 'Бытовая техника',
		slug: 'home-appliances',
		image: '/images/home/documentation/home-appliances.jpg',
		alt: 'Документация на бытовую технику'
	},
	{
		title: 'Компьютеры и оргтехника',
		slug: 'computers-office-equipment',
		image: '/images/home/documentation/computers-office-equipment.jpg',
		alt: 'Документация на компьютеры и оргтехнику'
	},
	{
		title: 'Портативная электроника',
		slug: 'portable-electronics',
		image: '/images/home/documentation/portable-electronics.jpg',
		alt: 'Документация на портативную электронику'
	},
	{
		title: 'Авто-электроника',
		slug: 'automotive-electronics',
		image: '/images/home/documentation/automotive-electronics.jpg',
		alt: 'Документация на авто-электронику'
	},
	{
		title: 'Связь и сети',
		slug: 'communications-networking',
		image: '/images/home/documentation/communications-networking.jpg',
		alt: 'Документация по сетям и средствам связи'
	},
	{
		title: 'Промышленная электроника',
		slug: 'industrial-electronics',
		image: '/images/home/documentation/industrial-electronics.jpg',
		alt: 'Документация на промышленную электронику'
	},
	{
		title: 'Развлекательная электроника',
		slug: 'entertainment-electronics',
		image: '/images/home/documentation/entertainment-electronics.jpg',
		alt: 'Документация по развлекательной электронике'
	},
	{
		title: 'Ретро-компьютеры и техника',
		slug: 'retro-computers-equipment',
		image: '/images/home/documentation/retro-computers-equipment.jpg',
		alt: 'Документация на ретро электронику'
	}
]
