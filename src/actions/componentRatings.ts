'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { componentRatings } from '@/db/schema'

type RatingInput = {
	componentId: string
	name: string
	symbol?: string
	valueMin?: string
	valueTyp?: string
	valueMax?: string
	unit?: string
	conditionText?: string
	note?: string
	sortOrder?: string
}

function parseId(value: string): bigint {
	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

function parseNumber(value?: string): string | null {
	const normalized = value?.trim().replace(',', '.')

	if (!normalized) return null

	if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
		throw new Error(`Некорректное числовое значение: ${value}`)
	}

	return normalized
}

function parseText(value?: string): string | null {
	const normalized = value?.trim()
	return normalized || null
}

function parseSortOrder(value?: string): number {
	const normalized = value?.trim() || '0'
	const result = Number(normalized)

	if (!Number.isSafeInteger(result) || result < 0) {
		throw new Error('Порядок сортировки должен быть целым неотрицательным числом')
	}

	return result
}

function validateInput(input: RatingInput) {
	const name = input.name.trim()

	if (!name) {
		throw new Error('Укажи название характеристики')
	}

	if (name.length > 255) {
		throw new Error('Название характеристики не должно превышать 255 символов')
	}

	if (input.symbol && input.symbol.length > 100) {
		throw new Error('Обозначение не должно превышать 100 символов')
	}

	if (input.unit && input.unit.length > 50) {
		throw new Error('Единица измерения не должна превышать 50 символов')
	}

	const valueMin = parseNumber(input.valueMin)
	const valueTyp = parseNumber(input.valueTyp)
	const valueMax = parseNumber(input.valueMax)

	if (
		valueMin !== null &&
		valueMax !== null &&
		Number(valueMin) > Number(valueMax)
	) {
		throw new Error('Минимальное значение не может превышать максимальное')
	}

	return {
		name,
		symbol: parseText(input.symbol),
		valueMin,
		valueTyp,
		valueMax,
		unit: parseText(input.unit),
		conditionText: parseText(input.conditionText),
		note: parseText(input.note),
		sortOrder: parseSortOrder(input.sortOrder),
	}
}

export async function createComponentRating(input: RatingInput) {
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db.insert(componentRatings).values({
		componentId,
		...values,
	})

	redirect(
		`/admin/components/${componentId.toString()}?tab=ratings`,
	)
}

export async function updateComponentRating(
	id: string,
	input: RatingInput,
) {
	const ratingId = parseId(id)
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db
		.update(componentRatings)
		.set(values)
		.where(eq(componentRatings.id, ratingId))

	redirect(
		`/admin/components/${componentId.toString()}?tab=ratings`,
	)
}

export async function deleteComponentRating(
	id: string,
	componentIdValue: string,
) {
	const ratingId = parseId(id)
	const componentId = parseId(componentIdValue)

	await db
		.delete(componentRatings)
		.where(eq(componentRatings.id, ratingId))

	redirect(
		`/admin/components/${componentId.toString()}?tab=ratings`,
	)
}