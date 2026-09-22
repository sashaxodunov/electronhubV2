/**
 * логический электронный компонент, вокруг которого строятся
 * характеристики, выводы, документы, графики, варианты и связи
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
import { componentSeries } from './component-series'
import { manufacturers } from './manufacturers'
import { componentStatus } from './enums'

export const components = pgTable(
	'components',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный идентификатор логического компонента
		categoryId: bigint('category_id', { mode: 'bigint' }).notNull(),
		// Категория компонента
		seriesId: bigint('series_id', { mode: 'bigint' }),
		// Серия/семейство компонента
		manufacturerId: bigint('manufacturer_id', { mode: 'bigint' }).notNull(),
		// Производитель компонента
		name: varchar({ length: 255 }).notNull(),
		// Человеческое название компонента
		designation: varchar({ length: 150 }).notNull(),
		// Обозначение конкретного логического компонента
		slug: varchar({ length: 255 }).notNull(),
		// URL-идентификатор
		description: text(),
		// Полное описание компонента
		shortDescription: text('short_description'),
		// Короткое описание
		function: varchar({ length: 255 }),
		// Функциональное назначение компонента
		status: componentStatus('status').default('active').notNull(),
		// Статус компонента
		isActive: boolean('is_active').default(true).notNull(),
		// флаг быстрого включения/выключения записи
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_components_category_id').using(
			'btree',
			table.categoryId.asc().nullsLast().op('int8_ops')
		),
		index('idx_components_designation_trgm').using(
			'gin',
			table.designation.asc().nullsLast().op('gin_trgm_ops')
		),
		index('idx_components_manufacturer_id').using(
			'btree',
			table.manufacturerId.asc().nullsLast().op('int8_ops')
		),
		index('idx_components_name_trgm').using(
			'gin',
			table.name.asc().nullsLast().op('gin_trgm_ops')
		),
		index('idx_components_series_id').using(
			'btree',
			table.seriesId.asc().nullsLast().op('int8_ops')
		),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: 'fk_components_category'
		}).onDelete('restrict'),
		foreignKey({
			columns: [table.seriesId],
			foreignColumns: [componentSeries.id],
			name: 'fk_components_series'
		}).onDelete('set null'),
		foreignKey({
			columns: [table.manufacturerId],
			foreignColumns: [manufacturers.id],
			name: 'fk_components_manufacturer'
		}).onDelete('restrict'),
		unique('components_slug_key').on(table.slug)
	]
)
