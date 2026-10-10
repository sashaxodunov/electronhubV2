'use client'

import { useEffect, useMemo, useState } from 'react'

type BandCount = 4 | 5 | 6

type CalculatorMode = 'decode' | 'encode'

type ColorName =
	| 'black'
	| 'brown'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'blue'
	| 'violet'
	| 'gray'
	| 'white'
	| 'gold'
	| 'silver'

type ColorOption = {
	name: ColorName
	label: string
	value?: number
	multiplier?: number
	tolerance?: number
	tcr?: number
	css: string
}

const colors: ColorOption[] = [
	{
		name: 'black',
		label: 'Чёрный',
		value: 0,
		multiplier: 1,
		tcr: 250,
		css: '#111827'
	},
	{
		name: 'brown',
		label: 'Коричневый',
		value: 1,
		multiplier: 10,
		tolerance: 1,
		tcr: 100,
		css: '#8b4513'
	},
	{
		name: 'red',
		label: 'Красный',
		value: 2,
		multiplier: 100,
		tolerance: 2,
		tcr: 50,
		css: '#dc2626'
	},
	{
		name: 'orange',
		label: 'Оранжевый',
		value: 3,
		multiplier: 1_000,
		tcr: 15,
		css: '#f97316'
	},
	{
		name: 'yellow',
		label: 'Жёлтый',
		value: 4,
		multiplier: 10_000,
		tcr: 25,
		css: '#eab308'
	},
	{
		name: 'green',
		label: 'Зелёный',
		value: 5,
		multiplier: 100_000,
		tolerance: 0.5,
		tcr: 20,
		css: '#16a34a'
	},
	{
		name: 'blue',
		label: 'Синий',
		value: 6,
		multiplier: 1_000_000,
		tolerance: 0.25,
		tcr: 10,
		css: '#2563eb'
	},
	{
		name: 'violet',
		label: 'Фиолетовый',
		value: 7,
		multiplier: 10_000_000,
		tolerance: 0.1,
		tcr: 5,
		css: '#7c3aed'
	},
	{
		name: 'gray',
		label: 'Серый',
		value: 8,
		multiplier: 100_000_000,
		tolerance: 0.05,
		tcr: 1,
		css: '#6b7280'
	},
	{
		name: 'white',
		label: 'Белый',
		value: 9,
		multiplier: 1_000_000_000,
		css: '#f3f4f6'
	},
	{
		name: 'gold',
		label: 'Золотой',
		multiplier: 0.1,
		tolerance: 5,
		css: '#d4af37'
	},
	{
		name: 'silver',
		label: 'Серебряный',
		multiplier: 0.01,
		tolerance: 10,
		css: '#9ca3af'
	}
]

const digitColors = colors.filter(color => color.value !== undefined)
const multiplierColors = colors.filter(color => color.multiplier !== undefined)
const toleranceColors = colors.filter(color => color.tolerance !== undefined)
const tcrColors = colors.filter(color => color.tcr !== undefined)

const defaultBands: ColorName[] = [
	'yellow',
	'violet',
	'red',
	'gold',
	'gold',
	'red'
]

function getColor(name: ColorName) {
	return colors.find(color => color.name === name) ?? colors[0]
}

function getDigitColor(value: number): ColorName {
	return digitColors.find(color => color.value === value)?.name ?? 'black'
}

function formatResistance(value: number): string {
	if (value >= 1_000_000_000) {
		return `${value / 1_000_000_000} ГОм`
	}

	if (value >= 1_000_000) {
		return `${value / 1_000_000} МОм`
	}

	if (value >= 1_000) {
		return `${value / 1_000} кОм`
	}

	if (value < 1) {
		return `${value * 1000} мОм`
	}

	return `${value} Ом`
}

