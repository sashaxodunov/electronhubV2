'use client'

import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'

type ResistanceUnit = 'Ом' | 'кОм' | 'МОм'
type VoltageUnit = 'В' | 'мВ'

const resistanceMultipliers: Record<ResistanceUnit, number> = {
	Ом: 1,
	кОм: 1_000,
	МОм: 1_000_000
}

const voltageMultipliers: Record<VoltageUnit, number> = {
	В: 1,
	мВ: 0.001
}

function parseValue(value: string, multiplier: number): number {
	const numericValue = Number(value.replace(',', '.'))

	if (!Number.isFinite(numericValue) || numericValue < 0) {
		return 0
	}

	return numericValue * multiplier
}

function formatNumber(value: number): string {
	return value.toLocaleString('ru-RU', {
		maximumFractionDigits: 3
	})
}

function formatVoltage(value: number): string {
	if (value === 0) {
		return '0 В'
	}

	if (Math.abs(value) < 1) {
		return `${formatNumber(value * 1000)} мВ`
	}

	return `${formatNumber(value)} В`
}

function formatCurrent(value: number): string {
	if (value === 0) {
		return '0 А'
	}

	if (Math.abs(value) < 0.001) {
		return `${formatNumber(value * 1_000_000)} мкА`
	}

	if (Math.abs(value) < 1) {
		return `${formatNumber(value * 1000)} мА`
	}

	return `${formatNumber(value)} А`
}

function ResistorVertical({
	x,
	y,
	label,
	value
}: {
	x: number
	y: number
	label: string
	value: string
}) {
	return (
		<g>
			<line
				x1={x}
				y1={y - 42}
				x2={x}
				y2={y - 28}
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<path
				d={`
          M ${x} ${y - 28}
          L ${x - 12} ${y - 20}
          L ${x + 12} ${y - 8}
          L ${x - 12} ${y + 4}
          L ${x + 12} ${y + 16}
          L ${x} ${y + 28}
        `}
				fill='none'
				stroke='#d0ae68'
				strokeWidth='3'
				strokeLinejoin='round'
			/>

			<line
				x1={x}
				y1={y + 28}
				x2={x}
				y2={y + 42}
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<text
				x={x + 24}
				y={y - 2}
				fill='#ffffff'
				fontSize='14'
				fontWeight='600'
			>
				{label}
			</text>

			<text
				x={x + 24}
				y={y + 16}
				fill='#8f9aa1'
				fontSize='12'
			>
				{value}
			</text>
		</g>
	)
}

function VoltageIndicator({
	x,
	y,
	percentage
}: {
	x: number
	y: number
	percentage: number
}) {
	const clampedPercentage = Math.max(0, Math.min(100, percentage))

	const height = 110
	const filledHeight = height * (clampedPercentage / 100)

	return (
		<g aria-hidden='true'>
			<rect
				x={x - 8}
				y={y - height}
				width='16'
				height={height}
				rx='8'
				fill='#263640'
				stroke='#3b4a54'
			/>

			<rect
				x={x - 8}
				y={y - filledHeight}
				width='16'
				height={filledHeight}
				rx='8'
				fill='#d0ae68'
			/>

			<text
				x={x + 20}
				y={y - height + 5}
				fill='#66737b'
				fontSize='11'
			>
				Vout
			</text>

			<text
				x={x + 20}
				y={y - height + 22}
				fill='#ffffff'
				fontSize='12'
				fontWeight='600'
			>
				{formatNumber(clampedPercentage)}%
			</text>
		</g>
	)
}

