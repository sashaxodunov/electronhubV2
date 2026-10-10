
'use server'

import 'server-only'

import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import {
	datasheets,
	datasheetStorageCleanup,
} from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
	deleteStoredObject,
	uploadPdf,
} from '@/lib/storage/s3'

const MAX_PDF_SIZE = Number(
	process.env.DATASHEET_MAX_SIZE ?? 20 * 1024 * 1024,
)

const MAX_ID = /^[1-9]\d*$/

/**
 * Допускает:
 * Новый формат: components/02/2/datasheets/<uuid>.pdf
 * Старый формат: components/2/documents/datasheets/<uuid>.pdf
 *
 * Старый формат оставлен для корректного удаления уже загруженных PDF.
 */
const OWNED_KEY =
	/^components\/(?:\d{2}\/)?([1-9]\d*)\/(?:documents\/)?datasheets\/[0-9a-f-]+\.pdf$/i

function text(formData: FormData, name: string): string {
	const value = formData.get(name)
	return typeof value === 'string' ? value.trim() : ''
}

function parseId(value: string, label: string): bigint {
	if (!MAX_ID.test(value)) {
		throw new Error(`Некорректный идентификатор: ${label}`)
	}

	return BigInt(value)
}

function parseOptionalInteger(
	value: string,
	label: string,
): number | null {
	if (!value) return null

	if (!/^\d+$/.test(value)) {
		throw new Error(`Поле «${label}» должно быть целым числом`)
	}

	const result = Number(value)

	if (!Number.isSafeInteger(result) || result < 0) {
		throw new Error(`Некорректное значение поля «${label}»`)
	}

	return result
}

function parseDate(value: string): string | null {
	if (!value) return null

	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

	if (!match) {
		throw new Error(
			'Некорректная дата документа. Используй формат ГГГГ-ММ-ДД.',
		)
	}

	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])

	const leapYear =
		year % 4 === 0 &&
		(year % 100 !== 0 || year % 400 === 0)

	const daysInMonth = [
		31,
		leapYear ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	]

	if (
		year < 1 ||
		month < 1 ||
		month > 12 ||
		day < 1 ||
		day > daysInMonth[month - 1]
	) {
		throw new Error('Указана несуществующая дата документа.')
	}

	return value
}

function parseSourceUrl(value: string): string | null {
	if (!value) return null

	let url: URL

	try {
		url = new URL(value)
	} catch {
		throw new Error('Некорректный URL производителя')
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		throw new Error('URL должен начинаться с http:// или https://')
	}

	return url.toString()
}

function readMetadata(formData: FormData) {
	const title = text(formData, 'title')
	const documentType = text(formData, 'documentType')
	const language = text(formData, 'language') || 'en'
	const revision = text(formData, 'revision')
	const documentDate = parseDate(text(formData, 'documentDate'))
	const pageCount = parseOptionalInteger(
		text(formData, 'pageCount'),
		'Количество страниц',
	)
	const sourceUrl = parseSourceUrl(text(formData, 'sourceUrl'))
	const description = text(formData, 'description') || null

	if (!title || title.length > 500) {
		throw new Error(
			'Название документа обязательно и не должно превышать 500 символов',
		)
	}

	if (
		!['datasheet', 'manual', 'application_note', 'other'].includes(
			documentType,
		)
	) {
		throw new Error('Недопустимый тип документа')
	}

	if (language.length > 20) {
		throw new Error('Код языка слишком длинный')
	}

	if (revision.length > 100) {
		throw new Error('Ревизия не должна превышать 100 символов')
	}

	if (pageCount !== null && pageCount < 1) {
		throw new Error('Количество страниц должно быть больше нуля')
	}

	return {
		title,
		documentType: documentType as
			| 'datasheet'
			| 'manual'
			| 'application_note'
			| 'other',
		language,
		revision: revision || null,
		documentDate,
		pageCount,
		sourceUrl,
		description,
		isPrimary: formData.get('isPrimary') === 'on',
		isActive: formData.get('isActive') === 'on',
	}
}

