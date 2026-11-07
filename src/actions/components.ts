
'use server'

import { redirect } from 'next/navigation'

import { db } from '@/db'
import { components } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'


// Функция проверки формата и положительного значения
function parsePositiveBigInt(value: string): bigint | null {
	if (!/^\d+$/.test(value)) {
		return null
	}

	const id = BigInt(value)

	return id > 0n ? id : null
}

//Функция проверки тип файла
function getFormString(
	formData: FormData,
	name: string,
): string {
	const value = formData.get(name)

	if (typeof value !== 'string') {
		return ''
	}

	return value.trim()
}

// функция проверки обязательного идентификатора
function getRequiredBigInt(
	formData: FormData,
	name: string,
	message: string,
): bigint {
	const value = getFormString(formData, name)
	const id = parsePositiveBigInt(value)

	if (id === null) {
		throw new Error(message)
	}

	return id
}

// Функция проверки необязательного идентификатора
function getOptionalBigInt(
	formData: FormData,
	name: string,
): bigint | null {
	const value = getFormString(formData, name)

	if (!value) {
		return null
	}

	const id = parsePositiveBigInt(value)

	if (id === null) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	return id
}

export async function createComponent(formData: FormData) {
	await requireAdmin() // Проверяем права администратора

	const name = getFormString(formData, 'name')
	const designation = getFormString(formData, 'designation')
	const slug = getFormString(formData, 'slug').toLowerCase()

	const manufacturerId = getRequiredBigInt(
		formData,
		'manufacturerId',
		'Не выбран производитель',
	)

	const categoryId = getRequiredBigInt(
		formData,
		'categoryId',
		'Не выбрана категория',
	)

	const seriesId = getOptionalBigInt(formData, 'seriesId')

	const functionValue = String(
		formData.get('function') ?? '',
	).trim()

	const shortDescription = String(
		formData.get('shortDescription') ?? '',
	).trim()

	const description = String(
		formData.get('description') ?? '',
	).trim()

	const activeValue = getFormString(formData, 'isActive')
	if (activeValue !== 'true' && activeValue !== 'false') {
		throw new Error('Некорректный статус компонента')
	}
	const isActive = activeValue === 'true'

	if (!name) {
		throw new Error('Не указано название компонента')
	}

	if (name.length > 255) {
		throw new Error(
			'Название компонента не должно превышать 255 символов',
		)
	}

	if (!designation) {
		throw new Error('Не указано обозначение компонента')
	}

	if (designation.length > 255) {
		throw new Error(
			'Обозначение компонента не должно превышать 255 символов',
		)
	}

	if (!slug) {
		throw new Error('Не указан slug компонента')
	}

	if (slug.length > 255) {
		throw new Error('Slug не должен превышать 255 символов')
	}

	if (!/^[a-zа-яё0-9]+(?:-[a-zа-яё0-9]+)*$/i.test(slug)) {
		throw new Error(
			'Slug может содержать буквы, цифры и дефисы без пробелов',
		)
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
			isActive,
		})
		.returning({
			id: components.id,
		})

	if (!component) {
		throw new Error('Не удалось создать компонент')
	}

	redirect(`/admin/components/${component.id.toString()}`)
}
