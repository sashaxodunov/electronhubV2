'use client'

import { useState } from 'react'
import {
	createComponentVariant,
	deleteComponentVariant
} from '@/actions/componentVariants'

type Variant = {
	id: number | bigint
	designation: string
	slug: string
	packageVariantId: number | bigint | null
	packageVariantName: string | null
	packageName: string | null
	marking: string | null
	process: string | null
	packing: string | null
	operatingTempMin: string | null
	operatingTempMax: string | null
	isPrimary: boolean
	isActive: boolean
}

type PackageVariantOption = {
	id: number | bigint
	name: string
	packageName: string
}

type ComponentVariantsEditorProps = {
	componentId: bigint
	variants: Variant[]
	packageVariants: PackageVariantOption[]
}

export default function ComponentVariantsEditor({
	componentId,
	variants,
	packageVariants
}: ComponentVariantsEditorProps) {
	const [showForm, setShowForm] = useState(false)

	return (
		<div className='p-6'>
			{/* Header */}
			<div className='mb-6 flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-lg font-semibold text-gray-900'>
						Варианты компонента
					</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Конкретные исполнения компонента
					</p>
				</div>

				<button
					type='button'
					onClick={() => setShowForm(value => !value)}
					className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					{showForm ? 'Закрыть' : '+ Добавить вариант'}
				</button>
			</div>

			{/* Add form */}
			{showForm && (
				<form
					action={async formData => {
						await createComponentVariant(formData)
					}}
					className='mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6'
				>
					<input
						type='hidden'
						name='componentId'
						value={componentId.toString()}
					/>

					<div className='mb-6'>
						<h3 className='text-base font-semibold text-gray-900'>
							Новый вариант
						</h3>

						<p className='mt-1 text-sm text-gray-500'>
							Например: LM358N, LM358P или LM358DR
						</p>
					</div>

					<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
						{/* Designation */}
						<FormField
							label='Обозначение'
							name='designation'
							placeholder='LM358N'
							required
						/>

						{/* Slug */}
						<FormField
							label='Slug'
							name='slug'
							placeholder='lm358n'
							required
						/>

						<div>
							<label
								htmlFor='packageVariantId'
								className='mb-2 block text-sm font-medium text-gray-700'
							>
								Корпус
							</label>

							<select
								id='packageVariantId'
								name='packageVariantId'
								defaultValue=''
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							>
								<option value=''>Без корпуса</option>

								{packageVariants.map(item => (
									<option
										key={item.id.toString()}
										value={item.id.toString()}
									>
										{item.name} — {item.packageName}
									</option>
								))}
							</select>

							<p className='mt-1.5 text-xs text-gray-400'>
								Конкретный вариант корпуса компонента
							</p>
						</div>

						{/* Marking */}
						<FormField
							label='Маркировка'
							name='marking'
							placeholder='LM358N'
						/>

						{/* Process */}
						<div>
							<label
								htmlFor='process'
								className='mb-2 block text-sm font-medium text-gray-700'
							>
								Процесс
							</label>

							<select
								id='process'
								name='process'
								defaultValue=''
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							>
								<option value=''>Не указан</option>

								<option value='SMD'>SMD</option>

								<option value='THT'>THT</option>
							</select>
						</div>

						{/* Packing */}
						<div>
							<label
								htmlFor='packing'
								className='mb-2 block text-sm font-medium text-gray-700'
							>
								Упаковка поставки
							</label>

							<select
								id='packing'
								name='packing'
								defaultValue=''
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							>
								<option value=''>Не указана</option>

								<option value='Tube'>Tube</option>

								<option value='Tape & Reel'>Tape & Reel</option>

								<option value='Bulk'>Bulk</option>

								<option value='Tray'>Tray</option>
							</select>
						</div>

						{/* Temperature */}
						<div className='md:col-span-2'>
							<label className='mb-2 block text-sm font-medium text-gray-700'>
								Рабочая температура, °C
							</label>

							<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
								<input
									name='operatingTempMin'
									type='number'
									step='0.001'
									placeholder='от −40'
									className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
								/>

								<input
									name='operatingTempMax'
									type='number'
									step='0.001'
									placeholder='до +125'
									className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
								/>
							</div>
						</div>

						{/* Description */}
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
								rows={4}
								placeholder='Описание конкретного исполнения...'
								className='w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							/>
						</div>

						{/* Flags */}
						<div className='space-y-3 md:col-span-2'>
							<label className='flex items-center gap-3'>
								<input
									type='checkbox'
									name='isPrimary'
									value='true'
									className='h-4 w-4 rounded border-gray-300'
								/>

								<span className='text-sm text-gray-700'>Основной вариант</span>
							</label>

							<label className='flex items-center gap-3'>
								<input
									type='checkbox'
									name='isActive'
									value='true'
									defaultChecked
									className='h-4 w-4 rounded border-gray-300'
								/>

								<span className='text-sm text-gray-700'>Вариант активен</span>
							</label>
						</div>
					</div>

					{/* Actions */}
					<div className='mt-6 flex justify-end gap-3'>
						<button
							type='button'
							onClick={() => setShowForm(false)}
							className='rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white'
						>
							Отмена
						</button>

						<button
							type='submit'
							className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
						>
							Создать вариант
						</button>
					</div>
				</form>
			)}

			{/* Variants table */}
			{variants.length === 0 ? (
				<div className='rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center'>
					<p className='text-sm font-medium text-gray-900'>
						Вариантов пока нет
					</p>

					<p className='mt-1 text-sm text-gray-500'>
						Добавьте первое конкретное исполнение компонента.
					</p>
				</div>
			) : (
				<div className='overflow-hidden rounded-xl border border-gray-200'>
					<div className='overflow-x-auto'>
						<table className='w-full text-left text-sm'>
							<thead className='border-b border-gray-200 bg-gray-50'>
								<tr>
									<th className='px-5 py-3 font-medium text-gray-500'>
										Обозначение
									</th>

									<th className='px-5 py-3 font-medium text-gray-500'>
										Маркировка
									</th>

									<th className='px-5 py-3 font-medium text-gray-500'>
										Процесс
									</th>

									<th className='px-5 py-3 font-medium text-gray-500'>
										Корпус
									</th>

									<th className='px-5 py-3 font-medium text-gray-500'>
										Температура
									</th>

									<th className='px-5 py-3 font-medium text-gray-500'>
										Статус
									</th>

									<th className='px-5 py-3 text-right font-medium text-gray-500'>
										Действия
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-100 bg-white'>
								{variants.map(variant => {
									const temperature =
										variant.operatingTempMin !== null ||
										variant.operatingTempMax !== null
											? `${variant.operatingTempMin ?? '—'} … ${
													variant.operatingTempMax ?? '—'
												} °C`
											: '—'

									return (
										<tr
											key={variant.id.toString()}
											className='hover:bg-gray-50'
										>
											{/* Designation */}
											<td className='px-5 py-4'>
												<div className='flex items-center gap-2'>
													<span className='font-medium text-gray-900'>
														{variant.designation}
													</span>

													{variant.isPrimary && (
														<span className='rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700'>
															Основной
														</span>
													)}
												</div>

												<p className='mt-1 text-xs text-gray-400'>
													{variant.slug}
												</p>
											</td>

											{/* Marking */}
											<td className='px-5 py-4 text-gray-600'>
												{variant.marking || '—'}
											</td>

											{/* Process */}
											<td className='px-5 py-4 text-gray-600'>
												{variant.process || '—'}
											</td>

											{/* Корпус */}
											<td className='px-5 py-4 text-gray-600'>
												{variant.packageVariantName || '—'}
											</td>

											{/* Temperature */}
											<td className='px-5 py-4 whitespace-nowrap text-gray-600'>
												{temperature}
											</td>

											{/* Status */}
											<td className='px-5 py-4'>
												<span
													className={`rounded-full px-2.5 py-1 text-xs font-medium ${
														variant.isActive
															? 'bg-green-50 text-green-700'
															: 'bg-gray-100 text-gray-500'
													}`}
												>
													{variant.isActive ? 'Активен' : 'Неактивен'}
												</span>
											</td>

											{/* Actions */}
											<td className='px-5 py-4 text-right'>
												<form
													action={deleteComponentVariant}
													className='inline'
												>
													<input
														type='hidden'
														name='id'
														value={variant.id.toString()}
													/>

													<input
														type='hidden'
														name='componentId'
														value={componentId.toString()}
													/>

													<button
														type='submit'
														aria-label={`Удалить вариант ${variant.designation}`}
														className='text-sm text-red-600 transition hover:text-red-800'
													>
														Удалить
													</button>
												</form>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}

function FormField({
	label,
	name,
	placeholder,
	required = false
}: {
	label: string
	name: string
	placeholder?: string
	required?: boolean
}) {
	return (
		<div>
			<label
				htmlFor={name}
				className='mb-2 block text-sm font-medium text-gray-700'
			>
				{label}
			</label>

			<input
				id={name}
				name={name}
				type='text'
				required={required}
				placeholder={placeholder}
				className='w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
			/>
		</div>
	)
}
