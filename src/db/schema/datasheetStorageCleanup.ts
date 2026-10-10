
import {
	bigserial,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

export const datasheetStorageCleanup = pgTable(
	'datasheet_storage_cleanup',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		objectKey: varchar('object_key', { length: 1000 }).notNull(),

		attempts: integer('attempts').default(0).notNull(),

		lastError: text('last_error'),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string',
		})
			.defaultNow()
			.notNull(),
	},
	(table) => [
		uniqueIndex('uq_datasheet_storage_cleanup_object_key').on(
			table.objectKey,
		),
	],
)