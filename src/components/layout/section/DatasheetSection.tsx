import Image from 'next/image'
import Link from 'next/link'
import { datasheetCategories } from '@/config/categories'

export default function DatasheetSection() {
	return (
		<section
			aria-labelledby='datasheet-title'
			lang='ru'
			className='mx-auto w-full max-w-300 px-4 py-12 sm:py-16 lg:py-20'
		>
			<header className='mx-auto mb-8 w-full max-w-200 text-center sm:mb-10 lg:mb-14'>
				<h2
					id='datasheet-title'
					className='
						font-bebas text-4xl font-bold uppercase
						leading-tight tracking-tight text-accent
						sm:text-5xl lg:text-6xl xl:text-7xl
					'
				>
					Datasheet
				</h2>

				<p
					className='
						mt-5 font-manrope text-sm leading-relaxed text-white/90
						sm:mt-6 sm:text-base
						lg:mt-8 lg:text-lg
					'
				>
					Datasheet — техническая документация электронного компонента. Она
					содержит сведения о его параметрах, характеристиках, назначении,
					схемах подключения и особенностях применения.
				</p>
			</header>

			{/* Категории */}
			<ul
				className='grid grid-cols-1 gap-4	min-[400px]:grid-cols-2	sm:gap-6
					md:grid-cols-3	lg:grid-cols-4 xl:grid-cols-5'
			>
				{datasheetCategories.map(category => (
					<li
						key={category.slug}
						className='min-w-0'
					>
						<Link
							href={`/components/${category.slug}`}
							className='group relative isolate mx-auto block	aspect-3/4 w-full max-w-80 overflow-hidden rounded-2xl bg-neutral-900	shadow-[0_4px_15px_rgba(0,0,0,0.2)]	focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent	min-[400px]:max-w-none sm:rounded-[20px]'
						>
							<Image
								src={category.image}
								alt={category.title}
								fill
								sizes='(min-width: 1280px) 215px,	(min-width: 1024px) calc((100vw - 104px) / 4), (min-width: 768px) calc((100vw - 80px) / 3),	(min-width: 640px) calc((100vw - 56px) / 2), (min-width: 400px) calc((100vw - 48px) / 2),	(min-width: 352px) 320px,	calc(100vw - 32px)'
								className='object-cover transition-transform duration-500 ease-out	group-hover:scale-105	group-focus-visible:scale-105	motion-reduce:transform-none	motion-reduce:transition-none'
							/>

							{/* Затемнение при наведении и клавиатурном фокусе */}
							<span
								aria-hidden='true'
								className='pointer-events-none absolute inset-0	bg-linear-to-b from-black/20 via-black/60 to-black/90	opacity-0 transition-opacity duration-300	group-hover:opacity-100	group-focus-visible:opacity-100	[@media(hover:none)]:opacity-100	motion-reduce:transition-none'
							/>

							{/* Название плавно появляется и поднимается к центру */}
							<h3 className='pointer-events-none absolute inset-x-0 top-1/2 z-10	translate-y-0 px-3	text-center font-roboto text-lg font-bold uppercase	leading-snug text-white	hyphens-auto wrap-anywhere	opacity-0	transition-[opacity,translate] duration-300 ease-out	group-hover:-translate-y-1/2	group-hover:opacity-100	group-focus-visible:-translate-y-1/2	group-focus-visible:opacity-100	[@media(hover:none)]:-translate-y-1/2	[@media(hover:none)]:opacity-100	motion-reduce:transition-none	sm:px-4 sm:text-xl lg:text-2xl'>
								{category.title}
							</h3>
						</Link>
					</li>
				))}
			</ul>

			{/* Полный каталог */}
			<div className='mt-8 flex justify-center sm:mt-10 lg:mt-14'>
				<Link
					href='/datasheets'
					className='
						group inline-flex min-h-12 w-full
						items-center justify-center gap-3
						rounded-full border border-accent
						px-6 py-3
						text-center font-roboto text-sm font-bold
						uppercase tracking-wide text-accent
						transition-colors duration-200
						hover:bg-accent hover:text-background
						focus-visible:outline-2
						focus-visible:outline-offset-4
						focus-visible:outline-accent
						motion-reduce:transition-none
						sm:w-auto sm:px-8
					'
				>
					<span>Архив Datasheets</span>

					<span
						aria-hidden='true'
						className='
							shrink-0 transition-transform duration-200
							group-hover:translate-x-1
							group-focus-visible:translate-x-1
							motion-reduce:transform-none
							motion-reduce:transition-none
						'
					>
						→
					</span>
				</Link>
			</div>
		</section>
	)
}
