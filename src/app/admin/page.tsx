const stats = [
	{
		title: 'Компоненты',
		value: '0',
		description: 'Всего компонентов',
		href: '/admin/components'
	},
	{
		title: 'Производители',
		value: '0',
		description: 'Активных производителей',
		href: '/admin/manufacturers'
	},
	{
		title: 'Категории',
		value: '0',
		description: 'Категорий каталога',
		href: '/admin/categories'
	},
	{
		title: 'Корпуса',
		value: '0',
		description: 'Типов корпусов',
		href: '/admin/packages'
	}
]

const quickActions = [
	{
		title: 'Добавить компонент',
		description: 'Создать новую карточку компонента',
		href: '/admin/components/new'
	},
	{
		title: 'Добавить производителя',
		description: 'Добавить производителя в каталог',
		href: '/admin/manufacturers/new'
	},
	{
		title: 'Добавить категорию',
		description: 'Создать категорию компонентов',
		href: '/admin/categories/new'
	},
	{
		title: 'Добавить корпус',
		description: 'Создать тип корпуса',
		href: '/admin/packages/new'
	}
]

export default function AdminPage() {
	return (
		<div className='space-y-8'>
			<section>
				<div className='mb-6'>
					<h2 className='text-2xl font-bold tracking-tight'>Обзор каталога</h2>

					<p className='mt-1 text-sm text-zinc-500'>
						Управляйте данными электронной компонентной базы.
					</p>
				</div>

				<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
					{stats.map(stat => (
						<a
							key={stat.title}
							href={stat.href}
							className='group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
						>
							<p className='text-sm font-medium text-zinc-500'>{stat.title}</p>

							<p className='mt-3 text-3xl font-bold tracking-tight'>
								{stat.value}
							</p>

							<p className='mt-1 text-xs text-zinc-500'>{stat.description}</p>
						</a>
					))}
				</div>
			</section>

			<section>
				<div className='mb-4'>
					<h2 className='text-lg font-semibold'>Быстрые действия</h2>

					<p className='text-sm text-zinc-500'>
						Быстро добавьте новые данные в каталог.
					</p>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					{quickActions.map(action => (
						<a
							key={action.href}
							href={action.href}
							className='group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
						>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium'>{action.title}</h3>

									<p className='mt-1 text-sm text-zinc-500'>
										{action.description}
									</p>
								</div>

								<span className='text-lg text-zinc-400 transition group-hover:translate-x-1'>
									→
								</span>
							</div>
						</a>
					))}
				</div>
			</section>

			<section>
				<div className='rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900'>
					<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800'>
						◈
					</div>

					<h2 className='mt-4 font-semibold'>
						База данных готова к наполнению
					</h2>

					<p className='mx-auto mt-2 max-w-lg text-sm text-zinc-500'>
						После подключения Drizzle данные на этой странице будут загружаться
						непосредственно из PostgreSQL.
					</p>
				</div>
			</section>
		</div>
	)
}
