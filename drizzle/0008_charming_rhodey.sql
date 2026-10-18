CREATE TABLE "documentation_subcategories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"category_slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documentation_subcategories_category_slug_slug_key" UNIQUE("category_slug","slug"),
	CONSTRAINT "documentation_subcategories_category_slug_title_key" UNIQUE("category_slug","title")
);
--> statement-breakpoint
ALTER TABLE "documentation" ADD COLUMN "subcategory_id" bigint;--> statement-breakpoint
CREATE INDEX "idx_documentation_subcategories_category_slug" ON "documentation_subcategories" USING btree ("category_slug");--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "fk_documentation_subcategory" FOREIGN KEY ("subcategory_id") REFERENCES "public"."documentation_subcategories"("id") ON DELETE set null ON UPDATE no action;