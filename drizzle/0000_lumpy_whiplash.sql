-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."asset_type" AS ENUM('symbol', 'package', 'photo', 'schematic', 'application_circuit', 'block_diagram', 'graph', 'table', 'dimension', 'marking', 'other');--> statement-breakpoint
CREATE TYPE "public"."component_status" AS ENUM('active', 'obsolete', 'deprecated', 'preview');--> statement-breakpoint
CREATE TYPE "public"."component_variant_status" AS ENUM('active', 'obsolete', 'deprecated');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('datasheet', 'application_note', 'reference_design', 'manual', 'errata', 'other');--> statement-breakpoint
CREATE TYPE "public"."glossary_relation_type" AS ENUM('related', 'synonym', 'parent', 'child', 'abbreviation', 'see_also');--> statement-breakpoint
CREATE TYPE "public"."package_media_type" AS ENUM('image', 'svg', 'drawing', '3d', 'pdf', 'datasheet', 'model', 'other');--> statement-breakpoint
CREATE TYPE "public"."pin_type" AS ENUM('input', 'output', 'power', 'ground', 'io', 'control', 'passive', 'nc');--> statement-breakpoint
CREATE TYPE "public"."relation_type" AS ENUM('equivalent', 'replacement', 'alternative', 'compatible', 'similar', 'contains', 'related');--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100),
	"slug" varchar(255) NOT NULL,
	"country" varchar(100),
	"website" varchar(500),
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"successor_id" bigint,
	CONSTRAINT "manufacturers_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"parent_id" bigint,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "component_series" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"manufacturer_id" bigint,
	"category_id" bigint,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "component_series_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "component_variants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"package_id" bigint,
	"designation" varchar(150) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"marking" varchar(150),
	"description" text,
	"process" varchar(100),
	"packing" varchar(100),
	"operating_temp_min" numeric(10, 3),
	"operating_temp_max" numeric(10, 3),
	"status" "component_variant_status" DEFAULT 'active' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "component_variants_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"standard" varchar(50),
	"body_type" varchar(50),
	"mounting_type" varchar(20),
	"pin_count" integer,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "packages_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "component_pins" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"pin_number" varchar(20) NOT NULL,
	"pin_name" varchar(100) NOT NULL,
	"pin_type" "pin_type" NOT NULL,
	"function" varchar(255),
	"description" text,
	"active_level" varchar(20),
	"element" varchar(100),
	"is_exposed_pad" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_media" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"package_id" bigint,
	"package_variant_id" bigint,
	"media_type" "package_media_type" NOT NULL,
	"title" varchar(255),
	"file_url" text NOT NULL,
	"mime_type" varchar(100),
	"file_size" bigint,
	"width" integer,
	"height" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "package_media_owner_check" CHECK ((package_id IS NOT NULL) OR (package_variant_id IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "component_specifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(100),
	"value_min" numeric(20, 8),
	"value_typ" numeric(20, 8),
	"value_max" numeric(20, 8),
	"unit" varchar(50),
	"condition_text" text,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_ratings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(100),
	"value_min" numeric(20, 8),
	"value_typ" numeric(20, 8),
	"value_max" numeric(20, 8),
	"unit" varchar(50),
	"condition_text" text,
	"note" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_operating_conditions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(100),
	"value_min" numeric(20, 8),
	"value_typ" numeric(20, 8),
	"value_max" numeric(20, 8),
	"unit" varchar(50),
	"condition_text" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_variants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"package_id" bigint NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"manufacturer" varchar(150),
	"pin_count" integer,
	"pitch_mm" numeric(8, 3),
	"length_mm" numeric(8, 3),
	"width_mm" numeric(8, 3),
	"height_mm" numeric(8, 3),
	"body_length_mm" numeric(8, 3),
	"body_width_mm" numeric(8, 3),
	"lead_length_mm" numeric(8, 3),
	"lead_width_mm" numeric(8, 3),
	"thermal_pad" boolean DEFAULT false NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"variant_code" varchar(100),
	"standard_code" varchar(100),
	"body_shape" varchar(50),
	"lead_count" integer,
	"pitch_x_mm" numeric(8, 3),
	"pitch_y_mm" numeric(8, 3),
	"terminal_width_mm" numeric(8, 3),
	"terminal_length_mm" numeric(8, 3),
	"exposed_pad_length_mm" numeric(8, 3),
	"exposed_pad_width_mm" numeric(8, 3),
	"package_drawing_url" text,
	CONSTRAINT "package_variants_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applications_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "components" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"category_id" bigint NOT NULL,
	"series_id" bigint,
	"manufacturer_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"designation" varchar(150) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"short_description" text,
	"function" varchar(255),
	"status" "component_status" DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "components_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "component_thermal" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(100),
	"value" numeric(20, 8),
	"unit" varchar(50),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "datasheets" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"document_type" "document_type" DEFAULT 'datasheet' NOT NULL,
	"title" varchar(500) NOT NULL,
	"file_path" varchar(1000) NOT NULL,
	"file_name" varchar(255),
	"revision" varchar(100),
	"document_date" date,
	"language" varchar(20) DEFAULT 'en',
	"page_count" integer,
	"source_url" varchar(1000),
	"description" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_assets" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"asset_type" "asset_type" NOT NULL,
	"title" varchar(500),
	"file_path" varchar(1000) NOT NULL,
	"file_name" varchar(255),
	"mime_type" varchar(100),
	"width" integer,
	"height" integer,
	"page_number" integer,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_graphs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"title" varchar(500) NOT NULL,
	"x_axis_name" varchar(255),
	"x_axis_unit" varchar(50),
	"y_axis_name" varchar(255),
	"y_axis_unit" varchar(50),
	"conditions" text,
	"source_page" integer,
	"description" text,
	"image_asset_id" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_aliases" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"alias" varchar(255) NOT NULL,
	"alias_type" varchar(100),
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component_relations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"related_component_id" bigint NOT NULL,
	"relation_type" "relation_type" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_component_relation_not_self" CHECK (component_id <> related_component_id)
);
--> statement-breakpoint
CREATE TABLE "graph_points" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"graph_id" bigint NOT NULL,
	"series_name" varchar(255),
	"x_value" numeric(20, 8) NOT NULL,
	"y_value" numeric(20, 8) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glossary_categories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "glossary_categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"term" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"english_term" varchar(255),
	"abbreviation" varchar(100),
	"short_definition" text NOT NULL,
	"definition" text,
	"category_id" bigint,
	"language" varchar(10) DEFAULT 'ru' NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"search_vector" "tsvector",
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "glossary_terms_slug_key" UNIQUE("slug"),
	CONSTRAINT "chk_glossary_terms_language" CHECK ((language)::text = ANY ((ARRAY['ru'::character varying, 'en'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "glossary_relations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"term_id" bigint NOT NULL,
	"related_term_id" bigint NOT NULL,
	"relation_type" "glossary_relation_type" DEFAULT 'related' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_glossary_relation" UNIQUE("term_id","relation_type","related_term_id"),
	CONSTRAINT "chk_glossary_relation_not_self" CHECK (term_id <> related_term_id)
);
--> statement-breakpoint
CREATE TABLE "component_applications" (
	"component_id" bigint NOT NULL,
	"application_id" bigint NOT NULL,
	"description" text,
	CONSTRAINT "component_applications_pkey" PRIMARY KEY("component_id","application_id")
);
--> statement-breakpoint
ALTER TABLE "manufacturers" ADD CONSTRAINT "manufacturers_successor_id_fkey" FOREIGN KEY ("successor_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "fk_categories_parent" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_series" ADD CONSTRAINT "fk_series_manufacturer" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_series" ADD CONSTRAINT "fk_series_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_variants" ADD CONSTRAINT "fk_variants_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_pins" ADD CONSTRAINT "fk_pins_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_media" ADD CONSTRAINT "package_media_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_media" ADD CONSTRAINT "package_media_package_variant_id_fkey" FOREIGN KEY ("package_variant_id") REFERENCES "public"."package_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_specifications" ADD CONSTRAINT "fk_specifications_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_ratings" ADD CONSTRAINT "fk_ratings_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_operating_conditions" ADD CONSTRAINT "fk_operating_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_variants" ADD CONSTRAINT "package_variants_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "fk_components_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "fk_components_series" FOREIGN KEY ("series_id") REFERENCES "public"."component_series"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "fk_components_manufacturer" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_thermal" ADD CONSTRAINT "fk_thermal_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasheets" ADD CONSTRAINT "fk_datasheets_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_assets" ADD CONSTRAINT "fk_assets_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_graphs" ADD CONSTRAINT "fk_graph_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_graphs" ADD CONSTRAINT "fk_graph_asset" FOREIGN KEY ("image_asset_id") REFERENCES "public"."component_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_aliases" ADD CONSTRAINT "fk_alias_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_relations" ADD CONSTRAINT "fk_relation_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_relations" ADD CONSTRAINT "fk_relation_related" FOREIGN KEY ("related_component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graph_points" ADD CONSTRAINT "fk_graph_points_graph" FOREIGN KEY ("graph_id") REFERENCES "public"."component_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_terms" ADD CONSTRAINT "fk_glossary_terms_category" FOREIGN KEY ("category_id") REFERENCES "public"."glossary_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_relations" ADD CONSTRAINT "fk_glossary_relation_term" FOREIGN KEY ("term_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glossary_relations" ADD CONSTRAINT "fk_glossary_relation_related" FOREIGN KEY ("related_term_id") REFERENCES "public"."glossary_terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_applications" ADD CONSTRAINT "fk_component_applications_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_applications" ADD CONSTRAINT "fk_component_applications_application" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_categories_parent_id" ON "categories" USING btree ("parent_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_component_series_category_id" ON "component_series" USING btree ("category_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_component_series_is_active" ON "component_series" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_component_series_manufacturer_id" ON "component_series" USING btree ("manufacturer_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_component_series_name" ON "component_series" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_variants_component_id" ON "component_variants" USING btree ("component_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_component_pins_component_id" ON "component_pins" USING btree ("component_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_pins_component_number" ON "component_pins" USING btree ("component_id" int8_ops,"pin_number" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_package_media_package_file" ON "package_media" USING btree ("package_id" int8_ops,"file_url" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_package_media_variant_file" ON "package_media" USING btree ("package_variant_id" int8_ops,"file_url" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_specifications_component_id" ON "component_specifications" USING btree ("component_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_specifications" ON "component_specifications" USING btree ("component_id" int8_ops,"name" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_ratings" ON "component_ratings" USING btree ("component_id" int8_ops,"name" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_operating_conditions" ON "component_operating_conditions" USING btree ("component_id" int8_ops,"name" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_components_category_id" ON "components" USING btree ("category_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_components_designation_trgm" ON "components" USING gin ("designation" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_components_manufacturer_id" ON "components" USING btree ("manufacturer_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_components_name_trgm" ON "components" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_components_series_id" ON "components" USING btree ("series_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_thermal" ON "component_thermal" USING btree ("component_id" int8_ops,"name" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_datasheets_component_id" ON "datasheets" USING btree ("component_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_datasheets_component_file" ON "datasheets" USING btree ("component_id" int8_ops,"file_path" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_assets_component_file" ON "component_assets" USING btree ("component_id" int8_ops,"file_path" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_graphs" ON "component_graphs" USING btree ("component_id" int8_ops,"title" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_component_aliases_alias_trgm" ON "component_aliases" USING gin ("alias" gin_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_aliases" ON "component_aliases" USING btree ("component_id" int8_ops,"alias" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_relations" ON "component_relations" USING btree ("component_id" int8_ops,"related_component_id" int8_ops,"relation_type" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_graph_points" ON "graph_points" USING btree ("graph_id" int8_ops,"series_name" int8_ops,"x_value" int8_ops,"y_value" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_categories_active" ON "glossary_categories" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_categories_sort" ON "glossary_categories" USING btree ("sort_order" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_active" ON "glossary_terms" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_category" ON "glossary_terms" USING btree ("category_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_language" ON "glossary_terms" USING btree ("language" text_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_search" ON "glossary_terms" USING gin ("search_vector" tsvector_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_slug" ON "glossary_terms" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_terms_term" ON "glossary_terms" USING btree ("term" text_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_relations_related" ON "glossary_relations" USING btree ("related_term_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_relations_term" ON "glossary_relations" USING btree ("term_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_glossary_relations_type" ON "glossary_relations" USING btree ("relation_type" enum_ops);
*/