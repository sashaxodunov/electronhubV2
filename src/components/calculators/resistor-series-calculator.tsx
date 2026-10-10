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

	if (!Number.isFinite(numericValue) || numericValue < 0) {
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
	label,
	value
}: {
	x: number
	label: string
	value: string
}) {
	return (
		<g>
			<line
				x1={x - 55}
				y1='50'
				x2={x - 30}
				y2='50'
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<path
				d={`
          M ${x - 30} 50
          L ${x - 22} 38
          L ${x - 10} 62
          L ${x + 2} 38
          L ${x + 14} 62
          L ${x + 26} 38
          L ${x + 34} 50
        `}
				fill='none'
				stroke='#d0ae68'
				strokeWidth='3'
				strokeLinejoin='round'
			/>

			<line
				x1={x + 34}
				y1='50'
				x2={x + 55}
				y2='50'
				stroke='#7d898f'
				strokeWidth='2'
			/>

			<text
				x={x}
				y='30'
				textAnchor='middle'
				fill='#ffffff'
				fontSize='14'
				fontWeight='600'
			>
				{label}
			</text>

			<text
				x={x}
				y='80'
				textAnchor='middle'
				fill='#8f9aa1'
				fontSize='12'
			>
				{value}
			</text>
		</g>
	)
}

function CurrentFlow({ startX, endX }: { startX: number; endX: number }) {
	const path = `M ${startX} 50 L ${endX} 50`

	return (
		<g aria-hidden='true'>
			<circle
				r='3'
				fill='#d0ae68'
			>
				<animateMotion
					dur='2.4s'
					repeatCount='indefinite'
					path={path}
				/>
			</circle>

			<circle
				r='3'
				fill='#d0ae68'
				opacity='0.7'
			>
				<animateMotion
					dur='2.4s'
					begin='0.8s'
					repeatCount='indefinite'
					path={path}
				/>
			</circle>

			<circle
				r='3'
				fill='#d0ae68'
				opacity='0.45'
			>
				<animateMotion
					dur='2.4s'
					begin='1.6s'
					repeatCount='indefinite'
					path={path}
				/>
			</circle>
		</g>
	)
}

function PowerSource({ x }: { x: number }) {
	return (
		<g aria-hidden='true'>
			{/* Провод к источнику */}
			<line
				x1={x}
				y1='50'
				x2={x}
				y2='90'
				stroke='#7d898f'
				strokeWidth='2'
			/>

			{/* Длинная пластина */}
			<line
				x1={x - 14}
				y1='90'
				x2={x + 14}
				y2='90'
				stroke='#d0ae68'
				strokeWidth='3'
				strokeLinecap='round'
			/>

			{/* Короткая пластина */}
			<line
				x1={x - 8}
				y1='100'
				x2={x + 8}
				y2='100'
				stroke='#d0ae68'
				strokeWidth='3'
				strokeLinecap='round'
			/>

			<text
				x={x - 22}
				y='80'
				fill='#ffffff'
				fontSize='14'
				fontWeight='600'
			>
				+
			</text>

			<text
				x={x - 22}
				y='117'
				fill='#ffffff'
				fontSize='14'
				fontWeight='600'
			>
				−
			</text>

			<text
				x={x + 22}
				y='145'
				textAnchor='middle'
				fill='#8f9aa1'
				fontSize='11'
			>
				U
			</text>
		</g>
	)
}

export default function ResistorSeriesCalculator() {
	const [resistors, setResistors] = useState<Resistor[]>(initialResistors)

	const totalResistance = useMemo(() => {
		return resistors.reduce(
			(total, resistor) =>
				total + parseResistance(resistor.value, resistor.unit),
			0
		)
	}, [resistors])

	function updateResistor(id: number, field: 'value' | 'unit', value: string) {
		setResistors(current =>
			current.map(resistor =>
				resistor.id === id ? { ...resistor, [field]: value } : resistor
			)
		)
	}

	function addResistor() {
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
		if (resistors.length <= 2) {
			return
		}

		setResistors(current => current.filter(resistor => resistor.id !== id))
	}

	function reset() {
		setResistors(initialResistors)
	}

	const visibleResistors = resistors.slice(0, 6)

	const viewBoxWidth = Math.max(760, visibleResistors.length * 150 + 80)

	return (
		<section className='rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{/* Схема */}
			<div className='overflow-x-auto rounded-xl border border-border bg-background-dark p-4 md:p-6'>
				<div className='min-w-190'>
					<svg
						viewBox={`0 0 ${viewBoxWidth} 180`}
						className='h-auto w-full'
						role='img'
						aria-label='Схема последовательного соединения резисторов'
					>
						{/* Источник питания */}
						<PowerSource x={25} />

						{/* Верхний провод */}
						<line
							x1='25'
							y1='50'
							x2='90'
							y2='50'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Резисторы */}
						{visibleResistors.map((resistor, index) => {
							const x = 150 + index * 120

							return (
								<ResistorSymbol
									key={resistor.id}
									x={x}
									label={`R${index + 1}`}
									value={formatResistance(
										parseResistance(resistor.value, resistor.unit)
									)}
								/>
							)
						})}

						{/* Конечный провод */}
						<line
							x1={30 + visibleResistors.length * 140}
							y1='50'
							x2={viewBoxWidth - 25}
							y2='50'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Возвратный провод */}
						<path
							d={`
      M ${viewBoxWidth - 25} 50
      L ${viewBoxWidth - 25} 150
      L 25 150
      L 25 100
    `}
							fill='none'
							stroke='#7d898f'
							strokeWidth='2'
						/>

						{/* Точки подключения */}
						<circle
							cx='25'
							cy='50'
							r='5'
							fill='#d0ae68'
						/>

						<circle
							cx={viewBoxWidth - 25}
							cy='50'
							r='5'
							fill='#d0ae68'
						/>

						{/* Движение тока */}
						<CurrentFlow
							startX={25}
							endX={viewBoxWidth - 25}
						/>

						{/* Направление тока */}
						<text
							x='45'
							y='35'
							fill='#66737b'
							fontSize='11'
						>
							I →
						</text>

						{/* Формула */}
						<text
							x={viewBoxWidth / 2}
							y='172'
							textAnchor='middle'
							fill='#66737b'
							fontSize='12'
						>
							Rобщ = R1 + R2 + R3 + …
						</text>
					</svg>
				</div>
			</div>

			{/* Список резисторов */}
			<div className='mt-8'>
				<div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
					<div>
						<h2 className='text-lg font-semibold text-white'>Резисторы</h2>

						<p className='mt-1 text-sm text-[#66737b]'>
							Добавьте от 2 до 6 резисторов.
						</p>
					</div>

					<button
						type='button'
						onClick={addResistor}
						disabled={resistors.length >= 6}
						className='inline-flex items-center gap-2 rounded-lg border border-[#b89445] px-4 py-2.5 text-sm font-semibold text-[#d0ae68] transition-colors hover:bg-[#b89445] hover:text-background-dark disabled:cursor-not-allowed disabled:opacity-40'
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
									Резистор
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
					При последовательном соединении сопротивления всех резисторов
					складываются.
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
