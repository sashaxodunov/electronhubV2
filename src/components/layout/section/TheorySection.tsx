import Link from 'next/link'

export default function TheorySection() {
	return (
		<section
			aria-labelledby='theory-title'
			className="
				relative isolate flex max-h-100 items-center
				bg-[url('/images/home/theory/theory.jpg')]
				bg-cover bg-position-[center_bottom] bg-no-repeat
				py-20 my-20
			"
		>
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-0 -z-10 bg-black/60'
			/>

			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto flex w-full max-w-200 flex-col items-center text-center'>
					<header className='w-full'>
						<h2
							id='theory-title'
							className='
								font-bebas text-4xl font-bold uppercase
								leading-tight tracking-tight text-accent
								sm:text-5xl lg:text-6xl xl:text-7xl
							'
						>
							Теория по электронике
						</h2>

						<p
							className='
								mt-5 font-manrope text-sm leading-relaxed text-white
								sm:mt-6 sm:text-base
								lg:mt-8 lg:text-lg
							'
						>
							Изучайте основы электроники, законы и принципы работы электронных
							устройств и систем. В разделе собраны материалы об электрических
							цепях, электронных компонентах, аналоговой и цифровой
							схемотехнике, а также практические объяснения и примеры, которые
							помогут разобраться в устройстве и принципах работы современной
							электроники.
						</p>
					</header>

					<Link
						href='/theory'
						className='
							mt-8 inline-flex min-h-12 w-full items-center justify-center
							rounded-sm border-2 border-accent bg-accent
							px-6 py-4
							font-manrope text-sm font-bold uppercase
							leading-normal tracking-[0.16em] text-black
							transition-colors duration-200
							hover:bg-black/30 hover:text-accent
							focus-visible:outline-2 focus-visible:outline-offset-4
							focus-visible:outline-white
							motion-reduce:transition-none
							sm:mt-10 sm:w-auto sm:px-8
							sm:text-base sm:tracking-[0.22em]
							lg:mt-12
						'
					>
						Почитать
						<span className='sr-only'> теорию по электронике</span>
					</Link>
				</div>
			</div>
		</section>
	)
}
