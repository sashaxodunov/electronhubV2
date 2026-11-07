import 'server-only'

import {
	and,
	asc,
	count,
	desc,
	eq,
	ilike,
	inArray,
	or,
} from 'drizzle-orm'

import { db } from '@/db'
import {
	electronicsBrands,
	equipment,
	equipmentImages,
	equipmentDocumentation,
	equipmentParameters,
} from '@/db/schema'

const DEFAULT_PAGE_SIZE = 20

interface GetAdminEquipmentOptions {
	query?: string
	page?: number
	pageSize?: number
}

export async function getAdminEquipmentList({
	query = '',
	page = 1,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetAdminEquipmentOptions = {}) {
	const normalizedQuery = query.trim()
	const currentPage = Math.max(1, Math.floor(page))
	const limit = Math.min(100, Math.max(1, Math.floor(pageSize)))
	const offset = (currentPage - 1) * limit

	const searchCondition = normalizedQuery
		? or(
			ilike(equipment.title, `%${normalizedQuery}%`),
			ilike(equipment.slug, `%${normalizedQuery}%`),
			ilike(equipment.model, `%${normalizedQuery}%`),
			ilike(electronicsBrands.name, `%${normalizedQuery}%`),
		)
		: undefined

	const whereCondition = searchCondition
		? and(searchCondition)
		: undefined

	const [items, totalResult] = await Promise.all([
		db
			.select({
				id: equipment.id,
				title: equipment.title,
				slug: equipment.slug,
				model: equipment.model,
				description: equipment.description,
				brandName: electronicsBrands.name,
				createdAt: equipment.createdAt,
				updatedAt: equipment.updatedAt,
			})
			.from(equipment)
			.leftJoin(
				electronicsBrands,
				eq(equipment.brandId, electronicsBrands.id),
			)
			.where(whereCondition)
			.orderBy(desc(equipment.updatedAt), asc(equipment.title))
			.limit(limit)
			.offset(offset),

		db
			.select({
				total: count(),
			})
			.from(equipment)
			.leftJoin(
				electronicsBrands,
				eq(equipment.brandId, electronicsBrands.id),
			)
			.where(whereCondition),
	])

	const total = totalResult[0]?.total ?? 0

	if (items.length === 0) {
		return {
			items: [],
			total,
			page: currentPage,
			pageSize: limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	const equipmentIds = items.map(item => item.id)

	const [imageRows, parameterRows, documentationRows] =
		await Promise.all([
			db
				.select({
					equipmentId: equipmentImages.equipmentId,
					isPrimary: equipmentImages.isPrimary,
				})
				.from(equipmentImages)
				.where(
					// Считаем изображения только для текущей страницы.
					equipmentIds.length
						? inArray(equipmentImages.equipmentId, equipmentIds)
						: eq(equipmentImages.equipmentId, equipmentIds[0]),
				),

			db
				.select({
					equipmentId: equipmentParameters.equipmentId,
				})
				.from(equipmentParameters)
				.where(inArray(equipmentParameters.equipmentId, equipmentIds)),

			db
				.select({
					equipmentId: equipmentDocumentation.equipmentId,
				})
				.from(equipmentDocumentation)
				.where(
					inArray(equipmentDocumentation.equipmentId, equipmentIds),
				),
		])

	return {
		items: items.map(item => {
			const images = imageRows.filter(
				image => image.equipmentId === item.id,
			)

			return {
				...item,
				imageCount: images.length,
				hasPrimaryImage: images.some(image => image.isPrimary),
				parameterCount: parameterRows.filter(
					parameter => parameter.equipmentId === item.id,
				).length,
				documentationCount: documentationRows.filter(
					document => document.equipmentId === item.id,
				).length,
			}
		}),
		total,
		page: currentPage,
		pageSize: limit,
		totalPages: Math.ceil(total / limit),
	}
}