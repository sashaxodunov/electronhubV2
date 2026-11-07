import { z } from 'zod'

export const createComponentSchema = z.object({
	name: z.string().trim().min(1).max(255),

	designation: z.string().trim().min(1).max(150),

	slug: z
		.string()
		.trim()
		.toLowerCase()
		.min(1)
		.max(255)
		.regex(
			/^[a-zа-яё0-9]+(?:-[a-zа-яё0-9]+)*$/i,
		),

	manufacturerId: z
		.string()
		.regex(/^\d+$/)
		.transform(BigInt)
		.refine(id => id > BigInt(0)),

	categoryId: z
		.string()
		.regex(/^\d+$/)
		.transform(BigInt)
		.refine(id => id > BigInt(0)),

	seriesId: z
		.union([
			z.literal(''),
			z.string().regex(/^\d+$/),
		])
		.transform(value => value === '' ? null : BigInt(value))
		.refine(id => id === null || id > BigInt(0)),

	function: z.string().trim().max(255).optional(),
	shortDescription: z.string().trim().optional(),
	description: z.string().trim().optional(),
})