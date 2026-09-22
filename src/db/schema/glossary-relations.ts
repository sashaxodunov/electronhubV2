import {
	bigint,
	bigserial,
	check,
	foreignKey,
	index,
	integer,
	pgTable,
	timestamp,
	unique
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { glossaryRelationType } from './enums'
import { glossaryTerms } from './glossary-terms'

export const glossaryRelations = pgTable(
	'glossary_relations',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey().notNull(),
		termId: bigint('term_id', { mode: 'bigint' }).notNull(),
		relatedTermId: bigint('related_term_id', { mode: 'bigint' }).notNull(),
		relationType: glossaryRelationType('relation_type')
			.default('related')
			.notNull(),
		sortOrder: integer('sort_order').default(0).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.defaultNow()
			.notNull()
	},
	table => [
		index('idx_glossary_relations_related').using(
			'btree',
			table.relatedTermId.asc().nullsLast().op('int8_ops')
		),
		index('idx_glossary_relations_term').using(
			'btree',
			table.termId.asc().nullsLast().op('int8_ops')
		),
		index('idx_glossary_relations_type').using(
			'btree',
			table.relationType.asc().nullsLast().op('enum_ops')
		),
		foreignKey({
			columns: [table.termId],
			foreignColumns: [glossaryTerms.id],
			name: 'fk_glossary_relation_term'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.relatedTermId],
			foreignColumns: [glossaryTerms.id],
			name: 'fk_glossary_relation_related'
		}).onDelete('cascade'),
		unique('uq_glossary_relation').on(
			table.termId,
			table.relationType,
			table.relatedTermId
		),
		check('chk_glossary_relation_not_self', sql`term_id <> related_term_id`)
	]
)
