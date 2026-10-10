
'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentThermal } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

type ThermalInput = {
	componentId: string
	name: string
	symbol?: string
	value?: string
	unit?: string
	description?: string
}

function parseId(value: string): bigint {
	const normalized = value.trim()

	if (!/^[1-9]\d*$/.test(normalized)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(normalized)
}

function parseNumber(value?: string): string | null {
	const normalized = value?.trim().replace(',', '.')

	if (!normalized) {
		return null
	}

	if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
		throw new Error('Укажи корректное числовое значение')
	}

	if (!Number.isFinite(Number(normalized))) {
		throw new Error('Числовое значение вне допустимого диапазона')
	}

	return normalized
}

function parseText(value?: string): string | null {
	const normalized = value?.trim()

	return normalized || null
}

function validateInput(input: ThermalInput) {
	const name = input.name.trim()
	const symbol = parseText(input.symbol)
	const unit = parseText(input.unit)
	const description = parseText(input.description)

	if (!name) {
		throw new Error('Укажи название теплового параметра')
	}

	if (name.length > 255) {
		throw new Error('Название не должно превышать 255 символов')
	}

	if (symbol && symbol.length > 100) {
		throw new Error('Символ не должен превышать 100 символов')
	}

	if (unit && unit.length > 50) {
		throw new Error(
			'Единица измерения не должна превышать 50 символов',
		)
	}

	return {
		name,
		symbol,
		value: parseNumber(input.value),
		unit,
		description,
	}
}

function getReturnUrl(componentId: bigint): string {
	return `/admin/components/${componentId.toString()}?tab=thermal`
}

export async function createComponentThermal(
	input: ThermalInput,
) {
	await requireAdmin()

	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db.insert(componentThermal).values({
		componentId,
		...values,
	})

	redirect(getReturnUrl(componentId))
}

export async function updateComponentThermal(
	id: string,
	input: ThermalInput,
) {
	await requireAdmin()

	const thermalId = parseId(id)
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db
		.update(componentThermal)
		.set(values)
		.where(
			and(
				eq(componentThermal.id, thermalId),
				eq(componentThermal.componentId, componentId),
			),
		)

	redirect(getReturnUrl(componentId))
}

export async function deleteComponentThermal(
	id: string,
	componentIdValue: string,
) {
	await requireAdmin()

	const thermalId = parseId(id)
	const componentId = parseId(componentIdValue)

	await db
		.delete(componentThermal)
		.where(
			and(
				eq(componentThermal.id, thermalId),
				eq(componentThermal.componentId, componentId),
			),
		)

	redirect(getReturnUrl(componentId))
}
