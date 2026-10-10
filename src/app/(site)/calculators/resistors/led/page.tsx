import LedResistorCalculator from '@/components/calculators/led-resistor-calculator'
import Breadcrumbs from '@/components/navigation/breadcrumbs'

export default function LedResistorPage() {
	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Резистор для светодиода
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Рассчитайте ограничительный резистор для светодиода по напряжению
						питания, прямому напряжению и требуемому току.
					</p>
				</div>
			</section>

			<LedResistorCalculator />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Как рассчитать резистор для светодиода
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					При подключении светодиода непосредственно к источнику питания ток
					может оказаться слишком большим. Последовательно со светодиодом
					устанавливают ограничительный резистор.
				</p>

				<div className='mt-5 rounded-xl border border-border bg-background-light p-5'>
					<p className='font-mono text-base text-[#d0ae68]'>
						R = (Uпит − ULED) / ILED
					</p>
				</div>

				<p className='mt-5 text-[15px] leading-7 text-[#aeb7bd]'>
					После расчёта следует выбрать стандартный номинал сопротивления. Если
					между двумя стандартными значениями находится расчётное сопротивление,
					выбирают номинал, обеспечивающий необходимый ток и не превышающий
					допустимый ток светодиода.
				</p>

				<h2 className='mt-10 text-2xl font-bold text-white'>
					Мощность резистора
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Часть электрической мощности преобразуется резистором в тепло. Для
					выбранного номинала необходимо проверить мощность рассеяния:
				</p>

				<div className='mt-5 rounded-xl border border-border bg-background-light p-5'>
					<p className='font-mono text-base text-[#d0ae68]'>P = I² × R</p>
				</div>

				<div className='mt-6 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Пример</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Для источника 12 В, красного светодиода с прямым напряжением 2 В и
						тока 20 мА расчётное сопротивление составляет 500 Ом. Ближайший
						больший номинал — 510 Ом. При таком сопротивлении ток будет около
						19,6 мА.
					</p>
				</div>

				<div className='mt-4 rounded-xl border border-border bg-background-light p-5'>
					<p className='text-sm font-semibold text-white'>Важно</p>

					<p className='mt-2 text-sm leading-6 text-[#aeb7bd]'>
						Прямое напряжение и допустимый ток зависят от конкретного
						светодиода. Для точного расчёта используйте параметры из его
						документации.
					</p>
				</div>
			</section>
		</main>
	)
}
