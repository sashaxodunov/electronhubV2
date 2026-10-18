'use client'

import Link from 'next/link'
import { useRef, useState, useTransition } from 'react'

import {
	createDocumentation,
	updateDocumentation
} from '@/actions/documentation'
import { documentationCategories } from '@/config/categories'

export type DocumentationFormValues = {
	id?: string
	title?: string | null
	slug?: string | null
	categorySlug?: string | null
	subcategoryId?: string | null
	brandId?: string | null
	description?: string | null
	status?: string | null
	documentType?: string | null
}

export type DocumentationSubcategoryOption = {
	id: string
	categorySlug: string
	title: string
	slug: string
	sortOrder: number
}

export type DocumentationBrandOption = {
	id: string
	name: string
	slug: string
}

type DocumentationFormProps = {
	initialData?: DocumentationFormValues
	subcategories?: DocumentationSubcategoryOption[]
	brands?: DocumentationBrandOption[]
}

const MAX_PDF_SIZE = 20 * 1024 * 1024
const MAX_OTHER_FILE_SIZE = 100 * 1024 * 1024

const DOCUMENT_TYPES = [
	{ value: 'schematic', label: 'Принципиальная схема' },
	{ value: 'boardview', label: 'Boardview' },
	{ value: 'cad', label: 'CAD-проект' },
	{ value: 'manual', label: 'Руководство' }
] as const

type DocumentType = (typeof DOCUMENT_TYPES)[number]['value']

const ALLOWED_EXTENSIONS: Record<DocumentType, string[]> = {
	schematic: ['djvu', 'jpg', 'pdf'],
	boardview: ['brd', 'bdv', 'boardview'],
	cad: ['cad'],
	manual: ['pdf']
}

function isDocumentType(value: unknown): value is DocumentType {
	return (
		typeof value === 'string' &&
		DOCUMENT_TYPES.some(type => type.value === value)
	)
}

function generateSlug(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/ё/g, 'e')
		.replace(/й/g, 'i')
		.replace(/[а-я]/g, char =>
			String.fromCharCode(char.charCodeAt(0) - 1072 + 97)
		)
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 255)
		.replace(/-+$/g, '')
}

