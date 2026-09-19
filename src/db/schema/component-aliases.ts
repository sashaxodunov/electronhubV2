import { bigint, bigserial, boolean, foreignKey, index, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { components } from "./components";

export const componentAliases = pgTable("component_aliases", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  componentId: bigint("component_id", { mode: "number" }).notNull(),
  alias: varchar({ length: 255 }).notNull(),
  aliasType: varchar("alias_type", { length: 100 }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_component_aliases_alias_trgm").using("gin", table.alias.asc().nullsLast().op("gin_trgm_ops")),
  uniqueIndex("uq_component_aliases").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.alias.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.componentId], foreignColumns: [components.id], name: "fk_alias_component" }).onDelete("cascade"),
]);
