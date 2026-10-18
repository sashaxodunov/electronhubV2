CREATE TABLE "electronics_brands" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"website_url" varchar(500),
	"logo_object_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "electronics_brands_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "idx_electronics_brands_name" ON "electronics_brands" USING btree ("name");