{
	/* Страница Datasheets */
}

// import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'

const russianComponents = [
	{
		title: 'Резисторы',
		description: 'Постоянные, переменные и подстроечные резисторы',
		href: '/datasheets/russian/resistors',
		icon: 'Ω'
	},
	{
		title: 'Конденсаторы',
		description: 'Электролитические, керамические и плёночные',
		href: '/datasheets/russian/capacitors',
		icon: '▱'
	},
	{
		title: 'Диоды',
		description: 'Выпрямительные, импульсные и специальные диоды',
		href: '/datasheets/russian/diodes',
		icon: '▷'
	},
	{
		title: 'Стабилитроны',
		description: 'Стабилитроны и стабисторы отечественного производства',
		href: '/datasheets/russian/zener-diodes',
		icon: '↯'
	},
	{
		title: 'Транзисторы',
		description: 'Биполярные, полевые и составные транзисторы',
		href: '/datasheets/russian/transistors',
		icon: '⏃'
	},
	{
		title: 'Тиристоры',
		description: 'Тиристоры, симисторы и управляемые приборы',
		href: '/datasheets/russian/thyristors',
		icon: '◈'
	},
	{
		title: 'Микросхемы',
		description: 'Аналоговые, цифровые и специализированные ИС',
		href: '/datasheets/russian/ic',
		icon: '▦'
	},
	{
		title: 'Оптоэлектроника',
		description: 'Светодиоды, фотодиоды и оптроны',
		href: '/datasheets/russian/optoelectronics',
		icon: '◉'
	}
]

const foreignComponents = [
	{
		title: 'Resistors',
		description: 'Fixed, variable and precision resistors',
		href: '/datasheets/foreign/resistors',
		icon: 'Ω'
	},
	{
		title: 'Capacitors',
		description: 'Ceramic, electrolytic and film capacitors',
		href: '/datasheets/foreign/capacitors',
		icon: '▱'
	},
	{
		title: 'Diodes',
		description: 'Rectifier, switching and special-purpose diodes',
		href: '/datasheets/foreign/diodes',
		icon: '▷'
	},
	{
		title: 'Transistors',
		description: 'BJT, MOSFET, JFET and other transistor types',
		href: '/datasheets/foreign/transistors',
		icon: '⏃'
	},
	{
		title: 'Integrated Circuits',
		description: 'Analog, digital and specialized ICs',
		href: '/datasheets/foreign/ic',
		icon: '▦'
	},
	{
		title: 'Sensors',
		description: 'Temperature, pressure, light and other sensors',
		href: '/datasheets/foreign/sensors',
		icon: '◉'
	},
	{
		title: 'Optoelectronics',
		description: 'LEDs, photodiodes, optocouplers and displays',
		href: '/datasheets/foreign/optoelectronics',
		icon: '●'
	},
	{
		title: 'Power Components',
		description: 'Power semiconductors and power management',
		href: '/datasheets/foreign/power',
		icon: '⚡'
	}
]

