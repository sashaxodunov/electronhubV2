/**
 * datasheets — это таблица технических документов, привязанных к компонентам.
 * В отличие от componentAssets, здесь хранятся именно документы с их
 * метаданными: ревизия, дата документа, язык, количество страниц, источник
 * и т. д.
 */

import {
	bigint,
	bigserial,
	boolean,
	date,
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { documentType } from './enums'
import { components } from './components'

export const datasheets = pgTable(
	'datasheets',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Универсальный идентификатор документа
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// указывает какому компоненту принадлежит документ
		documentType: documentType('document_type').default('datasheet').notNull(),
		// тип документы. используется enum
		title: varchar({ length: 500 }).notNull(),
		// Название документа. Например:
		// LM358 Low-Power Dual Operational Amplifiers
		filePath: varchar('file_path', { length: 1000 }).notNull(),
		// путь к файлу документа
		fileName: varchar('file_name', { length: 255 }),
		// имя файла Например
		// LM358.pdf,  LM358_Rev_H.pdf, LM358-datasheet.pdf
		revision: varchar({ length: 100 }),
		// ревизия документа
		documentDate: date('document_date'),
		// дата выпуск самого документа
		language: varchar({ length: 20 }).default('en'),
		// язык документа
		pageCount: integer('page_count'),
		// количество страниц PDF
		sourceUrl: varchar('source_url', { length: 1000 }),
		// URL оригинального документа на сайте производителя
		description: text(),
		// дополнительное описание документа
		isPrimary: boolean('is_primary').default(false).notNull(),
		// определяет основной документ для компонента
		isActive: boolean('is_active').default(true).notNull(),
		// позволяет сделать документ неактивным, не удаляя его с базы
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},

	table => [
		index('idx_datasheets_component_id').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops')
		),
		uniqueIndex('uq_datasheets_component_file').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.filePath.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_datasheets_component'
		}).onDelete('cascade')
	]
)
