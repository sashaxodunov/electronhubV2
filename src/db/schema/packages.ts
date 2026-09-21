/**
 * Родительский справочник типов корпусов.
 *
 * Здесь хранятся общие типы корпусов:
 * DIP, SOIC, TSSOP, QFN, BGA и т.д.
 *
 * Конкретные исполнения корпуса
 * (DIP-8, DIP-14, SOIC-8, SOIC-16 и т.д.)
 * находятся в package_variants.
 */

import {
	bigserial,
	boolean,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

export const packages = pgTable(
	'packages',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		name: varchar({ length: 150 }).notNull(),
		// Название типа корпуса.
		// Например: DIP, SOIC, TSSOP, QFN.

		slug: varchar({ length: 150 }).notNull(),
		// URL-идентификатор.

		standard: varchar({ length: 50 }),
		// Стандарт, которому соответствует корпус.
		// Например: JEDEC.

		bodyType: varchar('body_type', { length: 50 }),
		// Тип / форма корпуса.
		// Например: Dual In-line, Small Outline, Quad Flat.

		mountingType: varchar('mounting_type', { length: 20 }),
		// Способ монтажа: SMD / THT.

		description: text(),
		// Описание типа корпуса.

		isActive: boolean('is_active').default(true).notNull(),
		// Активность корпуса.

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull(),

		updatedAt: timestamp('updated_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull()
	},

	table => [unique('packages_slug_key').on(table.slug)]
)
