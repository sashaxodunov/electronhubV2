import Link from 'next/link'

import { documentationCategories } from '@/config/categories'
import { getAdminDocumentationList } from '@/server/documentation/queries'

export const metadata = {
	title: 'Принципиальные схемы — админ-панель'
}

function formatDate(value: string): string {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return '—'
	}

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(date)
}

function getStatusLabel(status: string): string {
	switch (status) {
		case 'published':
			return 'Опубликован'
		case 'draft':
			return 'Черновик'
		default:
			return status
	}
}

export default async function AdminDocumentationPage() {
	const documents = await getAdminDocumentationList()

	return (
		<main className='mx-auto w-full max-w-7xl p-6 lg:p-8'>
			<div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-zinc-900 dark:text-white'>
						Принципиальные схемы
					</h1>

					<p className='mt-2 text-sm text-zinc-500'>
						Управление схемами и технической документацией
					</p>
				</div>

				<Link
					href='/admin/documentation/new'
					className='inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900'
				>
					+ Добавить документ
				</Link>
			</div>

			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
				<div className='rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'>
					<p className='text-sm text-zinc-500'>Всего документов</p>
					<p className='mt-2 text-3xl font-bold text-zinc-900 dark:text-white'>
						{documents.length}
					</p>
				</div>

				<div className='rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'>
					<p className='text-sm text-zinc-500'>Опубликовано</p>
					<p className='mt-2 text-3xl font-bold text-zinc-900 dark:text-white'>
						{documents.filter(item => item.status === 'published').length}
					</p>
				</div>

				<div className='rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'>
					<p className='text-sm text-zinc-500'>Черновики</p>
					<p className='mt-2 text-3xl font-bold text-zinc-900 dark:text-white'>
						{documents.filter(item => item.status === 'draft').length}
					</p>
				</div>
			</div>

			{documents.length === 0 ? (
				<section className='rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700'>
					<h2 className='text-lg font-semibold text-zinc-900 dark:text-white'>
						Документов пока нет
					</h2>

					<p className='mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500'>
						Создай первую запись, чтобы добавить описание и прикрепить файлы.
					</p>

					<Link
						href='/admin/documentation/new'
						className='mt-5 inline-flex rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900'
					>
						Создать документ
					</Link>
				</section>
			) : (
				<div className='overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='overflow-x-auto'>
						<table className='w-full text-left text-sm'>
							<thead className='border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950'>
								<tr>
									<th className='px-5 py-4 font-medium'>Документ</th>
									<th className='px-5 py-4 font-medium'>Категория</th>
									<th className='px-5 py-4 font-medium'>Статус</th>
									<th className='px-5 py-4 font-medium'>Файлы</th>
									<th className='px-5 py-4 font-medium'>Обновлён</th>
									<th className='px-5 py-4 font-medium'>
										<span className='sr-only'>Действия</span>
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-zinc-100 dark:divide-zinc-800'>
								{documents.map(document => {
									const category = documentationCategories.find(
										item => item.slug === document.categorySlug
									)

									return (
										<tr
											key={document.id}
											className='transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
										>
											<td className='max-w-sm px-5 py-4'>
												<p className='font-medium text-zinc-900 dark:text-white'>
													{document.title}
												</p>
												<p className='mt-1 break-all text-xs text-zinc-500'>
													{document.slug}
												</p>
											</td>

											<td className='px-5 py-4 text-zinc-600 dark:text-zinc-300'>
												{category?.title ?? document.categorySlug}
											</td>

											<td className='px-5 py-4'>
												<span
													className={[
														'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
														document.status === 'published'
															? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
															: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
													].join(' ')}
												>
													{getStatusLabel(document.status)}
												</span>
											</td>

											<td className='px-5 py-4 text-zinc-600 dark:text-zinc-300'>
												{document.fileCount}
											</td>

											<td className='whitespace-nowrap px-5 py-4 text-zinc-500'>
												{formatDate(document.updatedAt)}
											</td>

											<td className='whitespace-nowrap px-5 py-4 text-right'>
												<Link
													href={`/admin/documentation/${document.id}/edit`}
													className='font-medium text-accent hover:underline'
												>
													Изменить
												</Link>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</main>
	)
}
