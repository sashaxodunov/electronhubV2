/**
 * componentOperatingConditions — это таблица для хранения рабочих
 * условий и допустимых диапазонов параметров компонента. Она особенно
 * полезна для характеристик вроде температуры, напряжения питания,
 * допустимого тока, частоты и т. п.
 */

import {
	bigint,
	bigserial,
	foreignKey,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { components } from './components'

export const componentOperatingConditions = pgTable(
	'component_operating_conditions',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// идентификатор компонента которому принадлежит условие
		name: varchar({ length: 255 }).notNull(),
		// наименование параметра
		symbol: varchar({ length: 100 }),
		// Математическое или техническое обозначение параметра
		valueMin: numeric('value_min', { precision: 20, scale: 8 }),
		// Минимальное значение параметра
		valueTyp: numeric('value_typ', { precision: 20, scale: 8 }),
		// Типовое значение параметра
		valueMax: numeric('value_max', { precision: 20, scale: 8 }),
		// Максимальное значение параметра
		unit: varchar({ length: 50 }),
		// единицы измерения
		conditionText: text('condition_text'),
		// дополнительные условия при котором действует параметр
		sortOrder: integer('sort_order').default(0).notNull(),
		// порядок отображения
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		uniqueIndex('uq_component_operating_conditions').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.name.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_operating_component'
		}).onDelete('cascade')
	]
)
