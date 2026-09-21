/**
 * componentSpecifications — это таблица технических характеристик компонента.
 *  Она очень похожа на componentRatings и componentOperatingConditions, но у
 * неё другая смысловая роль: здесь удобно хранить обычные Electrical /
 * Mechanical / Performance Characteristics из datasheet
 */

import {
	bigint,
	bigserial,
	foreignKey,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { components } from './components'

export const componentSpecifications = pgTable(
	'component_specifications',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный идентификатор характеристики
		componentId: bigint('component_id', { mode: 'number' }).notNull(),
		// Ссылка на компонент
		name: varchar({ length: 255 }).notNull(),
		// Название характеристики
		symbol: varchar({ length: 100 }),
		// Физическое или техническое обозначение параметра
		valueMin: numeric('value_min', { precision: 20, scale: 8 }),
		// Минимальное значение
		valueTyp: numeric('value_typ', { precision: 20, scale: 8 }),
		// Типовое значение
		valueMax: numeric('value_max', { precision: 20, scale: 8 }),
		// Минимальное значение
		unit: varchar({ length: 50 }),
		// Единицы измерения
		conditionText: text('condition_text'),
		// Условия при которых получено значение
		description: text(),
		// Дополнительное описание характеристики
		sortOrder: integer('sort_order').default(0).notNull(),
		// Порядок отображения характеристик н странице
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_specifications_component_id').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops')
		),
		uniqueIndex('uq_component_specifications').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.name.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_specifications_component'
		}).onDelete('cascade')
	]
)
