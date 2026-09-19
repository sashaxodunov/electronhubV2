import { pgTable, foreignKey, unique, bigserial, varchar, text, boolean, timestamp, bigint, index, integer, numeric, uniqueIndex, check, date, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const assetType = pgEnum("asset_type", ['symbol', 'package', 'photo', 'schematic', 'application_circuit', 'block_diagram', 'graph', 'table', 'dimension', 'marking', 'other'])
export const componentStatus = pgEnum("component_status", ['active', 'obsolete', 'deprecated', 'preview'])
export const componentVariantStatus = pgEnum("component_variant_status", ['active', 'obsolete', 'deprecated'])
export const documentType = pgEnum("document_type", ['datasheet', 'application_note', 'reference_design', 'manual', 'errata', 'other'])
export const glossaryRelationType = pgEnum("glossary_relation_type", ['related', 'synonym', 'parent', 'child', 'abbreviation', 'see_also'])
export const packageMediaType = pgEnum("package_media_type", ['image', 'svg', 'drawing', '3d', 'pdf', 'datasheet', 'model', 'other'])
export const pinType = pgEnum("pin_type", ['input', 'output', 'power', 'ground', 'io', 'control', 'passive', 'nc'])
export const relationType = pgEnum("relation_type", ['equivalent', 'replacement', 'alternative', 'compatible', 'similar', 'contains', 'related'])


export const manufacturers = pgTable("manufacturers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	shortName: varchar("short_name", { length: 100 }),
	slug: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 100 }),
	website: varchar({ length: 500 }),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	successorId: bigint("successor_id", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.successorId],
			foreignColumns: [table.id],
			name: "manufacturers_successor_id_fkey"
		}).onDelete("set null"),
	unique("manufacturers_slug_key").on(table.slug),
]);

export const categories = pgTable("categories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
	name: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 150 }).notNull(),
	description: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_categories_parent_id").using("btree", table.parentId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "fk_categories_parent"
		}).onDelete("cascade"),
	unique("categories_slug_key").on(table.slug),
]);

export const componentSeries = pgTable("component_series", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	manufacturerId: bigint("manufacturer_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_component_series_category_id").using("btree", table.categoryId.asc().nullsLast().op("int8_ops")),
	index("idx_component_series_is_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_component_series_manufacturer_id").using("btree", table.manufacturerId.asc().nullsLast().op("int8_ops")),
	index("idx_component_series_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.manufacturerId],
			foreignColumns: [manufacturers.id],
			name: "fk_series_manufacturer"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "fk_series_category"
		}).onDelete("set null"),
	unique("component_series_slug_key").on(table.slug),
]);

export const componentVariants = pgTable("component_variants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	packageId: bigint("package_id", { mode: "number" }),
	designation: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	marking: varchar({ length: 150 }),
	description: text(),
	process: varchar({ length: 100 }),
	packing: varchar({ length: 100 }),
	operatingTempMin: numeric("operating_temp_min", { precision: 10, scale:  3 }),
	operatingTempMax: numeric("operating_temp_max", { precision: 10, scale:  3 }),
	status: componentVariantStatus().default('active').notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_variants_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_variants_component"
		}).onDelete("cascade"),
	unique("component_variants_slug_key").on(table.slug),
]);

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
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("packages_slug_key").on(table.slug),
]);

export const componentPins = pgTable("component_pins", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_component_pins_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_component_pins_component_number").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.pinNumber.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_pins_component"
		}).onDelete("cascade"),
]);

