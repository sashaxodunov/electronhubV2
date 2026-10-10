'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type ESeries = 'E6' | 'E12' | 'E24' | 'E48' | 'E96'
type ResistanceUnit = 'Ом' | 'кОм' | 'МОм'

const seriesValues: Record<ESeries, number[]> = {
	E6: [10, 15, 22, 33, 47, 68],

	E12: [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82],

	E24: [
		10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56,
		62, 68, 75, 82, 91
	],

	E48: [
		10, 10.5, 11, 11.5, 12, 12.7, 13.3, 14, 15, 15.4, 16.2, 16.9, 17.8, 18.7,
		19.6, 20.5, 21.5, 22.6, 23.7, 24.9, 26.1, 27.4, 28.7, 30.1, 31.6, 33.2,
		34.8, 36.5, 38.3, 40.2, 42.2, 44.2, 46.4, 48.7, 51.1, 53.6, 56.2, 59, 61.9,
		64.9, 68.1, 71.5, 75, 78.7, 82.5, 86.6, 90.9, 95.3
	],

	E96: [
		10, 10.2, 10.5, 10.7, 11, 11.3, 11.5, 11.8, 12.1, 12.4, 12.7, 13, 13.3,
		13.7, 14, 14.3, 14.7, 15, 15.4, 15.8, 16.2, 16.5, 16.9, 17.4, 17.8, 18.2,
		18.7, 19.1, 19.6, 20, 20.5, 21, 21.5, 22.1, 22.6, 23.2, 23.7, 24.3, 24.9,
		25.5, 26.1, 26.7, 27.4, 28, 28.7, 29.4, 30.1, 30.9, 31.6, 32.4, 33.2, 34,
		34.8, 35.7, 36.5, 37.4, 38.3, 39.2, 40.2, 41.2, 42.2, 43.2, 44.2, 45.3,
		46.4, 47.5, 48.7, 49.9, 51.1, 52.3, 53.6, 54.9, 56.2, 57.6, 59, 60.4, 61.9,
		63.4, 64.9, 66.5, 68.1, 69.8, 71.5, 73.2, 75, 76.8, 78.7, 80.6, 82.5, 84.5,
		86.6, 88.7, 90.9, 93.1, 95.3, 97.6
	]
}

const units: Record<ResistanceUnit, number> = {
	Ом: 1,
	кОм: 1_000,
	МОм: 1_000_000
}

function formatResistance(value: number): string {
	if (value >= 1_000_000) {
		return `${formatNumber(value / 1_000_000)} МОм`
	}

	if (value >= 1_000) {
		return `${formatNumber(value / 1_000)} кОм`
	}

	return `${formatNumber(value)} Ом`
}

function formatNumber(value: number): string {
	return value
		.toLocaleString('ru-RU', {
			maximumFractionDigits: 3
		})
		.replace(/\s/g, ' ')
}

function getStandardValues(series: ESeries): number[] {
	return seriesValues[series]
}

function findNearestValues(resistance: number, series: ESeries) {
	const baseValues = getStandardValues(series)

	const values: number[] = []

	for (let exponent = -2; exponent <= 8; exponent++) {
		const multiplier = Math.pow(10, exponent)

		for (const base of baseValues) {
			values.push(base * multiplier)
		}
	}

	values.sort((a, b) => a - b)

	let lower = values[0]
	let upper = values[values.length - 1]

	for (const value of values) {
		if (value <= resistance) {
			lower = value
		}

		if (value >= resistance) {
			upper = value
			break
		}
	}

	const lowerDifference = Math.abs(resistance - lower)
	const upperDifference = Math.abs(upper - resistance)

	const nearest = lowerDifference <= upperDifference ? lower : upper

	return {
		lower,
		upper,
		nearest
	}
}

