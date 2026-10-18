
'use server'

import 'server-only'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentRelations, components, relationType } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

const MAX_ID = /^[1-9]\d*$/
const relationTypes = relationType.enumValues

function parseId(value: FormDataEntryValue | null): bigint {
	const text = String(value ?? '')

	if (!MAX_ID.test(text)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(text)
}

function readDescription(formData: FormData): string | null {
	const value = String(formData.get('description') ?? '').trim()
	return value || null
}

function readRelationType(formData: FormData) {
	const value = String(formData.get('relationType') ?? '')

	if (!relationTypes.includes(value as (typeof relationTypes)[number])) {
		throw new Error('Некорректный тип связи')
	}

	return value as (typeof relationTypes)[number]
}

async function validateComponents(
	componentId: bigint,
	relatedComponentId: bigint,
) {
	if (componentId === relatedComponentId) {
		throw new Error('Нельзя связать компонент с самим собой')
	}

	const [related] = await db
		.select({ id: components.id })
		.from(components)
		.where(eq(components.id, relatedComponentId))
		.limit(1)

	if (!related) {
		throw new Error('Связанный компонент не найден')
	}
}

function relationsPath(componentId: bigint) {
	return `/admin/components/${componentId.toString()}?tab=relations`
}

export async function createComponentRelation(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const relatedComponentId = parseId(formData.get('relatedComponentId'))
	const type = readRelationType(formData)

	await validateComponents(componentId, relatedComponentId)

	await db.insert(componentRelations).values({
		componentId,
		relatedComponentId,
		relationType: type,
		description: readDescription(formData),
	})

	revalidatePath(relationsPath(componentId))
	redirect(relationsPath(componentId))
}

export async function updateComponentRelation(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const relationId = parseId(formData.get('relationId'))
	const relatedComponentId = parseId(formData.get('relatedComponentId'))
	const type = readRelationType(formData)

	await validateComponents(componentId, relatedComponentId)

	await db
		.update(componentRelations)
		.set({
			relatedComponentId,
			relationType: type,
			description: readDescription(formData),
		})
		.where(
			and(
				eq(componentRelations.id, relationId),
				eq(componentRelations.componentId, componentId),
			),
		)

	revalidatePath(relationsPath(componentId))
	redirect(relationsPath(componentId))
}

export async function deleteComponentRelation(formData: FormData) {
	await requireAdmin()

	const componentId = parseId(formData.get('componentId'))
	const relationId = parseId(formData.get('relationId'))

	await db
		.delete(componentRelations)
		.where(
			and(
				eq(componentRelations.id, relationId),
				eq(componentRelations.componentId, componentId),
			),
		)

	revalidatePath(relationsPath(componentId))
	redirect(relationsPath(componentId))
}
