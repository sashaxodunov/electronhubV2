import { bigserial, boolean, integer, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

export const packages = pgTable("packages", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  name: varchar({ length: 150 }).notNull(),
  slug: varchar({ length: 150 }).notNull(),
  standard: varchar({ length: 50 }),
  bodyType: varchar("body_type", { length: 50 }),
  mountingType: varchar("mounting_type", { length: 20 }),
  pinCount: integer("pin_count"),
  description: text(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [unique("packages_slug_key").on(table.slug)]);
