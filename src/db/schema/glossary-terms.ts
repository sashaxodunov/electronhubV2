import { bigint, bigserial, boolean, check, foreignKey, index, pgTable, sql, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { glossaryCategories } from "./glossary-categories";

export const glossaryTerms = pgTable("glossary_terms", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  term: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  englishTerm: varchar("english_term", { length: 255 }),
  abbreviation: varchar({ length: 100 }),
  shortDefinition: text("short_definition").notNull(),
  definition: text(),
  categoryId: bigint("category_id", { mode: "number" }),
  language: varchar({ length: 10 }).default("ru").notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  searchVector: sql`search_vector`,
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_glossary_terms_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
  index("idx_glossary_terms_category").using("btree", table.categoryId.asc().nullsLast().op("int8_ops")),
  index("idx_glossary_terms_language").using("btree", table.language.asc().nullsLast().op("text_ops")),
  index("idx_glossary_terms_search").using("gin", table.searchVector.asc().nullsLast().op("tsvector_ops")),
  index("idx_glossary_terms_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
  index("idx_glossary_terms_term").using("btree", table.term.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.categoryId], foreignColumns: [glossaryCategories.id], name: "fk_glossary_terms_category" }).onDelete("set null"),
  unique("glossary_terms_slug_key").on(table.slug),
  check("chk_glossary_terms_language", sql`(language)::text = ANY ((ARRAY['ru'::character varying, 'en'::character varying])::text[])`),
]);
