import Link from 'next/link'

import { documentationCategories } from '@/config/categories'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getDocumentationSubcategories } from '@/server/documentation/subcategories'

import {
	createDocumentationSubcategory,
	deleteDocumentationSubcategory,
	updateDocumentationSubcategory
} from '@/actions/documentation-subcategories'

export const metadata = {
	title: 'Подкатегории — Принципиальные схемы'
}

export default async function DocumentationSubcategoriesPage() {
	await requireAdmin()

	const subcategories = await getDocumentationSubcategories()

	return (
		<main className='mx-auto max-w-7xl space-y-8 p-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold'>
						Подкатегории принципиальных схем
					</h1>

					<p className='mt-2 text-sm text-gray-500'>
						Управление группами документов внутри основных категорий.
					</p>
				</div>

				<Link
					href='/admin/documentation'
					className='rounded-lg border px-4 py-2 text-sm hover:bg-accent hover:text-black'
				>
					К документам
				</Link>
			</div>

			<section className='rounded-xl border p-5'>
				<h2 className='mb-4 text-lg font-semibold'>Создать подкатегорию</h2>

				<form
					action={createDocumentationSubcategory}
					className='grid gap-4 md:grid-cols-2'
				>
					<label className='grid gap-1 text-sm'>
						Основная категория
						<select
							name='categorySlug'
							required
							defaultValue=''
							className='rounded-lg border p-2'
						>
							<option
								value=''
								disabled
							>
								Выбери категорию
							</option>

							{documentationCategories.map(category => (
								<option
									key={category.slug}
									value={category.slug}
								>
									{category.title}
								</option>
							))}
						</select>
					</label>

					<label className='grid gap-1 text-sm'>
						Название подкатегории
						<input
							name='title'
							required
							maxLength={255}
							placeholder='Например, Блоки питания'
							className='rounded-lg border p-2'
						/>
					</label>

					<label className='grid gap-1 text-sm'>
						URL (slug)
						<input
							name='slug'
							required
							maxLength={255}
							pattern='[a-z0-9]+(-[a-z0-9]+)*'
							placeholder='power-supplies'
							className='rounded-lg border p-2'
						/>
					</label>

					<label className='grid gap-1 text-sm'>
						Порядок отображения
						<input
							name='sortOrder'
							type='number'
							min='0'
							step='1'
							defaultValue='0'
							required
							className='rounded-lg border p-2'
						/>
					</label>

					<div className='md:col-span-2'>
						<button
							type='submit'
							className='rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700'
						>
							Создать подкатегорию
						</button>
					</div>
				</form>
			</section>

			<section className='space-y-4'>
				<h2 className='text-lg font-semibold'>
					Существующие подкатегории ({subcategories.length})
				</h2>

				{subcategories.length === 0 ? (
					<div className='rounded-xl border p-6 text-sm text-gray-500'>
						Подкатегорий пока нет. Создай первую выше.
					</div>
				) : (
					<div className='space-y-6'>
						{documentationCategories.map(category => {
							const items = subcategories.filter(
								item => item.categorySlug === category.slug
							)

							return (
								<section
									key={category.slug}
									className='overflow-hidden rounded-xl border'
								>
									<div className='border-b bg-gray-50 px-4 py-3'>
										<h3 className='font-semibold'>{category.title}</h3>

										<p className='text-xs text-gray-500'>{category.slug}</p>
									</div>

									{items.length === 0 ? (
										<p className='p-4 text-sm text-gray-500'>
											В этой категории пока нет подкатегорий.
										</p>
									) : (
										<div className='divide-y'>
											{items.map(item => (
												<div
													key={String(item.id)}
													className='p-4'
												>
													<form
														action={updateDocumentationSubcategory}
														className='grid gap-3 md:grid-cols-2 xl:grid-cols-5'
													>
														<input
															type='hidden'
															name='id'
															value={String(item.id)}
														/>

														<label className='grid gap-1 text-sm'>
															Название
															<input
																name='title'
																defaultValue={item.title}
																required
																maxLength={255}
																className='rounded-lg border p-2'
															/>
														</label>

														<label className='grid gap-1 text-sm'>
															Slug
															<input
																name='slug'
																defaultValue={item.slug}
																required
																maxLength={255}
																pattern='[a-z0-9]+(-[a-z0-9]+)*'
																className='rounded-lg border p-2'
															/>
														</label>

														<label className='grid gap-1 text-sm'>
															Категория
															<select
																name='categorySlug'
																defaultValue={item.categorySlug}
																required
																className='rounded-lg border p-2'
															>
																{documentationCategories.map(cat => (
																	<option
																		key={cat.slug}
																		value={cat.slug}
																	>
																		{cat.title}
																	</option>
																))}
															</select>
														</label>

														<label className='grid gap-1 text-sm'>
															Порядок
															<input
																name='sortOrder'
																type='number'
																min='0'
																step='1'
																defaultValue={item.sortOrder}
																required
																className='rounded-lg border p-2'
															/>
														</label>

														<div className='flex items-end'>
															<button
																type='submit'
																className='w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'
															>
																Сохранить
															</button>
														</div>
													</form>

													<div className='mt-3 flex flex-wrap items-center justify-between gap-3'>
														<code className='text-xs text-gray-500'>
															/documentation/{item.categorySlug}/{item.slug}
														</code>

														<form action={deleteDocumentationSubcategory}>
															<input
																type='hidden'
																name='id'
																value={String(item.id)}
															/>

															<button
																type='submit'
																className='rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50'
															>
																Удалить
															</button>
														</form>
													</div>
												</div>
											))}
										</div>
									)}
								</section>
							)
						})}
					</div>
				)}
			</section>
		</main>
	)
}
