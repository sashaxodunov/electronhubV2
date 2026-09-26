CREATE TABLE "component_media" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"component_id" bigint NOT NULL,
	"asset_type" "asset_type" NOT NULL,
	"title" varchar(255),
	"file_url" text NOT NULL,
	"mime_type" varchar(100),
	"file_size" bigint,
	"width" integer,
	"height" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"alt_text" varchar(255),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "datasheets" ALTER COLUMN "language" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "datasheets" ADD COLUMN "mime_type" varchar(100);--> statement-breakpoint
ALTER TABLE "datasheets" ADD COLUMN "file_size" bigint;--> statement-breakpoint
ALTER TABLE "component_media" ADD CONSTRAINT "component_media_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_component_media_component_id" ON "component_media" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "idx_component_media_asset_type" ON "component_media" USING btree ("asset_type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_component_media_component_file" ON "component_media" USING btree ("component_id" int8_ops,"file_url" text_ops);--> statement-breakpoint
CREATE INDEX "idx_datasheets_document_type" ON "datasheets" USING btree ("document_type");