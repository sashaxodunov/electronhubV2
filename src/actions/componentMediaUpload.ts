'use server'

import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'
import { imageSize } from 'image-size'

import { db } from '@/db'
import {
	assetType,
	components
} from '@/db/schema'
import {
	componentPath,
	saveFile
} from '@/lib/storage'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const ALLOWED_TYPES = new Set([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'image/svg+xml',
	'application/pdf'
])

const ALLOWED_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.webp',
	'.gif',
	'.svg',
	'.pdf'
])

function getRequiredString(
	formData: FormData,
	name: string
): string {
	const value = String(
		formData.get(name) ?? ''
	).trim()

	if (!value) {
		throw new Error(
			`Поле ${name} обязательно`
		)
	}

	return value
}

function getComponentId(
	formData: FormData
): bigint {
	const value = getRequiredString(
		formData,
		'componentId'
	)

	if (!/^\d+$/.test(value)) {
		throw new Error(
			'Некорректный ID компонента'
		)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(
			'Некорректный ID компонента'
		)
	}

	return id
}

function getAssetType(
	formData: FormData
) {
	const value = getRequiredString(
		formData,
		'assetType'
	)

	if (
		!assetType.enumValues.includes(
			value as (typeof assetType.enumValues)[number]
		)
	) {
		throw new Error(
			`Недопустимый тип ресурса: ${value}`
		)
	}

	return value as
		(typeof assetType.enumValues)[number]
}

function sanitizeFileName(
	fileName: string
): string {
	const withoutPath =
		fileName
			.replace(/\\/g, '/')
			.split('/')
			.pop() ?? 'file'

	const extensionIndex =
		withoutPath.lastIndexOf('.')

	const name =
		extensionIndex > 0
			? withoutPath.slice(
				0,
				extensionIndex
			)
			: withoutPath

	return (
		name
			.normalize('NFKD')
			.replace(/[^\w.-]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '')
			.toLowerCase()
			.slice(0, 100) || 'file'
	)
}

function getExtension(
	fileName: string
): string {
	const dotIndex =
		fileName.lastIndexOf('.')

	if (dotIndex === -1) {
		return ''
	}

	return fileName
		.slice(dotIndex)
		.toLowerCase()
}

function getStorageFolder(
	type: string
): string {
	switch (type) {
		case 'symbol':
			return 'symbols'

		case 'photo':
			return 'images'

		case 'schematic':
			return 'schematics'

		case 'application_circuit':
		case 'block_diagram':
			return 'schematics'

		case 'graph':
			return 'graphs'

		case 'table':
			return 'tables'

		case 'dimension':
			return 'dimensions'

		case 'marking':
			return 'markings'

		case 'package':
		case 'other':
		default:
			return 'documents'
	}
}

function getDimensions(
	buffer: Buffer,
	mimeType: string
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
			height: null
		}
	}

	try {
		const dimensions =
			imageSize(buffer)

		return {
			width:
				dimensions.width ?? null,
			height:
				dimensions.height ?? null
		}
	} catch {
		return {
			width: null,
			height: null
		}
	}
}

export async function uploadComponentMedia(
	formData: FormData
) {
	const componentId =
		getComponentId(formData)

	const type =
		getAssetType(formData)

	const fileValue =
		formData.get('file')

	if (!(fileValue instanceof File)) {
		throw new Error(
			'Файл не выбран'
		)
	}

	if (fileValue.size <= 0) {
		throw new Error(
			'Файл пустой'
		)
	}

	if (fileValue.size > MAX_FILE_SIZE) {
		throw new Error(
			'Размер файла не должен превышать 20 МБ'
		)
	}

	const extension =
		getExtension(fileValue.name)

	if (
		!ALLOWED_EXTENSIONS.has(
			extension
		)
	) {
		throw new Error(
			`Недопустимое расширение файла: ${extension || 'неизвестно'
			}`
		)
	}

	if (
		!ALLOWED_TYPES.has(
			fileValue.type
		)
	) {
		throw new Error(
			`Недопустимый тип файла: ${fileValue.type || 'неизвестно'
			}`
		)
	}

	const [component] =
		await db
			.select({
				id: components.id
			})
			.from(components)
			.where(
				eq(
					components.id,
					componentId
				)
			)
			.limit(1)

	if (!component) {
		throw new Error(
			'Компонент не найден'
		)
	}

	const buffer =
		Buffer.from(
			await fileValue.arrayBuffer()
		)

	const {
		width,
		height
	} = getDimensions(
		buffer,
		fileValue.type
	)

	const safeName =
		sanitizeFileName(
			fileValue.name
		)

	const uniqueName =
		`${randomUUID().slice(0, 8)}-${safeName}${extension}`

	const folder =
		getStorageFolder(type)

	const fileUrl =
		componentPath(
			componentId,
			folder,
			uniqueName
		)

	await saveFile(
		fileUrl,
		buffer
	)

	return {
		fileUrl,
		mimeType:
			fileValue.type || null,
		fileSize:
			fileValue.size,
		width,
		height,
		originalName:
			fileValue.name
	}
}