export const packageMedia = pgTable("package_media", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	packageId: bigint("package_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	packageVariantId: bigint("package_variant_id", { mode: "number" }),
	mediaType: packageMediaType("media_type").notNull(),
	title: varchar({ length: 255 }),
	fileUrl: text("file_url").notNull(),
	mimeType: varchar("mime_type", { length: 100 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	width: integer(),
	height: integer(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_package_media_package_file").using("btree", table.packageId.asc().nullsLast().op("int8_ops"), table.fileUrl.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_package_media_variant_file").using("btree", table.packageVariantId.asc().nullsLast().op("int8_ops"), table.fileUrl.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: "package_media_package_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.packageVariantId],
			foreignColumns: [packageVariants.id],
			name: "package_media_package_variant_id_fkey"
		}).onDelete("cascade"),
	check("package_media_owner_check", sql`(package_id IS NOT NULL) OR (package_variant_id IS NOT NULL)`),
]);

export const componentSpecifications = pgTable("component_specifications", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	symbol: varchar({ length: 100 }),
	valueMin: numeric("value_min", { precision: 20, scale:  8 }),
	valueTyp: numeric("value_typ", { precision: 20, scale:  8 }),
	valueMax: numeric("value_max", { precision: 20, scale:  8 }),
	unit: varchar({ length: 50 }),
	conditionText: text("condition_text"),
	description: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_specifications_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_component_specifications").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_specifications_component"
		}).onDelete("cascade"),
]);

export const componentRatings = pgTable("component_ratings", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	symbol: varchar({ length: 100 }),
	valueMin: numeric("value_min", { precision: 20, scale:  8 }),
	valueTyp: numeric("value_typ", { precision: 20, scale:  8 }),
	valueMax: numeric("value_max", { precision: 20, scale:  8 }),
	unit: varchar({ length: 50 }),
	conditionText: text("condition_text"),
	note: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_ratings").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_ratings_component"
		}).onDelete("cascade"),
]);

export const componentOperatingConditions = pgTable("component_operating_conditions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	symbol: varchar({ length: 100 }),
	valueMin: numeric("value_min", { precision: 20, scale:  8 }),
	valueTyp: numeric("value_typ", { precision: 20, scale:  8 }),
	valueMax: numeric("value_max", { precision: 20, scale:  8 }),
	unit: varchar({ length: 50 }),
	conditionText: text("condition_text"),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_operating_conditions").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_operating_component"
		}).onDelete("cascade"),
]);

export const packageVariants = pgTable("package_variants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	packageId: bigint("package_id", { mode: "number" }).notNull(),
	name: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 150 }).notNull(),
	manufacturer: varchar({ length: 150 }),
	pinCount: integer("pin_count"),
	pitchMm: numeric("pitch_mm", { precision: 8, scale:  3 }),
	lengthMm: numeric("length_mm", { precision: 8, scale:  3 }),
	widthMm: numeric("width_mm", { precision: 8, scale:  3 }),
	heightMm: numeric("height_mm", { precision: 8, scale:  3 }),
	bodyLengthMm: numeric("body_length_mm", { precision: 8, scale:  3 }),
	bodyWidthMm: numeric("body_width_mm", { precision: 8, scale:  3 }),
	leadLengthMm: numeric("lead_length_mm", { precision: 8, scale:  3 }),
	leadWidthMm: numeric("lead_width_mm", { precision: 8, scale:  3 }),
	thermalPad: boolean("thermal_pad").default(false).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	variantCode: varchar("variant_code", { length: 100 }),
	standardCode: varchar("standard_code", { length: 100 }),
	bodyShape: varchar("body_shape", { length: 50 }),
	leadCount: integer("lead_count"),
	pitchXMm: numeric("pitch_x_mm", { precision: 8, scale:  3 }),
	pitchYMm: numeric("pitch_y_mm", { precision: 8, scale:  3 }),
	terminalWidthMm: numeric("terminal_width_mm", { precision: 8, scale:  3 }),
	terminalLengthMm: numeric("terminal_length_mm", { precision: 8, scale:  3 }),
	exposedPadLengthMm: numeric("exposed_pad_length_mm", { precision: 8, scale:  3 }),
	exposedPadWidthMm: numeric("exposed_pad_width_mm", { precision: 8, scale:  3 }),
	packageDrawingUrl: text("package_drawing_url"),
}, (table) => [
	foreignKey({
			columns: [table.packageId],
			foreignColumns: [packages.id],
			name: "package_variants_package_id_fkey"
		}).onDelete("cascade"),
	unique("package_variants_slug_key").on(table.slug),
]);

