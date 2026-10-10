/** файл описания связей между таблицами для Drizzle ORM. */

import { relations } from 'drizzle-orm'
import { manufacturers } from './schema/manufacturers'
import { categories } from './schema/categories'
import { componentSeries } from './schema/component-series'
import { components } from './schema/components'
import { componentVariants } from './schema/component-variants'
import { componentPins } from './schema/component-pins'
import { packages } from './schema/packages'
import { packageMedia } from './schema/package-media'
import { packageVariants } from './schema/package-variants'
import { componentSpecifications } from './schema/component-specifications'
import { componentRatings } from './schema/component-ratings'
import { componentOperatingConditions } from './schema/component-operating-conditions'
import { componentThermal } from './schema/component-thermal'
import { datasheets } from './schema/datasheets'
import { componentAssets } from './schema/component-assets'
import { componentGraphs } from './schema/component-graphs'
import { componentAliases } from './schema/component-aliases'
import { componentRelations } from './schema/component-relations'
import { graphPoints } from './schema/graph-points'
import { glossaryCategories } from './schema/glossary-categories'
import { glossaryTerms } from './schema/glossary-terms'
import { glossaryRelations } from './schema/glossary-relations'
import { componentApplications } from './schema/component-applications'
import { applications } from './schema/applications'
import {
	documentation,
	documentationFiles
} from './schema/documentation'

export const manufacturersRelations = relations(
	manufacturers,
	({ one, many }) => ({
		successor: one(manufacturers, {
			fields: [manufacturers.successorId],
			references: [manufacturers.id],
			relationName: 'manufacturers_successor'
		}),
		successors: many(manufacturers, {
			relationName: 'manufacturers_successor'
		}),
		componentSeries: many(componentSeries),
		components: many(components)
	})
)

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: 'categories_parent'
	}),
	children: many(categories, { relationName: 'categories_parent' }),
	componentSeries: many(componentSeries),
	components: many(components)
}))

export const componentSeriesRelations = relations(
	componentSeries,
	({ one, many }) => ({
		manufacturer: one(manufacturers, {
			fields: [componentSeries.manufacturerId],
			references: [manufacturers.id]
		}),
		category: one(categories, {
			fields: [componentSeries.categoryId],
			references: [categories.id]
		}),
		components: many(components)
	})
)

export const componentsRelations = relations(components, ({ one, many }) => ({
	category: one(categories, {
		fields: [components.categoryId],
		references: [categories.id]
	}),
	series: one(componentSeries, {
		fields: [components.seriesId],
		references: [componentSeries.id]
	}),
	manufacturer: one(manufacturers, {
		fields: [components.manufacturerId],
		references: [manufacturers.id]
	}),
	variants: many(componentVariants),
	pins: many(componentPins),
	specifications: many(componentSpecifications),
	ratings: many(componentRatings),
	operatingConditions: many(componentOperatingConditions),
	thermals: many(componentThermal),
	datasheets: many(datasheets),
	assets: many(componentAssets),
	graphs: many(componentGraphs),
	aliases: many(componentAliases),
	relationsFrom: many(componentRelations, {
		relationName: 'component_relations_from'
	}),
	relationsTo: many(componentRelations, {
		relationName: 'component_relations_to'
	}),
	applications: many(componentApplications)
}))

