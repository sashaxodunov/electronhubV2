'use client'

import { useState } from 'react'
import { Trash2, X } from 'lucide-react'

import { deleteCategory } from '@/app/admin/categories/actions'

type Props = {
	categoryId: bigint
	categoryName: string
}

export default function DeleteCategoryButton({
	categoryId,
	categoryName
}: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	async function handleDelete() {
		setIsDeleting(true)

		try {
			const formData = new FormData()
			formData.set('id', categoryId.toString())

			await deleteCategory(formData)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setIsOpen(true)}
				className='inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100'
			>
				<Trash2 className='h-4 w-4' />
				Удалить категорию
			</button>

			{isOpen && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
					onMouseDown={event => {
						if (event.target === event.currentTarget && !isDeleting) {
							setIsOpen(false)
						}
					}}
				>
					<div
						role='dialog'
						aria-modal='true'
						aria-labelledby='delete-category-title'
						className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl'
					>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<h2
									id='delete-category-title'
									className='text-lg font-semibold text-gray-900'
								>
									Удалить категорию?
								</h2>

								<p className='mt-2 text-sm leading-6 text-gray-600'>
									Вы действительно хотите удалить категорию{' '}
									<span className='font-semibold text-gray-900'>
										«{categoryName}»
									</span>
									?
								</p>

								<p className='mt-2 text-sm leading-6 text-red-600'>
									Удаление необратимо. Категория не будет удалена, если к ней
									привязаны дочерние категории, компоненты или серии.
								</p>
							</div>

							<button
								type='button'
								onClick={() => setIsOpen(false)}
								disabled={isDeleting}
								aria-label='Закрыть'
								className='shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<div className='mt-6 flex justify-end gap-3'>
							<button
								type='button'
								onClick={() => setIsOpen(false)}
								disabled={isDeleting}
								className='rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
							>
								Отмена
							</button>

							<button
								type='button'
								onClick={handleDelete}
								disabled={isDeleting}
								className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
							>
								<Trash2 className='h-4 w-4' />

								{isDeleting ? 'Удаление...' : 'Да, удалить'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
