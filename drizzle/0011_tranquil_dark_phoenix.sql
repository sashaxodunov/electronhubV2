ALTER TABLE "documentation" ADD COLUMN "document_type" varchar(30) DEFAULT 'schematic' NOT NULL;--> statement-breakpoint
ALTER TABLE "documentation_files" ADD COLUMN "file_extension" varchar(20) NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_documentation_document_type" ON "documentation" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "idx_documentation_files_extension" ON "documentation_files" USING btree ("file_extension");