import Link from 'next/link'

import { count } from 'drizzle-orm'

import {
	ArrowRight,
	Boxes,
	Building2,
	CircuitBoard,
	FileText,
	Layers3,
	Workflow,
	Trash2
} from 'lucide-react'

import { db } from '@/db'

import {
	applications,
	categories,
	components,
	datasheets,
	datasheetStorageCleanup,
	manufacturers,
	packages
} from '@/db/schema'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
	const [
		[componentsCount],
		[manufacturersCount],
		[categoriesCount],
		[packagesCount],
		[applicationsCount],
		[datasheetsCount],
		[cleanupCount]
	] = await Promise.all([
		db.select({ value: count() }).from(components),
		db.select({ value: count() }).from(manufacturers),
		db.select({ value: count() }).from(categories),
		db.select({ value: count() }).from(packages),
		db.select({ value: count() }).from(applications),
		db.select({ value: count() }).from(datasheets),
		db.select({ value: count() }).from(datasheetStorageCleanup)
	])

	const stats = [
		{
			title: 'Компоненты',
			value: componentsCount.value,
			description: 'Всего компонентов',
			href: '/admin/components',
			icon: CircuitBoard
		},
		{
			title: 'Производители',
			value: manufacturersCount.value,
			description: 'Всего производителей',
			href: '/admin/manufacturers',
			icon: Building2
		},
		{
			title: 'Категории',
			value: categoriesCount.value,
			description: 'Категорий каталога',
			href: '/admin/categories',
			icon: Layers3
		},
		{
			title: 'Корпуса',
			value: packagesCount.value,
			description: 'Типов корпусов',
			href: '/admin/packages',
			icon: Boxes
		},
		{
			title: 'Области применения',
			value: applicationsCount.value,
			description: 'Записей в справочнике',
			href: '/admin/applications',
			icon: Workflow
		},
		{
			title: 'PDF-документы',
			value: datasheetsCount.value,
			description: 'Даташиты и документация компонентов',
			href: '/admin/components',
			icon: FileText
		},
		{
			title: 'Очередь очистки S3',
			value: cleanupCount.value,
			description: 'Файлы, ожидающие удаления или повтора',
			href: '/admin/storage-cleanup',
			icon: Trash2
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
		},
		{
			title: 'Добавить область применения',
			description: 'Например, источники питания или усилители',
			href: '/admin/applications/new'
		},
		{
			title: 'Добавить PDF-документ',
			description: 'Открыть компонент и загрузить даташит в его карточке',
			href: '/admin/components'
		},
		{
			title: 'Проверить удаление файлов',
			description:
				'Посмотреть очередь очистки S3 и повторить неудачные операции',
			href: '/admin/storage-cleanup'
		}
	]

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
					{stats.map(stat => {
						const Icon = stat.icon

						return (
							<Link
								key={stat.title}
								href={stat.href}
								className='group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
							>
								<div className='flex items-center justify-between gap-3'>
									<p className='text-sm font-medium text-zinc-500'>
										{stat.title}
									</p>

									<Icon
										size={20}
										className='shrink-0 text-zinc-400 transition group-hover:text-amber-500'
									/>
								</div>

								<p className='mt-3 text-3xl font-bold tracking-tight'>
									{stat.value.toLocaleString('ru-RU')}
								</p>

								<p className='mt-1 text-xs text-zinc-500'>{stat.description}</p>
							</Link>
						)
					})}
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
						<Link
							key={action.href + action.title}
							href={action.href}
							className='group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
						>
							<div className='flex items-center justify-between gap-4'>
								<div>
									<h3 className='font-medium'>{action.title}</h3>

									<p className='mt-1 text-sm text-zinc-500'>
										{action.description}
									</p>
								</div>

								<ArrowRight
									size={18}
									className='shrink-0 text-zinc-400 transition group-hover:translate-x-1'
								/>
							</div>
						</Link>
					))}
				</div>
			</section>

			<section>
				<div className='rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900'>
					<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800'>
						◈
					</div>

					<h2 className='mt-4 font-semibold'>
						Статистика загружается из PostgreSQL
					</h2>

					<p className='mx-auto mt-2 max-w-lg text-sm text-zinc-500'>
						Числа обновляются при загрузке страницы и отражают количество
						записей в соответствующих таблицах базы данных. Количество PDF
						показывает записи в таблице документов, а не число файлов,
						фактически доступных в S3.
					</p>
				</div>
			</section>
		</div>
	)
}
