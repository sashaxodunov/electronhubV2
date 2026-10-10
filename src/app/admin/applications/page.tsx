import Link from 'next/link'
import { asc, count, eq, ilike, or } from 'drizzle-orm'

import { db } from '@/db'
import { applications, componentApplications } from '@/db/schema'

type PageProps = {
	searchParams: Promise<{ q?: string }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
	const { q } = await searchParams
	const query = q?.trim() ?? ''

	const rows = await db
		.select({
			id: applications.id,
			name: applications.name,
			slug: applications.slug,
			description: applications.description,
			componentCount: count(componentApplications.componentId)
		})
		.from(applications)
		.leftJoin(
			componentApplications,
			eq(applications.id, componentApplications.applicationId)
		)
		.where(
			query
				? or(
						ilike(applications.name, `%${query}%`),
						ilike(applications.slug, `%${query}%`)
					)
				: undefined
		)
		.groupBy(
			applications.id,
			applications.name,
			applications.slug,
			applications.description
		)
		.orderBy(asc(applications.name))

	return (
		<div className='mx-auto max-w-7xl space-y-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>
						Области применения
					</h1>
					<p className='mt-1 text-sm text-gray-500'>
						Справочник областей применения электронных компонентов.
					</p>
				</div>

				<Link
					href='/admin/applications/new'
					className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					Добавить область
				</Link>
			</div>

			<form
				method='GET'
				className='flex flex-wrap gap-3'
			>
				<input
					type='search'
					name='q'
					defaultValue={query}
					placeholder='Название или slug'
					className='w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500'
				/>

				<button
					type='submit'
					className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
				>
					Найти
				</button>

				{query && (
					<Link
						href='/admin/applications'
						className='px-3 py-2 text-sm text-gray-500 hover:text-gray-900'
					>
						Сбросить
					</Link>
				)}
			</form>

			<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white'>
				<table className='w-full text-left text-sm'>
					<thead className='border-b border-gray-200 bg-gray-50 text-gray-500'>
						<tr>
							<th className='px-4 py-3 font-medium'>Название</th>
							<th className='px-4 py-3 font-medium'>Slug</th>
							<th className='px-4 py-3 font-medium'>Компоненты</th>
							<th className='px-4 py-3 font-medium'>Описание</th>
							<th className='px-4 py-3 text-right font-medium'>Действие</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-100'>
						{rows.map(item => (
							<tr
								key={item.id.toString()}
								className='hover:bg-gray-50'
							>
								<td className='px-4 py-3 font-medium text-gray-900'>
									{item.name}
								</td>

								<td className='px-4 py-3 text-gray-500'>{item.slug}</td>

								<td className='px-4 py-3 text-gray-700'>
									{item.componentCount}
								</td>

								<td className='max-w-sm px-4 py-3 text-gray-500'>
									<span className='line-clamp-2'>
										{item.description || '—'}
									</span>
								</td>

								<td className='px-4 py-3 text-right'>
									<Link
										href={`/admin/applications/${item.id.toString()}`}
										className='font-medium text-gray-700 hover:text-gray-950'
									>
										Редактировать
									</Link>
								</td>
							</tr>
						))}

						{rows.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className='px-4 py-10 text-center text-gray-500'
								>
									{query
										? 'По запросу ничего не найдено.'
										: 'Областей применения пока нет.'}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<p className='text-sm text-gray-500'>Найдено записей: {rows.length}</p>
		</div>
	)
}
