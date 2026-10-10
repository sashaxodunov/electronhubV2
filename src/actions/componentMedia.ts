
'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { assetType, componentMedia } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

function getString(
	formData: FormData,
	name: string,
): string | null {
	const value = String(formData.get(name) ?? '').trim()

	return value || null
}

function getRequiredString(
	formData: FormData,
	name: string,
): string {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	return value
}

function getNumber(
	formData: FormData,
	name: string,
): number | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	const number = Number(value)

	if (!Number.isFinite(number)) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	return number
}

function getBigInt(
	formData: FormData,
	name: string,
): bigint | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	if (!/^\d+$/.test(value)) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	return BigInt(value)
}

function getId(
	formData: FormData,
	name: string,
): bigint {
	const value = getRequiredString(formData, name)

	if (!/^\d+$/.test(value)) {
		throw new Error(`Некорректный ID: ${name}`)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(`Некорректный ID: ${name}`)
	}

	return id
}

function getAssetType(
	formData: FormData,
): (typeof assetType.enumValues)[number] {
	const value = getRequiredString(formData, 'assetType')

	if (
		!assetType.enumValues.includes(
			value as (typeof assetType.enumValues)[number],
		)
	) {
		throw new Error(`Недопустимый тип ресурса: ${value}`)
	}

	return value as (typeof assetType.enumValues)[number]
}

function getMediaValues(formData: FormData) {
	return {
		assetType: getAssetType(formData),

		title: getString(formData, 'title'),

		fileUrl: getRequiredString(formData, 'fileUrl'),

		mimeType: getString(formData, 'mimeType'),

		fileSize: getBigInt(formData, 'fileSize'),

		width: getNumber(formData, 'width'),

		height: getNumber(formData, 'height'),

		sortOrder: getNumber(formData, 'sortOrder') ?? 0,

		isPrimary: formData.get('isPrimary') === 'on',

		isActive: formData.get('isActive') === 'on',

		altText: getString(formData, 'altText'),

		description: getString(formData, 'description'),
	}
}

export async function createComponentMedia(
	formData: FormData,
) {
	await requireAdmin()

	const componentId = getId(formData, 'componentId')
	const values = getMediaValues(formData)

	await db
		.insert(componentMedia)
		.values({
			componentId,
			...values,
		})

	revalidatePath(
		`/admin/components/${componentId.toString()}`,
	)
}

export async function updateComponentMedia(
	formData: FormData,
) {
	await requireAdmin()

	const id = getId(formData, 'id')
	const componentId = getId(formData, 'componentId')
	const values = getMediaValues(formData)

	await db
		.update(componentMedia)
		.set(values)
		.where(eq(componentMedia.id, id))

	revalidatePath(
		`/admin/components/${componentId.toString()}`,
	)
}

export async function deleteComponentMedia(
	formData: FormData,
) {
	await requireAdmin()

	const id = getId(formData, 'id')
	const componentId = getId(formData, 'componentId')

	const [media] = await db
		.select({
			fileUrl: componentMedia.fileUrl,
		})
		.from(componentMedia)
		.where(eq(componentMedia.id, id))
		.limit(1)

	if (media) {
		await db
			.delete(componentMedia)
			.where(eq(componentMedia.id, id))

		try {
			const { deleteFile } = await import('@/lib/storage')

			await deleteFile(media.fileUrl)
		} catch {
			// Запись из БД уже удалена.
			// Если физический файл отсутствует,
			// это не должно ломать удаление.
		}
	}

	revalidatePath(
		`/admin/components/${componentId.toString()}`,
	)
}
