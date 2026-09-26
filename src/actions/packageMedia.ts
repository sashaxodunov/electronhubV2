'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { packageMedia, packageMediaType } from '@/db/schema'

function getString(
	formData: FormData,
	name: string
): string | null {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	return value || null
}

function getRequiredString(
	formData: FormData,
	name: string
): string {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	return value
}

function getNumber(
	formData: FormData,
	name: string
): number | null {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	if (!value) {
		return null
	}

	const number = Number(value)

	if (!Number.isFinite(number)) {
		throw new Error(
			`Некорректное значение поля ${name}`
		)
	}

	return number
}

function getBigInt(
	formData: FormData,
	name: string
): bigint | null {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	if (!value) {
		return null
	}

	if (!/^\d+$/.test(value)) {
		throw new Error(
			`Некорректное значение поля ${name}`
		)
	}

	return BigInt(value)
}

function getId(
	formData: FormData,
	name: string
): number {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	const id = Number(value)

	if (
		!Number.isSafeInteger(id) ||
		id <= 0
	) {
		throw new Error(
			`Некорректный ID: ${name}`
		)
	}

	return id
}

function getMediaType(
	formData: FormData
) {
	const value = getRequiredString(
		formData,
		'mediaType'
	)

	if (
		!packageMediaType.enumValues.includes(
			value as (typeof packageMediaType.enumValues)[number]
		)
	) {
		throw new Error(
			`Недопустимый тип медиа: ${value}`
		)
	}

	return value as (
		typeof packageMediaType.enumValues
	)[number]
}

function getMediaValues(formData: FormData) {
	return {
		mediaType: getMediaType(formData),

		title: getString(
			formData,
			'title'
		),

		fileUrl: getRequiredString(
			formData,
			'fileUrl'
		),

		mimeType: getString(
			formData,
			'mimeType'
		),

		fileSize: getBigInt(
			formData,
			'fileSize'
		),

		width: getNumber(
			formData,
			'width'
		),

		height: getNumber(
			formData,
			'height'
		),

		sortOrder:
			getNumber(
				formData,
				'sortOrder'
			) ?? 0,

		isPrimary:
			formData.get('isPrimary') === 'on',

		isActive:
			formData.get('isActive') === 'on',

		altText: getString(
			formData,
			'altText'
		),

		description: getString(
			formData,
			'description'
		)
	}
}

export async function createPackageVariantMedia(
	formData: FormData
) {
	const packageVariantId = getId(
		formData,
		'packageVariantId'
	)

	const values = getMediaValues(
		formData
	)

	await db
		.insert(packageMedia)
		.values({
			packageVariantId,
			...values
		})

	const packageId = getId(
		formData,
		'packageId'
	)

	redirect(
		`/admin/packages/${packageId}/variants/${packageVariantId}`
	)
}

export async function updatePackageVariantMedia(
	formData: FormData
) {
	const id = getId(
		formData,
		'id'
	)

	const packageId = getId(
		formData,
		'packageId'
	)

	const packageVariantId = getId(
		formData,
		'packageVariantId'
	)

	const values = getMediaValues(
		formData
	)

	await db
		.update(packageMedia)
		.set(values)
		.where(
			eq(
				packageMedia.id,
				BigInt(id)
			)
		)

	redirect(
		`/admin/packages/${packageId}/variants/${packageVariantId}`
	)
}

export async function deletePackageVariantMedia(formData: FormData) {
	const id = getId(formData, 'id')
	const packageId = getId(formData, 'packageId')
	const packageVariantId = getId(formData, 'packageVariantId')

	const [media] = await db
		.select({
			fileUrl: packageMedia.fileUrl
		})
		.from(packageMedia)
		.where(eq(packageMedia.id, BigInt(id)))
		.limit(1)

	if (media) {
		await db
			.delete(packageMedia)
			.where(eq(packageMedia.id, BigInt(id)))

		try {
			const { deleteFile } = await import('@/lib/storage')

			await deleteFile(media.fileUrl)
		} catch {
			// Файл мог быть уже удалён.
			// Запись из БД всё равно должна быть удалена.
		}
	}

	redirect(`/admin/packages/${packageId}/variants/${packageVariantId}`)
}