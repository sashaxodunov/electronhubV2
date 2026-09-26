'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentVariants } from '@/db/schema'

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

function getOptionalBigInt(
	formData: FormData,
	name: string
): bigint | null {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	if (!/^\d+$/.test(value)) {
		throw new Error(`Некорректный ID: ${name}`)
	}

	const id = BigInt(value)

	if (id <= BigInt(0)) {
		throw new Error(`Некорректный ID: ${name}`)
	}

	return id
}

export async function createComponentVariant(formData: FormData) {
	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Не указан компонент'
	)

	const packageVariantId = getOptionalBigInt(
		formData,
		'packageVariantId'
	)

	const designation = String(
		formData.get('designation') ?? ''
	).trim()

	const slug = String(
		formData.get('slug') ?? ''
	).trim()

	const marking = String(
		formData.get('marking') ?? ''
	).trim()

	const description = String(
		formData.get('description') ?? ''
	).trim()

	const process = String(
		formData.get('process') ?? ''
	).trim()

	const packing = String(
		formData.get('packing') ?? ''
	).trim()

	const operatingTempMin = String(
		formData.get('operatingTempMin') ?? ''
	).trim()

	const operatingTempMax = String(
		formData.get('operatingTempMax') ?? ''
	).trim()

	const isPrimary = formData.get('isPrimary') === 'true'
	const isActive = formData.get('isActive') === 'true'

	if (!designation) {
		throw new Error('Не указано обозначение варианта')
	}

	if (!slug) {
		throw new Error('Не указан slug варианта')
	}

	await db.insert(componentVariants).values({
		componentId,
		packageVariantId,
		designation,
		slug,
		marking: marking || null,
		description: description || null,
		process: process || null,
		packing: packing || null,
		operatingTempMin: operatingTempMin || null,
		operatingTempMax: operatingTempMax || null,
		isPrimary,
		isActive
	})

	redirect(
		`/admin/components/${componentId}?tab=variants`
	)
}

export async function deleteComponentVariant(
	formData: FormData
) {
	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID варианта'
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента'
	)

	await db
		.delete(componentVariants)
		.where(eq(componentVariants.id, id))

	redirect(
		`/admin/components/${componentId}?tab=variants`
	)
}