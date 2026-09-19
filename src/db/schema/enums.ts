import { pgEnum } from "drizzle-orm/pg-core";

export const assetType = pgEnum("asset_type", ["symbol", "package", "photo", "schematic", "application_circuit", "block_diagram", "graph", "table", "dimension", "marking", "other"]);
export const componentStatus = pgEnum("component_status", ["active", "obsolete", "deprecated", "preview"]);
export const componentVariantStatus = pgEnum("component_variant_status", ["active", "obsolete", "deprecated"]);
export const documentType = pgEnum("document_type", ["datasheet", "application_note", "reference_design", "manual", "errata", "other"]);
export const glossaryRelationType = pgEnum("glossary_relation_type", ["related", "synonym", "parent", "child", "abbreviation", "see_also"]);
export const packageMediaType = pgEnum("package_media_type", ["image", "svg", "drawing", "3d", "pdf", "datasheet", "model", "other"]);
export const pinType = pgEnum("pin_type", ["input", "output", "power", "ground", "io", "control", "passive", "nc"]);
export const relationType = pgEnum("relation_type", ["equivalent", "replacement", "alternative", "compatible", "similar", "contains", "related"]);
