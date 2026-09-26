'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { storageUrl } from '@/lib/storage/url'

type GalleryMedia = {
	id: bigint
	mediaType: string
	title: string | null
	fileUrl: string
	altText: string | null
	isPrimary: boolean
	isActive: boolean
	sortOrder: number
}

type Props = {
	media: GalleryMedia[]
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

function isVisualMedia(item: GalleryMedia) {
	return (
		item.mediaType === 'image' ||
		item.mediaType === 'svg' ||
		item.mediaType === 'drawing'
	)
}

export default function PackageMediaGallery({ media }: Props) {
	const galleryItems = useMemo(
		() =>
			media
				.filter(item => item.isActive)
				.filter(isVisualMedia)
				.sort((a, b) => {
					if (a.isPrimary !== b.isPrimary) {
						return a.isPrimary ? -1 : 1
					}

					return a.sortOrder - b.sortOrder
				}),
		[media]
	)

	const [selectedId, setSelectedId] = useState<bigint | null>(
		galleryItems[0]?.id ?? null
	)

	const selected =
		galleryItems.find(item => item.id === selectedId) ?? galleryItems[0] ?? null

	if (!selected) {
		return (
			<section className='rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200 px-6 py-4'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Галерея корпуса
					</h2>
				</div>

				<div className='px-6 py-10 text-center text-sm text-gray-500'>
					Для этого варианта корпуса нет изображений или SVG.
				</div>
			</section>
		)
	}

	return (
		<section className='rounded-xl border border-gray-200 bg-white'>
			<div className='border-b border-gray-200 px-6 py-4'>
				<h2 className='text-lg font-semibold text-gray-900'>Галерея корпуса</h2>

				<p className='mt-1 text-sm text-gray-500'>
					Изображения и чертежи этого варианта корпуса.
				</p>
			</div>

			<div className='p-6'>
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-[120px_minmax(0,1fr)]'>
					{/* Миниатюры */}
					<div className='flex gap-3 overflow-x-auto lg:flex-col'>
						{galleryItems.map(item => {
							const active = item.id === selected.id

							return (
								<button
									key={item.id.toString()}
									type='button'
									onClick={() => setSelectedId(item.id)}
									className={[
										'relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition',
										active
											? 'border-gray-900'
											: 'border-gray-200 hover:border-gray-400'
									].join(' ')}
									title={
										item.title ??
										mediaTypeLabels[item.mediaType] ??
										item.mediaType
									}
								>
									<Image
										src={storageUrl(item.fileUrl)}
										alt={item.altText ?? item.title ?? 'Изображение корпуса'}
										fill
										sizes='96px'
										className='object-contain p-2'
										unoptimized
									/>

									{item.isPrimary && (
										<span className='absolute bottom-1 left-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700'>
											Основное
										</span>
									)}
								</button>
							)
						})}
					</div>

					{/* Основное изображение */}
					<div className='min-w-0'>
						<div className='relative flex min-h-90 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50'>
							<Image
								src={storageUrl(selected.fileUrl)}
								alt={
									selected.altText ?? selected.title ?? 'Изображение корпуса'
								}
								width={1200}
								height={900}
								className='max-h-150 w-auto max-w-full object-contain p-8'
								priority
								unoptimized
							/>
						</div>

						<div className='mt-4 flex flex-wrap items-center gap-3'>
							<h3 className='font-medium text-gray-900'>
								{selected.title || 'Без названия'}
							</h3>

							<span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
								{mediaTypeLabels[selected.mediaType] ?? selected.mediaType}
							</span>
						</div>

						{selected.fileUrl && (
							<p className='mt-2 break-all text-xs text-gray-400'>
								{selected.fileUrl}
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
