import Link from 'next/link'
import { and, asc, countDistinct, eq, ne } from 'drizzle-orm'
import { ArrowLeft, Boxes, FolderTree, Layers3 } from 'lucide-react'
import { notFound } from 'next/navigation'

import CategoryEditor from '@/components/admin/CategoryEditor'
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton'
import { db } from '@/db'
import { categories, componentSeries, components } from '@/db/schema'

type Props = {
	params: Promise<{
		id: string
	}>
}

function parseId(value: string): bigint {
	try {
		const id = BigInt(value)

		if (id <= BigInt(0)) {
			throw new Error()
		}

		return id
	} catch {
		notFound()
	}
}

export default async function CategoryDetailPage({ params }: Props) {
	const { id: rawId } = await params
	const id = parseId(rawId)

	const [category] = await db
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
		.where(eq(categories.id, id))
		.groupBy(
			categories.id,
			categories.parentId,
			categories.name,
			categories.slug,
			categories.description,
			categories.sortOrder,
			categories.isActive
		)
		.limit(1)

	if (!category) {
		notFound()
	}

	const allCategories = await db
		.select({
			id: categories.id,
			name: categories.name,
			parentId: categories.parentId
		})
		.from(categories)
		.where(and(eq(categories.isActive, true), ne(categories.id, id)))
		.orderBy(asc(categories.sortOrder), asc(categories.name))

	/*
	 * Исключаем из списка родителей саму категорию
	 * и всех её потомков.
	 *
	 * Например:
	 *
	 * Электроника
	 * └── Полупроводники
	 *     └── Диоды
	 *
	 * Если редактируем "Полупроводники", нельзя выбрать
	 * родителем "Полупроводники" или "Диоды".
	 */

	const descendants = new Set<string>()

	function collectDescendants(parentId: bigint) {
		const parentIdString = parentId.toString()

		for (const item of allCategories) {
			if (
				item.parentId !== null &&
				item.parentId.toString() === parentIdString
			) {
				const childId = item.id.toString()

				if (descendants.has(childId)) {
					continue
				}

				descendants.add(childId)
				collectDescendants(item.id)
			}
		}
	}

	collectDescendants(id)

	const categoryOptions = allCategories.filter(
		item => !descendants.has(item.id.toString())
	)

	const componentCount = Number(category.componentCount)
	const seriesCount = Number(category.seriesCount)

	const parentCategory =
		category.parentId !== null
			? allCategories.find(
					item => item.id.toString() === category.parentId?.toString()
				)
			: null

	return (
		<main className='space-y-6 p-6'>
			<div className='flex items-center gap-3'>
				<Link
					href='/admin/categories'
					className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
					aria-label='Вернуться к категориям'
				>
					<ArrowLeft className='h-4 w-4' />
				</Link>

				<div className='min-w-0'>
					<div className='flex items-center gap-2'>
						<FolderTree className='h-6 w-6 shrink-0 text-gray-700' />

						<h1 className='truncate text-3xl font-bold text-gray-900'>
							{category.name}
						</h1>
					</div>

					<p className='mt-1 text-sm text-gray-500'>
						Редактирование категории компонентов
					</p>
				</div>
			</div>

			<div className='grid gap-4 sm:grid-cols-3'>
				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-gray-100 p-2'>
							<Boxes className='h-5 w-5 text-gray-700' />
						</div>

						<div>
							<p className='text-sm text-gray-500'>Компоненты</p>

							<p className='text-2xl font-bold text-gray-900'>
								{componentCount}
							</p>
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-gray-100 p-2'>
							<Layers3 className='h-5 w-5 text-gray-700' />
						</div>

						<div>
							<p className='text-sm text-gray-500'>Серии</p>

							<p className='text-2xl font-bold text-gray-900'>{seriesCount}</p>
						</div>
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-5'>
					<p className='text-sm text-gray-500'>Родительская категория</p>

					<p className='mt-1 truncate text-base font-semibold text-gray-900'>
						{parentCategory?.name ?? 'Корневая категория'}
					</p>
				</div>
			</div>

			<CategoryEditor
				mode='edit'
				categories={categoryOptions}
				category={{
					id: category.id,
					parentId: category.parentId,
					name: category.name,
					slug: category.slug,
					description: category.description,
					sortOrder: category.sortOrder,
					isActive: category.isActive
				}}
			/>

			<div className='border-t border-gray-200 pt-6'>
				<div className='rounded-xl border border-red-200 bg-red-50 p-5'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<h2 className='text-base font-semibold text-red-900'>
								Удаление категории
							</h2>

							<p className='mt-1 text-sm leading-6 text-red-700'>
								Категорию можно удалить только если у неё нет дочерних
								категорий, компонентов и серий.
							</p>
						</div>

						<DeleteCategoryButton
							categoryId={category.id}
							categoryName={category.name}
						/>
					</div>
				</div>
			</div>
		</main>
	)
}
