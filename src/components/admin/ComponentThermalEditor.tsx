'use client'

import { useState, type FormEvent } from 'react'

import {
	createComponentThermal,
	updateComponentThermal,
	deleteComponentThermal
} from '@/actions/componentThermal'

type ThermalItem = {
	id: bigint
	componentId: bigint
	name: string
	symbol: string | null
	value: string | null
	unit: string | null
	description: string | null
	createdAt: string
}

type ThermalForm = {
	name: string
	symbol: string
	value: string
	unit: string
	description: string
}

type Props = {
	componentId: bigint
	thermalItems: ThermalItem[]
}

const emptyForm: ThermalForm = {
	name: '',
	symbol: '',
	value: '',
	unit: '',
	description: ''
}

const inputClass = 'admin-input'

const buttonClass =
	'rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50'

function toForm(item: ThermalItem): ThermalForm {
	return {
		name: item.name,
		symbol: item.symbol ?? '',
		value: item.value ?? '',
		unit: item.unit ?? '',
		description: item.description ?? ''
	}
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

export default function ComponentThermalEditor({
	componentId,
	thermalItems
}: Props) {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingId, setEditingId] = useState<bigint | null>(null)
	const [form, setForm] = useState<ThermalForm>({ ...emptyForm })
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')

	function updateField<K extends keyof ThermalForm>(
		field: K,
		value: ThermalForm[K]
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

	function startEdit(item: ThermalItem) {
		setEditingId(item.id)
		setForm(toForm(item))
		setError('')
		setIsFormOpen(true)
	}

	function cancelEdit() {
		setEditingId(null)
		setForm({ ...emptyForm })
		setError('')
		setIsFormOpen(false)
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
				await updateComponentThermal(editingId.toString(), input)
			} else {
				await createComponentThermal(input)
			}
		} catch (err) {
			if (isRedirectError(err)) {
				throw err
			}

			setError(
				err instanceof Error
					? err.message
					: 'Не удалось сохранить тепловой параметр.'
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleDelete(item: ThermalItem) {
		if (isSubmitting) return

		const confirmed = window.confirm(
			`Удалить тепловой параметр «${item.name}»?`
		)

		if (!confirmed) return

		setError('')
		setIsSubmitting(true)

		try {
			await deleteComponentThermal(item.id.toString(), componentId.toString())
		} catch (err) {
			if (isRedirectError(err)) {
				throw err
			}

			setError(
				err instanceof Error
					? err.message
					: 'Не удалось удалить тепловой параметр.'
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='space-y-6 p-4 sm:p-6'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div>
					<h2 className='text-xl font-semibold text-gray-900'>
						Тепловые характеристики
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Тепловые сопротивления, температуры, постоянные времени и другие
						тепловые параметры.
					</p>
				</div>

				<button
					type='button'
					onClick={startCreate}
					disabled={isSubmitting}
					className={`${buttonClass} bg-[#ffd479] text-[#1f2a32] hover:bg-[#ffe2a0]`}
				>
					Добавить параметр
				</button>
			</div>

			{error && (
				<div
					role='alert'
					className='rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700'
				>
					{error}
				</div>
			)}

			{isFormOpen && (
				<form
					onSubmit={handleSubmit}
					className='space-y-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5'
				>
					<h3 className='font-medium text-gray-900'>
						{editingId !== null
							? 'Редактирование теплового параметра'
							: 'Новый тепловой параметр'}
					</h3>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<label className='space-y-1.5'>
							<span className='block text-sm text-gray-700'>Название *</span>

							<input
								className={inputClass}
								value={form.name}
								onChange={event => updateField('name', event.target.value)}
								placeholder='Тепловое сопротивление переход–корпус'
								maxLength={255}
								required
								disabled={isSubmitting}
							/>
						</label>

						<label className='space-y-1.5'>
							<span className='block text-sm text-gray-700'>Символ</span>

							<input
								className={inputClass}
								value={form.symbol}
								onChange={event => updateField('symbol', event.target.value)}
								placeholder='RθJC'
								maxLength={100}
								disabled={isSubmitting}
							/>
						</label>

						<label className='space-y-1.5'>
							<span className='block text-sm text-gray-700'>Значение</span>

							<input
								className={inputClass}
								type='text'
								inputMode='decimal'
								value={form.value}
								onChange={event => updateField('value', event.target.value)}
								placeholder='Например, 1.2'
								disabled={isSubmitting}
							/>
						</label>

						<label className='space-y-1.5'>
							<span className='block text-sm text-gray-700'>
								Единица измерения
							</span>

							<input
								className={inputClass}
								value={form.unit}
								onChange={event => updateField('unit', event.target.value)}
								placeholder='°C/Вт, °C, с'
								maxLength={50}
								disabled={isSubmitting}
							/>
						</label>

						<label className='space-y-1.5 sm:col-span-2'>
							<span className='block text-sm text-gray-700'>Описание</span>

							<textarea
								className={`${inputClass} min-h-24 resize-y`}
								value={form.description}
								onChange={event =>
									updateField('description', event.target.value)
								}
								placeholder='Пояснение к параметру, условия измерения или ссылка на раздел документации'
								rows={3}
								disabled={isSubmitting}
							/>
						</label>
					</div>

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

			<div className='overflow-x-auto rounded-xl border border-gray-200 bg-white'>
				<table className='w-full min-w-[750px] border-collapse text-left text-sm'>
					<thead className='bg-gray-50 text-gray-600'>
						<tr>
							<th className='px-4 py-3 font-medium'>Параметр</th>
							<th className='px-4 py-3 font-medium'>Символ</th>
							<th className='px-4 py-3 font-medium'>Значение</th>
							<th className='px-4 py-3 font-medium'>Ед.</th>
							<th className='px-4 py-3 font-medium'>Описание</th>
							<th className='px-4 py-3 font-medium'>Действия</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-200'>
						{thermalItems.length === 0 ? (
							<tr>
								<td
									colSpan={6}
									className='px-4 py-10 text-center text-gray-500'
								>
									Тепловые характеристики ещё не добавлены.
								</td>
							</tr>
						) : (
							thermalItems.map(item => (
								<tr
									key={item.id.toString()}
									className='align-top text-gray-700 transition hover:bg-gray-50'
								>
									<td className='px-4 py-3 font-medium text-gray-900'>
										{item.name}
									</td>

									<td className='px-4 py-3'>{item.symbol || '—'}</td>

									<td className='px-4 py-3 tabular-nums'>
										{item.value ?? '—'}
									</td>

									<td className='px-4 py-3'>{item.unit || '—'}</td>

									<td className='max-w-sm whitespace-normal px-4 py-3'>
										{item.description || '—'}
									</td>

									<td className='px-4 py-3'>
										<div className='flex gap-2'>
											<button
												type='button'
												onClick={() => startEdit(item)}
												disabled={isSubmitting}
												className={`${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-100`}
											>
												Изменить
											</button>

											<button
												type='button'
												onClick={() => handleDelete(item)}
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
