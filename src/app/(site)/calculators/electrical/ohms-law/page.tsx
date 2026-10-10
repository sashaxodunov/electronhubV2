'use client'

import Breadcrumbs from '@/components/navigation/breadcrumbs'
import OhmLawCalculator from '@/components/calculators/ohm-law-calculator'
import { useMemo, useState } from 'react'

type CalculateType = 'current' | 'voltage' | 'resistance'

const calculateOptions: {
	value: CalculateType
	label: string
	symbol: string
}[] = [
	{
		value: 'current',
		label: 'Силу тока',
		symbol: 'I'
	},
	{
		value: 'voltage',
		label: 'Напряжение',
		symbol: 'U'
	},
	{
		value: 'resistance',
		label: 'Сопротивление',
		symbol: 'R'
	}
]

export default function OhmsLawPage() {
	const [calculateType, setCalculateType] = useState<CalculateType>('current')

	const [voltage, setVoltage] = useState('')
	const [current, setCurrent] = useState('')
	const [resistance, setResistance] = useState('')

	const result = useMemo(() => {
		const u = Number(voltage)
		const i = Number(current)
		const r = Number(resistance)

		if (calculateType === 'current') {
			if (!u || !r || r <= 0) return null

			return {
				value: u / r,
				symbol: 'I',
				unit: 'А',
				formula: `I = ${u} / ${r}`
			}
		}

		if (calculateType === 'voltage') {
			if (!i || !r || r <= 0) return null

			return {
				value: i * r,
				symbol: 'U',
				unit: 'В',
				formula: `U = ${i} × ${r}`
			}
		}

		if (!u || !i || i <= 0) return null

		return {
			value: u / i,
			symbol: 'R',
			unit: 'Ом',
			formula: `R = ${u} / ${i}`
		}
	}, [calculateType, voltage, current, resistance])

	const resetCalculator = () => {
		setVoltage('')
		setCurrent('')
		setResistance('')
	}

	const formatResult = (value: number) => {
		if (Number.isInteger(value)) {
			return value.toString()
		}

		return value.toFixed(4).replace(/\.?0+$/, '')
	}

	return (
		<main className='pb-16'>
			<Breadcrumbs />

			{/* Заголовок */}
			<section className='pb-10 pt-8'>
				<div className='max-w-4xl'>
					<div className='mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300'>
						Электрические расчёты
					</div>

					<h1 className='text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl'>
						Закон Ома — онлайн калькулятор
					</h1>

					<p className='mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg'>
						Рассчитайте силу тока, напряжение или сопротивление электрической
						цепи с помощью закона Ома. Введите известные значения — калькулятор
						автоматически выполнит расчёт.
					</p>
				</div>
			</section>

			{/* Калькулятор */}
			<section>
				<div className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
					{/* Левая часть */}
					<div className='rounded-2xl border border-white/10 bg-[#26343d] p-5 shadow-2xl shadow-black/10 sm:p-7'>
						<div className='mb-7'>
							<h2 className='text-2xl font-semibold text-white'>
								Калькулятор закона Ома
							</h2>

							<p className='mt-2 text-sm leading-6 text-slate-400'>
								Выберите величину, которую необходимо рассчитать.
							</p>
						</div>

						{/* Выбор величины */}
						<div className='mb-7 grid grid-cols-1 gap-2 sm:grid-cols-3'>
							{calculateOptions.map(option => {
								const active = calculateType === option.value

								return (
									<button
										key={option.value}
										type='button'
										onClick={() => {
											setCalculateType(option.value)
											resetCalculator()
										}}
										className={`rounded-xl border px-4 py-4 text-left transition-all ${
											active
												? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-950/20'
												: 'border-white/10 bg-[#202d35] text-slate-400 hover:border-white/20 hover:text-slate-200'
										}`}
									>
										<span className='block text-lg font-semibold'>
											{option.symbol}
										</span>

										<span className='mt-1 block text-sm'>
											Найти {option.label.toLowerCase()}
										</span>
									</button>
								)
							})}
						</div>

						{/* Поля */}
						<div className='space-y-5'>
							{calculateType !== 'voltage' && (
								<InputField
									label='Напряжение'
									symbol='U'
									unit='В'
									value={voltage}
									onChange={setVoltage}
									placeholder='Например, 12'
								/>
							)}

							{calculateType !== 'current' && (
								<InputField
									label='Сила тока'
									symbol='I'
									unit='А'
									value={current}
									onChange={setCurrent}
									placeholder='Например, 2'
								/>
							)}

							{calculateType !== 'resistance' && (
								<InputField
									label='Сопротивление'
									symbol='R'
									unit='Ом'
									value={resistance}
									onChange={setResistance}
									placeholder='Например, 6'
								/>
							)}
						</div>

						{/* Результат */}
						<div className='mt-7 rounded-xl border border-cyan-400/20 bg-[#1f2a32] p-5'>
							<div className='text-sm text-slate-400'>Результат</div>

							{result ? (
								<>
									<div className='mt-3 flex items-end gap-3'>
										<span className='text-4xl font-semibold tracking-tight text-cyan-300'>
											{formatResult(result.value)}
										</span>

										<span className='mb-1 text-lg text-slate-300'>
											{result.unit}
										</span>
									</div>

									<div className='mt-4 border-t border-white/10 pt-4'>
										<span className='text-sm text-slate-500'>Расчёт:</span>

										<span className='ml-2 font-mono text-sm text-slate-300'>
											{result.formula}
										</span>
									</div>
								</>
							) : (
								<p className='mt-3 text-sm leading-6 text-slate-500'>
									Введите исходные значения, чтобы получить результат.
								</p>
							)}
						</div>

						<button
							type='button'
							onClick={resetCalculator}
							className='mt-5 text-sm text-slate-500 transition-colors hover:text-cyan-300'
						>
							Очистить значения
						</button>
					</div>

					{/* Правая часть */}
					<div className='rounded-2xl border border-white/10 bg-[#26343d] p-5 sm:p-7'>
						<div className='mb-6'>
							<h2 className='text-2xl font-semibold text-white'>
								Формула закона Ома
							</h2>

							<p className='mt-2 text-sm leading-6 text-slate-400'>
								Закон Ома связывает три основные электрические величины:
								напряжение, силу тока и сопротивление.
							</p>
						</div>

						<div className='flex min-h-45 items-center justify-center rounded-xl border border-cyan-400/10 bg-[#1f2a32]'>
							<div className='text-center'>
								<div className='font-mono text-5xl font-medium tracking-wide text-cyan-300'>
									I = U / R
								</div>

								<p className='mt-5 text-sm text-slate-500'>
									Сила тока равна отношению напряжения к сопротивлению
								</p>
							</div>
						</div>

						<div className='mt-6 space-y-3'>
							<FormulaRow
								symbol='I'
								title='Сила тока'
								description='Количество электрического заряда, проходящего через проводник за единицу времени.'
								unit='Ампер (А)'
							/>

							<FormulaRow
								symbol='U'
								title='Напряжение'
								description='Разность электрических потенциалов между двумя точками цепи.'
								unit='Вольт (В)'
							/>

							<FormulaRow
								symbol='R'
								title='Сопротивление'
								description='Величина, характеризующая противодействие проводника прохождению электрического тока.'
								unit='Ом (Ω)'
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Интерактивная модель */}
			<div className='mt-6'>
				<OhmLawCalculator />
			</div>

			{/* Преобразованные формулы */}
			<section className='pt-16'>
				<div className='max-w-3xl'>
					<h2 className='text-2xl font-semibold text-white sm:text-3xl'>
						Преобразованные формулы
					</h2>

					<p className='mt-3 text-base leading-7 text-slate-400'>
						В зависимости от того, какую величину необходимо определить, формулу
						закона Ома можно преобразовать.
					</p>
				</div>

				<div className='mt-7 grid gap-4 md:grid-cols-3'>
					<FormulaCard
						symbol='I'
						formula='I = U / R'
						description='Чтобы найти силу тока, разделите напряжение на сопротивление.'
					/>

					<FormulaCard
						symbol='U'
						formula='U = I × R'
						description='Чтобы найти напряжение, умножьте силу тока на сопротивление.'
					/>

					<FormulaCard
						symbol='R'
						formula='R = U / I'
						description='Чтобы найти сопротивление, разделите напряжение на силу тока.'
					/>
				</div>
			</section>

			{/* Примеры */}
			<section className='pt-16'>
				<div className='max-w-3xl'>
					<h2 className='text-2xl font-semibold text-white sm:text-3xl'>
						Примеры расчёта
					</h2>

					<p className='mt-3 text-base leading-7 text-slate-400'>
						Несколько простых примеров использования закона Ома на практике.
					</p>
				</div>

				<div className='mt-8 grid gap-5 lg:grid-cols-3'>
					<ExampleCard
						number='01'
						title='Найти силу тока'
						text='К источнику напряжения 12 В подключён резистор сопротивлением 6 Ом.'
						formula='I = 12 / 6 = 2 А'
					/>

					<ExampleCard
						number='02'
						title='Найти напряжение'
						text='Через резистор сопротивлением 100 Ом протекает ток 0,5 А.'
						formula='U = 0,5 × 100 = 50 В'
					/>

					<ExampleCard
						number='03'
						title='Найти сопротивление'
						text='При напряжении 24 В через устройство протекает ток 2 А.'
						formula='R = 24 / 2 = 12 Ом'
					/>
				</div>
			</section>

			{/* Описание */}
			<section className='pt-16'>
				<div className='grid gap-10 lg:grid-cols-[1fr_0.8fr]'>
					<article>
						<h2 className='text-2xl font-semibold text-white sm:text-3xl'>
							Что такое закон Ома?
						</h2>

						<div className='mt-6 space-y-5 text-base leading-8 text-slate-400'>
							<p>
								Закон Ома — один из основных законов электротехники, описывающий
								связь между напряжением, силой тока и сопротивлением участка
								электрической цепи.
							</p>

							<p>
								Если сопротивление цепи остаётся постоянным, увеличение
								напряжения приводит к увеличению силы тока. При увеличении
								сопротивления сила тока, наоборот, уменьшается при том же
								напряжении.
							</p>

							<p>
								Закон Ома широко применяется при проектировании и анализе
								электрических цепей, выборе резисторов, расчёте источников
								питания и проверке параметров электронных устройств.
							</p>
						</div>
					</article>

					<aside className='rounded-2xl border border-white/10 bg-[#26343d] p-6'>
						<div className='text-sm font-medium uppercase tracking-[0.12em] text-cyan-400'>
							Запомнить
						</div>

						<div className='mt-5 space-y-5'>
							<MemoryRow
								symbol='↑ U'
								text='При постоянном R увеличение напряжения увеличивает ток.'
							/>

							<MemoryRow
								symbol='↑ R'
								text='При постоянном U увеличение сопротивления уменьшает ток.'
							/>

							<MemoryRow
								symbol='I = U / R'
								text='Основная формула для расчёта силы тока.'
							/>
						</div>
					</aside>
				</div>
			</section>

			{/* Нижний информационный блок */}
			<section className='pt-16'>
				<div className='rounded-2xl border border-white/10 bg-[#26343d] p-6 sm:p-8'>
					<h2 className='text-xl font-semibold text-white'>
						Онлайн калькулятор закона Ома
					</h2>

					<p className='mt-4 max-w-4xl text-sm leading-7 text-slate-400'>
						С помощью этого калькулятора можно быстро определить силу
						электрического тока, напряжение или сопротивление, если известны две
						другие величины. Все расчёты выполняются по закону Ома для участка
						электрической цепи.
					</p>
				</div>
			</section>
		</main>
	)
}

