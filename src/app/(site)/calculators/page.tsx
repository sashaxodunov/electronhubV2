import Link from 'next/link'

const componentGroups = [
	{
		title: 'Пассивные',
		description: 'Компоненты, не создающие усиления и не требующие управления.',
		items: [
			{ title: 'Резисторы', href: '/datasheets/resistor' },
			{ title: 'Конденсаторы', href: '/datasheets/capacitor' },
			{ title: 'Индуктивности', href: '/datasheets/inductance' }
		]
	},
	{
		title: 'Полупроводниковые',
		description: 'Компоненты на основе полупроводниковых структур.',
		items: [
			{ title: 'Диоды', href: '/datasheets/diodes' },
			{ title: 'Транзисторы', href: '/datasheets/transistors' },
			{ title: 'Тиристоры', href: '/datasheets/thyristors' }
		]
	},
	{
		title: 'Интегральные',
		description: 'Микросхемы и интегральные электронные устройства.',
		items: [
			{ title: 'Микросхемы', href: '/datasheets/microchips' },
			{ title: 'Датчики', href: '/datasheets/sensor' },
			{ title: 'Оптоэлектроника', href: '/datasheets/optoelectronic' }
		]
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

			<header className='mx-auto max-w-220 text-center'>
				<p
					className='
            mb-4 font-manrope text-xs font-semibold
            uppercase tracking-[0.2em] text-accent
            sm:text-sm
          '
				>
					ElectronHub / Components
				</p>

				<h1
					className='
            font-bebas text-5xl font-bold uppercase
            leading-none tracking-tight text-accent
            sm:text-6xl lg:text-7xl xl:text-8xl
          '
				>
					Электронные компоненты
				</h1>

				<p
					className='
            mx-auto mt-6 max-w-190
            font-manrope text-sm leading-relaxed text-white/70
            sm:text-base lg:text-lg
          '
				>
					Справочная информация об электронных компонентах: устройство, принцип
					работы, основные параметры, условные обозначения и типовые схемы
					включения.
				</p>
			</header>

			{/* =========================================================
          QUICK NAVIGATION
      ========================================================== */}

			<nav
				aria-label='Категории компонентов'
				className='mt-10 sm:mt-14'
			>
				<div
					className='
            grid grid-cols-1 gap-4
            md:grid-cols-3
          '
				>
					{componentGroups.map(group => (
						<section
							key={group.title}
							className='
                rounded-2xl
                border border-white/10
                bg-neutral-900/70
                p-5
                sm:p-6
              '
						>
							<h2
								className='
                  font-bebas text-2xl
                  uppercase tracking-wide
                  text-white sm:text-3xl
                '
							>
								{group.title}
							</h2>

							<p
								className='
                  mt-2
                  font-manrope text-xs
                  leading-relaxed text-white/50
                  sm:text-sm
                '
							>
								{group.description}
							</p>

							<ul className='mt-5 space-y-2'>
								{group.items.map(item => (
									<li key={item.href}>
										<Link
											href={item.href}
											className='
                        group flex items-center justify-between
                        rounded-lg px-3 py-2.5
                        font-manrope text-sm
                        text-white/75
                        transition-colors
                        hover:bg-white/5
                        hover:text-accent
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-accent
                      '
										>
											<span>{item.title}</span>

											<span
												aria-hidden='true'
												className='
                          text-white/20
                          transition-transform
                          group-hover:translate-x-1
                          group-hover:text-accent
                        '
											>
												→
											</span>
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</nav>

			{/* =========================================================
          INTRODUCTION
      ========================================================== */}

			<section className='mt-16 sm:mt-20 lg:mt-24'>
				<div
					className='
            grid grid-cols-1 gap-10
            lg:grid-cols-[1fr_0.8fr]
            lg:items-center
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
							Что такое электронный компонент
						</p>

						<h2
							className='
                mt-3 font-bebas text-3xl
                uppercase leading-tight
                text-white sm:text-4xl lg:text-5xl
              '
						>
							Основа любой электронной системы
						</h2>

						<div
							className='
                mt-5 space-y-4
                font-manrope text-sm
                leading-relaxed text-white/65
                sm:text-base
              '
						>
							<p>
								Электронный компонент — элемент электрической или электронной
								схемы, предназначенный для выполнения определённой функции.
							</p>

							<p>
								В зависимости от конструкции и назначения компонент может
								ограничивать ток, накапливать энергию, выпрямлять сигнал,
								усиливать его, выполнять логические операции или преобразовывать
								физические величины в электрический сигнал.
							</p>

							<p>
								Для правильного выбора компонента необходимо учитывать его
								электрические параметры, допустимые режимы работы, корпус,
								температурный диапазон и особенности монтажа.
							</p>
						</div>
					</div>

					{/* Информационная карточка */}

					<div
						className='
              relative overflow-hidden rounded-3xl
              border border-white/10
              bg-neutral-900
              p-6 sm:p-8
            '
					>
						<div
							aria-hidden='true'
							className='
                absolute -right-20 -top-20
                h-48 w-48 rounded-full
                bg-accent/10 blur-3xl
              '
						/>

						<div className='relative'>
							<span
								className='
                  font-bebas text-6xl
                  leading-none text-accent/20
                '
							>
								01
							</span>

							<h3
								className='
                  mt-4 font-manrope
                  text-xl font-bold text-white
                '
							>
								Параметры компонента
							</h3>

							<ul className='mt-5 space-y-3'>
								{[
									'Номинальные значения',
									'Предельно допустимые параметры',
									'Рабочая температура',
									'Электрические характеристики',
									'Тип корпуса',
									'Монтаж и подключение'
								].map(item => (
									<li
										key={item}
										className='
                      flex items-center gap-3
                      font-manrope text-sm
                      text-white/60
                    '
									>
										<span
											className='
                        h-1.5 w-1.5
                        shrink-0 rounded-full
                        bg-accent
                      '
										/>

										{item}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* =========================================================
          RESISTOR SECTION
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div className='mb-8'>
					<p
						className='
              font-manrope text-xs font-semibold
              uppercase tracking-[0.18em] text-accent
            '
					>
						Пример характеристики
					</p>

					<h2
						className='
              mt-2 font-bebas text-3xl
              uppercase text-white
              sm:text-4xl lg:text-5xl
            '
					>
						Вольт-амперная характеристика
					</h2>

					<p
						className='
              mt-3 max-w-180
              font-manrope text-sm
              leading-relaxed text-white/60
              sm:text-base
            '
					>
						Вольт-амперная характеристика показывает зависимость тока через
						компонент от приложенного к нему напряжения. Для линейного резистора
						эта зависимость описывается законом Ома.
					</p>
				</div>

				{/* График */}

				<div
					className='
            overflow-hidden rounded-2xl
            border border-white/10
            bg-neutral-900
            p-4 sm:p-6
          '
				>
					<div className='relative aspect-[16/8] min-h-70 w-full'>
						<svg
							viewBox='0 0 800 400'
							className='h-full w-full'
							role='img'
							aria-label='График зависимости тока от напряжения'
						>
							{/* Сетка */}

							<g
								stroke='currentColor'
								className='text-white/[0.06]'
								strokeWidth='1'
							>
								<line
									x1='80'
									y1='40'
									x2='80'
									y2='340'
								/>
								<line
									x1='80'
									y1='340'
									x2='760'
									y2='340'
								/>

								<line
									x1='80'
									y1='280'
									x2='760'
									y2='280'
								/>
								<line
									x1='80'
									y1='220'
									x2='760'
									y2='220'
								/>
								<line
									x1='80'
									y1='160'
									x2='760'
									y2='160'
								/>
								<line
									x1='80'
									y1='100'
									x2='760'
									y2='100'
								/>

								<line
									x1='216'
									y1='40'
									x2='216'
									y2='340'
								/>
								<line
									x1='352'
									y1='40'
									x2='352'
									y2='340'
								/>
								<line
									x1='488'
									y1='40'
									x2='488'
									y2='340'
								/>
								<line
									x1='624'
									y1='40'
									x2='624'
									y2='340'
								/>
							</g>

							{/* Оси */}

							<g
								stroke='currentColor'
								className='text-white/40'
								strokeWidth='2'
							>
								<line
									x1='80'
									y1='340'
									x2='760'
									y2='340'
								/>
								<line
									x1='80'
									y1='340'
									x2='80'
									y2='40'
								/>
							</g>

							{/* График */}

							<path
								d='M80 340 L216 280 L352 220 L488 160 L624 100 L760 40'
								fill='none'
								stroke='currentColor'
								className='text-accent'
								strokeWidth='4'
								strokeLinecap='round'
							/>

							{/* Точки */}

							<g
								fill='currentColor'
								className='text-accent'
							>
								<circle
									cx='216'
									cy='280'
									r='5'
								/>
								<circle
									cx='352'
									cy='220'
									r='5'
								/>
								<circle
									cx='488'
									cy='160'
									r='5'
								/>
								<circle
									cx='624'
									cy='100'
									r='5'
								/>
							</g>

							{/* Подписи */}

							<g
								fill='currentColor'
								className='text-white/50'
								fontSize='14'
								fontFamily='Manrope, sans-serif'
							>
								<text
									x='755'
									y='365'
								>
									U
								</text>
								<text
									x='50'
									y='48'
								>
									I
								</text>

								<text
									x='74'
									y='365'
								>
									0
								</text>
								<text
									x='205'
									y='365'
								>
									2
								</text>
								<text
									x='341'
									y='365'
								>
									4
								</text>
								<text
									x='477'
									y='365'
								>
									6
								</text>
								<text
									x='613'
									y='365'
								>
									8
								</text>
								<text
									x='748'
									y='365'
								>
									10 V
								</text>
							</g>
						</svg>
					</div>

					<div
						className='
              mt-4 border-t border-white/10
              pt-4
              font-manrope text-xs
              text-white/40
            '
					>
						Иллюстративный график. Реальная характеристика зависит от типа и
						номинала компонента.
					</div>
				</div>
			</section>

			{/* =========================================================
          CIRCUIT DIAGRAM
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div className='mb-8'>
					<p
						className='
              font-manrope text-xs font-semibold
              uppercase tracking-[0.18em] text-accent
            '
					>
						Электрическая схема
					</p>

					<h2
						className='
              mt-2 font-bebas text-3xl
              uppercase text-white
              sm:text-4xl lg:text-5xl
            '
					>
						Базовая схема подключения
					</h2>
				</div>

				<div
					className='
            grid grid-cols-1 gap-5
            lg:grid-cols-2
          '
				>
					{/* Схема */}

					<div
						className='
              overflow-hidden rounded-2xl
              border border-white/10
              bg-neutral-900
              p-5 sm:p-8
            '
					>
						<div className='aspect-[16/9] w-full'>
							<svg
								viewBox='0 0 800 450'
								className='h-full w-full'
								role='img'
								aria-label='Принципиальная схема подключения резистора'
							>
								{/* Питание */}

								<text
									x='400'
									y='45'
									textAnchor='middle'
									fill='currentColor'
									className='text-white/60'
									fontSize='20'
									fontFamily='Manrope, sans-serif'
								>
									+V
								</text>

								{/* Верхний провод */}

								<line
									x1='400'
									y1='60'
									x2='400'
									y2='130'
									stroke='currentColor'
									className='text-white/50'
									strokeWidth='4'
								/>

								{/* Резистор */}

								<path
									d='
                    M400 130
                    L360 150
                    L440 180
                    L360 210
                    L440 240
                    L360 270
                    L400 290
                  '
									fill='none'
									stroke='currentColor'
									className='text-accent'
									strokeWidth='6'
									strokeLinejoin='round'
								/>

								{/* Нижний провод */}

								<line
									x1='400'
									y1='290'
									x2='400'
									y2='350'
									stroke='currentColor'
									className='text-white/50'
									strokeWidth='4'
								/>

								{/* Земля */}

								<line
									x1='365'
									y1='350'
									x2='435'
									y2='350'
									stroke='currentColor'
									className='text-white/50'
									strokeWidth='4'
								/>

								<line
									x1='375'
									y1='360'
									x2='425'
									y2='360'
									stroke='currentColor'
									className='text-white/50'
									strokeWidth='4'
								/>

								<line
									x1='387'
									y1='370'
									x2='413'
									y2='370'
									stroke='currentColor'
									className='text-white/50'
									strokeWidth='4'
								/>

								{/* Подписи */}

								<text
									x='470'
									y='220'
									fill='currentColor'
									className='text-white'
									fontSize='22'
									fontFamily='Manrope, sans-serif'
								>
									R
								</text>

								<text
									x='455'
									y='245'
									fill='currentColor'
									className='text-white/40'
									fontSize='15'
									fontFamily='Manrope, sans-serif'
								>
									Резистор
								</text>
							</svg>
						</div>
					</div>

					{/* Объяснение */}

					<div
						className='
              flex flex-col justify-center
              rounded-2xl
              border border-white/10
              bg-neutral-900
              p-6 sm:p-8
            '
					>
						<span
							className='
                font-bebas text-5xl
                leading-none text-accent/20
              '
						>
							R
						</span>

						<h3
							className='
                mt-3 font-manrope
                text-xl font-bold text-white
              '
						>
							Резистор
						</h3>

						<p
							className='
                mt-4 font-manrope
                text-sm leading-relaxed
                text-white/60 sm:text-base
              '
						>
							Резистор используется для ограничения тока, формирования
							требуемого напряжения, задания рабочих режимов активных
							компонентов и согласования электрических цепей.
						</p>

						<div
							className='
                mt-6 grid grid-cols-2
                gap-3
              '
						>
							<div
								className='
                  rounded-xl
                  border border-white/10
                  bg-black/20
                  p-4
                '
							>
								<span
									className='
                    block font-manrope
                    text-xs text-white/40
                  '
								>
									Единица
								</span>

								<strong
									className='
                    mt-1 block font-manrope
                    text-lg text-white
                  '
								>
									Ом
								</strong>
							</div>

							<div
								className='
                  rounded-xl
                  border border-white/10
                  bg-black/20
                  p-4
                '
							>
								<span
									className='
                    block font-manrope
                    text-xs text-white/40
                  '
								>
									Обозначение
								</span>

								<strong
									className='
                    mt-1 block font-manrope
                    text-lg text-white
                  '
								>
									R
								</strong>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =========================================================
          KEY PARAMETERS
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div className='mb-8'>
					<p
						className='
              font-manrope text-xs font-semibold
              uppercase tracking-[0.18em] text-accent
            '
					>
						Основные характеристики
					</p>

					<h2
						className='
              mt-2 font-bebas text-3xl
              uppercase text-white
              sm:text-4xl lg:text-5xl
            '
					>
						На что смотреть в Datasheet
					</h2>
				</div>

				<div
					className='
            grid grid-cols-1 gap-4
            min-[480px]:grid-cols-2
            lg:grid-cols-3
          '
				>
					{[
						{
							number: '01',
							title: 'Номинал',
							text: 'Основное номинальное значение электрического параметра.'
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
							text: 'Допустимое рабочее и максимальное напряжение.'
						},
						{
							number: '05',
							title: 'Температура',
							text: 'Диапазон температур, в котором компонент сохраняет заданные характеристики.'
						},
						{
							number: '06',
							title: 'Корпус',
							text: 'Конструктивное исполнение и способ установки компонента.'
						}
					].map(parameter => (
						<article
							key={parameter.number}
							className='
                rounded-2xl
                border border-white/10
                bg-neutral-900
                p-5 sm:p-6
              '
						>
							<span
								className='
                  font-bebas text-4xl
                  text-accent/30
                '
							>
								{parameter.number}
							</span>

							<h3
								className='
                  mt-3 font-manrope
                  text-lg font-bold text-white
                '
							>
								{parameter.title}
							</h3>

							<p
								className='
                  mt-2 font-manrope
                  text-sm leading-relaxed
                  text-white/50
                '
							>
								{parameter.text}
							</p>
						</article>
					))}
				</div>
			</section>

			{/* =========================================================
          CTA
      ========================================================== */}

			<section className='mt-20 sm:mt-28'>
				<div
					className='
            relative overflow-hidden
            rounded-3xl
            border border-accent/20
            bg-accent/5
            p-6 text-center
            sm:p-10 lg:p-14
          '
				>
					<div
						aria-hidden='true'
						className='
              absolute left-1/2 top-0
              h-40 w-80
              -translate-x-1/2
              rounded-full
              bg-accent/10
              blur-3xl
            '
					/>

					<div className='relative'>
						<h2
							className='
                font-bebas text-3xl
                uppercase text-white
                sm:text-4xl lg:text-5xl
              '
						>
							Найдите нужный компонент
						</h2>

						<p
							className='
                mx-auto mt-4 max-w-150
                font-manrope text-sm
                leading-relaxed text-white/60
                sm:text-base
              '
						>
							Перейдите в каталог Datasheet и найдите техническую документацию
							по нужному компоненту.
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
                transition-transform
                hover:-translate-y-0.5
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-accent
              '
						>
							Перейти к Datasheet
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
