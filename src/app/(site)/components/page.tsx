import Link from 'next/link'

const componentCategories = [
	{
		title: 'Резисторы',
		description:
			'Ограничение тока, делители напряжения и задание рабочих режимов.',
		href: '/datasheets/resistor',
		symbol: 'R'
	},
	{
		title: 'Конденсаторы',
		description:
			'Накопление энергии, фильтрация и развязка электрических цепей.',
		href: '/datasheets/capacitor',
		symbol: 'C'
	},
	{
		title: 'Индуктивности',
		description: 'Накопление энергии в магнитном поле и фильтрация сигналов.',
		href: '/datasheets/inductance',
		symbol: 'L'
	},
	{
		title: 'Диоды',
		description: 'Однонаправленная проводимость, выпрямление и защита цепей.',
		href: '/datasheets/diodes',
		symbol: 'D'
	},
	{
		title: 'Транзисторы',
		description: 'Усиление сигналов и электронное управление нагрузкой.',
		href: '/datasheets/transistors',
		symbol: 'Q'
	},
	{
		title: 'Микросхемы',
		description: 'Интегрированные аналоговые, цифровые и смешанные устройства.',
		href: '/datasheets/microchips',
		symbol: 'IC'
	}
]

const parameterCards = [
	{
		number: '01',
		title: 'Номинал',
		text: 'Основное значение электрического параметра компонента.'
	},
	{
		number: '02',
		title: 'Допуск',
		text: 'Допустимое отклонение фактического значения от номинального.'
	},
	{
		number: '03',
		title: 'Мощность',
		text: 'Максимальная мощность, которую компонент способен рассеивать.'
	},
	{
		number: '04',
		title: 'Напряжение',
		text: 'Рабочее и максимально допустимое напряжение.'
	},
	{
		number: '05',
		title: 'Температура',
		text: 'Допустимый температурный диапазон эксплуатации.'
	},
	{
		number: '06',
		title: 'Корпус',
		text: 'Физическое исполнение и способ монтажа компонента.'
	}
]

