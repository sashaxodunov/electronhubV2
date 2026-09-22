'use client'

import { useState } from 'react'
import { Trash2, X } from 'lucide-react'

type Props = {
	seriesId: bigint
	seriesName: string
	action: (formData: FormData) => void | Promise<void>
}

export default function DeleteComponentSeriesButton({
	seriesId,
	seriesName,
	action
}: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	async function handleDelete() {
		setIsDeleting(true)

		try {
			const formData = new FormData()
			formData.set('id', seriesId.toString())

			await action(formData)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setIsOpen(true)}
				className='inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100'
			>
				<Trash2 className='h-4 w-4' />
				Удалить серию
			</button>

			{isOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
					<div
						role='dialog'
						aria-modal='true'
						aria-labelledby='delete-series-title'
						className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl'
					>
						<div className='flex items-start justify-between gap-4'>
							<div>
								<h2
									id='delete-series-title'
									className='text-lg font-semibold text-gray-900'
								>
									Удалить серию?
								</h2>

								<p className='mt-2 text-sm leading-6 text-gray-600'>
									Вы действительно хотите удалить серию{' '}
									<span className='font-semibold text-gray-900'>
										«{seriesName}»
									</span>
									?
								</p>

								<p className='mt-2 text-sm leading-6 text-red-600'>
									Это действие нельзя отменить.
								</p>
							</div>

							<button
								type='button'
								onClick={() => setIsOpen(false)}
								disabled={isDeleting}
								aria-label='Закрыть'
								className='rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50'
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
