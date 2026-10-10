import Breadcrumbs from '@/components/navigation/breadcrumbs'
import ResistorColorCodeCalculator from '@/components/calculators/resistor-color-code-calculator'
import ResistorColorCodeTable from '@/components/calculators/resistor-color-code-table'

type ResistorColorCodePageProps = {
	searchParams: Promise<{
		resistance?: string
	}>
}

export default async function ResistorColorCodePage({
	searchParams
}: ResistorColorCodePageProps) {
	const params = await searchParams

	const resistance = params.resistance ?? ''

	return (
		<main className='pb-20 pt-8'>
			<Breadcrumbs />
			<section className='mb-10'>
				<div className='max-w-3xl'>
					<span className='mb-4 inline-block text-xs font-bold tracking-[1.5px] text-accent'>
						КАЛЬКУЛЯТОРЫ · РЕЗИСТОРЫ
					</span>

					<h1 className='text-4xl font-bold leading-tight tracking-[-1px] text-white md:text-5xl'>
						Цветовая маркировка резисторов
					</h1>

					<p className='mt-5 max-w-2xl text-base leading-7 text-[#aeb7bd] md:text-lg'>
						Определите номинал сопротивления, допуск и температурный коэффициент
						резистора по цветным полосам.
					</p>
				</div>
			</section>

			<ResistorColorCodeCalculator initialResistance={resistance} />

			<ResistorColorCodeTable />

			<section className='mt-10 max-w-4xl'>
				<h2 className='text-2xl font-bold text-white'>
					Как определить сопротивление по цветным полосам
				</h2>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					Цветовая маркировка позволяет определить номинальное сопротивление
					резистора без измерительного прибора. Цвет каждой полосы соответствует
					определённой цифре, множителю или допуску.
				</p>

				<p className='mt-4 text-[15px] leading-7 text-[#aeb7bd]'>
					У четырёхполосного резистора первые две полосы задают значащие цифры,
					третья определяет множитель, а четвёртая — допуск. У пятиполосного
					резистора используются три значащие цифры.
				</p>
			</section>
		</main>
	)
}
