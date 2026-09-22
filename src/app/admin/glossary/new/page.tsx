import { asc, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { db } from '@/db'
import { glossaryCategories } from '@/db/schema'
import GlossaryEditor from '@/components/admin/GlossaryEditor'

export default async function NewGlossaryTermPage() {
	const categories = await db
		.select({
			id: glossaryCategories.id,
			name: glossaryCategories.name
		})
		.from(glossaryCategories)
		.where(eq(glossaryCategories.isActive, true))
		.orderBy(asc(glossaryCategories.sortOrder), asc(glossaryCategories.name))

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div>
				<Link
					href='/admin/glossary'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900'
				>
					<ArrowLeft className='h-4 w-4' />
					Назад к глоссарию
				</Link>

				<h1 className='text-3xl font-bold text-gray-900'>Добавить термин</h1>

				<p className='mt-1 text-sm text-gray-500'>
					Создание нового термина в глоссарии
				</p>
			</div>

			<GlossaryEditor
				categories={categories.map(category => ({
					id: category.id.toString(),
					name: category.name
				}))}
			/>
		</main>
	)
}
