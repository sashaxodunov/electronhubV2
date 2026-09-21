import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { components, manufacturers, categories } from '@/db/schema'

export default async function ComponentsPage() {
	const componentsList = await db
		.select({
			id: components.id,
			name: components.name,
			designation: components.designation,
			slug: components.slug,
			isActive: components.isActive,
			manufacturerName: manufacturers.name,
			categoryName: categories.name
		})
		.from(components)
		.leftJoin(manufacturers, eq(components.manufacturerId, manufacturers.id))
		.leftJoin(categories, eq(components.categoryId, categories.id))
		.orderBy(desc(components.id))

	return (
		<div className='mx-auto max-w-7xl'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>Компоненты</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Управление электронными компонентами каталога
					</p>
				</div>

				<Link
					href='/admin/components/new'
					className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					+ Новый компонент
				</Link>
			</div>

			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
				{componentsList.length === 0 ? (
					<div className='px-6 py-16 text-center'>
						<p className='text-sm font-medium text-gray-900'>
							Компонентов пока нет
						</p>

						<p className='mt-1 text-sm text-gray-500'>
							Создайте первый компонент каталога.
						</p>

						<Link
							href='/admin/components/new'
							className='mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white'
						>
							Создать компонент
						</Link>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-left text-sm'>
							<thead className='border-b border-gray-200 bg-gray-50'>
								<tr>
									<th className='px-6 py-3 font-medium text-gray-500'>
										Обозначение
									</th>

									<th className='px-6 py-3 font-medium text-gray-500'>
										Название
									</th>

									<th className='px-6 py-3 font-medium text-gray-500'>
										Производитель
									</th>

									<th className='px-6 py-3 font-medium text-gray-500'>
										Категория
									</th>

									<th className='px-6 py-3 font-medium text-gray-500'>
										Статус
									</th>

									<th className='px-6 py-3' />
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-100'>
								{componentsList.map(component => (
									<tr
										key={component.id.toString()}
										className='transition hover:bg-gray-50'
									>
										<td className='px-6 py-4'>
											<Link
												href={`/admin/components/${component.id}`}
												className='font-medium text-gray-900 hover:underline'
											>
												{component.designation}
											</Link>
										</td>

										<td className='px-6 py-4 text-gray-600'>
											{component.name}
										</td>

										<td className='px-6 py-4 text-gray-600'>
											{component.manufacturerName ?? '—'}
										</td>

										<td className='px-6 py-4 text-gray-600'>
											{component.categoryName ?? '—'}
										</td>

										<td className='px-6 py-4'>
											<span
												className={`rounded-full px-2.5 py-1 text-xs font-medium ${
													component.isActive
														? 'bg-green-50 text-green-700'
														: 'bg-gray-100 text-gray-500'
												}`}
											>
												{component.isActive ? 'Активен' : 'Неактивен'}
											</span>
										</td>

										<td className='px-6 py-4 text-right'>
											<Link
												href={`/admin/components/${component.id}`}
												className='text-sm font-medium text-gray-700 hover:text-gray-900'
											>
												Открыть →
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