export const applications = pgTable("applications", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("applications_slug_key").on(table.slug),
]);

export const components = pgTable("components", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	seriesId: bigint("series_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	manufacturerId: bigint("manufacturer_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	designation: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	shortDescription: text("short_description"),
	function: varchar({ length: 255 }),
	status: componentStatus().default('active').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_components_category_id").using("btree", table.categoryId.asc().nullsLast().op("int8_ops")),
	index("idx_components_designation_trgm").using("gin", table.designation.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_components_manufacturer_id").using("btree", table.manufacturerId.asc().nullsLast().op("int8_ops")),
	index("idx_components_name_trgm").using("gin", table.name.asc().nullsLast().op("gin_trgm_ops")),
	index("idx_components_series_id").using("btree", table.seriesId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "fk_components_category"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.seriesId],
			foreignColumns: [componentSeries.id],
			name: "fk_components_series"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.manufacturerId],
			foreignColumns: [manufacturers.id],
			name: "fk_components_manufacturer"
		}).onDelete("restrict"),
	unique("components_slug_key").on(table.slug),
]);

export const componentThermal = pgTable("component_thermal", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	symbol: varchar({ length: 100 }),
	value: numeric({ precision: 20, scale:  8 }),
	unit: varchar({ length: 50 }),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_thermal").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.name.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_thermal_component"
		}).onDelete("cascade"),
]);

export const datasheets = pgTable("datasheets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	documentType: documentType("document_type").default('datasheet').notNull(),
	title: varchar({ length: 500 }).notNull(),
	filePath: varchar("file_path", { length: 1000 }).notNull(),
	fileName: varchar("file_name", { length: 255 }),
	revision: varchar({ length: 100 }),
	documentDate: date("document_date"),
	language: varchar({ length: 20 }).default('en'),
	pageCount: integer("page_count"),
	sourceUrl: varchar("source_url", { length: 1000 }),
	description: text(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_datasheets_component_id").using("btree", table.componentId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_datasheets_component_file").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.filePath.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_datasheets_component"
		}).onDelete("cascade"),
]);

export const componentAssets = pgTable("component_assets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_assets_component_file").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.filePath.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_assets_component"
		}).onDelete("cascade"),
]);

export const componentGraphs = pgTable("component_graphs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	title: varchar({ length: 500 }).notNull(),
	xAxisName: varchar("x_axis_name", { length: 255 }),
	xAxisUnit: varchar("x_axis_unit", { length: 50 }),
	yAxisName: varchar("y_axis_name", { length: 255 }),
	yAxisUnit: varchar("y_axis_unit", { length: 50 }),
	conditions: text(),
	sourcePage: integer("source_page"),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	imageAssetId: bigint("image_asset_id", { mode: "number" }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_graphs").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.title.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_graph_component"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.imageAssetId],
			foreignColumns: [componentAssets.id],
			name: "fk_graph_asset"
		}).onDelete("set null"),
]);

export const componentAliases = pgTable("component_aliases", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	alias: varchar({ length: 255 }).notNull(),
	aliasType: varchar("alias_type", { length: 100 }),
	isPrimary: boolean("is_primary").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_component_aliases_alias_trgm").using("gin", table.alias.asc().nullsLast().op("gin_trgm_ops")),
	uniqueIndex("uq_component_aliases").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.alias.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_alias_component"
		}).onDelete("cascade"),
]);

export const componentRelations = pgTable("component_relations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	relatedComponentId: bigint("related_component_id", { mode: "number" }).notNull(),
	relationType: relationType("relation_type").notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("uq_component_relations").using("btree", table.componentId.asc().nullsLast().op("int8_ops"), table.relatedComponentId.asc().nullsLast().op("int8_ops"), table.relationType.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_relation_component"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.relatedComponentId],
			foreignColumns: [components.id],
			name: "fk_relation_related"
		}).onDelete("cascade"),
	check("chk_component_relation_not_self", sql`component_id <> related_component_id`),
]);

