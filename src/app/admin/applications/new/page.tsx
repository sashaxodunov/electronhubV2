import Link from 'next/link'
import { createApplication } from '@/actions/applications'

const inputClass =
	'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500'

export default function NewApplicationPage() {
	return (
		<div className='mx-auto max-w-3xl space-y-6'>
			<div>
				<Link
					href='/admin/applications'
					className='text-sm text-gray-500 hover:text-gray-900'
				>
					← Области применения
				</Link>

				<h1 className='mt-4 text-2xl font-semibold text-gray-900'>
					Новая область применения
				</h1>
			</div>

			<form
				action={createApplication}
				className='space-y-5 rounded-xl border border-gray-200 bg-white p-6'
			>
				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Название</span>

					<input
						name='name'
						type='text'
						maxLength={255}
						required
						placeholder='Например, Генераторы импульсов'
						className={inputClass}
					/>
				</label>

				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Slug</span>

					<input
						name='slug'
						type='text'
						maxLength={255}
						required
						placeholder='generatory-impulsov'
						className={inputClass}
					/>

					<span className='text-xs text-gray-500'>
						Используется в URL страницы области применения.
					</span>
				</label>

				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Описание</span>

					<textarea
						name='description'
						rows={6}
						placeholder='Для чего используется эта область применения?'
						className={inputClass}
					/>
				</label>

				<div className='flex flex-wrap gap-3'>
					<button
						type='submit'
						className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
					>
						Создать
					</button>

					<Link
						href='/admin/applications'
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
					>
						Отмена
					</Link>
				</div>
			</form>
		</div>
	)
}
