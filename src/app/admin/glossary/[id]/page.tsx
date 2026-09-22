import { asc, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { glossaryCategories, glossaryTerms } from '@/db/schema'
import GlossaryEditor from '@/components/admin/GlossaryEditor'

type Props = {
	params: Promise<{
		id: string
	}>
}

export default async function GlossaryTermPage({ params }: Props) {
	const { id } = await params

	let termId: bigint

	try {
		termId = BigInt(id)
	} catch {
		notFound()
	}

	const [term] = await db
		.select({
			id: glossaryTerms.id,
			term: glossaryTerms.term,
			slug: glossaryTerms.slug,
			englishTerm: glossaryTerms.englishTerm,
			abbreviation: glossaryTerms.abbreviation,
			shortDefinition: glossaryTerms.shortDefinition,
			definition: glossaryTerms.definition,
			categoryId: glossaryTerms.categoryId,
			language: glossaryTerms.language,
			metaTitle: glossaryTerms.metaTitle,
			metaDescription: glossaryTerms.metaDescription,
			isActive: glossaryTerms.isActive
		})
		.from(glossaryTerms)
		.where(eq(glossaryTerms.id, termId))
		.limit(1)

	if (!term) {
		notFound()
	}

	const categories = await db
		.select({
			id: glossaryCategories.id,
			name: glossaryCategories.name
		})
		.from(glossaryCategories)
		.where(eq(glossaryCategories.isActive, true))
		.orderBy(asc(glossaryCategories.sortOrder), asc(glossaryCategories.name))

	const editorCategories = categories.map(category => ({
		id: category.id.toString(),
		name: category.name
	}))

	const editorTerm = {
		id: term.id.toString(),
		term: term.term,
		slug: term.slug,
		englishTerm: term.englishTerm ?? '',
		abbreviation: term.abbreviation ?? '',
		shortDefinition: term.shortDefinition,
		definition: term.definition ?? '',
		categoryId: term.categoryId?.toString() ?? '',
		language: term.language,
		metaTitle: term.metaTitle ?? '',
		metaDescription: term.metaDescription ?? '',
		isActive: term.isActive
	}

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div>
				<Link
					href='/admin/glossary'
					className='mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900'
				>
					<ArrowLeft className='h-4 w-4' />
					Назад к глоссарию
				</Link>

				<h1 className='text-3xl font-bold text-gray-900'>
					Редактирование термина
				</h1>

				<p className='mt-1 text-sm text-gray-500'>{term.term}</p>
			</div>

			<GlossaryEditor
				categories={editorCategories}
				initialData={editorTerm}
			/>
		</main>
	)
}
