import { bigint, bigserial, boolean, foreignKey, index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { pinType } from "./enums";
import { components } from "./components";

export const componentPins = pgTable("component_pins", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  pinNumber: varchar("pin_number", { length: 20 }).notNull(),
  pinName: varchar("pin_name", { length: 100 }).notNull(),
  pinType: pinType("pin_type").notNull(),
  function: varchar({ length: 255 }),
  description: text(),
  activeLevel: varchar("active_level", { length: 20 }),
  element: varchar({ length: 100 }),
  isExposedPad: boolean("is_exposed_pad").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_component_pins_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
  uniqueIndex("uq_component_pins_component_number").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.pinNumber.asc().nullsLast().op("int8_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_pins_component" }).onDelete("cascade"),
]);
