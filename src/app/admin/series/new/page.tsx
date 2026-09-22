import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'

import ComponentSeriesEditor from '@/components/admin/ComponentSeriesEditor'
import { db } from '@/db'
import { categories, manufacturers } from '@/db/schema'

export default async function NewComponentSeriesPage() {
	const [manufacturerOptions, categoryOptions] = await Promise.all([
		db
			.select({
				id: manufacturers.id,
				name: manufacturers.name,
				shortName: manufacturers.shortName
			})
			.from(manufacturers)
			.where(eq(manufacturers.isActive, true))
			.orderBy(asc(manufacturers.name)),

		db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug
			})
			.from(categories)
			.where(eq(categories.isActive, true))
			.orderBy(asc(categories.name))
	])

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div className='flex items-center gap-3'>
				<Link
					href='/admin/series'
					className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
					aria-label='Вернуться к сериям'
				>
					<ArrowLeft className='h-4 w-4' />
				</Link>

				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Новая серия</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Добавление серии электронных компонентов
					</p>
				</div>
			</div>

			{/* Редактор */}
			<ComponentSeriesEditor
				mode='create'
				manufacturers={manufacturerOptions}
				categories={categoryOptions}
			/>
		</main>
	)
}
