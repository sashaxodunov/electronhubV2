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

import { components } from './components'
import { documentType } from './enums'

export const datasheets = pgTable(
	'datasheets',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		// Компонент, которому принадлежит документ
		componentId: bigint('component_id', {
			mode: 'bigint'
		}).notNull(),

		// Тип документа
		documentType: documentType('document_type').default('datasheet').notNull(),

		// Название документа
		// Например: LM358 Low-Power Dual Operational Amplifiers
		title: varchar({ length: 500 }).notNull(),

		// Ключ файла в Object Storage
		// Например:
		// components/1842/documents/datasheet/LM358_Rev_H.pdf
		filePath: varchar('file_path', {
			length: 1000
		}).notNull(),

		// Оригинальное имя загруженного файла
		// Например: LM358_Rev_H.pdf
		fileName: varchar('file_name', {
			length: 255
		}),

		// MIME-тип файла
		// Например: application/pdf
		mimeType: varchar('mime_type', {
			length: 100
		}),

		// Размер файла в байтах
		fileSize: bigint('file_size', {
			mode: 'bigint'
		}),

		// Ревизия документа
		// Например: Rev. H
		revision: varchar({
			length: 100
		}),

		// Дата выпуска документа
		documentDate: date('document_date'),

		// Язык документа
		// Например: en, ru
		language: varchar({
			length: 20
		})
			.default('en')
			.notNull(),

		// Количество страниц
		pageCount: integer('page_count'),

		// Оригинальный URL документа на сайте производителя
		sourceUrl: varchar('source_url', {
			length: 1000
		}),

		// Дополнительное описание
		description: text(),

		// Основной документ компонента
		isPrimary: boolean('is_primary').default(false).notNull(),

		// Активен ли документ
		isActive: boolean('is_active').default(true).notNull(),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull()
	},

	table => [
		index('idx_datasheets_component_id').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops')
		),

		index('idx_datasheets_document_type').using('btree', table.documentType),

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
