'use client'

import {
	createComponentRating,
	deleteComponentRating,
	updateComponentRating
} from '@/actions/componentRatings'
import { useState } from 'react'

type Rating = {
	id: bigint
	componentId: bigint
	name: string
	symbol: string | null
	valueMin: string | null
	valueTyp: string | null
	valueMax: string | null
	unit: string | null
	conditionText: string | null
	note: string | null
	sortOrder: number
	createdAt: string
}

type RatingForm = {
	name: string
	symbol: string
	valueMin: string
	valueTyp: string
	valueMax: string
	unit: string
	conditionText: string
	note: string
	sortOrder: string
}

type Props = {
	componentId: bigint
	ratings: Rating[]
}

const emptyForm: RatingForm = {
	name: '',
	symbol: '',
	valueMin: '',
	valueTyp: '',
	valueMax: '',
	unit: '',
	conditionText: '',
	note: '',
	sortOrder: '0'
}

const inputClass = 'admin-input'

const buttonClass =
	'rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50'

function toForm(rating: Rating): RatingForm {
	return {
		name: rating.name,
		symbol: rating.symbol ?? '',
		valueMin: rating.valueMin ?? '',
		valueTyp: rating.valueTyp ?? '',
		valueMax: rating.valueMax ?? '',
		unit: rating.unit ?? '',
		conditionText: rating.conditionText ?? '',
		note: rating.note ?? '',
		sortOrder: String(rating.sortOrder)
	}
}

function formatValue(value: string | null) {
	return value ?? '—'
}

function isRedirectError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'digest' in error &&
		typeof error.digest === 'string' &&
		error.digest.startsWith('NEXT_REDIRECT')
	)
}

