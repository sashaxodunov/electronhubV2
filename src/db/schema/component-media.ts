import {
	bigint,
	bigserial,
	boolean,
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
import { assetType } from './enums'

export const componentMedia = pgTable(
	'component_media',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		/**
		 * Компонент, которому принадлежит медиа.
		 */
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),

		/**
		 * Смысл / назначение ресурса.
		 *
		 * Например:
		 * photo
		 * symbol
		 * schematic
		 * application_circuit
		 * graph
		 * table
		 * dimension
		 * marking
		 * other
		 */
		assetType: assetType('asset_type').notNull(),

		/**
		 * Название медиа.
		 */
		title: varchar({ length: 255 }),

		/**
		 * Путь или URL файла.
		 *
		 * В будущем здесь можно хранить путь
		 * относительно Timeweb Object Storage.
		 */
		fileUrl: text('file_url').notNull(),

		/**
		 * MIME-тип файла.
		 *
		 * Например:
		 * image/jpeg
		 * image/png
		 * image/svg+xml
		 * application/pdf
		 */
		mimeType: varchar('mime_type', { length: 100 }),

		/**
		 * Размер файла в байтах.
		 */
		fileSize: bigint('file_size', { mode: 'bigint' }),

		/**
		 * Размер изображения.
		 */
		width: integer(),

		height: integer(),

		/**
		 * Порядок отображения.
		 */
		sortOrder: integer('sort_order').default(0).notNull(),

		/**
		 * Основное медиа данного типа.
		 */
		isPrimary: boolean('is_primary').default(false).notNull(),

		/**
		 * Можно временно отключить файл
		 * без его удаления.
		 */
		isActive: boolean('is_active').default(true).notNull(),

		/**
		 * Alt-текст изображения.
		 */
		altText: varchar('alt_text', { length: 255 }),

		/**
		 * Дополнительное описание.
		 */
		description: text(),

		createdAt: timestamp('created_at', {
			withTimezone: true,
			mode: 'string'
		})
			.defaultNow()
			.notNull()
	},

	table => [
		index('idx_component_media_component_id').on(table.componentId),

		index('idx_component_media_asset_type').on(table.assetType),

		uniqueIndex('uq_component_media_component_file').using(
			'btree',
			table.componentId.asc().nullsLast().op('int8_ops'),
			table.fileUrl.asc().nullsLast().op('text_ops')
		),

		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'component_media_component_id_fkey'
		}).onDelete('cascade')
	]
)
