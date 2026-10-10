'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentSpecifications } from '@/db/schema'

function getRequiredBigInt(
	formData: FormData,
	name: string,
	message: string
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
	message: string
): string {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		throw new Error(message)
	}

	return value
}

function getOptionalString(
	formData: FormData,
	name: string
): string | null {
	const value = String(formData.get(name) ?? '').trim()

	return value || null
}

function getOptionalNumber(
	formData: FormData,
	name: string
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
	const value = String(
		formData.get('sortOrder') ?? ''
	).trim()

	if (!value) {
		return 0
	}

	if (!/^\d+$/.test(value)) {
		throw new Error('Некорректный порядок характеристики')
	}

	const sortOrder = Number(value)

	if (
		!Number.isSafeInteger(sortOrder) ||
		sortOrder < 0
	) {
		throw new Error('Некорректный порядок характеристики')
	}

	return sortOrder
}

function getSpecificationData(formData: FormData) {
	const name = getRequiredString(
		formData,
		'name',
		'Не указано название характеристики'
	)

	const symbol = getOptionalString(
		formData,
		'symbol'
	)

	const valueMin = getOptionalNumber(
		formData,
		'valueMin'
	)

	const valueTyp = getOptionalNumber(
		formData,
		'valueTyp'
	)

	const valueMax = getOptionalNumber(
		formData,
		'valueMax'
	)

	const unit = getOptionalString(
		formData,
		'unit'
	)

	const conditionText = getOptionalString(
		formData,
		'conditionText'
	)

	const description = getOptionalString(
		formData,
		'description'
	)

	const sortOrder = getSortOrder(formData)

	return {
		name,
		symbol,
		valueMin,
		valueTyp,
		valueMax,
		unit,
		conditionText,
		description,
		sortOrder
	}
}

export async function createComponentSpecification(
	formData: FormData
) {
	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Не указан компонент'
	)

	const data = getSpecificationData(formData)

	await db
		.insert(componentSpecifications)
		.values({
			componentId,
			...data
		})

	redirect(
		`/admin/components/${componentId.toString()}?tab=characteristics`
	)
}

export async function updateComponentSpecification(
	formData: FormData
) {
	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID характеристики'
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента'
	)

	const data = getSpecificationData(formData)

	await db
		.update(componentSpecifications)
		.set(data)
		.where(eq(componentSpecifications.id, id))

	redirect(
		`/admin/components/${componentId.toString()}?tab=characteristics`
	)
}

export async function deleteComponentSpecification(
	formData: FormData
) {
	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID характеристики'
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента'
	)

	await db
		.delete(componentSpecifications)
		.where(eq(componentSpecifications.id, id))

	redirect(
		`/admin/components/${componentId.toString()}?tab=characteristics`
	)
}