
'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { packageVariants } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

function getString(
  formData: FormData,
  name: string,
): string | null {
  const value = String(formData.get(name) ?? '').trim()

  return value || null
}

function getNumber(
  formData: FormData,
  name: string,
): number | null {
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

function getId(
  formData: FormData,
  name: string,
): bigint {
  const value = String(formData.get(name) ?? '').trim()

  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error(`Некорректный ID: ${name}`)
  }

  return BigInt(value)
}

function getVariantValues(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '')
    .trim()
    .toLowerCase()

  if (!name) {
    throw new Error('Название варианта обязательно')
  }

  if (name.length > 255) {
    throw new Error(
      'Название варианта не должно превышать 255 символов',
    )
  }

  if (!slug) {
    throw new Error('Slug варианта обязателен')
  }

  if (slug.length > 255) {
    throw new Error('Slug не должен превышать 255 символов')
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      'Slug может содержать только латинские буквы, цифры и дефисы',
    )
  }

  const pinCount = getNumber(formData, 'pinCount')

  if (
    pinCount !== null &&
    (!Number.isSafeInteger(pinCount) || pinCount < 0)
  ) {
    throw new Error(
      'Количество выводов должно быть целым неотрицательным числом',
    )
  }

  const pitchMm = getNumber(formData, 'pitchMm')
  const lengthMm = getNumber(formData, 'lengthMm')
  const widthMm = getNumber(formData, 'widthMm')
  const heightMm = getNumber(formData, 'heightMm')
  const bodyLengthMm = getNumber(formData, 'bodyLengthMm')
  const bodyWidthMm = getNumber(formData, 'bodyWidthMm')
  const leadLengthMm = getNumber(formData, 'leadLengthMm')
  const leadWidthMm = getNumber(formData, 'leadWidthMm')
  const pitchXMm = getNumber(formData, 'pitchXMm')
  const pitchYMm = getNumber(formData, 'pitchYMm')
  const terminalWidthMm = getNumber(formData, 'terminalWidthMm')
  const terminalLengthMm = getNumber(formData, 'terminalLengthMm')
  const exposedPadLengthMm = getNumber(formData, 'exposedPadLengthMm')
  const exposedPadWidthMm = getNumber(formData, 'exposedPadWidthMm')

  const dimensions = {
    pitchMm,
    lengthMm,
    widthMm,
    heightMm,
    bodyLengthMm,
    bodyWidthMm,
    leadLengthMm,
    leadWidthMm,
    pitchXMm,
    pitchYMm,
    terminalWidthMm,
    terminalLengthMm,
    exposedPadLengthMm,
    exposedPadWidthMm,
  }

  for (const [field, value] of Object.entries(dimensions)) {
    if (value !== null && value < 0) {
      throw new Error(
        `Значение поля ${field} не может быть отрицательным`,
      )
    }
  }

  return {
    name,
    slug,
    manufacturer: getString(formData, 'manufacturer'),
    pinCount,
    pitchMm: pitchMm?.toString() ?? null,
    lengthMm: lengthMm?.toString() ?? null,
    widthMm: widthMm?.toString() ?? null,
    heightMm: heightMm?.toString() ?? null,
    bodyLengthMm: bodyLengthMm?.toString() ?? null,
    bodyWidthMm: bodyWidthMm?.toString() ?? null,
    leadLengthMm: leadLengthMm?.toString() ?? null,
    leadWidthMm: leadWidthMm?.toString() ?? null,
    thermalPad: formData.get('thermalPad') === 'on',
    description: getString(formData, 'description'),
    isActive: formData.get('isActive') === 'on',
    variantCode: getString(formData, 'variantCode'),
    standardCode: getString(formData, 'standardCode'),
    bodyShape: getString(formData, 'bodyShape'),
    pitchXMm: pitchXMm?.toString() ?? null,
    pitchYMm: pitchYMm?.toString() ?? null,
    terminalWidthMm: terminalWidthMm?.toString() ?? null,
    terminalLengthMm: terminalLengthMm?.toString() ?? null,
    exposedPadLengthMm: exposedPadLengthMm?.toString() ?? null,
    exposedPadWidthMm: exposedPadWidthMm?.toString() ?? null,
  }
}

export async function createPackageVariant(formData: FormData) {
  await requireAdmin()

  const packageId = getId(formData, 'packageId')
  const values = getVariantValues(formData)

  await db.insert(packageVariants).values({
    packageId,
    ...values,
  })

  redirect(`/admin/packages/${packageId.toString()}`)
}

export async function updatePackageVariant(formData: FormData) {
  await requireAdmin()

  const id = getId(formData, 'id')
  const packageId = getId(formData, 'packageId')
  const values = getVariantValues(formData)

  await db
    .update(packageVariants)
    .set({
      ...values,
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(packageVariants.id, id),
        eq(packageVariants.packageId, packageId),
      ),
    )

  redirect(`/admin/packages/${packageId.toString()}`)
}

export async function deletePackageVariant(formData: FormData) {
  await requireAdmin()

  const id = getId(formData, 'id')
  const packageId = getId(formData, 'packageId')

  await db
    .delete(packageVariants)
    .where(
      and(
        eq(packageVariants.id, id),
        eq(packageVariants.packageId, packageId),
      ),
    )

  redirect(`/admin/packages/${packageId.toString()}`)
}
