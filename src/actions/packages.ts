
'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { packages } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/require-admin'

function getPackageId(formData: FormData): bigint {
  const value = String(formData.get('id') ?? '').trim()

  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error('Некорректный ID корпуса')
  }

  return BigInt(value)
}

function getPackageData(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const slug = String(formData.get('slug') ?? '')
    .trim()
    .toLowerCase()
  const standard = String(formData.get('standard') ?? '').trim()
  const bodyType = String(formData.get('bodyType') ?? '').trim()
  const mountingType = String(formData.get('mountingType') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const isActive = formData.get('isActive') === 'on'

  if (!name) {
    throw new Error('Название корпуса обязательно')
  }

  if (name.length > 255) {
    throw new Error('Название корпуса не должно превышать 255 символов')
  }

  if (!slug) {
    throw new Error('Slug корпуса обязателен')
  }

  if (slug.length > 255) {
    throw new Error('Slug не должен превышать 255 символов')
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      'Slug может содержать только латинские буквы, цифры и дефисы',
    )
  }

  return {
    name,
    slug,
    standard: standard || null,
    bodyType: bodyType || null,
    mountingType: mountingType || null,
    description: description || null,
    isActive,
  }
}

export async function createPackage(formData: FormData) {
  await requireAdmin()

  const values = getPackageData(formData)

  const [createdPackage] = await db
    .insert(packages)
    .values(values)
    .returning({
      id: packages.id,
    })

  if (!createdPackage) {
    throw new Error('Не удалось создать корпус')
  }

  redirect(`/admin/packages/${createdPackage.id.toString()}`)
}

export async function updatePackage(formData: FormData) {
  await requireAdmin()

  const id = getPackageId(formData)
  const values = getPackageData(formData)

  await db
    .update(packages)
    .set({
      ...values,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(packages.id, id))

  redirect(`/admin/packages/${id.toString()}`)
}

export async function deletePackage(formData: FormData) {
  await requireAdmin()

  const id = getPackageId(formData)

  await db
    .delete(packages)
    .where(eq(packages.id, id))

  redirect('/admin/packages')
}
