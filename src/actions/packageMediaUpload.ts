'use server'

import 'server-only'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { eq } from 'drizzle-orm'
import { imageSize } from 'image-size'

import { db } from '@/db'
import { packageVariants } from '@/db/schema'

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

const MAX_FILE_SIZE = 20 * 1024 * 1024

function getRequiredString(formData: FormData, name: string) {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(`Поле ${name} обязательно`)
	}

	return value
}

function getVariantId(formData: FormData) {
	const value = getRequiredString(formData, 'packageVariantId')
	const id = Number(value)

	if (!Number.isSafeInteger(id) || id <= 0) {
		throw new Error('Некорректный ID варианта корпуса')
	}

	return id
}

function sanitizeName(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-zа-яё0-9_-]/gi, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function getExtension(file: File) {
	const extension = path.extname(file.name).toLowerCase()

	if (!ALLOWED_EXTENSIONS.has(extension)) {
		throw new Error(
			`Недопустимое расширение файла: ${extension || 'отсутствует'}`
		)
	}

	return extension
}

function getDimensions(buffer: Buffer, mimeType: string, extension: string) {
	// PDF не является изображением
	if (mimeType === 'application/pdf' || extension === '.pdf') {
		return {
			width: null,
			height: null
		}
	}

	try {
		const dimensions = imageSize(buffer)

		return {
			width: typeof dimensions.width === 'number' ? dimensions.width : null,

			height: typeof dimensions.height === 'number' ? dimensions.height : null
		}
	} catch {
		// Если библиотека не смогла определить размеры,
		// файл всё равно можно сохранить.
		return {
			width: null,
			height: null
		}
	}
}

export async function uploadPackageMedia(formData: FormData) {
	const packageVariantId = getVariantId(formData)

	const file = formData.get('file')

	if (!(file instanceof File)) {
		throw new Error('Файл не выбран')
	}

	if (file.size <= 0) {
		throw new Error('Файл пустой')
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error('Размер файла не должен превышать 20 МБ')
	}

	const extension = getExtension(file)

	if (!ALLOWED_TYPES.has(file.type)) {
		throw new Error(`Недопустимый тип файла: ${file.type || 'неизвестный'}`)
	}

	/*
	 * Получаем slug варианта корпуса непосредственно
	 * из базы данных.
	 *
	 * Не доверяем packageSlug, переданному браузером.
	 */
	const [variant] = await db
		.select({
			slug: packageVariants.slug
		})
		.from(packageVariants)
		.where(eq(packageVariants.id, BigInt(packageVariantId)))
		.limit(1)

	if (!variant) {
		throw new Error('Вариант корпуса не найден')
	}

	const variantSlug = sanitizeName(variant.slug)

	if (!variantSlug) {
		throw new Error('У варианта корпуса отсутствует корректный slug')
	}

	/*
	 * Читаем файл в память.
	 */
	const buffer = Buffer.from(await file.arrayBuffer())

	/*
	 * Автоматически определяем размеры изображения.
	 *
	 * Для PDF width/height будут null.
	 */
	const { width, height } = getDimensions(buffer, file.type, extension)

	/*
	 * Безопасное имя исходного файла.
	 */
	const originalName = path
		.basename(file.name, extension)
		.replace(/[^a-zа-яё0-9_-]/gi, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase()

	const safeName = originalName || 'media'

	/*
	 * Добавляем timestamp, чтобы имена файлов
	 * не конфликтовали.
	 */
	const uniqueName = `${Date.now()}-${safeName}${extension}`

	/*
	 * Каталог:
	 *
	 * public/
	 * └── media/
	 *     └── packages/
	 *         └── <variant-slug>/
	 */
	const relativeDirectory = path.join('media', 'packages', variantSlug)

	const absoluteDirectory = path.join(
		process.cwd(),
		'public',
		relativeDirectory
	)

	await mkdir(absoluteDirectory, {
		recursive: true
	})

	/*
	 * Полный путь к файлу.
	 */
	const absolutePath = path.join(absoluteDirectory, uniqueName)

	await writeFile(absolutePath, buffer)

	/*
	 * URL для браузера.
	 */
	const fileUrl =
		'/' + path.join(relativeDirectory, uniqueName).replace(/\\/g, '/')

	return {
		fileUrl,
		mimeType: file.type || null,
		fileSize: file.size,
		width,
		height,
		originalName: file.name
	}
}
