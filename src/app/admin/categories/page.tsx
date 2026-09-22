import Link from 'next/link'
import { asc, countDistinct, eq, ilike } from 'drizzle-orm'
import { FolderTree, Plus, Search } from 'lucide-react'

import { db } from '@/db'
import { categories, componentSeries, components } from '@/db/schema'

type CategoryRow = {
	id: bigint
	parentId: bigint | null
	name: string
	slug: string
	description: string | null
	sortOrder: number
	isActive: boolean
	componentCount: number
	seriesCount: number
}

type CategoryTreeItem = CategoryRow & {
	depth: number
}

function buildCategoryTree(categories: CategoryRow[]): CategoryTreeItem[] {
	const childrenMap = new Map<string, CategoryRow[]>()
	const existingIds = new Set(
		categories.map(category => category.id.toString())
	)

	for (const category of categories) {
		const parentKey =
			category.parentId !== null &&
			existingIds.has(category.parentId.toString())
				? category.parentId.toString()
				: 'root'

		const children = childrenMap.get(parentKey) ?? []
		children.push(category)
		childrenMap.set(parentKey, children)
	}

	for (const children of childrenMap.values()) {
		children.sort((a, b) => {
			if (a.sortOrder !== b.sortOrder) {
				return a.sortOrder - b.sortOrder
			}

			return a.name.localeCompare(b.name, 'ru')
		})
	}

	const result: CategoryTreeItem[] = []

	function visit(parentKey: string, depth: number) {
		const children = childrenMap.get(parentKey) ?? []

		for (const category of children) {
			result.push({
				...category,
				depth
			})

			visit(category.id.toString(), depth + 1)
		}
	}

	visit('root', 0)

	return result
}

export default async function CategoriesPage({
	searchParams
}: {
	searchParams: Promise<{ q?: string }>
}) {
	const params = await searchParams
	const search = params.q?.trim() ?? ''

	const categoryRows = await db
		.select({
			id: categories.id,
			parentId: categories.parentId,
			name: categories.name,
			slug: categories.slug,
			description: categories.description,
			sortOrder: categories.sortOrder,
			isActive: categories.isActive,
			componentCount: countDistinct(components.id),
			seriesCount: countDistinct(componentSeries.id)
		})
		.from(categories)
		.leftJoin(components, eq(components.categoryId, categories.id))
		.leftJoin(componentSeries, eq(componentSeries.categoryId, categories.id))
		.where(search ? ilike(categories.name, `%${search}%`) : undefined)
		.groupBy(
			categories.id,
			categories.parentId,
			categories.name,
			categories.slug,
			categories.description,
			categories.sortOrder,
			categories.isActive
		)
		.orderBy(asc(categories.sortOrder), asc(categories.name))

	const rows: CategoryRow[] = categoryRows.map(category => ({
		...category,
		componentCount: Number(category.componentCount),
		seriesCount: Number(category.seriesCount)
	}))

	const tree = buildCategoryTree(rows)

	const activeCount = rows.filter(category => category.isActive).length
	const rootCount = rows.filter(category => category.parentId === null).length

	return (
		<main className='space-y-6 p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<FolderTree className='h-7 w-7 text-gray-700' />

						<div>
							<h1 className='text-3xl font-bold text-gray-900'>Категории</h1>

							<p className='mt-1 text-sm text-gray-500'>
								Иерархия категорий компонентов
							</p>
						</div>
					</div>
				</div>

				<Link
					href='/admin/categories/new'
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					<Plus className='h-4 w-4' />
					Новая категория
				</Link>
			</div>

			<div className='grid gap-4 sm:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<p className='text-sm text-gray-500'>Всего категорий</p>

					<p className='mt-1 text-2xl font-bold text-gray-900'>{rows.length}</p>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<p className='text-sm text-gray-500'>Активных</p>

					<p className='mt-1 text-2xl font-bold text-gray-900'>{activeCount}</p>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<p className='text-sm text-gray-500'>Корневых категорий</p>

					<p className='mt-1 text-2xl font-bold text-gray-900'>{rootCount}</p>
				</div>
			</div>

			<form
				method='get'
				className='rounded-xl border border-gray-200 bg-white p-4'
			>
				<div className='flex flex-col gap-3 sm:flex-row'>
					<div className='relative flex-1'>
						<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />

						<input
							type='search'
							name='q'
							defaultValue={search}
							placeholder='Поиск по названию категории...'
							className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					<button
						type='submit'
						className='inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
					>
						Найти
					</button>

					{search && (
						<Link
							href='/admin/categories'
							className='inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
						>
							Сбросить
						</Link>
					)}
				</div>
			</form>

			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
				<div className='overflow-x-auto'>
					<table className='w-full min-w-225'>
						<thead className='border-b border-gray-200 bg-gray-50'>
							<tr>
								<th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Категория
								</th>

								<th className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Slug
								</th>

								<th className='px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Компоненты
								</th>

								<th className='px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Серии
								</th>

								<th className='px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Статус
								</th>

								<th className='px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500'>
									Действие
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-100'>
							{tree.length > 0 ? (
								tree.map(category => (
									<tr
										key={category.id.toString()}
										className='transition hover:bg-gray-50'
									>
										<td className='px-5 py-4'>
											<Link
												href={`/admin/categories/${category.id.toString()}`}
												className='group block'
											>
												<div
													className='flex items-center gap-2'
													style={{
														paddingLeft: `${category.depth * 24}px`
													}}
												>
													{category.depth > 0 && (
														<span
															aria-hidden='true'
															className='text-gray-300'
														>
															└
														</span>
													)}

													<span className='font-medium text-gray-900 group-hover:text-gray-600'>
														{category.name}
													</span>

													{category.depth === 0 && (
														<span className='rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500'>
															Корневая
														</span>
													)}
												</div>

												{category.description && (
													<p
														className='mt-1 max-w-xl truncate text-sm text-gray-500'
														style={{
															marginLeft: `${category.depth * 24 + 24}px`
														}}
													>
														{category.description}
													</p>
												)}
											</Link>
										</td>

										<td className='px-5 py-4'>
											<code className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
												{category.slug}
											</code>
										</td>

										<td className='px-5 py-4 text-center text-sm text-gray-700'>
											{category.componentCount}
										</td>

										<td className='px-5 py-4 text-center text-sm text-gray-700'>
											{category.seriesCount}
										</td>

										<td className='px-5 py-4 text-center'>
											{category.isActive ? (
												<span className='inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700'>
													Активна
												</span>
											) : (
												<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
													Неактивна
												</span>
											)}
										</td>

										<td className='px-5 py-4 text-right'>
											<Link
												href={`/admin/categories/${category.id.toString()}`}
												className='text-sm font-medium text-gray-700 transition hover:text-gray-900'
											>
												Открыть
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className='px-5 py-12 text-center'
									>
										<FolderTree className='mx-auto h-10 w-10 text-gray-300' />

										<p className='mt-3 text-sm font-medium text-gray-900'>
											{search ? 'Категории не найдены' : 'Категорий пока нет'}
										</p>

										<p className='mt-1 text-sm text-gray-500'>
											{search
												? 'Попробуйте изменить поисковый запрос.'
												: 'Создайте первую категорию компонентов.'}
										</p>

										{!search && (
											<Link
												href='/admin/categories/new'
												className='mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
											>
												<Plus className='h-4 w-4' />
												Создать категорию
											</Link>
										)}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	)
}
