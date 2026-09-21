export default function AdminHeader() {
	return (
		<header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/90 lg:px-8'>
			<div>
				<h1 className='text-sm font-semibold'>Панель управления</h1>
				<p className='hidden text-xs text-zinc-500 sm:block'>
					Управление каталогом электронных компонентов
				</p>
			</div>

			<div className='flex items-center gap-3'>
				<div className='hidden text-right sm:block'>
					<p className='text-sm font-medium'>Администратор</p>
					<p className='text-xs text-zinc-500'>Admin</p>
				</div>

				<div className='flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900'>
					A
				</div>
			</div>
		</header>
	)
}
