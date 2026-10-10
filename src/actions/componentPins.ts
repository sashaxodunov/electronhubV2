'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import {
	componentPins,
	pinType
} from '@/db/schema'

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

function getPinType(formData: FormData) {
	const value = getRequiredString(
		formData,
		'pinType',
		'Не указан тип вывода'
	)

	if (
		!pinType.enumValues.includes(
			value as (typeof pinType.enumValues)[number]
		)
	) {
		throw new Error(`Недопустимый тип вывода: ${value}`)
	}

	return value as (typeof pinType.enumValues)[number]
}

function getPinData(formData: FormData) {
	const pinNumber = getRequiredString(
		formData,
		'pinNumber',
		'Не указан номер вывода'
	)

	const pinName = getRequiredString(
		formData,
		'pinName',
		'Не указано название вывода'
	)

	const pinTypeValue = getPinType(formData)

	const functionValue = getOptionalString(
		formData,
		'function'
	)

	const description = getOptionalString(
		formData,
		'description'
	)

	const activeLevel = getOptionalString(
		formData,
		'activeLevel'
	)

	const element = getOptionalString(
		formData,
		'element'
	)

	const sortOrderValue = String(
		formData.get('sortOrder') ?? ''
	).trim()

	let sortOrder = 0

	if (sortOrderValue) {
		if (!/^\d+$/.test(sortOrderValue)) {
			throw new Error('Некорректный порядок вывода')
		}

		sortOrder = Number(sortOrderValue)

		if (!Number.isSafeInteger(sortOrder) || sortOrder < 0) {
			throw new Error('Некорректный порядок вывода')
		}
	}

	const isExposedPad =
		formData.get('isExposedPad') === 'true'

	return {
		pinNumber,
		pinName,
		pinType: pinTypeValue,
		function: functionValue,
		description,
		activeLevel,
		element,
		isExposedPad,
		sortOrder
	}
}

export async function createComponentPin(
	formData: FormData
) {
	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Не указан компонент'
	)

	const data = getPinData(formData)

	await db.insert(componentPins).values({
		componentId,
		...data
	})

	redirect(
		`/admin/components/${componentId.toString()}?tab=pins`
	)
}

export async function updateComponentPin(
	formData: FormData
) {
	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID вывода'
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента'
	)

	const data = getPinData(formData)

	await db
		.update(componentPins)
		.set(data)
		.where(eq(componentPins.id, id))

	redirect(
		`/admin/components/${componentId.toString()}?tab=pins`
	)
}

export async function deleteComponentPin(
	formData: FormData
) {
	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID вывода'
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента'
	)

	await db
		.delete(componentPins)
		.where(eq(componentPins.id, id))

	redirect(
		`/admin/components/${componentId.toString()}?tab=pins`
	)
}