import { bigint, bigserial, boolean, foreignKey, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { assetType } from "./enums";
import { components } from "./components";

export const componentAssets = pgTable("component_assets", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  assetType: assetType("asset_type").notNull(),
  title: varchar({ length: 500 }),
  filePath: varchar("file_path", { length: 1000 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  width: integer(),
  height: integer(),
  pageNumber: integer("page_number"),
  description: text(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_component_assets_component_file").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.filePath.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_assets_component" }).onDelete("cascade"),
]);
