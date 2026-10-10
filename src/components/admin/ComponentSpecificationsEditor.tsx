'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'

import {
	createComponentSpecification,
	updateComponentSpecification,
	deleteComponentSpecification
} from '@/actions/componentSpecifications'

type Specification = {
	id: bigint
	name: string
	symbol: string | null
	valueMin: string | null
	valueTyp: string | null
	valueMax: string | null
	unit: string | null
	conditionText: string | null
	description: string | null
	sortOrder: number
}

type Props = {
	componentId: bigint
	specifications: Specification[]
}

export default function ComponentSpecificationsEditor({
	componentId,
	specifications
}: Props) {
	const [editing, setEditing] = useState<Specification | null>(null)
	const [isCreating, setIsCreating] = useState(false)

	const closeForm = () => {
		setEditing(null)
		setIsCreating(false)
	}

	return (
		<div className='p-6 space-y-6'>
			{/* Заголовок */}
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-2xl font-semibold text-white'>Характеристики</h2>

					<p className='mt-1 text-sm text-gray-400'>
						Электрические, механические и эксплуатационные характеристики
						компонента
					</p>
				</div>

				{!isCreating && !editing && (
					<button
						type='button'
						onClick={() => setIsCreating(true)}
						className='
              inline-flex items-center gap-2
              rounded-lg
              bg-accent
              px-4 py-2
              text-sm font-medium
              text-[#1f2a32]
              transition
              hover:-translate-y-0.5
            '
					>
						<Plus size={18} />
						Добавить характеристику
					</button>
				)}
			</div>

			{/* Форма */}
			{(isCreating || editing) && (
				<SpecificationForm
					componentId={componentId}
					specification={editing}
					onCancel={closeForm}
				/>
			)}

			{/* Таблица */}
			{specifications.length === 0 ? (
				<div
					className='
            rounded-xl
            border border-border
            bg-background-dark
            p-8
            text-center
            text-gray-400
          '
				>
					Характеристики ещё не добавлены.
				</div>
			) : (
				<div
					className='
            overflow-x-auto
            rounded-xl
            border border-border
            bg-background-dark
          '
				>
					<table className='w-full min-w-275 text-sm'>
						<thead>
							<tr className='border-b border-border text-left text-gray-400'>
								<th className='px-4 py-3 font-medium'>Название</th>

								<th className='px-4 py-3 font-medium'>Символ</th>

								<th className='px-4 py-3 font-medium'>Мин.</th>

								<th className='px-4 py-3 font-medium'>Тип.</th>

								<th className='px-4 py-3 font-medium'>Макс.</th>

								<th className='px-4 py-3 font-medium'>Ед.</th>

								<th className='px-4 py-3 font-medium'>Условия</th>

								<th className='px-4 py-3 font-medium text-right'>Действия</th>
							</tr>
						</thead>

						<tbody>
							{specifications.map(specification => (
								<tr
									key={specification.id.toString()}
									className='
                    border-b
                    border-border
                    last:border-b-0
                    hover:bg-[#1f2a32]
                  '
								>
									<td className='px-4 py-3'>
										<div className='font-medium text-white'>
											{specification.name}
										</div>

										{specification.description && (
											<div className='mt-1 max-w-75 text-xs text-gray-500'>
												{specification.description}
											</div>
										)}
									</td>

									<td className='px-4 py-3 text-accent'>
										{specification.symbol || '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{specification.valueMin ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{specification.valueTyp ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{specification.valueMax ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{specification.unit || '—'}
									</td>

									<td className='px-4 py-3 text-gray-400'>
										<div className='max-w-52.5'>
											{specification.conditionText || '—'}
										</div>
									</td>

									<td className='px-4 py-3'>
										<div className='flex justify-end gap-2'>
											<button
												type='button'
												onClick={() => setEditing(specification)}
												title='Редактировать'
												className='
                          rounded-lg
                          border border-border
                          p-2
                          text-gray-300
                          transition
                          hover:border-accent
                          hover:text-accent
                        '
											>
												<Pencil size={16} />
											</button>

											<form
												action={deleteComponentSpecification}
												onSubmit={event => {
													if (
														!window.confirm(
															`Удалить характеристику «${specification.name}»?`
														)
													) {
														event.preventDefault()
													}
												}}
											>
												<input
													type='hidden'
													name='id'
													value={specification.id.toString()}
												/>

												<input
													type='hidden'
													name='componentId'
													value={componentId.toString()}
												/>

												<button
													type='submit'
													title='Удалить'
													className='
                            rounded-lg
                            border border-border
                            p-2
                            text-gray-300
                            transition
                            hover:border-red-500
                            hover:text-red-400
                          '
												>
													<Trash2 size={16} />
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
	)
}

function SpecificationForm({
	componentId,
	specification,
	onCancel
}: {
	componentId: bigint
	specification: Specification | null
	onCancel: () => void
}) {
	const isEdit = specification !== null

	return (
		<div
			className='
        rounded-xl
        border border-border
        bg-background-dark
        p-6
      '
		>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h3 className='text-xl font-semibold text-white'>
						{isEdit ? 'Редактирование характеристики' : 'Новая характеристика'}
					</h3>

					<p className='mt-1 text-sm text-gray-400'>
						Значения можно указывать частично — минимум, типичное и максимум
						являются необязательными.
					</p>
				</div>

				<button
					type='button'
					onClick={onCancel}
					className='
            rounded-lg
            p-2
            text-gray-400
            transition
            hover:bg-background-light
            hover:text-white
          '
					title='Закрыть'
				>
					<X size={20} />
				</button>
			</div>

			<form
				action={
					isEdit ? updateComponentSpecification : createComponentSpecification
				}
				className='space-y-6'
			>
				<input
					type='hidden'
					name='componentId'
					value={componentId.toString()}
				/>

				{isEdit && (
					<input
						type='hidden'
						name='id'
						value={specification.id.toString()}
					/>
				)}

				{/* Основные данные */}
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<div className='md:col-span-2'>
						<label
							htmlFor='spec-name'
							className='mb-2 block text-sm font-medium text-gray-300'
						>
							Название характеристики *
						</label>

						<input
							id='spec-name'
							name='name'
							required
							defaultValue={specification?.name ?? ''}
							placeholder='Например: Напряжение питания'
							className='admin-input'
						/>
					</div>

					<div>
						<label
							htmlFor='spec-symbol'
							className='mb-2 block text-sm font-medium text-gray-300'
						>
							Символ
						</label>

						<input
							id='spec-symbol'
							name='symbol'
							defaultValue={specification?.symbol ?? ''}
							placeholder='Например: VCC'
							className='admin-input'
						/>
					</div>

					<div>
						<label
							htmlFor='spec-unit'
							className='mb-2 block text-sm font-medium text-gray-300'
						>
							Единица измерения
						</label>

						<input
							id='spec-unit'
							name='unit'
							defaultValue={specification?.unit ?? ''}
							placeholder='Например: В'
							className='admin-input'
						/>
					</div>
				</div>

				{/* Значения */}
				<div>
					<h4 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400'>
						Значения
					</h4>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
						<div>
							<label
								htmlFor='spec-value-min'
								className='mb-2 block text-sm font-medium text-gray-300'
							>
								Минимальное
							</label>

							<input
								id='spec-value-min'
								name='valueMin'
								type='text'
								inputMode='decimal'
								defaultValue={specification?.valueMin ?? ''}
								placeholder='Например: 4.5'
								className='admin-input'
							/>
						</div>

						<div>
							<label
								htmlFor='spec-value-typ'
								className='mb-2 block text-sm font-medium text-gray-300'
							>
								Типичное
							</label>

							<input
								id='spec-value-typ'
								name='valueTyp'
								type='text'
								inputMode='decimal'
								defaultValue={specification?.valueTyp ?? ''}
								placeholder='Например: 5'
								className='admin-input'
							/>
						</div>

						<div>
							<label
								htmlFor='spec-value-max'
								className='mb-2 block text-sm font-medium text-gray-300'
							>
								Максимальное
							</label>

							<input
								id='spec-value-max'
								name='valueMax'
								type='text'
								inputMode='decimal'
								defaultValue={specification?.valueMax ?? ''}
								placeholder='Например: 5.5'
								className='admin-input'
							/>
						</div>
					</div>
				</div>

				{/* Условия */}
				<div>
					<label
						htmlFor='spec-condition'
						className='mb-2 block text-sm font-medium text-gray-300'
					>
						Условия измерения / применения
					</label>

					<textarea
						id='spec-condition'
						name='conditionText'
						rows={3}
						defaultValue={specification?.conditionText ?? ''}
						placeholder='Например: VCC = 5 В, TA = 25 °C'
						className='admin-input resize-y'
					/>
				</div>

				{/* Описание */}
				<div>
					<label
						htmlFor='spec-description'
						className='mb-2 block text-sm font-medium text-gray-300'
					>
						Описание
					</label>

					<textarea
						id='spec-description'
						name='description'
						rows={4}
						defaultValue={specification?.description ?? ''}
						placeholder='Дополнительное описание характеристики'
						className='admin-input resize-y'
					/>
				</div>

				{/* Порядок */}
				<div className='max-w-50'>
					<label
						htmlFor='spec-sort-order'
						className='mb-2 block text-sm font-medium text-gray-300'
					>
						Порядок
					</label>

					<input
						id='spec-sort-order'
						name='sortOrder'
						type='number'
						min='0'
						step='1'
						defaultValue={specification?.sortOrder ?? 0}
						className='admin-input'
					/>
				</div>

				{/* Кнопки */}
				<div className='flex items-center gap-3 border-t border-border pt-5'>
					<button
						type='submit'
						className='
              rounded-lg
              bg-accent
              px-5 py-2.5
              text-sm font-medium
              text-[#1f2a32]
              transition
              hover:-translate-y-0.5
            '
					>
						{isEdit ? 'Сохранить изменения' : 'Добавить характеристику'}
					</button>

					<button
						type='button'
						onClick={onCancel}
						className='
              rounded-lg
              border border-border
              px-5 py-2.5
              text-sm font-medium
              text-gray-300
              transition
              hover:bg-background-light
              hover:text-white
            '
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	)
}
