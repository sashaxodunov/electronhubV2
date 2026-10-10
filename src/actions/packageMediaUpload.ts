
'use server'

import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'
import { imageSize } from 'image-size'

import { db } from '@/db'
import {
	packageMediaType,
	packageVariants,
} from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
	packageVariantPath,
	saveFile,
} from '@/lib/storage'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const ALLOWED_TYPES = new Set([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/svg+xml',
	'application/pdf',
])

const ALLOWED_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.webp',
	'.gif',
	'.svg',
	'.pdf',
])

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

function getVariantId(
	formData: FormData,
): number {
	const value = getRequiredString(
		formData,
		'packageVariantId',
	)

	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный ID варианта корпуса')
	}

	const id = Number(value)

	if (!Number.isSafeInteger(id) || id <= 0) {
		throw new Error('Некорректный ID варианта корпуса')
	}

	return id
}

function getMediaType(
	formData: FormData,
): (typeof packageMediaType.enumValues)[number] {
	const value = getRequiredString(formData, 'mediaType')

	if (
		!packageMediaType.enumValues.includes(
			value as (typeof packageMediaType.enumValues)[number],
		)
	) {
		throw new Error(`Недопустимый тип медиа: ${value}`)
	}

	return value as (typeof packageMediaType.enumValues)[number]
}

function sanitizeFileName(fileName: string): string {
	const withoutPath =
		fileName.replace(/\\/g, '/').split('/').pop() ?? 'file'

	const extensionIndex = withoutPath.lastIndexOf('.')

	const name =
		extensionIndex > 0
			? withoutPath.slice(0, extensionIndex)
			: withoutPath

	return (
		name
			.normalize('NFKD')
			.replace(/[^\w.-]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '')
			.toLowerCase()
			.slice(0, 100) || 'file'
	)
}

function getExtension(fileName: string): string {
	const dotIndex = fileName.lastIndexOf('.')

	if (dotIndex === -1) {
		return ''
	}

	return fileName.slice(dotIndex).toLowerCase()
}

function getStorageFolder(mediaType: string): string {
	switch (mediaType) {
		case 'image':
		case 'svg':
			return 'images'

		case 'drawing':
			return 'drawings'

		case '3d':
		case 'model':
			return 'models'

		case 'pdf':
		case 'datasheet':
		case 'other':
		default:
			return 'documents'
	}
}

function getDimensions(
	buffer: Buffer,
	mimeType: string,
): {
	width: number | null
	height: number | null
} {
	if (
		mimeType === 'image/svg+xml' ||
		mimeType === 'application/pdf'
	) {
		return {
			width: null,
			height: null,
		}
	}

	try {
		const dimensions = imageSize(buffer)

		return {
			width: dimensions.width ?? null,
			height: dimensions.height ?? null,
		}
	} catch {
		return {
			width: null,
			height: null,
		}
	}
}

export async function uploadPackageMedia(
	formData: FormData,
) {
	await requireAdmin()

	const packageVariantId = getVariantId(formData)
	const mediaType = getMediaType(formData)
	const fileValue = formData.get('file')

	if (!(fileValue instanceof File)) {
		throw new Error('Файл не выбран')
	}

	if (fileValue.size <= 0) {
		throw new Error('Файл пустой')
	}

	if (fileValue.size > MAX_FILE_SIZE) {
		throw new Error('Размер файла не должен превышать 20 МБ')
	}

	const extension = getExtension(fileValue.name)

	if (!ALLOWED_EXTENSIONS.has(extension)) {
		throw new Error(
			`Недопустимое расширение файла: ${extension || 'неизвестно'}`,
		)
	}

	if (!ALLOWED_TYPES.has(fileValue.type)) {
		throw new Error(
			`Недопустимый тип файла: ${fileValue.type || 'неизвестно'}`,
		)
	}

	const [variant] = await db
		.select({
			id: packageVariants.id,
		})
		.from(packageVariants)
		.where(
			eq(
				packageVariants.id,
				BigInt(packageVariantId),
			),
		)
		.limit(1)

	if (!variant) {
		throw new Error('Вариант корпуса не найден')
	}

	const buffer = Buffer.from(await fileValue.arrayBuffer())

	const { width, height } = getDimensions(
		buffer,
		fileValue.type,
	)

	const safeName = sanitizeFileName(fileValue.name)

	const uniqueName =
		`${Date.now()}-${randomUUID()}-${safeName}${extension}`

	const folder = getStorageFolder(mediaType)

	const fileUrl = packageVariantPath(
		BigInt(packageVariantId),
		folder,
		uniqueName,
	)

	await saveFile(fileUrl, buffer)

	return {
		fileUrl,
		mimeType: fileValue.type || null,
		fileSize: fileValue.size,
		width,
		height,
		originalName: fileValue.name,
	}
}
