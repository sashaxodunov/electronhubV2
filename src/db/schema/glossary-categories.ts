import { bigserial, boolean, index, integer, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

export const glossaryCategories = pgTable("glossary_categories", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  description: text(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_glossary_categories_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
  index("idx_glossary_categories_sort").using("btree", table.sortOrder.asc().nullsLast().op("int4_ops")),
  unique("glossary_categories_slug_key").on(table.slug),
]);
