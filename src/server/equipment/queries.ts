import 'server-only'

import { asc, eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import {
	electronicsBrands,
	equipment,
	equipmentDocumentation,
	equipmentImages,
	equipmentParameterDefinitions,
	equipmentParameters,
} from '@/db/schema'

export async function getEquipmentByDocumentationId(
	documentationId: bigint,
) {
	const linkedEquipment = await db
		.select({
			id: equipment.id,
			title: equipment.title,
			slug: equipment.slug,
			model: equipment.model,
			description: equipment.description,
			brandName: electronicsBrands.name,
			relationType: equipmentDocumentation.relationType,
			subcategoryId: equipment.subcategoryId,
		})
		.from(equipmentDocumentation)
		.innerJoin(
			equipment,
			eq(equipmentDocumentation.equipmentId, equipment.id),
		)
		.leftJoin(
			electronicsBrands,
			eq(equipment.brandId, electronicsBrands.id),
		)
		.where(eq(equipmentDocumentation.documentationId, documentationId))
		.orderBy(asc(equipment.title))

	if (linkedEquipment.length === 0) {
		return []
	}

	const equipmentIds = linkedEquipment.map((item) => item.id)

	const [allParameters, allImages] = await Promise.all([
		db
			.select({
				id: equipmentParameters.id,
				equipmentId: equipmentParameters.equipmentId,
				name: equipmentParameterDefinitions.name,
				slug: equipmentParameterDefinitions.slug,
				value: equipmentParameters.value,
				unit: equipmentParameters.unit,
				defaultUnit: equipmentParameterDefinitions.defaultUnit,
				valueType: equipmentParameterDefinitions.valueType,
				sortOrder: equipmentParameters.sortOrder,
				definitionSortOrder: equipmentParameterDefinitions.sortOrder,
			})
			.from(equipmentParameters)
			.innerJoin(
				equipmentParameterDefinitions,
				eq(
					equipmentParameters.definitionId,
					equipmentParameterDefinitions.id,
				),
			)
			.where(inArray(equipmentParameters.equipmentId, equipmentIds))
			.orderBy(
				asc(equipmentParameters.sortOrder),
				asc(equipmentParameterDefinitions.sortOrder),
			),

		db
			.select({
				id: equipmentImages.id,
				equipmentId: equipmentImages.equipmentId,
				objectKey: equipmentImages.objectKey,
				alt: equipmentImages.alt,
				caption: equipmentImages.caption,
				imageType: equipmentImages.imageType,
				isPrimary: equipmentImages.isPrimary,
				sortOrder: equipmentImages.sortOrder,
			})
			.from(equipmentImages)
			.where(inArray(equipmentImages.equipmentId, equipmentIds))
			.orderBy(
				asc(equipmentImages.sortOrder),
				asc(equipmentImages.id),
			),
	])

	return linkedEquipment.map((item) => ({
		...item,

		parameters: allParameters
			.filter((parameter) => parameter.equipmentId === item.id)
			.map((parameter) => ({
				id: parameter.id,
				name: parameter.name,
				slug: parameter.slug,
				value: parameter.value,
				unit: parameter.unit ?? parameter.defaultUnit,
				valueType: parameter.valueType,
			})),

		images: allImages.filter((image) => image.equipmentId === item.id),
	}))
}
