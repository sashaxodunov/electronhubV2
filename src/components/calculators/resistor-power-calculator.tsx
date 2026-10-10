'use client'

import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'

type ResistanceUnit = 'Ом' | 'кОм' | 'МОм'
type VoltageUnit = 'В' | 'мВ'
type CurrentUnit = 'А' | 'мА' | 'мкА'
type CalculationMode = 'voltage-resistance' | 'current-resistance'

const resistanceMultipliers: Record<ResistanceUnit, number> = {
	Ом: 1,
	кОм: 1_000,
	МОм: 1_000_000
}

const voltageMultipliers: Record<VoltageUnit, number> = {
	В: 1,
	мВ: 0.001
}

const currentMultipliers: Record<CurrentUnit, number> = {
	А: 1,
	мА: 0.001,
	мкА: 0.000001
}

const standardPowerRatings = [0.125, 0.25, 0.5, 1, 2, 3, 5, 10, 25, 50, 100]

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

function formatPower(value: number): string {
	if (value === 0) {
		return '0 Вт'
	}

	if (Math.abs(value) < 0.001) {
		return `${formatNumber(value * 1_000_000)} мкВт`
	}

	if (Math.abs(value) < 1) {
		return `${formatNumber(value * 1_000)} мВт`
	}

	return `${formatNumber(value)} Вт`
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

function formatResistance(value: number): string {
	if (value === 0) {
		return '0 Ом'
	}

	if (value >= 1_000_000) {
		return `${formatNumber(value / 1_000_000)} МОм`
	}

	if (value >= 1_000) {
		return `${formatNumber(value / 1_000)} кОм`
	}

	return `${formatNumber(value)} Ом`
}

function getRecommendedPower(requiredPower: number): number {
	return (
		standardPowerRatings.find(rating => rating >= requiredPower * 2) ??
		standardPowerRatings[standardPowerRatings.length - 1]!
	)
}

function ResistorPowerSymbol({
	power,
	x = 360,
	y = 145
}: {
	power: number
	x?: number
	y?: number
}) {
	const glow = power > 0 ? Math.min(1, power / 10) : 0

	return (
		<g aria-hidden='true'>
			{/* Верхний провод */}
			<line
				x1={x}
				y1='45'
				x2={x}
				y2={y - 38}
				stroke='#7d898f'
				strokeWidth='2'
			/>

			{/* Резистор */}
			<path
				d={`
          M ${x} ${y - 38}
          L ${x - 14} ${y - 26}
          L ${x + 14} ${y - 12}
          L ${x - 14} ${y + 2}
          L ${x + 14} ${y + 16}
          L ${x} ${y + 30}
        `}
				fill='none'
				stroke='#d0ae68'
				strokeWidth='4'
				strokeLinejoin='round'
				opacity={0.7 + glow * 0.3}
			/>

			{/* Нижний провод */}
			<line
				x1={x}
				y1={y + 30}
				x2={x}
				y2='245'
				stroke='#7d898f'
				strokeWidth='2'
			/>

			{/* Индикатор нагрева */}
			<circle
				cx={x}
				cy={y}
				r={28 + glow * 10}
				fill='none'
				stroke='#d0ae68'
				strokeWidth='2'
				opacity={glow * 0.35}
			/>

			<text
				x={x + 38}
				y={y - 5}
				fill='#ffffff'
				fontSize='15'
				fontWeight='600'
			>
				R
			</text>

			<text
				x={x + 38}
				y={y + 15}
				fill='#8f9aa1'
				fontSize='12'
			>
				{formatPower(power)}
			</text>

			{/* Направление тока */}
			<text
				x={x - 42}
				y='75'
				fill='#66737b'
				fontSize='11'
			>
				I →
			</text>
		</g>
	)
}

export default function ResistorPowerCalculator() {
	const [mode, setMode] = useState<CalculationMode>('voltage-resistance')

	const [voltage, setVoltage] = useState('12')
	const [voltageUnit, setVoltageUnit] = useState<VoltageUnit>('В')

	const [current, setCurrent] = useState('100')
	const [currentUnit, setCurrentUnit] = useState<CurrentUnit>('мА')

	const [resistance, setResistance] = useState('100')

	const [resistanceUnit, setResistanceUnit] = useState<ResistanceUnit>('Ом')

	const [safetyFactor, setSafetyFactor] = useState('2')

	const calculation = useMemo(() => {
		const r = parseValue(resistance, resistanceMultipliers[resistanceUnit])

		const enteredVoltage = parseValue(voltage, voltageMultipliers[voltageUnit])

		const enteredCurrent = parseValue(current, currentMultipliers[currentUnit])

		let voltageValue = enteredVoltage
		let currentValue = enteredCurrent

		if (mode === 'voltage-resistance') {
			if (r > 0 && voltageValue >= 0) {
				currentValue = voltageValue / r
			}
		} else if (r > 0 && currentValue >= 0) {
			voltageValue = currentValue * r
		}

		const power = voltageValue * currentValue

		const factor = Number(safetyFactor.replace(',', '.'))

		const validFactor = Number.isFinite(factor) && factor > 0 ? factor : 2

		const recommendedPower = getRecommendedPower(power * validFactor)

		return {
			resistance: r,
			voltage: voltageValue,
			current: currentValue,
			power,
			safetyFactor: validFactor,
			requiredPower: power * validFactor,
			recommendedPower
		}
	}, [
		mode,
		voltage,
		voltageUnit,
		current,
		currentUnit,
		resistance,
		resistanceUnit,
		safetyFactor
	])

	function reset() {
		setMode('voltage-resistance')

		setVoltage('12')
		setVoltageUnit('В')

		setCurrent('100')
		setCurrentUnit('мА')

		setResistance('100')
		setResistanceUnit('Ом')

		setSafetyFactor('2')
	}

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Режим расчёта */}
			<div className='mb-8'>
				<h2 className='mb-4 text-lg font-semibold text-white'>
					Исходные данные
				</h2>

				<div className='flex flex-wrap gap-2'>
					<button
						type='button'
						onClick={() => setMode('voltage-resistance')}
						className={
							mode === 'voltage-resistance'
								? 'rounded-lg border border-[#b89445] bg-[#b89445] px-4 py-2.5 text-sm font-semibold text-[#182127]'
								: 'rounded-lg border border-border bg-background-dark px-4 py-2.5 text-sm font-semibold text-[#66737b] transition-colors hover:border-[#b89445] hover:text-[#8f9aa1]'
						}
					>
						Напряжение + сопротивление
					</button>

					<button
						type='button'
						onClick={() => setMode('current-resistance')}
						className={
							mode === 'current-resistance'
								? 'rounded-lg border border-[#b89445] bg-[#b89445] px-4 py-2.5 text-sm font-semibold text-[#182127]'
								: 'rounded-lg border border-border bg-background-dark px-4 py-2.5 text-sm font-semibold text-[#66737b] transition-colors hover:border-[#b89445] hover:text-[#8f9aa1]'
						}
					>
						Ток + сопротивление
					</button>
				</div>
			</div>

			{/* Схема */}
			<div className='overflow-x-auto rounded-xl border border-border bg-background-dark p-4 md:p-6'>
				<div className='min-w-[680px]'>
					<svg
						viewBox='0 0 680 300'
						className='h-auto w-full'
						role='img'
						aria-label='Схема резистора и расчёта мощности'
					>
						{/* Верхний провод */}
						<line
							x1='180'
							y1='45'
							x2='360'
							y2='45'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Источник */}
						<line
							x1='180'
							y1='45'
							x2='180'
							y2='245'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						<line
							x1='166'
							y1='100'
							x2='194'
							y2='100'
							stroke='#d0ae68'
							strokeWidth='3'
							strokeLinecap='round'
						/>

						<line
							x1='172'
							y1='190'
							x2='188'
							y2='190'
							stroke='#d0ae68'
							strokeWidth='3'
							strokeLinecap='round'
						/>

						<text
							x='202'
							y='96'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							+
						</text>

						<text
							x='202'
							y='195'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							−
						</text>

						<text
							x='135'
							y='148'
							fill='#ffffff'
							fontSize='13'
							textAnchor='middle'
						>
							{formatVoltage(calculation.voltage)}
						</text>

						{/* Резистор */}
						<ResistorPowerSymbol power={calculation.power} />

						{/* Нижний провод */}
						<line
							x1='360'
							y1='245'
							x2='180'
							y2='245'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Информация справа */}
						<text
							x='475'
							y='80'
							fill='#66737b'
							fontSize='11'
						>
							МОЩНОСТЬ
						</text>

						<text
							x='475'
							y='108'
							fill='#ffffff'
							fontSize='22'
							fontWeight='600'
						>
							{formatPower(calculation.power)}
						</text>

						<text
							x='475'
							y='145'
							fill='#66737b'
							fontSize='11'
						>
							ТОК
						</text>

						<text
							x='475'
							y='172'
							fill='#ffffff'
							fontSize='16'
							fontWeight='600'
						>
							{formatCurrent(calculation.current)}
						</text>

						<text
							x='475'
							y='205'
							fill='#66737b'
							fontSize='11'
						>
							НАПРЯЖЕНИЕ
						</text>

						<text
							x='475'
							y='232'
							fill='#ffffff'
							fontSize='16'
							fontWeight='600'
						>
							{formatVoltage(calculation.voltage)}
						</text>
					</svg>
				</div>
			</div>

			{/* Параметры */}
			<div className='mt-8 grid gap-4 md:grid-cols-2'>
				{/* Напряжение */}
				{mode === 'voltage-resistance' && (
					<div className='rounded-lg border border-border bg-background-dark p-4'>
						<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
							Напряжение
						</span>

						<div className='mt-4 grid gap-3 sm:grid-cols-[1fr_110px]'>
							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>U</span>

								<input
									type='text'
									inputMode='decimal'
									value={voltage}
									onChange={event => setVoltage(event.target.value)}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								/>
							</label>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Единица</span>

								<select
									value={voltageUnit}
									onChange={event =>
										setVoltageUnit(event.target.value as VoltageUnit)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								>
									<option value='В'>В</option>
									<option value='мВ'>мВ</option>
								</select>
							</label>
						</div>
					</div>
				)}

				{/* Ток */}
				{mode === 'current-resistance' && (
					<div className='rounded-lg border border-border bg-background-dark p-4'>
						<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
							Сила тока
						</span>

						<div className='mt-4 grid gap-3 sm:grid-cols-[1fr_110px]'>
							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>I</span>

								<input
									type='text'
									inputMode='decimal'
									value={current}
									onChange={event => setCurrent(event.target.value)}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								/>
							</label>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Единица</span>

								<select
									value={currentUnit}
									onChange={event =>
										setCurrentUnit(event.target.value as CurrentUnit)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								>
									<option value='А'>А</option>
									<option value='мА'>мА</option>
									<option value='мкА'>мкА</option>
								</select>
							</label>
						</div>
					</div>
				)}

				{/* Сопротивление */}
				<div className='rounded-lg border border-border bg-background-dark p-4'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
						Сопротивление
					</span>

					<div className='mt-4 grid gap-3 sm:grid-cols-[1fr_110px]'>
						<label className='flex flex-col gap-2'>
							<span className='text-sm text-[#66737b]'>R</span>

							<input
								type='text'
								inputMode='decimal'
								value={resistance}
								onChange={event => setResistance(event.target.value)}
								className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
							/>
						</label>

						<label className='flex flex-col gap-2'>
							<span className='text-sm text-[#66737b]'>Единица</span>

							<select
								value={resistanceUnit}
								onChange={event =>
									setResistanceUnit(event.target.value as ResistanceUnit)
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

			{/* Запас мощности */}
			<div className='mt-4 rounded-lg border border-border bg-background-dark p-4'>
				<label className='flex flex-col gap-2'>
					<span className='text-sm font-medium text-white'>Запас мощности</span>

					<select
						value={safetyFactor}
						onChange={event => setSafetyFactor(event.target.value)}
						className='h-11 max-w-xs rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
					>
						<option value='1.25'>1,25× — минимальный запас</option>
						<option value='1.5'>1,5× — рекомендуемый запас</option>
						<option value='2'>2× — стандартный запас</option>
						<option value='3'>3× — большой запас</option>
					</select>
				</label>
			</div>

			{/* Результат */}
			<div className='mt-8 grid gap-4 md:grid-cols-3'>
				<div className='rounded-xl border border-[#b89445]/30 bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
						Мощность
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatPower(calculation.power)}
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>
						фактическая рассеиваемая мощность
					</p>
				</div>

				<div className='rounded-xl border border-border bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#66737b]'>
						С запасом
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatPower(calculation.requiredPower)}
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>расчётная мощность</p>
				</div>

				<div className='rounded-xl border border-border bg-background-dark p-5'>
					<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#66737b]'>
						Резистор
					</span>

					<p className='mt-3 text-3xl font-bold text-white'>
						{formatPower(calculation.recommendedPower)}
					</p>

					<p className='mt-2 text-sm text-[#66737b]'>
						рекомендуемая номинальная мощность
					</p>
				</div>
			</div>

			{/* Дополнительные параметры */}
			<div className='mt-5 grid gap-3 rounded-xl border border-border bg-background-dark p-5 md:grid-cols-3'>
				<div>
					<span className='text-xs text-[#66737b]'>Напряжение</span>

					<p className='mt-1 font-semibold text-white'>
						{formatVoltage(calculation.voltage)}
					</p>
				</div>

				<div>
					<span className='text-xs text-[#66737b]'>Ток</span>

					<p className='mt-1 font-semibold text-white'>
						{formatCurrent(calculation.current)}
					</p>
				</div>

				<div>
					<span className='text-xs text-[#66737b]'>Сопротивление</span>

					<p className='mt-1 font-semibold text-white'>
						{formatResistance(calculation.resistance)}
					</p>
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
