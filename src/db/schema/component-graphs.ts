/**
 * componentGraphs — это отдельная таблица для графиков и графических
 *  зависимостей, относящихся к компоненту. Она хорошо дополняет
 *  componentAssets и datasheets: сама таблица хранит метаданные графика,
 *  а изображение графика при необходимости связывается через componentAssets
 */

import {
	bigint,
	bigserial,
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { components } from './components'
import { componentAssets } from './component-assets'

export const componentGraphs = pgTable(
	'component_graphs',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// уникальный идентификатор графика
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// связывает график с таблицей components
		title: varchar({ length: 500 }).notNull(),
		// Название графика
		xAxisName: varchar('x_axis_name', { length: 255 }),
		// Название величины по оси X
		xAxisUnit: varchar('x_axis_unit', { length: 50 }),
		// Единицы измерения по оси X
		yAxisName: varchar('y_axis_name', { length: 255 }),
		// Название величины по оси Y
		yAxisUnit: varchar('y_axis_unit', { length: 50 }),
		// Единицы измерения по оси Y
		conditions: text(),
		// Здесь хранятся условия при которых был построен график
		sourcePage: integer('source_page'),
		// Номер страницы исходного документа, например datasheet.
		description: text(),
		// Дополнительное описание графика
		imageAssetId: bigint('image_asset_id', { mode: 'bigint' }),
		// Связывает график с изображением
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
		// дата создания
	},
	table => [
		uniqueIndex('uq_component_graphs').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.title.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_graph_component'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.imageAssetId],
			foreignColumns: [componentAssets.id],
			name: 'fk_graph_asset'
		}).onDelete('set null')
	]
)
