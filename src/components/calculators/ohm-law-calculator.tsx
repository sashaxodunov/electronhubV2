'use client'

import { useMemo, useState } from 'react'

type ResistanceUnit = 'Ω' | 'kΩ' | 'MΩ'

const resistanceMultipliers: Record<ResistanceUnit, number> = {
	Ω: 1,
	kΩ: 1_000,
	MΩ: 1_000_000
}

const resistanceUnitLabels: Record<ResistanceUnit, string> = {
	Ω: 'Ом',
	kΩ: 'кОм',
	MΩ: 'МОм'
}

export default function OhmLawCalculator() {
	const [voltage, setVoltage] = useState(12)

	// Значение, отображаемое возле ползунка
	const [resistanceValue, setResistanceValue] = useState(6)

	// Выбранная единица измерения
	const [resistanceUnit, setResistanceUnit] = useState<ResistanceUnit>('Ω')

	// Сопротивление всегда переводится в омы для расчётов
	const resistanceInOhms = useMemo(() => {
		return resistanceValue * resistanceMultipliers[resistanceUnit]
	}, [resistanceValue, resistanceUnit])

	const current = useMemo(() => {
		return voltage / resistanceInOhms
	}, [voltage, resistanceInOhms])

	const formatVoltage = (value: number) => {
		return value.toFixed(1).replace('.', ',')
	}

	const formatResistance = (value: number) => {
		return value.toFixed(1).replace('.', ',')
	}

	const formatCurrent = (value: number) => {
		if (value >= 1) {
			return `${value.toFixed(2).replace('.', ',')} A`
		}

		if (value >= 0.001) {
			return `${(value * 1_000).toFixed(2).replace('.', ',')} мА`
		}

		return `${(value * 1_000_000).toFixed(2).replace('.', ',')} мкА`
	}

	return (
		<div className='relative w-full overflow-hidden rounded-3xl border border-white/10 bg-background text-white shadow-2xl'>
			{/* Верхняя панель */}
			<div className='absolute left-0 top-0 z-20 flex h-12 w-full items-center justify-between px-4'>
				<button
					type='button'
					className='flex h-7 w-7 items-center justify-center rounded-full text-2xl font-light leading-none text-white/90 transition hover:bg-white/10'
					aria-label='Закрыть'
				>
					×
				</button>

				<button
					type='button'
					className='flex h-7 w-7 items-center justify-center rounded-md text-white/90 transition hover:bg-white/10'
					aria-label='Копировать'
				>
					<svg
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<rect
							x='8'
							y='8'
							width='11'
							height='11'
							rx='2'
							stroke='currentColor'
							strokeWidth='1.7'
						/>

						<path
							d='M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8'
							stroke='currentColor'
							strokeWidth='1.7'
						/>
					</svg>
				</button>
			</div>

			<div className='grid min-h-87.5 grid-cols-1 md:grid-cols-[1.05fr_1fr]'>
				{/* Левая часть */}
				<div className='flex flex-col justify-between border-b border-white/10 px-6 pb-5 pt-20 md:border-b-0 md:border-r md:px-8 md:pb-6 md:pt-16'>
					{/* Основная формула */}
					<div className='flex flex-1 flex-col justify-center'>
						<div className='flex justify-center'>
							<div className='font-serif text-[30px] italic tracking-wide text-white sm:text-[34px]'>
								<span>I</span>
								<span className='mx-3'>=</span>

								<span className='inline-flex flex-col items-center align-middle leading-none'>
									<span className='border-b border-white px-2 pb-1'>V</span>

									<span className='px-2 pt-1'>R</span>
								</span>
							</div>
						</div>

						{/* Расчёт */}
						<div className='mt-12 flex justify-center'>
							<div className='font-serif text-[25px] italic tracking-wide text-white sm:text-[30px]'>
								<span>I</span>
								<span className='mx-3'>=</span>

								<span className='inline-flex flex-col items-center align-middle leading-none'>
									<span className='border-b border-white px-2 pb-1'>
										{formatVoltage(voltage)} В
									</span>

									<span className='px-2 pt-1'>
										{formatResistance(resistanceValue)}{' '}
										{resistanceUnitLabels[resistanceUnit]}
									</span>
								</span>

								<span className='mx-3'>=</span>

								<span>{formatCurrent(current)}</span>
							</div>
						</div>
					</div>

					{/* Слайдеры */}
					<div className='mt-8 space-y-3'>
						{/* Voltage */}
						<div className='grid grid-cols-[48px_42px_28px_1fr] items-center gap-2'>
							<div className='font-serif text-[17px] italic text-white'>
								V<sub className='text-[11px]'>s</sub>
							</div>

							<div className='text-right font-serif text-[13px] text-white'>
								{formatVoltage(voltage)}
							</div>

							<div className='text-sm text-white/70'>V</div>

							<input
								type='range'
								min='1'
								max='240'
								step='0.1'
								value={voltage}
								onChange={event => setVoltage(Number(event.target.value))}
								className='ohms-slider ohms-slider-voltage'
								style={
									{
										'--slider-position': `${((voltage - 1) / (240 - 1)) * 100}%`
									} as React.CSSProperties
								}
								aria-label='Напряжение'
							/>
						</div>

						{/* Resistance */}
						<div className='grid grid-cols-[48px_42px_72px_1fr] items-center gap-2'>
							<div className='font-serif text-[17px] italic text-white'>R</div>

							<div className='text-right font-serif text-[13px] text-white'>
								{formatResistance(resistanceValue)}
							</div>

							<select
								value={resistanceUnit}
								onChange={event =>
									setResistanceUnit(event.target.value as ResistanceUnit)
								}
								className='h-8 cursor-pointer rounded-md border border-white/15 bg-control px-1 text-xs text-white outline-none transition hover:border-white/30 focus:border-white/40'
								aria-label='Единица измерения сопротивления'
							>
								<option value='Ω'>Ом</option>
								<option value='kΩ'>кОм</option>
								<option value='MΩ'>МОм</option>
							</select>

							<input
								type='range'
								min='1'
								max='20'
								step='0.1'
								value={resistanceValue}
								onChange={event =>
									setResistanceValue(Number(event.target.value))
								}
								className='ohms-slider ohms-slider-resistance'
								style={
									{
										'--slider-position': `${
											((resistanceValue - 1) / (20 - 1)) * 100
										}%`
									} as React.CSSProperties
								}
								aria-label={`Сопротивление в ${
									resistanceUnitLabels[resistanceUnit]
								}`}
							/>
						</div>
					</div>
				</div>

				{/* Правая часть — электрическая схема */}
				<div className='relative min-h-87.5 overflow-hidden'>
					<svg
						viewBox='0 0 500 350'
						className='absolute inset-0 h-full w-full'
						preserveAspectRatio='xMidYMid meet'
					>
						{/* Проводники */}
						<path
							d='
								M 80 95
								H 150
								M 325 95
								H 420
								V 280
								H 80
								V 250
							'
							fill='none'
							stroke='#999999'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* Нижний провод до батареи */}
						<path
							d='M 80 270 V 95'
							fill='none'
							stroke='#999999'
							strokeWidth='4'
							strokeLinecap='round'
						/>

						{/* Батарея */}
						<g>
							<rect
								x='69'
								y='133'
								width='22'
								height='8'
								rx='2'
								fill='#d7d7d7'
							/>

							<rect
								x='48'
								y='140'
								width='64'
								height='112'
								rx='10'
								fill='#292929'
								stroke='#eeeeee'
								strokeWidth='3'
							/>

							<text
								x='80'
								y='160'
								textAnchor='middle'
								fill='#ffffff'
								fontSize='18'
								fontFamily='Arial, sans-serif'
							>
								+
							</text>

							<text
								x='80'
								y='240'
								textAnchor='middle'
								fill='#ffffff'
								fontSize='18'
								fontFamily='Arial, sans-serif'
							>
								-
							</text>

							<text
								x='20'
								y='82'
								fill='#dddddd'
								fontSize='14'
								fontFamily='Arial, sans-serif'
							>
								V
								<tspan
									dy='3'
									fontSize='9'
								>
									s
								</tspan>
								<tspan dx='6'>= {formatVoltage(voltage)} В</tspan>
							</text>
						</g>

						{/* Резистор / блок */}
						<g>
							<rect
								x='150'
								y='69'
								width='175'
								height='55'
								rx='8'
								fill='#343434'
								stroke='#686868'
								strokeWidth='2'
							/>

							<rect
								x='163'
								y='81'
								width='149'
								height='30'
								rx='2'
								fill='#303030'
								stroke='#515151'
								strokeWidth='1.5'
							/>

							<circle
								cx='177'
								cy='96'
								r='2.8'
								fill='#3478d4'
							>
								<animate
									attributeName='opacity'
									values='0.3;1;0.3'
									dur='1.2s'
									repeatCount='indefinite'
								/>
							</circle>

							<circle
								cx='216'
								cy='96'
								r='2.8'
								fill='#3478d4'
							>
								<animate
									attributeName='opacity'
									values='1;0.3;1'
									dur='1.2s'
									repeatCount='indefinite'
								/>
							</circle>

							<circle
								cx='255'
								cy='96'
								r='2.8'
								fill='#3478d4'
							>
								<animate
									attributeName='opacity'
									values='0.3;1;0.3'
									dur='1.2s'
									repeatCount='indefinite'
								/>
							</circle>

							<circle
								cx='294'
								cy='96'
								r='2.8'
								fill='#3478d4'
							>
								<animate
									attributeName='opacity'
									values='1;0.3;1'
									dur='1.2s'
									repeatCount='indefinite'
								/>
							</circle>

							{/* Подпись сопротивления */}
							<text
								x='238'
								y='160'
								textAnchor='middle'
								fill='#dddddd'
								fontSize='14'
								fontFamily='Arial, sans-serif'
							>
								R = {formatResistance(resistanceValue)}{' '}
								{resistanceUnitLabels[resistanceUnit]}
							</text>
						</g>

						{/* Направление тока */}
						<g>
							<text
								x='238'
								y='38'
								textAnchor='middle'
								fill='#dddddd'
								fontSize='14'
								fontFamily='Arial, sans-serif'
							>
								I = {formatCurrent(current)}
							</text>

							<line
								x1='165'
								y1='55'
								x2='235'
								y2='55'
								stroke='#3478d4'
								strokeWidth='2'
							/>

							<path
								d='M 235 55 L 228 50 L 228 60 Z'
								fill='#3478d4'
							/>
						</g>

						{/* Движение зарядов по проводу */}
						<g>
							<circle
								r='2.5'
								fill='#3478d4'
							>
								<animateMotion
									dur={`${Math.max(0.5, 2.5 - current * 0.35)}s`}
									repeatCount='indefinite'
									path='M 120 105 H 400 V 270 H 80 V 230'
								/>
							</circle>

							<circle
								r='2.5'
								fill='#3478d4'
							>
								<animateMotion
									dur={`${Math.max(0.5, 2.5 - current * 0.35)}s`}
									begin='0.7s'
									repeatCount='indefinite'
									path='M 120 105 H 400 V 270 H 80 V 230'
								/>
							</circle>

							<circle
								r='2.5'
								fill='#3478d4'
							>
								<animateMotion
									dur={`${Math.max(0.5, 2.5 - current * 0.35)}s`}
									begin='1.4s'
									repeatCount='indefinite'
									path='M 120 105 H 400 V 270 H 80 V 230'
								/>
							</circle>
						</g>
					</svg>
				</div>
			</div>

			{/* Мобильная подсказка */}
			<div className='border-t border-white/10 bg-surface px-5 py-3 text-center text-xs text-white/40 md:hidden'>
				Изменяйте ползунки, чтобы увидеть изменение силы тока
			</div>

			<style jsx>{`
				.ohms-slider {
					--slider-position: 50%;
					width: 100%;
					height: 100px;
					margin: 0;
					cursor: pointer;
					appearance: none;
					background: transparent;
				}

				.ohms-slider::-webkit-slider-runnable-track {
					height: 26px;
					border-radius: 999px;
					background: linear-gradient(
						to right,
						#3f3f3f 0%,
						#3f3f3f var(--slider-position),
						#3f3f3f var(--slider-position),
						#3f3f3f 100%
					);
					box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18);
				}

				.ohms-slider::-webkit-slider-thumb {
					width: 22px;
					height: 22px;
					margin-top: 2px;
					border: 0;
					border-radius: 50%;
					background: #ffffff;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
					appearance: none;
				}

				.ohms-slider::-moz-range-track {
					height: 26px;
					border: 0;
					border-radius: 999px;
					background: #3f3f3f;
				}

				.ohms-slider::-moz-range-progress {
					height: 26px;
					border-radius: 999px;
					background: #3f3f3f;
				}

				.ohms-slider::-moz-range-thumb {
					width: 22px;
					height: 22px;
					border: 0;
					border-radius: 50%;
					background: #ffffff;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
				}

				.ohms-slider:focus-visible {
					outline: 1px solid rgba(255, 255, 255, 0.3);
					outline-offset: 2px;
					border-radius: 999px;
				}
			`}</style>

			{/* Пояснение */}
			<div className='mt-4 rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-4 py-3'>
				<p className='text-xs leading-5 text-slate-400'>
					При увеличении напряжения поток тока становится быстрее. При
					увеличении сопротивления ток уменьшается. Это непосредственно следует
					из формулы I = U / R.
				</p>
			</div>
		</div>
	)
}
