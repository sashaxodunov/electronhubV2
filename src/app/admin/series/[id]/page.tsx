import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, count, eq } from 'drizzle-orm'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { deleteComponentSeries } from '@/app/admin/series/actions'
import ComponentSeriesEditor from '@/components/admin/ComponentSeriesEditor'
import DeleteComponentSeriesButton from '@/components/admin/DeleteComponentSeriesButton'
import { db } from '@/db'
import {
	categories,
	componentSeries,
	components,
	manufacturers
} from '@/db/schema'

type Props = {
	params: Promise<{
		id: string
	}>
}

export default async function ComponentSeriesPage({ params }: Props) {
	const { id } = await params

	let seriesId: bigint

	try {
		seriesId = BigInt(id)

		if (seriesId <= BigInt(0)) {
			notFound()
		}
	} catch {
		notFound()
	}

	const [
		seriesResult,
		manufacturerOptions,
		categoryOptions,
		componentStats,
		seriesComponents
	] = await Promise.all([
		// -------------------------------------------------------------------------
		// Серия
		// -------------------------------------------------------------------------

		db
			.select({
				id: componentSeries.id,
				name: componentSeries.name,
				slug: componentSeries.slug,
				description: componentSeries.description,
				isActive: componentSeries.isActive,
				manufacturerId: componentSeries.manufacturerId,
				categoryId: componentSeries.categoryId,
				manufacturerName: manufacturers.name,
				categoryName: categories.name
			})
			.from(componentSeries)
			.leftJoin(
				manufacturers,
				eq(componentSeries.manufacturerId, manufacturers.id)
			)
			.leftJoin(categories, eq(componentSeries.categoryId, categories.id))
			.where(eq(componentSeries.id, seriesId))
			.limit(1),

		// -------------------------------------------------------------------------
		// Производители
		// -------------------------------------------------------------------------

		db
			.select({
				id: manufacturers.id,
				name: manufacturers.name,
				shortName: manufacturers.shortName
			})
			.from(manufacturers)
			.where(eq(manufacturers.isActive, true))
			.orderBy(asc(manufacturers.name)),

		// -------------------------------------------------------------------------
		// Категории
		// -------------------------------------------------------------------------

		db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug
			})
			.from(categories)
			.where(eq(categories.isActive, true))
			.orderBy(asc(categories.name)),

		// -------------------------------------------------------------------------
		// Количество компонентов
		// -------------------------------------------------------------------------

		db
			.select({
				count: count(components.id)
			})
			.from(components)
			.where(eq(components.seriesId, seriesId)),

		// -------------------------------------------------------------------------
		// Компоненты серии
		// -------------------------------------------------------------------------

		db
			.select({
				id: components.id,
				name: components.name,
				designation: components.designation,
				slug: components.slug,
				status: components.status,
				isActive: components.isActive
			})
			.from(components)
			.where(eq(components.seriesId, seriesId))
			.orderBy(asc(components.name))
	])

	const series = seriesResult[0]

	if (!series) {
		notFound()
	}

	const componentCount = Number(componentStats[0]?.count ?? 0)

	return (
		<main className='space-y-6 p-6'>
			{/* ------------------------------------------------------------------ */}
			{/* Заголовок */}
			{/* ------------------------------------------------------------------ */}

			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-3'>
					<Link
						href='/admin/component-series'
						className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
						aria-label='Вернуться к сериям'
					>
						<ArrowLeft className='h-4 w-4' />
					</Link>

					<div className='min-w-0'>
						<h1 className='truncate text-3xl font-bold text-gray-900'>
							{series.name}
						</h1>

						<p className='mt-1 text-sm text-gray-500'>
							Редактирование серии компонентов
						</p>
					</div>
				</div>
			</div>

			{/* ------------------------------------------------------------------ */}
			{/* Краткая информация */}
			{/* ------------------------------------------------------------------ */}

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-xs font-medium uppercase tracking-wide text-gray-500'>
						Компоненты
					</div>

					<div className='mt-2 text-2xl font-bold text-gray-900'>
						{componentCount}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-xs font-medium uppercase tracking-wide text-gray-500'>
						Производитель
					</div>

					<div className='mt-2 truncate text-sm font-semibold text-gray-900'>
						{series.manufacturerName ?? 'Не указан'}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-xs font-medium uppercase tracking-wide text-gray-500'>
						Категория
					</div>

					<div className='mt-2 truncate text-sm font-semibold text-gray-900'>
						{series.categoryName ?? 'Не указана'}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-xs font-medium uppercase tracking-wide text-gray-500'>
						Статус
					</div>

					<div className='mt-2'>
						{series.isActive ? (
							<span className='inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700'>
								Активна
							</span>
						) : (
							<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
								Неактивна
							</span>
						)}
					</div>
				</div>
			</div>

			{/* ------------------------------------------------------------------ */}
			{/* Редактор */}
			{/* ------------------------------------------------------------------ */}

			<ComponentSeriesEditor
				mode='edit'
				series={{
					id: series.id,
					name: series.name,
					slug: series.slug,
					description: series.description,
					isActive: series.isActive,
					manufacturerId: series.manufacturerId,
					categoryId: series.categoryId
				}}
				manufacturers={manufacturerOptions}
				categories={categoryOptions}
			/>

			{/* ------------------------------------------------------------------ */}
			{/* Компоненты серии */}
			{/* ------------------------------------------------------------------ */}

			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='text-lg font-semibold text-gray-900'>
							Компоненты серии
						</h2>

						<p className='mt-1 text-sm text-gray-500'>
							Компоненты, связанные с этой серией.
						</p>
					</div>

					<span className='inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'>
						Всего: {seriesComponents.length}
					</span>
				</div>

				{seriesComponents.length === 0 ? (
					<div className='px-6 py-10 text-center'>
						<p className='text-sm text-gray-500'>
							К этой серии пока не привязаны компоненты.
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full text-left text-sm'>
							<thead className='border-b border-gray-200 bg-gray-50'>
								<tr>
									<th className='px-6 py-3 font-semibold text-gray-700'>
										Компонент
									</th>

									<th className='px-6 py-3 font-semibold text-gray-700'>
										Обозначение
									</th>

									<th className='px-6 py-3 font-semibold text-gray-700'>
										Статус
									</th>

									<th className='px-6 py-3 text-right font-semibold text-gray-700'>
										Действие
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-100'>
								{seriesComponents.map(component => (
									<tr
										key={component.id.toString()}
										className='transition hover:bg-gray-50'
									>
										<td className='px-6 py-4'>
											<Link
												href={`/admin/components/${component.id.toString()}`}
												className='font-medium text-gray-900 hover:text-gray-600'
											>
												{component.name}
											</Link>

											<div className='mt-1 text-xs text-gray-400'>
												{component.slug}
											</div>
										</td>

										<td className='px-6 py-4 font-mono text-sm text-gray-600'>
											{component.designation}
										</td>

										<td className='px-6 py-4'>
											{component.isActive ? (
												<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
													{component.status}
												</span>
											) : (
												<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
													Неактивен
												</span>
											)}
										</td>

										<td className='px-6 py-4 text-right'>
											<Link
												href={`/admin/components/${component.id.toString()}`}
												className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900'
											>
												Открыть
												<ExternalLink className='h-4 w-4' />
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			{/* ------------------------------------------------------------------ */}
			{/* Удаление */}
			{/* ------------------------------------------------------------------ */}

			<div className='rounded-xl border border-red-200 bg-red-50 p-6'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h2 className='text-sm font-semibold text-red-900'>
							Удаление серии
						</h2>

						<p className='mt-1 text-sm text-red-700'>
							Серия не может быть удалена, если к ней привязаны компоненты.
						</p>
					</div>

					<DeleteComponentSeriesButton
						seriesId={series.id}
						seriesName={series.name}
						action={deleteComponentSeries}
					/>
				</div>
			</div>
		</main>
	)
}
