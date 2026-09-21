/**
 * componentSeries — это таблица серий/семейств электронных компонентов.
 * Она находится уровнем выше конкретного component и позволяет объединять
 *  несколько родственных компонентов производителя в одну серию.
 */

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	index,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { manufacturers } from './manufacturers'

export const componentSeries = pgTable(
	'component_series',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный ID серии
		manufacturerId: bigint('manufacturer_id', { mode: 'number' }),
		// Производитель серии
		categoryId: bigint('category_id', { mode: 'number' }),
		// Категория к которой относится серия
		name: varchar({ length: 255 }).notNull(),
		// Название серии
		slug: varchar({ length: 255 }).notNull(),
		// URL-идентификатор серии
		description: text(),
		// Описание серии
		isActive: boolean('is_active').default(true).notNull(),
		// Позволяет отключить серию без физического удаления
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_component_series_category_id').using(
			'btree',
			table.categoryId.asc().nullsLast().op('int8_ops')
		),
		index('idx_component_series_is_active').using(
			'btree',
			table.isActive.asc().nullsLast().op('bool_ops')
		),
		index('idx_component_series_manufacturer_id').using(
			'btree',
			table.manufacturerId.asc().nullsLast().op('int8_ops')
		),
		index('idx_component_series_name').using(
			'btree',
			table.name.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.manufacturerId],
			foreignColumns: [manufacturers.id],
			name: 'fk_series_manufacturer'
		}).onDelete('set null'),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'fk_series_category'
		}).onDelete('set null'),
		unique('component_series_slug_key').on(table.slug)
	]
)
