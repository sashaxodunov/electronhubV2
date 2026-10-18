import {
  bigserial,
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar
} from 'drizzle-orm/pg-core'

import { documentation } from './documentation'

export const documentationFiles = pgTable(
  'documentation_files',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),

    documentationId: bigint('documentation_id', {
      mode: 'bigint'
    })
      .notNull()
      .references(() => documentation.id, {
        onDelete: 'cascade'
      }),

    originalName: varchar('original_name', {
      length: 255
    }).notNull(),

    objectKey: text('object_key').notNull(),

    contentType: varchar('content_type', {
      length: 255
    }).notNull(),

    fileExtension: varchar('file_extension', {
      length: 20
    }).notNull(),

    sizeBytes: bigint('size_bytes', {
      mode: 'number'
    }).notNull(),

    isPrimary: boolean('is_primary')
      .notNull()
      .default(false),

    sortOrder: integer('sort_order')
      .notNull()
      .default(0),

    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string'
    })
      .notNull()
      .defaultNow()
  },
  table => [
    index('idx_documentation_files_documentation_id')
      .on(table.documentationId),

    index('idx_documentation_files_file_extension')
      .on(table.fileExtension),

    unique('documentation_files_object_key_key')
      .on(table.objectKey)
  ]
)