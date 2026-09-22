import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'

import CategoryEditor from '@/components/admin/CategoryEditor'
import { db } from '@/db'
import { categories } from '@/db/schema'

export default async function NewCategoryPage() {
	const categoryOptions = await db
		.select({
			id: categories.id,
			name: categories.name,
			parentId: categories.parentId
		})
		.from(categories)
		.where(eq(categories.isActive, true))
		.orderBy(asc(categories.sortOrder), asc(categories.name))

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

				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Новая категория</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Добавление категории компонентов
					</p>
				</div>
			</div>

			<CategoryEditor
				mode='create'
				categories={categoryOptions}
			/>
		</main>
	)
}