/* ---------------- Компоненты ---------------- */

function InputField({
	label,
	symbol,
	unit,
	value,
	onChange,
	placeholder
}: {
	label: string
	symbol: string
	unit: string
	value: string
	onChange: (value: string) => void
	placeholder: string
}) {
	return (
		<label className='block'>
			<span className='mb-2 flex items-center justify-between'>
				<span className='text-sm font-medium text-slate-200'>{label}</span>

				<span className='font-mono text-sm text-cyan-400'>{symbol}</span>
			</span>

			<div className='relative'>
				<input
					type='number'
					min='0'
					step='any'
					value={value}
					onChange={event => onChange(event.target.value)}
					placeholder={placeholder}
					className='h-14 w-full rounded-xl border border-white/10 bg-[#1f2a32] px-4 pr-16 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10'
				/>

				<span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500'>
					{unit}
				</span>
			</div>
		</label>
	)
}

function FormulaRow({
	symbol,
	title,
	description,
	unit
}: {
	symbol: string
	title: string
	description: string
	unit: string
}) {
	return (
		<div className='flex gap-4 rounded-xl border border-white/5 bg-[#202d35] p-4'>
			<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 font-mono text-lg text-cyan-300'>
				{symbol}
			</div>

			<div className='min-w-0'>
				<div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
					<h3 className='font-medium text-white'>{title}</h3>
					<span className='text-xs text-slate-500'>{unit}</span>
				</div>

				<p className='mt-1 text-sm leading-6 text-slate-500'>{description}</p>
			</div>
		</div>
	)
}

