import VoltageDividerCalculator from '@/components/calculators/voltage-divider-calculator'
import Breadcrumbs from '@/components/navigation/breadcrumbs'

export default function VoltageDividerPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Делитель напряжения
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Рассчитайте выходное напряжение резистивного делителя по входному
						напряжению и сопротивлениям R1 и R2.
					</p>
				</div>
			</section>

			<VoltageDividerCalculator />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Как работает делитель напряжения
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Делитель напряжения состоит из двух последовательно соединённых
					резисторов. Входное напряжение Vin прикладывается ко всей цепочке, а
					выходное напряжение Vout снимается с точки между R1 и R2.
				</p>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Если сопротивления R1 и R2 одинаковы, выходное напряжение составляет
					половину входного. Увеличение R2 относительно R1 повышает Vout, а
					уменьшение R2 снижает его.
				</p>

				<div className='mt-6 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Формула</p>

					<p className='mt-3 font-mono text-base text-[#d0ae68]'>
						Vout = Vin × R2 / (R1 + R2)
					</p>
				</div>

				<div className='mt-4 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Важно</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Формула предполагает, что нагрузка на выходе делителя отсутствует
						или её сопротивление значительно больше R2. При подключении
						низкоомной нагрузки фактическое выходное напряжение будет отличаться
						от расчётного.
					</p>
				</div>
			</section>
		</main>
	)
}
