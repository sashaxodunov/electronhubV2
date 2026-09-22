'use server'

import { and, eq, ne } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { categories, componentSeries, components } from '@/db/schema'

function getString(formData: FormData, name: string): string | null {
	const value = String(formData.get(name) ?? '').trim()

	return value || null
}

function getRequiredString(formData: FormData, name: string): string {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	return value
}

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

function getSortOrder(formData: FormData): number {
	const value = String(formData.get('sortOrder') ?? '0').trim()

	if (!value) {
		return 0
	}

	const sortOrder = Number(value)

	if (!Number.isInteger(sortOrder)) {
		throw new Error('Порядок сортировки должен быть целым числом')
	}

	return sortOrder
}

function normalizeSlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zа-яё0-9-]/gi, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function getCategoryValues(formData: FormData) {
	const name = getRequiredString(formData, 'name')

	const slugValue = getRequiredString(formData, 'slug')

	const slug = normalizeSlug(slugValue)

	if (!slug) {
		throw new Error('Slug категории некорректен')
	}

	if (slug.length > 150) {
		throw new Error('Slug категории не должен превышать 150 символов')
	}

	return {
		name,
		slug,
		description: getString(formData, 'description'),
		parentId: getOptionalId(formData, 'parentId'),
		sortOrder: getSortOrder(formData),
		isActive: formData.get('isActive') === 'on'
	}
}

async function validateSlug(slug: string, categoryId?: bigint) {
	const [existing] = await db
		.select({
			id: categories.id
		})
		.from(categories)
		.where(
			categoryId !== undefined
				? and(eq(categories.slug, slug), ne(categories.id, categoryId))
				: eq(categories.slug, slug)
		)
		.limit(1)

	if (existing) {
		throw new Error(`Категория со slug "${slug}" уже существует`)
	}
}

async function validateParent(parentId: bigint | null, categoryId?: bigint) {
	if (parentId === null) {
		return
	}

	if (categoryId !== undefined && parentId === categoryId) {
		throw new Error('Категория не может быть родителем самой себя')
	}

	const [parent] = await db
		.select({
			id: categories.id
		})
		.from(categories)
		.where(eq(categories.id, parentId))
		.limit(1)

	if (!parent) {
		throw new Error('Указанная родительская категория не найдена')
	}

	/*
	 * При редактировании дополнительно проверяем,
	 * чтобы нельзя было создать прямую циклическую связь:
	 *
	 * A -> B
	 * B -> A
	 */
	if (categoryId !== undefined) {
		let currentId: bigint | null = parentId
		const visited = new Set<string>()

		while (currentId !== null) {
			const key = currentId.toString()

			if (visited.has(key)) {
				throw new Error('Обнаружена циклическая структура категорий')
			}

			visited.add(key)

			if (currentId === categoryId) {
				throw new Error('Нельзя назначить дочернюю категорию родительской')
			}

			const [parentCategory] = await db
				.select({
					parentId: categories.parentId
				})
				.from(categories)
				.where(eq(categories.id, currentId))
				.limit(1)

			if (!parentCategory) {
				break
			}

			currentId = parentCategory.parentId
		}
	}
}

export async function createCategory(formData: FormData) {
	const values = getCategoryValues(formData)

	await validateSlug(values.slug)
	await validateParent(values.parentId)

	const [category] = await db
		.insert(categories)
		.values({
			name: values.name,
			slug: values.slug,
			description: values.description,
			parentId: values.parentId,
			sortOrder: values.sortOrder,
			isActive: values.isActive
		})
		.returning({
			id: categories.id
		})

	if (!category) {
		throw new Error('Не удалось создать категорию')
	}

	redirect(`/admin/categories/${category.id.toString()}`)
}

export async function updateCategory(formData: FormData) {
	const id = getId(formData, 'id')

	const values = getCategoryValues(formData)

	await validateSlug(values.slug, id)

	await validateParent(values.parentId, id)

	const [category] = await db
		.update(categories)
		.set({
			name: values.name,
			slug: values.slug,
			description: values.description,
			parentId: values.parentId,
			sortOrder: values.sortOrder,
			isActive: values.isActive,
			updatedAt: new Date().toISOString()
		})
		.where(eq(categories.id, id))
		.returning({
			id: categories.id
		})

	if (!category) {
		throw new Error('Категория не найдена')
	}

	redirect(`/admin/categories/${category.id.toString()}`)
}

export async function deleteCategory(formData: FormData) {
	const id = getId(formData, 'id')

	const [category] = await db
		.select({
			id: categories.id,
			name: categories.name
		})
		.from(categories)
		.where(eq(categories.id, id))
		.limit(1)

	if (!category) {
		throw new Error('Категория не найдена')
	}

	/*
	 * Проверяем дочерние категории.
	 */
	const [childCategory] = await db
		.select({
			id: categories.id
		})
		.from(categories)
		.where(eq(categories.parentId, id))
		.limit(1)

	if (childCategory) {
		throw new Error(
			`Невозможно удалить категорию "${category.name}", поскольку у неё есть дочерние категории`
		)
	}

	/*
	 * Проверяем компоненты.
	 */
	const [component] = await db
		.select({
			id: components.id
		})
		.from(components)
		.where(eq(components.categoryId, id))
		.limit(1)

	if (component) {
		throw new Error(
			`Невозможно удалить категорию "${category.name}", поскольку к ней привязаны компоненты`
		)
	}

	/*
	 * Проверяем серии.
	 */
	const [series] = await db
		.select({
			id: componentSeries.id
		})
		.from(componentSeries)
		.where(eq(componentSeries.categoryId, id))
		.limit(1)

	if (series) {
		throw new Error(
			`Невозможно удалить категорию "${category.name}", поскольку к ней привязаны серии`
		)
	}

	await db.delete(categories).where(eq(categories.id, id))

	redirect('/admin/categories')
}
