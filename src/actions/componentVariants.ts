
'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { componentVariants } from '@/db/schema'
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

function getOptionalBigInt(
	formData: FormData,
	name: string,
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

function getVariantData(formData: FormData) {
	const packageVariantId = getOptionalBigInt(
		formData,
		'packageVariantId',
	)

	const designation = String(
		formData.get('designation') ?? '',
	).trim()

	const slug = String(
		formData.get('slug') ?? '',
	).trim().toLowerCase()

	const marking = String(
		formData.get('marking') ?? '',
	).trim()

	const description = String(
		formData.get('description') ?? '',
	).trim()

	const process = String(
		formData.get('process') ?? '',
	).trim()

	const packing = String(
		formData.get('packing') ?? '',
	).trim()

	const operatingTempMin = String(
		formData.get('operatingTempMin') ?? '',
	).trim()

	const operatingTempMax = String(
		formData.get('operatingTempMax') ?? '',
	).trim()

	const isPrimary = formData.get('isPrimary') === 'true'
	const isActive = formData.get('isActive') === 'true'

	if (!designation) {
		throw new Error('Не указано обозначение варианта')
	}

	if (designation.length > 255) {
		throw new Error(
			'Обозначение варианта не должно превышать 255 символов',
		)
	}

	if (!slug) {
		throw new Error('Не указан slug варианта')
	}

	if (slug.length > 255) {
		throw new Error('Slug не должен превышать 255 символов')
	}

	if (!/^[a-zа-яё0-9]+(?:-[a-zа-яё0-9]+)*$/i.test(slug)) {
		throw new Error(
			'Slug может содержать буквы, цифры и дефисы без пробелов',
		)
	}

	if (
		operatingTempMin &&
		!/^-?\d+(?:[.,]\d+)?$/.test(operatingTempMin)
	) {
		throw new Error('Некорректная минимальная рабочая температура')
	}

	if (
		operatingTempMax &&
		!/^-?\d+(?:[.,]\d+)?$/.test(operatingTempMax)
	) {
		throw new Error('Некорректная максимальная рабочая температура')
	}

	const normalizedTempMin = operatingTempMin
		? operatingTempMin.replace(',', '.')
		: null

	const normalizedTempMax = operatingTempMax
		? operatingTempMax.replace(',', '.')
		: null

	if (
		normalizedTempMin !== null &&
		normalizedTempMax !== null &&
		Number(normalizedTempMin) > Number(normalizedTempMax)
	) {
		throw new Error(
			'Минимальная рабочая температура не может превышать максимальную',
		)
	}

	return {
		packageVariantId,
		designation,
		slug,
		marking: marking || null,
		description: description || null,
		process: process || null,
		packing: packing || null,
		operatingTempMin: normalizedTempMin,
		operatingTempMax: normalizedTempMax,
		isPrimary,
		isActive,
	}
}

function getReturnUrl(componentId: bigint): string {
	return `/admin/components/${componentId.toString()}?tab=variants`
}

export async function createComponentVariant(
	formData: FormData,
) {
	await requireAdmin()

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Не указан компонент',
	)

	const data = getVariantData(formData)

	await db.insert(componentVariants).values({
		componentId,
		...data,
	})

	redirect(getReturnUrl(componentId))
}

export async function updateComponentVariant(
	formData: FormData,
) {
	await requireAdmin()

	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID варианта',
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента',
	)

	const data = getVariantData(formData)

	await db
		.update(componentVariants)
		.set(data)
		.where(
			and(
				eq(componentVariants.id, id),
				eq(componentVariants.componentId, componentId),
			),
		)

	redirect(getReturnUrl(componentId))
}

export async function deleteComponentVariant(
	formData: FormData,
) {
	await requireAdmin()

	const id = getRequiredBigInt(
		formData,
		'id',
		'Некорректный ID варианта',
	)

	const componentId = getRequiredBigInt(
		formData,
		'componentId',
		'Некорректный ID компонента',
	)

	await db
		.delete(componentVariants)
		.where(
			and(
				eq(componentVariants.id, id),
				eq(componentVariants.componentId, componentId),
			),
		)

	redirect(getReturnUrl(componentId))
}
