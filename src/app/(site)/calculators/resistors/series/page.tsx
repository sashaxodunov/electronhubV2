import Breadcrumbs from '@/components/navigation/breadcrumbs'
import ResistorSeriesCalculator from '@/components/calculators/resistor-series-calculator'

export default function ResistorSeriesPage() {
	return (


			<main className='pb-20 pt-8'>
							<Breadcrumbs />
				<section className='mb-10'>
					<div className='max-w-3xl'>
						<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
							КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
						</span>

						<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
							Последовательное соединение резисторов
						</h1>

						<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
							Рассчитайте общее сопротивление цепи при последовательном
							соединении двух и более резисторов.
						</p>
					</div>
				</section>

				<ResistorSeriesCalculator />

				<section className='mt-10 max-w-4xl'>
					<h2 className='text-2xl font-bold text-white'>
						Последовательное соединение
					</h2>

					<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
						При последовательном соединении резисторы соединяются друг за другом
						в одной электрической цепи. Через каждый резистор протекает один и
						тот же ток.
					</p>

					<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
						Общее сопротивление такой цепи равно сумме сопротивлений всех
						последовательно соединённых резисторов.
					</p>
				</section>
			</main>
	)
}
