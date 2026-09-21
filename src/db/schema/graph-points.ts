/**
 * graphPoints — это уже таблица числовых точек для интерактивных графиков.
 * И она хорошо дополняет ранее рассмотренную componentGraphs.
 */

import {
	bigint,
	bigserial,
	foreignKey,
	integer,
	numeric,
	pgTable,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { componentGraphs } from './component-graphs'

export const graphPoints = pgTable(
	'graph_points',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный ID точки
		graphId: bigint('graph_id', { mode: 'number' }).notNull(),
		// ID графика, которому принадлежит точка
		seriesName: varchar('series_name', { length: 255 }),
		// Название серии данных.Это очень полезное поле, потому что один график может содержать несколько кривых
		xValue: numeric('x_value', { precision: 20, scale: 8 }).notNull(),
		// Значение X
		yValue: numeric('y_value', { precision: 20, scale: 8 }).notNull(),
		// Значение Y
		sortOrder: integer('sort_order').default(0).notNull()
	},
	table => [
		uniqueIndex('uq_graph_points').using(
			'btree',
			table.graphId.asc().nullsLast().op('int8_ops'),
			table.seriesName.asc().nullsLast().op('text_ops'),
			table.xValue.asc().nullsLast().op('numeric_ops'),
			table.yValue.asc().nullsLast().op('numeric_ops')
		),
		foreignKey({
			columns: [table.graphId],
			foreignColumns: [componentGraphs.id],
			name: 'fk_graph_points_graph'
		}).onDelete('cascade')
	]
)
