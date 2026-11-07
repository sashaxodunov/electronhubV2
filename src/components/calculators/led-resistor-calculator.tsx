'use client'

import { type CSSProperties, useMemo, useState } from 'react'

type InputMode = 'slider' | 'manual'

type StandardResistance = {
	value: number
	label: string
}

const E24_VALUES = [
	10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56,
	62, 68, 75, 82, 91
]

function parseNumber(value: string): number | null {
	if (!value.trim()) return null

	const normalized = value.replace(',', '.')
	const number = Number(normalized)

	return Number.isFinite(number) ? number : null
}

/**
 * Возвращает ближайшее стандартное значение E24,
 * которое не меньше расчётного сопротивления.
 */
function getStandardResistance(value: number): StandardResistance {
	if (value <= 0) {
		return {
			value: 0,
			label: '—'
		}
	}

	for (let exponent = -1; exponent <= 8; exponent++) {
		const multiplier = 10 ** exponent

		for (const base of E24_VALUES) {
			const resistance = base * multiplier

			if (resistance >= value) {
				return {
					value: resistance,
					label: formatResistance(resistance)
				}
			}
		}
	}

	const fallback = E24_VALUES[E24_VALUES.length - 1] * 10 ** 8

	return {
		value: fallback,
		label: formatResistance(fallback)
	}
}

function formatNumber(value: number, digits = 2): string {
	if (!Number.isFinite(value)) return '—'

	if (Number.isInteger(value)) {
		return value.toString()
	}

	return value
		.toFixed(digits)
		.replace(/\.?0+$/, '')
		.replace('.', ',')
}

function formatResistance(value: number): string {
	if (value >= 1_000_000) {
		return `${formatNumber(value / 1_000_000, 2)} МОм`
	}

	if (value >= 1_000) {
		return `${formatNumber(value / 1_000, 2)} кОм`
	}

	return `${formatNumber(value, 2)} Ом`
}

