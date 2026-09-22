import Link from 'next/link'
import { asc } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'

import ManufacturerEditor from '@/components/admin/ManufacturerEditor'
import { db } from '@/db'
import { manufacturers } from '@/db/schema'

export default async function NewManufacturerPage() {
	const manufacturerOptions = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name,
			shortName: manufacturers.shortName
		})
		.from(manufacturers)
		.orderBy(asc(manufacturers.name))

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div className='flex items-center gap-3'>
				<Link
					href='/admin/manufacturers'
					className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900'
					aria-label='Вернуться к производителям'
				>
					<ArrowLeft className='h-4 w-4' />
				</Link>

				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Новый производитель
					</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Добавление производителя электронных компонентов
					</p>
				</div>
			</div>

			{/* Форма */}
			<ManufacturerEditor
				mode='create'
				manufacturers={manufacturerOptions}
			/>
		</main>
	)
}
