import { bigint, bigserial, foreignKey, numeric, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { components } from "./components";

export const componentThermal = pgTable("component_thermal", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  symbol: varchar({ length: 100 }),
  value: numeric({ precision: 20, scale: 8 }),
  unit: varchar({ length: 50 }),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_component_thermal").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_thermal_component" }).onDelete("cascade"),
]);
