'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'

import { createCategory, updateCategory } from '@/app/admin/categories/actions'

type CategoryOption = {
	id: bigint
	name: string
	parentId: bigint | null
}

type CategoryData = {
	id: bigint
	parentId: bigint | null
	name: string
	slug: string
	description: string | null
	sortOrder: number
	isActive: boolean
}

type Props = {
	mode: 'create' | 'edit'
	categories: CategoryOption[]
	category?: CategoryData
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

export default function CategoryEditor({ mode, categories, category }: Props) {
	const isEdit = mode === 'edit'

	const [name, setName] = useState(category?.name ?? '')

	const [slug, setSlug] = useState(category?.slug ?? '')

	const [parentId, setParentId] = useState(category?.parentId?.toString() ?? '')

	const [description, setDescription] = useState(category?.description ?? '')

	const [sortOrder, setSortOrder] = useState(
		category?.sortOrder.toString() ?? '0'
	)

	const [isActive, setIsActive] = useState(category?.isActive ?? true)

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
			if (isEdit && category) {
				formData.set('id', category.id.toString())

				await updateCategory(formData)
			} else {
				await createCategory(formData)
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
							Название категории
						</label>

						<input
							id='name'
							name='name'
							type='text'
							value={name}
							onChange={event => handleNameChange(event.target.value)}
							placeholder='Например: Микроконтроллеры'
							maxLength={150}
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
							placeholder='mikrokontrollery'
							maxLength={150}
							required
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>

						<p className='mt-1.5 text-xs text-gray-500'>
							Используется в URL страницы категории.
						</p>
					</div>

					{/* Родительская категория */}
					<div>
						<label
							htmlFor='parentId'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Родительская категория
						</label>

						<select
							id='parentId'
							name='parentId'
							value={parentId}
							onChange={event => setParentId(event.target.value)}
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						>
							<option value=''>Корневая категория</option>

							{categories.map(item => (
								<option
									key={item.id.toString()}
									value={item.id.toString()}
								>
									{item.name}
								</option>
							))}
						</select>

						<p className='mt-1.5 text-xs text-gray-500'>
							Оставьте «Корневая категория», если категория находится на верхнем
							уровне.
						</p>
					</div>

					{/* Порядок сортировки */}
					<div>
						<label
							htmlFor='sortOrder'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Порядок сортировки
						</label>

						<input
							id='sortOrder'
							name='sortOrder'
							type='number'
							step='1'
							value={sortOrder}
							onChange={event => setSortOrder(event.target.value)}
							className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>

						<p className='mt-1.5 text-xs text-gray-500'>
							Чем меньше значение, тем выше категория в списке.
						</p>
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
							placeholder='Описание категории...'
							className='w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200'
						/>
					</div>

					{/* Активность */}
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
									Категория активна
								</span>

								<span className='block text-xs text-gray-500'>
									Неактивные категории не используются как основные категории
									каталога.
								</span>
							</span>
						</label>
					</div>
				</div>
			</div>

			{/* Кнопки */}
			<div className='flex items-center justify-between'>
				<Link
					href='/admin/categories'
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
							: 'Создать категорию'}
				</button>
			</div>
		</form>
	)
}