function ColorSelect({
	label,
	value,
	options,
	onChange
}: {
	label: string
	value: ColorName
	options: ColorOption[]
	onChange: (value: ColorName) => void
}) {
	const selected = getColor(value)

	return (
		<label className='flex flex-col gap-2'>
			{' '}
			<span className='text-sm font-medium text-[#aeb7bd]'>{label}</span>
			<div className='relative'>
				<select
					value={value}
					onChange={event => onChange(event.target.value as ColorName)}
					className='h-11 w-full appearance-none rounded-lg border border-border bg-background-dark px-3 pr-9 text-sm text-white outline-none transition-colors focus:border-accent'
				>
					{options.map(color => (
						<option
							key={color.name}
							value={color.name}
						>
							{color.label}
						</option>
					))}
				</select>

				<span
					aria-hidden='true'
					className='pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rounded-full border border-white/20'
					style={{ backgroundColor: selected.css }}
				/>
			</div>
		</label>
	)
}

type ResistorColorCodeCalculatorProps = {
	initialResistance?: string
}

export default function ResistorColorCodeCalculator({
	initialResistance = ''
}: ResistorColorCodeCalculatorProps) {
	const [bandCount, setBandCount] = useState<BandCount>(4)
	const [mode, setMode] = useState<CalculatorMode>(
		initialResistance ? 'encode' : 'decode'
	)
	const [targetResistance, setTargetResistance] = useState(
		initialResistance ? String(Number(initialResistance) / 1000) : '4.7'
	)
	const [targetUnit, setTargetUnit] = useState('кОм')
	const [targetTolerance, setTargetTolerance] = useState('5')
	const [bands, setBands] = useState<ColorName[]>(defaultBands)

	const result = useMemo(() => {
		const band1 = getColor(bands[0])
		const band2 = getColor(bands[1])
		const band3 = getColor(bands[2])
		const band4 = getColor(bands[3])
		const band5 = getColor(bands[4])
		const band6 = getColor(bands[5])
		let significant = 0

		if (bandCount === 4) {
			significant = (band1.value ?? 0) * 10 + (band2.value ?? 0)
		} else {
			significant =
				(band1.value ?? 0) * 100 + (band2.value ?? 0) * 10 + (band3.value ?? 0)
		}

		const multiplierBand = bandCount === 4 ? band3 : band4
		const toleranceBand = bandCount === 4 ? band4 : band5

		const resistance = significant * (multiplierBand.multiplier ?? 1)
		const tolerance = toleranceBand.tolerance ?? 20

		const minimum = resistance * (1 - tolerance / 100)
		const maximum = resistance * (1 + tolerance / 100)

		return {
			resistance,
			tolerance,
			minimum,
			maximum,
			tcr: bandCount === 6 ? band6.tcr : undefined
		}
	}, [bandCount, bands])

	function updateBand(index: number, value: ColorName) {
		setBands(current => {
			const next = [...current]
			next[index] = value
			return next
		})
	}

	function changeBandCount(count: BandCount) {
		setBandCount(count)
		if (count === 4) {
			setBands(current => current.slice(0, 4))
			return
		}

		setBands(current => {
			const next = [...current]

			while (next.length < 6) {
				next.push(defaultBands[next.length])
			}

			return next
		})
	}

	const bandOptions = [
		{
			label: 'Полоса 1',
			options: digitColors
		},
		{
			label: 'Полоса 2',
			options: digitColors
		},
		...(bandCount === 5 || bandCount === 6
			? [
					{
						label: 'Полоса 3',
						options: digitColors
					}
				]
			: []),
		{
			label: bandCount === 4 ? 'Множитель' : 'Множитель',
			options: multiplierColors
		},
		{
			label: 'Допуск',
			options: toleranceColors
		},
		...(bandCount === 6
			? [
					{
						label: 'ТКС',
						options: tcrColors
					}
				]
			: [])
	]

	const bandIndexes =
		bandCount === 4
			? [0, 1, 2, 3]
			: bandCount === 5
				? [0, 1, 2, 3, 4]
				: [0, 1, 2, 3, 4, 5]
	function encodeResistance() {
		const numericValue = Number(targetResistance.replace(',', '.'))

		const units: Record<string, number> = {
			Ом: 1,
			кОм: 1_000,
			МОм: 1_000_000,
			ГОм: 1_000_000_000
		}

		const resistance = numericValue * (units[targetUnit] ?? 1)
		const tolerance = Number(targetTolerance)

		if (
			!Number.isFinite(resistance) ||
			resistance <= 0 ||
			!Number.isFinite(tolerance)
		) {
			return
		}

		let significant: number
		let multiplier: number

		if (bandCount === 4) {
			const exponent = Math.floor(Math.log10(resistance)) - 1
			multiplier = 10 ** exponent
			significant = Math.round(resistance / multiplier)

			if (significant >= 100) {
				significant = Math.round(significant / 10)
				multiplier *= 10
			}

			const first = Math.floor(significant / 10)
			const second = significant % 10

			const multiplierColor = multiplierColors.find(
				color => color.multiplier === multiplier
			)

			const toleranceColor = toleranceColors.find(
				color => color.tolerance === tolerance
			)

			if (
				first >= 0 &&
				first <= 9 &&
				second >= 0 &&
				second <= 9 &&
				multiplierColor &&
				toleranceColor
			) {
				setBands([
					getDigitColor(first),
					getDigitColor(second),
					multiplierColor.name,
					toleranceColor.name
				])
			}

			return
		}

		const exponent = Math.floor(Math.log10(resistance)) - 2

		multiplier = 10 ** exponent
		significant = Math.round(resistance / multiplier)

		if (significant >= 1000) {
			significant = Math.round(significant / 10)
			multiplier *= 10
		}

		const first = Math.floor(significant / 100)
		const second = Math.floor((significant % 100) / 10)
		const third = significant % 10

		const multiplierColor = multiplierColors.find(
			color => color.multiplier === multiplier
		)

		const toleranceColor = toleranceColors.find(
			color => color.tolerance === tolerance
		)

		if (
			first >= 0 &&
			first <= 9 &&
			second >= 0 &&
			second <= 9 &&
			third >= 0 &&
			third <= 9 &&
			multiplierColor &&
			toleranceColor
		) {
			const nextBands: ColorName[] = [
				getDigitColor(first),
				getDigitColor(second),
				getDigitColor(third),
				multiplierColor.name,
				toleranceColor.name
			]
			if (bandCount === 6) {
				nextBands.push('red')
			}

			setBands(nextBands)
		}
	}

	useEffect(() => {
		if (mode !== 'encode') {
			return
		}

		encodeResistance()
	}, [mode, targetResistance, targetUnit, targetTolerance, bandCount])

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Выбор режима цвет - значение */}
			<div className='mb-8'>
				<div className='flex flex-wrap gap-2'>
					<button
						type='button'
						onClick={() => setMode('decode')}
						className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
							mode === 'decode'
								? 'border-accent bg-[#b89445] text-background-dark'
								: 'border-border bg-background-dark text-[#aeb7bd] hover:border-accent'
						}`}
					>
						Цвета → сопротивление
					</button>
					<button
						type='button'
						onClick={() => setMode('encode')}
						className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
							mode === 'encode'
								? 'border-accent bg-[#b89445] text-background-dark'
								: 'border-border bg-background-dark text-[#aeb7bd] hover:border-accent'
						}`}
					>
						Сопротивление → цвета
					</button>
				</div>
			</div>
			{mode === 'encode' && (
				<div className='mb-8 rounded-xl border border-border bg-background-dark p-5'>
					<h3 className='text-lg font-semibold text-white'>
						Номинал резистора
					</h3>

					<div className='mt-4 grid gap-4 sm:grid-cols-3'>
						<label className='flex flex-col gap-2'>
							<span className='text-sm font-medium text-[#aeb7bd]'>
								Сопротивление
							</span>

							<input
								type='text'
								inputMode='decimal'
								value={targetResistance}
								onChange={event => setTargetResistance(event.target.value)}
								className='h-11 rounded-lg border border-border bg-background-light px-3 text-base text-white outline-none focus:border-accent'
								placeholder='4.7'
							/>
						</label>

						<label className='flex flex-col gap-2'>
							<span className='text-sm font-medium text-[#aeb7bd]'>
								Единица
							</span>

							<select
								value={targetUnit}
								onChange={event => setTargetUnit(event.target.value)}
								className='h-11 rounded-lg border border-border bg-background-light px-3 text-base text-white outline-none focus:border-accent'
							>
								<option value='Ом'>Ом</option>
								<option value='кОм'>кОм</option>
								<option value='МОм'>МОм</option>
								<option value='ГОм'>ГОм</option>
							</select>
						</label>

						<label className='flex flex-col gap-2'>
							<span className='text-sm font-medium text-[#aeb7bd]'>Допуск</span>

							<select
								value={targetTolerance}
								onChange={event => setTargetTolerance(event.target.value)}
								className='h-11 rounded-lg border border-border bg-background-light px-3 text-base text-white outline-none focus:border-accent'
							>
								<option value='1'>±1 %</option>
								<option value='2'>±2 %</option>
								<option value='5'>±5 %</option>
								<option value='10'>±10 %</option>
								<option value='0.5'>±0,5 %</option>
								<option value='0.25'>±0,25 %</option>
								<option value='0.1'>±0,1 %</option>
								<option value='0.05'>±0,05 %</option>
							</select>
						</label>
					</div>

					<p className='mt-4 text-sm text-[#8f9aa1]'>
						Цветовые полосы изменяются автоматически при изменении номинала,
						единицы измерения или допуска.
					</p>
				</div>
			)}
			{/* Выбор количества полос */}{' '}
			<div className='mb-8'>
				{' '}
				<h2 className='text-lg font-semibold text-white'>
					Цветовая маркировка{' '}
				</h2>
				<div className='mt-4 flex flex-wrap gap-2'>
					{[4, 5, 6].map(count => (
						<button
							key={count}
							type='button'
							onClick={() => changeBandCount(count as BandCount)}
							className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
								bandCount === count
									? 'border-accent bg-[#b89445] text-background-dark'
									: 'border-border bg-background-dark text-[#aeb7bd] hover:border-accent'
							}`}
						>
							{count} полосы
						</button>
					))}
				</div>
			</div>
			{/* Визуальный резистор */}
			<div className='mb-8 overflow-x-auto rounded-xl border border-border bg-background-dark p-6'>
				<div className='flex min-w-130 items-center justify-center'>
					<div className='h-px w-20 bg-zinc-400' />

					<div className='relative flex h-20 w-64 items-center justify-center'>
						<div className='absolute h-14 w-full rounded-[40%] border border-zinc-500 bg-[#d9c7a2]' />

						<div className='relative z-10 flex h-14 w-full items-stretch justify-around px-10'>
							{bandIndexes.map(index => {
								const color = getColor(bands[index])

								return (
									<div
										key={index}
										className='h-14 w-5 rounded-sm border-x border-black/20'
										style={{ backgroundColor: color.css }}
										title={color.label}
									/>
								)
							})}
						</div>
					</div>

					<div className='h-px w-20 bg-zinc-400' />
				</div>
			</div>
			{/* Выбор цветов */}
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{bandOptions.map((band, index) => (
					<ColorSelect
						key={`${band.label}-${index}`}
						label={band.label}
						value={bands[index]}
						options={band.options}
						onChange={value => updateBand(index, value)}
					/>
				))}
			</div>
			{/* Результат */}
			<div className='mt-8 rounded-xl border border-accent/30 bg-background-dark p-6'>
				<span className='text-xs font-bold uppercase tracking-[1.5px] text-accent'>
					Результат
				</span>

				<div className='mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2'>
					<span className='text-3xl font-bold text-white md:text-4xl'>
						{formatResistance(result.resistance)}
					</span>

					<span className='text-lg text-[#050606]'>±{result.tolerance}%</span>
				</div>

				<p className='mt-3 text-sm text-[#8f9aa1]'>
					Диапазон: {formatResistance(result.minimum)} —{' '}
					{formatResistance(result.maximum)}
				</p>

				{result.tcr !== undefined && (
					<p className='mt-2 text-sm text-[#8f9aa1]'>
						Температурный коэффициент: {result.tcr} ppm/°C
					</p>
				)}
			</div>
		</section>
	)
}
