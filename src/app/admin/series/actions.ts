'use server'

import { and, eq, ne } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import {
	categories,
	componentSeries,
	components,
	manufacturers
} from '@/db/schema'

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
 * Получает обязательное строковое значение из FormData.
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
 * Все идентификаторы в БД используются как bigint.
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
 * Пустое значение возвращает null.
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
 * Нормализует slug.
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
 * Получает данные серии из формы.
 */
function getComponentSeriesValues(formData: FormData) {
	const name = getRequiredString(formData, 'name')

	const slugValue = getRequiredString(formData, 'slug')

	const slug = normalizeSlug(slugValue)

	if (!slug) {
		throw new Error('Slug серии некорректен')
	}

	if (slug.length > 255) {
		throw new Error('Slug серии не должен превышать 255 символов')
	}

	return {
		name,
		slug,
		description: getString(formData, 'description'),
		manufacturerId: getOptionalId(formData, 'manufacturerId'),
		categoryId: getOptionalId(formData, 'categoryId'),
		isActive: formData.get('isActive') === 'on'
	}
}

/**
 * Проверяет существование производителя.
 */
async function validateManufacturer(manufacturerId: bigint | null) {
	if (manufacturerId === null) {
		return
	}

	const [manufacturer] = await db
		.select({
			id: manufacturers.id
		})
		.from(manufacturers)
		.where(eq(manufacturers.id, manufacturerId))
		.limit(1)

	if (!manufacturer) {
		throw new Error('Указанный производитель не найден')
	}
}

/**
 * Проверяет существование категории.
 */
async function validateCategory(categoryId: bigint | null) {
	if (categoryId === null) {
		return
	}

	const [category] = await db
		.select({
			id: categories.id
		})
		.from(categories)
		.where(eq(categories.id, categoryId))
		.limit(1)

	if (!category) {
		throw new Error('Указанная категория не найдена')
	}
}

/**
 * Проверяет уникальность slug.
 */
async function validateSlug(slug: string, seriesId?: bigint) {
	const [existing] = await db
		.select({
			id: componentSeries.id
		})
		.from(componentSeries)
		.where(
			seriesId !== undefined
				? and(eq(componentSeries.slug, slug), ne(componentSeries.id, seriesId))
				: eq(componentSeries.slug, slug)
		)
		.limit(1)

	if (existing) {
		throw new Error(`Серия со slug "${slug}" уже существует`)
	}
}

/**
 * Создание серии.
 */
export async function createComponentSeries(formData: FormData) {
	const values = getComponentSeriesValues(formData)

	await validateSlug(values.slug)

	await validateManufacturer(values.manufacturerId)

	await validateCategory(values.categoryId)

	const [series] = await db
		.insert(componentSeries)
		.values({
			name: values.name,
			slug: values.slug,
			description: values.description,
			manufacturerId: values.manufacturerId,
			categoryId: values.categoryId,
			isActive: values.isActive
		})
		.returning({
			id: componentSeries.id
		})

	if (!series) {
		throw new Error('Не удалось создать серию')
	}

	redirect(`/admin/series/${series.id.toString()}`)
}

/**
 * Обновление серии.
 */
export async function updateComponentSeries(formData: FormData) {
	const id = getId(formData, 'id')

	const values = getComponentSeriesValues(formData)

	await validateSlug(values.slug, id)

	await validateManufacturer(values.manufacturerId)

	await validateCategory(values.categoryId)

	const [series] = await db
		.update(componentSeries)
		.set({
			name: values.name,
			slug: values.slug,
			description: values.description,
			manufacturerId: values.manufacturerId,
			categoryId: values.categoryId,
			isActive: values.isActive,
			updatedAt: new Date().toISOString()
		})
		.where(eq(componentSeries.id, id))
		.returning({
			id: componentSeries.id
		})

	if (!series) {
		throw new Error('Серия не найдена')
	}

	redirect(`/admin/series/${series.id.toString()}`)
}

/**
 * Удаление серии.
 *
 * Серия не удаляется, если к ней привязаны компоненты.
 * Сначала компоненты необходимо перевести в другую серию
 * или удалить их.
 */
export async function deleteComponentSeries(formData: FormData) {
	const id = getId(formData, 'id')

	const [series] = await db
		.select({
			id: componentSeries.id,
			name: componentSeries.name
		})
		.from(componentSeries)
		.where(eq(componentSeries.id, id))
		.limit(1)

	if (!series) {
		throw new Error('Серия не найдена')
	}

	const [component] = await db
		.select({
			id: components.id
		})
		.from(components)
		.where(eq(components.seriesId, id))
		.limit(1)

	if (component) {
		throw new Error(
			`Невозможно удалить серию "${series.name}", поскольку к ней привязаны компоненты`
		)
	}

	await db.delete(componentSeries).where(eq(componentSeries.id, id))

	redirect('/admin/series')
}
