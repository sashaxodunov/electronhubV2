// Справочник доступных характеристик


import {
	bigserial,
	bigint,
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { documentationSubcategories } from './documentation-subcategories'

export const equipmentParameterDefinitions = pgTable(
	'equipment_parameter_definitions',
	{
		id: bigserial('id', { mode: 'bigint' }).primaryKey(),

		subcategoryId: bigint('subcategory_id', { mode: 'bigint' })
			.references(() => documentationSubcategories.id, {
				onDelete: 'cascade'
			}),

		name: varchar('name', { length: 255 }).notNull(),
		slug: varchar('slug', { length: 255 }).notNull(),
		defaultUnit: varchar('default_unit', { length: 50 }),

		valueType: varchar('value_type', { length: 20 })
			.notNull()
			.default('text'),

		sortOrder: integer('sort_order').notNull().default(0),
		isActive: boolean('is_active').notNull().default(true),

		createdAt: timestamp('created_at', {
			withTimezone: true
		}).defaultNow().notNull()
	},
	table => [
		unique('equipment_parameter_definitions_slug_unique')
			.on(table.slug),
		index('equipment_parameter_definitions_subcategory_idx')
			.on(table.subcategoryId)
	]
)
