/**
 * componentPins — это таблица выводов/контактов электронного компонента.
 * Она описывает распиновку компонента: номер контакта, его название,
 * тип, функцию, активный уровень и дополнительные особенности корпуса.
 */

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { pinType } from './enums'
import { components } from './components'

export const componentPins = pgTable(
	'component_pins',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		componentId: bigint('component_id', { mode: 'number' }).notNull(),
		pinNumber: varchar('pin_number', { length: 20 }).notNull(),
		// Номер физического вывода
		pinName: varchar('pin_name', { length: 100 }).notNull(),
		// Название контакта
		pinType: pinType('pin_type').notNull(),
		// Тип вывода Это enum
		function: varchar({ length: 255 }),
		// функциональное назначение вывода
		description: text(),
		// полное описание контакта
		activeLevel: varchar('active_level', { length: 20 }),
		// Активный логический уровень
		element: varchar({ length: 100 }),
		//Это поле предназначено для дополнительного обозначения элемента/части схемы.
		isExposedPad: boolean('is_exposed_pad').default(false).notNull(),
		//Показывает, является ли контакт exposed pad — открытой контактной площадкой корпуса.
		sortOrder: integer('sort_order').default(0).notNull(),
		// Порядок вывода контактов на сайте.
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_component_pins_component_id').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops')
		),
		uniqueIndex('uq_component_pins_component_number').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.pinNumber.asc().nullsLast().op('int8_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_pins_component'
		}).onDelete('cascade')
	]
)
