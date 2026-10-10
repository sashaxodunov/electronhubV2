import ResistorPowerCalculator from '@/components/calculators/resistor-power-calculator'
import Breadcrumbs from '@/components/navigation/breadcrumbs'

export default function ResistorPowerPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Мощность резистора
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Рассчитайте мощность, рассеиваемую резистором, по напряжению, току и
						сопротивлению и определите подходящую номинальную мощность
						резистора.
					</p>
				</div>
			</section>

			<ResistorPowerCalculator />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Как рассчитать мощность резистора
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Мощность показывает, сколько электрической энергии преобразуется
					резистором в тепло. Для постоянного тока её можно рассчитать по
					напряжению и току:
				</p>

				<div className='mt-5 rounded-xl border border-border bg-background-light p-5'>
					<p className='font-mono text-base text-[#d0ae68]'>P = U × I</p>

					<p className='mt-3 font-mono text-base text-[#d0ae68]'>P = I² × R</p>

					<p className='mt-3 font-mono text-base text-[#d0ae68]'>P = U² / R</p>
				</div>

				<h2 className='mt-10 text-2xl font-bold text-white'>
					Как выбрать мощность резистора
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Номинальная мощность резистора должна быть выше фактически
					рассеиваемой мощности. В калькуляторе можно задать запас, после чего
					выбирается ближайший стандартный номинал мощности.
				</p>

				<div className='mt-6 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Пример</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Если резистор рассеивает 0,6 Вт, использовать резистор на 0,25 Вт
						нельзя. При запасе 2× расчётная мощность составит 1,2 Вт, поэтому
						следующим стандартным номиналом будет резистор на 2 Вт.
					</p>
				</div>

				<div className='mt-4 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Важно</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Расчёт относится к постоянному току и не учитывает дополнительные
						ограничения конкретного резистора: максимальное рабочее напряжение,
						температурный режим, импульсную нагрузку и условия охлаждения.
					</p>
				</div>
			</section>
		</main>
	)
}
