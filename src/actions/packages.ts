'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { packages } from '@/db/schema'

export async function createPackage(formData: FormData) {
	const name = String(formData.get('name') ?? '').trim()
	const slug = String(formData.get('slug') ?? '').trim()
	const standard = String(formData.get('standard') ?? '').trim()
	const bodyType = String(formData.get('bodyType') ?? '').trim()
	const mountingType = String(formData.get('mountingType') ?? '').trim()
	const description = String(formData.get('description') ?? '').trim()
	const isActive = formData.get('isActive') === 'on'

	if (!name) {
		throw new Error('Название корпуса обязательно')
	}

	if (!slug) {
		throw new Error('Slug корпуса обязателен')
	}

	const [createdPackage] = await db
		.insert(packages)
		.values({
			name,
			slug,
			standard: standard || null,
			bodyType: bodyType || null,
			mountingType: mountingType || null,
			description: description || null,
			isActive
		})
		.returning({
			id: packages.id
		})

	redirect(`/admin/packages/${createdPackage.id}`)
}

export async function updatePackage(formData: FormData) {
	const id = Number(formData.get('id'))

	if (!id) {
		throw new Error('Некорректный ID корпуса')
	}

	const name = String(formData.get('name') ?? '').trim()
	const slug = String(formData.get('slug') ?? '').trim()
	const standard = String(formData.get('standard') ?? '').trim()
	const bodyType = String(formData.get('bodyType') ?? '').trim()
	const mountingType = String(formData.get('mountingType') ?? '').trim()
	const description = String(formData.get('description') ?? '').trim()
	const isActive = formData.get('isActive') === 'on'

	if (!name) {
		throw new Error('Название корпуса обязательно')
	}

	if (!slug) {
		throw new Error('Slug корпуса обязателен')
	}

	await db
		.update(packages)
		.set({
			name,
			slug,
			standard: standard || null,
			bodyType: bodyType || null,
			mountingType: mountingType || null,
			description: description || null,
			isActive,
			updatedAt: new Date().toISOString()
		})
		.where(eq(packages.id, id))

	redirect(`/admin/packages/${id}`)
}

export async function deletePackage(formData: FormData) {
	const id = Number(formData.get('id'))

	if (!id) {
		throw new Error('Некорректный ID корпуса')
	}

	await db.delete(packages).where(eq(packages.id, id))

	redirect('/admin/packages')
}