export const graphPoints = pgTable("graph_points", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	graphId: bigint("graph_id", { mode: "number" }).notNull(),
	seriesName: varchar("series_name", { length: 255 }),
	xValue: numeric("x_value", { precision: 20, scale:  8 }).notNull(),
	yValue: numeric("y_value", { precision: 20, scale:  8 }).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => [
	uniqueIndex("uq_graph_points").using("btree", table.graphId.asc().nullsLast().op("int8_ops"), table.seriesName.asc().nullsLast().op("int8_ops"), table.xValue.asc().nullsLast().op("int8_ops"), table.yValue.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.graphId],
			foreignColumns: [componentGraphs.id],
			name: "fk_graph_points_graph"
		}).onDelete("cascade"),
]);

export const glossaryCategories = pgTable("glossary_categories", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_glossary_categories_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_glossary_categories_sort").using("btree", table.sortOrder.asc().nullsLast().op("int4_ops")),
	unique("glossary_categories_slug_key").on(table.slug),
]);

export const glossaryTerms = pgTable("glossary_terms", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	term: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	englishTerm: varchar("english_term", { length: 255 }),
	abbreviation: varchar({ length: 100 }),
	shortDefinition: text("short_definition").notNull(),
	definition: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }),
	language: varchar({ length: 10 }).default('ru').notNull(),
	metaTitle: varchar("meta_title", { length: 255 }),
	metaDescription: text("meta_description"),
	// TODO: failed to parse database type 'tsvector'
	searchVector: unknown("search_vector"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_glossary_terms_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_glossary_terms_category").using("btree", table.categoryId.asc().nullsLast().op("int8_ops")),
	index("idx_glossary_terms_language").using("btree", table.language.asc().nullsLast().op("text_ops")),
	index("idx_glossary_terms_search").using("gin", table.searchVector.asc().nullsLast().op("tsvector_ops")),
	index("idx_glossary_terms_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("idx_glossary_terms_term").using("btree", table.term.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [glossaryCategories.id],
			name: "fk_glossary_terms_category"
		}).onDelete("set null"),
	unique("glossary_terms_slug_key").on(table.slug),
	check("chk_glossary_terms_language", sql`(language)::text = ANY ((ARRAY['ru'::character varying, 'en'::character varying])::text[])`),
]);

export const glossaryRelations = pgTable("glossary_relations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	termId: bigint("term_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	relatedTermId: bigint("related_term_id", { mode: "number" }).notNull(),
	relationType: glossaryRelationType("relation_type").default('related').notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_glossary_relations_related").using("btree", table.relatedTermId.asc().nullsLast().op("int8_ops")),
	index("idx_glossary_relations_term").using("btree", table.termId.asc().nullsLast().op("int8_ops")),
	index("idx_glossary_relations_type").using("btree", table.relationType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.termId],
			foreignColumns: [glossaryTerms.id],
			name: "fk_glossary_relation_term"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.relatedTermId],
			foreignColumns: [glossaryTerms.id],
			name: "fk_glossary_relation_related"
		}).onDelete("cascade"),
	unique("uq_glossary_relation").on(table.termId, table.relationType, table.relatedTermId),
	check("chk_glossary_relation_not_self", sql`term_id <> related_term_id`),
]);

export const componentApplications = pgTable("component_applications", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	componentId: bigint("component_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	applicationId: bigint("application_id", { mode: "number" }).notNull(),
	description: text(),
}, (table) => [
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [components.id],
			name: "fk_component_applications_component"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.applicationId],
			foreignColumns: [applications.id],
			name: "fk_component_applications_application"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.componentId, table.applicationId], name: "component_applications_pkey"}),
]);