export default function VoltageDividerCalculator() {
	const [inputVoltage, setInputVoltage] = useState('12')
	const [inputVoltageUnit, setInputVoltageUnit] = useState<VoltageUnit>('В')

	const [r1, setR1] = useState('10')
	const [r1Unit, setR1Unit] = useState<ResistanceUnit>('кОм')

	const [r2, setR2] = useState('10')
	const [r2Unit, setR2Unit] = useState<ResistanceUnit>('кОм')

	const calculation = useMemo(() => {
		const vin = parseValue(inputVoltage, voltageMultipliers[inputVoltageUnit])

		const resistance1 = parseValue(r1, resistanceMultipliers[r1Unit])

		const resistance2 = parseValue(r2, resistanceMultipliers[r2Unit])

		const totalResistance = resistance1 + resistance2

		if (
			vin <= 0 ||
			resistance1 <= 0 ||
			resistance2 <= 0 ||
			totalResistance <= 0
		) {
			return {
				vin,
				resistance1,
				resistance2,
				totalResistance: 0,
				vout: 0,
				current: 0,
				percentage: 0
			}
		}

		const vout = vin * (resistance2 / totalResistance)

		const current = vin / totalResistance

		const percentage = (vout / vin) * 100

		return {
			vin,
			resistance1,
			resistance2,
			totalResistance,
			vout,
			current,
			percentage
		}
	}, [inputVoltage, inputVoltageUnit, r1, r1Unit, r2, r2Unit])

	function reset() {
		setInputVoltage('12')
		setInputVoltageUnit('В')

		setR1('10')
		setR1Unit('кОм')

		setR2('10')
		setR2Unit('кОм')
	}

	const viewBoxWidth = 760

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Схема */}
			<div className='overflow-x-auto rounded-xl border border-border bg-background-dark p-4 md:p-6'>
				<div className='min-w-[760px]'>
					<svg
						viewBox={`0 0 ${viewBoxWidth} 360`}
						className='h-auto w-full'
						role='img'
						aria-label='Схема делителя напряжения'
					>
						{/* Верхний провод */}
						<line
							x1='170'
							y1='45'
							x2='380'
							y2='45'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* R1 */}
						<ResistorVertical
							x={380}
							y={115}
							label='R1'
							value={
								formatNumber(
									calculation.resistance1 / resistanceMultipliers[r1Unit]
								) + ` ${r1Unit}`
							}
						/>

						{/* Точка Vout */}
						<circle
							cx='380'
							cy='185'
							r='5'
							fill='#d0ae68'
						/>

						{/* R2 */}
						<ResistorVertical
							x={380}
							y={255}
							label='R2'
							value={
								formatNumber(
									calculation.resistance2 / resistanceMultipliers[r2Unit]
								) + ` ${r2Unit}`
							}
						/>

						{/* Нижний провод */}
						<line
							x1='380'
							y1='297'
							x2='380'
							y2='315'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						<line
							x1='170'
							y1='315'
							x2='380'
							y2='315'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Источник питания */}
						<line
							x1='170'
							y1='45'
							x2='170'
							y2='315'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						<line
							x1='156'
							y1='125'
							x2='184'
							y2='125'
							stroke='#d0ae68'
							strokeWidth='3'
							strokeLinecap='round'
						/>

						<line
							x1='162'
							y1='235'
							x2='178'
							y2='235'
							stroke='#d0ae68'
							strokeWidth='3'
							strokeLinecap='round'
						/>

						<text
							x='192'
							y='121'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							+
						</text>

						<text
							x='192'
							y='240'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							−
						</text>

						{/* Vin */}
						<text
							x='120'
							y='185'
							textAnchor='middle'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							Vin
						</text>

						<text
							x='120'
							y='203'
							textAnchor='middle'
							fill='#8f9aa1'
							fontSize='12'
						>
							{formatVoltage(calculation.vin)}
						</text>

						{/* Vout */}
						<line
							x1='380'
							y1='185'
							x2='550'
							y2='185'
							stroke='#7d898f'
							strokeWidth='2'
							strokeDasharray='5 5'
						/>

						<circle
							cx='550'
							cy='185'
							r='5'
							fill='#d0ae68'
						/>

						<text
							x='570'
							y='180'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							Vout
						</text>

						<text
							x='570'
							y='198'
							fill='#8f9aa1'
							fontSize='12'
						>
							{formatVoltage(calculation.vout)}
						</text>

						{/* Индикатор выходного напряжения */}
						<VoltageIndicator
							x={650}
							y={255}
							percentage={calculation.percentage}
						/>

						{/* Формула */}
						<text
							x='380'
							y='345'
							textAnchor='middle'
							fill='#66737b'
							fontSize='12'
						>
							Vout = Vin × R2 / (R1 + R2)
						</text>
					</svg>
				</div>
			</div>

			{/* Входное напряжение */}
			<div className='mt-8'>
				<h2 className='mb-4 text-lg font-semibold text-white'>
					Входное напряжение
				</h2>

				<div className='grid gap-3 md:grid-cols-[1fr_150px]'>
					<label className='flex flex-col gap-2'>
						<span className='text-sm text-[#66737b]'>Vin</span>

						<input
							type='text'
							inputMode='decimal'
							value={inputVoltage}
							onChange={event => setInputVoltage(event.target.value)}
							className='h-11 rounded-lg border border-border bg-background-dark px-3 text-sm text-white outline-none focus:border-[#b89445]'
						/>
					</label>

					<label className='flex flex-col gap-2'>
						<span className='text-sm text-[#66737b]'>Единица</span>

						<select
							value={inputVoltageUnit}
							onChange={event =>
								setInputVoltageUnit(event.target.value as VoltageUnit)
							}
							className='h-11 rounded-lg border border-border bg-background-dark px-3 text-sm text-white outline-none focus:border-[#b89445]'
						>
							<option value='В'>В</option>
							<option value='мВ'>мВ</option>
						</select>
					</label>
				</div>
			</div>

			{/* Резисторы */}
			<div className='mt-8'>
				<h2 className='mb-4 text-lg font-semibold text-white'>Резисторы</h2>

				<div className='grid gap-4 md:grid-cols-2'>
					{/* R1 */}
					<div className='rounded-lg border border-border bg-background-dark p-4'>
						<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
							Верхний резистор
						</span>

						<div className='mt-4 grid gap-3 sm:grid-cols-[1fr_120px]'>
							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>R1</span>

								<input
									type='text'
									inputMode='decimal'
									value={r1}
									onChange={event => setR1(event.target.value)}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								/>
							</label>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Единица</span>

								<select
									value={r1Unit}
									onChange={event =>
										setR1Unit(event.target.value as ResistanceUnit)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								>
									<option value='Ом'>Ом</option>
									<option value='кОм'>кОм</option>
									<option value='МОм'>МОм</option>
								</select>
							</label>
						</div>
					</div>

					{/* R2 */}
					<div className='rounded-lg border border-border bg-background-dark p-4'>
						<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
							Нижний резистор
						</span>

						<div className='mt-4 grid gap-3 sm:grid-cols-[1fr_120px]'>
							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>R2</span>

								<input
									type='text'
									inputMode='decimal'
									value={r2}
									onChange={event => setR2(event.target.value)}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								/>
							</label>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Единица</span>

								<select
									value={r2Unit}
									onChange={event =>
										setR2Unit(event.target.value as ResistanceUnit)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								>
									<option value='Ом'>Ом</option>
									<option value='кОм'>кОм</option>
									<option value='МОм'>МОм</option>
								</select>
							</label>
						</div>
					</div>
				</div>
			</div>

			{/* Результат */}
			<div className='mt-8 grid gap-4 md:grid-cols-3'>
				<div className='rounded-xl border border-[#b89445]/30 bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
						Vout
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatVoltage(calculation.vout)}
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>выходное напряжение</p>
				</div>

				<div className='rounded-xl border border-border bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#66737b]'>
						Ток
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatCurrent(calculation.current)}
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>ток через делитель</p>
				</div>

				<div className='rounded-xl border border-border bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#66737b]'>
						Доля
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatNumber(calculation.percentage)}%
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>Vout от Vin</p>
				</div>
			</div>

			{/* Сброс */}
			<div className='mt-5 flex justify-end'>
				<button
					type='button'
					onClick={reset}
					className='inline-flex items-center gap-2 text-sm text-[#66737b] transition-colors hover:text-[#aeb7bd]'
				>
					<RotateCcw className='size-4' />
					Сбросить
				</button>
			</div>
		</section>
	)
}
