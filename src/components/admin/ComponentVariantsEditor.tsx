'use client'

import { useState } from 'react'

import {
	createComponentVariant,
	deleteComponentVariant,
	updateComponentVariant
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
	description?: string | null
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

function generateSlug(value: string): string {
	const transliteration: Record<string, string> = {
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		ё: 'yo',
		ж: 'zh',
		з: 'z',
		и: 'i',
		й: 'y',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'kh',
		ц: 'ts',
		ч: 'ch',
		ш: 'sh',
		щ: 'shch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya'
	}

	return value
		.toLowerCase()
		.split('')
		.map(char => transliteration[char] ?? char)
		.join('')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export default function ComponentVariantsEditor({
	componentId,
	variants,
	packageVariants
}: ComponentVariantsEditorProps) {
	const [showForm, setShowForm] = useState(false)
	const [editingVariant, setEditingVariant] = useState<Variant | null>(null)

	const [designation, setDesignation] = useState('')
	const [slug, setSlug] = useState('')
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

	function resetForm() {
		setDesignation('')
		setSlug('')
		setSlugManuallyEdited(false)
		setEditingVariant(null)
		setShowForm(false)
	}

	function startCreate() {
		setEditingVariant(null)
		setDesignation('')
		setSlug('')
		setSlugManuallyEdited(false)
		setShowForm(true)
	}

	function startEdit(variant: Variant) {
		setEditingVariant(variant)
		setDesignation(variant.designation)
		setSlug(variant.slug)
		setSlugManuallyEdited(true)
		setShowForm(true)
	}

	function handleDesignationChange(value: string) {
		setDesignation(value)

		if (!slugManuallyEdited) {
			setSlug(generateSlug(value))
		}
	}

	function handleSlugChange(value: string) {
		setSlugManuallyEdited(true)
		setSlug(generateSlug(value))
	}

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
					onClick={() => {
						if (showForm) {
							resetForm()
						} else {
							startCreate()
						}
					}}
					className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
				>
					{showForm ? 'Закрыть' : '+ Добавить вариант'}
				</button>
			</div>

			{/* Form */}
			{showForm && (
				<form
					action={
						editingVariant ? updateComponentVariant : createComponentVariant
					}
					onSubmit={() => {
						setShowForm(false)
					}}
					className='mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-900'
				>
					<input
						type='hidden'
						name='componentId'
						value={componentId.toString()}
					/>

					{editingVariant && (
						<input
							type='hidden'
							name='id'
							value={editingVariant.id.toString()}
						/>
					)}

					<div className='mb-6'>
						<h3 className='text-base font-semibold text-gray-900'>
							{editingVariant ? 'Редактирование варианта' : 'Новый вариант'}
						</h3>

						<p className='mt-1 text-sm text-gray-500'>
							{editingVariant
								? 'Измените параметры конкретного исполнения компонента.'
								: 'Например: LM358N, LM358P или LM358DR'}
						</p>
					</div>

					<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
						{/* Designation */}
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
								value={designation}
								onChange={event => handleDesignationChange(event.target.value)}
								placeholder='LM358N'
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
								value={slug}
								onChange={event => handleSlugChange(event.target.value)}
								placeholder='lm358n'
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							/>

							<p className='mt-1.5 text-xs text-gray-400'>
								Заполняется автоматически из обозначения
							</p>
						</div>

						{/* Package */}
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
								defaultValue={
									editingVariant?.packageVariantId?.toString() ?? ''
								}
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
							defaultValue={editingVariant?.marking ?? ''}
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
								defaultValue={editingVariant?.process ?? ''}
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
								defaultValue={editingVariant?.packing ?? ''}
								className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							>
								<option value=''>Не указана</option>
								<option value='Tube'>Tube</option>
								<option value='Tape & Reel'>Tape & Reel</option>
								<option value='Bulk'>Bulk</option>
								<option value='Tray'>Tray</option>
								<option value='1000 Units/Bag'>1000 Units/Bag</option>
								<option value='3000 Units/Box'>3000 Units/Box</option>
								<option value='5000/Tape & Reel'>5000/Tape & Reel</option>
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
									defaultValue={editingVariant?.operatingTempMin ?? ''}
									placeholder='от −40'
									className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
								/>

								<input
									name='operatingTempMax'
									type='number'
									step='0.001'
									defaultValue={editingVariant?.operatingTempMax ?? ''}
									placeholder='до +125'
									className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
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
								defaultValue={editingVariant?.description ?? ''}
								placeholder='Описание конкретного исполнения...'
								className='w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
							/>
						</div>

						{/* Flags */}
						<div className='space-y-3 md:col-span-2'>
							<label className='flex items-center gap-3'>
								<input
									type='checkbox'
									name='isPrimary'
									value='true'
									defaultChecked={editingVariant?.isPrimary ?? false}
									className='h-4 w-4 rounded border-gray-300'
								/>

								<span className='text-sm text-gray-700'>Основной вариант</span>
							</label>

							<label className='flex items-center gap-3'>
								<input
									type='checkbox'
									name='isActive'
									value='true'
									defaultChecked={editingVariant?.isActive ?? true}
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
							onClick={resetForm}
							className='rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white'
						>
							Отмена
						</button>

						<button
							type='submit'
							className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800'
						>
							{editingVariant ? 'Сохранить изменения' : 'Создать вариант'}
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

											<td className='px-5 py-4 text-gray-600'>
												{variant.marking || '—'}
											</td>

											<td className='px-5 py-4 text-gray-600'>
												{variant.process || '—'}
											</td>

											<td className='px-5 py-4 text-gray-600'>
												{variant.packageVariantName || '—'}
											</td>

											<td className='whitespace-nowrap px-5 py-4 text-gray-600'>
												{temperature}
											</td>

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

											<td className='px-5 py-4 text-right'>
												<div className='flex justify-end gap-3'>
													<button
														type='button'
														onClick={() => startEdit(variant)}
														className='rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/30'
													>
														Редактировать
													</button>

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
															className='rounded border border-red-300 bg-white px-3 py-1.5 text-sm text-red-600 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300'
														>
															Удалить
														</button>
													</form>
												</div>
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
	required = false,
	defaultValue = ''
}: {
	label: string
	name: string
	placeholder?: string
	required?: boolean
	defaultValue?: string
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
				defaultValue={defaultValue}
				placeholder={placeholder}
				className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
			/>
		</div>
	)
}