const functionalCategories = [
	{
		title: 'Пассивные компоненты',
		description:
			'Компоненты, работающие без усиления и управления электрическим сигналом.',
		href: '/datasheets/passive',
		items: ['Резисторы', 'Конденсаторы', 'Индуктивности', 'Трансформаторы']
	},
	{
		title: 'Полупроводники',
		description:
			'Диоды, транзисторы, тиристоры и другие полупроводниковые приборы.',
		href: '/datasheets/semiconductors',
		items: ['Диоды', 'Транзисторы', 'Тиристоры', 'Стабилитроны']
	},
	{
		title: 'Микросхемы',
		description:
			'Интегральные схемы для аналоговой, цифровой и смешанной электроники.',
		href: '/datasheets/ic',
		items: ['Логика', 'Операционные усилители', 'Таймеры', 'Драйверы']
	},
	{
		title: 'Оптоэлектроника',
		description:
			'Компоненты для передачи и обработки сигналов с использованием света.',
		href: '/datasheets/optoelectronics',
		items: ['LED', 'Фотодиоды', 'Оптроны', 'Дисплеи']
	},
	{
		title: 'Датчики',
		description:
			'Компоненты для измерения физических величин и параметров окружающей среды.',
		href: '/datasheets/sensors',
		items: ['Температура', 'Давление', 'Свет', 'Движение']
	},
	{
		title: 'Электромеханика',
		description:
			'Компоненты, объединяющие электрические и механические функции.',
		href: '/datasheets/electromechanics',
		items: ['Реле', 'Переключатели', 'Разъёмы', 'Кнопки']
	},
	{
		title: 'Источники питания',
		description:
			'Компоненты и микросхемы для построения и управления источниками питания.',
		href: '/datasheets/power',
		items: ['Стабилизаторы', 'DC/DC', 'AC/DC', 'Контроллеры']
	},
	{
		title: 'Защитные устройства',
		description:
			'Компоненты для защиты электрических схем от перенапряжения и тока.',
		href: '/datasheets/protection',
		items: ['TVS', 'Варисторы', 'Предохранители', 'PTC']
	}
]

function ComponentCard({
	title,
	description,
	href,
	icon
}: {
	title: string
	description: string
	href: string
	icon: string
}) {
	return (
		<a
			href={href}
			className='
        group
        rounded-xl
        border border-border
        bg--background-light
        p-5
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-border-accent
        hover:bg-border-hover
      '
		>
			<div
				className='
          mb-5
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-lg
          border
          border-border
          bg-background
          text-xl
          text-accent
          transition-colors
          group-hover:border-border-accent
        '
			>
				{icon}
			</div>

			<h3 className='mb-2 text-lg font-semibold text-white'>{title}</h3>

			<p className='text-sm leading-6 text-[#aeb8bd]'>{description}</p>

			<div className='mt-5 text-sm font-medium text-accent'>Смотреть →</div>
		</a>
	)
}