export default function ResistorStandardValueCalculator() {
	const [series, setSeries] = useState<ESeries>('E24')
	const [value, setValue] = useState('4.7')
	const [unit, setUnit] = useState<ResistanceUnit>('кОм')

	const result = useMemo(() => {
		const inputValue = Number(value.replace(',', '.'))

		if (!Number.isFinite(inputValue) || inputValue <= 0) {
			return null
		}

		const resistance = inputValue * units[unit]

		const nearestValues = findNearestValues(resistance, series)

		const difference = ((nearestValues.nearest - resistance) / resistance) * 100

		return {
			resistance,
			...nearestValues,
			difference
		}
	}, [series, unit, value])

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Ряд E */}
			<div>
				<span className='text-sm font-medium text-[#66737b]'>
					Стандартный ряд
				</span>

				<div className='mt-3 flex flex-wrap gap-2'>
					{(['E6', 'E12', 'E24', 'E48', 'E96'] as ESeries[]).map(item => (
						<button
							key={item}
							type='button'
							onClick={() => setSeries(item)}
							className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
								series === item
									? 'border-[#b89445] bg-[#b89445] text-background-dark'
									: 'border-border bg-background-dark text-[#66737b] hover:border-[#b89445] hover:text-[#8f9aa1]'
							}`}
						>
							{item}
						</button>
					))}
				</div>
			</div>

			{/* Ввод сопротивления */}
			<div className='mt-7 grid gap-4 md:grid-cols-[1fr_180px]'>
				<label className='flex flex-col gap-2'>
					<span className='text-sm font-medium text-[#66737b]'>
						Требуемое сопротивление
					</span>

					<input
						type='text'
						inputMode='decimal'
						value={value}
						onChange={event => setValue(event.target.value)}
						placeholder='4,7'
						className='h-11 rounded-lg border border-border bg-background-dark px-3 text-sm text-white outline-none transition-colors placeholder:text-[#4f5b62] focus:border-[#b89445]'
					/>
				</label>

				<label className='flex flex-col gap-2'>
					<span className='text-sm font-medium text-[#66737b]'>Единица</span>

					<select
						value={unit}
						onChange={event => setUnit(event.target.value as ResistanceUnit)}
						className='h-11 rounded-lg border border-border bg-background-dark px-3 text-sm text-white outline-none focus:border-[#b89445]'
					>
						<option value='Ом'>Ом</option>
						<option value='кОм'>кОм</option>
						<option value='МОм'>МОм</option>
					</select>
				</label>
			</div>

			{/* Результат */}
			{result && (
				<div className='mt-8 rounded-xl border border-[#b89445]/30 bg-background-dark p-6'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
						Ближайший номинал
					</span>

					<div className='mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2'>
						<span className='text-3xl font-bold text-white md:text-4xl'>
							{formatResistance(result.nearest)}
						</span>

						<span
							className={`text-sm ${
								result.difference > 0 ? 'text-[#d0ae68]' : 'text-[#8f9aa1]'
							}`}
						>
							{result.difference > 0 ? '+' : ''}
							{formatNumber(result.difference)} %
						</span>
					</div>

					<p className='mt-3 text-sm text-[#7d898f]'>
						Требуемое значение:{' '}
						<span className='text-[#aeb7bd]'>
							{formatResistance(result.resistance)}
						</span>
					</p>

					<div className='mt-5 grid gap-3 sm:grid-cols-2'>
						<div className='rounded-lg border border-border bg-background-light p-4'>
							<span className='text-xs text-[#66737b]'>Ближайший меньший</span>

							<p className='mt-1 font-semibold text-white'>
								{formatResistance(result.lower)}
							</p>
						</div>

						<div className='rounded-lg border border-border bg-background-light p-4'>
							<span className='text-xs text-[#66737b]'>Ближайший больший</span>

							<p className='mt-1 font-semibold text-white'>
								{formatResistance(result.upper)}
							</p>
						</div>
					</div>

					<Link
						href={`/calculators/resistors/color-code?resistance=${result.nearest}`}
						className='mt-5 inline-flex items-center rounded-lg border border-[#b89445] px-4 py-2.5 text-sm font-semibold text-[#d0ae68] transition-colors hover:bg-[#b89445] hover:text-background-dark'
					>
						Перейти к цветовой маркировке →
					</Link>
				</div>
			)}
		</section>
	)
}
