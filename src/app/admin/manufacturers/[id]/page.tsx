import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, countDistinct, eq } from 'drizzle-orm'
import { ArrowLeft, ExternalLink, Package, Boxes } from 'lucide-react'

import ManufacturerEditor from '@/components/admin/ManufacturerEditor'
import { db } from '@/db'
import { componentSeries, components, manufacturers } from '@/db/schema'

type Props = {
	params: Promise<{
		id: string
	}>
}

export default async function ManufacturerPage({ params }: Props) {
	const { id } = await params

	// ID производителя в БД имеет тип bigint.
	let manufacturerId: bigint

	try {
		manufacturerId = BigInt(id)

		if (manufacturerId <= BigInt(0)) {
			notFound()
		}
	} catch {
		notFound()
	}

	// ---------------------------------------------------------------------------
	// Производитель
	// ---------------------------------------------------------------------------

	const [manufacturer] = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name,
			shortName: manufacturers.shortName,
			slug: manufacturers.slug,
			country: manufacturers.country,
			website: manufacturers.website,
			description: manufacturers.description,
			isActive: manufacturers.isActive,
			successorId: manufacturers.successorId
		})
		.from(manufacturers)
		.where(eq(manufacturers.id, manufacturerId))
		.limit(1)

	if (!manufacturer) {
		notFound()
	}

	// ---------------------------------------------------------------------------
	// Список производителей для выбора правопреемника
	// ---------------------------------------------------------------------------

	const manufacturerOptions = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name,
			shortName: manufacturers.shortName
		})
		.from(manufacturers)
		.orderBy(asc(manufacturers.name))

	// ---------------------------------------------------------------------------
	// Статистика производителя
	// ---------------------------------------------------------------------------

	const [statistics] = await db
		.select({
			componentCount: countDistinct(components.id),
			seriesCount: countDistinct(componentSeries.id)
		})
		.from(manufacturers)
		.leftJoin(components, eq(components.manufacturerId, manufacturers.id))
		.leftJoin(
			componentSeries,
			eq(componentSeries.manufacturerId, manufacturers.id)
		)
		.where(eq(manufacturers.id, manufacturerId))

	// ---------------------------------------------------------------------------
	// Правопреемник
	// ---------------------------------------------------------------------------

	const [successor] = manufacturer.successorId
		? await db
				.select({
					id: manufacturers.id,
					name: manufacturers.name,
					shortName: manufacturers.shortName
				})
				.from(manufacturers)
				.where(eq(manufacturers.id, manufacturer.successorId))
				.limit(1)
		: [undefined]

	// ---------------------------------------------------------------------------
	// Предшественники
	// ---------------------------------------------------------------------------

	const successors = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name,
			shortName: manufacturers.shortName
		})
		.from(manufacturers)
		.where(eq(manufacturers.successorId, manufacturerId))
		.orderBy(asc(manufacturers.name))

	// ---------------------------------------------------------------------------
	// Серии производителя
	// ---------------------------------------------------------------------------

	const manufacturerSeries = await db
		.select({
			id: componentSeries.id,
			name: componentSeries.name,
			slug: componentSeries.slug,
			isActive: componentSeries.isActive
		})
		.from(componentSeries)
		.where(eq(componentSeries.manufacturerId, manufacturerId))
		.orderBy(asc(componentSeries.name))

	// ---------------------------------------------------------------------------
	// Компоненты производителя
	// ---------------------------------------------------------------------------

	const manufacturerComponents = await db
		.select({
			id: components.id,
			name: components.name,
			designation: components.designation,
			slug: components.slug,
			seriesId: components.seriesId,
			seriesName: componentSeries.name,
			status: components.status,
			isActive: components.isActive
		})
		.from(components)
		.leftJoin(componentSeries, eq(components.seriesId, componentSeries.id))
		.where(eq(components.manufacturerId, manufacturerId))
		.orderBy(asc(components.name))

	// ---------------------------------------------------------------------------
	// Рендер страницы
	// ---------------------------------------------------------------------------

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}

			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-3'>
					<Link
						href='/admin/manufacturers'
						className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
						aria-label='Вернуться к производителям'
					>
						<ArrowLeft className='h-4 w-4' />
					</Link>

					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							{manufacturer.name}
						</h1>

						<p className='mt-1 text-sm text-gray-500'>
							Редактирование производителя
						</p>
					</div>
				</div>

				{manufacturer.website && (
					<a
						href={manufacturer.website}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
					>
						Официальный сайт
						<ExternalLink className='h-4 w-4' />
					</a>
				)}
			</div>

			{/* Статистика */}

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-sm text-gray-500'>Компоненты</div>

					<div className='mt-2 text-3xl font-bold text-gray-900'>
						{statistics?.componentCount ?? 0}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-sm text-gray-500'>Серии</div>

					<div className='mt-2 text-3xl font-bold text-gray-900'>
						{statistics?.seriesCount ?? 0}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
					<div className='text-sm text-gray-500'>Статус</div>

					<div className='mt-2'>
						{manufacturer.isActive ? (
							<span className='inline-flex rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700'>
								Активен
							</span>
						) : (
							<span className='inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600'>
								Неактивен
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Связи производителя */}

			{(successor || successors.length > 0) && (
				<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
					<div className='border-b border-gray-200 px-6 py-5'>
						<h2 className='text-lg font-semibold text-gray-900'>
							Связи производителя
						</h2>

						<p className='mt-1 text-sm text-gray-500'>
							История правопреемства производителей.
						</p>
					</div>

					<div className='grid gap-6 p-6 lg:grid-cols-2'>
						{/* Правопреемник */}

						<div>
							<h3 className='text-sm font-medium text-gray-500'>
								Правопреемник
							</h3>

							{successor ? (
								<Link
									href={`/admin/manufacturers/${successor.id.toString()}`}
									className='mt-2 inline-flex items-center gap-2 font-medium text-gray-900 hover:text-gray-600'
								>
									{successor.name}

									{successor.shortName && (
										<span className='text-sm text-gray-500'>
											({successor.shortName})
										</span>
									)}

									<ExternalLink className='h-4 w-4' />
								</Link>
							) : (
								<p className='mt-2 text-sm text-gray-400'>Не указан</p>
							)}
						</div>

						{/* Предшественники */}

						<div>
							<h3 className='text-sm font-medium text-gray-500'>
								Предшественники этого производителя
							</h3>

							{successors.length > 0 ? (
								<div className='mt-2 space-y-2'>
									{successors.map(item => (
										<Link
											key={item.id.toString()}
											href={`/admin/manufacturers/${item.id.toString()}`}
											className='flex items-center gap-2 font-medium text-gray-900 hover:text-gray-600'
										>
											{item.name}

											{item.shortName && (
												<span className='text-sm text-gray-500'>
													({item.shortName})
												</span>
											)}

											<ExternalLink className='h-4 w-4' />
										</Link>
									))}
								</div>
							) : (
								<p className='mt-2 text-sm text-gray-400'>
									Нет связанных производителей
								</p>
							)}
						</div>
					</div>
				</section>
			)}

			{/* ------------------------------------------------------------------ */}
			{/* Серии производителя */}
			{/* ------------------------------------------------------------------ */}

			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<Boxes className='h-5 w-5 text-gray-500' />

							<h2 className='text-lg font-semibold text-gray-900'>
								Серии производителя
							</h2>
						</div>

						<p className='mt-1 text-sm text-gray-500'>
							Серии электронных компонентов данного производителя.
						</p>
					</div>

					<span className='text-sm text-gray-500'>
						Всего: {manufacturerSeries.length}
					</span>
				</div>

				{manufacturerSeries.length === 0 ? (
					<div className='px-6 py-10 text-center'>
						<p className='text-sm text-gray-500'>
							У этого производителя пока нет серий.
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full text-left text-sm'>
							<thead className='border-b border-gray-200 bg-gray-50'>
								<tr>
									<th className='px-6 py-3 font-semibold text-gray-700'>
										Серия
									</th>

									<th className='px-6 py-3 font-semibold text-gray-700'>
										Slug
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
								{manufacturerSeries.map(series => (
									<tr
										key={series.id.toString()}
										className='transition hover:bg-gray-50'
									>
										<td className='px-6 py-4'>
											<Link
												href={`/admin/component-series/${series.id.toString()}`}
												className='font-medium text-gray-900 hover:text-gray-600'
											>
												{series.name}
											</Link>
										</td>

										<td className='px-6 py-4 text-gray-500'>{series.slug}</td>

										<td className='px-6 py-4'>
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

										<td className='px-6 py-4 text-right'>
											<Link
												href={`/admin/component-series/${series.id.toString()}`}
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
			{/* Компоненты производителя */}
			{/* ------------------------------------------------------------------ */}

			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<Package className='h-5 w-5 text-gray-500' />

							<h2 className='text-lg font-semibold text-gray-900'>
								Компоненты производителя
							</h2>
						</div>

						<p className='mt-1 text-sm text-gray-500'>
							Компоненты, выпускаемые данным производителем.
						</p>
					</div>

					<span className='text-sm text-gray-500'>
						Всего: {manufacturerComponents.length}
					</span>
				</div>

				{manufacturerComponents.length === 0 ? (
					<div className='px-6 py-10 text-center'>
						<p className='text-sm text-gray-500'>
							У этого производителя пока нет компонентов.
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
										Серия
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
								{manufacturerComponents.map(component => (
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

											<div className='mt-0.5 text-xs text-gray-400'>
												{component.slug}
											</div>
										</td>

										<td className='px-6 py-4 font-mono text-sm text-gray-600'>
											{component.designation}
										</td>

										<td className='px-6 py-4'>
											{component.seriesId && component.seriesName ? (
												<Link
													href={`/admin/component-series/${component.seriesId.toString()}`}
													className='text-gray-700 hover:text-gray-900 hover:underline'
												>
													{component.seriesName}
												</Link>
											) : (
												<span className='text-gray-400'>Без серии</span>
											)}
										</td>

										<td className='px-6 py-4'>
											{component.isActive ? (
												<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
													Активен
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

			{/* Редактор производителя */}

			<ManufacturerEditor
				mode='edit'
				manufacturers={manufacturerOptions}
				manufacturer={{
					id: manufacturer.id,
					name: manufacturer.name,
					shortName: manufacturer.shortName,
					slug: manufacturer.slug,
					country: manufacturer.country,
					website: manufacturer.website,
					description: manufacturer.description,
					isActive: manufacturer.isActive,
					successorId: manufacturer.successorId
				}}
			/>
		</main>
	)
}
