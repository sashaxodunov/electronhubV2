CREATE TABLE "documentation" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"category_slug" varchar(100) NOT NULL,
	"component_id" bigint,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documentation_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "documentation_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"documentation_id" bigint NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"object_key" text NOT NULL,
	"content_type" varchar(150) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documentation_files_object_key_key" UNIQUE("object_key")
);
--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "fk_documentation_component" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentation_files" ADD CONSTRAINT "fk_documentation_files_documentation" FOREIGN KEY ("documentation_id") REFERENCES "public"."documentation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_documentation_component_id" ON "documentation" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "idx_documentation_status" ON "documentation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_documentation_files_documentation_id" ON "documentation_files" USING btree ("documentation_id");