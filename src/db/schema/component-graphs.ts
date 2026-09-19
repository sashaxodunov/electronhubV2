import { bigint, bigserial, foreignKey, index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { components } from "./components";
import { componentAssets } from "./component-assets";

export const componentGraphs = pgTable("component_graphs", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  title: varchar({ length: 500 }).notNull(),
  xAxisName: varchar("x_axis_name", { length: 255 }),
  xAxisUnit: varchar("x_axis_unit", { length: 50 }),
  yAxisName: varchar("y_axis_name", { length: 255 }),
  yAxisUnit: varchar("y_axis_unit", { length: 50 }),
  conditions: text(),
  sourcePage: integer("source_page"),
  description: text(),
  imageAssetId: bigint("image_asset_id", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_component_graphs").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.title.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_graph_component" }).onDelete("cascade"),
  foreignKey({ columns: [table.imageAssetId], foreignColumns: [componentAssets.id], name: "fk_graph_asset" }).onDelete("set null"),
]);
