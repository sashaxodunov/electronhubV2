import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { documentationCategories } from '@/config/categories'
import { getPublishedDocumentationByCategory } from '@/server/documentation/queries'

interface DocumentationCategoryPageProps {
	params: Promise<{
		categorySlug: string
	}>
}

export async function generateMetadata({
	params
}: DocumentationCategoryPageProps): Promise<Metadata> {
	const { categorySlug } = await params

	const category = documentationCategories.find(
		item => item.slug === categorySlug
	)

	if (!category) {
		return {
			title: 'Категория не найдена'
		}
	}

	return {
		title: `${category.title} — принципиальные схемы`,
		description: `Принципиальные схемы и техническая документация: ${category.title}.`
	}
}

export default async function DocumentationCategoryPage({
	params
}: DocumentationCategoryPageProps) {
	const { categorySlug } = await params

	const category = documentationCategories.find(
		item => item.slug === categorySlug
	)

	if (!category) {
		notFound()
	}

	const items = await getPublishedDocumentationByCategory(category.slug)

	return (
		<main className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
			<nav
				aria-label='Хлебные крошки'
				className='mb-8 text-sm text-zinc-500'
			>
				<Link
					href='/'
					className='transition hover:text-accent'
				>
					Главная
				</Link>

				<span className='mx-2'>/</span>

				<Link
					href='/documentation'
					className='transition hover:text-accent'
				>
					Принципиальные схемы
				</Link>

				<span className='mx-2'>/</span>

				<span className='text-zinc-900 dark:text-zinc-100'>
					{category.title}
				</span>
			</nav>

			<header className='mb-10'>
				<h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl'>
					{category.title}
				</h1>

				<p className='mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400'>
					Принципиальные схемы, электрические чертежи и техническая документация
					в категории «{category.title}».
				</p>

				<p className='mt-3 text-sm text-zinc-500'>
					Найдено документов: {items.length}
				</p>
			</header>

			{items.length === 0 ? (
				<section className='rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700'>
					<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>
						Документов пока нет
					</h2>

					<p className='mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400'>
						В этой категории пока нет опубликованных принципиальных схем.
						Загляните позже или выберите другую категорию.
					</p>

					<Link
						href='/documentation'
						className='mt-6 inline-flex rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90'
					>
						Все категории
					</Link>
				</section>
			) : (
				<ul className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{items.map(item => (
						<li key={item.id}>
							<Link
								href={`/documentation/${category.slug}/${item.slug}`}
								className='group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600'
							>
								<h2 className='text-lg font-semibold text-zinc-900 transition group-hover:text-accent dark:text-white'>
									{item.title}
								</h2>

								<p className='mt-3 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-400'>
									{item.description ||
										'Описание для этого документа пока не добавлено.'}
								</p>

								<div className='mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-800'>
									<span>Файлов: {item.files.length}</span>

									<span className='font-medium transition group-hover:text-accent'>
										Открыть →
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</main>
	)
}
