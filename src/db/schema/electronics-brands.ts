
import {
	bigserial,
	index,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

/**
 * Бренды электроники, для которых публикуются схемы
 * и техническая документация.
 */
export const electronicsBrands = pgTable(
	'electronics_brands',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		name: varchar({ length: 255 }).notNull(),

		slug: varchar({ length: 255 }).notNull(),

		description: text(),

		websiteUrl: varchar('website_url', { length: 500 }),

		logoObjectKey: text('logo_object_key'),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull(),

		updatedAt: timestamp('updated_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull()
	},
	table => [
		unique('electronics_brands_slug_key').on(table.slug),
		index('idx_electronics_brands_name').on(table.name)
	]
)
