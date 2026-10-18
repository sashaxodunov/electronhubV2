import {
	createComponentGraph,
	updateComponentGraph,
	deleteComponentGraph
} from '@/actions/component-graphs'

type GraphItem = {
	id: string
	title: string
	xAxisName: string | null
	xAxisUnit: string | null
	yAxisName: string | null
	yAxisUnit: string | null
	conditions: string | null
	sourcePage: number | null
	description: string | null
	imageAssetId: string | null
}

type GraphAsset = {
	id: string
	title: string | null
	fileName: string | null
	filePath: string
}

type Props = {
	componentId: string
	graphs: GraphItem[]
	assets: GraphAsset[]
}

export default function ComponentGraphsEditor({
	componentId,
	graphs,
	assets
}: Props) {
	return (
		<div className='space-y-8 p-6'>
			<section>
				<div className='mb-5'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Графики характеристик
					</h2>
					<p className='mt-1 text-sm text-gray-500'>
						Сохраняйте графики из документации компонента, оси координат,
						условия измерения и номер страницы источника.
					</p>
				</div>

				{graphs.length === 0 ? (
					<div className='rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-500'>
						Графики ещё не добавлены.
					</div>
				) : (
					<div className='space-y-6'>
						{graphs.map(graph => (
							<form
								key={graph.id}
								action={updateComponentGraph}
								className='space-y-5 rounded-xl border border-gray-200 p-5'
							>
								<input
									type='hidden'
									name='componentId'
									value={componentId}
								/>
								<input
									type='hidden'
									name='graphId'
									value={graph.id}
								/>

								<div className='flex flex-wrap items-center justify-between gap-3'>
									<h3 className='font-medium text-gray-900'>{graph.title}</h3>

									<button
										type='submit'
										className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
									>
										Сохранить изменения
									</button>
								</div>

								<GraphFields
									graph={graph}
									assets={assets}
								/>

								<div className='flex justify-end border-t border-gray-100 pt-4'>
									<button
										type='submit'
										formAction={deleteComponentGraph}
										formNoValidate
										onClick={event => {
											if (!window.confirm(`Удалить график «${graph.title}»?`)) {
												event.preventDefault()
											}
										}}
										className='rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50'
									>
										Удалить график
									</button>
								</div>
							</form>
						))}
					</div>
				)}
			</section>

			<section className='border-t border-gray-200 pt-6'>
				<h2 className='mb-4 text-lg font-semibold text-gray-900'>
					Добавить график
				</h2>

				<form
					action={createComponentGraph}
					className='space-y-5 rounded-xl border border-gray-200 p-5'
				>
					<input
						type='hidden'
						name='componentId'
						value={componentId}
					/>

					<GraphFields assets={assets} />

					<div className='flex justify-end'>
						<button
							type='submit'
							className='rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
						>
							Добавить график
						</button>
					</div>
				</form>
			</section>
		</div>
	)
}

function GraphFields({
	graph,
	assets
}: {
	graph?: GraphItem
	assets: GraphAsset[]
}) {
	const fieldClass =
		'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500'

	const labelClass = 'block text-sm font-medium text-gray-700'

	return (
		<>
			<div>
				<label className={labelClass}>
					Название графика *
					<input
						required
						name='title'
						defaultValue={graph?.title ?? ''}
						maxLength={500}
						className={fieldClass}
						placeholder='Например, Temperature Characteristics'
					/>
				</label>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<label className={labelClass}>
					Название оси X
					<input
						name='xAxisName'
						defaultValue={graph?.xAxisName ?? ''}
						maxLength={255}
						className={fieldClass}
						placeholder='Temperature'
					/>
				</label>

				<label className={labelClass}>
					Единица оси X
					<input
						name='xAxisUnit'
						defaultValue={graph?.xAxisUnit ?? ''}
						maxLength={50}
						className={fieldClass}
						placeholder='°C'
					/>
				</label>

				<label className={labelClass}>
					Название оси Y
					<input
						name='yAxisName'
						defaultValue={graph?.yAxisName ?? ''}
						maxLength={255}
						className={fieldClass}
						placeholder='Forward Current'
					/>
				</label>

				<label className={labelClass}>
					Единица оси Y
					<input
						name='yAxisUnit'
						defaultValue={graph?.yAxisUnit ?? ''}
						maxLength={50}
						className={fieldClass}
						placeholder='mA'
					/>
				</label>

				<label className={labelClass}>
					Страница документации
					<input
						type='number'
						name='sourcePage'
						min={1}
						step={1}
						defaultValue={graph?.sourcePage ?? ''}
						className={fieldClass}
						placeholder='Например, 12'
					/>
				</label>

				<label className={labelClass}>
					Изображение графика
					<select
						name='imageAssetId'
						defaultValue={graph?.imageAssetId ?? ''}
						className={fieldClass}
					>
						<option value=''>Не выбрано</option>
						{assets.map(asset => (
							<option
								key={asset.id}
								value={asset.id}
							>
								{asset.title || asset.fileName || asset.filePath}
							</option>
						))}
					</select>
				</label>
			</div>

			<label className={labelClass}>
				Условия измерения
				<textarea
					name='conditions'
					defaultValue={graph?.conditions ?? ''}
					rows={3}
					className={fieldClass}
					placeholder='Например, Ta = 25 °C, VCE = 5 V'
				/>
			</label>

			<label className={labelClass}>
				Описание
				<textarea
					name='description'
					defaultValue={graph?.description ?? ''}
					rows={3}
					className={fieldClass}
					placeholder='Что показывает график и как его интерпретировать'
				/>
			</label>
		</>
	)
}
