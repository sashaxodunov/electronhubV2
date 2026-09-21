import Link from 'next/link'
import { asc, count, eq } from 'drizzle-orm'

import { db } from '@/db'
import { packageVariants, packages } from '@/db/schema'

export default async function PackagesPage() {
	const packageRows = await db
		.select({
			id: packages.id,
			name: packages.name,
			slug: packages.slug,
			standard: packages.standard,
			bodyType: packages.bodyType,
			mountingType: packages.mountingType,
			isActive: packages.isActive,
			variantCount: count(packageVariants.id)
		})
		.from(packages)
		.leftJoin(packageVariants, eq(packageVariants.packageId, packages.id))
		.groupBy(
			packages.id,
			packages.name,
			packages.slug,
			packages.standard,
			packages.bodyType,
			packages.mountingType,
			packages.isActive
		)
		.orderBy(asc(packages.name))

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>Корпуса</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Справочник типов корпусов электронных компонентов
					</p>
				</div>

				<Link
					href='/admin/packages/new'
					className='rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
				>
					+ Добавить корпус
				</Link>
			</div>

			<div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
				{packageRows.length === 0 ? (
					<div className='px-6 py-12 text-center'>
						<p className='text-sm text-gray-500'>Корпуса пока не добавлены.</p>

						<Link
							href='/admin/packages/new'
							className='mt-4 inline-block text-sm font-medium text-gray-900 underline'
						>
							Добавить первый корпус
						</Link>
					</div>
				) : (
					<table className='w-full text-left'>
						<thead className='border-b border-gray-200 bg-gray-50'>
							<tr>
								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Корпус
								</th>

								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Стандарт
								</th>

								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Тип
								</th>

								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Монтаж
								</th>

								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Варианты
								</th>

								<th className='px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Статус
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-100'>
							{packageRows.map(pkg => (
								<tr
									key={pkg.id.toString()}
									className='hover:bg-gray-50'
								>
									<td className='px-5 py-4'>
										<Link
											href={`/admin/packages/${pkg.id}`}
											className='font-medium text-gray-900 hover:underline'
										>
											{pkg.name}
										</Link>

										<div className='mt-1 text-xs text-gray-400'>{pkg.slug}</div>
									</td>

									<td className='px-5 py-4 text-sm text-gray-600'>
										{pkg.standard || '—'}
									</td>

									<td className='px-5 py-4 text-sm text-gray-600'>
										{pkg.bodyType || '—'}
									</td>

									<td className='px-5 py-4 text-sm text-gray-600'>
										{pkg.mountingType || '—'}
									</td>

									<td className='px-5 py-4 text-sm text-gray-600'>
										{pkg.variantCount}
									</td>

									<td className='px-5 py-4'>
										{pkg.isActive ? (
											<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
												Активен
											</span>
										) : (
											<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500'>
												Неактивен
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}
