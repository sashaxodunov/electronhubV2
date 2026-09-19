import { bigint, bigserial, boolean, check, foreignKey, index, integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { packageMediaType } from "./enums";
import { packages } from "./packages";
import { packageVariants } from "./package-variants";

export const packageMedia = pgTable("package_media", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  packageId: bigint("package_id", { mode: "number" }),
  packageVariantId: bigint("package_variant_id", { mode: "number" }),
  mediaType: packageMediaType("media_type").notNull(),
  title: varchar({ length: 255 }),
  fileUrl: text("file_url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: bigint("file_size", { mode: "number" }),
  width: integer(),
  height: integer(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  description: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("uq_package_media_package_file").using("btree", table.packageId.asc().nullsLast().op("int8_ops"), table.fileUrl.asc().nullsLast().op("text_ops")),
  uniqueIndex("uq_package_media_variant_file").using("btree", table.packageVariantId.asc().nullsLast().op("int8_ops"), table.fileUrl.asc().nullsLast().op("text_ops")),
  foreignKey({ columns: [table.packageId], foreignColumns: [packages.id], name: "package_media_package_id_fkey" }).onDelete("cascade"),
  foreignKey({ columns: [table.packageVariantId], foreignColumns: [packageVariants.id], name: "package_media_package_variant_id_fkey" }).onDelete("cascade"),
  check("package_media_owner_check", sql`(package_id IS NOT NULL) OR (package_variant_id IS NOT NULL)`),
]);
