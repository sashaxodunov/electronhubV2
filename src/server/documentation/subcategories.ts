import { asc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { documentationSubcategories } from '@/db/schema'

export async function getDocumentationSubcategories(
	categorySlug?: string
) {
	const query = db
		.select({
			id: documentationSubcategories.id,
			categorySlug: documentationSubcategories.categorySlug,
			title: documentationSubcategories.title,
			slug: documentationSubcategories.slug,
			sortOrder: documentationSubcategories.sortOrder,
			createdAt: documentationSubcategories.createdAt,
			updatedAt: documentationSubcategories.updatedAt
		})
		.from(documentationSubcategories)
		.orderBy(
			asc(documentationSubcategories.categorySlug),
			asc(documentationSubcategories.sortOrder),
			asc(documentationSubcategories.title)
		)

	if (categorySlug) {
		return query.where(
			eq(documentationSubcategories.categorySlug, categorySlug)
		)
	}

	return query
}