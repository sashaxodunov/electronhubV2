'use client'

import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import {
	createComponentPin,
	deleteComponentPin,
	updateComponentPin
} from '@/actions/componentPins'

type Pin = {
	id: bigint
	pinNumber: string
	pinName: string
	pinType: string
	function: string | null
	description: string | null
	activeLevel: string | null
	element: string | null
	isExposedPad: boolean
	sortOrder: number
}

type Props = {
	componentId: bigint
	pins: Pin[]
	pinTypes: readonly string[]
}

const pinTypeLabels: Record<string, string> = {
	input: 'Вход',
	output: 'Выход',
	power: 'Питание',
	ground: 'Земля',
	io: 'Вход / выход',
	control: 'Управление',
	passive: 'Пассивный',
	nc: 'Не подключен'
}

function getPinTypeLabel(type: string): string {
	return pinTypeLabels[type] ?? type
}

export default function ComponentPinsEditor({
	componentId,
	pins,
	pinTypes
}: Props) {
	const [showForm, setShowForm] = useState(false)
	const [editingPin, setEditingPin] = useState<Pin | null>(null)

	function startCreate() {
		setEditingPin(null)
		setShowForm(true)
	}

	function startEdit(pin: Pin) {
		setEditingPin(pin)
		setShowForm(true)
	}

	function closeForm() {
		setShowForm(false)
		setEditingPin(null)
	}

	return (
		<div className='p-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h2 className='text-xl font-semibold text-gray-900'>
						Выводы компонента
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						{pins.length === 0
							? 'Выводы ещё не добавлены'
							: `Всего выводов: ${pins.length}`}
					</p>
				</div>

				{!showForm && (
					<button
						type='button'
						onClick={startCreate}
						className='flex items-center gap-2 rounded border border-gray-300 bg-accent px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white hover:shadow-md active:translate-y-0'
					>
						<Plus size={16} />
						Добавить вывод
					</button>
				)}
			</div>

			{showForm && (
				<PinForm
					componentId={componentId}
					pinTypes={pinTypes}
					pin={editingPin}
					onClose={closeForm}
				/>
			)}

			{pins.length === 0 ? (
				!showForm && (
					<div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center'>
						<p className='text-sm text-gray-500'>
							У компонента пока нет выводов.
						</p>

						<button
							type='button'
							onClick={startCreate}
							className='mt-4 rounded border border-gray-300 bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover'
						>
							Добавить первый вывод
						</button>
					</div>
				)
			) : (
				<div className='overflow-hidden rounded-lg border border-gray-200'>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-225 text-sm'>
							<thead className='bg-gray-50'>
								<tr className='border-b border-gray-200 text-left'>
									<th className='px-4 py-3 font-medium text-gray-600'>№</th>

									<th className='px-4 py-3 font-medium text-gray-600'>
										Название
									</th>

									<th className='px-4 py-3 font-medium text-gray-600'>Тип</th>

									<th className='px-4 py-3 font-medium text-gray-600'>
										Функция
									</th>

									<th className='px-4 py-3 font-medium text-gray-600'>
										Уровень
									</th>

									<th className='px-4 py-3 font-medium text-gray-600'>
										Элемент
									</th>

									<th className='px-4 py-3 font-medium text-gray-600'>EP</th>

									<th className='px-4 py-3 font-medium text-gray-600'>
										Действия
									</th>
								</tr>
							</thead>

							<tbody>
								{pins.map(pin => (
									<tr
										key={pin.id.toString()}
										className='border-b border-gray-100 last:border-b-0 hover:bg-gray-50'
									>
										<td className='px-4 py-3 font-medium text-gray-900'>
											{pin.pinNumber}
										</td>

										<td className='px-4 py-3 text-gray-900'>{pin.pinName}</td>

										<td className='px-4 py-3'>
											<span className='inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
												{getPinTypeLabel(pin.pinType)}
											</span>
										</td>

										<td className='max-w-55 px-4 py-3 text-gray-700'>
											{pin.function ?? '—'}
										</td>

										<td className='px-4 py-3 text-gray-700'>
											{pin.activeLevel ?? '—'}
										</td>

										<td className='px-4 py-3 text-gray-700'>
											{pin.element ?? '—'}
										</td>

										<td className='px-4 py-3'>
											{pin.isExposedPad ? (
												<span className='font-medium text-green-600'>Да</span>
											) : (
												<span className='text-gray-400'>—</span>
											)}
										</td>

										<td className='px-4 py-3'>
											<div className='flex items-center gap-2'>
												<button
													type='button'
													onClick={() => startEdit(pin)}
													className='rounded border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
													title='Редактировать'
												>
													<Pencil size={15} />
												</button>

												<form action={deleteComponentPin}>
													<input
														type='hidden'
														name='id'
														value={pin.id.toString()}
													/>

													<input
														type='hidden'
														name='componentId'
														value={componentId.toString()}
													/>

													<button
														type='submit'
														className='rounded border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700'
														title='Удалить'
													>
														<Trash2 size={15} />
													</button>
												</form>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}

type PinFormProps = {
	componentId: bigint
	pinTypes: readonly string[]
	pin: Pin | null
	onClose: () => void
}

function PinForm({ componentId, pinTypes, pin, onClose }: PinFormProps) {
	const isEditing = pin !== null

	return (
		<div className='mb-6 rounded-lg border border-gray-200 bg-white'>
			<div className='flex items-center justify-between border-b border-gray-200 px-5 py-4'>
				<div>
					<h3 className='font-semibold text-gray-900'>
						{isEditing ? 'Редактирование вывода' : 'Новый вывод'}
					</h3>

					<p className='mt-1 text-xs text-gray-500'>
						Заполните информацию о физическом выводе компонента.
					</p>
				</div>

				<button
					type='button'
					onClick={onClose}
					className='rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700'
					title='Закрыть'
				>
					<X size={18} />
				</button>
			</div>

			<form
				action={isEditing ? updateComponentPin : createComponentPin}
				className='p-5'
			>
				<input
					type='hidden'
					name='componentId'
					value={componentId.toString()}
				/>

				{isEditing && (
					<input
						type='hidden'
						name='id'
						value={pin.id.toString()}
					/>
				)}

				<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
					<FormField
						label='Номер вывода'
						name='pinNumber'
						required
						defaultValue={pin?.pinNumber ?? ''}
						placeholder='Например: 1, A1, EP'
					/>

					<FormField
						label='Название вывода'
						name='pinName'
						required
						defaultValue={pin?.pinName ?? ''}
						placeholder='Например: GND'
					/>

					<div>
						<label
							htmlFor='pinType'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Тип вывода
							<span className='ml-1 text-red-500'>*</span>
						</label>

						<select
							id='pinType'
							name='pinType'
							required
							defaultValue={pin?.pinType ?? pinTypes[0] ?? ''}
							className='w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20'
						>
							{pinTypes.map(type => (
								<option
									key={type}
									value={type}
								>
									{getPinTypeLabel(type)}
								</option>
							))}
						</select>
					</div>

					<FormField
						label='Функция'
						name='function'
						defaultValue={pin?.function ?? ''}
						placeholder='Например: питание, вход сигнала'
					/>

					<FormField
						label='Активный уровень'
						name='activeLevel'
						defaultValue={pin?.activeLevel ?? ''}
						placeholder='Например: HIGH, LOW'
					/>

					<FormField
						label='Элемент'
						name='element'
						defaultValue={pin?.element ?? ''}
						placeholder='Например: A, B, OUT'
					/>

					<FormField
						label='Порядок'
						name='sortOrder'
						type='number'
						min='0'
						defaultValue={pin?.sortOrder ?? 0}
					/>

					<div className='flex items-end'>
						<label className='flex cursor-pointer items-center gap-2 pb-2'>
							<input
								type='checkbox'
								name='isExposedPad'
								value='true'
								defaultChecked={pin?.isExposedPad ?? false}
								className='h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent'
							/>

							<span className='text-sm text-gray-700'>
								Тепловая площадка (EP)
							</span>
						</label>
					</div>

					<div className='md:col-span-2'>
						<label
							htmlFor='description'
							className='mb-1.5 block text-sm font-medium text-gray-700'
						>
							Описание
						</label>

						<textarea
							id='description'
							name='description'
							rows={3}
							defaultValue={pin?.description ?? ''}
							placeholder='Дополнительное описание вывода'
							className='w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
						/>
					</div>
				</div>

				<div className='mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-5'>
					<button
						type='button'
						onClick={onClose}
						className='rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100'
					>
						Отмена
					</button>

					<button
						type='submit'
						className='rounded bg-accent px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md active:translate-y-0'
					>
						{isEditing ? 'Сохранить' : 'Добавить вывод'}
					</button>
				</div>
			</form>
		</div>
	)
}

type FormFieldProps = {
	label: string
	name: string
	defaultValue?: string | number
	placeholder?: string
	required?: boolean
	type?: 'text' | 'number'
	min?: string
}

function FormField({
	label,
	name,
	defaultValue = '',
	placeholder,
	required = false,
	type = 'text',
	min
}: FormFieldProps) {
	return (
		<div>
			<label
				htmlFor={name}
				className='mb-1.5 block text-sm font-medium text-gray-700'
			>
				{label}

				{required && <span className='ml-1 text-red-500'>*</span>}
			</label>

			<input
				id={name}
				name={name}
				type={type}
				min={min}
				required={required}
				defaultValue={defaultValue}
				placeholder={placeholder}
				className='w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
			/>
		</div>
	)
}
