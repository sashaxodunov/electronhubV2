import {
	createComponentAlias,
	updateComponentAlias,
	deleteComponentAlias
} from '@/actions/componentAliases'

type ComponentAlias = {
	id: bigint
	alias: string
	aliasType: string | null
	isPrimary: boolean
}

type ComponentAliasesEditorProps = {
	componentId: bigint | number
	aliases: ComponentAlias[]
}

const aliasTypes = [
	{ value: 'manufacturer_part_number', label: 'Обозначение производителя' },
	{ value: 'legacy_part_number', label: 'Устаревшее обозначение' },
	{ value: 'internal_part_number', label: 'Внутренний артикул' },
	{ value: 'common_name', label: 'Распространённое название' },
	{ value: 'industry_designation', label: 'Отраслевое обозначение' },
	{ value: 'cross_reference', label: 'Перекрёстная ссылка' },
	{ value: 'short_name', label: 'Краткое название' }
] as const

const inputClass =
	'w-full rounded-lg border border-[#3b4a54] bg-[#182127] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd479]'

const buttonClass =
	'rounded-lg bg-[#ffd479] px-4 py-2 text-sm font-semibold text-[#182127] transition hover:brightness-95'

export default function ComponentAliasesEditor({
	componentId,
	aliases
}: ComponentAliasesEditorProps) {
	const componentIdValue = String(componentId)

	return (
		<div className='space-y-6'>
			<section className='rounded-xl border border-border bg-[#1f2a32] p-4'>
				<h2 className='mb-4 text-lg font-semibold text-white'>
					Добавить обозначение
				</h2>

				<form
					action={createComponentAlias}
					className='space-y-4'
				>
					<input
						type='hidden'
						name='componentId'
						value={componentIdValue}
					/>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<label className='block space-y-1'>
							<span className='text-sm text-gray-300'>Обозначение</span>
							<input
								className={inputClass}
								name='alias'
								type='text'
								maxLength={255}
								placeholder='Например, LM358N'
								required
							/>
						</label>

						<label className='block space-y-1'>
							<span className='text-sm text-gray-300'>Тип обозначения</span>
							<select
								className={inputClass}
								name='aliasType'
								defaultValue=''
							>
								<option value=''>Не указан</option>
								{aliasTypes.map(type => (
									<option
										key={type.value}
										value={type.value}
									>
										{type.label}
									</option>
								))}
							</select>
						</label>
					</div>

					<label className='flex items-center gap-2 text-sm text-gray-300'>
						<input
							type='checkbox'
							name='isPrimary'
							value='true'
							className='accent-accent'
						/>
						Сделать основным обозначением
					</label>

					<button
						type='submit'
						className={buttonClass}
					>
						Добавить
					</button>
				</form>
			</section>

			<section className='space-y-3'>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<h2 className='text-lg font-semibold text-white'>
						Существующие обозначения
					</h2>
					<span className='text-sm text-gray-400'>Всего: {aliases.length}</span>
				</div>

				{aliases.length === 0 ? (
					<div className='rounded-xl border border-border bg-[#1f2a32] p-5 text-sm text-gray-400'>
						У этого компонента пока нет альтернативных обозначений.
					</div>
				) : (
					<div className='space-y-3'>
						{aliases.map(item => (
							<article
								key={String(item.id)}
								className='rounded-xl border border-border bg-[#1f2a32] p-4'
							>
								<form
									action={updateComponentAlias}
									className='space-y-4'
								>
									<input
										type='hidden'
										name='id'
										value={String(item.id)}
									/>
									<input
										type='hidden'
										name='componentId'
										value={componentIdValue}
									/>

									<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
										<label className='block space-y-1'>
											<span className='text-sm text-gray-300'>Обозначение</span>
											<input
												className={inputClass}
												name='alias'
												defaultValue={item.alias}
												maxLength={255}
												required
											/>
										</label>

										<label className='block space-y-1'>
											<span className='text-sm text-gray-300'>
												Тип обозначения
											</span>
											<select
												className={inputClass}
												name='aliasType'
												defaultValue={item.aliasType ?? ''}
											>
												<option value=''>Не указан</option>
												{aliasTypes.map(type => (
													<option
														key={type.value}
														value={type.value}
													>
														{type.label}
													</option>
												))}
												{item.aliasType &&
													!aliasTypes.some(
														type => type.value === item.aliasType
													) && (
														<option value={item.aliasType}>
															{item.aliasType}
														</option>
													)}
											</select>
										</label>
									</div>

									<label className='flex items-center gap-2 text-sm text-gray-300'>
										<input
											type='checkbox'
											name='isPrimary'
											value='true'
											defaultChecked={item.isPrimary}
											className='accent-accent'
										/>
										Основное обозначение
									</label>

									<div className='flex flex-wrap items-center gap-3'>
										<button
											type='submit'
											className={buttonClass}
										>
											Сохранить
										</button>

										{item.isPrimary && (
											<span className='rounded-md border border-accent/40 px-2 py-1 text-xs text-accent'>
												Основное
											</span>
										)}
									</div>
								</form>

								<form
									action={deleteComponentAlias}
									className='mt-3 border-t border-border pt-3'
								>
									<input
										type='hidden'
										name='id'
										value={String(item.id)}
									/>
									<input
										type='hidden'
										name='componentId'
										value={componentIdValue}
									/>
									<button
										type='submit'
										className='text-sm text-red-400 transition hover:text-red-300'
									>
										Удалить обозначение
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
