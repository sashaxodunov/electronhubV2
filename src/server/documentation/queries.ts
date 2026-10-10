
import 'server-only'

import { and, asc, eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import { documentation, documentationFiles } from '@/db/schema'

/**
 * Список опубликованных схем в конкретной категории.
 */
export async function getPublishedDocumentationByCategory(
	categorySlug: string,
) {
	const items = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			description: documentation.description,
			updatedAt: documentation.updatedAt,
		})
		.from(documentation)
		.where(
			and(
				eq(documentation.categorySlug, categorySlug),
				eq(documentation.status, 'published'),
			),
		)
		.orderBy(asc(documentation.title))

	if (items.length === 0) {
		return []
	}

	const result = await Promise.all(
		items.map(async (item) => {
			const files = await db
				.select({
					id: documentationFiles.id,
					originalName: documentationFiles.originalName,
					contentType: documentationFiles.contentType,
					sizeBytes: documentationFiles.sizeBytes,
					isPrimary: documentationFiles.isPrimary,
				})
				.from(documentationFiles)
				.where(
					eq(documentationFiles.documentationId, item.id),
				)
				.orderBy(
					asc(documentationFiles.sortOrder),
					asc(documentationFiles.id),
				)

			return {
				...item,
				id: item.id.toString(),
				files: files.map((file) => ({
					...file,
					id: file.id.toString(),
					sizeBytes: file.sizeBytes,
				})),
			}
		}),
	)

	return result
}


/**
 * Опубликованный документ в конкретной категории.
 */
export async function getPublishedDocumentationByCategoryAndSlug(
	categorySlug: string,
	slug: string,
) {
	const [item] = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			description: documentation.description,
			updatedAt: documentation.updatedAt,
		})
		.from(documentation)
		.where(
			and(
				eq(documentation.categorySlug, categorySlug),
				eq(documentation.slug, slug),
				eq(documentation.status, 'published'),
			),
		)
		.limit(1)

	if (!item) {
		return null
	}

	const files = await db
		.select({
			id: documentationFiles.id,
			originalName: documentationFiles.originalName,
			objectKey: documentationFiles.objectKey,
			contentType: documentationFiles.contentType,
			sizeBytes: documentationFiles.sizeBytes,
			isPrimary: documentationFiles.isPrimary,
			sortOrder: documentationFiles.sortOrder,
		})
		.from(documentationFiles)
		.where(
			eq(documentationFiles.documentationId, item.id),
		)
		.orderBy(
			asc(documentationFiles.sortOrder),
			asc(documentationFiles.id),
		)

	return {
		...item,
		id: item.id.toString(),
		files: files.map((file) => ({
			...file,
			id: file.id.toString(),
		})),
	}
}


/**
 * Одна опубликованная схема по URL-slug.
 */
export async function getPublishedDocumentationBySlug(
	slug: string,
) {
	const [item] = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			description: documentation.description,
			updatedAt: documentation.updatedAt,
		})
		.from(documentation)
		.where(
			and(
				eq(documentation.slug, slug),
				eq(documentation.status, 'published'),
			),
		)
		.limit(1)

	if (!item) {
		return null
	}

	const files = await db
		.select({
			id: documentationFiles.id,
			originalName: documentationFiles.originalName,
			contentType: documentationFiles.contentType,
			sizeBytes: documentationFiles.sizeBytes,
			isPrimary: documentationFiles.isPrimary,
			sortOrder: documentationFiles.sortOrder,
		})
		.from(documentationFiles)
		.where(
			eq(documentationFiles.documentationId, item.id),
		)
		.orderBy(
			asc(documentationFiles.sortOrder),
			asc(documentationFiles.id),
		)

	return {
		...item,
		id: item.id.toString(),
		files: files.map((file) => ({
			...file,
			id: file.id.toString(),
		})),
	}
}


/**
 * Список документов для административного каталога.
 * Включает черновики и опубликованные записи.
 */
export async function getAdminDocumentationList() {
	const items = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			status: documentation.status,
			updatedAt: documentation.updatedAt,
		})
		.from(documentation)
		.orderBy(asc(documentation.title))

	if (items.length === 0) {
		return []
	}

	const ids = items.map((item) => item.id)

	const files = await db
		.select({
			documentationId: documentationFiles.documentationId,
		})
		.from(documentationFiles)
		.where(
			inArray(documentationFiles.documentationId, ids),
		)

	const fileCounts = new Map<string, number>()

	for (const file of files) {
		const id = file.documentationId.toString()
		fileCounts.set(id, (fileCounts.get(id) ?? 0) + 1)
	}

	return items.map((item) => ({
		...item,
		id: item.id.toString(),
		fileCount: fileCounts.get(item.id.toString()) ?? 0,
	}))
}
