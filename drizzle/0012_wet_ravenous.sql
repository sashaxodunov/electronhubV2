ALTER TABLE "documentation_files" DROP CONSTRAINT "fk_documentation_files_documentation";
--> statement-breakpoint
DROP INDEX "idx_documentation_files_extension";--> statement-breakpoint
ALTER TABLE "documentation_files" ALTER COLUMN "content_type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "documentation" ADD COLUMN "brand_id" bigint;--> statement-breakpoint
ALTER TABLE "documentation_files" ADD CONSTRAINT "documentation_files_documentation_id_documentation_id_fk" FOREIGN KEY ("documentation_id") REFERENCES "public"."documentation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "fk_documentation_brand" FOREIGN KEY ("brand_id") REFERENCES "public"."electronics_brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_documentation_files_file_extension" ON "documentation_files" USING btree ("file_extension");--> statement-breakpoint
CREATE INDEX "idx_documentation_brand_id" ON "documentation" USING btree ("brand_id");