import type { Metadata } from 'next'
import Link from 'next/link'

import { getAdminEquipmentList } from '@/server/equipment/admin-queries'

export const metadata: Metadata = {
	title: 'Оборудование — админ-панель'
}

interface EquipmentAdminPageProps {
	searchParams: Promise<{
		q?: string
		page?: string
	}>
}

function getPageHref(page: number, query: string) {
	const params = new URLSearchParams()

	if (query) {
		params.set('q', query)
	}

	params.set('page', String(page))

	return `/admin/equipment?${params.toString()}`
}

export default async function EquipmentAdminPage({
	searchParams
}: EquipmentAdminPageProps) {
	const params = await searchParams
	const query = params.q?.trim() ?? ''
	const requestedPage = Number(params.page ?? '1')
	const page =
		Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

	const result = await getAdminEquipmentList({
		query,
		page,
		pageSize: 20
	})

	const currentPage = Math.min(result.page, Math.max(1, result.totalPages))

	// Если в URL указана страница за пределами списка,
	// показываем последнюю доступную страницу.
	const equipmentItems =
		currentPage === result.page
			? result.items
			: (
					await getAdminEquipmentList({
						query,
						page: currentPage,
						pageSize: 20
					})
				).items

	return (
		<main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<nav className='mb-6 text-sm text-zinc-500'>
				<Link
					href='/admin'
					className='transition hover:text-accent'
				>
					Админ-панель
				</Link>
				<span className='mx-2'>/</span>
				<span className='text-zinc-900 dark:text-zinc-100'>Оборудование</span>
			</nav>

			<header className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-white'>
						Оборудование
					</h1>

					<p className='mt-2 text-sm text-zinc-500'>
						Приборы, модели, характеристики, фотографии и связанные документы.
					</p>
				</div>

				<Link
					href='/admin/equipment/new'
					className='inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90'
				>
					+ Добавить оборудование
				</Link>
			</header>

			<section className='mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900'>
				<form
					action='/admin/equipment'
					method='get'
					className='flex flex-col gap-3 sm:flex-row'
				>
					<input
						type='search'
						name='q'
						defaultValue={query}
						placeholder='Название, модель, производитель или slug'
						aria-label='Поиск оборудования'
						className='min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-accent dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					/>

					<button
						type='submit'
						className='rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900'
					>
						Найти
					</button>

					{query && (
						<Link
							href='/admin/equipment'
							className='inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
						>
							Сбросить
						</Link>
					)}
				</form>
			</section>

			<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<p className='text-sm text-zinc-500'>
					Найдено приборов: {result.total}
				</p>

				<p className='text-sm text-zinc-500'>
					Страница {currentPage} из {Math.max(1, result.totalPages)}
				</p>
			</div>

			{equipmentItems.length === 0 ? (
				<div className='rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700'>
					<h2 className='text-lg font-semibold text-zinc-900 dark:text-white'>
						Оборудование не найдено
					</h2>

					<p className='mt-2 text-sm text-zinc-500'>
						{query
							? 'Попробуйте изменить поисковый запрос.'
							: 'Добавьте первый прибор в каталог.'}
					</p>

					{!query && (
						<Link
							href='/admin/equipment/new'
							className='mt-5 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90'
						>
							Добавить оборудование
						</Link>
					)}
				</div>
			) : (
				<div className='overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-212.5 text-left text-sm'>
							<thead className='border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950'>
								<tr>
									<th className='px-5 py-4 font-medium'>Прибор</th>
									<th className='px-5 py-4 font-medium'>Производитель</th>
									<th className='px-5 py-4 font-medium'>Фотографии</th>
									<th className='px-5 py-4 font-medium'>Параметры</th>
									<th className='px-5 py-4 font-medium'>Документы</th>
									<th className='px-5 py-4 text-right font-medium'>Действия</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
								{equipmentItems.map(item => (
									<tr
										key={item.id.toString()}
										className='transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
									>
										<td className='px-5 py-4'>
											<p className='font-semibold text-zinc-900 dark:text-white'>
												{item.title}
											</p>

											{item.model && (
												<p className='mt-1 text-zinc-500'>
													Модель: {item.model}
												</p>
											)}

											<p className='mt-1 text-xs text-zinc-400'>{item.slug}</p>
										</td>

										<td className='px-5 py-4 text-zinc-600 dark:text-zinc-300'>
											{item.brandName ?? 'Не указан'}
										</td>

										<td className='px-5 py-4'>
											<span>{item.imageCount}</span>
											{item.imageCount > 0 && (
												<span
													className={
														item.hasPrimaryImage
															? 'ml-2 text-xs text-emerald-600'
															: 'ml-2 text-xs text-amber-600'
													}
												>
													{item.hasPrimaryImage
														? 'Главное фото задано'
														: 'Нет главного фото'}
												</span>
											)}
										</td>

										<td className='px-5 py-4'>{item.parameterCount}</td>

										<td className='px-5 py-4'>{item.documentationCount}</td>

										<td className='px-5 py-4 text-right'>
											<Link
												href={`/admin/equipment/${item.id.toString()}`}
												className='font-medium text-accent hover:underline'
											>
												Редактировать
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{result.totalPages > 1 && (
				<nav
					aria-label='Страницы оборудования'
					className='mt-6 flex items-center justify-between gap-4'
				>
					{currentPage > 1 ? (
						<Link
							href={getPageHref(currentPage - 1, query)}
							className='rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
						>
							← Назад
						</Link>
					) : (
						<span className='text-sm text-zinc-400'>← Назад</span>
					)}

					<span className='text-sm text-zinc-500'>
						{currentPage} / {result.totalPages}
					</span>

					{currentPage < result.totalPages ? (
						<Link
							href={getPageHref(currentPage + 1, query)}
							className='rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
						>
							Далее →
						</Link>
					) : (
						<span className='text-sm text-zinc-400'>Далее →</span>
					)}
				</nav>
			)}
		</main>
	)
}
