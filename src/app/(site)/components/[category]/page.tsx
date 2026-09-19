import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { datasheetCategories } from '@/config/categories'

interface DatasheetCategoryPageProps {
	params: Promise<{
		category: string
	}>
}

export async function generateMetadata({
	params
}: DatasheetCategoryPageProps): Promise<Metadata> {
	const { category } = await params

	const currentCategory = datasheetCategories.find(
		item => item.slug === category
	)

	if (!currentCategory) {
		return {}
	}

	return {
		title: `${currentCategory.title} — Datasheet | ElectronHub`,
		description: `Техническая документация, характеристики и datasheet ${currentCategory.title.toLowerCase()}.`
	}
}

export default async function DatasheetCategoryPage({
	params
}: DatasheetCategoryPageProps) {
	const { category } = await params

	const currentCategory = datasheetCategories.find(
		item => item.slug === category
	)

	if (!currentCategory) {
		notFound()
	}

	return (
		<main
			lang='ru'
			className='mx-auto w-full max-w-300 px-4 py-12 sm:py-16 lg:py-20'
		>
			{/* Заголовок категории */}
			<header className='mx-auto w-full max-w-200 text-center'>
				<h1
					className='
            font-bebas text-4xl font-bold uppercase
            leading-tight tracking-tight text-accent
            sm:text-5xl lg:text-6xl xl:text-7xl
          '
				>
					{currentCategory.title}
				</h1>

				<p
					className='
            mx-auto mt-5 max-w-180
            font-manrope text-sm leading-relaxed text-white/80
            sm:mt-6 sm:text-base
            lg:mt-8 lg:text-lg
          '
				>
					Техническая документация и характеристики электронных компонентов
					категории «{currentCategory.title.toLowerCase()}».
				</p>
			</header>

			{/* Поиск */}
			<section
				aria-label='Поиск компонентов'
				className='mx-auto mt-10 w-full max-w-220 sm:mt-12'
			>
				<div
					className='
            relative overflow-hidden rounded-2xl
            border border-white/10
            bg-neutral-900/80
            shadow-[0_10px_40px_rgba(0,0,0,0.2)]
          '
				>
					<div className='p-5 sm:p-6'>
						<label
							htmlFor='component-search'
							className='
                mb-3 block
                font-manrope text-sm font-semibold text-white
              '
						>
							Поиск компонента
						</label>

						<div className='relative'>
							<input
								id='component-search'
								type='search'
								placeholder='Например: LM358, 1N4148, BC547...'
								className='
                  h-13 w-full rounded-xl
                  border border-white/10
                  bg-black/30
                  px-4 pr-12
                  font-manrope text-sm text-white
                  outline-none
                  placeholder:text-white/35
                  transition-colors
                  focus:border-accent
                  focus:ring-2 focus:ring-accent/20
                  sm:text-base
                '
							/>

							<svg
								aria-hidden='true'
								viewBox='0 0 24 24'
								fill='none'
								className='
                  pointer-events-none absolute
                  right-4 top-1/2 h-5 w-5
                  -translate-y-1/2 text-white/40
                '
							>
								<path
									d='m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</div>
					</div>
				</div>
			</section>

			{/* Основная область каталога */}
			<section
				aria-label={`Каталог: ${currentCategory.title}`}
				className='mt-10 sm:mt-12'
			>
				{/* Верхняя панель */}
				<div
					className='
            mb-6 flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          '
				>
					<div>
						<h2
							className='
                font-manrope text-lg font-bold text-white
                sm:text-xl
              '
						>
							Компоненты
						</h2>

						<p className='mt-1 font-manrope text-sm text-white/50'>
							Каталог компонентов категории
						</p>
					</div>

					{/* Сортировка */}
					<label className='flex items-center gap-3'>
						<span className='font-manrope text-sm text-white/50'>
							Сортировка
						</span>

						<select
							defaultValue='name'
							className='
                h-10 rounded-lg
                border border-white/10
                bg-neutral-900
                px-3
                font-manrope text-sm text-white
                outline-none
                focus:border-accent
              '
						>
							<option value='name'>По названию</option>
							<option value='newest'>Сначала новые</option>
						</select>
					</label>
				</div>

				{/* Фильтры */}
				<div
					className='
            mb-8 grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          '
				>
					<select
						defaultValue=''
						className='
              h-11 rounded-xl
              border border-white/10
              bg-neutral-900
              px-3
              font-manrope text-sm text-white
              outline-none
              focus:border-accent
            '
					>
						<option value=''>Производитель</option>
						<option value='texas-instruments'>Texas Instruments</option>
						<option value='onsemi'>onsemi</option>
						<option value='st'>STMicroelectronics</option>
						<option value='infineon'>Infineon</option>
					</select>

					<select
						defaultValue=''
						className='
              h-11 rounded-xl
              border border-white/10
              bg-neutral-900
              px-3
              font-manrope text-sm text-white
              outline-none
              focus:border-accent
            '
					>
						<option value=''>Корпус</option>
						<option value='smd'>SMD</option>
						<option value='dip'>DIP</option>
						<option value='soic'>SOIC</option>
						<option value='qfn'>QFN</option>
					</select>

					<select
						defaultValue=''
						className='
              h-11 rounded-xl
              border border-white/10
              bg-neutral-900
              px-3
              font-manrope text-sm text-white
              outline-none
              focus:border-accent
            '
					>
						<option value=''>Монтаж</option>
						<option value='smd'>SMD</option>
						<option value='tht'>THT</option>
					</select>

					<button
						type='button'
						className='
              h-11 rounded-xl
              border border-white/10
              bg-white/5
              px-4
              font-manrope text-sm font-semibold text-white
              transition-colors
              hover:bg-white/10
              focus-visible:outline-2
              focus-visible:outline-accent
            '
					>
						Сбросить фильтры
					</button>
				</div>

				{/* Сетка компонентов */}
				<div
					className='
            grid grid-cols-1 gap-4
            min-[480px]:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          '
				>
					{Array.from({ length: 10 }).map((_, index) => (
						<article
							key={index}
							className='
                group overflow-hidden rounded-2xl
                border border-white/10
                bg-neutral-900
                transition-all duration-300
                hover:-translate-y-1
                hover:border-accent/40
                hover:shadow-[0_12px_35px_rgba(0,0,0,0.25)]
              '
						>
							{/* Изображение-заглушка */}
							<div
								className='
                  aspect-square
                  bg-black/20
                  p-6
                '
							>
								<div
									className='
                    flex h-full w-full
                    items-center justify-center
                    rounded-xl
                    border border-white/5
                    bg-white/[0.02]
                  '
								>
									<span
										className='
                      font-bebas text-3xl
                      text-white/10
                    '
									>
										Datasheet
									</span>
								</div>
							</div>

							{/* Информация */}
							<div className='p-4'>
								<p
									className='
                    font-manrope text-xs
                    uppercase tracking-wide
                    text-accent
                  '
								>
									{currentCategory.title}
								</p>

								<h3
									className='
                    mt-2
                    font-manrope text-base font-bold
                    text-white
                  '
								>
									{getDemoComponentName(currentCategory.slug, index)}
								</h3>

								<p
									className='
                    mt-2 line-clamp-2
                    font-manrope text-xs
                    leading-relaxed text-white/50
                  '
								>
									Технические характеристики, документация и параметры
									компонента.
								</p>

								<button
									type='button'
									className='
                    mt-4 w-full rounded-lg
                    bg-accent/10
                    px-3 py-2
                    font-manrope text-xs font-semibold
                    text-accent
                    transition-colors
                    hover:bg-accent hover:text-black
                  '
								>
									Открыть datasheet
								</button>
							</div>
						</article>
					))}
				</div>

				{/* Пагинация */}
				<nav
					aria-label='Пагинация каталога'
					className='
            mt-10 flex items-center
            justify-center gap-2
          '
				>
					<button
						type='button'
						disabled
						className='
              flex h-10 w-10 items-center justify-center
              rounded-lg border border-white/10
              bg-white/5
              font-manrope text-sm text-white/30
            '
					>
						←
					</button>

					<button
						type='button'
						className='
              flex h-10 w-10 items-center justify-center
              rounded-lg bg-accent
              font-manrope text-sm font-bold text-black
            '
					>
						1
					</button>

					<button
						type='button'
						className='
              flex h-10 w-10 items-center justify-center
              rounded-lg border border-white/10
              bg-white/5
              font-manrope text-sm text-white
              transition-colors
              hover:bg-white/10
            '
					>
						2
					</button>

					<button
						type='button'
						className='
              flex h-10 w-10 items-center justify-center
              rounded-lg border border-white/10
              bg-white/5
              font-manrope text-sm text-white
              transition-colors
              hover:bg-white/10
            '
					>
						3
					</button>

					<button
						type='button'
						className='
              flex h-10 w-10 items-center justify-center
              rounded-lg border border-white/10
              bg-white/5
              font-manrope text-sm text-white
              transition-colors
              hover:bg-white/10
            '
					>
						→
					</button>
				</nav>
			</section>
		</main>
	)
}

