'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { componentThermal } from '@/db/schema'

type ThermalInput = {
	componentId: string
	name: string
	symbol?: string
	value?: string
	unit?: string
	description?: string
}

function parseId(value: string): bigint {
	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

function parseNumber(value?: string): string | null {
	const normalized = value?.trim().replace(',', '.')

	if (!normalized) {
		return null
	}

	if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
		throw new Error('Укажи корректное числовое значение')
	}

	return normalized
}

function parseText(value?: string): string | null {
	const normalized = value?.trim()
	return normalized || null
}

function validateInput(input: ThermalInput) {
	const name = input.name.trim()

	if (!name) {
		throw new Error('Укажи название теплового параметра')
	}

	if (name.length > 255) {
		throw new Error('Название не должно превышать 255 символов')
	}

	if (input.symbol && input.symbol.length > 100) {
		throw new Error('Символ не должен превышать 100 символов')
	}

	if (input.unit && input.unit.length > 50) {
		throw new Error('Единица измерения не должна превышать 50 символов')
	}

	return {
		name,
		symbol: parseText(input.symbol),
		value: parseNumber(input.value),
		unit: parseText(input.unit),
		description: parseText(input.description),
	}
}

export async function createComponentThermal(input: ThermalInput) {
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db.insert(componentThermal).values({
		componentId,
		...values,
	})

	redirect(
		`/admin/components/${componentId.toString()}?tab=thermal`,
	)
}

export async function updateComponentThermal(
	id: string,
	input: ThermalInput,
) {
	const thermalId = parseId(id)
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db
		.update(componentThermal)
		.set(values)
		.where(eq(componentThermal.id, thermalId))

	redirect(
		`/admin/components/${componentId.toString()}?tab=thermal`,
	)
}

export async function deleteComponentThermal(
	id: string,
	componentIdValue: string,
) {
	const thermalId = parseId(id)
	const componentId = parseId(componentIdValue)

	await db
		.delete(componentThermal)
		.where(eq(componentThermal.id, thermalId))

	redirect(
		`/admin/components/${componentId.toString()}?tab=thermal`,
	)
}