export default function ComponentRatingsEditor({
	componentId,
	ratings
}: Props) {
	const [editingId, setEditingId] = useState<bigint | null>(null)
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [form, setForm] = useState<RatingForm>(emptyForm)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')

	function updateField<K extends keyof RatingForm>(
		field: K,
		value: RatingForm[K]
	) {
		setForm(current => ({
			...current,
			[field]: value
		}))
	}

	function startCreate() {
		setEditingId(null)
		setForm({ ...emptyForm })
		setError('')
		setIsFormOpen(true)
	}

	function startEdit(rating: Rating) {
		setEditingId(rating.id)
		setForm(toForm(rating))
		setError('')
		setIsFormOpen(true)
	}

	function cancelEdit() {
		setEditingId(null)
		setForm({ ...emptyForm })
		setError('')
		setIsFormOpen(false)
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (isSubmitting) return

		setError('')
		setIsSubmitting(true)

		const input = {
			componentId: componentId.toString(),
			...form
		}

		try {
			if (editingId !== null) {
				await updateComponentRating(editingId.toString(), input)
			} else {
				await createComponentRating(input)
			}

			// Серверные действия выполняют redirect после сохранения.
		} catch (err) {
			if (isRedirectError(err)) {
				throw err
			}

			setError(
				err instanceof Error
					? err.message
					: 'Не удалось сохранить характеристику.'
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleDelete(rating: Rating) {
		if (isSubmitting) return

		const confirmed = window.confirm(`Удалить характеристику «${rating.name}»?`)

		if (!confirmed) return

		setError('')
		setIsSubmitting(true)

		try {
			await deleteComponentRating(rating.id.toString(), componentId.toString())
		} catch (err) {
			if (isRedirectError(err)) {
				throw err
			}

			setError(
				err instanceof Error
					? err.message
					: 'Не удалось удалить характеристику.'
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='space-y-6 p-4 sm:p-6 '>
			{/* Заголовок */}
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h2 className='text-xl font-semibold text-gray-900'>
						Предельные характеристики
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Номинальные, типовые и предельно допустимые параметры компонента.
					</p>
				</div>

				<button
					type='button'
					onClick={startCreate}
					disabled={isSubmitting}
					className={`${buttonClass} bg-[#ffd479] text-[#1f2a32] hover:bg-[#ffe2a0]`}
				>
					Добавить характеристику
				</button>
			</div>

			{/* Сообщение об ошибке */}
			{error && (
				<div
					role='alert'
					className='rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700'
				>
					{error}
				</div>
			)}

			{/* Форма создания и редактирования */}
			{isFormOpen && (
				<form
					onSubmit={handleSubmit}
					className='space-y-5 rounded-xl border border-border bg-background-dark p-4 sm:p-5'
				>
					<h3 className='font-medium text-white'>
						{editingId !== null
							? 'Редактирование характеристики'
							: 'Новая характеристика'}
					</h3>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{/* Название */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>Название *</span>

							<input
								className={inputClass}
								value={form.name}
								onChange={event => updateField('name', event.target.value)}
								placeholder='Например, Напряжение сток-исток'
								maxLength={255}
								required
								disabled={isSubmitting}
							/>
						</label>

						{/* Символ */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>Символ</span>

							<input
								className={inputClass}
								value={form.symbol}
								onChange={event => updateField('symbol', event.target.value)}
								placeholder='VDS'
								maxLength={100}
								disabled={isSubmitting}
							/>
						</label>

						{/* Единица измерения */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>
								Единица измерения
							</span>

							<input
								className={inputClass}
								value={form.unit}
								onChange={event => updateField('unit', event.target.value)}
								placeholder='В, А, нКл'
								maxLength={50}
								disabled={isSubmitting}
							/>
						</label>

						{/* Минимум */}
						<label className='space-y-1.5'>
							<span className='block text-sm ttext-white'>
								Минимальное значение
							</span>

							<input
								className={inputClass}
								type='text'
								inputMode='decimal'
								value={form.valueMin}
								onChange={event => updateField('valueMin', event.target.value)}
								placeholder='Например, 4.5'
								disabled={isSubmitting}
							/>
						</label>

						{/* Типовое значение */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>Типовое значение</span>

							<input
								className={inputClass}
								type='text'
								inputMode='decimal'
								value={form.valueTyp}
								onChange={event => updateField('valueTyp', event.target.value)}
								placeholder='Например, 5'
								disabled={isSubmitting}
							/>
						</label>

						{/* Максимум */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>
								Максимальное значение
							</span>

							<input
								className={inputClass}
								type='text'
								inputMode='decimal'
								value={form.valueMax}
								onChange={event => updateField('valueMax', event.target.value)}
								placeholder='Например, 20'
								disabled={isSubmitting}
							/>
						</label>

						{/* Условия измерения */}
						<label className='space-y-1.5 sm:col-span-2 lg:col-span-3'>
							<span className='block text-sm text-white'>
								Условия измерения
							</span>

							<textarea
								className={`${inputClass} min-h-20 resize-y`}
								value={form.conditionText}
								onChange={event =>
									updateField('conditionText', event.target.value)
								}
								placeholder='Например, VGS = 10 В, Tj = 25 °C'
								rows={2}
								disabled={isSubmitting}
							/>
						</label>

						{/* Примечание */}
						<label className='space-y-1.5 sm:col-span-2 lg:col-span-3'>
							<span className='block text-sm text-white'>Примечание</span>

							<textarea
								className={`${inputClass} min-h-24 resize-y`}
								value={form.note}
								onChange={event => updateField('note', event.target.value)}
								placeholder='Дополнительная информация о характеристике'
								rows={3}
								disabled={isSubmitting}
							/>
						</label>

						{/* Сортировка */}
						<label className='space-y-1.5'>
							<span className='block text-sm text-white'>
								Порядок сортировки
							</span>

							<input
								className={inputClass}
								type='number'
								min={0}
								step={1}
								value={form.sortOrder}
								onChange={event => updateField('sortOrder', event.target.value)}
								disabled={isSubmitting}
							/>
						</label>
					</div>

					{/* Кнопки формы */}
					<div className='flex flex-wrap gap-3'>
						<button
							type='submit'
							disabled={isSubmitting}
							className={`${buttonClass} bg-[#ffd479] text-[#1f2a32] hover:bg-[#ffe2a0]`}
						>
							{isSubmitting
								? 'Сохранение...'
								: editingId !== null
									? 'Сохранить изменения'
									: 'Добавить'}
						</button>

						<button
							type='button'
							onClick={cancelEdit}
							disabled={isSubmitting}
							className={`${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-100`}
						>
							Отмена
						</button>
					</div>
				</form>
			)}

			{/* Таблица характеристик */}
			<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white'>
				<table className='w-full min-w-[1050px] border-collapse text-left text-sm'>
					<thead className='bg-gray-50 text-gray-600'>
						<tr>
							<th className='px-4 py-3 font-medium'>Характеристика</th>
							<th className='px-4 py-3 font-medium'>Символ</th>
							<th className='px-4 py-3 font-medium'>Мин.</th>
							<th className='px-4 py-3 font-medium'>Тип.</th>
							<th className='px-4 py-3 font-medium'>Макс.</th>
							<th className='px-4 py-3 font-medium'>Ед.</th>
							<th className='px-4 py-3 font-medium'>Условия и примечания</th>
							<th className='px-4 py-3 font-medium'>Действия</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{ratings.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									className='px-4 py-10 text-center text-gray-500'
								>
									Характеристики ещё не добавлены.
								</td>
							</tr>
						) : (
							ratings.map(rating => (
								<tr
									key={rating.id.toString()}
									className='align-top text-gray-700 transition hover:bg-gray-50'
								>
									<td className='px-4 py-3 font-medium text-gray-900'>
										{rating.name}
									</td>

									<td className='px-4 py-3'>{rating.symbol || '—'}</td>

									<td className='px-4 py-3 tabular-nums'>
										{formatValue(rating.valueMin)}
									</td>

									<td className='px-4 py-3 tabular-nums'>
										{formatValue(rating.valueTyp)}
									</td>

									<td className='px-4 py-3 tabular-nums'>
										{formatValue(rating.valueMax)}
									</td>

									<td className='px-4 py-3'>{rating.unit || '—'}</td>

									<td className='max-w-sm whitespace-normal px-4 py-3'>
										{rating.conditionText && <p>{rating.conditionText}</p>}

										{rating.note && (
											<p className='mt-1 text-xs text-gray-500'>
												{rating.note}
											</p>
										)}

										{!rating.conditionText && !rating.note && '—'}
									</td>

									<td className='px-4 py-3'>
										<div className='flex gap-2'>
											<button
												type='button'
												onClick={() => startEdit(rating)}
												disabled={isSubmitting}
												className={`${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-100`}
											>
												Изменить
											</button>

											<button
												type='button'
												onClick={() => handleDelete(rating)}
												disabled={isSubmitting}
												className={`${buttonClass} border border-red-300 text-red-600 hover:bg-red-50`}
											>
												Удалить
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
