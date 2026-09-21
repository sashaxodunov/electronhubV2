import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { components } from './components'
import { packageVariants } from './package-variants'
import { componentVariantStatus } from './enums'

export const componentVariants = pgTable(
	'component_variants',
	{
		id: bigserial({
			mode: 'bigint'
		})
			.primaryKey()
			.notNull(),

		componentId: bigint('component_id', {
			mode: 'number'
		}).notNull(),

		packageVariantId: bigint('package_variant_id', {
			mode: 'number'
		}),

		designation: varchar({
			length: 150
		}).notNull(),

		slug: varchar({
			length: 255
		}).notNull(),

		marking: varchar({
			length: 150
		}),

		description: text(),

		process: varchar({
			length: 100
		}),

		packing: varchar({
			length: 100
		}),

		operatingTempMin: numeric('operating_temp_min', {
			precision: 10,
			scale: 3
		}),

		operatingTempMax: numeric('operating_temp_max', {
			precision: 10,
			scale: 3
		}),

		status: componentVariantStatus('status').default('active').notNull(),

		isPrimary: boolean('is_primary').default(false).notNull(),

		isActive: boolean('is_active').default(true).notNull(),

		sortOrder: integer('sort_order').default(0).notNull(),

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
		index('idx_variants_component_id').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops')
		),

		index('idx_variants_package_variant_id').using(
			'btree',
			table.packageVariantId.asc().nullsLast().op('int8_ops')
		),

		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_variants_component'
		}).onDelete('cascade'),

		foreignKey({
			columns: [table.packageVariantId],
			foreignColumns: [packageVariants.id],
			name: 'fk_variants_package_variant'
		}).onDelete('set null'),

		unique('component_variants_slug_key').on(table.slug)
	]
)
