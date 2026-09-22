/**
 * componentApplications — это связующая таблица many-to-many
 * между components и applications. Она позволяет одному
 * компоненту иметь несколько областей применения, а одной
 * области применения — содержать множество компонентов
 */

import {
	bigint,
	foreignKey,
	pgTable,
	primaryKey,
	text
} from 'drizzle-orm/pg-core'
import { components } from './components'
import { applications } from './applications'

export const componentApplications = pgTable(
	'component_applications',
	{
		componentId: bigint('component_id', { mode: 'bigint' }).notNull(),
		applicationId: bigint('application_id', { mode: 'bigint' }).notNull(),
		description: text()
	},
	table => [
		foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: 'fk_component_applications_component'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.applicationId],
			foreignColumns: [applications.id],
			name: 'fk_component_applications_application'
		}).onDelete('cascade'),
		primaryKey({
			columns: [table.componentId, table.applicationId],
			name: 'component_applications_pkey'
		})
	]
)
