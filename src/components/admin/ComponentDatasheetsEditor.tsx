import {
	createDatasheet,
	deleteDatasheet,
	updateDatasheet
} from '@/actions/datasheets'

type DatasheetItem = {
	id: string
	documentType: string
	title: string
	filePath: string
	fileName: string | null
	mimeType: string | null
	fileSize: string | null
	revision: string | null
	documentDate: string | null
	language: string
	pageCount: number | null
	sourceUrl: string | null
	description: string | null
	isPrimary: boolean
	isActive: boolean
}

type Props = {
	componentId: string
	items: DatasheetItem[]
	documentTypes: readonly string[]
}

const inputClass =
	'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900'

const buttonClass =
	'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'

function TextField({
	label,
	name,
	defaultValue,
	required = false,
	type = 'text'
}: {
	label: string
	name: string
	defaultValue?: string | null
	required?: boolean
	type?: string
}) {
	return (
		<label className='block'>
			<span className='mb-1.5 block text-xs font-medium text-gray-500'>
				{label}
			</span>

			<input
				className={inputClass}
				name={name}
				type={type}
				defaultValue={defaultValue ?? ''}
				required={required}
			/>
		</label>
	)
}

function DocumentFields({
	item,
	documentTypes
}: {
	item?: DatasheetItem
	documentTypes: readonly string[]
}) {
	return (
		<div className='grid gap-4 md:grid-cols-2'>
			<TextField
				label='Название документа'
				name='title'
				defaultValue={item?.title}
				required
			/>

			<label className='block'>
				<span className='mb-1.5 block text-xs font-medium text-gray-500'>
					Тип документа
				</span>

				<select
					className={inputClass}
					name='documentType'
					defaultValue={item?.documentType ?? documentTypes[0] ?? 'datasheet'}
					required
				>
					{documentTypes.map(type => (
						<option
							key={type}
							value={type}
						>
							{type}
						</option>
					))}
				</select>
			</label>

			<TextField
				label='Ревизия'
				name='revision'
				defaultValue={item?.revision}
			/>

			<TextField
				label='Дата документа'
				name='documentDate'
				type='date'
				defaultValue={item?.documentDate}
			/>

			<TextField
				label='Язык'
				name='language'
				defaultValue={item?.language ?? 'en'}
				required
			/>

			<TextField
				label='Количество страниц'
				name='pageCount'
				type='number'
				defaultValue={item?.pageCount?.toString()}
			/>

			<div className='md:col-span-2'>
				<TextField
					label='URL на сайте производителя'
					name='sourceUrl'
					defaultValue={item?.sourceUrl}
					type='url'
				/>
			</div>

			<label className='block md:col-span-2'>
				<span className='mb-1.5 block text-xs font-medium text-gray-500'>
					Описание
				</span>

				<textarea
					className={inputClass}
					name='description'
					rows={3}
					defaultValue={item?.description ?? ''}
				/>
			</label>

			<div className='flex flex-wrap gap-5 md:col-span-2'>
				<label className='flex items-center gap-2 text-sm'>
					<input
						type='checkbox'
						name='isPrimary'
						defaultChecked={item?.isPrimary ?? false}
					/>
					Основной документ
				</label>

				<label className='flex items-center gap-2 text-sm'>
					<input
						type='checkbox'
						name='isActive'
						defaultChecked={item?.isActive ?? true}
					/>
					Активен
				</label>
			</div>
		</div>
	)
}

function formatFileSize(size: string | null): string {
	if (!size) return 'Размер неизвестен'

	const bytes = Number(size)

	if (!Number.isFinite(bytes) || bytes < 0) {
		return 'Размер неизвестен'
	}

	if (bytes < 1024) {
		return `${bytes} Б`
	}

	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} КБ`
	}

	return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`
}

export default function ComponentDatasheetsEditor({
	componentId,
	items,
	documentTypes
}: Props) {
	return (
		<div className='space-y-8 p-6'>
			<section>
				<h2 className='text-lg font-semibold text-gray-900'>
					Документация компонента
				</h2>

				<p className='mt-1 text-sm text-gray-500'>
					Даташиты, руководства, application notes и другие документы.
				</p>
			</section>

			{/* Добавление документа */}
			<section className='rounded-xl border border-gray-200 p-5'>
				<h3 className='mb-4 font-semibold'>Добавить документ</h3>

				<form
					action={createDatasheet}
					className='space-y-4'
				>
					<input
						type='hidden'
						name='componentId'
						value={componentId}
					/>

					<DocumentFields documentTypes={documentTypes} />

					<label className='block'>
						<span className='mb-1.5 block text-xs font-medium text-gray-500'>
							PDF-файл
						</span>

						<input
							className={inputClass}
							name='file'
							type='file'
							accept='.pdf,application/pdf'
							required
						/>

						<span className='mt-1 block text-xs text-gray-500'>
							Допустимый формат: PDF. Максимальный размер задаётся настройкой
							DATASHEET_MAX_SIZE на сервере.
						</span>
					</label>

					<button
						type='submit'
						className={buttonClass}
					>
						Загрузить и добавить документ
					</button>
				</form>
			</section>

			{/* Список документов */}
			<section className='space-y-4'>
				<h3 className='font-semibold'>Документы ({items.length})</h3>

				{items.length === 0 ? (
					<p className='rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500'>
						Документы ещё не добавлены.
					</p>
				) : (
					items.map(item => (
						<article
							key={item.id}
							className='rounded-xl border border-gray-200 p-5'
						>
							<div className='mb-4 flex flex-wrap items-center gap-2'>
								<h4 className='font-semibold'>{item.title}</h4>

								{item.isPrimary && (
									<span className='rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800'>
										Основной
									</span>
								)}

								{!item.isActive && (
									<span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500'>
										Неактивен
									</span>
								)}
							</div>

							{/* Информация о сохранённом файле */}
							<div className='mb-4 rounded-lg bg-gray-50 p-3'>
								<p className='text-xs font-medium text-gray-500'>
									Загруженный файл
								</p>

								<a
									href={`/api/datasheets/${encodeURIComponent(item.id)}`}
									target='_blank'
									rel='noreferrer'
									className='mt-1 inline-block break-all text-sm font-medium text-blue-700 hover:underline'
								>
									{item.fileName ?? item.title}
								</a>

								<p className='mt-1 text-xs text-gray-500'>
									{item.mimeType ?? 'application/pdf'} ·{' '}
									{formatFileSize(item.fileSize)}
								</p>
							</div>

							{/* Редактирование метаданных */}
							<form
								action={updateDatasheet}
								className='space-y-4'
							>
								<input
									type='hidden'
									name='componentId'
									value={componentId}
								/>

								<input
									type='hidden'
									name='datasheetId'
									value={item.id}
								/>

								<DocumentFields
									item={item}
									documentTypes={documentTypes}
								/>

								<button
									type='submit'
									className={buttonClass}
								>
									Сохранить изменения
								</button>
							</form>

							{/* Удаление документа и файла */}
							<form
								action={deleteDatasheet}
								className='mt-3'
							>
								<input
									type='hidden'
									name='componentId'
									value={componentId}
								/>

								<input
									type='hidden'
									name='datasheetId'
									value={item.id}
								/>

								<button
									type='submit'
									className='rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50'
								>
									Удалить документ
								</button>
							</form>
						</article>
					))
				)}
			</section>
		</div>
	)
}
