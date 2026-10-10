
'use server'

import 'server-only'

import { randomUUID } from 'node:crypto'
import { and, asc, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { documentation, documentationFiles } from '@/db/schema'
import {
	deleteStoredObject,
	uploadPdf,
} from '@/lib/storage/s3'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const MAX_FILES_PER_DOCUMENT = 30
const MAX_ID = /^[1-9]\d*$/

function parseId(value: FormDataEntryValue | null): bigint {
	if (typeof value !== 'string' || !MAX_ID.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

async function getDocument(id: bigint) {
	const [item] = await db
		.select({
			id: documentation.id,
			categorySlug: documentation.categorySlug,
			slug: documentation.slug,
			status: documentation.status,
		})
		.from(documentation)
		.where(eq(documentation.id, id))
		.limit(1)

	if (!item) {
		throw new Error('Документ не найден')
	}

	return item
}

async function refreshDocumentPaths(
	categorySlug: string,
	slug: string,
) {
	revalidatePath('/admin/documentation')
	revalidatePath('/documentation')
	revalidatePath(`/ documentation / ${categorySlug} `)
	revalidatePath(`/ documentation / ${categorySlug}/${slug}`)
}

export async function uploadDocumentationFile(
	formData: FormData,
) {
	const documentId = parseId(formData.get('documentId'))
	const file = formData.get('file')

	if (!(file instanceof File) || file.size === 0) {
		throw new Error('Выберите PDF-файл')
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error('Максимальный размер PDF — 20 МБ')
	}

	if (
		file.type !== 'application/pdf' &&
		!file.name.toLowerCase().endsWith('.pdf')
	) {
		throw new Error('Разрешены только PDF-файлы')
	}

	const document = await getDocument(documentId)

	const existingFiles = await db
		.select({ id: documentationFiles.id })
		.from(documentationFiles)
		.where(eq(documentationFiles.documentationId, documentId))

	if (existingFiles.length >= MAX_FILES_PER_DOCUMENT) {
		throw new Error('Достигнут лимит: 30 файлов на документ')
	}

	const bytes = Buffer.from(await file.arrayBuffer())

	// Проверяем сигнатуру PDF, а не только имя и MIME-тип.
	if (
		bytes.length < 5 ||
		bytes.subarray(0, 5).toString('ascii') !== '%PDF-'
	) {
		throw new Error('Файл не имеет корректной сигнатуры PDF')
	}

	const safeName = file.name
		.replace(/[/\\]/g, '_')
		.replace(/[^\p{L}\p{N}._() -]/gu, '_')
		.trim()
		.slice(0, 220) || 'document.pdf'

	const objectKey =
		`documentation/${documentId.toString()}/${randomUUID()}.pdf`

	// Сначала загружаем объект в S3.
	await uploadPdf(objectKey, bytes)

	try {
		const [created] = await db
			.insert(documentationFiles)
			.values({
				documentationId: documentId,
				originalName: safeName,
				objectKey,
				contentType: 'application/pdf',
				sizeBytes: bytes.length,
				isPrimary: existingFiles.length === 0,
				sortOrder: existingFiles.length,
			})
			.returning({ id: documentationFiles.id })

		await refreshDocumentPaths(
			document.categorySlug,
			document.slug,
		)

		return {
			success: true,
			id: created.id.toString(),
			name: safeName,
		}
	} catch (error) {
		// Не оставляем объект в S3, если запись в БД не создана.
		try {
			await deleteStoredObject(objectKey)
		} catch (cleanupError) {
			console.error(
				'Не удалось удалить объект после ошибки БД:',
				cleanupError,
			)
		}

		throw error
	}
}

export async function deleteDocumentationFile(
	formData: FormData,
) {
	const fileId = parseId(formData.get('fileId'))

	const [file] = await db
		.select({
			id: documentationFiles.id,
			documentationId: documentationFiles.documentationId,
			objectKey: documentationFiles.objectKey,
			isPrimary: documentationFiles.isPrimary,
		})
		.from(documentationFiles)
		.where(eq(documentationFiles.id, fileId))
		.limit(1)

	if (!file) {
		throw new Error('Файл не найден')
	}

	const document = await getDocument(file.documentationId)

	// Удаляем объект из S3 до удаления записи из БД.
	await deleteStoredObject(file.objectKey)

	await db
		.delete(documentationFiles)
		.where(eq(documentationFiles.id, fileId))

	const remaining = await db
		.select({ id: documentationFiles.id })
		.from(documentationFiles)
		.where(eq(
			documentationFiles.documentationId,
			file.documentationId,
		))
		.orderBy(asc(documentationFiles.sortOrder), asc(documentationFiles.id))

	// Если удалили основной файл, назначаем следующий.
	if (file.isPrimary && remaining.length > 0) {
		await db
			.update(documentationFiles)
			.set({ isPrimary: true })
			.where(eq(documentationFiles.id, remaining[0].id))
	}

	await refreshDocumentPaths(
		document.categorySlug,
		document.slug,
	)

	return { success: true }
}

export async function setPrimaryDocumentationFile(
	formData: FormData,
) {
	const fileId = parseId(formData.get('fileId'))

	const [file] = await db
		.select({
			id: documentationFiles.id,
			documentationId: documentationFiles.documentationId,
		})
		.from(documentationFiles)
		.where(eq(documentationFiles.id, fileId))
		.limit(1)

	if (!file) {
		throw new Error('Файл не найден')
	}

	const document = await getDocument(file.documentationId)

	// В транзакции сбрасываем прежний основной файл и назначаем новый.
	await db.transaction(async (tx) => {
		await tx
			.update(documentationFiles)
			.set({ isPrimary: false })
			.where(and(
				eq(
					documentationFiles.documentationId,
					file.documentationId,
				),
				ne(documentationFiles.id, fileId),
			))

		await tx
			.update(documentationFiles)
			.set({ isPrimary: true })
			.where(eq(documentationFiles.id, fileId))
	})

	await refreshDocumentPaths(
		document.categorySlug,
		document.slug,
	)

	return { success: true }
}

export async function reorderDocumentationFiles(
	formData: FormData,
) {
	const documentId = parseId(formData.get('documentId'))
	const rawIds = formData.getAll('fileIds')

	if (
		rawIds.length > MAX_FILES_PER_DOCUMENT ||
		rawIds.some((id) => typeof id !== 'string' || !MAX_ID.test(id))
	) {
		throw new Error('Некорректный список файлов')
	}

	const ids = rawIds.map((id) => BigInt(id as string))

	if (new Set(ids.map(String)).size !== ids.length) {
		throw new Error('Список содержит повторяющиеся файлы')
	}

	const document = await getDocument(documentId)

	await db.transaction(async (tx) => {
		const existing = await tx
			.select({ id: documentationFiles.id })
			.from(documentationFiles)
			.where(eq(
				documentationFiles.documentationId,
				documentId,
			))

		if (
			existing.length !== ids.length ||
			existing.some((item) => !ids.some((id) => id === item.id))
		) {
			throw new Error('Список файлов документа изменился')
		}

		for (const [index, id] of ids.entries()) {
			await tx
				.update(documentationFiles)
				.set({ sortOrder: index })
				.where(and(
					eq(documentationFiles.id, id),
					eq(documentationFiles.documentationId, documentId),
				))
		}
	})

	await refreshDocumentPaths(
		document.categorySlug,
		document.slug,
	)

	return { success: true }
}