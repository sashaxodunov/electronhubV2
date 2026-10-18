'use server'

import 'server-only'

import { randomUUID } from 'node:crypto'
import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import {
	documentation,
	documentationSubcategories
} from '@/db/schema'
import { documentationFiles } from '@/db/schema/documentation-files'
import { electronicsBrands } from '@/db/schema/electronics-brands'
import { documentationCategories } from '@/config/categories'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
	deleteDocumentationFile,
	saveDocumentationFile
} from '@/lib/storage/documentation-storage'

const MAX_ID = /^[1-9]\d*$/
const MAX_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const MAX_BIGINT = BigInt('9223372036854775807')

const MAX_PDF_SIZE = 20 * 1024 * 1024
const MAX_OTHER_FILE_SIZE = 100 * 1024 * 1024

const DOCUMENT_TYPES = [
	'schematic',
	'boardview',
	'cad',
	'manual'
] as const

type DocumentType = (typeof DOCUMENT_TYPES)[number]

const ALLOWED_EXTENSIONS: Record<DocumentType, string[]> = {
	schematic: ['djvu', 'jpg', 'pdf'],
	boardview: ['brd', 'bdv', 'boardview'],
	cad: ['cad'],
	manual: ['pdf']
}

type DocumentationUpload = {
	bytes: Buffer
	originalName: string
	contentType: string
	fileExtension: string
}

function readText(formData: FormData, name: string): string {
	const value = formData.get(name)

	return typeof value === 'string' ? value.trim() : ''
}

function parseId(
	value: string,
	fieldName = 'идентификатор документа'
): bigint {
	if (!MAX_ID.test(value)) {
		throw new Error(`Некорректный ${fieldName} `)
	}

	const id = BigInt(value)

	if (id > MAX_BIGINT) {
		throw new Error(`${fieldName} вне допустимого диапазона`)
	}

	return id
}

function readDocument(formData: FormData) {
	const title = readText(formData, 'title')
	const slug = readText(formData, 'slug')
	const categorySlug = readText(formData, 'categorySlug')
	const description = readText(formData, 'description') || null
	const status = readText(formData, 'status')
	const documentType = readText(formData, 'documentType')
	const subcategoryRaw = readText(formData, 'subcategoryId')
	const brandRaw = readText(formData, 'brandId')

	const subcategoryId =
		subcategoryRaw !== ''
			? parseId(subcategoryRaw, 'идентификатор подкатегории')
			: null

	const brandId =
		brandRaw !== ''
			? parseId(brandRaw, 'идентификатор бренда')
			: null

	if (!title || title.length > 255) {
		throw new Error(
			'Название обязательно и должно содержать не более 255 символов'
		)
	}

	if (!MAX_SLUG.test(slug) || slug.length > 255) {
		throw new Error(
			'Slug должен содержать латинские буквы в нижнем регистре, цифры и дефисы; дефисы не могут стоять в начале, в конце или подряд'
		)
	}

	if (
		!documentationCategories.some(
			category => category.slug === categorySlug
		)
	) {
		throw new Error('Выбрана неизвестная категория')
	}

	if (!['draft', 'published'].includes(status)) {
		throw new Error('Недопустимый статус документа')
	}

	if (
		!DOCUMENT_TYPES.includes(documentType as DocumentType)
	) {
		throw new Error('Выбран неизвестный тип документа')
	}

	if (description && description.length > 10000) {
		throw new Error('Описание не должно превышать 10 000 символов')
	}

	return {
		title,
		slug,
		categorySlug,
		subcategoryId,
		brandId,
		description,
		status,
		documentType: documentType as DocumentType
	}
}

async function ensureUniqueSlug(
	slug: string,
	exceptId?: bigint
) {
	const conditions = [eq(documentation.slug, slug)]

	if (exceptId !== undefined) {
		conditions.push(ne(documentation.id, exceptId))
	}

	const [existing] = await db
		.select({ id: documentation.id })
		.from(documentation)
		.where(and(...conditions))
		.limit(1)

	if (existing) {
		throw new Error(`Slug «${slug}» уже используется другим документом`)
	}
}

async function ensureSubcategoryMatchesCategory(
	categorySlug: string,
	subcategoryId: bigint | null
) {
	if (subcategoryId === null) {
		return
	}

	const [subcategory] = await db
		.select({
			id: documentationSubcategories.id,
			categorySlug: documentationSubcategories.categorySlug
		})
		.from(documentationSubcategories)
		.where(eq(documentationSubcategories.id, subcategoryId))
		.limit(1)

	if (!subcategory) {
		throw new Error('Выбранная подкатегория не найдена')
	}

	if (subcategory.categorySlug !== categorySlug) {
		throw new Error(
			'Выбранная подкатегория не принадлежит выбранной категории'
		)
	}
}

async function ensureBrandExists(brandId: bigint | null) {
	if (brandId === null) {
		return
	}

	const [brand] = await db
		.select({ id: electronicsBrands.id })
		.from(electronicsBrands)
		.where(eq(electronicsBrands.id, brandId))
		.limit(1)

	if (!brand) {
		throw new Error('Выбранный бренд не найден')
	}
}

