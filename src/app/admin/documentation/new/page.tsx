import Link from 'next/link'
import { asc } from 'drizzle-orm'

import { db } from '@/db'
import { electronicsBrands } from '@/db/schema/electronics-brands'
import DocumentationForm from '@/components/documentation/DocumentationForm'
import { getDocumentationSubcategories } from '@/server/documentation/subcategories'

export const metadata = {
	title: 'Новый документ — Документация'
}

export default async function NewDocumentationPage() {
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

	const subcategoryOptions = subcategories.map(item => ({
		id: String(item.id),
		categorySlug: item.categorySlug,
		title: item.title,
		slug: item.slug,
		sortOrder: item.sortOrder
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
						Новый документ
					</h1>

					<p className='mt-2 text-sm leading-6 text-zinc-500'>
						Заполни сведения о документе и сохрани его как черновик или
						опубликуй. После создания можно прикрепить файлы.
					</p>
				</div>
			</div>

			<section className='rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6'>
				<DocumentationForm
					subcategories={subcategoryOptions}
					brands={brandOptions}
				/>
			</section>
		</main>
	)
}
