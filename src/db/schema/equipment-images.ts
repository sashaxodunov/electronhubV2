
import {
	bigserial,
	bigint,
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core'

import { equipment } from './equipment'

export const equipmentImages = pgTable(
	'equipment_images',
	{
		id: bigserial('id', { mode: 'bigint' }).primaryKey(),

		equipmentId: bigint('equipment_id', { mode: 'bigint' })
			.notNull()
			.references(() => equipment.id, {
				onDelete: 'cascade'
			}),

		objectKey: text('object_key').notNull(),
		alt: varchar('alt', { length: 255 }).notNull(),
		caption: text('caption'),

		imageType: varchar('image_type', { length: 30 })
			.notNull()
			.default('overview'),

		isPrimary: boolean('is_primary').notNull().default(false),
		sortOrder: integer('sort_order').notNull().default(0),

		createdAt: timestamp('created_at', {
			withTimezone: true
		}).defaultNow().notNull()
	},
	table => [
		index('equipment_images_equipment_idx')
			.on(table.equipmentId),
		index('equipment_images_order_idx')
			.on(table.equipmentId, table.sortOrder)
	]
)
