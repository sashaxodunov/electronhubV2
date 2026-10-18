import {
	bigserial,
	bigint,
	index,
	integer,
	pgTable,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

/**
 * Подкатегории раздела принципиальных схем.
 * categorySlug соответствует существующему documentationCategories.
 */
export const documentationSubcategories = pgTable(
	'documentation_subcategories',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		categorySlug: varchar('category_slug', { length: 100 }).notNull(),

		title: varchar({ length: 255 }).notNull(),

		slug: varchar({ length: 255 }).notNull(),

		sortOrder: integer('sort_order').default(0).notNull(),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		}).defaultNow().notNull(),

		updatedAt: timestamp('updated_at', {
			withTimezone: true,
			mode: 'string'
		}).defaultNow().notNull()
	},
	table => [
		index('idx_documentation_subcategories_category_slug').on(
			table.categorySlug
		),
		unique('documentation_subcategories_category_slug_slug_key').on(
			table.categorySlug,
			table.slug
		),
		unique('documentation_subcategories_category_slug_title_key').on(
			table.categorySlug,
			table.title
		)
	]
)