export const componentVariantsRelations = relations(
	componentVariants,
	({ one }) => ({
		component: one(components, {
			fields: [componentVariants.componentId],
			references: [components.id]
		})
	})
)
export const componentPinsRelations = relations(componentPins, ({ one }) => ({
	component: one(components, {
		fields: [componentPins.componentId],
		references: [components.id]
	})
}))
export const packagesRelations = relations(packages, ({ many }) => ({
	variants: many(packageVariants),
	media: many(packageMedia)
}))
export const packageVariantsRelations = relations(
	packageVariants,
	({ one, many }) => ({
		package: one(packages, {
			fields: [packageVariants.packageId],
			references: [packages.id]
		}),
		media: many(packageMedia)
	})
)
export const packageMediaRelations = relations(packageMedia, ({ one }) => ({
	package: one(packages, {
		fields: [packageMedia.packageId],
		references: [packages.id]
	}),
	packageVariant: one(packageVariants, {
		fields: [packageMedia.packageVariantId],
		references: [packageVariants.id]
	})
}))
export const componentSpecificationsRelations = relations(
	componentSpecifications,
	({ one }) => ({
		component: one(components, {
			fields: [componentSpecifications.componentId],
			references: [components.id]
		})
	})
)
export const componentRatingsRelations = relations(
	componentRatings,
	({ one }) => ({
		component: one(components, {
			fields: [componentRatings.componentId],
			references: [components.id]
		})
	})
)
export const componentOperatingConditionsRelations = relations(
	componentOperatingConditions,
	({ one }) => ({
		component: one(components, {
			fields: [componentOperatingConditions.componentId],
			references: [components.id]
		})
	})
)
export const componentThermalRelations = relations(
	componentThermal,
	({ one }) => ({
		component: one(components, {
			fields: [componentThermal.componentId],
			references: [components.id]
		})
	})
)
export const datasheetsRelations = relations(datasheets, ({ one }) => ({
	component: one(components, {
		fields: [datasheets.componentId],
		references: [components.id]
	})
}))
export const componentAssetsRelations = relations(
	componentAssets,
	({ one, many }) => ({
		component: one(components, {
			fields: [componentAssets.componentId],
			references: [components.id]
		}),
		graphs: many(componentGraphs)
	})
)
export const componentGraphsRelations = relations(
	componentGraphs,
	({ one, many }) => ({
		component: one(components, {
			fields: [componentGraphs.componentId],
			references: [components.id]
		}),
		imageAsset: one(componentAssets, {
			fields: [componentGraphs.imageAssetId],
			references: [componentAssets.id]
		}),
		points: many(graphPoints)
	})
)
export const componentAliasesRelations = relations(
	componentAliases,
	({ one }) => ({
		component: one(components, {
			fields: [componentAliases.componentId],
			references: [components.id]
		})
	})
)
export const componentRelationsRelations = relations(
	componentRelations,
	({ one }) => ({
		from: one(components, {
			fields: [componentRelations.componentId],
			references: [components.id],
			relationName: 'component_relations_from'
		}),
		to: one(components, {
			fields: [componentRelations.relatedComponentId],
			references: [components.id],
			relationName: 'component_relations_to'
		})
	})
)
export const graphPointsRelations = relations(graphPoints, ({ one }) => ({
	graph: one(componentGraphs, {
		fields: [graphPoints.graphId],
		references: [componentGraphs.id]
	})
}))
export const glossaryCategoriesRelations = relations(
	glossaryCategories,
	({ many }) => ({ terms: many(glossaryTerms) })
)
export const glossaryTermsRelations = relations(
	glossaryTerms,
	({ one, many }) => ({
		category: one(glossaryCategories, {
			fields: [glossaryTerms.categoryId],
			references: [glossaryCategories.id]
		}),
		relationsFrom: many(glossaryRelations, {
			relationName: 'glossary_relations_from'
		}),
		relationsTo: many(glossaryRelations, {
			relationName: 'glossary_relations_to'
		})
	})
)
export const glossaryRelationsRelations = relations(
	glossaryRelations,
	({ one }) => ({
		from: one(glossaryTerms, {
			fields: [glossaryRelations.termId],
			references: [glossaryTerms.id],
			relationName: 'glossary_relations_from'
		}),
		to: one(glossaryTerms, {
			fields: [glossaryRelations.relatedTermId],
			references: [glossaryTerms.id],
			relationName: 'glossary_relations_to'
		})
	})
)
export const applicationsRelations = relations(applications, ({ many }) => ({
	componentApplications: many(componentApplications)
}))
export const componentApplicationsRelations = relations(
	componentApplications,
	({ one }) => ({
		component: one(components, {
			fields: [componentApplications.componentId],
			references: [components.id]
		}),
		application: one(applications, {
			fields: [componentApplications.applicationId],
			references: [applications.id]
		})
	})
)

export const documentationRelations = relations(
	documentation,
	({ one, many }) => ({
		component: one(components, {
			fields: [documentation.componentId],
			references: [components.id]
		}),
		files: many(documentationFiles)
	})
)

export const documentationFilesRelations = relations(
	documentationFiles,
	({ one }) => ({
		documentation: one(documentation, {
			fields: [documentationFiles.documentationId],
			references: [documentation.id]
		})
	})
)
