'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { glossaryTerms } from '@/db/schema'

type GlossaryTermInput = {
	term: string
	slug: string
	englishTerm?: string | null
	abbreviation?: string | null
	shortDefinition: string
	definition?: string | null
	categoryId?: bigint | null
	language?: string
	metaTitle?: string | null
	metaDescription?: string | null
	isActive?: boolean
}

export async function createGlossaryTerm(data: GlossaryTermInput) {
	const term = data.term.trim()
	const slug = data.slug.trim()
	const shortDefinition = data.shortDefinition.trim()

	if (!term) {
		throw new Error('Название термина обязательно')
	}

	if (!slug) {
		throw new Error('Slug обязателен')
	}

	if (!shortDefinition) {
		throw new Error('Краткое определение обязательно')
	}

	const [created] = await db
		.insert(glossaryTerms)
		.values({
			term,
			slug,
			englishTerm: data.englishTerm?.trim() || null,
			abbreviation: data.abbreviation?.trim() || null,
			shortDefinition,
			definition: data.definition?.trim() || null,
			categoryId: data.categoryId ?? null,
			language: data.language?.trim() || 'ru',
			metaTitle: data.metaTitle?.trim() || null,
			metaDescription: data.metaDescription?.trim() || null,
			isActive: data.isActive ?? true
		})
		.returning({
			id: glossaryTerms.id
		})

	revalidatePath('/admin/glossary')

	return created
}

export async function updateGlossaryTerm(id: bigint, data: GlossaryTermInput) {
	const term = data.term.trim()
	const slug = data.slug.trim()
	const shortDefinition = data.shortDefinition.trim()

	if (!term) {
		throw new Error('Название термина обязательно')
	}

	if (!slug) {
		throw new Error('Slug обязателен')
	}

	if (!shortDefinition) {
		throw new Error('Краткое определение обязательно')
	}

	const [updated] = await db
		.update(glossaryTerms)
		.set({
			term,
			slug,
			englishTerm: data.englishTerm?.trim() || null,
			abbreviation: data.abbreviation?.trim() || null,
			shortDefinition,
			definition: data.definition?.trim() || null,
			categoryId: data.categoryId ?? null,
			language: data.language?.trim() || 'ru',
			metaTitle: data.metaTitle?.trim() || null,
			metaDescription: data.metaDescription?.trim() || null,
			isActive: data.isActive ?? true,
			updatedAt: new Date().toISOString()
		})
		.where(eq(glossaryTerms.id, id))
		.returning({
			id: glossaryTerms.id
		})

	if (!updated) {
		throw new Error('Термин не найден')
	}

	revalidatePath('/admin/glossary')
	revalidatePath(`/admin/glossary/${id.toString()}`)

	return updated
}

export async function deleteGlossaryTerm(id: bigint) {
	const [deleted] = await db
		.delete(glossaryTerms)
		.where(eq(glossaryTerms.id, id))
		.returning({
			id: glossaryTerms.id
		})

	if (!deleted) {
		throw new Error('Термин не найден')
	}

	revalidatePath('/admin/glossary')

	return deleted
}
