'use client'

import { useState } from 'react'
import { createComponent } from '@/actions/components'

type SelectOption = {
	id: number | bigint
	name: string
}

type ComponentFormProps = {
	manufacturers: SelectOption[]
	categories: SelectOption[]
	series: SelectOption[]
}

export default function ComponentForm({
	manufacturers,
	categories,
	series
}: ComponentFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	return (
		<form
			action={async formData => {
				setIsSubmitting(true)

				try {
					await createComponent(formData)
				} finally {
					setIsSubmitting(false)
				}
			}}
			className='space-y-8'
		>
			{/* Основная информация */}
			<section className='rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-base font-semibold text-gray-900'>
						Основная информация
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Основные данные электронного компонента
					</p>
				</div>

				<div className='grid grid-cols-1 gap-6 p-6 md:grid-cols-2'>
					{/* Название */}
					<div>
						<label
							htmlFor='name'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Название
						</label>

						<input
							id='name'
							name='name'
							type='text'
							required
							placeholder='Операционный усилитель'
							className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						/>
					</div>

					{/* Обозначение */}
					<div>
						<label
							htmlFor='designation'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Обозначение
						</label>

						<input
							id='designation'
							name='designation'
							type='text'
							required
							placeholder='LM358'
							className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
							required
							placeholder='lm358'
							className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						/>

						<p className='mt-1.5 text-xs text-gray-400'>
							Используется в URL компонента
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
							required
							defaultValue=''
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						>
							<option
								value=''
								disabled
							>
								Выберите производителя
							</option>

							{manufacturers.map(manufacturer => (
								<option
									key={manufacturer.id.toString()}
									value={manufacturer.id.toString()}
								>
									{manufacturer.name}
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
							required
							defaultValue=''
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						>
							<option
								value=''
								disabled
							>
								Выберите категорию
							</option>

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

					{/* Серия */}
					<div>
						<label
							htmlFor='seriesId'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Серия
						</label>

						<select
							id='seriesId'
							name='seriesId'
							defaultValue=''
							className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						>
							<option value=''>Без серии</option>

							{series.map(item => (
								<option
									key={item.id.toString()}
									value={item.id.toString()}
								>
									{item.name}
								</option>
							))}
						</select>
					</div>

					{/* Функция */}
					<div className='md:col-span-2'>
						<label
							htmlFor='function'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Функция
						</label>

						<input
							id='function'
							name='function'
							type='text'
							placeholder='Двойной операционный усилитель'
							className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						/>
					</div>

					{/* Краткое описание */}
					<div className='md:col-span-2'>
						<label
							htmlFor='shortDescription'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Краткое описание
						</label>

						<textarea
							id='shortDescription'
							name='shortDescription'
							rows={3}
							placeholder='Краткое описание компонента для каталога...'
							className='w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						/>
					</div>

					{/* Полное описание */}
					<div className='md:col-span-2'>
						<label
							htmlFor='description'
							className='mb-2 block text-sm font-medium text-gray-700'
						>
							Полное описание
						</label>

						<textarea
							id='description'
							name='description'
							rows={7}
							placeholder='Подробное техническое описание компонента...'
							className='w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
						/>
					</div>
				</div>
			</section>

			{/* Статус */}
			<section className='rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200 px-6 py-5'>
					<h2 className='text-base font-semibold text-gray-900'>Статус</h2>
				</div>

				<div className='p-6'>
					<label className='flex cursor-pointer items-center gap-3'>
						<input
							type='checkbox'
							name='isActive'
							value='true'
							defaultChecked
							className='h-4 w-4 rounded border-gray-300'
						/>

						<span>
							<span className='block text-sm font-medium text-gray-700'>
								Компонент активен
							</span>

							<span className='block text-xs text-gray-400'>
								Неактивные компоненты не будут показываться как доступные в
								каталоге
							</span>
						</span>
					</label>
				</div>
			</section>

			{/* Кнопки */}
			<div className='flex items-center justify-end gap-3'>
				<a
					href='/admin/components'
					className='rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
				>
					Отмена
				</a>

				<button
					type='submit'
					disabled={isSubmitting}
					className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{isSubmitting ? 'Сохранение...' : 'Создать компонент'}
				</button>
			</div>
		</form>
	)
}