/**
 * Временные названия для демонстрации интерфейса.
 * Позже эти данные будут приходить из PostgreSQL.
 */
function getDemoComponentName(category: string, index: number): string {
	const components: Record<string, string[]> = {
		resistor: [
			'RC0603FR-0710KL',
			'CRCW060310K0FKEA',
			'ERJ-3EKF1002V',
			'RMCF0603JT10K0',
			'RT0603FRE0710KL'
		],

		capacitor: [
			'GRM188R71H104KA93',
			'CL10B104KB8NNNC',
			'CC0603KRX7R9BB104',
			'C0603C104K5RAC',
			'KEMET C0603 100nF'
		],

		inductance: [
			'LQG15HS10NJ02',
			'LQM18FN1R0M00',
			'MLZ1608M100WT',
			'BLM18PG221SN1',
			'LQW15AN10NG00'
		],

		diodes: ['1N4148', '1N4007', 'BAT54', 'BAV99', 'UF4007'],

		thyristors: ['BT136-600', 'TYN612', 'BT151-800R', '2N6509', 'MCR100-6'],

		transistors: ['BC547', 'BC557', '2N2222', '2N3904', 'IRFZ44N'],

		microchips: ['LM358', 'NE555', 'LM7805', 'ATmega328P', 'STM32F103C8T6']
	}

	const names = components[category]

	if (names) {
		return names[index % names.length]
	}

	return `COMPONENT-${String(index + 1).padStart(3, '0')}`
}
