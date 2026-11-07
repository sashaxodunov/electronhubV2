
import {
	bigserial,
	bigint,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

import { equipment } from './equipment'
import { equipmentParameterDefinitions } from './equipment-parameter-definitions'

export const equipmentParameters = pgTable(
	'equipment_parameters',
	{
		id: bigserial('id', { mode: 'bigint' }).primaryKey(),

		equipmentId: bigint('equipment_id', { mode: 'bigint' })
			.notNull()
			.references(() => equipment.id, {
				onDelete: 'cascade'
			}),

		definitionId: bigint('definition_id', { mode: 'bigint' })
			.notNull()
			.references(() => equipmentParameterDefinitions.id, {
				onDelete: 'restrict'
			}),

		value: text('value').notNull(),
		unit: varchar('unit', { length: 50 }),

		sortOrder: integer('sort_order').notNull().default(0),

		createdAt: timestamp('created_at', {
			withTimezone: true
		}).defaultNow().notNull(),

		updatedAt: timestamp('updated_at', {
			withTimezone: true
		}).defaultNow().notNull()
	},
	table => [
		unique('equipment_parameters_equipment_definition_unique')
			.on(table.equipmentId, table.definitionId),
		index('equipment_parameters_equipment_idx')
			.on(table.equipmentId)
	]
)