function getFileExtension(fileName: string): string {
	const fileNameWithoutPath = fileName.split(/[\\/]/).pop() ?? ''
	const dotIndex = fileNameWithoutPath.lastIndexOf('.')

	if (dotIndex <= 0 || dotIndex === fileNameWithoutPath.length - 1) {
		return ''
	}

	return fileNameWithoutPath.slice(dotIndex + 1).toLowerCase()
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} Б`
	}

	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} КБ`
	}

	return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`
}

function formatMaxFileSize(bytes: number): string {
	return `${bytes / 1024 / 1024} МБ`
}

export default function DocumentationForm({
	initialData,
	subcategories = [],
	brands = []
}: DocumentationFormProps) {
	const isEditing = Boolean(initialData?.id)

	const [isPending, startTransition] = useTransition()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [title, setTitle] = useState(initialData?.title ?? '')
	const [slug, setSlug] = useState(initialData?.slug ?? '')
	const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug))

	const [categorySlug, setCategorySlug] = useState(
		initialData?.categorySlug ?? documentationCategories[0]?.slug ?? ''
	)

	const [subcategoryId, setSubcategoryId] = useState(
		initialData?.subcategoryId ?? ''
	)

	const [brandId, setBrandId] = useState(initialData?.brandId ?? '')

	const [documentType, setDocumentType] = useState<DocumentType>(
		isDocumentType(initialData?.documentType)
			? initialData.documentType
			: 'schematic'
	)

	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [error, setError] = useState<string | null>(null)

	const allowedExtensions = ALLOWED_EXTENSIONS[documentType]

	const filteredSubcategories = subcategories
		.filter(item => item.categorySlug === categorySlug)
		.sort(
			(a, b) =>
				a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, 'ru')
		)

	const sortedBrands = [...brands].sort((a, b) =>
		a.name.localeCompare(b.name, 'ru')
	)

	function clearSelectedFile() {
		setSelectedFile(null)

		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	async function handleSubmit(formData: FormData) {
		setError(null)

		try {
			if (isEditing) {
				await updateDocumentation(formData)
			} else {
				await createDocumentation(formData)
			}
		} catch (cause) {
			// Не перехватываем служебное исключение redirect от Next.js.
			if (
				typeof cause === 'object' &&
				cause !== null &&
				'digest' in cause &&
				typeof cause.digest === 'string' &&
				cause.digest.startsWith('NEXT_REDIRECT')
			) {
				throw cause
			}

			setError(
				cause instanceof Error ? cause.message : 'Не удалось сохранить документ'
			)
		}
	}

	function onTitleChange(value: string) {
		setTitle(value)

		if (!slugEdited) {
			setSlug(generateSlug(value))
		}
	}

	function onCategoryChange(value: string) {
		setCategorySlug(value)
		setSubcategoryId('')
	}

	function onDocumentTypeChange(value: string) {
		if (!isDocumentType(value)) {
			return
		}

		setDocumentType(value)
		clearSelectedFile()
		setError(null)
	}

	function onFileChange(file: File | null) {
		setError(null)

		if (!file || file.size === 0) {
			setSelectedFile(null)
			return
		}

		const extension = getFileExtension(file.name)

		if (!extension || !allowedExtensions.includes(extension)) {
			clearSelectedFile()

			setError(
				`Для выбранного типа документа разрешены: ${allowedExtensions
					.map(ext => `.${ext}`)
					.join(', ')}`
			)

			return
		}

		const maxSize = extension === 'pdf' ? MAX_PDF_SIZE : MAX_OTHER_FILE_SIZE

		if (file.size > maxSize) {
			clearSelectedFile()

			setError(
				`Размер файла «${file.name}» превышает лимит ${formatMaxFileSize(maxSize)}`
			)

			return
		}

		setSelectedFile(file)
	}

	return (
		<form
			action={formData => {
				startTransition(() => {
					void handleSubmit(formData)
				})
			}}
			className='space-y-6'
		>
			{isEditing && (
				<input
					type='hidden'
					name='id'
					value={initialData?.id ?? ''}
				/>
			)}

			<div className='grid gap-5 md:grid-cols-2'>
				<div className='space-y-2 md:col-span-2'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Название документа *
					</label>

					<input
						id='title'
						name='title'
						required
						maxLength={255}
						value={title}
						onChange={event => onTitleChange(event.target.value)}
						disabled={isPending}
						placeholder='Например, Руководство по ремонту телевизора'
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-900'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='slug'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						URL (slug) *
					</label>

					<input
						id='slug'
						name='slug'
						required
						maxLength={255}
						pattern='[a-z0-9]+(-[a-z0-9]+)*'
						title='Используй латинские строчные буквы, цифры и одиночные дефисы'
						value={slug}
						onChange={event => {
							setSlug(event.target.value)
							setSlugEdited(true)
						}}
						disabled={isPending}
						placeholder='tv-repair-manual'
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-900'
					/>

					<p className='text-xs text-zinc-500'>
						Только латинские строчные буквы, цифры и одиночные дефисы.
					</p>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='categorySlug'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Категория *
					</label>

					<select
						id='categorySlug'
						name='categorySlug'
						required
						value={categorySlug}
						onChange={event => onCategoryChange(event.target.value)}
						disabled={isPending}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					>
						{documentationCategories.map(category => (
							<option
								key={category.slug}
								value={category.slug}
							>
								{category.title}
							</option>
						))}
					</select>
				</div>

				<div className='space-y-2 md:col-span-2'>
					<label
						htmlFor='subcategoryId'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Подкатегория
					</label>

					<select
						id='subcategoryId'
						name='subcategoryId'
						value={subcategoryId}
						onChange={event => setSubcategoryId(event.target.value)}
						disabled={isPending}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					>
						<option value=''>Без подкатегории</option>

						{filteredSubcategories.map(subcategory => (
							<option
								key={subcategory.id}
								value={subcategory.id}
							>
								{subcategory.title}
							</option>
						))}
					</select>

					<p className='text-xs text-zinc-500'>
						{filteredSubcategories.length > 0
							? 'Доступны только подкатегории выбранной категории.'
							: 'Для этой категории пока нет подкатегорий. Можно сохранить документ без подкатегории.'}
					</p>
				</div>

				{/* Бренд документа */}
				<div className='space-y-2 md:col-span-2'>
					<label
						htmlFor='brandId'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Бренд
					</label>

					<select
						id='brandId'
						name='brandId'
						value={brandId}
						onChange={event => setBrandId(event.target.value)}
						disabled={isPending}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					>
						<option value=''>Без бренда</option>

						{sortedBrands.map(brand => (
							<option
								key={brand.id}
								value={brand.id}
							>
								{brand.name}
							</option>
						))}
					</select>

					<p className='text-xs text-zinc-500'>
						Выбери производителя, к которому относится документация. Если бренд
						не нужен, оставь поле пустым.
					</p>

					{sortedBrands.length === 0 && (
						<p className='text-xs text-amber-600 dark:text-amber-400'>
							Список брендов пуст. Добавь бренды в справочник, чтобы выбирать их
							здесь.
						</p>
					)}
				</div>

				<div className='space-y-2 md:col-span-2'>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Описание
					</label>

					<textarea
						id='description'
						name='description'
						maxLength={10000}
						rows={5}
						defaultValue={initialData?.description ?? ''}
						disabled={isPending}
						placeholder='Краткое описание документа...'
						className='w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='status'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Статус публикации
					</label>

					<select
						id='status'
						name='status'
						defaultValue={initialData?.status ?? 'draft'}
						disabled={isPending}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					>
						<option value='draft'>Черновик</option>
						<option value='published'>Опубликован</option>
					</select>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='documentType'
						className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
					>
						Тип документации *
					</label>

					<select
						id='documentType'
						name='documentType'
						required
						value={documentType}
						onChange={event => onDocumentTypeChange(event.target.value)}
						disabled={isPending}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white'
					>
						{DOCUMENT_TYPES.map(type => (
							<option
								key={type.value}
								value={type.value}
							>
								{type.label}
							</option>
						))}
					</select>
				</div>

				<div className='space-y-3 md:col-span-2'>
					<div className='space-y-1'>
						<label
							htmlFor='file'
							className='block text-sm font-medium text-zinc-700 dark:text-zinc-200'
						>
							Файл документации (необязательно)
						</label>

						<p className='text-xs text-zinc-500'>
							{documentType === 'schematic' &&
								'Принципиальная схема: PDF до 20 МБ.'}

							{documentType === 'boardview' &&
								'Boardview: .brd, .bdv или .boardview до 100 МБ.'}

							{documentType === 'cad' && 'CAD-проект: .cad до 100 МБ.'}

							{documentType === 'manual' && 'Руководство: PDF до 20 МБ.'}
						</p>

						<p className='text-xs text-zinc-500'>
							При редактировании без выбора нового файла существующий файл
							сохранится.
						</p>
					</div>

					<input
						ref={fileInputRef}
						id='file'
						name='file'
						type='file'
						accept={allowedExtensions.map(ext => `.${ext}`).join(',')}
						disabled={isPending}
						onChange={event =>
							onFileChange(event.currentTarget.files?.[0] ?? null)
						}
						className='block w-full cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm text-zinc-700 file:mr-4 file:border-0 file:bg-zinc-100 file:px-4 file:py-2.5 file:font-medium hover:file:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:file:bg-zinc-800 dark:hover:file:bg-zinc-700'
					/>

					{selectedFile && (
						<div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900'>
							<div className='flex min-w-0 items-center gap-2'>
								<span
									aria-hidden='true'
									className='rounded bg-blue-100 px-2 py-1 text-xs font-semibold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-300'
								>
									{getFileExtension(selectedFile.name) || 'FILE'}
								</span>

								<span className='break-all text-zinc-800 dark:text-zinc-200'>
									{selectedFile.name}
								</span>
							</div>

							<span className='shrink-0 text-xs text-zinc-500'>
								{formatFileSize(selectedFile.size)}
							</span>

							<button
								type='button'
								onClick={clearSelectedFile}
								disabled={isPending}
								className='text-sm text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400'
							>
								Убрать файл
							</button>
						</div>
					)}
				</div>
			</div>

			{error && (
				<div
					role='alert'
					className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
				>
					{error}
				</div>
			)}

			<div className='flex flex-wrap gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800'>
				<button
					type='submit'
					disabled={isPending}
					className='rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
				>
					{isPending
						? 'Сохранение…'
						: isEditing
							? 'Сохранить изменения'
							: 'Создать документ'}
				</button>

				<Link
					href='/admin/documentation'
					aria-disabled={isPending}
					className={`rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 ${
						isPending ? 'pointer-events-none opacity-60' : ''
					}`}
				>
					Отмена
				</Link>
			</div>
		</form>
	)
}
