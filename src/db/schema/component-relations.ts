/**
 * componentRelations — это таблица для хранения связей одного компонента
 * с другим компонентом. Это важная таблица для каталога, потому что
 * позволяет строить перекрёстные ссылки: аналоги, заменители,
 * совместимые компоненты, производные версии и т. д.
 */

import {
	bigint,
	bigserial,
	check,
	foreignKey,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { relationType } from './enums'
import { components } from './components'

export const componentRelations = pgTable(
	'component_relations',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// Исходный компонент
		relatedComponentId: bigint('related_component_id', {
			mode: 'bigint'
		}).notNull(),
		// Компонент, с которым устанавливается связь
		relationType: relationType('relation_type').notNull(),
		// enum определяет характер связи
		description: text(),
		// описание именно отношения между двумя компонентами
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		uniqueIndex('uq_component_relations').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.relatedComponentId.asc().nullsLast().op('int8_ops'),
			table.relationType.asc().nullsLast().op('enum_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_relation_component'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.relatedComponentId],
			foreignColumns: [components.id],
			name: 'fk_relation_related'
		}).onDelete('cascade'),
		check(
			'chk_component_relation_not_self',
			sql`component_id <> related_component_id`
		)
	]
)
