import {
	bigint,
	foreignKey,
	index,
	pgTable,
	unique,
	varchar,
} from 'drizzle-orm/pg-core'

import { documentation } from './documentation'
import { equipment } from './equipment'

export const equipmentDocumentation = pgTable(
	'equipment_documentation',
	{
		equipmentId: bigint('equipment_id', { mode: 'bigint' }).notNull(),
		documentationId: bigint('documentation_id', { mode: 'bigint' }).notNull(),
		relationType: varchar('relation_type', { length: 30 })
			.default('related')
			.notNull(),
		sortOrder: bigint('sort_order', { mode: 'number' })
			.default(0)
			.notNull(),
	},
	table => [
		unique('equipment_documentation_equipment_documentation_key').on(
			table.equipmentId,
			table.documentationId,
		),
		index('equipment_documentation_documentation_id_idx').on(
			table.documentationId,
		),
		index('equipment_documentation_equipment_id_idx').on(
			table.equipmentId,
		),
		foreignKey({
			columns: [table.equipmentId],
			foreignColumns: [equipment.id],
			name: 'fk_equipment_documentation_equipment',
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.documentationId],
			foreignColumns: [documentation.id],
			name: 'fk_equipment_documentation_documentation',
		}).onDelete('cascade'),
	],
)
