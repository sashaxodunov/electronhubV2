CREATE TABLE "equipment_documentation" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"equipment_id" bigint NOT NULL,
	"documentation_id" bigint NOT NULL,
	"relation_type" varchar(30) DEFAULT 'schematic' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_documentation_pair_unique" UNIQUE("equipment_id","documentation_id")
);
--> statement-breakpoint
CREATE TABLE "equipment_images" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"equipment_id" bigint NOT NULL,
	"object_key" text NOT NULL,
	"alt" varchar(255) NOT NULL,
	"caption" text,
	"image_type" varchar(30) DEFAULT 'overview' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_parameter_definitions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"subcategory_id" bigint,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"default_unit" varchar(50),
	"value_type" varchar(20) DEFAULT 'text' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_parameter_definitions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "equipment_parameters" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"equipment_id" bigint NOT NULL,
	"definition_id" bigint NOT NULL,
	"value" text NOT NULL,
	"unit" varchar(50),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_parameters_equipment_definition_unique" UNIQUE("equipment_id","definition_id")
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"brand_id" bigint,
	"subcategory_id" bigint,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"model" varchar(255),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "equipment_documentation" ADD CONSTRAINT "equipment_documentation_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_documentation" ADD CONSTRAINT "equipment_documentation_documentation_id_documentation_id_fk" FOREIGN KEY ("documentation_id") REFERENCES "public"."documentation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_images" ADD CONSTRAINT "equipment_images_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_parameter_definitions" ADD CONSTRAINT "equipment_parameter_definitions_subcategory_id_documentation_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."documentation_subcategories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_parameters" ADD CONSTRAINT "equipment_parameters_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_parameters" ADD CONSTRAINT "equipment_parameters_definition_id_equipment_parameter_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."equipment_parameter_definitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_brand_id_electronics_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."electronics_brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_subcategory_id_documentation_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."documentation_subcategories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "equipment_documentation_equipment_idx" ON "equipment_documentation" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "equipment_documentation_document_idx" ON "equipment_documentation" USING btree ("documentation_id");--> statement-breakpoint
CREATE INDEX "equipment_images_equipment_idx" ON "equipment_images" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "equipment_images_order_idx" ON "equipment_images" USING btree ("equipment_id","sort_order");--> statement-breakpoint
CREATE INDEX "equipment_parameter_definitions_subcategory_idx" ON "equipment_parameter_definitions" USING btree ("subcategory_id");--> statement-breakpoint
CREATE INDEX "equipment_parameters_equipment_idx" ON "equipment_parameters" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "equipment_brand_id_idx" ON "equipment" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "equipment_subcategory_id_idx" ON "equipment" USING btree ("subcategory_id");
