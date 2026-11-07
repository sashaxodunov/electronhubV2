ALTER TABLE "equipment_documentation" DROP CONSTRAINT "equipment_documentation_pair_unique";--> statement-breakpoint
ALTER TABLE "equipment_documentation" DROP CONSTRAINT "equipment_documentation_equipment_id_equipment_id_fk";
--> statement-breakpoint
ALTER TABLE "equipment_documentation" DROP CONSTRAINT "equipment_documentation_documentation_id_documentation_id_fk";
--> statement-breakpoint
DROP INDEX "equipment_documentation_equipment_idx";--> statement-breakpoint
DROP INDEX "equipment_documentation_document_idx";--> statement-breakpoint
ALTER TABLE "equipment_documentation" ALTER COLUMN "relation_type" SET DEFAULT 'related';--> statement-breakpoint
ALTER TABLE "equipment_documentation" ALTER COLUMN "sort_order" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "equipment_documentation" ADD CONSTRAINT "fk_equipment_documentation_equipment" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_documentation" ADD CONSTRAINT "fk_equipment_documentation_documentation" FOREIGN KEY ("documentation_id") REFERENCES "public"."documentation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_equipment_documentation_documentation_id" ON "equipment_documentation" USING btree ("documentation_id");--> statement-breakpoint
CREATE INDEX "idx_equipment_documentation_equipment_id" ON "equipment_documentation" USING btree ("equipment_id");--> statement-breakpoint
ALTER TABLE "equipment_documentation" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "equipment_documentation" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "equipment_documentation" ADD CONSTRAINT "equipment_documentation_equipment_documentation_key" UNIQUE("equipment_id","documentation_id");