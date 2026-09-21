'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { packageVariants } from '@/db/schema'

function getString(formData: FormData, name: string) {
	const value = String(formData.get(name) ?? '').trim()
	return value || null
}

function getNumber(formData: FormData, name: string) {
	const value = String(formData.get(name) ?? '').trim()

	if (!value) {
		return null
	}

	const number = Number(value)

	if (!Number.isFinite(number)) {
		throw new Error(`Некорректное значение поля ${name}`)
	}

	return number
}

function getId(formData: FormData, name: string) {
	const value = String(formData.get(name) ?? '')
	const id = Number(value)

	if (!Number.isSafeInteger(id) || id <= 0) {
		throw new Error(`Некорректный ID: ${name}`)
	}

	return id
}

function getVariantValues(formData: FormData) {
	const name = String(formData.get('name') ?? '').trim()
	const slug = String(formData.get('slug') ?? '').trim()

	if (!name) {
		throw new Error('Название варианта обязательно')
	}

	if (!slug) {
		throw new Error('Slug варианта обязателен')
	}

	return {
		name,
		slug,
		manufacturer: getString(formData, 'manufacturer'),
		pinCount: getNumber(formData, 'pinCount'),

		pitchMm: getNumber(formData, 'pitchMm')?.toString() ?? null,

		lengthMm: getNumber(formData, 'lengthMm')?.toString() ?? null,
		widthMm: getNumber(formData, 'widthMm')?.toString() ?? null,
		heightMm: getNumber(formData, 'heightMm')?.toString() ?? null,

		bodyLengthMm: getNumber(formData, 'bodyLengthMm')?.toString() ?? null,

		bodyWidthMm: getNumber(formData, 'bodyWidthMm')?.toString() ?? null,

		leadLengthMm: getNumber(formData, 'leadLengthMm')?.toString() ?? null,

		leadWidthMm: getNumber(formData, 'leadWidthMm')?.toString() ?? null,

		thermalPad: formData.get('thermalPad') === 'on',

		description: getString(formData, 'description'),

		isActive: formData.get('isActive') === 'on',

		variantCode: getString(formData, 'variantCode'),
		standardCode: getString(formData, 'standardCode'),
		bodyShape: getString(formData, 'bodyShape'),

		pitchXMm: getNumber(formData, 'pitchXMm')?.toString() ?? null,

		pitchYMm: getNumber(formData, 'pitchYMm')?.toString() ?? null,

		terminalWidthMm: getNumber(formData, 'terminalWidthMm')?.toString() ?? null,

		terminalLengthMm:
			getNumber(formData, 'terminalLengthMm')?.toString() ?? null,

		exposedPadLengthMm:
			getNumber(formData, 'exposedPadLengthMm')?.toString() ?? null,

		exposedPadWidthMm:
			getNumber(formData, 'exposedPadWidthMm')?.toString() ?? null
	}
}

export async function createPackageVariant(formData: FormData) {
	const packageIdValue = String(formData.get('packageId') ?? '')
	const packageId = Number(packageIdValue)

	if (!Number.isSafeInteger(packageId) || packageId <= 0) {
		throw new Error('Некорректный ID корпуса')
	}

	const values = getVariantValues(formData)

	await db.insert(packageVariants).values({
		packageId,
		...values
	})

	redirect(`/admin/packages/${packageId}`)
}

export async function updatePackageVariant(formData: FormData) {
	const id = getId(formData, 'id')
	const packageId = getId(formData, 'packageId')

	const values = getVariantValues(formData)

	await db
		.update(packageVariants)
		.set({
			...values,
			updatedAt: new Date().toISOString()
		})
		.where(eq(packageVariants.id, BigInt(id)))

	redirect(`/admin/packages/${packageId}`)
}

export async function deletePackageVariant(formData: FormData) {
	const id = getId(formData, 'id')
	const packageId = getId(formData, 'packageId')

	await db.delete(packageVariants).where(eq(packageVariants.id, BigInt(id)))

	redirect(`/admin/packages/${packageId}`)
}
