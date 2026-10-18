// Основная таблица устройства

import {
	bigserial,
	bigint,
	index,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { pgTable } from 'drizzle-orm/pg-core'
import { electronicsBrands } from './electronics-brands'
import { documentationSubcategories } from './documentation-subcategories'

export const equipment = pgTable(
	'equipment',
	{
		id: bigserial('id', { mode: 'bigint' }).primaryKey(),

		brandId: bigint('brand_id', { mode: 'bigint' })
			.references(() => electronicsBrands.id, {
				onDelete: 'restrict'
			}),

		subcategoryId: bigint('subcategory_id', { mode: 'bigint' })
			.references(() => documentationSubcategories.id, {
				onDelete: 'restrict'
			}),

		title: varchar('title', { length: 255 }).notNull(),
		slug: varchar('slug', { length: 255 }).notNull(),
		model: varchar('model', { length: 255 }),
		description: text('description'),

		createdAt: timestamp('created_at', {
			withTimezone: true
		}).defaultNow().notNull(),

		updatedAt: timestamp('updated_at', {
			withTimezone: true
		}).defaultNow().notNull()
	},
	table => [
		unique('equipment_slug_unique').on(table.slug),
		index('equipment_brand_id_idx').on(table.brandId),
		index('equipment_subcategory_id_idx').on(table.subcategoryId)
	]
)
