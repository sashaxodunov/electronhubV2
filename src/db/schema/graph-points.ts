import { bigint, bigserial, foreignKey, integer, numeric, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { componentGraphs } from "./component-graphs";

export const graphPoints = pgTable("graph_points", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  graphId: bigint("graph_id", { mode: "number" }).notNull(),
  seriesName: varchar("series_name", { length: 255 }),
  xValue: numeric("x_value", { precision: 20, scale: 8 }).notNull(),
  yValue: numeric("y_value", { precision: 20, scale: 8 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
  uniqueIndex("uq_graph_points").using("btree", table.graphId.asc().nullsLast().op("int8_ops"), table.seriesName.asc().nullsLast().op("text_ops"), table.xValue.asc().nullsLast().op("numeric_ops"), table.yValue.asc().nullsLast().op("numeric_ops")),
  foreignKey({ columns: [table.graphId], foreignColumns: [componentGraphs.id], name: "fk_graph_points_graph" }).onDelete("cascade"),
]);
