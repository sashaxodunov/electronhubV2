import { bigint, bigserial, foreignKey, index, integer, numeric, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { components } from "./components";

export const componentSpecifications = pgTable("component_specifications", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  symbol: varchar({ length: 100 }),
  valueMin: numeric("value_min", { precision: 20, scale: 8 }),
  valueTyp: numeric("value_typ", { precision: 20, scale: 8 }),
  valueMax: numeric("value_max", { precision: 20, scale: 8 }),
  unit: varchar({ length: 50 }),
  conditionText: text("condition_text"),
  description: text(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_specifications_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
  uniqueIndex("uq_component_specifications").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_specifications_component" }).onDelete("cascade"),
]);
