/**
 * Это таблица конкретных вариантов корпуса электронного компонента.
 * Она находится ниже уровня packages и описывает уже конкретную
 * геометрию/исполнение корпуса.
 */

import {
	bigint,
	bigserial,
	boolean,
	foreignKey,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core'
import { packages } from './packages'

export const packageVariants = pgTable(
	'package_variants',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		// Уникальный идентификатор варианта корпуса
		packageId: bigint('package_id', { mode: 'bigint' }).notNull(),
		// Ссылка на родительский корпус
		name: varchar({ length: 150 }).notNull(),
		// Название конкретного варианта
		slug: varchar({ length: 150 }).notNull(),
		// URL-идентификатор
		manufacturer: varchar({ length: 150 }),
		// Название производителя корпуса
		pinCount: integer('pin_count'),
		// Количество выводов корпуса
		pitchMm: numeric('pitch_mm', { precision: 8, scale: 3 }),
		// Шаг между соседними выводами в миллиметрах
		lengthMm: numeric('length_mm', { precision: 8, scale: 3 }),
		// Длина корпуса
		widthMm: numeric('width_mm', { precision: 8, scale: 3 }),
		// Ширина корпуса
		heightMm: numeric('height_mm', { precision: 8, scale: 3 }),
		// Высота корпуса
		bodyLengthMm: numeric('body_length_mm', { precision: 8, scale: 3 }),
		// Длина корпуса без выводов
		bodyWidthMm: numeric('body_width_mm', { precision: 8, scale: 3 }),
		// Ширина корпуса без выводов
		leadLengthMm: numeric('lead_length_mm', { precision: 8, scale: 3 }),
		// Размер вывода корпуса
		leadWidthMm: numeric('lead_width_mm', { precision: 8, scale: 3 }),
		// Размер вывода корпуса
		thermalPad: boolean('thermal_pad').default(false).notNull(),
		// Наличие exposed/thermal pad
		description: text(),
		// Дополнительное описание корпуса
		isActive: boolean('is_active').default(true).notNull(),
		// Позволяет деактивировать вариант без удаления.
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		// Дата создания корпуса
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull(),
		// Дата последнего изменения
		variantCode: varchar('variant_code', { length: 100 }),
		// Код конкретного варианта корпуса
		standardCode: varchar('standard_code', { length: 100 }),
		// Код стандарта корпуса
		bodyShape: varchar('body_shape', { length: 50 }),
		// Форма тела корпуса
		pitchXMm: numeric('pitch_x_mm', { precision: 8, scale: 3 }),
		// Шаг контактов по двум направлениям
		pitchYMm: numeric('pitch_y_mm', { precision: 8, scale: 3 }),
		// Шаг контактов по двум направлениям
		terminalWidthMm: numeric('terminal_width_mm', { precision: 8, scale: 3 }),
		// Ширина контактной площадки/терминала
		terminalLengthMm: numeric('terminal_length_mm', { precision: 8, scale: 3 }),
		// Длина контактной площадки/терминала
		exposedPadLengthMm: numeric('exposed_pad_length_mm', {
			precision: 8,
			scale: 3
		}), // Длина exposed pad.
		exposedPadWidthMm: numeric('exposed_pad_width_mm', {
			precision: 8,
			scale: 3
		}), // Ширина exposed pad.
		packageDrawingUrl: text('package_drawing_url')
	},
	table => [
		foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: 'package_variants_package_id_fkey'
		}).onDelete('cascade'),
		unique('package_variants_slug_key').on(table.slug)
	]
)
