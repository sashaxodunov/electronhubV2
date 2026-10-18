import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { documentationCategories } from '@/config/categories'
import { getPublishedDocumentationByCategoryAndSlug } from '@/server/documentation/queries'
import { documentationStorageUrl } from '@/lib/storage'

interface DocumentationPageProps {
	params: Promise<{
		categorySlug: string
		slug: string
	}>
}

export async function generateMetadata({
	params
}: DocumentationPageProps): Promise<Metadata> {
	const { categorySlug, slug } = await params

	const category = documentationCategories.find(
		item => item.slug === categorySlug
	)

	if (!category) {
		return {
			title: 'Документ не найден'
		}
	}

	const document = await getPublishedDocumentationByCategoryAndSlug(
		categorySlug,
		slug
	)

	if (!document) {
		return {
			title: 'Документ не найден'
		}
	}

	return {
		title: `${document.title} — ${category.title}`,
		description:
			document.description ||
			`Принципиальная схема или техническая документация: ${document.title}.`
	}
}

function formatFileSize(size: number): string {
	if (size < 1024) {
		return `${size} Б`
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} КБ`
	}

	if (size < 1024 * 1024 * 1024) {
		return `${(size / (1024 * 1024)).toFixed(1)} МБ`
	}

	return `${(size / (1024 * 1024 * 1024)).toFixed(2)} ГБ`
}

function formatDate(value: Date | string | null | undefined): string {
	if (!value) return ''

	const date = value instanceof Date ? value : new Date(value)

	if (Number.isNaN(date.getTime())) {
		return ''
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Europe/Moscow'
	}).format(date)
}

export default async function DocumentationDetailPage({
	params
}: DocumentationPageProps) {
	const { categorySlug, slug } = await params

	const category = documentationCategories.find(
		item => item.slug === categorySlug
	)

	if (!category) {
		notFound()
	}

	const document = await getPublishedDocumentationByCategoryAndSlug(
		categorySlug,
		slug
	)

	if (!document) {
		notFound()
	}

	const primaryFile =
		document.files.find(file => file.isPrimary) ?? document.files[0]

	return (
		<main className='mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8'>
			<nav
				aria-label='Хлебные крошки'
				className='mb-8 flex flex-wrap items-center gap-y-2 text-sm text-zinc-500'
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

				<Link
					href={`/documentation/${category.slug}`}
					className='transition hover:text-accent'
				>
					{category.title}
				</Link>

				<span className='mx-2'>/</span>

				<span className='text-zinc-900 dark:text-zinc-100'>
					{document.title}
				</span>
			</nav>

			<header className='mb-8'>
				<p className='mb-3 text-sm font-medium text-accent'>{category.title}</p>

				<h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl'>
					{document.title}
				</h1>

				{document.description && (
					<p className='mt-5 whitespace-pre-line text-base leading-7 text-zinc-600 dark:text-zinc-400'>
						{document.description}
					</p>
				)}

				<p className='mt-4 text-sm text-zinc-500'>
					Обновлено: {formatDate(document.updatedAt)}
				</p>
			</header>

			{primaryFile && (
				<section className='mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<div className='min-w-0'>
							<p className='text-sm text-zinc-500'>Основной файл</p>

							<h2 className='mt-1 break-words text-lg font-semibold text-zinc-900 dark:text-white'>
								{primaryFile.originalName}
							</h2>

							<p className='mt-1 text-sm text-zinc-500'>
								{primaryFile.contentType}
								{' · '}
								{formatFileSize(primaryFile.sizeBytes)}
							</p>
						</div>

						<a
							href={documentationStorageUrl(primaryFile.objectKey)}
							target='_blank'
							rel='noreferrer'
							className='inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90'
						>
							Открыть файл
						</a>
					</div>
				</section>
			)}

			<section aria-labelledby='document-files-title'>
				<div className='mb-4 flex items-center justify-between gap-4'>
					<h2
						id='document-files-title'
						className='text-xl font-semibold text-zinc-900 dark:text-white'
					>
						Файлы документа
					</h2>

					<span className='text-sm text-zinc-500'>{document.files.length}</span>
				</div>

				{document.files.length === 0 ? (
					<div className='rounded-xl border border-dashed border-zinc-300 px-5 py-10 text-center dark:border-zinc-700'>
						<p className='text-sm text-zinc-600 dark:text-zinc-400'>
							Файлы для этого документа пока не добавлены.
						</p>
					</div>
				) : (
					<ul className='space-y-3'>
						{document.files.map(file => (
							<li key={file.id}>
								<div className='flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between'>
									<div className='flex min-w-0 items-start gap-3'>
										<div className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
											{file.contentType === 'application/pdf' ? 'PDF' : 'FILE'}
										</div>

										<div className='min-w-0'>
											<p className='break-words font-medium text-zinc-900 dark:text-white'>
												{file.originalName}
											</p>

											<p className='mt-1 text-xs text-zinc-500'>
												{file.contentType}
												{' · '}
												{formatFileSize(file.sizeBytes)}
												{file.isPrimary && (
													<span className='ml-2 text-accent'>Основной</span>
												)}
											</p>
										</div>
									</div>

									<a
										href={documentationStorageUrl(file.objectKey)}
										target='_blank'
										rel='noreferrer'
										className='shrink-0 text-sm font-medium text-accent transition hover:opacity-80'
									>
										Открыть →
									</a>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>

			<div className='mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800'>
				<Link
					href={`/documentation/${category.slug}`}
					className='text-sm font-medium text-accent transition hover:opacity-80'
				>
					← Вернуться в категорию
				</Link>
			</div>
		</main>
	)
}
