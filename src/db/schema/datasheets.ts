import { bigint, bigserial, boolean, date, foreignKey, index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { documentType } from "./enums";
import { components } from "./components";

export const datasheets = pgTable("datasheets", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  documentType: documentType("document_type").default("datasheet").notNull(),
  title: varchar({ length: 500 }).notNull(),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  revision: varchar({ length: 100 }),
  documentDate: date("document_date"),
  language: varchar({ length: 20 }).default("en"),
  pageCount: integer("page_count"),
  sourceUrl: varchar("source_url", { length: 1000 }),
  description: text(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_datasheets_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
  uniqueIndex("uq_datasheets_component_file").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.filePath.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_datasheets_component" }).onDelete("cascade"),
]);
