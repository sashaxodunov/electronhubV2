import Link from 'next/link'
import { asc, countDistinct, eq, ilike, or } from 'drizzle-orm'
import { ArrowRight, Plus, Search } from 'lucide-react'

import { db } from '@/db'
import {
	categories,
	componentSeries,
	components,
	manufacturers
} from '@/db/schema'

type Props = {
	searchParams: Promise<{
		q?: string
	}>
}

export default async function ComponentSeriesPage({ searchParams }: Props) {
	const { q } = await searchParams

	const search = q?.trim() ?? ''

	const rows = await db
		.select({
			id: componentSeries.id,
			name: componentSeries.name,
			slug: componentSeries.slug,
			description: componentSeries.description,
			isActive: componentSeries.isActive,

			manufacturerId: componentSeries.manufacturerId,
			manufacturerName: manufacturers.name,

			categoryId: componentSeries.categoryId,
			categoryName: categories.name,

			// DISTINCT нужен, чтобы количество компонентов
			// не завышалось из-за JOIN производителей и категорий.
			componentCount: countDistinct(components.id)
		})
		.from(componentSeries)
		.leftJoin(
			manufacturers,
			eq(componentSeries.manufacturerId, manufacturers.id)
		)
		.leftJoin(categories, eq(componentSeries.categoryId, categories.id))
		.leftJoin(components, eq(components.seriesId, componentSeries.id))
		.where(
			search
				? or(
						ilike(componentSeries.name, `%${search}%`),
						ilike(componentSeries.slug, `%${search}%`),
						ilike(manufacturers.name, `%${search}%`),
						ilike(categories.name, `%${search}%`)
					)
				: undefined
		)
		.groupBy(
			componentSeries.id,
			componentSeries.name,
			componentSeries.slug,
			componentSeries.description,
			componentSeries.isActive,
			componentSeries.manufacturerId,
			manufacturers.name,
			componentSeries.categoryId,
			categories.name
		)
		.orderBy(asc(componentSeries.name))

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Серии компонентов
					</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Серии и семейства электронных компонентов
					</p>
				</div>

				<Link
					href='/admin/series/new'
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					<Plus className='h-4 w-4' />
					Добавить серию
				</Link>
			</div>

			{/* Поиск */}
			<form
				method='GET'
				className='flex flex-col gap-3 sm:flex-row'
			>
				<div className='relative flex-1'>
					<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />

					<input
						type='search'
						name='q'
						defaultValue={search}
						placeholder='Поиск по названию, slug, производителю или категории...'
						className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
					/>
				</div>

				<button
					type='submit'
					className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
				>
					Найти
				</button>

				{search && (
					<Link
						href='/admin/series'
						className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50'
					>
						Сбросить
					</Link>
				)}
			</form>

			{/* Количество */}
			<div className='text-sm text-gray-500'>Найдено серий: {rows.length}</div>

			{/* Таблица */}
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='overflow-x-auto'>
					<table className='min-w-full text-left text-sm'>
						<thead className='border-b border-gray-200 bg-gray-50'>
							<tr>
								<th className='px-5 py-4 font-semibold text-gray-700'>Серия</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Производитель
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Категория
								</th>

								<th className='px-5 py-4 text-center font-semibold text-gray-700'>
									Компоненты
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Статус
								</th>

								<th className='px-5 py-4 text-right font-semibold text-gray-700'>
									Действия
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-100 bg-white'>
							{rows.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className='px-5 py-12 text-center text-gray-500'
									>
										{search
											? 'Серии по вашему запросу не найдены.'
											: 'Серий пока нет.'}
									</td>
								</tr>
							) : (
								rows.map(series => (
									<tr
										key={series.id.toString()}
										className='transition hover:bg-gray-50'
									>
										{/* Серия */}
										<td className='px-5 py-4'>
											<div className='min-w-0'>
												<Link
													href={`/admin/series/${series.id.toString()}`}
													className='font-semibold text-gray-900 hover:text-gray-600'
												>
													{series.name}
												</Link>

												<div className='mt-0.5 text-xs text-gray-400'>
													{series.slug}
												</div>

												{series.description && (
													<div className='mt-1 max-w-md truncate text-xs text-gray-500'>
														{series.description}
													</div>
												)}
											</div>
										</td>

										{/* Производитель */}
										<td className='px-5 py-4'>
											{series.manufacturerId && series.manufacturerName ? (
												<Link
													href={`/admin/manufacturers/${series.manufacturerId.toString()}`}
													className='text-gray-700 hover:text-gray-900 hover:underline'
												>
													{series.manufacturerName}
												</Link>
											) : (
												<span className='text-gray-400'>Не указан</span>
											)}
										</td>

										{/* Категория */}
										<td className='px-5 py-4 text-gray-600'>
											{series.categoryName ?? (
												<span className='text-gray-400'>Не указана</span>
											)}
										</td>

										{/* Компоненты */}
										<td className='px-5 py-4 text-center text-gray-700'>
											{series.componentCount}
										</td>

										{/* Статус */}
										<td className='px-5 py-4'>
											{series.isActive ? (
												<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
													Активна
												</span>
											) : (
												<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
													Неактивна
												</span>
											)}
										</td>

										{/* Действия */}
										<td className='px-5 py-4 text-right'>
											<Link
												href={`/admin/series/${series.id.toString()}`}
												className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900'
											>
												Открыть
												<ArrowRight className='h-4 w-4' />
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	)
}