export default function ComponentsPage() {
	return (
		<main
			lang='ru'
			className='mx-auto w-full max-w-300 px-4 py-12 sm:py-16 lg:py-20'
		>
			{/* =========================================================
          HERO
      ========================================================== */}

			<header className='mx-auto max-w-225 text-center'>
				<div
					className='
            mb-5 inline-flex items-center gap-2
            rounded-full border border-white/10
            bg-white/3
            px-3 py-1.5
            font-manrope text-[11px]
            uppercase tracking-[0.18em]
            text-white/50
          '
				>
					<span className='h-1.5 w-1.5 rounded-full bg-accent' />
					Electronics reference
				</div>

				<h1
					className='
            font-bebas text-5xl font-bold uppercase
            leading-[0.9] tracking-tight text-accent
            sm:text-6xl
            md:text-7xl
            lg:text-8xl
          '
				>
					Электронные компоненты
				</h1>

				<p
					className='
            mx-auto mt-6 max-w-190
            font-manrope text-sm leading-relaxed
            text-white/65
            sm:text-base
            lg:text-lg
          '
				>
					Справочная информация об электронных компонентах: устройство, принцип
					работы, основные параметры, условные обозначения и типовые схемы
					включения.
				</p>
			</header>

			{/* =========================================================
          COMPONENT CATEGORIES
      ========================================================== */}

			<section
				aria-labelledby='component-categories'
				className='mt-14 sm:mt-18 lg:mt-22'
			>
				<div className='mb-7 flex items-end justify-between gap-4'>
					<div>
						<p
							className='
                font-manrope text-xs font-semibold
                uppercase tracking-[0.18em]
                text-accent
              '
						>
							Категории
						</p>

						<h2
							id='component-categories'
							className='
                mt-2 font-bebas text-3xl
                uppercase text-white
                sm:text-4xl lg:text-5xl
              '
						>
							Основные компоненты
						</h2>
					</div>

					<span
						className='
              hidden font-manrope text-xs
              text-white/30 sm:block
            '
					>
						06 категорий
					</span>
				</div>

				<div
					className='
            grid grid-cols-1 gap-3
            min-[480px]:grid-cols-2
            lg:grid-cols-3
          '
				>
					{componentCategories.map(component => (
						<Link
							key={component.href}
							href={component.href}
							className='
                group relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-neutral-900
                p-5
                transition-all duration-300
                hover:-translate-y-1
                hover:border-accent/40
                hover:bg-neutral-800
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-accent
                sm:p-6
              '
						>
							{/* Техническая сетка */}

							<svg
								aria-hidden='true'
								className='
                  pointer-events-none
                  absolute inset-0 h-full w-full
                  opacity-0 transition-opacity duration-300
                  group-hover:opacity-100
                '
								viewBox='0 0 400 220'
								preserveAspectRatio='none'
							>
								<defs>
									<pattern
										id={`grid-${component.symbol}`}
										width='24'
										height='24'
										patternUnits='userSpaceOnUse'
									>
										<path
											d='M 24 0 L 0 0 0 24'
											fill='none'
											stroke='currentColor'
											className='text-accent/[0.07]'
											strokeWidth='1'
										/>
									</pattern>
								</defs>

								<rect
									width='400'
									height='220'
									fill={`url(#grid-${component.symbol})`}
								/>
							</svg>

							<div className='relative'>
								<div className='flex items-start justify-between'>
									<span
										className='
                      font-bebas text-4xl
                      leading-none text-accent/30
                      transition-colors
                      group-hover:text-accent/60
                    '
									>
										{component.symbol}
									</span>

									<span
										aria-hidden='true'
										className='
                      text-lg text-white/20
                      transition-all duration-300
                      group-hover:translate-x-1
                      group-hover:text-accent
                    '
									>
										→
									</span>
								</div>

								<h3
									className='
                    mt-8 font-manrope
                    text-lg font-bold text-white
                    sm:text-xl
                  '
								>
									{component.title}
								</h3>

								<p
									className='
                    mt-2 min-h-12
                    font-manrope text-xs
                    leading-relaxed text-white/45
                    sm:text-sm
                  '
								>
									{component.description}
								</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* =========================================================
          WHAT IS COMPONENT
      ========================================================== */}

			<section
				aria-labelledby='what-is-component'
				className='mt-20 sm:mt-28'
			>
				<div
					className='
            grid grid-cols-1 gap-8
            lg:grid-cols-[1.1fr_0.9fr]
            lg:gap-12
          '
				>
					<div>
						<p
							className='
                font-manrope text-xs font-semibold
                uppercase tracking-[0.18em]
                text-accent
              '
						>
							Основы
						</p>

						<h2
							id='what-is-component'
							className='
                mt-2 font-bebas text-4xl
                uppercase leading-none text-white
                sm:text-5xl
              '
						>
							Что такое электронный компонент
						</h2>

						<div
							className='
                mt-6 space-y-4
                font-manrope text-sm
                leading-relaxed text-white/60
                sm:text-base
              '
						>
							<p>
								Электронный компонент — элемент электрической или электронной
								схемы, предназначенный для выполнения определённой функции.
							</p>

							<p>
								Компоненты используются для формирования, преобразования,
								передачи, усиления, фильтрации и управления электрическими
								сигналами.
							</p>

							<p>
								Каждый компонент имеет набор параметров, определяющих допустимый
								режим его эксплуатации. Эти параметры необходимо учитывать при
								проектировании электронной схемы.
							</p>
						</div>
					</div>

					{/* Техническая схема */}

					<div
						className='
              relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-neutral-900
              p-5 sm:p-7
            '
					>
						<div
							className='
                absolute right-5 top-5
                font-mono text-[10px]
                uppercase tracking-widest
                text-white/20
              '
						>
							FIG. 01
						</div>

						<svg
							viewBox='0 0 600 380'
							className='w-full'
							role='img'
							aria-label='Условные обозначения электронных компонентов'
						>
							{/* Сетка */}

							<defs>
								<pattern
									id='component-grid'
									width='30'
									height='30'
									patternUnits='userSpaceOnUse'
								>
									<path
										d='M 30 0 L 0 0 0 30'
										fill='none'
										stroke='currentColor'
										className='text-white/4.5'
									/>
								</pattern>
							</defs>

							<rect
								width='600'
								height='380'
								fill='url(#component-grid)'
							/>

							{/* Резистор */}

							<line
								x1='70'
								y1='75'
								x2='120'
								y2='75'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<path
								d='M120 75 L135 60 L165 90 L195 60 L225 90 L240 75'
								fill='none'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='240'
								y1='75'
								x2='290'
								y2='75'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<text
								x='180'
								y='120'
								textAnchor='middle'
								fill='currentColor'
								className='text-white/50'
								fontSize='16'
							>
								R — резистор
							</text>

							{/* Конденсатор */}

							<line
								x1='70'
								y1='190'
								x2='155'
								y2='190'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<line
								x1='155'
								y1='150'
								x2='155'
								y2='230'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='185'
								y1='150'
								x2='185'
								y2='230'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='185'
								y1='190'
								x2='290'
								y2='190'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<text
								x='180'
								y='265'
								textAnchor='middle'
								fill='currentColor'
								className='text-white/50'
								fontSize='16'
							>
								C — конденсатор
							</text>

							{/* Диод */}

							<line
								x1='330'
								y1='75'
								x2='380'
								y2='75'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<path
								d='M380 45 L380 105 L435 75 Z'
								fill='none'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='435'
								y1='45'
								x2='435'
								y2='105'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='435'
								y1='75'
								x2='500'
								y2='75'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<text
								x='415'
								y='120'
								textAnchor='middle'
								fill='currentColor'
								className='text-white/50'
								fontSize='16'
							>
								D — диод
							</text>

							{/* Транзистор */}

							<line
								x1='420'
								y1='180'
								x2='420'
								y2='225'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<line
								x1='420'
								y1='225'
								x2='385'
								y2='275'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='420'
								y1='225'
								x2='455'
								y2='275'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<line
								x1='365'
								y1='225'
								x2='420'
								y2='225'
								stroke='currentColor'
								className='text-white/50'
								strokeWidth='3'
							/>

							<line
								x1='420'
								y1='225'
								x2='420'
								y2='180'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
							/>

							<path
								d='M445 262 L455 275 L438 272'
								fill='none'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='3'
							/>

							<text
								x='420'
								y='315'
								textAnchor='middle'
								fill='currentColor'
								className='text-white/50'
								fontSize='16'
							>
								Q — транзистор
							</text>
						</svg>
					</div>
				</div>
			</section>

			{/* =========================================================
          CHARACTERISTIC GRAPH
      ========================================================== */}

			<section
				aria-labelledby='characteristic-title'
				className='mt-20 sm:mt-28'
			>
				<div className='mb-7 max-w-190'>
					<p
						className='
              font-manrope text-xs font-semibold
              uppercase tracking-[0.18em]
              text-accent
            '
					>
						Электрические характеристики
					</p>

					<h2
						id='characteristic-title'
						className='
              mt-2 font-bebas text-4xl
              uppercase leading-none text-white
              sm:text-5xl
            '
					>
						Графики характеристик
					</h2>

					<p
						className='
              mt-4 font-manrope text-sm
              leading-relaxed text-white/55
              sm:text-base
            '
					>
						Графическое представление параметров помогает понять поведение
						компонента при изменении напряжения, тока, температуры или частоты.
					</p>
				</div>

				<div
					className='
            overflow-hidden rounded-2xl
            border border-white/10
            bg-neutral-900
            p-4 sm:p-6 lg:p-8
          '
				>
					<div className='aspect-16/8 w-full'>
						<svg
							viewBox='0 0 900 460'
							className='h-full w-full'
							role='img'
							aria-label='Пример вольт-амперной характеристики'
						>
							<defs>
								<pattern
									id='chart-grid'
									width='60'
									height='60'
									patternUnits='userSpaceOnUse'
								>
									<path
										d='M 60 0 L 0 0 0 60'
										fill='none'
										stroke='currentColor'
										className='text-white/5'
										strokeWidth='1'
									/>
								</pattern>
							</defs>

							<rect
								x='90'
								y='40'
								width='750'
								height='350'
								fill='url(#chart-grid)'
							/>

							{/* Оси */}

							<line
								x1='90'
								y1='390'
								x2='840'
								y2='390'
								stroke='currentColor'
								className='text-white/30'
								strokeWidth='2'
							/>

							<line
								x1='90'
								y1='390'
								x2='90'
								y2='40'
								stroke='currentColor'
								className='text-white/30'
								strokeWidth='2'
							/>

							{/* Стрелки */}

							<path
								d='M840 390 L828 384 L828 396 Z'
								fill='currentColor'
								className='text-white/40'
							/>

							<path
								d='M90 40 L84 52 L96 52 Z'
								fill='currentColor'
								className='text-white/40'
							/>

							{/* Характеристика */}

							<path
								d='
                  M90 390
                  C190 365 250 330 330 285
                  C430 228 500 180 590 135
                  C680 90 755 65 840 50
                '
								fill='none'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='5'
								strokeLinecap='round'
							/>

							{/* Точки */}

							<circle
								cx='330'
								cy='285'
								r='6'
								fill='currentColor'
								className='text-accent'
							/>

							<circle
								cx='590'
								cy='135'
								r='6'
								fill='currentColor'
								className='text-accent'
							/>

							{/* Подписи */}

							<g
								fill='currentColor'
								className='text-white/40'
								fontSize='15'
								fontFamily='Manrope, sans-serif'
							>
								<text
									x='840'
									y='420'
									textAnchor='end'
								>
									U, V
								</text>

								<text
									x='60'
									y='48'
									textAnchor='middle'
								>
									I, A
								</text>

								<text
									x='84'
									y='410'
								>
									0
								</text>

								<text
									x='265'
									y='410'
								>
									2
								</text>

								<text
									x='445'
									y='410'
								>
									4
								</text>

								<text
									x='625'
									y='410'
								>
									6
								</text>

								<text
									x='805'
									y='410'
								>
									8
								</text>
							</g>

							{/* Маркер */}

							<line
								x1='590'
								y1='135'
								x2='590'
								y2='390'
								stroke='currentColor'
								className='text-accent/20'
								strokeDasharray='6 6'
							/>

							<line
								x1='90'
								y1='135'
								x2='590'
								y2='135'
								stroke='currentColor'
								className='text-accent/20'
								strokeDasharray='6 6'
							/>
						</svg>
					</div>

					<div
						className='
              mt-4 flex flex-col gap-2
              border-t border-white/10
              pt-4
              sm:flex-row sm:items-center
              sm:justify-between
            '
					>
						<span
							className='
                font-manrope text-xs
                text-white/40
              '
						>
							Иллюстративная характеристика
						</span>

						<span
							className='
                font-mono text-[10px]
                uppercase tracking-wider
                text-accent/60
              '
						>
							U → I
						</span>
					</div>
				</div>
			</section>

			{/* =========================================================
          PARAMETERS
      ========================================================== */}

			<section
				aria-labelledby='parameters-title'
				className='mt-20 sm:mt-28'
			>
				<div className='mb-7'>
					<p
						className='
              font-manrope text-xs font-semibold
              uppercase tracking-[0.18em]
              text-accent
            '
					>
						Datasheet
					</p>

					<h2
						id='parameters-title'
						className='
              mt-2 font-bebas text-4xl
              uppercase text-white
              sm:text-5xl
            '
					>
						Основные параметры
					</h2>
				</div>

				<div
					className='
            grid grid-cols-1 gap-px
            overflow-hidden rounded-2xl
            border border-white/10
            bg-white/10
            min-[480px]:grid-cols-2
            lg:grid-cols-3
          '
				>
					{parameterCards.map(parameter => (
						<article
							key={parameter.number}
							className='
                bg-neutral-900
                p-5 sm:p-6
              '
						>
							<span
								className='
                  font-bebas text-4xl
                  leading-none text-accent/25
                '
							>
								{parameter.number}
							</span>

							<h3
								className='
                  mt-4 font-manrope
                  text-base font-bold text-white
                '
							>
								{parameter.title}
							</h3>

							<p
								className='
                  mt-2 font-manrope
                  text-sm leading-relaxed
                  text-white/45
                '
							>
								{parameter.text}
							</p>
						</article>
					))}
				</div>
			</section>

			{/* =========================================================
          FORMULA
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div
					className='
            overflow-hidden rounded-2xl
            border border-white/10
            bg-neutral-900
          '
				>
					<div
						className='
              grid grid-cols-1
              lg:grid-cols-[0.8fr_1.2fr]
            '
					>
						<div className='p-6 sm:p-8 lg:p-10'>
							<p
								className='
                  font-manrope text-xs
                  font-semibold uppercase
                  tracking-[0.18em]
                  text-accent
                '
							>
								Базовая зависимость
							</p>

							<h2
								className='
                  mt-3 font-bebas text-3xl
                  uppercase text-white
                  sm:text-4xl
                '
							>
								Закон Ома
							</h2>

							<p
								className='
                  mt-4 font-manrope text-sm
                  leading-relaxed text-white/50
                '
							>
								Для участка электрической цепи ток определяется отношением
								напряжения к сопротивлению.
							</p>
						</div>

						<div
							className='
                flex min-h-50
                items-center justify-center
                border-t border-white/10
                bg-black/20
                p-8
                lg:border-l lg:border-t-0
              '
						>
							<div className='text-center'>
								<div
									className='
                    font-mono text-5xl
                    font-bold tracking-tight
                    text-white
                    sm:text-6xl
                  '
								>
									I = U / R
								</div>

								<div
									className='
                    mt-4 font-manrope
                    text-xs text-white/35
                  '
								>
									I — ток · U — напряжение · R — сопротивление
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =========================================================
          FINAL CTA
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div
					className='
            relative overflow-hidden
            rounded-3xl
            border border-accent/20
            bg-accent/4
            p-7 text-center
            sm:p-10 lg:p-14
          '
				>
					<div
						aria-hidden='true'
						className='
              pointer-events-none
              absolute left-1/2 top-0
              h-48 w-100
              -translate-x-1/2
              rounded-full
              bg-accent/10
              blur-3xl
            '
					/>

					<div className='relative'>
						<p
							className='
                font-manrope text-xs
                uppercase tracking-[0.2em]
                text-accent
              '
						>
							ElectronHub Datasheet
						</p>

						<h2
							className='
                mt-3 font-bebas
                text-4xl uppercase
                text-white
                sm:text-5xl lg:text-6xl
              '
						>
							Найдите нужный компонент
						</h2>

						<p
							className='
                mx-auto mt-4 max-w-150
                font-manrope text-sm
                leading-relaxed text-white/50
                sm:text-base
              '
						>
							Перейдите в каталог технической документации для поиска
							конкретного электронного компонента.
						</p>

						<Link
							href='/datasheets'
							className='
                mt-7 inline-flex
                items-center justify-center
                rounded-xl
                bg-accent
                px-6 py-3
                font-manrope text-sm
                font-bold text-black
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-accent
              '
						>
							Открыть Datasheet
							<span
								aria-hidden='true'
								className='ml-2'
							>
								→
							</span>
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
