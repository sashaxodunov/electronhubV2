import Link from 'next/link'
import { asc, countDistinct, eq, ilike, or } from 'drizzle-orm'
import { ArrowRight, Plus, Search } from 'lucide-react'

import { db } from '@/db'
import { componentSeries, components, manufacturers } from '@/db/schema'

type Props = {
	searchParams: Promise<{
		q?: string
	}>
}

export default async function ManufacturersPage({ searchParams }: Props) {
	const { q } = await searchParams

	const search = q?.trim() ?? ''

	const rows = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name,
			shortName: manufacturers.shortName,
			slug: manufacturers.slug,
			country: manufacturers.country,
			website: manufacturers.website,
			description: manufacturers.description,
			isActive: manufacturers.isActive,

			// DISTINCT предотвращает завышение количества
			// из-за одновременного JOIN компонентов и серий.
			componentCount: countDistinct(components.id),

			seriesCount: countDistinct(componentSeries.id)
		})
		.from(manufacturers)

		.leftJoin(components, eq(components.manufacturerId, manufacturers.id))

		.leftJoin(
			componentSeries,
			eq(componentSeries.manufacturerId, manufacturers.id)
		)

		.where(
			search
				? or(
						ilike(manufacturers.name, `%${search}%`),
						ilike(manufacturers.shortName, `%${search}%`),
						ilike(manufacturers.slug, `%${search}%`),
						ilike(manufacturers.country, `%${search}%`)
					)
				: undefined
		)

		.groupBy(
			manufacturers.id,
			manufacturers.name,
			manufacturers.shortName,
			manufacturers.slug,
			manufacturers.country,
			manufacturers.website,
			manufacturers.description,
			manufacturers.isActive
		)

		.orderBy(asc(manufacturers.name))

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок страницы */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Производители</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Производители электронных компонентов
					</p>
				</div>

				<Link
					href='/admin/manufacturers/new'
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					<Plus className='h-4 w-4' />
					Добавить производителя
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
						placeholder='Поиск по названию, slug или стране...'
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
						href='/admin/manufacturers'
						className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50'
					>
						Сбросить
					</Link>
				)}
			</form>

			{/* Количество найденных производителей */}
			<div className='text-sm text-gray-500'>
				Найдено производителей: {rows.length}
			</div>

			{/* Таблица производителей */}
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='overflow-x-auto'>
					<table className='min-w-full text-left text-sm'>
						<thead className='border-b border-gray-200 bg-gray-50'>
							<tr>
								<th className='px-5 py-4 font-semibold text-gray-700'>
									Производитель
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Страна
								</th>

								<th className='px-5 py-4 text-center font-semibold text-gray-700'>
									Компоненты
								</th>

								<th className='px-5 py-4 text-center font-semibold text-gray-700'>
									Серии
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
											? 'Производители по вашему запросу не найдены.'
											: 'Производителей пока нет.'}
									</td>
								</tr>
							) : (
								rows.map(manufacturer => (
									<tr
										key={manufacturer.id.toString()}
										className='transition hover:bg-gray-50'
									>
										{/* Производитель */}
										<td className='px-5 py-4'>
											<div className='min-w-0'>
												<Link
													href={`/admin/manufacturers/${manufacturer.id.toString()}`}
													className='font-semibold text-gray-900 hover:text-gray-600'
												>
													{manufacturer.name}
												</Link>

												{manufacturer.shortName && (
													<div className='mt-0.5 text-xs text-gray-500'>
														{manufacturer.shortName}
													</div>
												)}

												<div className='mt-0.5 text-xs text-gray-400'>
													{manufacturer.slug}
												</div>
											</div>
										</td>

										{/* Страна */}
										<td className='px-5 py-4 text-gray-600'>
											{manufacturer.country ?? '—'}
										</td>

										{/* Количество компонентов */}
										<td className='px-5 py-4 text-center text-gray-700'>
											{manufacturer.componentCount}
										</td>

										{/* Количество серий */}
										<td className='px-5 py-4 text-center text-gray-700'>
											{manufacturer.seriesCount}
										</td>

										{/* Статус */}
										<td className='px-5 py-4'>
											{manufacturer.isActive ? (
												<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
													Активен
												</span>
											) : (
												<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
													Неактивен
												</span>
											)}
										</td>

										{/* Действия */}
										<td className='px-5 py-4 text-right'>
											<Link
												href={`/admin/manufacturers/${manufacturer.id.toString()}`}
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