export default function LedResistorCalculator() {
	const [voltageInput, setVoltageInput] = useState('12')
	const [ledVoltageInput, setLedVoltageInput] = useState('2')
	const [currentInput, setCurrentInput] = useState('20')

	const [inputMode, setInputMode] = useState<InputMode>('slider')

	const voltage = parseNumber(voltageInput)
	const ledVoltage = parseNumber(ledVoltageInput)
	const currentMa = parseNumber(currentInput)

	const result = useMemo(() => {
		if (
			voltage === null ||
			ledVoltage === null ||
			currentMa === null ||
			voltage <= 0 ||
			ledVoltage < 0 ||
			currentMa <= 0
		) {
			return null
		}

		const voltageDrop = voltage - ledVoltage
		const currentA = currentMa / 1000

		if (voltageDrop <= 0 || currentA <= 0) {
			return null
		}

		const calculatedResistance = voltageDrop / currentA

		const standard = getStandardResistance(calculatedResistance)

		if (standard.value <= 0) {
			return null
		}

		const actualCurrentA = voltageDrop / standard.value
		const actualCurrentMa = actualCurrentA * 1000

		const resistorPower = actualCurrentA ** 2 * standard.value
		const recommendedPower = resistorPower * 2

		return {
			voltageDrop,
			calculatedResistance,
			standardResistance: standard.value,
			standardLabel: standard.label,
			actualCurrentA,
			actualCurrentMa,
			resistorPower,
			recommendedPower
		}
	}, [voltage, ledVoltage, currentMa])

	const ledOn =
		result !== null &&
		result.actualCurrentA > 0 &&
		voltage !== null &&
		ledVoltage !== null &&
		voltage > ledVoltage

	/**
	 * Ограничиваем значение только визуально для слайдера.
	 *
	 * Пользователь может вручную ввести, например, 48 В,
	 * даже если диапазон слайдера заканчивается на 24 В.
	 */
	const voltageSliderValue =
		voltage !== null ? Math.min(24, Math.max(1, voltage)) : 1

	const ledVoltageSliderValue =
		ledVoltage !== null ? Math.min(5, Math.max(0.5, ledVoltage)) : 2

	const currentSliderValue =
		currentMa !== null ? Math.min(100, Math.max(1, currentMa)) : 20

	const sliderPosition = (value: number, min: number, max: number): string => {
		const percent = ((value - min) / (max - min)) * 100
		return `${Math.min(100, Math.max(0, percent))}%`
	}

	const handleVoltageSlider = (value: number) => {
		setVoltageInput(value.toString())
	}

	const handleLedVoltageSlider = (value: number) => {
		setLedVoltageInput(value.toString())
	}

	const handleCurrentSlider = (value: number) => {
		setCurrentInput(value.toString())
	}

	const glowOpacity = useMemo(() => {
		if (!ledOn || !result) return 0

		const normalized = Math.min(1, Math.max(0.15, result.actualCurrentMa / 20))

		return 0.25 + normalized * 0.65
	}, [ledOn, result])

	const glowStyle: CSSProperties = {
		opacity: glowOpacity
	}

	return (
		<div className='relative w-full overflow-hidden rounded-3xl border border-white/10 bg-background text-white shadow-2xl'>
			<div>
				{/* Левая часть — управление */}
				<div className='relative z-10 p-6 sm:p-8 lg:p-10'>
					<div className='mb-8'>
						<div className='mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300'>
							Калькулятор резистора для светодиода
						</div>

						<h2 className='text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl'>
							Подбор токоограничивающего резистора
						</h2>

						<p className='mt-3 text-sm leading-6 text-slate-400 sm:text-base'>
							Укажите напряжение источника, прямое напряжение светодиода и
							желаемый ток. Калькулятор подберёт ближайший стандартный резистор
							E24.
						</p>
					</div>

					{/* Переключатель режима */}
					<div className='mb-7 inline-flex rounded-xl border border-white/10 bg-[#1f2a32] p-1'>
						<button
							type='button'
							onClick={() => setInputMode('slider')}
							className={`rounded-lg px-4 py-2 text-sm transition ${
								inputMode === 'slider'
									? 'bg-cyan-400/15 text-cyan-300'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							Ползунки
						</button>

						<button
							type='button'
							onClick={() => setInputMode('manual')}
							className={`rounded-lg px-4 py-2 text-sm transition ${
								inputMode === 'manual'
									? 'bg-cyan-400/15 text-cyan-300'
									: 'text-slate-400 hover:text-white'
							}`}
						>
							Вручную
						</button>
					</div>

					<div className='space-y-7'>
						{/* Напряжение источника */}
						<div>
							<div className='mb-3 flex items-center justify-between gap-4'>
								<label
									htmlFor='led-source-voltage'
									className='text-sm font-medium text-slate-200'
								>
									Напряжение источника
								</label>

								<div className='flex items-center gap-2'>
									<input
										id='led-source-voltage'
										type='text'
										inputMode='decimal'
										value={voltageInput}
										onChange={event => setVoltageInput(event.target.value)}
										className='w-24 rounded-lg border border-white/10 bg-[#1f2a32] px-3 py-2 text-right text-sm text-white outline-none transition focus:border-cyan-400/50'
									/>

									<span className='text-sm text-slate-400'>В</span>
								</div>
							</div>

							{inputMode === 'slider' && (
								<div>
									<input
										type='range'
										min='1'
										max='24'
										step='0.1'
										value={voltageSliderValue}
										onChange={event =>
											handleVoltageSlider(Number(event.target.value))
										}
										className='led-slider w-full'
										style={
											{
												'--slider-position': sliderPosition(
													voltageSliderValue,
													1,
													24
												)
											} as CSSProperties
										}
									/>

									<div className='mt-2 flex justify-between text-xs text-slate-500'>
										<span>1 В</span>
										<span>24 В</span>
									</div>
								</div>
							)}
						</div>

						{/* Прямое напряжение LED */}
						<div>
							<div className='mb-3 flex items-center justify-between gap-4'>
								<label
									htmlFor='led-forward-voltage'
									className='text-sm font-medium text-slate-200'
								>
									Прямое напряжение LED
								</label>

								<div className='flex items-center gap-2'>
									<input
										id='led-forward-voltage'
										type='text'
										inputMode='decimal'
										value={ledVoltageInput}
										onChange={event => setLedVoltageInput(event.target.value)}
										className='w-24 rounded-lg border border-white/10 bg-[#1f2a32] px-3 py-2 text-right text-sm text-white outline-none transition focus:border-cyan-400/50'
									/>

									<span className='text-sm text-slate-400'>В</span>
								</div>
							</div>

							{inputMode === 'slider' && (
								<div>
									<input
										type='range'
										min='0.5'
										max='5'
										step='0.1'
										value={ledVoltageSliderValue}
										onChange={event =>
											handleLedVoltageSlider(Number(event.target.value))
										}
										className='led-slider w-full'
										style={
											{
												'--slider-position': sliderPosition(
													ledVoltageSliderValue,
													0.5,
													5
												)
											} as CSSProperties
										}
									/>

									<div className='mt-2 flex justify-between text-xs text-slate-500'>
										<span>0,5 В</span>
										<span>5 В</span>
									</div>
								</div>
							)}
						</div>

						{/* Ток LED */}
						<div>
							<div className='mb-3 flex items-center justify-between gap-4'>
								<label
									htmlFor='led-current'
									className='text-sm font-medium text-slate-200'
								>
									Желаемый ток LED
								</label>

								<div className='flex items-center gap-2'>
									<input
										id='led-current'
										type='text'
										inputMode='decimal'
										value={currentInput}
										onChange={event => setCurrentInput(event.target.value)}
										className='w-24 rounded-lg border border-white/10 bg-[#1f2a32] px-3 py-2 text-right text-sm text-white outline-none transition focus:border-cyan-400/50'
									/>

									<span className='text-sm text-slate-400'>мА</span>
								</div>
							</div>

							{inputMode === 'slider' && (
								<div>
									<input
										type='range'
										min='1'
										max='100'
										step='1'
										value={currentSliderValue}
										onChange={event =>
											handleCurrentSlider(Number(event.target.value))
										}
										className='led-slider w-full'
										style={
											{
												'--slider-position': sliderPosition(
													currentSliderValue,
													1,
													100
												)
											} as CSSProperties
										}
									/>

									<div className='mt-2 flex justify-between text-xs text-slate-500'>
										<span>1 мА</span>
										<span>100 мА</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Правая часть — интерактивная схема */}
				<div className='relative min-h-155 overflow-hidden border-t border-white/10 bg-background-dark lg:border-l lg:border-t-0'>
					{/* Декоративное свечение */}
					<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_42%,rgba(34,211,238,0.08),transparent_35%)]' />

					<div className='absolute left-6 top-6 z-10'>
						<div className='text-xs uppercase tracking-[0.18em] text-slate-500'>
							Схема
						</div>

						<div className='mt-1 text-sm text-slate-300'>
							Источник → резистор → LED
						</div>
					</div>

					<svg
						viewBox='0 0 520 620'
						className='absolute inset-0 h-full w-full'
						aria-label='Схема подключения светодиода через резистор'
					>
						<defs>
							{/* Свечение светодиода */}
							<filter
								id='ledGlow'
								x='-300%'
								y='-300%'
								width='600%'
								height='600%'
							>
								<feGaussianBlur
									stdDeviation='9'
									result='blur'
								/>
							</filter>

							<filter
								id='ledGlowSmall'
								x='-300%'
								y='-300%'
								width='600%'
								height='600%'
							>
								<feGaussianBlur
									stdDeviation='3'
									result='blur'
								/>
							</filter>

							{/* Путь движения зарядов */}
							<path
								id='currentPath'
								d='M 150 95 H 440 V 500 H 80 V 455'
								fill='none'
							/>

							{/* Мягкое свечение вокруг источника */}
							<radialGradient id='sourceGradient'>
								<stop
									offset='0%'
									stopColor='#334b59'
									stopOpacity='0.9'
								/>
								<stop
									offset='100%'
									stopColor='#1f2a32'
									stopOpacity='0'
								/>
							</radialGradient>
						</defs>

						{/* ====================================================== */}
						{/* Внешний контур проводов                                 */}
						{/* ====================================================== */}

						<path
							d='M 50 95 H 40 V 500 H 80 V 455'
							fill='none'
							stroke='#566872'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* Светлая внутренняя линия проводов */}
						<path
							d='M 150 95 H 440 V 500 H 80 V 455'
							fill='none'
							stroke='#91a4ae'
							strokeOpacity='0.35'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* ====================================================== */}
						{/* ИСТОЧНИК ПИТАНИЯ                                        */}
						{/* ====================================================== */}

						<g transform='translate(-150 0)'>
							{/* декоративное свечение */}
							<ellipse
								cx='80'
								cy='310'
								rx='105'
								ry='145'
								fill='url(#sourceGradient)'
								opacity='0.5'
							/>

							{/* корпус */}
							<rect
								x='25'
								y='205'
								width='210'
								height='190'
								rx='18'
								fill='purple'
								stroke='#70838d'
								strokeWidth='2'
							/>

							{/* внутренняя панель */}
							<rect
								x='39'
								y='222'
								width='82'
								height='156'
								rx='11'
								fill='#1f2a32'
								stroke='#3b4a54'
								strokeWidth='1'
							/>

							{/* верхняя клемма */}
							<rect
								x='67'
								y='185'
								width='26'
								height='20'
								rx='5'
								fill='#607580'
								stroke='#91a4ae'
								strokeWidth='1.5'
							/>

							{/* нижняя клемма */}
							<rect
								x='67'
								y='395'
								width='26'
								height='20'
								rx='5'
								fill='#607580'
								stroke='#91a4ae'
								strokeWidth='1.5'
							/>

							{/* плюс */}
							<circle
								cx='80'
								cy='255'
								r='23'
								fill='#202c33'
								stroke='#607580'
								strokeWidth='1.5'
							/>

							<path
								d='M 70 255 H 90 M 80 245 V 265'
								stroke='#e2f4f8'
								strokeWidth='2.5'
								strokeLinecap='round'
							/>

							{/* условное обозначение DC */}
							<path
								d='M 61 307 H 99'
								stroke='#607580'
								strokeWidth='2'
								strokeLinecap='round'
							/>

							<path
								d='M 67 318 H 93'
								stroke='#607580'
								strokeWidth='2'
								strokeLinecap='round'
							/>

							{/* минус */}
							<circle
								cx='80'
								cy='355'
								r='23'
								fill='#202c33'
								stroke='#607580'
								strokeWidth='1.5'
							/>

							<path
								d='M 70 355 H 90'
								stroke='#e2f4f8'
								strokeWidth='2.5'
								strokeLinecap='round'
							/>

							{/* подпись */}
							<text
								x='80'
								y='290'
								textAnchor='middle'
								fill='#94a7b0'
								fontSize='10'
								letterSpacing='1.5'
							>
								DC
							</text>

							<text
								x='80'
								y='440'
								textAnchor='middle'
								fill='#82949d'
								fontSize='11'
							>
								{voltage !== null ? `${formatNumber(voltage)} В` : '—'}
							</text>
						</g>

						{/* ====================================================== */}
						{/* ВЕРХНИЙ ПРОВОД ОТ ИСТОЧНИКА                             */}
						{/* ====================================================== */}

						<path
							d='M 150 95 H 185'
							fill='none'
							stroke='#91a4ae'
							strokeOpacity='0.45'
							strokeWidth='4'
							strokeLinecap='round'
						/>

						{/* ====================================================== */}
						{/* РЕЗИСТОР                                                 */}
						{/* ====================================================== */}

						<g>
							<path
								d='M 185 95
                   L 198 82
                   L 211 108
                   L 224 82
                   L 237 108
                   L 250 82
                   L 263 108
                   L 276 82
                   L 289 108
                   L 302 95'
								fill='none'
								stroke='#d1d9dd'
								strokeWidth='5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>

							<path
								d='M 185 95
                   L 198 82
                   L 211 108
                   L 224 82
                   L 237 108
                   L 250 82
                   L 263 108
                   L 276 82
                   L 289 108
                   L 302 95'
								fill='none'
								stroke='#ffffff'
								strokeOpacity='0.25'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>

							<text
								x='244'
								y='64'
								textAnchor='middle'
								fill='#9aaab2'
								fontSize='13'
							>
								{result ? `R = ${result.standardLabel}` : 'R = —'}
							</text>
						</g>

						{/* ====================================================== */}
						{/* ПРОВОД К LED                                            */}
						{/* ====================================================== */}

						<path
							d='M 302 95 H 440 V 170'
							fill='none'
							stroke='#91a4ae'
							strokeOpacity='0.45'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* ====================================================== */}
						{/* LED                                                     */}
						{/* ====================================================== */}

						<g transform='translate(440 210), rotate(90 0 0)'>
							{/* внешнее свечение */}
							<circle
								cx='0'
								cy='0'
								r='52'
								fill='#67e8f9'
								opacity={ledOn ? glowOpacity * 0.28 : 0}
								filter='url(#ledGlow)'
							/>

							<circle
								cx='0'
								cy='0'
								r='30'
								fill='#67e8f9'
								opacity={ledOn ? glowOpacity * 0.32 : 0}
								filter='url(#ledGlowSmall)'
							/>

							{/* полупроводниковый переход */}
							<path
								d='M -23 -17 L 0 0 L -23 17 Z'
								fill={ledOn ? '#67e8f9' : '#40535d'}
								fillOpacity={ledOn ? 0.9 : 0.7}
								stroke='#d8fbff'
								strokeOpacity={ledOn ? 0.95 : 0.45}
								strokeWidth='2'
							/>

							{/* катодная черта */}
							<path
								d='M 8 -21 V 21'
								stroke='#dcecef'
								strokeWidth='4'
								strokeLinecap='round'
							/>

							{/* анодный вывод */}
							<path
								d='M -48 0 H -23'
								stroke='#91a4ae'
								strokeWidth='4'
								strokeLinecap='round'
							/>

							{/* катодный вывод */}
							<path
								d='M 8 0 H 48'
								stroke='#91a4ae'
								strokeWidth='4'
								strokeLinecap='round'
							/>

							{/* стрелки излучения */}
							<g
								opacity={ledOn ? 0.95 : 0.3}
								stroke='#67e8f9'
								strokeWidth='2.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M -4 -30 L 10 -45' />
								<path d='M 10 -45 L 8 -36' />
								<path d='M 10 -45 L 1 -43' />

								<path d='M 10 -20 L 26 -35' />
								<path d='M 26 -35 L 24 -26' />
								<path d='M 26 -35 L 17 -33' />
							</g>

							<text
								x='0'
								y='63'
								textAnchor='middle'
								fill={ledOn ? '#67e8f9' : '#73848c'}
								fontSize='12'
							>
								LED
							</text>

							<text
								x='0'
								y='80'
								textAnchor='middle'
								fill='#64757e'
								fontSize='10'
							>
								{ledOn
									? `${formatNumber(result?.actualCurrentMa ?? 0, 1)} мА`
									: 'нет тока'}
							</text>
						</g>

						{/* ====================================================== */}
						{/* Провод после LED                                        */}
						{/* ====================================================== */}

						<path
							d='M 340 250 V 500 H 135'
							fill='none'
							stroke='#91a4ae'
							strokeOpacity='0.45'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* ====================================================== */}
						{/* Нижний провод к источнику                                */}
						{/* ====================================================== */}

						<path
							d='M 135 500 H 0 V 415'
							fill='none'
							stroke='#91a4ae'
							strokeOpacity='0.45'
							strokeWidth='4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>

						{/* ====================================================== */}
						{/* АНИМАЦИЯ ДВИЖЕНИЯ ЗАРЯДОВ                              */}
						{/* ====================================================== */}

						{result && (
							<>
								<circle
									r='4'
									fill='#67e8f9'
									opacity='0.9'
								>
									<animateMotion
										dur='2.8s'
										repeatCount='indefinite'
										rotate='auto'
									>
										<mpath href='#currentPath' />
									</animateMotion>
								</circle>

								<circle
									r='3'
									fill='#67e8f9'
									opacity='0.65'
								>
									<animateMotion
										dur='2.8s'
										begin='-0.9s'
										repeatCount='indefinite'
										rotate='auto'
									>
										<mpath href='#currentPath' />
									</animateMotion>
								</circle>

								<circle
									r='2.5'
									fill='#67e8f9'
									opacity='0.45'
								>
									<animateMotion
										dur='2.8s'
										begin='-1.8s'
										repeatCount='indefinite'
										rotate='auto'
									>
										<mpath href='#currentPath' />
									</animateMotion>
								</circle>
							</>
						)}

						{/* ====================================================== */}
						{/* Подпись тока                                             */}
						{/* ====================================================== */}

						{result && (
							<g>
								<rect
									x='310'
									y='525'
									width='130'
									height='38'
									rx='10'
									fill='#1f2a32'
									stroke='#3b4a54'
									strokeWidth='1'
								/>

								<text
									x='375'
									y='549'
									textAnchor='middle'
									fill='#9fb0b8'
									fontSize='12'
								>
									I = {formatNumber(result.actualCurrentMa, 1)} мА
								</text>
							</g>
						)}
					</svg>
				</div>

				{/* Результат */}
				<div className='mt-9 rounded-2xl border border-white/10 bg-[#26343d] p-5 sm:p-6'>
					{result ? (
						<>
							<div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
								<div>
									<div className='text-sm text-slate-400'>
										Рекомендуемый резистор
									</div>

									<div className='mt-1 text-3xl font-semibold text-cyan-300'>
										{result.standardLabel}
									</div>
								</div>

								<div className='rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3'>
									<div className='text-xs text-slate-500'>E24</div>

									<div className='mt-1 text-sm font-medium text-cyan-200'>
										Ближайшее стандартное значение
									</div>
								</div>
							</div>

							<div className='mt-6 grid gap-3 sm:grid-cols-2'>
								<div className='rounded-xl bg-[#1f2a32] p-4'>
									<div className='text-xs text-slate-500'>
										Расчётное сопротивление
									</div>

									<div className='mt-1 text-lg font-medium text-white'>
										{formatResistance(result.calculatedResistance)}
									</div>
								</div>

								<div className='rounded-xl bg-[#1f2a32] p-4'>
									<div className='text-xs text-slate-500'>Фактический ток</div>

									<div className='mt-1 text-lg font-medium text-white'>
										{formatNumber(result.actualCurrentMa, 2)} мА
									</div>
								</div>

								<div className='rounded-xl bg-[#1f2a32] p-4'>
									<div className='text-xs text-slate-500'>
										Мощность резистора
									</div>

									<div className='mt-1 text-lg font-medium text-white'>
										{formatNumber(result.resistorPower, 3)} Вт
									</div>
								</div>

								<div className='rounded-xl bg-[#1f2a32] p-4'>
									<div className='text-xs text-slate-500'>
										Рекомендуемая мощность
									</div>

									<div className='mt-1 text-lg font-medium text-white'>
										{formatNumber(result.recommendedPower, 2)} Вт
									</div>
								</div>
							</div>

							<div className='mt-5 rounded-xl border border-white/5 bg-[#1f2a32] px-4 py-3'>
								<div className='text-xs text-slate-500'>
									Падение напряжения на резисторе
								</div>

								<div className='mt-1 text-sm text-slate-200'>
									{formatNumber(result.voltageDrop, 2)} В
								</div>
							</div>
						</>
					) : (
						<div className='rounded-xl border border-amber-400/10 bg-amber-400/5 p-4'>
							<div className='text-sm font-medium text-amber-300'>
								Невозможно выполнить расчёт
							</div>

							<p className='mt-2 text-sm leading-6 text-slate-400'>
								Убедитесь, что напряжение источника больше прямого напряжения
								светодиода, а ток задан больше нуля.
							</p>
						</div>
					)}
				</div>

				{/* Формула */}
				<div className='mt-6 rounded-2xl border border-white/10 bg-[#1f2a32] p-5'>
					<div className='text-xs uppercase tracking-[0.15em] text-slate-500'>
						Формула
					</div>

					<div className='mt-3 text-xl text-white'>
						R = (Vₛ − V<sub>LED</sub>) / I
					</div>

					<p className='mt-2 text-sm leading-6 text-slate-500'>
						Резистор ограничивает ток, протекающий через светодиод.
					</p>
				</div>
			</div>

			<style jsx>{`
				.led-slider {
					appearance: none;
					height: 5px;
					border-radius: 9999px;
					outline: none;
					background: linear-gradient(
						to right,
						#3478d4 0%,
						#3478d4 var(--slider-position),
						#33424b var(--slider-position),
						#33424b 100%
					);
				}

				.led-slider::-webkit-slider-thumb {
					appearance: none;
					width: 18px;
					height: 18px;
					border-radius: 50%;
					border: 2px solid #5eead4;
					background: #182127;
					cursor: pointer;
					box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.08);
				}

				.led-slider::-moz-range-thumb {
					width: 18px;
					height: 18px;
					border-radius: 50%;
					border: 2px solid #5eead4;
					background: #182127;
					cursor: pointer;
					box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.08);
				}

				.led-slider::-webkit-slider-runnable-track {
					height: 5px;
					border-radius: 9999px;
				}

				.led-slider::-moz-range-track {
					height: 5px;
					border-radius: 9999px;
				}
			`}</style>
		</div>
	)
}
