import Button from '@/components/ui/button'
import Link from 'next/link'

export default function CalculatorSection() {
	return (
		<section className="flex h-112.5	my-30	items-center bg-[url('/images/home/calculator/bg-calculator.jpeg')] bg-cover	bg-position-[center_bottom]	bg-no-repeat [clip-path:polygon(0_10%,100%_0%,100%_90%,0_100%)]	min-[601px]:h-137.5	min-[601px]:py-25		min-[801px]:h-162.5	min-[1201px]:h-187.5">
			<div className='mx-auto w-full max-w-300'>
				<div>
					<h2 className='mb-6 text-accent text-h2 font-bold	font-bebas font-weight-700 font-stretch-70%'>
						Онлайн калькуляторы
					</h2>

					<div className='text-bebas font-light	leading-loose	text-white py-7.5'>
						<p>
							Быстро и точно! Введите данные — получите результат за секунды.
							Математика, инженерные расчёты, электроника — всё в одном удобном
							онлайн-инструменте без установки программ.
						</p>
					</div>

					<Button>
						<Link
							href='/calculators'
							className='inline-block	px-7.5 py-3.75 font-manrope	text-[19px]	font-bold tracking-[0.26em]	leading-none transition-colors duration-200	ease-in	button'
						>
							ПОСЧИТАТЬ
						</Link>
					</Button>
				</div>
			</div>
		</section>
	)
}
