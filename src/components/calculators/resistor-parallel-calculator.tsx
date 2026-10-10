'use client'

import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

type ResistanceUnit = 'Ом' | 'кОм' | 'МОм'

type Resistor = {
	id: number
	value: string
	unit: ResistanceUnit
}

const unitMultipliers: Record<ResistanceUnit, number> = {
	Ом: 1,
	кОм: 1_000,
	МОм: 1_000_000
}

const initialResistors: Resistor[] = [
	{ id: 1, value: '100', unit: 'Ом' },
	{ id: 2, value: '220', unit: 'Ом' },
	{ id: 3, value: '470', unit: 'Ом' }
]

function parseResistance(value: string, unit: ResistanceUnit): number {
	const numericValue = Number(value.replace(',', '.'))

	if (!Number.isFinite(numericValue) || numericValue <= 0) {
		return 0
	}

	return numericValue * unitMultipliers[unit]
}

function formatNumber(value: number): string {
	return value.toLocaleString('ru-RU', {
		maximumFractionDigits: 3
	})
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

function ResistorSymbol({
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
				y1={y - 35}
				x2={x}
				y2={y - 22}
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<path
				d={`
          M ${x} ${y - 22}
          L ${x - 12} ${y - 14}
          L ${x + 12} ${y - 2}
          L ${x - 12} ${y + 10}
          L ${x + 12} ${y + 22}
          L ${x} ${y + 30}
        `}
				fill='none'
				stroke='#d0ae68'
				strokeWidth='3'
				strokeLinejoin='round'
			/>

			<line
				x1={x}
				y1={y + 30}
				x2={x}
				y2={y + 43}
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<text
				x={x + 25}
				y={y - 4}
				fill='#ffffff'
				fontSize='14'
				fontWeight='600'
			>
				{label}
			</text>

			<text
				x={x + 25}
				y={y + 14}
				fill='#8f9aa1'
				fontSize='12'
			>
				{value}
			</text>
		</g>
	)
}

function CurrentFlow({ x, y, delay }: { x: number; y: number; delay: string }) {
	return (
		<circle
			cx={x}
			cy={y - 30}
			r='3'
			fill='#d0ae68'
		>
			<animate
				attributeName='cy'
				values={`${y - 30};${y + 30};${y - 30}`}
				dur='2s'
				begin={delay}
				repeatCount='indefinite'
			/>
		</circle>
	)
}

export default function ResistorParallelCalculator() {
	const [resistors, setResistors] = useState<Resistor[]>(initialResistors)

	const totalResistance = useMemo(() => {
		const validResistors = resistors
			.map(resistor => parseResistance(resistor.value, resistor.unit))
			.filter(value => value > 0)

		if (validResistors.length === 0) {
			return 0
		}

		const reciprocalSum = validResistors.reduce(
			(sum, value) => sum + 1 / value,
			0
		)

		return reciprocalSum > 0 ? 1 / reciprocalSum : 0
	}, [resistors])

	function updateResistor(id: number, field: 'value' | 'unit', value: string) {
		setResistors(current =>
			current.map(resistor =>
				resistor.id === id ? { ...resistor, [field]: value } : resistor
			)
		)
	}

	function addResistor() {
		if (resistors.length >= 6) return

		setResistors(current => [
			...current,
			{
				id: Date.now(),
				value: '1',
				unit: 'кОм'
			}
		])
	}

	function removeResistor(id: number) {
		if (resistors.length <= 2) return

		setResistors(current => current.filter(resistor => resistor.id !== id))
	}

	function reset() {
		setResistors(initialResistors)
	}

	const visibleResistors = resistors.slice(0, 6)

	const branchCount = visibleResistors.length
	const branchSpacing = 150
	const viewBoxWidth = Math.max(760, branchCount * branchSpacing + 100)

	const leftRail = 90
	const rightRail = viewBoxWidth - 90

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Схема */}
			<div className='overflow-x-auto rounded-xl border border-border bg-background-dark p-4 md:p-6'>
				<div className='min-w-[760px]'>
					<svg
						viewBox={`0 0 ${viewBoxWidth} 300`}
						className='h-auto w-full'
						role='img'
						aria-label='Схема параллельного соединения резисторов'
					>
						{/* Верхняя шина */}
						<line
							x1={leftRail}
							y1='70'
							x2={rightRail}
							y2='70'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Нижняя шина */}
						<line
							x1={leftRail}
							y1='230'
							x2={rightRail}
							y2='230'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Левая точка */}
						<circle
							cx={leftRail}
							cy='70'
							r='5'
							fill='#d0ae68'
						/>

						{/* Правая точка */}
						<circle
							cx={rightRail}
							cy='230'
							r='5'
							fill='#d0ae68'
						/>

						{/* Ветви */}
						{visibleResistors.map((resistor, index) => {
							const x =
								leftRail +
								((rightRail - leftRail) / (branchCount + 1)) * (index + 1)

							const resistorY = 150

							return (
								<g key={resistor.id}>
									{/* Верхнее подключение */}
									<line
										x1={x}
										y1='70'
										x2={x}
										y2='115'
										stroke='#7d898f'
										strokeWidth='2'
									/>

									{/* Резистор */}
									<ResistorSymbol
										x={x}
										y={resistorY}
										label={`R${index + 1}`}
										value={formatResistance(
											parseResistance(resistor.value, resistor.unit)
										)}
									/>

									{/* Нижнее подключение */}
									<line
										x1={x}
										y1='193'
										x2={x}
										y2='230'
										stroke='#7d898f'
										strokeWidth='2'
									/>

									{/* Ток в ветви */}
									<CurrentFlow
										x={x}
										y={resistorY}
										delay={`${index * 0.25}s`}
									/>
								</g>
							)
						})}

						{/* Подписи шин */}
						<text
							x={leftRail - 18}
							y='58'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							+
						</text>

						<text
							x={leftRail - 18}
							y='248'
							fill='#ffffff'
							fontSize='14'
							fontWeight='600'
						>
							−
						</text>

						{/* Направление тока */}
						<text
							x={leftRail + 10}
							y='52'
							fill='#66737b'
							fontSize='11'
						>
							I →
						</text>

						{/* Формула */}
						<text
							x={viewBoxWidth / 2}
							y='280'
							textAnchor='middle'
							fill='#66737b'
							fontSize='12'
						>
							1 / Rобщ = 1 / R1 + 1 / R2 + 1 / R3 + …
						</text>
					</svg>
				</div>
			</div>

			{/* Управление */}
			<div className='mt-8'>
				<div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
					<div>
						<h2 className='text-lg font-semibold text-white'>Резисторы</h2>

						<p className='mt-1 text-sm text-[#66737b]'>
							Добавьте от 2 до 6 параллельных ветвей.
						</p>
					</div>

					<button
						type='button'
						onClick={addResistor}
						disabled={resistors.length >= 6}
						className='inline-flex items-center gap-2 rounded-lg border border-[#b89445] px-4 py-2.5 text-sm font-semibold text-[#d0ae68] transition-colors hover:bg-[#b89445] hover:text-[#182127] disabled:cursor-not-allowed disabled:opacity-40'
					>
						<Plus className='size-4' />
						Добавить резистор
					</button>
				</div>

				<div className='space-y-3'>
					{resistors.map((resistor, index) => (
						<div
							key={resistor.id}
							className='grid gap-3 rounded-lg border border-border bg-background-dark p-4 md:grid-cols-[80px_1fr_150px_auto] md:items-end'
						>
							<div>
								<span className='text-xs font-semibold uppercase tracking-[1px] text-[#66737b]'>
									Ветка
								</span>

								<p className='mt-1 font-semibold text-white'>R{index + 1}</p>
							</div>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Сопротивление</span>

								<input
									type='text'
									inputMode='decimal'
									value={resistor.value}
									onChange={event =>
										updateResistor(resistor.id, 'value', event.target.value)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								/>
							</label>

							<label className='flex flex-col gap-2'>
								<span className='text-sm text-[#66737b]'>Единица</span>

								<select
									value={resistor.unit}
									onChange={event =>
										updateResistor(resistor.id, 'unit', event.target.value)
									}
									className='h-11 rounded-lg border border-border bg-background-light px-3 text-sm text-white outline-none focus:border-[#b89445]'
								>
									<option value='Ом'>Ом</option>
									<option value='кОм'>кОм</option>
									<option value='МОм'>МОм</option>
								</select>
							</label>

							<button
								type='button'
								onClick={() => removeResistor(resistor.id)}
								disabled={resistors.length <= 2}
								aria-label={`Удалить R${index + 1}`}
								className='flex h-11 items-center justify-center rounded-lg border border-border px-3 text-[#66737b] transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30'
							>
								<Trash2 className='size-4' />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Результат */}
			<div className='mt-8 rounded-xl border border-[#b89445]/30 bg-background-dark p-6'>
				<span className='text-xs font-bold uppercase tracking-[1.5px] text-[#b89445]'>
					Результат
				</span>

				<div className='mt-3 flex flex-wrap items-baseline gap-3'>
					<span className='text-3xl font-bold text-white md:text-4xl'>
						{formatResistance(totalResistance)}
					</span>

					<span className='text-sm text-[#66737b]'>общее сопротивление</span>
				</div>

				<p className='mt-3 text-sm text-[#7d898f]'>
					При параллельном соединении общее сопротивление всегда меньше
					сопротивления самой малой ветви.
				</p>
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
