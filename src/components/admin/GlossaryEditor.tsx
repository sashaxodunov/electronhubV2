'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
	createGlossaryTerm,
	updateGlossaryTerm
} from '@/app/admin/glossary/actions'

type Category = {
	id: string
	name: string
}

type GlossaryTermData = {
	id: string
	term: string
	slug: string
	englishTerm: string
	abbreviation: string
	shortDefinition: string
	definition: string
	categoryId: string
	language: string
	metaTitle: string
	metaDescription: string
	isActive: boolean
}

type Props = {
	categories: Category[]
	initialData?: GlossaryTermData
}

export default function GlossaryEditor({ categories, initialData }: Props) {
	const router = useRouter()

	const isEditMode = Boolean(initialData)

	const [term, setTerm] = useState(initialData?.term ?? '')
	const [slug, setSlug] = useState(initialData?.slug ?? '')
	const [englishTerm, setEnglishTerm] = useState(initialData?.englishTerm ?? '')
	const [abbreviation, setAbbreviation] = useState(
		initialData?.abbreviation ?? ''
	)
	const [shortDefinition, setShortDefinition] = useState(
		initialData?.shortDefinition ?? ''
	)
	const [definition, setDefinition] = useState(initialData?.definition ?? '')
	const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '')
	const [language, setLanguage] = useState(initialData?.language ?? 'ru')
	const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
	const [metaDescription, setMetaDescription] = useState(
		initialData?.metaDescription ?? ''
	)
	const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState('')

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		setError('')
		setIsSaving(true)

		try {
			const data = {
				term,
				slug,
				englishTerm,
				abbreviation,
				shortDefinition,
				definition,
				categoryId: categoryId ? BigInt(categoryId) : null,
				language,
				metaTitle,
				metaDescription,
				isActive
			}

			if (isEditMode && initialData) {
				await updateGlossaryTerm(BigInt(initialData.id), data)

				router.push(`/admin/glossary/${initialData.id}`)
			} else {
				const result = await createGlossaryTerm(data)

				router.push(`/admin/glossary/${result.id.toString()}`)
			}

			router.refresh()
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Не удалось сохранить термин'
			)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6'
		>
			{/* Основная информация */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Основная информация
					</h2>

					<p className='mt-1 text-sm text-gray-500'>Основные данные термина</p>
				</div>

				<div className='space-y-5 p-6'>
					{/* Термин */}
					<div>
						<label
							htmlFor='term'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Термин <span className='text-red-500'>*</span>
						</label>

						<input
							id='term'
							type='text'
							value={term}
							onChange={event => setTerm(event.target.value)}
							required
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='Например: Транзистор'
						/>
					</div>

					{/* Slug */}
					<div>
						<label
							htmlFor='slug'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Slug <span className='text-red-500'>*</span>
						</label>

						<input
							id='slug'
							type='text'
							value={slug}
							onChange={event => setSlug(event.target.value)}
							required
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='tranzistor'
						/>
					</div>

					<div className='grid gap-5 md:grid-cols-2'>
						{/* Английское название */}
						<div>
							<label
								htmlFor='englishTerm'
								className='mb-1.5 block text-sm font-medium text-gray-700'
							>
								Английское название
							</label>

							<input
								id='englishTerm'
								type='text'
								value={englishTerm}
								onChange={event => setEnglishTerm(event.target.value)}
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
								placeholder='Transistor'
							/>
						</div>

						{/* Аббревиатура */}
						<div>
							<label
								htmlFor='abbreviation'
								className='mb-1.5 block text-sm font-medium text-gray-700'
							>
								Аббревиатура
							</label>

							<input
								id='abbreviation'
								type='text'
								value={abbreviation}
								onChange={event => setAbbreviation(event.target.value)}
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
								placeholder='BJT, MOSFET и т. п.'
							/>
						</div>
					</div>

					<div className='grid gap-5 md:grid-cols-2'>
						{/* Категория */}
						<div>
							<label
								htmlFor='categoryId'
								className='mb-1.5 block text-sm font-medium text-gray-700'
							>
								Категория
							</label>

							<select
								id='categoryId'
								value={categoryId}
								onChange={event => setCategoryId(event.target.value)}
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							>
								<option value=''>Без категории</option>

								{categories.map(category => (
									<option
										key={category.id}
										value={category.id}
									>
										{category.name}
									</option>
								))}
							</select>
						</div>

						{/* Язык */}
						<div>
							<label
								htmlFor='language'
								className='mb-1.5 block text-sm font-medium text-gray-700'
							>
								Язык
							</label>

							<select
								id='language'
								value={language}
								onChange={event => setLanguage(event.target.value)}
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							>
								<option value='ru'>Русский</option>
								<option value='en'>English</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			{/* Определение */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>Определение</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Краткое и полное описание термина
					</p>
				</div>

				<div className='space-y-5 p-6'>
					{/* Краткое определение */}
					<div>
						<label
							htmlFor='shortDefinition'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Краткое определение <span className='text-red-500'>*</span>
						</label>

						<textarea
							id='shortDefinition'
							value={shortDefinition}
							onChange={event => setShortDefinition(event.target.value)}
							required
							rows={3}
							className='w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='Краткое описание термина...'
						/>
					</div>

					{/* Полное определение */}
					<div>
						<label
							htmlFor='definition'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Полное определение
						</label>

						<textarea
							id='definition'
							value={definition}
							onChange={event => setDefinition(event.target.value)}
							rows={8}
							className='w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='Подробное определение термина...'
						/>
					</div>
				</div>
			</section>

			{/* SEO */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>SEO</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Метаданные страницы термина
					</p>
				</div>

				<div className='space-y-5 p-6'>
					{/* Meta Title */}
					<div>
						<label
							htmlFor='metaTitle'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Meta Title
						</label>

						<input
							id='metaTitle'
							type='text'
							value={metaTitle}
							onChange={event => setMetaTitle(event.target.value)}
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='Заголовок страницы для поисковых систем'
						/>
					</div>

					{/* Meta Description */}
					<div>
						<label
							htmlFor='metaDescription'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Meta Description
						</label>

						<textarea
							id='metaDescription'
							value={metaDescription}
							onChange={event => setMetaDescription(event.target.value)}
							rows={4}
							className='w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
							placeholder='Описание страницы для поисковых систем'
						/>
					</div>
				</div>
			</section>

			{/* Статус */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='p-6'>
					<label className='flex cursor-pointer items-center gap-3'>
						<input
							type='checkbox'
							checked={isActive}
							onChange={event => setIsActive(event.target.checked)}
							className='h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500'
						/>

						<span>
							<span className='block text-sm font-medium text-gray-700'>
								Активен
							</span>

							<span className='block text-xs text-gray-500'>
								Термин будет доступен на сайте
							</span>
						</span>
					</label>
				</div>
			</section>

			{/* Ошибка */}
			{error && (
				<div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
					{error}
				</div>
			)}

			{/* Кнопки */}
			<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
				<button
					type='button'
					onClick={() => router.push('/admin/glossary')}
					disabled={isSaving}
					className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
				>
					Отмена
				</button>

				<button
					type='submit'
					disabled={isSaving}
					className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{isSaving
						? 'Сохранение...'
						: isEditMode
							? 'Сохранить изменения'
							: 'Создать термин'}
				</button>
			</div>
		</form>
	)
}