async function readDocumentationFile(
	formData: FormData,
	documentType: DocumentType
): Promise<DocumentationUpload | null> {
	const value = formData.get('file')

	if (
		value === null ||
		typeof value === 'string' ||
		value.size === 0
	) {
		return null
	}

	const rawName = value.name.split(/[\\/]/).pop() ?? ''

	const safeName = rawName
		.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim()
		.slice(0, 255)

	if (!safeName) {
		throw new Error('Не удалось определить имя файла')
	}

	const dotIndex = safeName.lastIndexOf('.')

	if (dotIndex <= 0 || dotIndex === safeName.length - 1) {
		throw new Error('У файла должно быть корректное расширение')
	}

	const fileExtension = safeName
		.slice(dotIndex + 1)
		.toLowerCase()

	const allowedExtensions = ALLOWED_EXTENSIONS[documentType]

	if (!allowedExtensions.includes(fileExtension)) {
		throw new Error(
			`Для выбранного типа документа разрешены файлы: ${allowedExtensions
				.map(extension => `.${extension}`)
				.join(', ')
			} `
		)
	}

	const isPdf = fileExtension === 'pdf'
	const maxSize = isPdf ? MAX_PDF_SIZE : MAX_OTHER_FILE_SIZE

	if (value.size > maxSize) {
		throw new Error(
			isPdf
				? 'Размер PDF не должен превышать 20 МБ'
				: 'Размер файла не должен превышать 100 МБ'
		)
	}

	if (isPdf && value.type && value.type !== 'application/pdf') {
		throw new Error('Тип PDF-файла должен быть application/pdf')
	}

	const bytes = Buffer.from(await value.arrayBuffer())

	if (bytes.length === 0) {
		throw new Error('Загруженный файл пуст')
	}

	if (bytes.length > maxSize) {
		throw new Error('Размер файла превышает допустимый лимит')
	}

	if (
		isPdf &&
		(
			bytes.length < 5 ||
			bytes.subarray(0, 5).toString('ascii') !== '%PDF-'
		)
	) {
		throw new Error('Файл не имеет корректной сигнатуры PDF')
	}

	return {
		bytes,
		originalName: safeName,
		contentType: isPdf
			? 'application/pdf'
			: 'application/octet-stream',
		fileExtension
	}
}

async function attachDocumentationFile(
	documentId: bigint,
	file: DocumentationUpload | null
) {
	if (!file) {
		return
	}

	const objectKey =
		`documents / ${documentId.toString()}/${randomUUID()}.${file.fileExtension}`

	await saveDocumentationFile(
		objectKey,
		file.bytes,
		file.contentType
	)

	try {
		await db.transaction(async tx => {
			await tx
				.update(documentationFiles)
				.set({ isPrimary: false })
				.where(eq(documentationFiles.documentationId, documentId))

			await tx.insert(documentationFiles).values({
				documentationId: documentId,
				originalName: file.originalName,
				objectKey,
				contentType: file.contentType,
				fileExtension: file.fileExtension,
				sizeBytes: file.bytes.length,
				isPrimary: true,
				sortOrder: 0
			})
		})
	} catch (error) {
		try {
			await deleteDocumentationFile(objectKey)
		} catch (cleanupError) {
			console.error(
				'Не удалось удалить файл после ошибки сохранения метаданных:',
				cleanupError
			)
		}

		throw error
	}
}

function revalidateDocumentationPaths(
	categorySlug?: string,
	slug?: string
) {
	revalidatePath('/admin/documentation')
	revalidatePath('/admin/documentation/subcategories')
	revalidatePath('/documentation')

	if (categorySlug && slug) {
		revalidatePath(`/documentation/${categorySlug}/${slug}`)
	}

	if (categorySlug) {
		revalidatePath(`/documentation/${categorySlug}`)
	}
}

export async function createDocumentation(formData: FormData) {
	await requireAdmin()

	const values = readDocument(formData)

	const file = await readDocumentationFile(
		formData,
		values.documentType
	)

	await ensureSubcategoryMatchesCategory(
		values.categorySlug,
		values.subcategoryId
	)

	await ensureBrandExists(values.brandId)
	await ensureUniqueSlug(values.slug)

	const [created] = await db
		.insert(documentation)
		.values(values)
		.returning({ id: documentation.id })

	if (!created) {
		throw new Error('Не удалось создать документ')
	}

	try {
		await attachDocumentationFile(created.id, file)
	} catch (error) {
		await db
			.delete(documentation)
			.where(eq(documentation.id, created.id))

		throw error
	}

	revalidateDocumentationPaths(values.categorySlug, values.slug)

	redirect(`/admin/documentation/${created.id.toString()}/edit`)
}

export async function updateDocumentation(formData: FormData) {
	await requireAdmin()

	const id = parseId(readText(formData, 'id'))
	const values = readDocument(formData)

	const file = await readDocumentationFile(
		formData,
		values.documentType
	)

	await ensureSubcategoryMatchesCategory(
		values.categorySlug,
		values.subcategoryId
	)

	await ensureBrandExists(values.brandId)
	await ensureUniqueSlug(values.slug, id)

	const [updated] = await db
		.update(documentation)
		.set({
			...values,
			updatedAt: new Date().toISOString()
		})
		.where(eq(documentation.id, id))
		.returning({ id: documentation.id })

	if (!updated) {
		throw new Error('Документ не найден')
	}

	await attachDocumentationFile(id, file)

	revalidateDocumentationPaths(values.categorySlug, values.slug)

	redirect(`/admin/documentation/${id.toString()}/edit`)
}