function FormulaCard({
	symbol,
	formula,
	description
}: {
	symbol: string
	formula: string
	description: string
}) {
	return (
		<div className='rounded-2xl border border-white/10 bg-[#26343d] p-6 transition-transform duration-200 hover:-translate-y-0.5'>
			<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 font-mono text-lg text-cyan-300'>
				{symbol}
			</div>

			<div className='mt-5 font-mono text-2xl text-white'>{formula}</div>

			<p className='mt-4 text-sm leading-6 text-slate-500'>{description}</p>
		</div>
	)
}

function ExampleCard({
	number,
	title,
	text,
	formula
}: {
	number: string
	title: string
	text: string
	formula: string
}) {
	return (
		<div className='rounded-2xl border border-white/10 bg-[#26343d] p-6'>
			<div className='font-mono text-sm text-cyan-400'>{number}</div>

			<h3 className='mt-4 text-lg font-semibold text-white'>{title}</h3>

			<p className='mt-3 text-sm leading-6 text-slate-400'>{text}</p>

			<div className='mt-5 rounded-lg bg-[#1f2a32] px-4 py-3 font-mono text-sm text-cyan-300'>
				{formula}
			</div>
		</div>
	)
}

function MemoryRow({ symbol, text }: { symbol: string; text: string }) {
	return (
		<div className='flex gap-4'>
			<div className='min-w-17.5 font-mono text-sm text-cyan-300'>{symbol}</div>

			<p className='text-sm leading-6 text-slate-400'>{text}</p>
		</div>
	)
}
