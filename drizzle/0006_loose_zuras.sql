CREATE TABLE "datasheet_storage_cleanup" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"object_key" varchar(1000) NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_datasheet_storage_cleanup_object_key" ON "datasheet_storage_cleanup" USING btree ("object_key");