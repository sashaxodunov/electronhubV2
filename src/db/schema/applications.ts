/**
 * applications — это справочник областей применения компонентов.
 * Он отвечает на вопрос: «Где используется этот компонент?»
 * */

import {
	bigserial,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

export const applications = pgTable(
	'applications',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// уникальный идентификатор области применения
		name: varchar({ length: 255 }).notNull(),
		// Название области применения например (Автомобильная электроник, Источники питания, Промышленная автоматизация)
		slug: varchar({ length: 255 }).notNull(),
		// Человекочитаемый идентификатор для URL
		description: text(),
		// Подробное описание области применения
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
		// Дата и время создания записи
	},
	table => [unique('applications_slug_key').on(table.slug)]
	// Гарантирует уникальность slug
)
