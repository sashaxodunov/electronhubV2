/**
 * componentAliases — таблица альтернативных обозначений компонентов.
 * Она нужна, чтобы один компонент можно было найти по разным названиям,
 *  артикулам, старым обозначениям, внутренним номерам и другим идентификаторам
 */

// Альтернативное название, по которому пользователь может найти тот же компонент

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { components } from './components'

export const componentAliases = pgTable(
	'component_aliases',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный ID конкретной записи alias
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// Указывает какому компоненту принадлежит alias
		alias: varchar({ length: 255 }).notNull(),
		// Это непосредственно альтернативное обозначение компонента
		aliasType: varchar('alias_type', { length: 100 }),
		// Тип альтернативного обозначения
		// manufacturer_part_number
		// legacy_part_number
		// internal_part_number
		// common_name
		// industry_designation
		// cross_reference
		// short_name
		isPrimary: boolean('is_primary').default(false).notNull(),
		// Показывает, является ли данный alias основным обозначением
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_component_aliases_alias_trgm').using(
			'gin',
			table.alias.asc().nullsLast().op('gin_trgm_ops')
		),
		uniqueIndex('uq_component_aliases').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.alias.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_alias_component'
		}).onDelete('cascade')
	]
)
