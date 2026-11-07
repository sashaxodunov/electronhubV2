DROP INDEX "idx_equipment_documentation_documentation_id";--> statement-breakpoint
DROP INDEX "idx_equipment_documentation_equipment_id";--> statement-breakpoint
CREATE INDEX "equipment_documentation_documentation_id_idx" ON "equipment_documentation" USING btree ("documentation_id");--> statement-breakpoint
CREATE INDEX "equipment_documentation_equipment_id_idx" ON "equipment_documentation" USING btree ("equipment_id");