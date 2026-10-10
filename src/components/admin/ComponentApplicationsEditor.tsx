import {
	createComponentApplication,
	updateComponentApplication,
	deleteComponentApplication
} from '@/actions/componentApplications'

type ApplicationOption = {
	id: bigint
	name: string
	slug: string
}

type ComponentApplicationItem = {
	applicationId: bigint
	name: string
	slug: string
	description: string | null
}

type ComponentApplicationsEditorProps = {
	componentId: bigint | number
	applications: ApplicationOption[]
	linkedApplications: ComponentApplicationItem[]
}

const inputClass =
	'w-full rounded-lg border border-[#3b4a54] bg-[#182127] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd479]'

const buttonClass =
	'rounded-lg bg-[#ffd479] px-4 py-2 text-sm font-semibold text-[#182127] transition hover:brightness-95'

export default function ComponentApplicationsEditor({
	componentId,
	applications,
	linkedApplications
}: ComponentApplicationsEditorProps) {
	const componentIdValue = String(componentId)

	const linkedIds = new Set(
		linkedApplications.map(item => item.applicationId.toString())
	)

	const availableApplications = applications.filter(
		item => !linkedIds.has(item.id.toString())
	)

	return (
		<div className='space-y-6 p-6'>
			<section className='rounded-xl border border-border bg-[#1f2a32] p-4'>
				<h2 className='mb-4 text-lg font-semibold text-white'>
					Добавить область применения
				</h2>

				{availableApplications.length === 0 ? (
					<p className='text-sm text-gray-400'>
						Все существующие области применения уже привязаны к этому
						компоненту.
					</p>
				) : (
					<form
						action={createComponentApplication}
						className='space-y-4'
					>
						<input
							type='hidden'
							name='componentId'
							value={componentIdValue}
						/>

						<label className='block space-y-1'>
							<span className='text-sm text-gray-300'>Область применения</span>

							<select
								className={inputClass}
								name='applicationId'
								defaultValue=''
								required
							>
								<option
									value=''
									disabled
								>
									Выбери область применения
								</option>

								{availableApplications.map(item => (
									<option
										key={item.id.toString()}
										value={item.id.toString()}
									>
										{item.name} ({item.slug})
									</option>
								))}
							</select>
						</label>

						<label className='block space-y-1'>
							<span className='text-sm text-gray-300'>Описание связи</span>

							<textarea
								className={inputClass}
								name='description'
								rows={3}
								maxLength={5000}
								placeholder='Как используется компонент в этой области?'
							/>
						</label>

						<button
							type='submit'
							className={buttonClass}
						>
							Добавить
						</button>
					</form>
				)}
			</section>

			<section className='space-y-3'>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<h2 className='text-lg font-semibold text-white'>
						Привязанные области применения
					</h2>

					<span className='text-sm text-gray-400'>
						Всего: {linkedApplications.length}
					</span>
				</div>

				{linkedApplications.length === 0 ? (
					<div className='rounded-xl border border-border bg-[#1f2a32] p-5 text-sm text-gray-400'>
						У этого компонента пока нет областей применения.
					</div>
				) : (
					<div className='space-y-3'>
						{linkedApplications.map(item => (
							<article
								key={item.applicationId.toString()}
								className='rounded-xl border border-border bg-[#1f2a32] p-4'
							>
								<div className='mb-4'>
									<h3 className='font-semibold text-white'>{item.name}</h3>
									<p className='mt-1 text-xs text-gray-400'>
										Slug: {item.slug}
									</p>
								</div>

								<form
									action={updateComponentApplication}
									className='space-y-3'
								>
									<input
										type='hidden'
										name='componentId'
										value={componentIdValue}
									/>
									<input
										type='hidden'
										name='applicationId'
										value={item.applicationId.toString()}
									/>

									<label className='block space-y-1'>
										<span className='text-sm text-gray-300'>
											Описание связи
										</span>
										<textarea
											className={inputClass}
											name='description'
											rows={3}
											maxLength={5000}
											defaultValue={item.description ?? ''}
											placeholder='Описание использования компонента'
										/>
									</label>

									<button
										type='submit'
										className={buttonClass}
									>
										Сохранить описание
									</button>
								</form>

								<form
									action={deleteComponentApplication}
									className='mt-3 border-t border-border pt-3'
								>
									<input
										type='hidden'
										name='componentId'
										value={componentIdValue}
									/>
									<input
										type='hidden'
										name='applicationId'
										value={item.applicationId.toString()}
									/>

									<button
										type='submit'
										className='text-sm text-red-400 transition hover:text-red-300'
									>
										Удалить связь
									</button>
								</form>
							</article>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
