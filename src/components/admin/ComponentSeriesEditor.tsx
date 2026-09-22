'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import {
	createComponentSeries,
	updateComponentSeries
} from '@/app/admin/series/actions'

type ManufacturerOption = {
	id: bigint
	name: string
	shortName: string | null
}

type CategoryOption = {
	id: bigint
	name: string
	slug: string
}

type ComponentSeriesData = {
	id: bigint
	name: string
	slug: string
	description: string | null
	isActive: boolean
	manufacturerId: bigint | null
	categoryId: bigint | null
}

type Props = {
	mode: 'create' | 'edit'
	manufacturers: ManufacturerOption[]
	categories: CategoryOption[]
	series?: ComponentSeriesData
}

function createSlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zа-яё0-9-]/gi, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export default function ComponentSeriesEditor({
	mode,
	manufacturers,
	categories,
	series
}: Props) {
	const isEdit = mode === 'edit'

	const [name, setName] = useState(series?.name ?? '')
	const [slug, setSlug] = useState(series?.slug ?? '')
	const [description, setDescription] = useState(series?.description ?? '')
	const [manufacturerId, setManufacturerId] = useState(
		series?.manufacturerId?.toString() ?? ''
	)
	const [categoryId, setCategoryId] = useState(
		series?.categoryId?.toString() ?? ''
	)
	const [isActive, setIsActive] = useState(series?.isActive ?? true)
	const [saving, setSaving] = useState(false)

	function handleNameChange(value: string) {
		setName(value)

		if (!isEdit) {
			setSlug(createSlug(value))
		}
	}

	async function handleSubmit(formData: FormData) {
		setSaving(true)

		try {
			if (isEdit && series) {
				formData.set('id', series.id.toString())
				await updateComponentSeries(formData)
			} else {
				await createComponentSeries(formData)
			}
		} finally {
			setSaving(false)
		}
	}

	return (
		<form
			action={handleSubmit}
			className='space-y-6'
		>
			<div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
				<div className='grid gap-6 md:grid-cols-2'>
					{/* Название */}
					<div className='md:col-span-2'>
						<label
							htmlFor='name'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Название серии
						</label>

						<input
							id='name'
							name='name'
							type='text'
							value={name}
							onChange={event => handleNameChange(event.target.value)}
							placeholder='Например: STM32F4'
							maxLength={255}
							required
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Slug */}
					<div>
						<label
							htmlFor='slug'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Slug
						</label>

						<input
							id='slug'
							name='slug'
							type='text'
							value={slug}
							onChange={event => setSlug(event.target.value)}
							placeholder='stm32f4'
							maxLength={255}
							required
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>

						<p className='mt-1.5 text-xs text-gray-500'>
							Используется в URL страницы серии.
						</p>
					</div>

					{/* Производитель */}
					<div>
						<label
							htmlFor='manufacturerId'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Производитель
						</label>

						<select
							id='manufacturerId'
							name='manufacturerId'
							value={manufacturerId}
							onChange={event => setManufacturerId(event.target.value)}
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						>
							<option value=''>Не выбран</option>

							{manufacturers.map(manufacturer => (
								<option
									key={manufacturer.id.toString()}
									value={manufacturer.id.toString()}
								>
									{manufacturer.name}
									{manufacturer.shortName ? ` (${manufacturer.shortName})` : ''}
								</option>
							))}
						</select>
					</div>

					{/* Категория */}
					<div>
						<label
							htmlFor='categoryId'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Категория
						</label>

						<select
							id='categoryId'
							name='categoryId'
							value={categoryId}
							onChange={event => setCategoryId(event.target.value)}
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						>
							<option value=''>Не выбрана</option>

							{categories.map(category => (
								<option
									key={category.id.toString()}
									value={category.id.toString()}
								>
									{category.name}
								</option>
							))}
						</select>
					</div>

					{/* Описание */}
					<div className='md:col-span-2'>
						<label
							htmlFor='description'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Описание
						</label>

						<textarea
							id='description'
							name='description'
							value={description}
							onChange={event => setDescription(event.target.value)}
							rows={6}
							placeholder='Описание серии компонентов...'
							className='w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Статус */}
					<div className='md:col-span-2'>
						<label className='flex cursor-pointer items-center gap-3'>
							<input
								type='checkbox'
								name='isActive'
								checked={isActive}
								onChange={event => setIsActive(event.target.checked)}
								className='h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400'
							/>

							<span>
								<span className='block text-sm font-medium text-gray-700'>
									Серия активна
								</span>

								<span className='block text-xs text-gray-500'>
									Неактивные серии не используются как основные варианты в
									каталоге.
								</span>
							</span>
						</label>
					</div>
				</div>
			</div>

			{/* Кнопки */}
			<div className='flex items-center justify-between'>
				<Link
					href='/admin/series'
					className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
				>
					<ArrowLeft className='h-4 w-4' />
					Отмена
				</Link>

				<button
					type='submit'
					disabled={saving}
					className='inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
				>
					<Save className='h-4 w-4' />

					{saving
						? 'Сохранение...'
						: isEdit
							? 'Сохранить изменения'
							: 'Создать серию'}
				</button>
			</div>
		</form>
	)
}
