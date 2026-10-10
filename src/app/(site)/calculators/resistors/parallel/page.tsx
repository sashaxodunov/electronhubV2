import ResistorParallelCalculator from '@/components/calculators/resistor-parallel-calculator'
import Breadcrumbs from '@/components/navigation/breadcrumbs'

export default function ResistorParallelPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Параллельное соединение резисторов
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Рассчитайте общее сопротивление цепи при параллельном соединении
						двух и более резисторов.
					</p>
				</div>
			</section>

			<ResistorParallelCalculator />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Параллельное соединение
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					При параллельном соединении резисторы подключаются между двумя общими
					узлами. Напряжение на всех ветвях одинаковое, а ток распределяется
					между ветвями.
				</p>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Общее сопротивление определяется через сумму обратных величин
					сопротивлений отдельных резисторов.
				</p>

				<div className='mt-6 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Важное свойство</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Эквивалентное сопротивление параллельной цепи всегда меньше
						сопротивления самого малого резистора в этой цепи.
					</p>
				</div>
			</section>
		</main>
	)
}
