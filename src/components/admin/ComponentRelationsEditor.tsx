import {
	createComponentRelation,
	updateComponentRelation,
	deleteComponentRelation
} from '@/actions/component-relations'

import { relationTypeLabels } from '@/lib/component-relation-types'
import type { RelationType } from '@/lib/component-relation-types'

type RelationItem = {
	id: string
	relatedComponentId: string
	relationType: string
	description: string | null
}

type AvailableComponent = {
	id: string
	designation: string
	name: string
}

type Props = {
	componentId: string
	relations: RelationItem[]
	availableComponents: AvailableComponent[]
	relationTypes: readonly RelationType[]
}

const fieldClass =
	'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900'

const labelClass = 'block text-sm font-medium text-gray-700'

export default function ComponentRelationsEditor({
	componentId,
	relations,
	availableComponents,
	relationTypes
}: Props) {
	return (
		<div className='space-y-8 p-6'>
			<section>
				<div className='mb-5'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Связи компонентов
					</h2>
					<p className='mt-1 text-sm text-gray-500'>
						Аналоги, заменители, совместимые компоненты и другие отношения.
					</p>
				</div>

				{relations.length === 0 ? (
					<div className='rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500'>
						Связи ещё не добавлены.
					</div>
				) : (
					<div className='space-y-5'>
						{relations.map(relation => (
							<div
								key={relation.id}
								className='rounded-xl border border-gray-200 p-5'
							>
								<form
									action={updateComponentRelation}
									className='space-y-4'
								>
									<input
										type='hidden'
										name='componentId'
										value={componentId}
									/>
									<input
										type='hidden'
										name='relationId'
										value={relation.id}
									/>

									<RelationFields
										relatedComponentId={relation.relatedComponentId}
										relationTypeValue={relation.relationType}
										description={relation.description}
										availableComponents={availableComponents}
										relationTypes={relationTypes}
									/>

									<div className='flex justify-end'>
										<button
											type='submit'
											className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
										>
											Сохранить связь
										</button>
									</div>
								</form>

								<form
									action={deleteComponentRelation}
									className='mt-3 flex justify-end border-t border-gray-100 pt-3'
								>
									<input
										type='hidden'
										name='componentId'
										value={componentId}
									/>
									<input
										type='hidden'
										name='relationId'
										value={relation.id}
									/>
									<button
										type='submit'
										className='rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50'
									>
										Удалить связь
									</button>
								</form>
							</div>
						))}
					</div>
				)}
			</section>

			<section className='border-t border-gray-200 pt-6'>
				<h2 className='mb-4 text-lg font-semibold text-gray-900'>
					Добавить связь
				</h2>

				{availableComponents.length === 0 ? (
					<p className='text-sm text-gray-500'>
						Нет доступных активных компонентов для связывания.
					</p>
				) : (
					<form
						action={createComponentRelation}
						className='space-y-4 rounded-xl border border-gray-200 p-5'
					>
						<input
							type='hidden'
							name='componentId'
							value={componentId}
						/>

						<RelationFields
							availableComponents={availableComponents}
							relationTypes={relationTypes}
						/>

						<div className='flex justify-end'>
							<button
								type='submit'
								className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
							>
								Добавить связь
							</button>
						</div>
					</form>
				)}
			</section>
		</div>
	)
}

function RelationFields({
	relatedComponentId,
	relationTypeValue,
	description,
	availableComponents,
	relationTypes
}: {
	relatedComponentId?: string
	relationTypeValue?: string
	description?: string | null
	availableComponents: AvailableComponent[]
	relationTypes: readonly RelationType[]
}) {
	return (
		<>
			<label className={labelClass}>
				Связанный компонент *
				<select
					required
					name='relatedComponentId'
					defaultValue={relatedComponentId ?? ''}
					className={fieldClass}
				>
					<option
						value=''
						disabled
					>
						Выберите компонент
					</option>
					{availableComponents.map(component => (
						<option
							key={component.id}
							value={component.id}
						>
							{component.designation} — {component.name}
						</option>
					))}
				</select>
			</label>

			<label className={labelClass}>
				Тип связи *
				<select
					required
					name='relationType'
					defaultValue={relationTypeValue ?? ''}
					className={fieldClass}
				>
					<option
						value=''
						disabled
					>
						Выберите тип связи
					</option>

					{relationTypes.map(type => (
						<option
							key={type}
							value={type}
						>
							{relationTypeLabels[type].label} — {relationTypeLabels[type].description}
						</option>
					))}
				</select>
				{relationTypeValue &&
					relationTypes.includes(relationTypeValue as RelationType) && (
						<p className='mt-1 text-xs font-normal text-gray-500'>
							{
								relationTypeLabels[relationTypeValue as RelationType]
									.description
							}
						</p>
					)}
			</label>

			<label className={labelClass}>
				Описание связи
				<textarea
					name='description'
					rows={3}
					defaultValue={description ?? ''}
					className={fieldClass}
					placeholder='Например, функциональный аналог с близкими параметрами'
				/>
			</label>
		</>
	)
}
