import Link from 'next/link'
import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { documentation } from '@/db/schema'
import { electronicsBrands } from '@/db/schema/electronics-brands'
import DocumentationForm from '@/components/documentation/DocumentationForm'
import { getDocumentationSubcategories } from '@/server/documentation/subcategories'

type PageProps = {
	params: Promise<{ id: string }>
}

export const metadata = {
	title: 'Редактирование документа — Документация'
}

export default async function EditDocumentationPage({ params }: PageProps) {
	const { id } = await params

	if (!/^[1-9]\d*$/.test(id)) {
		notFound()
	}

	const parsedId = BigInt(id)

	if (parsedId > BigInt('9223372036854775807')) {
		notFound()
	}

	const [item] = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			subcategoryId: documentation.subcategoryId,
			brandId: documentation.brandId,
			description: documentation.description,
			status: documentation.status,
			documentType: documentation.documentType
		})
		.from(documentation)
		.where(eq(documentation.id, parsedId))
		.limit(1)

	if (!item) {
		notFound()
	}

	const [subcategories, brands] = await Promise.all([
		getDocumentationSubcategories(),
		db
			.select({
				id: electronicsBrands.id,
				name: electronicsBrands.name,
				slug: electronicsBrands.slug
			})
			.from(electronicsBrands)
			.orderBy(asc(electronicsBrands.name))
	])

	const subcategoryOptions = subcategories.map(subcategory => ({
		id: String(subcategory.id),
		categorySlug: subcategory.categorySlug,
		title: subcategory.title,
		slug: subcategory.slug,
		sortOrder: subcategory.sortOrder
	}))

	const brandOptions = brands.map(brand => ({
		id: String(brand.id),
		name: brand.name,
		slug: brand.slug
	}))

	return (
		<main className='mx-auto w-full max-w-5xl space-y-6 p-6 lg:p-8'>
			<div className='space-y-3'>
				<Link
					href='/admin/documentation'
					className='inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white'
				>
					<span aria-hidden='true'>←</span>К списку документации
				</Link>

				<div>
					<h1 className='text-2xl font-semibold text-zinc-900 dark:text-white'>
						Редактирование документа
					</h1>

					<p className='mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400'>
						Измени сведения о документе и сохрани обновления. После сохранения
						можно управлять прикреплёнными файлами.
					</p>

					<p className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
						ID: {item.id.toString()}
					</p>
				</div>
			</div>

			<section className='rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6'>
				<DocumentationForm
					initialData={{
						...item,
						id: item.id.toString(),
						subcategoryId:
							item.subcategoryId === null ? '' : String(item.subcategoryId),
						brandId: item.brandId === null ? '' : String(item.brandId)
					}}
					subcategories={subcategoryOptions}
					brands={brandOptions}
				/>
			</section>
		</main>
	)
}
