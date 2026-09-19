import {
	bigint,
	bigserial,
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

export const categories = pgTable(
	'categories',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		parentId: bigint('parent_id', { mode: 'number' }),
		name: varchar({ length: 150 }).notNull(),
		slug: varchar({ length: 150 }).notNull(),
		description: text(),
		sortOrder: integer('sort_order').default(0).notNull(),
		isActive: boolean('is_active').default(true).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_categories_parent_id').using(
			'btree',
			table.parentId.asc().nullsLast().op('int8_ops')
		),
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: 'fk_categories_parent'
		}).onDelete('cascade'),

		unique('categories_slug_key').on(table.slug)
		// Гарантирует уникальность slug
	]
)
