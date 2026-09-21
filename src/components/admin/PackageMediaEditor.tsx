'use client'

import Image from 'next/image'
import { useState } from 'react'

import { uploadPackageMedia } from '@/actions/packageMediaUpload'
import {
	createPackageVariantMedia,
	deletePackageVariantMedia,
	updatePackageVariantMedia
} from '@/actions/packageMedia'

type PackageMediaItem = {
	id: bigint
	mediaType: string
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
	packageId: number
	packageVariantId: number
	media: PackageMediaItem[]
	mediaTypes: readonly string[]
}

const emptyForm = {
	mediaType: '',
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

const mediaTypeLabels: Record<string, string> = {
	image: 'Изображение',
	svg: 'SVG',
	drawing: 'Чертёж',
	'3d': '3D-модель',
	pdf: 'PDF',
	datasheet: 'Datasheet',
	model: 'Модель',
	other: 'Другое'
}

function formatFileSize(size: number | null) {
	if (size === null || size <= 0) {
		return '—'
	}

	if (size < 1024) {
		return `${size} Б`
	}

	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(1)} КБ`
	}

	if (size < 1024 * 1024 * 1024) {
		return `${(size / 1024 / 1024).toFixed(1)} МБ`
	}

	return `${(size / 1024 / 1024 / 1024).toFixed(1)} ГБ`
}

function isImageMedia(item: PackageMediaItem) {
	return item.mediaType === 'image' || item.mediaType === 'svg'
}

export default function PackageMediaEditor({
	packageId,
	packageVariantId,
	media,
	mediaTypes
}: Props) {
	const [editingId, setEditingId] = useState<bigint | null>(null)

	const [form, setForm] = useState(() => ({
		...emptyForm,
		mediaType: mediaTypes[0] ?? ''
	}))

	const [uploading, setUploading] = useState(false)

	const [uploadedFile, setUploadedFile] = useState<{
		fileUrl: string
		mimeType: string | null
		fileSize: number
		width: number | null
		height: number | null
		originalName: string
	} | null>(null)

	function resetForm() {
		setEditingId(null)

		setForm({
			...emptyForm,
			mediaType: mediaTypes[0] ?? ''
		})

		setUploadedFile(null)
	}

	function editMedia(item: PackageMediaItem) {
		setEditingId(item.id)

		setUploadedFile(null)

		setForm({
			mediaType: item.mediaType,
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

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	}

	function updateField(field: keyof typeof form, value: string | boolean) {
		setForm(current => ({
			...current,
			[field]: value
		}))
	}

	async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]

		if (!file) {
			return
		}

		setUploading(true)

		try {
			const uploadFormData = new FormData()

			uploadFormData.append('file', file)
			uploadFormData.append('packageVariantId', packageVariantId.toString())

			const result = await uploadPackageMedia(uploadFormData)

			setUploadedFile(result)

			setForm(current => ({
				...current,
				fileUrl: result.fileUrl,
				mimeType: result.mimeType ?? '',
				fileSize: result.fileSize.toString(),
				width: result.width?.toString() ?? '',
				height: result.height?.toString() ?? ''
			}))
		} catch (error) {
			console.error(error)

			alert(
				error instanceof Error ? error.message : 'Не удалось загрузить файл'
			)
		} finally {
			setUploading(false)

			event.target.value = ''
		}
	}

	return (
		<div className='space-y-8'>
			{/* Форма */}
			<section className='rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200 px-6 py-4'>
					<h2 className='text-lg font-semibold text-gray-900'>
						{editingId ? 'Редактирование медиа' : 'Добавить медиа'}
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Медиафайл будет привязан к этому варианту корпуса.
					</p>
				</div>

				<form
					action={
						editingId ? updatePackageVariantMedia : createPackageVariantMedia
					}
					className='space-y-6 p-6'
				>
					{editingId && (
						<input
							type='hidden'
							name='id'
							value={editingId.toString()}
						/>
					)}

					<input
						type='hidden'
						name='packageId'
						value={packageId}
					/>

					<input
						type='hidden'
						name='packageVariantId'
						value={packageVariantId}
					/>

					{/* Основные данные */}
					<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-gray-700'>
								Тип медиа
							</span>

							<select
								name='mediaType'
								value={form.mediaType}
								onChange={event => updateField('mediaType', event.target.value)}
								className='w-full rounded-lg border border-gray-300 px-3 py-2'
								required
							>
								{mediaTypes.map(type => (
									<option
										key={type}
										value={type}
									>
										{mediaTypeLabels[type] ?? type}
									</option>
								))}
							</select>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-gray-700'>
								Название
							</span>

							<input
								type='text'
								name='title'
								value={form.title}
								onChange={event => updateField('title', event.target.value)}
								placeholder='SOIC-8 package drawing'
								className='w-full rounded-lg border border-gray-300 px-3 py-2'
							/>
						</label>
					</div>

					{/* Загрузка файла */}
					<div className='space-y-3'>
						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-gray-700'>
								Файл
							</span>

							<input
								type='file'
								accept='.png,.jpg,.jpeg,.webp,.gif,.svg,.pdf'
								onChange={handleFileUpload}
								disabled={uploading}
								className='block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium'
							/>
						</label>

						{uploading && (
							<div className='rounded-lg border border-blue-200 bg-blue-50 px-4 py-3'>
								<p className='text-sm font-medium text-blue-800'>
									Загрузка файла...
								</p>
							</div>
						)}

						{uploadedFile && (
							<div className='rounded-lg border border-green-200 bg-green-50 px-4 py-3'>
								<div className='text-sm font-medium text-green-800'>
									Файл загружен
								</div>

								<div className='mt-1 break-all text-xs text-green-700'>
									{uploadedFile.originalName}
								</div>

								<div className='mt-1 break-all text-xs text-green-700'>
									{uploadedFile.fileUrl}
								</div>

								<div className='mt-2 flex flex-wrap gap-4 text-xs text-green-600'>
									<span>{formatFileSize(uploadedFile.fileSize)}</span>

									{uploadedFile.mimeType && (
										<span>{uploadedFile.mimeType}</span>
									)}

									{uploadedFile.width && uploadedFile.height && (
										<span>
											{uploadedFile.width} × {uploadedFile.height}
										</span>
									)}
								</div>
							</div>
						)}

						{form.fileUrl && !uploadedFile && (
							<div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
								<div className='text-xs font-medium uppercase text-gray-500'>
									Текущий файл
								</div>

								<div className='mt-1 break-all text-sm text-gray-700'>
									{form.fileUrl}
								</div>
							</div>
						)}

						{/* Данные файла передаются серверному action скрытыми полями */}
						<input
							type='hidden'
							name='fileUrl'
							value={form.fileUrl}
						/>

						<input
							type='hidden'
							name='mimeType'
							value={form.mimeType}
						/>

						<input
							type='hidden'
							name='fileSize'
							value={form.fileSize}
						/>

						<input
							type='hidden'
							name='width'
							value={form.width}
						/>

						<input
							type='hidden'
							name='height'
							value={form.height}
						/>
					</div>

					{/* Информация о файле */}
					<div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
						<div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
							<div className='text-xs font-medium uppercase text-gray-500'>
								MIME type
							</div>

							<div className='mt-1 text-sm text-gray-800'>
								{form.mimeType || '—'}
							</div>
						</div>

						<div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
							<div className='text-xs font-medium uppercase text-gray-500'>
								Размер файла
							</div>

							<div className='mt-1 text-sm text-gray-800'>
								{form.fileSize ? formatFileSize(Number(form.fileSize)) : '—'}
							</div>
						</div>

						<div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
							<div className='text-xs font-medium uppercase text-gray-500'>
								Размер изображения
							</div>

							<div className='mt-1 text-sm text-gray-800'>
								{form.width && form.height
									? `${form.width} × ${form.height} px`
									: '—'}
							</div>
						</div>
					</div>

					{/* Порядок */}
					<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-gray-700'>
								Порядок
							</span>

							<input
								type='number'
								name='sortOrder'
								value={form.sortOrder}
								onChange={event => updateField('sortOrder', event.target.value)}
								min='0'
								className='w-full rounded-lg border border-gray-300 px-3 py-2'
							/>
						</label>
					</div>

					{/* Alt text */}
					<label className='block'>
						<span className='mb-1 block text-sm font-medium text-gray-700'>
							Alt text
						</span>

						<input
							type='text'
							name='altText'
							value={form.altText}
							onChange={event => updateField('altText', event.target.value)}
							placeholder='Размеры корпуса SOIC-8'
							className='w-full rounded-lg border border-gray-300 px-3 py-2'
						/>
					</label>

					{/* Описание */}
					<label className='block'>
						<span className='mb-1 block text-sm font-medium text-gray-700'>
							Описание
						</span>

						<textarea
							name='description'
							value={form.description}
							onChange={event => updateField('description', event.target.value)}
							rows={4}
							className='w-full rounded-lg border border-gray-300 px-3 py-2'
						/>
					</label>

					{/* Статусы */}
					<div className='flex flex-wrap gap-6'>
						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								name='isPrimary'
								checked={form.isPrimary}
								onChange={event =>
									updateField('isPrimary', event.target.checked)
								}
							/>

							<span className='text-sm text-gray-700'>Основное медиа</span>
						</label>

						<label className='flex items-center gap-2'>
							<input
								type='checkbox'
								name='isActive'
								checked={form.isActive}
								onChange={event =>
									updateField('isActive', event.target.checked)
								}
							/>

							<span className='text-sm text-gray-700'>Активно</span>
						</label>
					</div>

					{/* Кнопки */}
					<div className='flex gap-3'>
						<button
							type='submit'
							disabled={uploading || !form.fileUrl}
							className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
						>
							{editingId ? 'Сохранить изменения' : 'Добавить медиа'}
						</button>

						{editingId && (
							<button
								type='button'
								onClick={resetForm}
								className='rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								Отмена
							</button>
						)}
					</div>
				</form>
			</section>

			{/* Таблица */}
			<section className='rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200 px-6 py-4'>
					<h2 className='text-lg font-semibold text-gray-900'>Медиафайлы</h2>

					<p className='mt-1 text-sm text-gray-500'>Всего: {media.length}</p>
				</div>

				{media.length === 0 ? (
					<div className='px-6 py-10 text-center text-sm text-gray-500'>
						Для этого варианта корпуса медиафайлов пока нет.
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Превью
									</th>

									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Название
									</th>

									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Тип
									</th>

									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Файл
									</th>

									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Порядок
									</th>

									<th className='px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
										Статус
									</th>

									<th className='px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500'>
										Действия
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-100 bg-white'>
								{media.map(item => (
									<tr
										key={item.id.toString()}
										className='hover:bg-gray-50'
									>
										{/* Превью */}
										<td className='px-5 py-4'>
											{isImageMedia(item) ? (
												<div className='relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
													<Image
														src={item.fileUrl}
														alt={
															item.altText ??
															item.title ??
															'Изображение корпуса'
														}
														fill
														sizes='64px'
														className='object-contain'
													/>
												</div>
											) : (
												<div className='flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-center text-xs font-medium text-gray-500'>
													{mediaTypeLabels[item.mediaType] ?? item.mediaType}
												</div>
											)}
										</td>

										{/* Название */}
										<td className='px-5 py-4'>
											<div className='font-medium text-gray-900'>
												{item.title || 'Без названия'}
											</div>

											{item.description && (
												<div className='mt-1 max-w-xs text-xs text-gray-500'>
													{item.description}
												</div>
											)}
										</td>

										{/* Тип */}
										<td className='px-5 py-4'>
											<span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
												{mediaTypeLabels[item.mediaType] ?? item.mediaType}
											</span>
										</td>

										{/* Файл */}
										<td className='px-5 py-4 text-sm text-gray-600'>
											<div>{formatFileSize(item.fileSize)}</div>

											{item.width && item.height && (
												<div className='mt-1 text-xs text-gray-400'>
													{item.width} × {item.height} px
												</div>
											)}
										</td>

										{/* Порядок */}
										<td className='px-5 py-4 text-sm text-gray-600'>
											{item.sortOrder}
										</td>

										{/* Статус */}
										<td className='px-5 py-4'>
											<div className='flex flex-col gap-1'>
												{item.isActive ? (
													<span className='text-xs font-medium text-green-600'>
														Активно
													</span>
												) : (
													<span className='text-xs font-medium text-gray-400'>
														Неактивно
													</span>
												)}

												{item.isPrimary && (
													<span className='text-xs font-medium text-amber-600'>
														Основное
													</span>
												)}
											</div>
										</td>

										{/* Действия */}
										<td className='px-5 py-4'>
											<div className='flex items-center justify-end gap-3'>
												<button
													type='button'
													onClick={() => editMedia(item)}
													className='text-sm font-medium text-gray-700 hover:text-gray-900'
												>
													Изменить
												</button>

												<form action={deletePackageVariantMedia}>
													<input
														type='hidden'
														name='id'
														value={item.id.toString()}
													/>

													<input
														type='hidden'
														name='packageId'
														value={packageId}
													/>

													<input
														type='hidden'
														name='packageVariantId'
														value={packageVariantId}
													/>

													<button
														type='submit'
														className='text-sm font-medium text-red-600 hover:text-red-700'
													>
														Удалить
													</button>
												</form>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	)
}
