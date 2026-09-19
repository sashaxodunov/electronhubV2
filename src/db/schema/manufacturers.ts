/**
 * таблица manufacturers хранит производителей электронных компонентов
 *  и их основные данные. Она также позволяет связать одного производителя
 *  с его правопреемником после поглощения, ребрендинга или передачи бизнеса
 */

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'

export const manufacturers = pgTable(
	'manufacturers',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный идентификатор производителя
		name: varchar({ length: 255 }).notNull(),
		// Полное название производителя
		shortName: varchar('short_name', { length: 100 }),
		// Короткое название или аббревиатура
		slug: varchar({ length: 255 }).notNull(),
		// URL-идентификатор производителя
		country: varchar({ length: 100 }),
		// Страна производителя
		website: varchar({ length: 500 }),
		// Официальный сайт производителя
		description: text(),
		// Описание производителя
		isActive: boolean('is_active').default(true).notNull(),
		// Показывает является ли производитель активным
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		// Дата и время создания записи
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow() // устанавливает значение только при создании записи.
			.notNull(),
		// Дата последнего добавления записи
		successorId: bigint('successor_id', { mode: 'number' })
		// Она указывает на другого производителя из этой же таблицы
	},
	table => [
		foreignKey({
			columns: [table.successorId],
			foreignColumns: [table.id],
			name: 'manufacturers_successor_id_fkey'
		}).onDelete('set null'),
		// при удалении у старого производителя автоматически станет Null, а не приведет к удалению самого старого производителя
		unique('manufacturers_slug_key').on(table.slug)
	]
)
