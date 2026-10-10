'use server'

import 'server-only'

import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { documentation } from '@/db/schema'
import { documentationCategories } from '@/config/categories'
import { requireAdmin } from '@/lib/auth/require-admin'

const MAX_ID = /^[1-9]\d*$/
const MAX_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function readText(formData: FormData, name: string): string {
	const value = formData.get(name)
	return typeof value === 'string' ? value.trim() : ''
}

function parseId(value: string): bigint {
	if (!MAX_ID.test(value)) {
		throw new Error('Некорректный идентификатор документа')
	}

	return BigInt(value)
}

function readDocument(formData: FormData) {
	const title = readText(formData, 'title')
	const slug = readText(formData, 'slug')
	const categorySlug = readText(formData, 'categorySlug')
	const description = readText(formData, 'description') || null
	const status = readText(formData, 'status')

	if (!title || title.length > 255) {
		throw new Error(
			'Название обязательно и должно содержать не более 255 символов',
		)
	}

	if (!MAX_SLUG.test(slug) || slug.length > 255) {
		throw new Error(
			'Slug должен содержать только латинские буквы в нижнем регистре, цифры и дефисы',
		)
	}

	if (
		!documentationCategories.some(
			(category) => category.slug === categorySlug,
		)
	) {
		throw new Error('Выбрана неизвестная категория')
	}

	if (!['draft', 'published'].includes(status)) {
		throw new Error('Недопустимый статус документа')
	}

	if (description && description.length > 10000) {
		throw new Error('Описание не должно превышать 10 000 символов')
	}

	return {
		title,
		slug,
		categorySlug,
		description,
		status,
	}
}

async function ensureUniqueSlug(slug: string, exceptId?: bigint) {
	const conditions = [eq(documentation.slug, slug)]

	if (exceptId !== undefined) {
		conditions.push(ne(documentation.id, exceptId))
	}

	const [existing] = await db
		.select({ id: documentation.id })
		.from(documentation)
		.where(and(...conditions))
		.limit(1)

	if (existing) {
		throw new Error(`Slug «${slug}» уже используется другим документом`)
	}
}

export async function createDocumentation(formData: FormData) {
	await requireAdmin()

	const values = readDocument(formData)

	await ensureUniqueSlug(values.slug)

	const [created] = await db
		.insert(documentation)
		.values(values)
		.returning({ id: documentation.id })

	revalidatePath('/admin/documentation')
	revalidatePath('/documentation')

	redirect(`/ admin / documentation / ${created.id.toString()}/edit`)
}

export async function updateDocumentation(formData: FormData) {
	await requireAdmin()

	const id = parseId(readText(formData, 'id'))
	const values = readDocument(formData)

	await ensureUniqueSlug(values.slug, id)

	const [updated] = await db
		.update(documentation)
		.set({
			...values,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(documentation.id, id))
		.returning({ id: documentation.id })

	if (!updated) {
		throw new Error('Документ не найден')
	}

	revalidatePath('/admin/documentation')
	revalidatePath('/documentation')
	revalidatePath(
		`/documentation/${values.categorySlug}/${values.slug}`,
	)

	redirect(`/admin/documentation/${id.toString()}/edit`)
}