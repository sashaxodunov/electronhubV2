
import {
	bigserial,
	bigint,
	boolean,
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { components } from './components'

/**
 * Записи раздела Documentation.
 */
export const documentation = pgTable(
	'documentation',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		categorySlug: varchar('category_slug', { length: 100 }).notNull(),

		componentId: bigint('component_id', { mode: 'bigint' }),

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
		index('idx_documentation_status').on(table.status),

		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_documentation_component'
		}).onDelete('set null'),

		unique('documentation_slug_key').on(table.slug)
	]
)

/**
 * Файлы, прикреплённые к записи документации.
 */
export const documentationFiles = pgTable(
	'documentation_files',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		documentationId: bigint('documentation_id', {
			mode: 'bigint'
		}).notNull(),

		originalName: varchar('original_name', { length: 255 }).notNull(),

		objectKey: text('object_key').notNull(),

		contentType: varchar('content_type', { length: 150 }).notNull(),

		sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),

		isPrimary: boolean('is_primary').default(false).notNull(),

		sortOrder: integer('sort_order').default(0).notNull(),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_documentation_files_documentation_id').on(
			table.documentationId
		),

		unique('documentation_files_object_key_key').on(table.objectKey),

		foreignKey({
			columns: [table.documentationId],
			foreignColumns: [documentation.id],
			name: 'fk_documentation_files_documentation'
		}).onDelete('cascade')
	]
)
