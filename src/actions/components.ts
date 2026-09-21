'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { components } from '@/db/schema'

export async function createComponent(formData: FormData) {
	const name = String(formData.get('name') ?? '').trim()
	const designation = String(formData.get('designation') ?? '').trim()

	const slug = String(formData.get('slug') ?? '').trim()

	const manufacturerId = Number(formData.get('manufacturerId'))

	const categoryId = Number(formData.get('categoryId'))

	const seriesValue = formData.get('seriesId')

	const seriesId =
		seriesValue && String(seriesValue).trim() !== ''
			? Number(seriesValue)
			: null

	const functionValue = String(formData.get('function') ?? '').trim()

	const shortDescription = String(formData.get('shortDescription') ?? '').trim()

	const description = String(formData.get('description') ?? '').trim()

	const isActive = formData.get('isActive') === 'true'

	if (!name) {
		throw new Error('Не указано название компонента')
	}

	if (!designation) {
		throw new Error('Не указано обозначение компонента')
	}

	if (!slug) {
		throw new Error('Не указан slug компонента')
	}

	if (!manufacturerId) {
		throw new Error('Не выбран производитель')
	}

	if (!categoryId) {
		throw new Error('Не выбрана категория')
	}

	const [component] = await db
		.insert(components)
		.values({
			name,
			designation,
			slug,
			manufacturerId,
			categoryId,
			seriesId,
			function: functionValue || null,
			shortDescription: shortDescription || null,
			description: description || null,
			isActive
		})
		.returning({
			id: components.id
		})

	redirect(`/admin/components/${component.id}`)
}
