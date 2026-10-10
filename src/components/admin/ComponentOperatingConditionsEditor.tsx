'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'

import {
	createComponentOperatingCondition,
	updateComponentOperatingCondition,
	deleteComponentOperatingCondition
} from '@/actions/componentOperatingConditions'

type OperatingCondition = {
	id: bigint
	name: string
	symbol: string | null
	valueMin: string | null
	valueTyp: string | null
	valueMax: string | null
	unit: string | null
	conditionText: string | null
	sortOrder: number
}

type Props = {
	componentId: bigint
	conditions: OperatingCondition[]
}

export default function ComponentOperatingConditionsEditor({
	componentId,
	conditions
}: Props) {
	const [editing, setEditing] = useState<OperatingCondition | null>(null)

	const [isCreating, setIsCreating] = useState(false)

	const closeForm = () => {
		setEditing(null)
		setIsCreating(false)
	}

	return (
		<div className='space-y-6 p-6'>
			{/* Заголовок */}
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h2 className='text-2xl font-semibold text-white'>
						Рекомендованные условия
					</h2>

					<p className='mt-1 text-sm text-gray-400'>
						Рабочие условия и рекомендуемые диапазоны параметров компонента
					</p>
				</div>

				{!isCreating && !editing && (
					<button
						type='button'
						onClick={() => setIsCreating(true)}
						className='
              inline-flex items-center gap-2
              rounded-lg
              bg-[#ffd479]
              px-4 py-2
              text-sm font-medium
              text-[#1f2a32]
              transition
              hover:-translate-y-0.5
            '
					>
						<Plus size={18} />
						Добавить условие
					</button>
				)}
			</div>

			{/* Форма */}
			{(isCreating || editing) && (
				<OperatingConditionForm
					componentId={componentId}
					condition={editing}
					onCancel={closeForm}
				/>
			)}

			{/* Список */}
			{conditions.length === 0 ? (
				<div
					className='
            rounded-xl
            border border-[#3b4a54]
            bg-[#182127]
            p-8
            text-center
            text-gray-400
          '
				>
					Рекомендованные условия ещё не добавлены.
				</div>
			) : (
				<div
					className='
            overflow-x-auto
            rounded-xl
            border border-[#3b4a54]
            bg-[#182127]
          '
				>
					<table className='w-full min-w-[1050px] text-sm'>
						<thead>
							<tr
								className='
                  border-b
                  border-[#3b4a54]
                  text-left
                  text-gray-400
                '
							>
								<th className='px-4 py-3 font-medium'>Параметр</th>

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
							{conditions.map(condition => (
								<tr
									key={condition.id.toString()}
									className='
                    border-b
                    border-[#3b4a54]
                    last:border-b-0
                    hover:bg-[#1f2a32]
                  '
								>
									<td className='px-4 py-3'>
										<div className='font-medium text-white'>
											{condition.name}
										</div>
									</td>

									<td className='px-4 py-3 text-[#ffd479]'>
										{condition.symbol || '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{condition.valueMin ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{condition.valueTyp ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{condition.valueMax ?? '—'}
									</td>

									<td className='px-4 py-3 text-gray-300'>
										{condition.unit || '—'}
									</td>

									<td className='px-4 py-3 text-gray-400'>
										<div className='max-w-[280px]'>
											{condition.conditionText || '—'}
										</div>
									</td>

									<td className='px-4 py-3'>
										<div className='flex justify-end gap-2'>
											{/* Редактирование */}
											<button
												type='button'
												onClick={() => setEditing(condition)}
												title='Редактировать'
												className='
                          rounded-lg
                          border border-[#3b4a54]
                          p-2
                          text-gray-300
                          transition
                          hover:border-[#ffd479]
                          hover:text-[#ffd479]
                        '
											>
												<Pencil size={16} />
											</button>

											{/* Удаление */}
											<form
												action={deleteComponentOperatingCondition}
												onSubmit={event => {
													if (
														!window.confirm(
															`Удалить условие «${condition.name}»?`
														)
													) {
														event.preventDefault()
													}
												}}
											>
												<input
													type='hidden'
													name='id'
													value={condition.id.toString()}
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
                            border border-[#3b4a54]
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

function OperatingConditionForm({
	componentId,
	condition,
	onCancel
}: {
	componentId: bigint
	condition: OperatingCondition | null
	onCancel: () => void
}) {
	const isEdit = condition !== null

	return (
		<div
			className='
        rounded-xl
        border border-[#3b4a54]
        bg-[#182127]
        p-6
      '
		>
			<div className='mb-6 flex items-center justify-between'>
				<div>
					<h3 className='text-xl font-semibold text-white'>
						{isEdit
							? 'Редактирование условия'
							: 'Новое рекомендованное условие'}
					</h3>

					<p className='mt-1 text-sm text-gray-400'>
						Укажите рекомендуемый диапазон рабочего параметра компонента.
					</p>
				</div>

				<button
					type='button'
					onClick={onCancel}
					title='Закрыть'
					className='
            rounded-lg
            p-2
            text-gray-400
            transition
            hover:bg-[#263640]
            hover:text-white
          '
				>
					<X size={20} />
				</button>
			</div>

			<form
				action={
					isEdit
						? updateComponentOperatingCondition
						: createComponentOperatingCondition
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
						value={condition.id.toString()}
					/>
				)}

				{/* Название и символ */}
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<div>
						<label
							htmlFor='condition-name'
							className='
                mb-2 block
                text-sm font-medium
                text-gray-300
              '
						>
							Название параметра *
						</label>

						<input
							id='condition-name'
							name='name'
							required
							defaultValue={condition?.name ?? ''}
							placeholder='Например: Напряжение питания'
							className='admin-input'
						/>
					</div>

					<div>
						<label
							htmlFor='condition-symbol'
							className='
                mb-2 block
                text-sm font-medium
                text-gray-300
              '
						>
							Символ
						</label>

						<input
							id='condition-symbol'
							name='symbol'
							defaultValue={condition?.symbol ?? ''}
							placeholder='Например: VCC'
							className='admin-input'
						/>
					</div>
				</div>

				{/* Значения */}
				<div>
					<h4
						className='
              mb-3
              text-sm font-semibold
              uppercase tracking-wide
              text-gray-400
            '
					>
						Рекомендуемый диапазон
					</h4>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
						<div>
							<label
								htmlFor='condition-value-min'
								className='
                  mb-2 block
                  text-sm font-medium
                  text-gray-300
                '
							>
								Минимальное
							</label>

							<input
								id='condition-value-min'
								name='valueMin'
								type='text'
								inputMode='decimal'
								defaultValue={condition?.valueMin ?? ''}
								placeholder='Например: 3'
								className='admin-input'
							/>
						</div>

						<div>
							<label
								htmlFor='condition-value-typ'
								className='
                  mb-2 block
                  text-sm font-medium
                  text-gray-300
                '
							>
								Типичное
							</label>

							<input
								id='condition-value-typ'
								name='valueTyp'
								type='text'
								inputMode='decimal'
								defaultValue={condition?.valueTyp ?? ''}
								placeholder='Например: 5'
								className='admin-input'
							/>
						</div>

						<div>
							<label
								htmlFor='condition-value-max'
								className='
                  mb-2 block
                  text-sm font-medium
                  text-gray-300
                '
							>
								Максимальное
							</label>

							<input
								id='condition-value-max'
								name='valueMax'
								type='text'
								inputMode='decimal'
								defaultValue={condition?.valueMax ?? ''}
								placeholder='Например: 32'
								className='admin-input'
							/>
						</div>
					</div>
				</div>

				{/* Единица */}
				<div className='max-w-[300px]'>
					<label
						htmlFor='condition-unit'
						className='
              mb-2 block
              text-sm font-medium
              text-gray-300
            '
					>
						Единица измерения
					</label>

					<input
						id='condition-unit'
						name='unit'
						defaultValue={condition?.unit ?? ''}
						placeholder='Например: В, °C, мА, МГц'
						className='admin-input'
					/>
				</div>

				{/* Дополнительные условия */}
				<div>
					<label
						htmlFor='condition-text'
						className='
              mb-2 block
              text-sm font-medium
              text-gray-300
            '
					>
						Дополнительные условия
					</label>

					<textarea
						id='condition-text'
						name='conditionText'
						rows={4}
						defaultValue={condition?.conditionText ?? ''}
						placeholder='Например: VCC = 5 В, TA = 25 °C'
						className='admin-input resize-y'
					/>
				</div>

				{/* Порядок */}
				<div className='max-w-[200px]'>
					<label
						htmlFor='condition-sort-order'
						className='
              mb-2 block
              text-sm font-medium
              text-gray-300
            '
					>
						Порядок
					</label>

					<input
						id='condition-sort-order'
						name='sortOrder'
						type='number'
						min='0'
						step='1'
						defaultValue={condition?.sortOrder ?? 0}
						className='admin-input'
					/>
				</div>

				{/* Кнопки */}
				<div
					className='
            flex items-center gap-3
            border-t border-[#3b4a54]
            pt-5
          '
				>
					<button
						type='submit'
						className='
              rounded-lg
              bg-[#ffd479]
              px-5 py-2.5
              text-sm font-medium
              text-[#1f2a32]
              transition
              hover:-translate-y-0.5
            '
					>
						{isEdit ? 'Сохранить изменения' : 'Добавить условие'}
					</button>

					<button
						type='button'
						onClick={onCancel}
						className='
              rounded-lg
              border border-[#3b4a54]
              px-5 py-2.5
              text-sm font-medium
              text-gray-300
              transition
              hover:bg-[#263640]
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
