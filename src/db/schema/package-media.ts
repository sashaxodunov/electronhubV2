/**
 * packageMedia — таблица медиафайлов, относящихся к корпусу
 * (package) или конкретному варианту корпуса (packageVariant).
 */

import {
	bigint,
	bigserial,
	boolean,
	check,
	foreignKey,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'

import { sql } from 'drizzle-orm'

import { packageMediaType } from './enums'
import { packages } from './packages'
import { packageVariants } from './package-variants'

export const packageMedia = pgTable(
	'package_media',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),

		/**
		 * Медиа принадлежит общему типу корпуса.
		 */
		packageId: bigint('package_id', { mode: 'number' }),

		/**
		 * Медиа принадлежит конкретному варианту корпуса.
		 */
		packageVariantId: bigint('package_variant_id', {
			mode: 'number'
		}),

		/**
		 * Тип медиа.
		 */
		mediaType: packageMediaType('media_type').notNull(),

		/**
		 * Название медиа.
		 */
		title: varchar({ length: 255 }),

		/**
		 * URL или путь к файлу.
		 */
		fileUrl: text('file_url').notNull(),

		/**
		 * MIME-тип файла.
		 */
		mimeType: varchar('mime_type', { length: 100 }),

		/**
		 * Размер файла в байтах.
		 */
		fileSize: bigint('file_size', { mode: 'number' }),

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
		 * Основное медиа.
		 */
		isPrimary: boolean('is_primary').default(false).notNull(),

		/**
		 * Можно временно отключить медиа
		 * без удаления записи.
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
		uniqueIndex('uq_package_media_package_file').using(
			'btree',
			table.packageId.asc().nullsLast().op('int8_ops'),
			table.fileUrl.asc().nullsLast().op('text_ops')
		),

		uniqueIndex('uq_package_media_variant_file').using(
			'btree',
			table.packageVariantId.asc().nullsLast().op('int8_ops'),
			table.fileUrl.asc().nullsLast().op('text_ops')
		),

		index('idx_package_media_package_id').on(table.packageId),

		index('idx_package_media_package_variant_id').on(table.packageVariantId),

		foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: 'package_media_package_id_fkey'
		}).onDelete('cascade'),

		foreignKey({
			columns: [table.packageVariantId],
			foreignColumns: [packageVariants.id],
			name: 'package_media_package_variant_id_fkey'
		}).onDelete('cascade'),

		check(
			'package_media_owner_check',
			sql`(
        (package_id IS NOT NULL AND package_variant_id IS NULL)
        OR
        (package_id IS NULL AND package_variant_id IS NOT NULL)
      )`
		)
	]
)
