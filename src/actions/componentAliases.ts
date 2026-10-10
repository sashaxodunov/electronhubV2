
'use server'

import { redirect } from 'next/navigation'
import { and, eq, ne } from 'drizzle-orm'
import { db } from '@/db'
import { componentAliases } from '@/db/schema'

type AliasInput = {
	componentId: string
	alias: string
	aliasType?: string
	isPrimary?: boolean
}

function parseId(value: string): bigint {
	if (!/^[1-9]\d*$/.test(value)) {
		throw new Error('Некорректный идентификатор')
	}

	return BigInt(value)
}

function readFormData(formData: FormData): AliasInput {
	return {
		componentId: String(formData.get('componentId') ?? ''),
		alias: String(formData.get('alias') ?? ''),
		aliasType: String(formData.get('aliasType') ?? ''),
		isPrimary: formData.get('isPrimary') === 'true',
	}
}

function validateInput(input: AliasInput) {
	const alias = input.alias.trim()
	const aliasType = input.aliasType?.trim() || null

	if (!alias) {
		throw new Error('Укажи альтернативное обозначение')
	}

	if (alias.length > 255) {
		throw new Error('Обозначение не должно превышать 255 символов')
	}

	if (aliasType && aliasType.length > 100) {
		throw new Error('Тип обозначения не должен превышать 100 символов')
	}

	return {
		alias,
		aliasType,
		isPrimary: input.isPrimary === true,
	}
}

function aliasesUrl(componentId: bigint): string {
	return `/ admin / components / ${componentId.toString()}?tab = aliases`
}

export async function createComponentAlias(formData: FormData) {
	const input = readFormData(formData)
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db.transaction(async (tx) => {
		if (values.isPrimary) {
			await tx
				.update(componentAliases)
				.set({ isPrimary: false })
				.where(eq(componentAliases.componentId, componentId))
		}

		await tx.insert(componentAliases).values({
			componentId,
			...values,
		})
	})

	redirect(aliasesUrl(componentId))
}

export async function updateComponentAlias(formData: FormData) {
	const input = readFormData(formData)
	const aliasId = parseId(String(formData.get('id') ?? ''))
	const componentId = parseId(input.componentId)
	const values = validateInput(input)

	await db.transaction(async (tx) => {
		if (values.isPrimary) {
			await tx
				.update(componentAliases)
				.set({ isPrimary: false })
				.where(
					and(
						eq(componentAliases.componentId, componentId),
						ne(componentAliases.id, aliasId),
					),
				)
		}

		await tx
			.update(componentAliases)
			.set(values)
			.where(
				and(
					eq(componentAliases.id, aliasId),
					eq(componentAliases.componentId, componentId),
				),
			)
	})

	redirect(aliasesUrl(componentId))
}

export async function deleteComponentAlias(formData: FormData) {
	const aliasId = parseId(String(formData.get('id') ?? ''))
	const componentId = parseId(
		String(formData.get('componentId') ?? ''),
	)

	await db
		.delete(componentAliases)
		.where(
			and(
				eq(componentAliases.id, aliasId),
				eq(componentAliases.componentId, componentId),
			),
		)

	redirect(aliasesUrl(componentId))
}
