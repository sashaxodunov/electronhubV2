import Breadcrumbs from '@/components/navigation/breadcrumbs'

import {
	ArrowRight,
	Atom,
	Battery,
	Calculator,
	CircleDot,
	Cpu,
	Radio,
	Search,
	Waves,
	Zap
} from 'lucide-react'
import Link from 'next/link'

const popularCalculators = [
	{
		title: 'Закон Ома',
		description: 'Расчёт напряжения, тока и сопротивления',
		formula: 'U = I × R',
		href: '/calculators/electrical/ohms-law'
	},
	{
		title: 'Делитель напряжения',
		description: 'Расчёт выходного напряжения делителя',
		formula: 'Vout = Vin × R₂ / (R₁ + R₂)',
		href: '/calculators/electrical/voltage-divider'
	},
	{
		title: 'Резистор для LED',
		description: 'Подбор токоограничивающего резистора',
		formula: 'R = (Vin − Vf) / I',
		href: '/calculators/diodes/led-resistor'
	},
	{
		title: 'Цветовая маркировка',
		description: 'Определение сопротивления по цветовым полосам',
		formula: 'Ω · kΩ · MΩ',
		href: '/calculators/resistors/color-code'
	}
]

const mainCategory = {
	number: '01',
	icon: Zap,
	title: 'Электрические расчёты',
	description: 'Базовые расчёты напряжения, тока, сопротивления и мощности.',
	href: '/calculators/electrical',
	calculators: ['Закон Ома', 'Мощность', 'Делитель напряжения', 'Соединения']
}

const categories = [
	{
		number: '02',
		icon: Atom,
		title: 'Физические расчёты',
		description:
			'Энергия, мощность, тепло, давление, движение и другие физические величины.',
		href: '/calculators/physics'
	},
	{
		number: '03',
		icon: CircleDot,
		title: 'Резисторы',
		description: 'Сопротивление, E-серии, соединения и мощность.',
		href: '/calculators/resistors'
	},
	{
		number: '04',
		icon: Waves,
		title: 'Конденсаторы',
		description: 'Ёмкость, реактивное сопротивление и RC-цепи.',
		href: '/calculators/capacitors'
	},
	{
		number: '05',
		icon: Waves,
		title: 'Катушки',
		description: 'Индуктивность, реактивное сопротивление и резонанс.',
		href: '/calculators/inductors'
	},
	{
		number: '06',
		icon: Waves,
		title: 'Переменный ток',
		description: 'Импеданс, фаза, RMS и коэффициент мощности.',
		href: '/calculators/ac'
	},
	{
		number: '07',
		icon: Waves,
		title: 'Фильтры',
		description: 'RC, RL, LC и RLC-фильтры.',
		href: '/calculators/filters'
	},
	{
		number: '08',
		icon: Zap,
		title: 'Источники питания',
		description: 'Выпрямители, стабилизаторы и DC/DC преобразователи.',
		href: '/calculators/power-supplies'
	},
	{
		number: '09',
		icon: CircleDot,
		title: 'Диоды',
		description: 'LED, стабилитроны и выпрямительные схемы.',
		href: '/calculators/diodes'
	},
	{
		number: '10',
		icon: Cpu,
		title: 'Транзисторы',
		description: 'Расчёт режимов BJT и MOSFET.',
		href: '/calculators/transistors'
	},
	{
		number: '11',
		icon: Cpu,
		title: 'Операционные усилители',
		description: 'Инвертирующие, неинвертирующие и суммирующие схемы.',
		href: '/calculators/opamps'
	},
	{
		number: '12',
		icon: Waves,
		title: 'Сигналы и частоты',
		description: 'Частота, период, длина волны и децибелы.',
		href: '/calculators/signals'
	},
	{
		number: '13',
		icon: Radio,
		title: 'Радиотехника',
		description: 'Антенны, SWR, импеданс и радиочастотные расчёты.',
		href: '/calculators/rf'
	},
	{
		number: '14',
		icon: Cpu,
		title: 'PCB',
		description: 'Ширина дорожек, импеданс и параметры печатных плат.',
		href: '/calculators/pcb'
	},
	{
		number: '15',
		icon: Battery,
		title: 'Аккумуляторы',
		description: 'Ёмкость, время работы и конфигурация батарей.',
		href: '/calculators/batteries'
	}
]

