'use server'

import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { equipment } from '@/db/schema'

function makeSlug(value: string): string {
	const transliteration: Record<string, string> = {
		а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
		е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
		й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
		о: 'o', п: 'p', р: 'r', с: 's', т: 't',
		у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
		ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '',
		э: 'e', ю: 'yu', я: 'ya',
	}

	return value
		.toLowerCase()
		.split('')
		.map(char => transliteration[char] ?? char)
		.join('')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

function readOptionalId(value: FormDataEntryValue | null) {
	const raw = String(value ?? '').trim()

	if (!raw) return null

	if (!/^\d+$/.test(raw) || BigInt(raw) <= BigInt(0)) {
		throw new Error('Некорректный идентификатор.')
	}

	return BigInt(raw)
}

export async function saveEquipment(formData: FormData) {
	// ВАЖНО: здесь необходимо проверить права администратора
	// через существующий механизм авторизации проекта.

	const rawId = String(formData.get('id') ?? '').trim()
	const title = String(formData.get('title') ?? '').trim()
	const model = String(formData.get('model') ?? '').trim()
	const description = String(formData.get('description') ?? '').trim()
	const requestedSlug = String(formData.get('slug') ?? '').trim()

	if (!title) {
		throw new Error('Укажи название оборудования.')
	}

	const id =
		rawId && /^\d+$/.test(rawId) && BigInt(rawId) > BigInt(0)
			? BigInt(rawId)
			: null

	if (rawId && !id) {
		throw new Error('Некорректный идентификатор оборудования.')
	}

	const brandId = readOptionalId(formData.get('brandId'))
	const subcategoryId = readOptionalId(formData.get('subcategoryId'))

	const baseSlug = makeSlug(requestedSlug || model || title)

	if (!baseSlug) {
		throw new Error('Не удалось сформировать slug.')
	}

	let slug = baseSlug
	let suffix = 2

	while (true) {
		const conditions = id
			? [eq(equipment.slug, slug), ne(equipment.id, id)]
			: [eq(equipment.slug, slug)]

		const [existing] = await db
			.select({ id: equipment.id })
			.from(equipment)
			.where(
				id
					? and(eq(equipment.slug, slug), ne(equipment.id, id))
					: eq(equipment.slug, slug),
			)
			.limit(1)

		if (!existing) break

		slug = `${baseSlug}-${suffix++}`
	}

	if (id) {
		await db
			.update(equipment)
			.set({
				title,
				slug,
				model: model || null,
				description: description || null,
				brandId,
				subcategoryId,
				updatedAt: new Date(),
			})
			.where(eq(equipment.id, id))
	} else {
		await db.insert(equipment).values({
			title,
			slug,
			model: model || null,
			description: description || null,
			brandId,
			subcategoryId,
		})
	}

	revalidatePath('/admin/equipment')
	redirect('/admin/equipment')
}