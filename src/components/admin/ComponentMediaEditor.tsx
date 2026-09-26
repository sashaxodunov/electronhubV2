'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
	createComponentMedia,
	deleteComponentMedia,
	updateComponentMedia
} from '@/actions/componentMedia'

import { uploadComponentMedia } from '@/actions/componentMediaUpload'

type ComponentMediaItem = {
	id: bigint
	assetType: string
	title: string | null
	fileUrl: string
	mimeType: string | null
	fileSize: number | null
	width: number | null
	height: number | null
	sortOrder: number
	isPrimary: boolean
	isActive: boolean
	altText: string | null
	description: string | null
}

type Props = {
	componentId: number
	media: ComponentMediaItem[]
	assetTypes: readonly string[]
}

type FormState = {
	assetType: string
	title: string
	fileUrl: string
	mimeType: string
	fileSize: string
	width: string
	height: string
	sortOrder: string
	isPrimary: boolean
	isActive: boolean
	altText: string
	description: string
}

const emptyForm: FormState = {
	assetType: 'photo',
	title: '',
	fileUrl: '',
	mimeType: '',
	fileSize: '',
	width: '',
	height: '',
	sortOrder: '0',
	isPrimary: false,
	isActive: true,
	altText: '',
	description: ''
}

function formatFileSize(size: number | null): string {
	if (size === null) {
		return '—'
	}

	if (size < 1024) {
		return `${size} Б`
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} КБ`
	}

	return `${(size / (1024 * 1024)).toFixed(1)} МБ`
}

function isImageMedia(item: ComponentMediaItem): boolean {
	return (
		item.mimeType === 'image/png' ||
		item.mimeType === 'image/jpeg' ||
		item.mimeType === 'image/webp' ||
		item.mimeType === 'image/gif' ||
		item.mimeType === 'image/svg+xml'
	)
}

export default function ComponentMediaEditor({
	componentId,
	media,
	assetTypes
}: Props) {
	const [form, setForm] = useState<FormState>(emptyForm)

	const [editingId, setEditingId] = useState<bigint | null>(null)

	const [uploading, setUploading] = useState(false)

	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	function resetForm() {
		setForm(emptyForm)
		setEditingId(null)
		setError(null)
	}

	function editMedia(item: ComponentMediaItem) {
		setEditingId(item.id)

		setForm({
			assetType: item.assetType,
			title: item.title ?? '',
			fileUrl: item.fileUrl,
			mimeType: item.mimeType ?? '',
			fileSize: item.fileSize?.toString() ?? '',
			width: item.width?.toString() ?? '',
			height: item.height?.toString() ?? '',
			sortOrder: item.sortOrder.toString(),
			isPrimary: item.isPrimary,
			isActive: item.isActive,
			altText: item.altText ?? '',
			description: item.description ?? ''
		})

		setError(null)
	}

	function updateField<K extends keyof FormState>(
		field: K,
		value: FormState[K]
	) {
		setForm(current => ({
			...current,
			[field]: value
		}))
	}

	async function handleUpload(file: File) {
		setUploading(true)
		setError(null)

		try {
			const uploadFormData = new FormData()

			uploadFormData.append('file', file)

			uploadFormData.append('componentId', componentId.toString())

			uploadFormData.append('assetType', form.assetType)

			const result = await uploadComponentMedia(uploadFormData)

			setForm(current => ({
				...current,
				fileUrl: result.fileUrl,
				mimeType: result.mimeType ?? '',
				fileSize: result.fileSize.toString(),
				width: result.width?.toString() ?? '',
				height: result.height?.toString() ?? ''
			}))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка загрузки файла')
		} finally {
			setUploading(false)
		}
	}

	function buildFormData(): FormData {
		const formData = new FormData()

		formData.append('componentId', componentId.toString())

		if (editingId !== null) {
			formData.append('id', editingId.toString())
		}

		formData.append('assetType', form.assetType)

		formData.append('title', form.title)

		formData.append('fileUrl', form.fileUrl)

		formData.append('mimeType', form.mimeType)

		formData.append('fileSize', form.fileSize)

		formData.append('width', form.width)

		formData.append('height', form.height)

		formData.append('sortOrder', form.sortOrder)

		if (form.isPrimary) {
			formData.append('isPrimary', 'on')
		}

		if (form.isActive) {
			formData.append('isActive', 'on')
		}

		formData.append('altText', form.altText)

		formData.append('description', form.description)

		return formData
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)

		try {
			const formData = buildFormData()

			if (editingId !== null) {
				await updateComponentMedia(formData)
			} else {
				await createComponentMedia(formData)
			}

			router.refresh()
			resetForm()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка сохранения')
		}
	}

	async function handleDelete(id: bigint) {
		if (!window.confirm('Удалить это медиа?')) {
			return
		}

		const formData = new FormData()

		formData.append('id', id.toString())

		formData.append('componentId', componentId.toString())

		try {
			await deleteComponentMedia(formData)
			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ошибка удаления')
		}
	}

	return (
		<div className='space-y-8'>
			<div>
				<h2 className='text-lg font-semibold'>Медиа компонента</h2>

				<p className='mt-1 text-sm text-gray-500'>
					Загрузка изображений, символов, схем и другой информации о компоненте.
				</p>
			</div>

			{error && (
				<div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
					{error}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className='space-y-5 rounded-lg border border-gray-200 text-background-dark bg-white p-5'
			>
				<div className='grid gap-5 md:grid-cols-2'>
					<label className='bloc'>
						<span className='text-sm text-background-dark font-medium'>
							Тип ресурса
						</span>

						<select
							value={form.assetType}
							onChange={event => updateField('assetType', event.target.value)}
							className='mt-1 w-full rounded border border-gray-300 text-background-dark px-3 py-2'
						>
							{assetTypes.map(type => (
								<option
									key={type}
									value={type}
								>
									{type}
								</option>
							))}
						</select>
					</label>

					<label className='block'>
						<span className='text-sm font-medium'>Название</span>

						<input
							type='text'
							value={form.title}
							onChange={event => updateField('title', event.target.value)}
							className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
						/>
					</label>
				</div>

				<div>
					<span className='text-sm font-medium'>Файл</span>

					<div className='mt-1 flex items-center gap-3'>
						<input
							type='file'
							accept='.png,.jpg,.jpeg,.webp,.gif,.svg,.pdf'
							disabled={uploading}
							onChange={event => {
								const file = event.target.files?.[0]

								if (file) {
									void handleUpload(file)
								}
							}}
							className='rounded border border-gray-300 bg-accent px-4 py-2 text-sm transition-all duration-200 hover:bg-accent-hover hover:text-white hover:-translate-y-0.5 hover:shadow-md focus:bg-accent-hover focus:text-white focus:outline-none focus:ring-2 focus:ring-accent/30'
						/>

						{uploading && (
							<span className='text-sm text-gray-500'>Загрузка...</span>
						)}
					</div>

					{form.fileUrl && (
						<p className='mt-2 break-all text-xs text-gray-500'>
							{form.fileUrl}
						</p>
					)}
				</div>

				<div className='grid gap-5 md:grid-cols-3'>
					<label className='block'>
						<span className='text-sm font-medium'>Порядок</span>

						<input
							type='number'
							value={form.sortOrder}
							onChange={event => updateField('sortOrder', event.target.value)}
							className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
						/>
					</label>

					<label className='block'>
						<span className='text-sm font-medium'>Ширина</span>

						<input
							type='number'
							value={form.width}
							onChange={event => updateField('width', event.target.value)}
							className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
						/>
					</label>

					<label className='block'>
						<span className='text-sm font-medium'>Высота</span>

						<input
							type='number'
							value={form.height}
							onChange={event => updateField('height', event.target.value)}
							className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
						/>
					</label>
				</div>

				<div className='grid gap-4 md:grid-cols-2'>
					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							checked={form.isPrimary}
							onChange={event => updateField('isPrimary', event.target.checked)}
						/>

						<span className='text-sm'>Основное медиа</span>
					</label>

					<label className='flex items-center gap-2'>
						<input
							type='checkbox'
							checked={form.isActive}
							onChange={event => updateField('isActive', event.target.checked)}
						/>

						<span className='text-sm'>Активно</span>
					</label>
				</div>

				<label className='block'>
					<span className='text-sm font-medium'>Alt-текст</span>

					<input
						type='text'
						value={form.altText}
						onChange={event => updateField('altText', event.target.value)}
						className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
					/>
				</label>

				<label className='block'>
					<span className='text-sm font-medium'>Описание</span>

					<textarea
						value={form.description}
						onChange={event => updateField('description', event.target.value)}
						rows={4}
						className='mt-1 w-full rounded border border-gray-300 px-3 py-2'
					/>
				</label>

				<div className='flex gap-3'>
					<button
						type='submit'
						disabled={uploading || !form.fileUrl}
						className='rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
					>
						{editingId !== null ? 'Сохранить изменения' : 'Добавить медиа'}
					</button>

					{editingId !== null && (
						<button
							type='button'
							onClick={resetForm}
							className='rounded border border-gray-300 px-4 py-2 text-sm'
						>
							Отмена
						</button>
					)}
				</div>
			</form>

			<div className='space-y-3'>
				<h3 className='font-medium'>Загруженные файлы</h3>

				{media.length === 0 ? (
					<p className='text-sm text-gray-500'>Медиа пока нет.</p>
				) : (
					<div className='divide-y rounded-lg border border-gray-200'>
						{media.map(item => (
							<div
								key={item.id.toString()}
								className='flex gap-4 p-4'
							>
								<div className='relative h-20 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50'>
									{isImageMedia(item) ? (
										<Image
											src={`/api/storage/${item.fileUrl
												.split('/')
												.map(encodeURIComponent)
												.join('/')}`}
											alt={item.altText ?? item.title ?? ''}
											fill
											sizes='80px'
											className='object-contain'
											unoptimized
										/>
									) : (
										<div className='flex h-full items-center justify-center text-xs text-gray-500'>
											{item.mimeType === 'application/pdf' ? 'PDF' : 'FILE'}
										</div>
									)}
								</div>

								<div className='min-w-0 flex-1'>
									<div className='flex flex-wrap gap-2'>
										<span className='rounded bg-gray-100 px-2 py-1 text-xs'>
											{item.assetType}
										</span>

										{!item.isActive && (
											<span className='rounded bg-yellow-100 px-2 py-1 text-xs'>
												Неактивно
											</span>
										)}

										{item.isPrimary && (
											<span className='rounded bg-blue-100 px-2 py-1 text-xs'>
												Основное
											</span>
										)}
									</div>

									<div className='mt-2 font-medium'>
										{item.title || 'Без названия'}
									</div>

									<div className='mt-1 text-xs text-gray-500'>
										{item.mimeType || 'тип неизвестен'}
										{' · '}
										{formatFileSize(item.fileSize)}
									</div>

									<div className='mt-1 truncate text-xs text-gray-400'>
										{item.fileUrl}
									</div>
								</div>

								<div className='flex shrink-0 flex-col gap-2'>
									<button
										type='button'
										onClick={() => editMedia(item)}
										className='rounded border border-gray-300 px-3 py-1.5 text-sm'
									>
										Изменить
									</button>

									<button
										type='button'
										onClick={() => void handleDelete(item.id)}
										className='rounded border border-red-300 px-3 py-1.5 text-sm text-red-600'
									>
										Удалить
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