function FunctionalCard({
	title,
	description,
	href,
	items
}: {
	title: string
	description: string
	href: string
	items: string[]
}) {
	return (
		<a
			href={href}
			className='
        group
        rounded-xl
        border border-border
        bg-background-light
        p-6
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-accent
      '
		>
			<div className='mb-4 flex items-start justify-between gap-4'>
				<h3 className='text-lg font-semibold text-white'>{title}</h3>

				<span className='text-lg text-accent transition-transform group-hover:translate-x-1'>
					→
				</span>
			</div>

			<p className='mb-5 text-sm leading-6 text-[#aeb8bd]'>{description}</p>

			<div className='flex flex-wrap gap-2'>
				{items.map(item => (
					<span
						key={item}
						className='
              rounded-md
              border border-border
              bg-background
              px-2.5
              py-1
              text-xs
              text-[#c4ccd0]
            '
					>
						{item}
					</span>
				))}
			</div>
		</a>
	)
}

export default function DatasheetsPage() {
	return (
		<>
			<main className='min-h-screen bg-background text-white'>
				{/* <Breadcrumbs
						items={[
							{
								label: 'Datasheets'
							}
						]}
					/> */}

				{/* HERO */}
				<section className='py-12 md:py-16'>
					<div className='max-w-3xl'>
						<div className='mb-4 inline-flex items-center rounded-full border border-border bg-background-light px-3 py-1 text-sm text-accent'>
							Электронные компоненты
						</div>

						<h1 className='mb-5 text-4xl font-bold tracking-tight md:text-5xl'>
							Datasheets
						</h1>

						<p className='max-w-2xl text-base leading-7 text-[#aeb8bd] md:text-lg'>
							Справочник технической документации на электронные компоненты.
							Находите datasheet по маркировке, названию компонента и его
							функциональному назначению.
						</p>
					</div>

					{/* SEARCH */}
					<div className='mt-8 max-w-3xl'>
						<div
							className='
                  flex
                  overflow-hidden
                  rounded-xl
                  border
                  border-border
                  bg-background-light
                  focus-within:border-accent
                '
						>
							<input
								type='search'
								placeholder='Поиск компонента, например КТ315, LM358, 1N4148...'
								className='
                    min-w-0
                    flex-1
                    bg-transparent
                    px-5
                    py-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-[#718089]
                  '
							/>

							<button
								type='button'
								className='
                    hidden
                    border-l
                    border-border
                    px-6
                    text-sm
                    font-medium
                    text-accent
                    transition-colors
                    hover:bg-border-hover
                    sm:block
                  '
							>
								Найти
							</button>
						</div>

						<p className='mt-3 text-xs text-[#718089]'>
							Поиск по обозначению, названию или производителю
						</p>
					</div>
				</section>

				{/* RUSSIAN */}
				<section className='pb-16'>
					<div className='mb-7'>
						<div className='mb-2 flex items-center gap-3'>
							<div className='h-px w-8 bg-accent' />

							<span className='text-sm font-medium uppercase tracking-wider text-accent'>
								Отечественная электроника
							</span>
						</div>

						<h2 className='text-2xl font-bold md:text-3xl'>
							Российские компоненты
						</h2>

						<p className='mt-2 max-w-2xl text-sm leading-6 text-[#aeb8bd]'>
							Отечественные электронные компоненты, советские и российские
							серии, транзисторы, диоды, микросхемы и другие радиодетали.
						</p>
					</div>

					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{russianComponents.map(component => (
							<ComponentCard
								key={component.title}
								{...component}
							/>
						))}
					</div>
				</section>

				{/* FOREIGN */}
				<section className='border-t border-border py-16'>
					<div className='mb-7'>
						<div className='mb-2 flex items-center gap-3'>
							<div className='h-px w-8 bg-accent' />

							<span className='text-sm font-medium uppercase tracking-wider text-accent'>
								International components
							</span>
						</div>

						<h2 className='text-2xl font-bold md:text-3xl'>
							Иностранные компоненты
						</h2>

						<p className='mt-2 max-w-2xl text-sm leading-6 text-[#aeb8bd]'>
							Datasheets популярных компонентов международных производителей и
							стандартных серий электронных компонентов.
						</p>
					</div>

					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{foreignComponents.map(component => (
							<ComponentCard
								key={component.title}
								{...component}
							/>
						))}
					</div>
				</section>

				{/* FUNCTIONAL */}
				<section className='border-t border-border py-16'>
					<div className='mb-8'>
						<div className='mb-2 flex items-center gap-3'>
							<div className='h-px w-8 bg-accent' />

							<span className='text-sm font-medium uppercase tracking-wider text-accent'>
								Каталог
							</span>
						</div>

						<h2 className='text-2xl font-bold md:text-3xl'>
							Компоненты по функционалу
						</h2>

						<p className='mt-2 max-w-2xl text-sm leading-6 text-[#aeb8bd]'>
							Выберите категорию в зависимости от назначения компонента или его
							роли в электронной схеме.
						</p>
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						{functionalCategories.map(category => (
							<FunctionalCard
								key={category.title}
								{...category}
							/>
						))}
					</div>
				</section>

				{/* INFO */}
				<section className='border-t border-border py-16'>
					<div
						className='
                rounded-xl
                border
                border-border
                bg-background-light
                p-6
                md:p-8
              '
					>
						<h2 className='mb-3 text-xl font-bold'>Как найти datasheet?</h2>

						<p className='max-w-3xl text-sm leading-7 text-[#aeb8bd]'>
							Введите маркировку компонента в поиск или выберите подходящую
							категорию. Например, для поиска документации на транзистор можно
							использовать его обозначение — КТ315, BC547, 2N2222 и т. д.
						</p>
					</div>
				</section>
			</main>
		</>
	)
}
