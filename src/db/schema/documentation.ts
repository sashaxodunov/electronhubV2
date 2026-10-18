
import {
	bigserial,
	bigint,
	foreignKey,
	index,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { components } from './components'
import { documentationSubcategories } from './documentation-subcategories'
import { electronicsBrands } from './electronics-brands'

/**
 * Записи раздела Documentation.
 *
 * Каждый тип документации создаётся отдельной записью:
 * schematic, boardview, cad, manual и т. д.
 */
export const documentation = pgTable(
	'documentation',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		categorySlug: varchar('category_slug', { length: 100 }).notNull(),

		subcategoryId: bigint('subcategory_id', { mode: 'bigint' }),

		componentId: bigint('component_id', { mode: 'bigint' }),

		// Бренд электроники, к которому относится документация.
		brandId: bigint('brand_id', { mode: 'bigint' }),

		// Тип документации: schematic, boardview, cad, manual и т. д.
		documentType: varchar('document_type', { length: 30 })
			.default('schematic')
			.notNull(),

		title: varchar({ length: 255 }).notNull(),

		slug: varchar({ length: 255 }).notNull(),

		description: text(),

		status: varchar({ length: 20 }).default('draft').notNull(),

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
		index('idx_documentation_component_id').on(table.componentId),

		index('idx_documentation_brand_id').on(table.brandId),

		index('idx_documentation_status').on(table.status),

		index('idx_documentation_subcategory_id').on(table.subcategoryId),

		index('idx_documentation_document_type').on(table.documentType),

		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_documentation_component'
		}).onDelete('set null'),

		foreignKey({
			columns: [table.subcategoryId],
			foreignColumns: [documentationSubcategories.id],
			name: 'fk_documentation_subcategory'
		}).onDelete('set null'),

		foreignKey({
			columns: [table.brandId],
			foreignColumns: [electronicsBrands.id],
			name: 'fk_documentation_brand'
		}).onDelete('set null'),

		unique('documentation_slug_key').on(table.slug)
	]
)