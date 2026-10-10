import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { documentation } from '@/db/schema'
import DocumentationForm from '@/components/documentation/DocumentationForm'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function EditDocumentationPage({ params }: PageProps) {
	const { id } = await params

	if (!/^[1-9]\d*$/.test(id)) {
		notFound()
	}

	const [item] = await db
		.select({
			id: documentation.id,
			title: documentation.title,
			slug: documentation.slug,
			categorySlug: documentation.categorySlug,
			description: documentation.description,
			status: documentation.status
		})
		.from(documentation)
		.where(eq(documentation.id, BigInt(id)))
		.limit(1)

	if (!item) {
		notFound()
	}

	return (
		<main className='mx-auto max-w-5xl space-y-6 p-6'>
			<div className='space-y-2'>
				<Link
					href='/admin/documentation'
					className='text-sm text-zinc-500 hover:text-zinc-900'
				>
					← К списку документации
				</Link>

				<h1 className='text-2xl font-semibold text-zinc-900'>
					Редактирование документа
				</h1>

				<p className='text-sm text-zinc-500'>ID: {item.id.toString()}</p>
			</div>

			<section className='rounded-xl border border-zinc-200 bg-white p-6'>
				<DocumentationForm
					initialData={{
						...item,
						id: item.id.toString()
					}}
				/>
			</section>
		</main>
	)
}
