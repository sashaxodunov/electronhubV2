
'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentOperatingConditions } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

function getRequiredBigInt(
	formData: FormData,
	name: string,
	message: string,
): bigint {
	const value = String(formData.get(name) ?? '').trim()

	if (!value || !/^\d+$/.test(value)) {
		throw new Error(message)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(message)
	}

	return id
}

function getRequiredString(
	formData: FormData,
	name: string,
	message: string,
): string {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(message)
	}

	return value
}

function getOptionalString(
	formData: FormData,
	name: string,
): string | null {
	const value = String(formData.get(name) ?? '').trim()

	return value || null
}

function getOptionalNumber(
	formData: FormData,
	name: string,
): string | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	if (!/^-?\d+(?:[.,]\d+)?$/.test(value)) {
		throw new Error(`Некорректное числовое значение: ${name}`)
	}

	return value.replace(',', '.')
}

function getSortOrder(formData: FormData): number {
	const value = String(formData.get('sortOrder') ?? '').trim()

	if (!value) {
		return 0
	}

	if (!/^\d+$/.test(value)) {
		throw new Error('Некорректный порядок условия')
	}

	const sortOrder = Number(value)

	if (
		!Number.isSafeInteger(sortOrder) ||
		sortOrder < 0
	) {
		throw new Error('Некорректный порядок условия')
	}

	return sortOrder
}

function getOperatingConditionData(formData: FormData) {
	const name = getRequiredString(
		formData,
		'name',
		'Не указано название условия',
	)

	const symbol = getOptionalString(formData, 'symbol')
	const valueMin = getOptionalNumber(formData, 'valueMin')
	const valueTyp = getOptionalNumber(formData, 'valueTyp')
	const valueMax = getOptionalNumber(formData, 'valueMax')
	const unit = getOptionalString(formData, 'unit')
	const conditionText = getOptionalString(formData, 'conditionText')
	const sortOrder = getSortOrder(formData)

	return {
		name,
		symbol,
		valueMin,
		valueTyp,
		valueMax,
		unit,
		conditionText,
		sortOrder,
	}
}

function getReturnUrl(componentId: bigint): string {
	return `/admin/components/${componentId.toString()}?tab=operating-conditions`
}

export async function createComponentOperatingCondition(
	formData: FormData,
) {
	await requireAdmin()

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Не указан компонент',
	)

	const data = getOperatingConditionData(formData)

	await db
		.insert(componentOperatingConditions)
		.values({
			componentId,
			...data,
		})

	redirect(getReturnUrl(componentId))
}

export async function updateComponentOperatingCondition(
	formData: FormData,
) {
	await requireAdmin()

	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID условия',
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента',
	)

	const data = getOperatingConditionData(formData)

	await db
		.update(componentOperatingConditions)
		.set(data)
		.where(eq(componentOperatingConditions.id, id))

	redirect(getReturnUrl(componentId))
}

export async function deleteComponentOperatingCondition(
	formData: FormData,
) {
	await requireAdmin()

	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID условия',
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента',
	)

	await db
		.delete(componentOperatingConditions)
		.where(eq(componentOperatingConditions.id, id))

	redirect(getReturnUrl(componentId))
}
