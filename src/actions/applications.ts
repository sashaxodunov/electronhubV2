
'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { applications } from '@/db/schema'

function parseId(value: string): bigint {
	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

function readText(formData: FormData, name: string): string {
	const value = formData.get(name)
	return typeof value === 'string' ? value.trim() : ''
}

function validateApplication(formData: FormData) {
	const name = readText(formData, 'name')
	const slug = readText(formData, 'slug')
		.toLowerCase()
		.replace(/\s+/g, '-')
	const description = readText(formData, 'description') || null

	if (!name) {
		throw new Error('Укажи название области применения')
	}

	if (name.length > 255) {
		throw new Error('Название не должно превышать 255 символов')
	}

	if (!slug || slug.length > 255) {
		throw new Error('Slug должен содержать от 1 до 255 символов')
	}

	// Разрешаем латиницу, кириллицу, цифры и дефисы.
	if (!/^[a-zа-яё0-9]+(?:-[a-zа-яё0-9]+)*$/i.test(slug)) {
		throw new Error(
			'Slug может содержать буквы, цифры и дефисы без пробелов',
		)
	}

	return { name, slug, description }
}

export async function createApplication(formData: FormData) {
	const values = validateApplication(formData)

	const [created] = await db
		.insert(applications)
		.values(values)
		.returning({ id: applications.id })

	if (!created) {
		throw new Error('Не удалось создать область применения')
	}

	redirect(`/admin/applications/${created.id.toString()}`)
}

export async function updateApplication(formData: FormData) {
	const id = parseId(readText(formData, 'id'))
	const values = validateApplication(formData)

	const [updated] = await db
		.update(applications)
		.set(values)
		.where(eq(applications.id, id))
		.returning({ id: applications.id })

	if (!updated) {
		throw new Error('Область применения не найдена')
	}

	redirect(`/admin/applications/${updated.id.toString()}`)
}

export async function deleteApplication(formData: FormData) {
	const id = parseId(readText(formData, 'id'))

	await db
		.delete(applications)
		.where(eq(applications.id, id))

	redirect('/admin/applications')
}