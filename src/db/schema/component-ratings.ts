import { bigint, bigserial, foreignKey, integer, numeric, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { components } from "./components";

export const componentRatings = pgTable("component_ratings", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  symbol: varchar({ length: 100 }),
  valueMin: numeric("value_min", { precision: 20, scale: 8 }),
  valueTyp: numeric("value_typ", { precision: 20, scale: 8 }),
  valueMax: numeric("value_max", { precision: 20, scale: 8 }),
  unit: varchar({ length: 50 }),
  conditionText: text("condition_text"),
  note: text(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_component_ratings").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_ratings_component" }).onDelete("cascade"),
]);
