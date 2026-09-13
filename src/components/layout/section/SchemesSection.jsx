import Image from 'next/image'
import Link from 'next/link'

const schemes = [
	['Усилители и аудиотехника', 'program-01.jpg'],
	['Радио-приёмники и передатчики', 'program-02.jpg'],
	['Источники питания', 'program-03.jpg'],
	['Свет и индикаторы', 'program-04.jpg'],
	['Связь и беспроводные системы', 'program-05.jpg'],
	['Измерительная техника', 'program-06.jpg'],
	['Цифровая электроника', 'program-07.jpg'],
	['Аналоговая электроника', 'program-08.jpg']
]

export default function SchemesSection() {
	return (
		<section className='mx-auto w-full max-w-300 mt-37.5'>
			<div className='mx-auto w-full max-w-200 text-center'>
				<header>
					<h2 className='my-6 text-accent text-h2 font-bold	font-bebas leading-18 tracking-tight'>
						Полезные схемы
					</h2>

					<p className='mt-20 text-bebas font-light	leading-loose	text-white'>
						Готовые электронные схемы для любых проектов — от простых
						светодиодных индикаторов до сложных источников питания и усилителей.
						Каждая схема сопровождается подробными пояснениями и практическими
						советами по сборке и выбору компонентов.
					</p>

					<p className='text-bebas font-light	leading-loose	text-white'>
						Раздел будет полезен как начинающим радиолюбителям, изучающим основы
						электроники, так и опытным инженерам, ищущим готовые решения или
						вдохновение для собственных разработок.
					</p>
				</header>
			</div>

			<div className='mt-10	grid	grid-cols-4	gap-x-7.5	gap-y-8.75	max-[800px]:grid-cols-3	max-[600px]:grid-cols-2	max-[400px]:mx-auto	max-[400px]:grid-cols-1	max-[400px]:gap-x-5	max-[400px]:gap-y-6.25'>
				{schemes.map(([title, image], index) => (
					<Link
						key={title}
						href={`/schemes/${index + 1}`}
						className='group	relative	block	w-full	max-w-65	max-h-87.5	overflow-hidden	rounded-[20px]	shadow-[0_4px_15px_0_rgba(0,0,0,0.2)]	max-[600px]:rounded-m'
					>
						{/* Затемнение карточки */}
						<div className='pointer-events-none	absolute	inset-0	z-10	bg-linear-to-b	from-transparent	to-black	opacity-0	transition-opacity	duration-200	ease-in	group-hover:opacity-100	[@media(hover:none)_and_(pointer:coarse)]:opacity-100' />

						{/* Название */}
						<h3 className='pointer-events-none	absolute	left-1/2	top-[60%]	z-20	w-[90%]	-translate-x-1/2	-translate-y-1/2	text-center	font-bebas	text-[30px]	font-bold	leading-tight	text-white	opacity-0	transition-all	duration-200	ease-in	group-hover:top-1/2	group-hover:opacity-100	max-[800px]:text-[32px]	[@media(hover:none)_and_(pointer:coarse)]:top-1/2	[@media(hover:none)_and_(pointer:coarse)]:opacity-100'>
							{title}
						</h3>

						<Image
							src={`/images/home/scheme/${image}`}
							alt={title}
							width={260}
							height={300}
							className='h-full w-full object-cover'
						/>
					</Link>
				))}
			</div>
		</section>
	)
}
