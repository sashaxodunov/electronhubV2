'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { componentVariants } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createComponentVariant(formData: FormData) {
	const componentId = Number(formData.get('componentId'))

	const packageVariantValue = formData.get('packageVariantId')

	const packageVariantId =
		packageVariantValue && String(packageVariantValue).trim() !== ''
			? Number(packageVariantValue)
			: null

	const designation = String(formData.get('designation') ?? '').trim()

	const slug = String(formData.get('slug') ?? '').trim()

	const marking = String(formData.get('marking') ?? '').trim()

	const description = String(formData.get('description') ?? '').trim()

	const process = String(formData.get('process') ?? '').trim()

	const packing = String(formData.get('packing') ?? '').trim()

	const operatingTempMin = String(formData.get('operatingTempMin') ?? '').trim()

	const operatingTempMax = String(formData.get('operatingTempMax') ?? '').trim()

	const isPrimary = formData.get('isPrimary') === 'true'

	const isActive = formData.get('isActive') === 'true'

	if (!componentId) {
		throw new Error('Не указан компонент')
	}

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

	redirect(`/admin/components/${componentId}?tab=variants`)
}

export async function deleteComponentVariant(formData: FormData) {
	const id = Number(formData.get('id'))
	const componentId = Number(formData.get('componentId'))

	if (!id || !componentId) {
		throw new Error('Некорректные параметры')
	}

	await db.delete(componentVariants).where(eq(componentVariants.id, BigInt(id)))

	redirect(`/admin/components/${componentId}?tab=variants`)
}
