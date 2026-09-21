/**
 * componentRatings — это таблица для хранения номинальных, предельных
 *  и типичных технических характеристик компонента. По структуре она
 * очень похожа на componentOperatingConditions, но смысл у них разный.
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

export const componentRatings = pgTable(
	'component_ratings',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		componentId: bigint('component_id', { mode: 'number' }).notNull(),
		name: varchar({ length: 255 }).notNull(),
		// Название технической характеристики
		symbol: varchar({ length: 100 }),
		// Техническое обозначение параметра VDS, ID, QG, VOS
		valueMin: numeric('value_min', { precision: 20, scale: 8 }),
		// Минимальное значение параметра
		valueTyp: numeric('value_typ', { precision: 20, scale: 8 }),
		// Типовое значение параметра
		valueMax: numeric('value_max', { precision: 20, scale: 8 }),
		// Максимальное значение параметра
		unit: varchar({ length: 50 }),
		// Единицы измерения
		conditionText: text('condition_text'),
		// Условия, при которых указано значение характеристики
		note: text(),
		// Дополнительное замечание
		sortOrder: integer('sort_order').default(0).notNull(),
		// Порядок отображения характеристик
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		uniqueIndex('uq_component_ratings').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.name.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_ratings_component'
		}).onDelete('cascade')
	]
)