async function readPdf(formData: FormData) {
	const file = formData.get('file')

	if (!(file instanceof File) || file.size === 0) {
		throw new Error('Выбери PDF-файл для загрузки')
	}

	if (file.size > MAX_PDF_SIZE) {
		throw new Error(
			`PDF превышает допустимый размер ${Math.floor(MAX_PDF_SIZE / 1024 / 1024)} MiB`,
		)
	}

	const originalName = file.name || 'datasheet.pdf'

	if (!originalName.toLowerCase().endsWith('.pdf')) {
		throw new Error('Разрешены только файлы с расширением PDF')
	}

	const buffer = Buffer.from(await file.arrayBuffer())

	if (
		buffer.length < 5 ||
		buffer.subarray(0, 5).toString('ascii') !== '%PDF-'
	) {
		throw new Error('Файл не имеет корректной PDF-сигнатуры')
	}

	const safeName = originalName
		.replace(/[\\/\r\n"]/g, '_')
		.slice(-255)

	return {
		buffer,
		fileName: safeName || 'datasheet.pdf',
		fileSize: BigInt(buffer.length),
	}
}

function componentPath(componentId: bigint): string {
	return `/admin/components/${componentId.toString()}?tab=datasheets`
}

/**
 * Группировка по последним двум цифрам ID:
 * 1 -> 01, 2 -> 02, 99 -> 99, 100 -> 00, 101 -> 01.
 */
function componentStorageGroup(componentId: bigint): string {
	return String(componentId % BigInt(100)).padStart(2, '0')
}

function isOwnedKey(key: string, componentId: bigint): boolean {
	const match = OWNED_KEY.exec(key)
	return Boolean(match && match[1] === componentId.toString())
}

async function queueCleanup(key: string): Promise<void> {
	await db
		.insert(datasheetStorageCleanup)
		.values({
			objectKey: key,
			attempts: 1,
			lastError: 'Не удалось удалить файл из S3',
		})
		.onConflictDoNothing({
			target: datasheetStorageCleanup.objectKey,
		})
}

async function cleanupOrQueue(key: string): Promise<void> {
	try {
		await deleteStoredObject(key)

		await db
			.delete(datasheetStorageCleanup)
			.where(eq(datasheetStorageCleanup.objectKey, key))
	} catch {
		await queueCleanup(key)
	}
}

export async function createDatasheet(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(
		text(formData, 'componentId'),
		'componentId',
	)

	const metadata = readMetadata(formData)
	const pdf = await readPdf(formData)

	const group = componentStorageGroup(componentId)
	const objectKey =
		`components/${group}/${componentId.toString()}/datasheets/${randomUUID()}.pdf`

	let uploaded = false

	try {
		await uploadPdf(objectKey, pdf.buffer)
		uploaded = true

		await db.transaction(async (tx) => {
			if (metadata.isPrimary) {
				await tx
					.update(datasheets)
					.set({ isPrimary: false })
					.where(eq(datasheets.componentId, componentId))
			}

			await tx.insert(datasheets).values({
				componentId,
				...metadata,
				filePath: objectKey,
				fileName: pdf.fileName,
				mimeType: 'application/pdf',
				fileSize: pdf.fileSize,
			})
		})
	} catch (error) {
		if (uploaded) {
			await cleanupOrQueue(objectKey)
		}

		throw error
	}

	revalidatePath('/admin')
	revalidatePath('/admin/components')
	revalidatePath(componentPath(componentId))
	redirect(componentPath(componentId))
}

export async function updateDatasheet(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(
		text(formData, 'componentId'),
		'componentId',
	)

	const datasheetId = parseId(
		text(formData, 'datasheetId'),
		'datasheetId',
	)

	const metadata = readMetadata(formData)

	await db.transaction(async (tx) => {
		const [existing] = await tx
			.select({ id: datasheets.id })
			.from(datasheets)
			.where(
				and(
					eq(datasheets.id, datasheetId),
					eq(datasheets.componentId, componentId),
				),
			)
			.limit(1)

		if (!existing) {
			throw new Error('Документ не найден')
		}

		if (metadata.isPrimary) {
			await tx
				.update(datasheets)
				.set({ isPrimary: false })
				.where(eq(datasheets.componentId, componentId))
		}

		await tx
			.update(datasheets)
			.set(metadata)
			.where(
				and(
					eq(datasheets.id, datasheetId),
					eq(datasheets.componentId, componentId),
				),
			)
	})

	revalidatePath('/admin')
	revalidatePath(componentPath(componentId))
	redirect(componentPath(componentId))
}

export async function deleteDatasheet(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(
		text(formData, 'componentId'),
		'componentId',
	)

	const datasheetId = parseId(
		text(formData, 'datasheetId'),
		'datasheetId',
	)

	const [item] = await db
		.select({
			id: datasheets.id,
			filePath: datasheets.filePath,
		})
		.from(datasheets)
		.where(
			and(
				eq(datasheets.id, datasheetId),
				eq(datasheets.componentId, componentId),
			),
		)
		.limit(1)

	if (!item) {
		throw new Error('Документ не найден')
	}

	const owned = isOwnedKey(item.filePath, componentId)

	await db.transaction(async (tx) => {
		if (owned) {
			await tx
				.insert(datasheetStorageCleanup)
				.values({
					objectKey: item.filePath,
					attempts: 0,
					lastError: null,
				})
				.onConflictDoNothing({
					target: datasheetStorageCleanup.objectKey,
				})
		}

		await tx
			.delete(datasheets)
			.where(
				and(
					eq(datasheets.id, datasheetId),
					eq(datasheets.componentId, componentId),
				),
			)
	})

	if (owned) {
		await cleanupOrQueue(item.filePath)
	}

	revalidatePath('/admin')
	revalidatePath(componentPath(componentId))
	redirect(componentPath(componentId))
}

export async function retryDatasheetCleanup(formData: FormData) {
	await requireAdmin()

	const jobId = parseId(text(formData, 'jobId'), 'jobId')

	const [job] = await db
		.select()
		.from(datasheetStorageCleanup)
		.where(eq(datasheetStorageCleanup.id, jobId))
		.limit(1)

	if (!job) {
		throw new Error('Задача очистки не найдена')
	}

	if (!OWNED_KEY.test(job.objectKey)) {
		throw new Error('Недопустимый ключ объекта для удаления')
	}

	try {
		await deleteStoredObject(job.objectKey)

		await db
			.delete(datasheetStorageCleanup)
			.where(eq(datasheetStorageCleanup.id, jobId))
	} catch (error) {
		await db
			.update(datasheetStorageCleanup)
			.set({
				attempts: job.attempts + 1,
				lastError:
					error instanceof Error
						? error.message.slice(0, 2000)
						: 'Неизвестная ошибка',
			})
			.where(eq(datasheetStorageCleanup.id, jobId))

		throw new Error(
			'Не удалось удалить файл. Задача сохранена для повтора.',
		)
	}

	revalidatePath('/admin/storage-cleanup')
	redirect('/admin/storage-cleanup')
}
