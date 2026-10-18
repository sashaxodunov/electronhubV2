'use server'

import 'server-only'

import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import {
	documentation,
	documentationSubcategories
} from '@/db/schema'
import { documentationCategories } from '@/config/categories'
import { requireAdmin } from '@/lib/auth/require-admin'

const MAX_ID = BigInt(9_223_372_036_854_775_807)

function readId(value: FormDataEntryValue | null): bigint {
	const raw = String(value ?? '').trim()

	if (!/^[1-9]\d*$/.test(raw)) {
		throw new Error('Некорректный идентификатор')
	}

	const id = BigInt(raw)

	if (id > MAX_ID) {
		throw new Error('Идентификатор вне допустимого диапазона')
	}

	return id
}

function readSubcategory(formData: FormData) {
	const categorySlug = String(
		formData.get('categorySlug') ?? ''
	).trim()

	const title = String(formData.get('title') ?? '').trim()

	const slug = String(formData.get('slug') ?? '')
		.trim()
		.toLowerCase()

	const sortOrderRaw = String(
		formData.get('sortOrder') ?? '0'
	).trim()

	const sortOrder = Number(sortOrderRaw)

	if (
		!documentationCategories.some(
			category => category.slug === categorySlug
		)
	) {
		throw new Error('Выбери существующую категорию')
	}

	if (!title || title.length > 255) {
		throw new Error('Название должно содержать от 1 до 255 символов')
	}

	if (
		!slug ||
		slug.length > 255 ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
	) {
		throw new Error(
			'Slug должен содержать латинские буквы, цифры и дефисы'
		)
	}

	if (
		!Number.isSafeInteger(sortOrder) ||
		sortOrder < 0
	) {
		throw new Error('Порядок должен быть целым числом от 0')
	}

	return {
		categorySlug,
		title,
		slug,
		sortOrder
	}
}

async function ensureUniqueSubcategory(
	categorySlug: string,
	slug: string,
	excludeId?: bigint
) {
	const conditions = [
		eq(documentationSubcategories.categorySlug, categorySlug),
		eq(documentationSubcategories.slug, slug)
	]

	if (excludeId !== undefined) {
		conditions.push(ne(documentationSubcategories.id, excludeId))
	}

	const [existing] = await db
		.select({ id: documentationSubcategories.id })
		.from(documentationSubcategories)
		.where(and(...conditions))
		.limit(1)

	if (existing) {
		throw new Error(
			'Подкатегория с таким URL уже существует в этой категории'
		)
	}
}

function revalidateDocumentation(categorySlug?: string) {
	revalidatePath('/admin/documentation')
	revalidatePath('/admin/documentation/subcategories')
	revalidatePath('/documentation')

	if (categorySlug) {
		revalidatePath(`/documentation/${categorySlug}`)
	}
}

/**
 * Создание подкатегории.
 */
export async function createDocumentationSubcategory(
	formData: FormData
) {
	await requireAdmin()

	const values = readSubcategory(formData)

	await ensureUniqueSubcategory(
		values.categorySlug,
		values.slug
	)

	await db.insert(documentationSubcategories).values({
		...values,
		updatedAt: new Date().toISOString()
	})

	revalidateDocumentation(values.categorySlug)

	redirect('/admin/documentation/subcategories')
}

/**
 * Изменение подкатегории.
 */
export async function updateDocumentationSubcategory(
	formData: FormData
) {
	await requireAdmin()

	const id = readId(formData.get('id'))
	const values = readSubcategory(formData)

	const [existing] = await db
		.select({
			id: documentationSubcategories.id,
			categorySlug: documentationSubcategories.categorySlug
		})
		.from(documentationSubcategories)
		.where(eq(documentationSubcategories.id, id))
		.limit(1)

	if (!existing) {
		throw new Error('Подкатегория не найдена')
	}

	await ensureUniqueSubcategory(
		values.categorySlug,
		values.slug,
		id
	)

	// Если категорию меняют, проверяем, не привязаны ли к
	// подкатегории документы. Не переносим их молча в другую категорию.
	if (existing.categorySlug !== values.categorySlug) {
		const [linkedDocument] = await db
			.select({ id: documentation.id })
			.from(documentation)
			.where(eq(documentation.subcategoryId, id))
			.limit(1)

		if (linkedDocument) {
			throw new Error(
				'Сначала переназначь документы этой подкатегории'
			)
		}
	}

	await db
		.update(documentationSubcategories)
		.set({
			...values,
			updatedAt: new Date().toISOString()
		})
		.where(eq(documentationSubcategories.id, id))

	revalidateDocumentation(existing.categorySlug)
	revalidateDocumentation(values.categorySlug)

	redirect('/admin/documentation/subcategories')
}

/**
 * Удаление подкатегории.
 * Связанные документы сохраняются: их subcategory_id
 * станет NULL благодаря ON DELETE SET NULL.
 */
export async function deleteDocumentationSubcategory(
	formData: FormData
) {
	await requireAdmin()

	const id = readId(formData.get('id'))

	const [existing] = await db
		.select({
			id: documentationSubcategories.id,
			categorySlug: documentationSubcategories.categorySlug
		})
		.from(documentationSubcategories)
		.where(eq(documentationSubcategories.id, id))
		.limit(1)

	if (!existing) {
		throw new Error('Подкатегория не найдена')
	}

	await db
		.delete(documentationSubcategories)
		.where(eq(documentationSubcategories.id, id))

	revalidateDocumentation(existing.categorySlug)

	redirect('/admin/documentation/subcategories')
}