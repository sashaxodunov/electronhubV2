import Link from 'next/link'

import { documentationCategories } from '@/config/categories'
import {
	createDocumentation,
	updateDocumentation
} from '@/actions/documentation'

export type DocumentationFormValues = {
	id?: string
	title?: string | null
	slug?: string | null
	categorySlug?: string | null
	description?: string | null
	status?: string | null
}

type DocumentationFormProps = {
	initialData?: DocumentationFormValues
}

export default function DocumentationForm({
	initialData
}: DocumentationFormProps) {
	const isEditing = Boolean(initialData?.id)

	const action = isEditing ? updateDocumentation : createDocumentation

	return (
		<form
			action={action}
			className='space-y-6'
		>
			{isEditing && (
				<input
					type='hidden'
					name='id'
					value={initialData?.id}
				/>
			)}

			<div className='grid gap-5 md:grid-cols-2'>
				<div className='space-y-2 md:col-span-2'>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-zinc-700'
					>
						Название документа *
					</label>

					<input
						id='title'
						name='title'
						required
						maxLength={255}
						defaultValue={initialData?.title ?? ''}
						placeholder='Например, Руководство по ремонту телевизора'
						className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='slug'
						className='block text-sm font-medium text-zinc-700'
					>
						URL (slug) *
					</label>

					<input
						id='slug'
						name='slug'
						required
						maxLength={255}
						pattern='[a-z0-9]+(-[a-z0-9]+)*'
						defaultValue={initialData?.slug ?? ''}
						placeholder='tv-repair-manual'
						className='w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
					/>

					<p className='text-xs text-zinc-500'>
						Латиница в нижнем регистре, цифры и дефисы.
					</p>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='categorySlug'
						className='block text-sm font-medium text-zinc-700'
					>
						Категория *
					</label>

					<select
						id='categorySlug'
						name='categorySlug'
						required
						defaultValue={
							initialData?.categorySlug ??
							documentationCategories[0]?.slug ??
							''
						}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
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
						htmlFor='description'
						className='block text-sm font-medium text-zinc-700'
					>
						Описание
					</label>

					<textarea
						id='description'
						name='description'
						maxLength={10000}
						rows={5}
						defaultValue={initialData?.description ?? ''}
						placeholder='Краткое описание документа...'
						className='w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
					/>
				</div>

				<div className='space-y-2'>
					<label
						htmlFor='status'
						className='block text-sm font-medium text-zinc-700'
					>
						Статус публикации
					</label>

					<select
						id='status'
						name='status'
						defaultValue={initialData?.status ?? 'draft'}
						className='w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
					>
						<option value='draft'>Черновик</option>
						<option value='published'>Опубликован</option>
					</select>
				</div>
			</div>

			<div className='flex flex-wrap gap-3 border-t border-zinc-200 pt-5'>
				<button
					type='submit'
					className='rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700'
				>
					{isEditing ? 'Сохранить изменения' : 'Создать документ'}
				</button>

				<Link
					href='/admin/documentation'
					className='rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50'
				>
					Отмена
				</Link>
			</div>
		</form>
	)
}
