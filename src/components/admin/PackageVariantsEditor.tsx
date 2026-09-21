'use client'

import { useState } from 'react'
import Link from 'next/link'

import {
	createPackageVariant,
	deletePackageVariant,
	updatePackageVariant
} from '@/actions/packageVariants'

type PackageVariant = {
	id: bigint
	name: string
	slug: string
	manufacturer: string | null
	pinCount: number | null
	pitchMm: string | null
	lengthMm: string | null
	widthMm: string | null
	heightMm: string | null
	bodyLengthMm: string | null
	bodyWidthMm: string | null
	leadLengthMm: string | null
	leadWidthMm: string | null
	thermalPad: boolean
	description: string | null
	isActive: boolean
	variantCode: string | null
	standardCode: string | null
	bodyShape: string | null
	pitchXMm: string | null
	pitchYMm: string | null
	terminalWidthMm: string | null
	terminalLengthMm: string | null
	exposedPadLengthMm: string | null
	exposedPadWidthMm: string | null
}

type Props = {
	packageId: number
	variants: PackageVariant[]
}

type FormState = {
	name: string
	slug: string
	manufacturer: string
	variantCode: string
	standardCode: string
	bodyShape: string

	pinCount: string

	pitchMm: string
	pitchXMm: string
	pitchYMm: string

	lengthMm: string
	widthMm: string
	heightMm: string

	bodyLengthMm: string
	bodyWidthMm: string

	leadLengthMm: string
	leadWidthMm: string

	terminalWidthMm: string
	terminalLengthMm: string

	exposedPadLengthMm: string
	exposedPadWidthMm: string

	description: string

	thermalPad: boolean
	isActive: boolean
}

const emptyForm: FormState = {
	name: '',
	slug: '',
	manufacturer: '',
	variantCode: '',
	standardCode: '',
	bodyShape: '',

	pinCount: '',

	pitchMm: '',
	pitchXMm: '',
	pitchYMm: '',

	lengthMm: '',
	widthMm: '',
	heightMm: '',

	bodyLengthMm: '',
	bodyWidthMm: '',

	leadLengthMm: '',
	leadWidthMm: '',

	terminalWidthMm: '',
	terminalLengthMm: '',

	exposedPadLengthMm: '',
	exposedPadWidthMm: '',

	description: '',

	thermalPad: false,
	isActive: true
}

function variantToForm(variant: PackageVariant): FormState {
	return {
		name: variant.name,
		slug: variant.slug,
		manufacturer: variant.manufacturer ?? '',
		variantCode: variant.variantCode ?? '',
		standardCode: variant.standardCode ?? '',
		bodyShape: variant.bodyShape ?? '',

		pinCount: variant.pinCount?.toString() ?? '',

		pitchMm: variant.pitchMm ?? '',
		pitchXMm: variant.pitchXMm ?? '',
		pitchYMm: variant.pitchYMm ?? '',

		lengthMm: variant.lengthMm ?? '',
		widthMm: variant.widthMm ?? '',
		heightMm: variant.heightMm ?? '',

		bodyLengthMm: variant.bodyLengthMm ?? '',
		bodyWidthMm: variant.bodyWidthMm ?? '',

		leadLengthMm: variant.leadLengthMm ?? '',
		leadWidthMm: variant.leadWidthMm ?? '',

		terminalWidthMm: variant.terminalWidthMm ?? '',
		terminalLengthMm: variant.terminalLengthMm ?? '',

		exposedPadLengthMm: variant.exposedPadLengthMm ?? '',
		exposedPadWidthMm: variant.exposedPadWidthMm ?? '',

		description: variant.description ?? '',

		thermalPad: variant.thermalPad,
		isActive: variant.isActive
	}
}

function generateSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-zа-яё0-9-]/gi, '')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export default function PackageVariantsEditor({ packageId, variants }: Props) {
	const [isCreating, setIsCreating] = useState(false)
	const [editingId, setEditingId] = useState<bigint | null>(null)

	const [form, setForm] = useState<FormState>(emptyForm)

	function updateField<K extends keyof FormState>(
		field: K,
		value: FormState[K]
	) {
		setForm(current => ({
			...current,
			[field]: value
		}))
	}

	function startCreate() {
		setEditingId(null)
		setForm(emptyForm)
		setIsCreating(true)
	}

	function startEdit(variant: PackageVariant) {
		setIsCreating(false)
		setEditingId(variant.id)
		setForm(variantToForm(variant))
	}

	function cancelForm() {
		setIsCreating(false)
		setEditingId(null)
		setForm(emptyForm)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='font-semibold text-gray-900'>Варианты корпуса</h2>

					<p className='mt-1 text-sm text-gray-500'>
						Конкретные исполнения корпуса
					</p>
				</div>

				{!isCreating && editingId === null && (
					<button
						type='button'
						onClick={startCreate}
						className='rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
					>
						+ Добавить вариант
					</button>
				)}
			</div>

			{(isCreating || editingId !== null) && (
				<form
					action={isCreating ? createPackageVariant : updatePackageVariant}
					className='rounded-lg border border-gray-200 bg-white p-6'
				>
					<input
						type='hidden'
						name='packageId'
						value={packageId}
					/>

					{editingId !== null && (
						<input
							type='hidden'
							name='id'
							value={editingId.toString()}
						/>
					)}

					<div className='mb-6 flex items-center justify-between'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900'>
								{isCreating
									? 'Новый вариант корпуса'
									: 'Редактирование варианта'}
							</h3>

							<p className='mt-1 text-sm text-gray-500'>
								Геометрия и физические характеристики конкретного исполнения.
							</p>
						</div>

						<button
							type='button'
							onClick={cancelForm}
							className='text-sm text-gray-500 hover:text-gray-900'
						>
							Отмена
						</button>
					</div>

					<div className='space-y-8'>
						<section>
							<h4 className='mb-4 text-sm font-semibold text-gray-900'>
								Идентификация
							</h4>

							<div className='grid gap-4 md:grid-cols-2'>
								<Field label='Название *'>
									<input
										name='name'
										value={form.name}
										onChange={event => {
											const value = event.target.value

											updateField('name', value)

											if (isCreating) {
												updateField('slug', generateSlug(value))
											}
										}}
										required
										className={inputClass}
										placeholder='SOIC-8'
									/>
								</Field>

								<Field label='Slug *'>
									<input
										name='slug'
										value={form.slug}
										onChange={event => updateField('slug', event.target.value)}
										required
										className={inputClass}
										placeholder='soic-8'
									/>
								</Field>

								<Field label='Код варианта'>
									<input
										name='variantCode'
										value={form.variantCode}
										onChange={event =>
											updateField('variantCode', event.target.value)
										}
										className={inputClass}
										placeholder='SOIC8'
									/>
								</Field>

								<Field label='Производитель корпуса'>
									<input
										name='manufacturer'
										value={form.manufacturer}
										onChange={event =>
											updateField('manufacturer', event.target.value)
										}
										className={inputClass}
										placeholder='JEDEC / package manufacturer'
									/>
								</Field>

								<Field label='Стандарт'>
									<input
										name='standardCode'
										value={form.standardCode}
										onChange={event =>
											updateField('standardCode', event.target.value)
										}
										className={inputClass}
										placeholder='JEDEC MO-...'
									/>
								</Field>

								<Field label='Форма корпуса'>
									<input
										name='bodyShape'
										value={form.bodyShape}
										onChange={event =>
											updateField('bodyShape', event.target.value)
										}
										className={inputClass}
										placeholder='rectangular'
									/>
								</Field>
							</div>
						</section>

						<section>
							<h4 className='mb-4 text-sm font-semibold text-gray-900'>
								Выводы и шаг
							</h4>

							<div className='grid gap-4 md:grid-cols-3'>
								<NumberField
									label='Количество выводов'
									name='pinCount'
									value={form.pinCount}
									onChange={value => updateField('pinCount', value)}
									step='1'
								/>

								<NumberField
									label='Pitch, мм'
									name='pitchMm'
									value={form.pitchMm}
									onChange={value => updateField('pitchMm', value)}
								/>

								<NumberField
									label='Pitch X, мм'
									name='pitchXMm'
									value={form.pitchXMm}
									onChange={value => updateField('pitchXMm', value)}
								/>

								<NumberField
									label='Pitch Y, мм'
									name='pitchYMm'
									value={form.pitchYMm}
									onChange={value => updateField('pitchYMm', value)}
								/>
							</div>
						</section>

						<section>
							<h4 className='mb-4 text-sm font-semibold text-gray-900'>
								Габариты корпуса
							</h4>

							<div className='grid gap-4 md:grid-cols-3'>
								<NumberField
									label='Длина, мм'
									name='lengthMm'
									value={form.lengthMm}
									onChange={value => updateField('lengthMm', value)}
								/>

								<NumberField
									label='Ширина, мм'
									name='widthMm'
									value={form.widthMm}
									onChange={value => updateField('widthMm', value)}
								/>

								<NumberField
									label='Высота, мм'
									name='heightMm'
									value={form.heightMm}
									onChange={value => updateField('heightMm', value)}
								/>

								<NumberField
									label='Длина корпуса, мм'
									name='bodyLengthMm'
									value={form.bodyLengthMm}
									onChange={value => updateField('bodyLengthMm', value)}
								/>

								<NumberField
									label='Ширина корпуса, мм'
									name='bodyWidthMm'
									value={form.bodyWidthMm}
									onChange={value => updateField('bodyWidthMm', value)}
								/>

								<NumberField
									label='Длина вывода, мм'
									name='leadLengthMm'
									value={form.leadLengthMm}
									onChange={value => updateField('leadLengthMm', value)}
								/>

								<NumberField
									label='Ширина вывода, мм'
									name='leadWidthMm'
									value={form.leadWidthMm}
									onChange={value => updateField('leadWidthMm', value)}
								/>

								<NumberField
									label='Ширина терминала, мм'
									name='terminalWidthMm'
									value={form.terminalWidthMm}
									onChange={value => updateField('terminalWidthMm', value)}
								/>

								<NumberField
									label='Длина терминала, мм'
									name='terminalLengthMm'
									value={form.terminalLengthMm}
									onChange={value => updateField('terminalLengthMm', value)}
								/>
							</div>
						</section>

						<section>
							<h4 className='mb-4 text-sm font-semibold text-gray-900'>
								Exposed Pad
							</h4>

							<div className='grid gap-4 md:grid-cols-2'>
								<NumberField
									label='Длина exposed pad, мм'
									name='exposedPadLengthMm'
									value={form.exposedPadLengthMm}
									onChange={value => updateField('exposedPadLengthMm', value)}
								/>

								<NumberField
									label='Ширина exposed pad, мм'
									name='exposedPadWidthMm'
									value={form.exposedPadWidthMm}
									onChange={value => updateField('exposedPadWidthMm', value)}
								/>
							</div>
						</section>

						<section>
							<h4 className='mb-4 text-sm font-semibold text-gray-900'>
								Дополнительно
							</h4>

							<div className='space-y-4'>
								<Field label='Описание'>
									<textarea
										name='description'
										value={form.description}
										onChange={event =>
											updateField('description', event.target.value)
										}
										rows={4}
										className={inputClass}
										placeholder='Описание конкретного исполнения корпуса...'
									/>
								</Field>

								<div className='flex flex-wrap gap-6'>
									<Checkbox
										name='thermalPad'
										checked={form.thermalPad}
										onChange={value => updateField('thermalPad', value)}
										label='Есть thermal pad'
									/>

									<Checkbox
										name='isActive'
										checked={form.isActive}
										onChange={value => updateField('isActive', value)}
										label='Активен'
									/>
								</div>
							</div>
						</section>
					</div>

					<div className='mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5'>
						<button
							type='button'
							onClick={cancelForm}
							className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
						>
							Отмена
						</button>

						<button
							type='submit'
							className='rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800'
						>
							{isCreating ? 'Создать вариант' : 'Сохранить изменения'}
						</button>
					</div>
				</form>
			)}

			<div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
				{variants.length === 0 ? (
					<div className='px-5 py-12 text-center'>
						<p className='text-sm text-gray-500'>Вариантов корпуса пока нет.</p>

						{!isCreating && editingId === null && (
							<button
								type='button'
								onClick={startCreate}
								className='mt-4 text-sm font-medium text-gray-900 underline underline-offset-4'
							>
								Добавить первый вариант
							</button>
						)}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-left'>
							<thead className='border-b border-gray-200 bg-gray-50'>
								<tr>
									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Название
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Выводы
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Pitch
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Размер
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Статус
									</th>

									<th className='px-5 py-3 text-xs font-semibold uppercase text-gray-500'>
										Действия
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-100'>
								{variants.map(variant => (
									<tr
										key={variant.id.toString()}
										className='hover:bg-gray-50'
									>
										<td className='px-5 py-4'>
											<div className='font-medium text-gray-900'>
												<Link
													href={`/admin/packages/${packageId}/variants/${variant.id.toString()}`}
													className='font-medium text-gray-900 hover:text-blue-600'
												>
													{variant.name}
												</Link>
											</div>

											<div className='mt-1 text-xs text-gray-400'>
												{variant.slug}
											</div>

											{variant.variantCode && (
												<div className='mt-1 text-xs text-gray-400'>
													Код: {variant.variantCode}
												</div>
											)}
										</td>

										<td className='px-5 py-4 text-sm text-gray-600'>
											{variant.pinCount ?? '—'}
										</td>

										<td className='px-5 py-4 text-sm text-gray-600'>
											{variant.pitchMm ? `${variant.pitchMm} mm` : '—'}
										</td>

										<td className='px-5 py-4 text-sm text-gray-600'>
											{variant.lengthMm && variant.widthMm
												? `${variant.lengthMm} × ${variant.widthMm} mm`
												: '—'}
										</td>

										<td className='px-5 py-4'>
											{variant.isActive ? (
												<span className='text-sm text-green-600'>Активен</span>
											) : (
												<span className='text-sm text-gray-400'>Неактивен</span>
											)}
										</td>

										{/** Столбец действия */}
										<td className='px-5 py-4'>
											<div className='flex items-center gap-3'>
												<Link
													href={`/admin/packages/${packageId}/variants/${variant.id.toString()}`}
													className='text-sm font-medium text-blue-600 hover:text-blue-700'
												>
													Открыть
												</Link>

												<button
													type='button'
													onClick={() => startEdit(variant)}
													className='text-sm font-medium text-gray-700 hover:text-gray-900'
												>
													Изменить
												</button>

												<form action={deletePackageVariant}>
													<input
														type='hidden'
														name='id'
														value={variant.id.toString()}
													/>

													<input
														type='hidden'
														name='packageId'
														value={packageId}
													/>

													<button
														type='submit'
														className='text-sm font-medium text-red-600 hover:text-red-700'
													>
														Удалить
													</button>
												</form>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

const inputClass =
	'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'

function Field({
	label,
	children
}: {
	label: string
	children: React.ReactNode
}) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-sm font-medium text-gray-700'>
				{label}
			</span>

			{children}
		</label>
	)
}

function NumberField({
	label,
	name,
	value,
	onChange,
	step = '0.001'
}: {
	label: string
	name: string
	value: string
	onChange: (value: string) => void
	step?: string
}) {
	return (
		<Field label={label}>
			<input
				type='number'
				name={name}
				value={value}
				onChange={event => onChange(event.target.value)}
				step={step}
				min='0'
				className={inputClass}
			/>
		</Field>
	)
}

function Checkbox({
	name,
	checked,
	onChange,
	label
}: {
	name: string
	checked: boolean
	onChange: (value: boolean) => void
	label: string
}) {
	return (
		<label className='flex items-center gap-2 text-sm text-gray-700'>
			<input
				type='checkbox'
				name={name}
				checked={checked}
				onChange={event => onChange(event.target.checked)}
				className='h-4 w-4 rounded border-gray-300'
			/>

			{label}
		</label>
	)
}
