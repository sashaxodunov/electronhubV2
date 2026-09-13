import Image from 'next/image'
import Link from 'next/link'

import { documentationCategories } from '@/config/categories'

export default function DocumentationSection() {
	return (
		<section className='mx-auto max-w-300 w-full mt-30'>
			<div className='mx-auto w-full'>
				<header className='mx-auto mb-10 w-full max-w-200 text-center'>
					<h2 className='my-6 text-accent text-h2 font-bold	font-bebas leading-18 tracking-tight'>
						Принципиальные схемы
					</h2>

					<p className='mt-20 text-bebas font-light	leading-loose	text-white'>
						Документ, который объединяет в себе технические характеристики
						продукта, материала, компонента или подсистемы. Техническая
						спецификация, карта данных — документ, который объединяет в себе
						технические характеристики электронного компонента.
					</p>
				</header>

				<div className='grid grid-cols-4 gap-x-7.5 gap-y-8.75 max-[800px]:grid-cols-3 max-[800px]:gap-x-7.5 max-[800px]:gap-y-7.5 max-[600px]:grid-cols-2 max-[600px]:gap-x-7.5 max-[600px]:gap-y-7.5 max-[400px]:mx-auto max-[400px]:grid-cols-1'>
					{documentationCategories.map(({ title, image }, index) => (
						<Link
							key={title}
							href={`/documentation/${index + 1}`}
							className='group relative block h-100 max-w-65 overflow-hidden rounded-[20px] shadow-[0_4px_15px_0_rgba(0,0,0,0.2)] max-[800px]:max-w-full max-[600px]:rounded-m max-[400px]:h-auto max-[400px]:max-w-full'
						>
							<span className='pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-transparent to-black opacity-0 transition-opacity duration-200 ease-in group-hover:opacity-100 max-[800px]:text-[32px] [@media(hover:none)_and_(pointer:coarse)]:opacity-100' />

							<h3 className='absolute left-1/2 top-[60%] z-20 w-[90%] -translate-x-1/2 -translate-y-1/2 text-center font-accent text-[30px] font-bold text-white opacity-0 transition-all duration-200 ease-in group-hover:top-1/2 group-hover:opacity-100 max-[800px]:text-[32px] [@media(hover:none)_and_(pointer:coarse)]:top-1/2 [@media(hover:none)_and_(pointer:coarse)]:opacity-100'>
								{title}
							</h3>

							<Image
								src={`${image}`}
								alt={title}
								width={260}
								height={300}
								className='h-full w-full object-cover'
							/>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}
