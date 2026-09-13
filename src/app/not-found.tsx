import Link from 'next/link';


export default function NotFound() {
	return (
		<main className="flex flex-col min-h-[60vh] items-center justify-center bg-amber-200">
			<div className="flex flex-col items-center gap-4 text-center">
				<h1 className='text-6xl font-black text-zinc-400 mb-4
				'>404</h1>

				<h2 className='text-2xl font-semibold text-zinc-600'>Страница не найдена</h2>

				<p className='text-zinc-500 text-lg max-w-sm'>
					К сожалению, запрашиваемая страница не существует
					или была перемещена.
				</p>

				<Link
					href="/"
					className='inline-flex items-center justify-center rounded-full bg-zinc-700 px-6 py-3 font-medium text-white transition-all hover:bg-zinc-800'
				>
					Вернуться на главную
				</Link>
			</div>
		</main>
	);
}