export default async function CalculatorsPage() {
	return (
		<main className='min-h-screen bg-background text-text'>
			<Breadcrumbs />

			<h1 className='mt-10 text-4xl font-bold tracking-tight text-accent'>
				Калькуляторы
			</h1>

			<p className='mt-4 max-w-2xl text-base leading-7 text-text-secondary'>
				Инженерные инструменты для расчёта параметров электронных компонентов,
				схем и электрических цепей.
			</p>

			{/* Search */}
			<div className='mt-8 max-w-3xl'>
				<div className='flex items-center rounded-xl border border-border bg-background-light px-4 py-3 shadow-sm transition-colors focus-within:border-accent'>
					<Search className='size-5 text-text-muted' />

					<input
						type='search'
						placeholder='Найти калькулятор...'
						className='ml-3 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted'
					/>

					<kbd className='rounded-md border border-border bg-control px-2 py-1 text-xs text-text-muted'>
						Ctrl K
					</kbd>
				</div>
			</div>

			{/* Popular */}
			<section className='mt-16'>
				<div className='mb-6 flex items-end justify-between'>
					<div>
						<p className='text-xs font-bold uppercase tracking-[0.15em] text-text-muted'>
							Быстрый доступ
						</p>

						<h2 className='mt-2 text-2xl font-bold tracking-tight text-text'>
							Популярные калькуляторы
						</h2>
					</div>
				</div>

				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{popularCalculators.map(calculator => (
						<Link
							key={calculator.href}
							href={calculator.href}
							className='group rounded-xl border border-border bg-background-light p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
						>
							<div className='flex items-start justify-between gap-4'>
								<Calculator className='size-5 text-text-muted transition-colors group-hover:text-accent' />

								<ArrowRight className='size-4 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent' />
							</div>

							<h3 className='mt-8 font-semibold text-text'>
								{calculator.title}
							</h3>

							<p className='mt-2 min-h-10 text-sm leading-5 text-text-secondary'>
								{calculator.description}
							</p>

							<div className='mt-5 border-t border-border pt-4'>
								<span className='font-mono text-xs text-accent'>
									{calculator.formula}
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Categories */}
			<section className='mt-20'>
				<div className='mb-6'>
					<p className='text-xs font-bold uppercase tracking-[0.15em] text-text-muted'>
						Каталог
					</p>

					<h2 className='mt-2 text-2xl font-bold tracking-tight text-text'>
						Направления
					</h2>
				</div>

				{/* Main category */}
				<Link
					href={mainCategory.href}
					className='group block rounded-2xl border border-border bg-background-light p-6 transition-all hover:border-accent hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:p-8'
				>
					<div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
						<div className='flex gap-5'>
							<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-control'>
								<mainCategory.icon className='size-6 text-accent' />
							</div>

							<div>
								<div className='flex items-center gap-3'>
									<span className='font-mono text-xs text-text-muted'>
										{mainCategory.number}
									</span>

									<h3 className='text-xl font-bold text-text'>
										{mainCategory.title}
									</h3>
								</div>

								<p className='mt-2 max-w-2xl text-sm leading-6 text-text-secondary'>
									{mainCategory.description}
								</p>
							</div>
						</div>

						<ArrowRight className='size-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent' />
					</div>

					<div className='mt-6 flex flex-wrap gap-2 border-t border-border pt-5'>
						{mainCategory.calculators.map(calculator => (
							<span
								key={calculator}
								className='rounded-full bg-control px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors group-hover:bg-background'
							>
								{calculator}
							</span>
						))}
					</div>
				</Link>

				{/* Other categories */}
				<div className='mt-4 grid gap-4 sm:grid-cols-2'>
					{categories.map(category => {
						const Icon = category.icon

						return (
							<Link
								key={category.href}
								href={category.href}
								className='group flex min-h-40 flex-col justify-between rounded-xl border border-border bg-background-light p-6 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
							>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex size-10 items-center justify-center rounded-lg bg-control'>
										<Icon className='size-5 text-text-muted transition-colors group-hover:text-accent' />
									</div>

									<span className='font-mono text-xs text-text-muted'>
										{category.number}
									</span>
								</div>

								<div className='mt-8'>
									<div className='flex items-center justify-between gap-4'>
										<h3 className='font-semibold text-text'>
											{category.title}
										</h3>

										<ArrowRight className='size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent' />
									</div>

									<p className='mt-2 text-sm leading-5 text-text-secondary'>
										{category.description}
									</p>
								</div>
							</Link>
						)
					})}
				</div>
			</section>

			{/* Quick calculation */}
			<section className='mt-20 rounded-2xl border border-border bg-background-dark p-6 sm:p-8'>
				<div className='max-w-2xl'>
					<p className='text-xs font-bold uppercase tracking-[0.15em] text-text-muted'>
						Инструменты
					</p>

					<h2 className='mt-2 text-2xl font-bold tracking-tight text-text'>
						Быстрый расчёт
					</h2>

					<p className='mt-3 text-sm leading-6 text-text-secondary'>
						Выберите нужный инструмент и выполните расчёт с необходимыми
						параметрами.
					</p>
				</div>

				<div className='mt-6'>
					<Link
						href='/calculators/electrical/ohms-law'
						className='inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-background-dark transition-colors hover:bg-accent-hover'
					>
						Открыть калькулятор
						<ArrowRight className='size-4' />
					</Link>
				</div>
			</section>
		</main>
	)
}
