
'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { applications, componentApplications } from '@/db/schema'

function parseId(value: string): bigint {
	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

function readRequired(formData: FormData, name: string): string {
	const value = formData.get(name)

	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`Не заполнено поле: ${name}`)
	}

	return value.trim()
}

function getDescription(formData: FormData): string | null {
	const value = formData.get('description')

	if (typeof value !== 'string') {
		return null
	}

	const description = value.trim()

	if (description.length > 5000) {
		throw new Error('Описание не должно превышать 5000 символов')
	}

	return description || null
}

function getReturnUrl(componentId: bigint): string {
	return `/admin/components/${componentId.toString()}?tab=applications`
}

/** Добавить область применения к компоненту */
export async function createComponentApplication(formData: FormData) {
	const componentId = parseId(readRequired(formData, 'componentId'))
	const applicationId = parseId(readRequired(formData, 'applicationId'))
	const description = getDescription(formData)

	await db.transaction(async (tx) => {
		// Проверяем, что область применения существует.
		const [application] = await tx
			.select({ id: applications.id })
			.from(applications)
			.where(eq(applications.id, applicationId))
			.limit(1)

		if (!application) {
			throw new Error('Область применения не найдена')
		}

		// Составной первичный ключ не допускает дублирования связи.
		await tx
			.insert(componentApplications)
			.values({
				componentId,
				applicationId,
				description,
			})
			.onConflictDoNothing({
				target: [
					componentApplications.componentId,
					componentApplications.applicationId,
				],
			})
	})

	redirect(getReturnUrl(componentId))
}

/** Изменить описание связи */
export async function updateComponentApplication(formData: FormData) {
	const componentId = parseId(readRequired(formData, 'componentId'))
	const applicationId = parseId(readRequired(formData, 'applicationId'))
	const description = getDescription(formData)

	await db
		.update(componentApplications)
		.set({ description })
		.where(
			and(
				eq(componentApplications.componentId, componentId),
				eq(componentApplications.applicationId, applicationId),
			),
		)

	redirect(getReturnUrl(componentId))
}

/** Удалить связь, не удаляя саму область применения */
export async function deleteComponentApplication(formData: FormData) {
	const componentId = parseId(readRequired(formData, 'componentId'))
	const applicationId = parseId(readRequired(formData, 'applicationId'))

	await db
		.delete(componentApplications)
		.where(
			and(
				eq(componentApplications.componentId, componentId),
				eq(componentApplications.applicationId, applicationId),
			),
		)

	redirect(getReturnUrl(componentId))
}