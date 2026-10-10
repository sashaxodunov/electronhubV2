import Link from 'next/link'

import {
	ArrowRight,
	Calculator,
	GitBranch,
	GitMerge,
	Lightbulb,
	Palette,
	SlidersHorizontal,
	Zap
} from 'lucide-react'

import Breadcrumbs from '@/components/navigation/breadcrumbs'

type CalculatorCardProps = {
	icon: React.ReactNode
	title: string
	description: string
	href: string
}

function CalculatorCard({
	icon,
	title,
	description,
	href
}: CalculatorCardProps) {
	return (
		<Link
			href={href}
			className='group rounded-xl border border-border bg-background-light p-5 transition-colors hover:border-[#b89445]'
		>
			<div className='mb-5 flex size-11 items-center justify-center rounded-lg border border-border bg-background-dark text-accent'>
				{icon}
			</div>

			<h2 className='text-xl font-semibold text-white transition-colors group-hover:text-[#d0ae68]'>
				{title}
			</h2>

			<p className='mt-3 text-sm leading-6 text-[#7d898f]'>{description}</p>

			<div className='mt-5 flex items-center gap-2 text-sm font-medium text-[#8f9aa1] transition-colors group-hover:text-[#d0ae68]'>
				Открыть калькулятор
				<ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
			</div>
		</Link>
	)
}

export default function ResistorCalculatorsPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			{/* Заголовок страницы */}
			<section className='mb-12'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Калькуляторы резисторов
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Онлайн-калькуляторы для расчёта сопротивления, определения цветовой
						маркировки и работы с последовательными и параллельными соединениями
						резисторов.
					</p>
				</div>
			</section>

			{/* Карточки калькуляторов */}
			<section>
				<div className='mb-6'>
					<h2 className='text-2xl font-bold text-white'>
						Доступные калькуляторы
					</h2>

					<p className='mt-2 text-sm text-[#7d898f]'>
						Выберите нужный инструмент для расчёта.
					</p>
				</div>

				<div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
					<CalculatorCard
						icon={<Palette className='size-5' />}
						title='Цветовая маркировка'
						description='Определение номинала, допуска и ТКС резистора по цветным полосам. Доступен обратный расчёт — от номинала к цветам.'
						href='/calculators/resistors/color-code'
					/>

					<CalculatorCard
						icon={<GitBranch className='size-5' />}
						title='Последовательное соединение'
						description='Расчёт общего сопротивления нескольких резисторов, соединённых последовательно.'
						href='/calculators/resistors/series'
					/>

					<CalculatorCard
						icon={<GitMerge className='size-5' />}
						title='Параллельное соединение'
						description='Расчёт эквивалентного сопротивления нескольких резисторов, соединённых параллельно.'
						href='/calculators/resistors/parallel'
					/>

					<CalculatorCard
						icon={<SlidersHorizontal className='size-5' />}
						title='Стандартные номиналы'
						description='Подбор ближайшего стандартного номинала резистора по рядам E6, E12, E24, E48 и E96.'
						href='/calculators/resistors/standard-value'
					/>

					<CalculatorCard
						icon={<GitMerge className='size-5' />}
						title='Делитель напряжения'
						description='Расчёт выходного напряжения и подбор сопротивлений для делителя напряжения на двух резисторах.'
						href='/calculators/resistors/voltage-divider'
					/>

					<CalculatorCard
						icon={<Zap className='size-5' />}
						title='Мощность резистора'
						description='Расчёт рассеиваемой мощности и подбор подходящего номинала мощности резистора.'
						href='/calculators/resistors/power'
					/>

					<CalculatorCard
						icon={<Lightbulb className='size-5' />}
						title='Резистор для светодиода'
						description='Расчёт сопротивления токоограничивающего резистора для светодиода по напряжению питания и рабочему току.'
						href='/calculators/resistors/led'
					/>
				</div>
			</section>

			{/* Информация */}
			<section className='mt-12 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					О калькуляторах резисторов
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Резисторы используются для ограничения тока, деления напряжения,
					задания рабочих режимов электронных схем и выполнения множества других
					задач. При проектировании схемы важно правильно определить
					сопротивление и учитывать допустимое отклонение номинала.
				</p>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Для определения номинала обычного выводного резистора можно
					использовать цветовую маркировку. Цветные полосы обозначают значащие
					цифры, множитель и допустимое отклонение сопротивления.
				</p>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					При соединении нескольких резисторов итоговое сопротивление зависит от
					способа соединения. Для последовательной цепи сопротивления
					складываются, а при параллельном соединении эквивалентное
					сопротивление становится меньше сопротивления самого малого резистора.
				</p>
			</section>
		</main>
	)
}
