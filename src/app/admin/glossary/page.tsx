import Link from 'next/link'

import { asc, eq, ilike, or } from 'drizzle-orm'
import { ArrowRight, Plus, Search } from 'lucide-react'

import { db } from '@/db'
import { glossaryCategories, glossaryTerms } from '@/db/schema'

type Props = {
	searchParams: Promise<{
		q?: string
	}>
}

export default async function GlossaryPage({ searchParams }: Props) {
	const { q } = await searchParams
	const search = q?.trim() ?? ''

	const rows = await db
		.select({
			id: glossaryTerms.id,
			term: glossaryTerms.term,
			slug: glossaryTerms.slug,
			englishTerm: glossaryTerms.englishTerm,
			abbreviation: glossaryTerms.abbreviation,
			shortDefinition: glossaryTerms.shortDefinition,
			language: glossaryTerms.language,
			isActive: glossaryTerms.isActive,
			categoryId: glossaryTerms.categoryId,
			categoryName: glossaryCategories.name
		})
		.from(glossaryTerms)
		.leftJoin(
			glossaryCategories,
			eq(glossaryTerms.categoryId, glossaryCategories.id)
		)
		.where(
			search
				? or(
						ilike(glossaryTerms.term, `%${search}%`),
						ilike(glossaryTerms.slug, `%${search}%`),
						ilike(glossaryTerms.englishTerm, `%${search}%`),
						ilike(glossaryTerms.abbreviation, `%${search}%`),
						ilike(glossaryTerms.shortDefinition, `%${search}%`),
						ilike(glossaryCategories.name, `%${search}%`)
					)
				: undefined
		)
		.orderBy(asc(glossaryTerms.term))

	return (
		<main className='space-y-6 p-6'>
			{/* Заголовок */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Глоссарий</h1>

					<p className='mt-1 text-sm text-gray-500'>
						Термины, определения и связанные понятия
					</p>
				</div>

				<Link
					href='/admin/glossary/new'
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					<Plus className='h-4 w-4' />
					Добавить термин
				</Link>
			</div>

			{/* Поиск */}
			<form
				method='GET'
				className='flex flex-col gap-3 sm:flex-row'
			>
				<div className='relative flex-1'>
					<Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />

					<input
						type='search'
						name='q'
						defaultValue={search}
						placeholder='Поиск по термину, slug, английскому названию или категории...'
						className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
					/>
				</div>

				<button
					type='submit'
					className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
				>
					Найти
				</button>

				{search && (
					<Link
						href='/admin/glossary'
						className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50'
					>
						Сбросить
					</Link>
				)}
			</form>

			{/* Количество */}
			<div className='text-sm text-gray-500'>
				Найдено терминов: {rows.length}
			</div>

			{/* Таблица */}
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='overflow-x-auto'>
					<table className='min-w-full text-left text-sm'>
						<thead className='border-b border-gray-200 bg-gray-50'>
							<tr>
								<th className='px-5 py-4 font-semibold text-gray-700'>
									Термин
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Английское название
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Категория
								</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>Язык</th>

								<th className='px-5 py-4 font-semibold text-gray-700'>
									Статус
								</th>

								<th className='px-5 py-4 text-right font-semibold text-gray-700'>
									Действия
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-100 bg-white'>
							{rows.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className='px-5 py-12 text-center text-gray-500'
									>
										{search
											? 'Термины по вашему запросу не найдены.'
											: 'Терминов пока нет.'}
									</td>
								</tr>
							) : (
								rows.map(term => (
									<tr
										key={term.id.toString()}
										className='transition hover:bg-gray-50'
									>
										{/* Термин */}
										<td className='px-5 py-4'>
											<div className='min-w-0'>
												<Link
													href={`/admin/glossary/${term.id.toString()}`}
													className='font-semibold text-gray-900 hover:text-gray-600'
												>
													{term.term}
												</Link>

												<div className='mt-0.5 text-xs text-gray-400'>
													{term.slug}
												</div>

												{term.abbreviation && (
													<div className='mt-1 text-xs text-gray-500'>
														{term.abbreviation}
													</div>
												)}

												{term.shortDefinition && (
													<div className='mt-1 max-w-md truncate text-xs text-gray-500'>
														{term.shortDefinition}
													</div>
												)}
											</div>
										</td>

										{/* Английское название */}
										<td className='px-5 py-4 text-gray-600'>
											{term.englishTerm ?? (
												<span className='text-gray-400'>Не указано</span>
											)}
										</td>

										{/* Категория */}
										<td className='px-5 py-4 text-gray-600'>
											{term.categoryName ?? (
												<span className='text-gray-400'>Не указана</span>
											)}
										</td>

										{/* Язык */}
										<td className='px-5 py-4'>
											<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
												{term.language.toUpperCase()}
											</span>
										</td>

										{/* Статус */}
										<td className='px-5 py-4'>
											{term.isActive ? (
												<span className='inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'>
													Активен
												</span>
											) : (
												<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
													Неактивен
												</span>
											)}
										</td>

										{/* Действия */}
										<td className='px-5 py-4 text-right'>
											<Link
												href={`/admin/glossary/${term.id.toString()}`}
												className='inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900'
											>
												Открыть
												<ArrowRight className='h-4 w-4' />
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	)
}
