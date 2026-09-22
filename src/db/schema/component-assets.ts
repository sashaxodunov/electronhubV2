/**
 * componentAssets — это таблица файлов и других медиа-ресурсов,
 * связанных с компонентом. Она позволяет привязать к одному
 * компоненту datasheet, изображения, схемы, графики, чертежи,
 * 3D-модели и другие материалы
 */

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'
import { assetType } from './enums'
import { components } from './components'

export const componentAssets = pgTable(
	'component_assets',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// уникальный идентификатор файла/ресурса
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		// Определяет, какому компоненту принадлежит файл.
		assetType: assetType('asset_type').notNull(),
		// enums тип определяет тип ресурса
		title: varchar({ length: 500 }),
		// название ресурса для отображения пользователю
		filePath: varchar('file_path', { length: 1000 }).notNull(),
		// Путь к файлу
		fileName: varchar('file_name', { length: 255 }),
		// Оригинальное имя файла
		mimeType: varchar('mime_type', { length: 100 }),
		// MIME-тип файла
		width: integer(),
		// ширина изображения в пикселях
		height: integer(),
		// Высота изображения в пикселях
		pageNumber: integer('page_number'),
		// номер странице в документе на которой расположено изображение
		description: text(),
		// описание ресурса
		sortOrder: integer('sort_order').default(0).notNull(),
		// порядок отображения ресурса в документе
		isPrimary: boolean('is_primary').default(false).notNull(),
		// показывает является ли ресурс основным для данного компонента
		isActive: boolean('is_active').default(true).notNull(),
		// Позволяет отключить ресурс без физического удаления
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
		// дата добавления ресурса
	},
	table => [
		uniqueIndex('uq_component_assets_component_file').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.filePath.asc().nullsLast().op('text_ops')
		),
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_assets_component'
		}).onDelete('cascade')
	]
)
