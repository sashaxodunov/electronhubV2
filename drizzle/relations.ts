import { relations } from "drizzle-orm/relations";
import { manufacturers, categories, componentSeries, components, componentVariants, componentPins, packages, packageMedia, packageVariants, componentSpecifications, componentRatings, componentOperatingConditions, componentThermal, datasheets, componentAssets, componentGraphs, componentAliases, componentRelations, graphPoints, glossaryCategories, glossaryTerms, glossaryRelations, componentApplications, applications } from "./schema";

export const manufacturersRelations = relations(manufacturers, ({one, many}) => ({
	manufacturer: one(manufacturers, {
		fields: [manufacturers.successorId],
		references: [manufacturers.id],
		relationName: "manufacturers_successorId_manufacturers_id"
	}),
	manufacturers: many(manufacturers, {
		relationName: "manufacturers_successorId_manufacturers_id"
	}),
	componentSeries: many(componentSeries),
	components: many(components),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	category: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "categories_parentId_categories_id"
	}),
	categories: many(categories, {
		relationName: "categories_parentId_categories_id"
	}),
	componentSeries: many(componentSeries),
	components: many(components),
}));

export const componentSeriesRelations = relations(componentSeries, ({one, many}) => ({
	manufacturer: one(manufacturers, {
		fields: [componentSeries.manufacturerId],
		references: [manufacturers.id]
	}),
	category: one(categories, {
		fields: [componentSeries.categoryId],
		references: [categories.id]
	}),
	components: many(components),
}));

export const componentVariantsRelations = relations(componentVariants, ({one}) => ({
	component: one(components, {
		fields: [componentVariants.componentId],
		references: [components.id]
	}),
}));

export const componentsRelations = relations(components, ({one, many}) => ({
	componentVariants: many(componentVariants),
	componentPins: many(componentPins),
	componentSpecifications: many(componentSpecifications),
	componentRatings: many(componentRatings),
	componentOperatingConditions: many(componentOperatingConditions),
	category: one(categories, {
		fields: [components.categoryId],
		references: [categories.id]
	}),
	componentSery: one(componentSeries, {
		fields: [components.seriesId],
		references: [componentSeries.id]
	}),
	manufacturer: one(manufacturers, {
		fields: [components.manufacturerId],
		references: [manufacturers.id]
	}),
	componentThermals: many(componentThermal),
	datasheets: many(datasheets),
	componentAssets: many(componentAssets),
	componentGraphs: many(componentGraphs),
	componentAliases: many(componentAliases),
	componentRelations_componentId: many(componentRelations, {
		relationName: "componentRelations_componentId_components_id"
	}),
	componentRelations_relatedComponentId: many(componentRelations, {
		relationName: "componentRelations_relatedComponentId_components_id"
	}),
	componentApplications: many(componentApplications),
}));

export const componentPinsRelations = relations(componentPins, ({one}) => ({
	component: one(components, {
		fields: [componentPins.componentId],
		references: [components.id]
	}),
}));

export const packageMediaRelations = relations(packageMedia, ({one}) => ({
	package: one(packages, {
		fields: [packageMedia.packageId],
		references: [packages.id]
	}),
	packageVariant: one(packageVariants, {
		fields: [packageMedia.packageVariantId],
		references: [packageVariants.id]
	}),
}));

export const packagesRelations = relations(packages, ({many}) => ({
	packageMedias: many(packageMedia),
	packageVariants: many(packageVariants),
}));

export const packageVariantsRelations = relations(packageVariants, ({one, many}) => ({
	packageMedias: many(packageMedia),
	package: one(packages, {
		fields: [packageVariants.packageId],
		references: [packages.id]
	}),
}));

export const componentSpecificationsRelations = relations(componentSpecifications, ({one}) => ({
	component: one(components, {
		fields: [componentSpecifications.componentId],
		references: [components.id]
	}),
}));

export const componentRatingsRelations = relations(componentRatings, ({one}) => ({
	component: one(components, {
		fields: [componentRatings.componentId],
		references: [components.id]
	}),
}));

export const componentOperatingConditionsRelations = relations(componentOperatingConditions, ({one}) => ({
	component: one(components, {
		fields: [componentOperatingConditions.componentId],
		references: [components.id]
	}),
}));

export const componentThermalRelations = relations(componentThermal, ({one}) => ({
	component: one(components, {
		fields: [componentThermal.componentId],
		references: [components.id]
	}),
}));

export const datasheetsRelations = relations(datasheets, ({one}) => ({
	component: one(components, {
		fields: [datasheets.componentId],
		references: [components.id]
	}),
}));

export const componentAssetsRelations = relations(componentAssets, ({one, many}) => ({
	component: one(components, {
		fields: [componentAssets.componentId],
		references: [components.id]
	}),
	componentGraphs: many(componentGraphs),
}));

export const componentGraphsRelations = relations(componentGraphs, ({one, many}) => ({
	component: one(components, {
		fields: [componentGraphs.componentId],
		references: [components.id]
	}),
	componentAsset: one(componentAssets, {
		fields: [componentGraphs.imageAssetId],
		references: [componentAssets.id]
	}),
	graphPoints: many(graphPoints),
}));

export const componentAliasesRelations = relations(componentAliases, ({one}) => ({
	component: one(components, {
		fields: [componentAliases.componentId],
		references: [components.id]
	}),
}));

export const componentRelationsRelations = relations(componentRelations, ({one}) => ({
	component_componentId: one(components, {
		fields: [componentRelations.componentId],
		references: [components.id],
		relationName: "componentRelations_componentId_components_id"
	}),
	component_relatedComponentId: one(components, {
		fields: [componentRelations.relatedComponentId],
		references: [components.id],
		relationName: "componentRelations_relatedComponentId_components_id"
	}),
}));

export const graphPointsRelations = relations(graphPoints, ({one}) => ({
	componentGraph: one(componentGraphs, {
		fields: [graphPoints.graphId],
		references: [componentGraphs.id]
	}),
}));

export const glossaryTermsRelations = relations(glossaryTerms, ({one, many}) => ({
	glossaryCategory: one(glossaryCategories, {
		fields: [glossaryTerms.categoryId],
		references: [glossaryCategories.id]
	}),
	glossaryRelations_termId: many(glossaryRelations, {
		relationName: "glossaryRelations_termId_glossaryTerms_id"
	}),
	glossaryRelations_relatedTermId: many(glossaryRelations, {
		relationName: "glossaryRelations_relatedTermId_glossaryTerms_id"
	}),
}));

export const glossaryCategoriesRelations = relations(glossaryCategories, ({many}) => ({
	glossaryTerms: many(glossaryTerms),
}));

export const glossaryRelationsRelations = relations(glossaryRelations, ({one}) => ({
	glossaryTerm_termId: one(glossaryTerms, {
		fields: [glossaryRelations.termId],
		references: [glossaryTerms.id],
		relationName: "glossaryRelations_termId_glossaryTerms_id"
	}),
	glossaryTerm_relatedTermId: one(glossaryTerms, {
		fields: [glossaryRelations.relatedTermId],
		references: [glossaryTerms.id],
		relationName: "glossaryRelations_relatedTermId_glossaryTerms_id"
	}),
}));

export const componentApplicationsRelations = relations(componentApplications, ({one}) => ({
	component: one(components, {
		fields: [componentApplications.componentId],
		references: [components.id]
	}),
	application: one(applications, {
		fields: [componentApplications.applicationId],
		references: [applications.id]
	}),
}));

export const applicationsRelations = relations(applications, ({many}) => ({
	componentApplications: many(componentApplications),
}));