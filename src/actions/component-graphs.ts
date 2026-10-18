'use server'

import 'server-only'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentAssets, componentGraphs } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

const MAX_ID = /^[1-9]\d*$/

function parseId(value: FormDataEntryValue | null): bigint {
	const text = String(value ?? '')

	if (!MAX_ID.test(text)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(text)
}

function readText(formData: FormData, name: string): string | null {
	const value = String(formData.get(name) ?? '').trim()
	return value || null
}

function readMetadata(formData: FormData) {
	const title = readText(formData, 'title')

	if (!title) {
		throw new Error('Укажите название графика')
	}

	const sourcePageText = readText(formData, 'sourcePage')
	let sourcePage: number | null = null

	if (sourcePageText) {
		sourcePage = Number(sourcePageText)

		if (
			!Number.isSafeInteger(sourcePage) ||
			sourcePage < 1
		) {
			throw new Error('Номер страницы должен быть положительным целым числом')
		}
	}

	const imageAssetIdText = readText(formData, 'imageAssetId')

	let imageAssetId: bigint | null = null

	if (imageAssetIdText) {
		if (!MAX_ID.test(imageAssetIdText)) {
			throw new Error('Некорректный идентификатор изображения')
		}

		imageAssetId = BigInt(imageAssetIdText)
	}

	return {
		title,
		xAxisName: readText(formData, 'xAxisName'),
		xAxisUnit: readText(formData, 'xAxisUnit'),
		yAxisName: readText(formData, 'yAxisName'),
		yAxisUnit: readText(formData, 'yAxisUnit'),
		conditions: readText(formData, 'conditions'),
		sourcePage,
		description: readText(formData, 'description'),
		imageAssetId,
	}
}

async function validateImageAsset(
	componentId: bigint,
	imageAssetId: bigint | null,
) {
	if (imageAssetId === null) return

	const [asset] = await db
		.select({ id: componentAssets.id })
		.from(componentAssets)
		.where(
			and(
				eq(componentAssets.id, imageAssetId),
				eq(componentAssets.componentId, componentId),
				eq(componentAssets.isActive, true),
			),
		)
		.limit(1)

	if (!asset) {
		throw new Error(
			'Изображение не найдено или не принадлежит этому компоненту',
		)
	}
}

function graphPath(componentId: bigint) {
	return `/ admin / components / ${componentId.toString()}?tab = graphs`
}

export async function createComponentGraph(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const metadata = readMetadata(formData)

	await validateImageAsset(componentId, metadata.imageAssetId)

	await db.insert(componentGraphs).values({
		componentId,
		...metadata,
	})

	revalidatePath(graphPath(componentId))
	redirect(graphPath(componentId))
}

export async function updateComponentGraph(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const graphId = parseId(formData.get('graphId'))
	const metadata = readMetadata(formData)

	await validateImageAsset(componentId, metadata.imageAssetId)

	await db
		.update(componentGraphs)
		.set(metadata)
		.where(
			and(
				eq(componentGraphs.id, graphId),
				eq(componentGraphs.componentId, componentId),
			),
		)

	revalidatePath(graphPath(componentId))
	redirect(graphPath(componentId))
}

export async function deleteComponentGraph(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const graphId = parseId(formData.get('graphId'))

	await db
		.delete(componentGraphs)
		.where(
			and(
				eq(componentGraphs.id, graphId),
				eq(componentGraphs.componentId, componentId),
			),
		)

	revalidatePath(graphPath(componentId))
	redirect(graphPath(componentId))
}
