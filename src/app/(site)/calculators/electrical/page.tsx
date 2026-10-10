import Link from 'next/link'

import Breadcrumbs from '@/components/navigation/breadcrumbs'

const mainCalculators = [
	{
		title: 'Закон Ома',
		description:
			'Рассчитайте напряжение, силу тока, сопротивление или мощность электрической цепи.',
		formula: 'U = I · R',
		href: '/calculators/electrical/ohms-law'
	},
	{
		title: 'Электрическая мощность',
		description:
			'Рассчитайте мощность электрической цепи по напряжению и силе тока.',
		formula: 'P = U · I',
		href: '/calculators/electrical/power'
	},
	{
		title: 'Сопротивление',
		description:
			'Определите сопротивление электрического участка по известным значениям напряжения и тока.',
		formula: 'R = U / I',
		href: '/calculators/electrical/resistance'
	},
	{
		title: 'Напряжение',
		description: 'Рассчитайте напряжение на участке электрической цепи.',
		formula: 'U = I · R',
		href: '/calculators/electrical/voltage'
	},
	{
		title: 'Сила тока',
		description:
			'Определите силу электрического тока по напряжению и сопротивлению.',
		formula: 'I = U / R',
		href: '/calculators/electrical/current'
	},
	{
		title: 'Электрическая энергия',
		description:
			'Рассчитайте количество электрической энергии, потребляемой нагрузкой.',
		formula: 'W = P · t',
		href: '/calculators/electrical/energy'
	}
]

const circuitCalculators = [
	{
		title: 'Последовательное соединение',
		description:
			'Рассчитайте общее сопротивление резисторов при последовательном соединении.',
		formula: 'R = R₁ + R₂ + ...',
		href: '/calculators/electrical/series'
	},
	{
		title: 'Параллельное соединение',
		description:
			'Рассчитайте эквивалентное сопротивление при параллельном соединении.',
		formula: '1 / R = 1 / R₁ + 1 / R₂',
		href: '/calculators/electrical/parallel'
	},
	{
		title: 'Делитель напряжения',
		description:
			'Рассчитайте выходное напряжение простого резистивного делителя.',
		formula: 'U₂ = U · R₂ / (R₁ + R₂)',
		href: '/calculators/electrical/voltage-divider'
	}
]

function CalculatorCard({
	title,
	description,
	formula,
	href
}: {
	title: string
	description: string
	formula: string
	href: string
}) {
	return (
		<Link
			href={href}
			className='group flex min-h-55 flex-col rounded-xl border border-border bg-background-light p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent-hover hover:bg-border-hover'
		>
			<div className='flex items-start justify-between gap-4'>
				<h3 className='text-xl font-semibold leading-tight text-white'>
					{title}
				</h3>

				<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-lg text-accent transition-all duration-200 group-hover:translate-x-1 group-hover:bg-accent group-hover:text-background'>
					→
				</span>
			</div>

			<p className='mt-4 text-[15px] leading-6 text-[#aeb7bd]'>{description}</p>

			<div className='mt-auto pt-6 font-mono text-sm font-semibold text-accent'>
				{formula}
			</div>
		</Link>
	)
}

export default function ElectricalCalculatorsPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			{/* Заголовок страницы */}
			<section className='mb-16'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Электрические расчёты
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Онлайн-калькуляторы для расчёта основных параметров электрических
						цепей. Выберите нужный калькулятор, введите известные значения и
						получите результат.
					</p>
				</div>
			</section>

			{/* Основные расчёты */}
			<section className='mb-16'>
				<div className='mb-7'>
					<h2 className='text-2xl font-bold text-white md:text-3xl'>
						Основные расчёты
					</h2>

					<p className='mt-2 text-sm leading-6 text-[#8f9aa1]'>
						Базовые электрические величины и зависимости между ними.
					</p>
				</div>

				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{mainCalculators.map(calculator => (
						<CalculatorCard
							key={calculator.title}
							{...calculator}
						/>
					))}
				</div>
			</section>

			{/* Расчёты цепей */}
			<section className='mb-16'>
				<div className='mb-7'>
					<h2 className='text-2xl font-bold text-white md:text-3xl'>
						Расчёты электрических цепей
					</h2>

					<p className='mt-2 text-sm leading-6 text-[#8f9aa1]'>
						Калькуляторы для расчёта соединений и отдельных участков
						электрических цепей.
					</p>
				</div>

				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{circuitCalculators.map(calculator => (
						<CalculatorCard
							key={calculator.title}
							{...calculator}
						/>
					))}
				</div>
			</section>

			{/* Информационный блок */}
			<section className='rounded-xl border border-border bg-background-dark p-7 md:p-9'>
				<div className='flex flex-col gap-7 md:flex-row md:items-center md:justify-between'>
					<div className='max-w-2xl'>
						<h2 className='text-2xl font-bold text-white'>
							Электрические расчёты онлайн
						</h2>

						<p className='mt-3 text-sm leading-6 text-[#9da8ae]'>
							Используйте калькуляторы для быстрых расчётов при изучении
							электротехники, электроники и физики. Результаты сопровождаются
							формулами и единицами измерения.
						</p>
					</div>

					<Link
						href='/calculators'
						className='inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-background transition-colors duration-200 hover:bg-accent-hover'
					>
						Все калькуляторы
					</Link>
				</div>
			</section>
		</main>
	)
}
