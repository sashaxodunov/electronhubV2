'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'

import {
	createManufacturer,
	updateManufacturer
} from '@/app/admin/manufacturers/actions'

type ManufacturerOption = {
	id: bigint
	name: string
	shortName: string | null
}

type ManufacturerData = {
	id: bigint
	name: string
	shortName: string | null
	slug: string
	country: string | null
	website: string | null
	description: string | null
	isActive: boolean
	successorId: bigint | null
}

type Props = {
	mode: 'create' | 'edit'
	manufacturers: ManufacturerOption[]
	manufacturer?: ManufacturerData
}

export default function ManufacturerEditor({
	mode,
	manufacturers,
	manufacturer
}: Props) {
	const [name, setName] = useState(manufacturer?.name ?? '')
	const [shortName, setShortName] = useState(manufacturer?.shortName ?? '')
	const [slug, setSlug] = useState(manufacturer?.slug ?? '')
	const [country, setCountry] = useState(manufacturer?.country ?? '')
	const [website, setWebsite] = useState(manufacturer?.website ?? '')
	const [description, setDescription] = useState(
		manufacturer?.description ?? ''
	)
	const [successorId, setSuccessorId] = useState(
		manufacturer?.successorId?.toString() ?? ''
	)
	const [isActive, setIsActive] = useState(manufacturer?.isActive ?? true)

	const [saving, setSaving] = useState(false)

	function generateSlug(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[\s_]+/g, '-')
			.replace(/[^a-zа-яё0-9-]/gi, '')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '')
	}

	function handleNameChange(value: string) {
		setName(value)

		// При создании автоматически формируем slug.
		// При редактировании существующий slug не изменяем автоматически.
		if (mode === 'create') {
			setSlug(generateSlug(value))
		}
	}

	return (
		<form
			action={async formData => {
				setSaving(true)

				try {
					if (mode === 'create') {
						await createManufacturer(formData)
					} else if (manufacturer) {
						formData.set('id', manufacturer.id.toString())
						await updateManufacturer(formData)
					}
				} finally {
					setSaving(false)
				}
			}}
			className='space-y-6'
		>
			{/* Основная информация */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Основная информация
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Основные данные производителя.
					</p>
				</div>

				<div className='grid gap-5 p-6 md:grid-cols-2'>
					{/* Название */}
					<div className='md:col-span-2'>
						<label
							htmlFor='name'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Название *
						</label>

						<input
							id='name'
							name='name'
							type='text'
							value={name}
							onChange={event => handleNameChange(event.target.value)}
							required
							maxLength={255}
							placeholder='Например, Texas Instruments'
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Короткое название */}
					<div>
						<label
							htmlFor='shortName'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Короткое название
						</label>

						<input
							id='shortName'
							name='shortName'
							type='text'
							value={shortName}
							onChange={event => setShortName(event.target.value)}
							maxLength={100}
							placeholder='Например, TI'
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Slug */}
					<div>
						<label
							htmlFor='slug'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Slug *
						</label>

						<input
							id='slug'
							name='slug'
							type='text'
							value={slug}
							onChange={event => setSlug(event.target.value)}
							required
							maxLength={255}
							placeholder='texas-instruments'
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>

						<p className='mt-1.5 text-xs text-gray-400'>
							Используется в URL производителя.
						</p>
					</div>

					{/* Страна */}
					<div>
						<label
							htmlFor='country'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Страна
						</label>

						<input
							id='country'
							name='country'
							type='text'
							value={country}
							onChange={event => setCountry(event.target.value)}
							maxLength={100}
							placeholder='USA'
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Сайт */}
					<div>
						<label
							htmlFor='website'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Официальный сайт
						</label>

						<input
							id='website'
							name='website'
							type='url'
							value={website}
							onChange={event => setWebsite(event.target.value)}
							maxLength={500}
							placeholder='https://www.ti.com'
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>
				</div>
			</section>

			{/* Связь с правопреемником */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>Правопреемник</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Укажите производителя, который продолжил деятельность после
						поглощения, ребрендинга или передачи бизнеса.
					</p>
				</div>

				<div className='p-6'>
					<label
						htmlFor='successorId'
						className='mb-2 block text-sm font-medium text-gray-700'
					>
						Производитель-правопреемник
					</label>

					<select
						id='successorId'
						name='successorId'
						value={successorId}
						onChange={event => setSuccessorId(event.target.value)}
						className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
					>
						<option value=''>Не указан</option>

						{manufacturers
							.filter(
								item =>
									!manufacturer ||
									item.id.toString() !== manufacturer.id.toString()
							)
							.map(item => (
								<option
									key={item.id.toString()}
									value={item.id.toString()}
								>
									{item.name}
									{item.shortName ? ` (${item.shortName})` : ''}
								</option>
							))}
					</select>

					<p className='mt-1.5 text-xs text-gray-400'>
						Самого себя в качестве правопреемника выбрать нельзя.
					</p>
				</div>
			</section>

			{/* Описание */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-lg font-semibold text-gray-900'>Описание</h2>
				</div>

				<div className='p-6'>
					<label
						htmlFor='description'
						className='mb-2 block text-sm font-medium text-gray-700'
					>
						Описание производителя
					</label>

					<textarea
						id='description'
						name='description'
						value={description}
						onChange={event => setDescription(event.target.value)}
						rows={6}
						placeholder='Краткое описание производителя...'
						className='w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
					/>
				</div>
			</section>

			{/* Статус */}
			<section className='rounded-xl border border-gray-200 bg-white shadow-sm'>
				<div className='p-6'>
					<label className='flex cursor-pointer items-center gap-3'>
						<input
							type='checkbox'
							name='isActive'
							checked={isActive}
							onChange={event => setIsActive(event.target.checked)}
							className='h-4 w-4 rounded border-gray-300'
						/>

						<span>
							<span className='block text-sm font-medium text-gray-700'>
								Активный производитель
							</span>

							<span className='block text-xs text-gray-400'>
								Производитель доступен в каталоге ElectronHub.
							</span>
						</span>
					</label>
				</div>
			</section>

			{/* Кнопки */}
			<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-between'>
				<Link
					href='/admin/manufacturers'
					className='inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
				>
					<ArrowLeft className='h-4 w-4' />
					Отмена
				</Link>

				<button
					type='submit'
					disabled={saving}
					className='inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
				>
					<Save className='h-4 w-4' />

					{saving
						? 'Сохранение...'
						: mode === 'create'
							? 'Создать производителя'
							: 'Сохранить изменения'}
				</button>
			</div>
		</form>
	)
}
