'use server'

import { and, eq, ne } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { manufacturers } from '@/db/schema'

/**
 * Получает строковое значение из FormData.
 *
 * Пустая строка преобразуется в null.
 */
function getString(formData: FormData, name: string): string | null {
	const value = String(formData.get(name) ?? '').trim()

	return value || null
}

/**
 * Получает обязательное строковое значение.
 */
function getRequiredString(formData: FormData, name: string): string {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	return value
}

/**
 * Получает ID из FormData.
 *
 * ID производителей в Drizzle настроены как bigint.
 */
function getId(formData: FormData, name: string): bigint {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	try {
		const id = BigInt(value)

		if (id <= BigInt(0)) {
			throw new Error()
		}

		return id
	} catch {
		throw new Error(`Некорректный ID: ${name}`)
	}
}

/**
 * Получает необязательный ID.
 *
 * Пустое значение означает отсутствие связи.
 */
function getOptionalId(formData: FormData, name: string): bigint | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	try {
		const id = BigInt(value)

		if (id <= BigInt(0)) {
			throw new Error()
		}

		return id
	} catch {
		throw new Error(`Некорректный ID: ${name}`)
	}
}

/**
 * Нормализует slug производителя.
 */
function normalizeSlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zа-яё0-9-]/gi, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/**
 * Получает и проверяет данные производителя.
 */
function getManufacturerValues(formData: FormData) {
	const name = getRequiredString(formData, 'name')

	const slugValue = getRequiredString(formData, 'slug')
	const slug = normalizeSlug(slugValue)

	if (!slug) {
		throw new Error('Slug производителя некорректен')
	}

	if (slug.length > 255) {
		throw new Error('Slug производителя не должен превышать 255 символов')
	}

	return {
		name,
		shortName: getString(formData, 'shortName'),
		slug,
		country: getString(formData, 'country'),
		website: getString(formData, 'website'),
		description: getString(formData, 'description'),
		successorId: getOptionalId(formData, 'successorId'),
		isActive: formData.get('isActive') === 'on'
	}
}

/**
 * Проверяет существование правопреемника.
 */
async function validateSuccessor(
	successorId: bigint | null,
	manufacturerId?: bigint
) {
	if (successorId === null) {
		return
	}

	// Производитель не может быть сам себе правопреемником.
	if (manufacturerId !== undefined && successorId === manufacturerId) {
		throw new Error('Производитель не может быть собственным правопреемником')
	}

	const [successor] = await db
		.select({
			id: manufacturers.id
		})
		.from(manufacturers)
		.where(eq(manufacturers.id, successorId))
		.limit(1)

	if (!successor) {
		throw new Error('Указанный производитель-правопреемник не найден')
	}
}

/**
 * Проверяет уникальность slug.
 */
async function validateSlug(slug: string, manufacturerId?: bigint) {
	const [existing] = await db
		.select({
			id: manufacturers.id
		})
		.from(manufacturers)
		.where(
			manufacturerId !== undefined
				? and(
						eq(manufacturers.slug, slug),
						ne(manufacturers.id, manufacturerId)
					)
				: eq(manufacturers.slug, slug)
		)
		.limit(1)

	if (existing) {
		throw new Error(`Производитель со slug "${slug}" уже существует`)
	}
}

/**
 * Создание производителя.
 */
export async function createManufacturer(formData: FormData) {
	const values = getManufacturerValues(formData)

	await validateSlug(values.slug)
	await validateSuccessor(values.successorId)

	const [manufacturer] = await db
		.insert(manufacturers)
		.values({
			name: values.name,
			shortName: values.shortName,
			slug: values.slug,
			country: values.country,
			website: values.website,
			description: values.description,
			successorId: values.successorId,
			isActive: values.isActive
		})
		.returning({
			id: manufacturers.id
		})

	if (!manufacturer) {
		throw new Error('Не удалось создать производителя')
	}

	redirect(`/admin/manufacturers/${manufacturer.id.toString()}`)
}

/**
 * Обновление производителя.
 */
export async function updateManufacturer(formData: FormData) {
	const id = getId(formData, 'id')
	const values = getManufacturerValues(formData)

	await validateSlug(values.slug, id)
	await validateSuccessor(values.successorId, id)

	const [manufacturer] = await db
		.update(manufacturers)
		.set({
			name: values.name,
			shortName: values.shortName,
			slug: values.slug,
			country: values.country,
			website: values.website,
			description: values.description,
			successorId: values.successorId,
			isActive: values.isActive,
			updatedAt: new Date().toISOString()
		})
		.where(eq(manufacturers.id, id))
		.returning({
			id: manufacturers.id
		})

	if (!manufacturer) {
		throw new Error('Производитель не найден')
	}

	redirect(`/admin/manufacturers/${manufacturer.id.toString()}`)
}

/**
 * Удаление производителя.
 */
export async function deleteManufacturer(formData: FormData) {
	const id = getId(formData, 'id')

	const [manufacturer] = await db
		.select({
			id: manufacturers.id,
			name: manufacturers.name
		})
		.from(manufacturers)
		.where(eq(manufacturers.id, id))
		.limit(1)

	if (!manufacturer) {
		throw new Error('Производитель не найден')
	}

	await db.delete(manufacturers).where(eq(manufacturers.id, id))

	redirect('/admin/manufacturers')
}
