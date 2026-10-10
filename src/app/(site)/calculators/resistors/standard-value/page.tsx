import Breadcrumbs from '@/components/navigation/breadcrumbs'
import ResistorStandardValueCalculator from '@/components/calculators/resistor-standard-value-calculator'

export default function ResistorStandardValuePage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Стандартные номиналы резисторов
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Найдите ближайший стандартный номинал резистора по рядам E6, E12,
						E24, E48 и E96.
					</p>
				</div>
			</section>

			<ResistorStandardValueCalculator />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Стандартные ряды номиналов
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Номиналы резисторов выпускаются не для каждого возможного значения
					сопротивления. Для этого используются стандартные ряды E. Число после
					буквы E показывает количество базовых номиналов в одном декадном
					диапазоне.
				</p>

				<div className='mt-6 overflow-x-auto rounded-xl border border-border bg-background-light'>
					<table className='w-full min-w-140 border-collapse text-sm'>
						<thead>
							<tr className='border-b border-border text-left'>
								<th className='px-4 py-3 font-semibold text-white'>Ряд</th>
								<th className='px-4 py-3 font-semibold text-white'>
									Номиналов на декаду
								</th>
								<th className='px-4 py-3 font-semibold text-white'>
									Типичное применение
								</th>
							</tr>
						</thead>

						<tbody>
							<tr className='border-b border-border/70'>
								<td className='px-4 py-3 font-semibold text-white'>E6</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>6</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>Большие допуски</td>
							</tr>

							<tr className='border-b border-border/70'>
								<td className='px-4 py-3 font-semibold text-white'>E12</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>12</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>
									Универсальное применение
								</td>
							</tr>

							<tr className='border-b border-border/70'>
								<td className='px-4 py-3 font-semibold text-white'>E24</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>24</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>
									Точные стандартные резисторы
								</td>
							</tr>

							<tr className='border-b border-border/70'>
								<td className='px-4 py-3 font-semibold text-white'>E48</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>48</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>
									Повышенная точность
								</td>
							</tr>

							<tr>
								<td className='px-4 py-3 font-semibold text-white'>E96</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>96</td>
								<td className='px-4 py-3 text-[#aeb7bd]'>
									Высокоточные резисторы
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</main>
	)
}
