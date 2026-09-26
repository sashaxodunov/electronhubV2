'use server'

import { redirect } from 'next/navigation'

import { db } from '@/db'
import { components } from '@/db/schema'

function getRequiredBigInt(
	formData: FormData,
	name: string,
	message: string
): bigint {
	const value = String(formData.get(name) ?? '').trim()

	if (!value || !/^\d+$/.test(value)) {
		throw new Error(message)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(message)
	}

	return id
}

function getOptionalBigInt(
	formData: FormData,
	name: string
): bigint | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	if (!/^\d+$/.test(value)) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	return id
}

export async function createComponent(formData: FormData) {
	const name = String(formData.get('name') ?? '').trim()
	const designation = String(formData.get('designation') ?? '').trim()
	const slug = String(formData.get('slug') ?? '').trim()

	const manufacturerId = getRequiredBigInt(
		formData,
		'manufacturerId',
		'Не выбран производитель'
	)

	const categoryId = getRequiredBigInt(
		formData,
		'categoryId',
		'Не выбрана категория'
	)

	const seriesId = getOptionalBigInt(
		formData,
		'seriesId'
	)

	const functionValue = String(
		formData.get('function') ?? ''
	).trim()

	const shortDescription = String(
		formData.get('shortDescription') ?? ''
	).trim()

	const description = String(
		formData.get('description') ?? ''
	).trim()

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

	if (!component) {
		throw new Error('Не удалось создать компонент')
	}

	redirect(`/admin/components/${component.id}`)
}
