export default function DocumentationLoading() {
	return (
		<main
			className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'
			aria-busy='true'
			aria-label='Загрузка документации'
		>
			<div className='mb-10 animate-pulse'>
				<div className='h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800' />

				<div className='mt-6 h-10 max-w-lg rounded bg-zinc-200 dark:bg-zinc-800' />

				<div className='mt-4 h-4 max-w-2xl rounded bg-zinc-200 dark:bg-zinc-800' />
			</div>

			<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: 6 }, (_, index) => (
					<div
						key={index}
						className='animate-pulse rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800'
					>
						<div className='h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800' />

						<div className='mt-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800' />

						<div className='mt-2 h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800' />

						<div className='mt-6 h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800' />
					</div>
				))}
			</div>
		</main>
	)
}
