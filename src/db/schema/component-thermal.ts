/**
 * componentThermal — это отдельная таблица для тепловых характеристик
 *  компонента. В твоей архитектуре она логично дополняет
 *  componentSpecifications, componentRatings и
 * componentOperatingConditions.
 */

import {
	bigint,
	bigserial,
	foreignKey,
	numeric,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { components } from './components'

export const componentThermal = pgTable(
	'component_thermal',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный ID теплового параметра
		componentId: bigint('component_id', { mode: 'number' }).notNull(),
		// ID компонента теплового параметра
		name: varchar({ length: 255 }).notNull(),
		// Название теплового параметра
		symbol: varchar({ length: 100 }),
		// Физическое обозначение параметра
		value: numeric({ precision: 20, scale: 8 }),
		// Здесь храниться одно числовое значение
		unit: varchar({ length: 50 }),
		// Единицы измерения
		description: text(),
		// Дополнительное пояснение
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		uniqueIndex('uq_component_thermal').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.name.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_thermal_component'
		}).onDelete('cascade')
	]
)
