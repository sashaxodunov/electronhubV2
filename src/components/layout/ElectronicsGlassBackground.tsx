'use client'

import { useEffect, useRef } from 'react'

export default function ElectronicsRealisticBackground() {
	const rootRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		let raf = 0

		const update = () => {
			const y = window.scrollY || 0

			if (rootRef.current) {
				rootRef.current.style.setProperty('--scroll-y', `${y}px`)
			}

			raf = 0
		}

		const onScroll = () => {
			if (!raf) {
				raf = requestAnimationFrame(update)
			}
		}

		update()
		window.addEventListener('scroll', onScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', onScroll)
			if (raf) cancelAnimationFrame(raf)
		}
	}, [])

	return (
		<div
			ref={rootRef}
			className='electronics-bg fixed inset-0 -z-10 overflow-hidden bg-[#020617]'
		>
			{/* Основной SVG слой */}
			<svg
				className='absolute inset-0 h-full w-full'
				viewBox='0 0 1800 1000'
				preserveAspectRatio='xMidYMid slice'
				xmlns='http://www.w3.org/2000/svg'
			>
				<defs>
					{/* Свечение */}
					<filter
						id='traceGlow'
						x='-40%'
						y='-40%'
						width='180%'
						height='180%'
					>
						<feGaussianBlur
							stdDeviation='3'
							result='blur'
						/>
						<feColorMatrix
							in='blur'
							type='matrix'
							values='
                0 0 0 0 0.15
                0 0 0 0 0.85
                0 0 0 0 1
                0 0 0 0.8 0
              '
							result='glow'
						/>
						<feMerge>
							<feMergeNode in='glow' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>

					{/* Мягкое размытие для дальних деталей */}
					<filter id='softBlur'>
						<feGaussianBlur stdDeviation='1.2' />
					</filter>

					{/* Металлический градиент ножек */}
					<linearGradient
						id='metal'
						x1='0'
						y1='0'
						x2='1'
						y2='1'
					>
						<stop
							offset='0%'
							stopColor='#e2e8f0'
							stopOpacity='0.75'
						/>
						<stop
							offset='45%'
							stopColor='#64748b'
							stopOpacity='0.7'
						/>
						<stop
							offset='100%'
							stopColor='#f8fafc'
							stopOpacity='0.55'
						/>
					</linearGradient>

					{/* Градиент дорожек */}
					<linearGradient
						id='trace'
						x1='0'
						y1='0'
						x2='1'
						y2='0'
					>
						<stop
							offset='0%'
							stopColor='#155e75'
							stopOpacity='0.55'
						/>
						<stop
							offset='45%'
							stopColor='#22d3ee'
							stopOpacity='0.95'
						/>
						<stop
							offset='100%'
							stopColor='#38bdf8'
							stopOpacity='0.25'
						/>
					</linearGradient>

					{/* Паттерн мелкой сетки платы */}
					<pattern
						id='pcbGrid'
						width='48'
						height='48'
						patternUnits='userSpaceOnUse'
					>
						<path
							d='M48 0H0V48'
							fill='none'
							stroke='#38bdf8'
							strokeOpacity='0.045'
							strokeWidth='1'
						/>
					</pattern>

					{/* Шум SVG */}
					<filter id='noiseFilter'>
						<feTurbulence
							type='fractalNoise'
							baseFrequency='0.85'
							numOctaves='3'
							stitchTiles='stitch'
						/>
						<feColorMatrix
							type='saturate'
							values='0'
						/>
						<feComponentTransfer>
							<feFuncA
								type='table'
								tableValues='0 0.15'
							/>
						</feComponentTransfer>
					</filter>
				</defs>

				{/* Подложка платы */}
				<rect
					width='1800'
					height='1000'
					fill='#020617'
				/>
				<rect
					width='1800'
					height='1000'
					fill='url(#pcbGrid)'
				/>

				{/* Дальние дорожки */}
				<g
					className='parallax-back'
					stroke='#0e7490'
					strokeWidth='2'
					strokeOpacity='0.25'
					fill='none'
					filter='url(#softBlur)'
				>
					<path d='M90 120 H300 V260 H520 V180 H760' />
					<path d='M1100 80 H1380 V210 H1680' />
					<path d='M160 860 H440 V740 H720' />
					<path d='M980 870 H1230 V760 H1580' />
					<path d='M720 90 V260 H910 V390 H1170' />
					<path d='M300 440 H620 V520 H840 V460 H1120' />
				</g>

				{/* Анимированные дорожки */}
				<g
					className='animated-traces'
					stroke='url(#trace)'
					strokeWidth='3'
					strokeLinecap='round'
					strokeLinejoin='round'
					fill='none'
					filter='url(#traceGlow)'
				>
					<path
						pathLength='1000'
						d='M80 200 H390 V310 H670 V230 H920'
					/>
					<path
						pathLength='1000'
						d='M150 620 H430 V520 H720 V610 H950'
					/>
					<path
						pathLength='1000'
						d='M980 170 H1230 V280 H1540 V220 H1710'
					/>
					<path
						pathLength='1000'
						d='M910 760 H1190 V650 H1460 V720 H1700'
					/>
					<path
						pathLength='1000'
						d='M360 380 H560 V450 H760 V390 H990'
					/>
					<path
						pathLength='1000'
						d='M1120 430 H1340 V520 H1650'
					/>
					<path
						pathLength='1000'
						d='M620 790 V670 H820 V560 H1060'
					/>
				</g>

				{/* Площадки пайки */}
				<g
					fill='#67e8f9'
					opacity='0.65'
					filter='url(#traceGlow)'
				>
					{[
						[80, 200],
						[390, 200],
						[670, 310],
						[920, 230],
						[150, 620],
						[430, 620],
						[720, 520],
						[950, 610],
						[980, 170],
						[1230, 170],
						[1540, 280],
						[1710, 220],
						[910, 760],
						[1190, 760],
						[1460, 650],
						[1700, 720],
						[360, 380],
						[560, 380],
						[760, 450],
						[990, 390],
						[1120, 430],
						[1340, 430],
						[1650, 520]
					].map(([x, y], index) => (
						<circle
							key={index}
							cx={x}
							cy={y}
							r='5'
						/>
					))}
				</g>

				{/* Компоненты дальнего слоя */}
				<g
					className='parallax-back'
					opacity='0.42'
				>
					<SoicChip
						x={250}
						y={235}
						rotate={-8}
						label='LM358'
					/>
					<SmdDiode
						x={1260}
						y={125}
						rotate={10}
						label='D1'
					/>
					<Sot23
						x={1430}
						y={690}
						rotate={-12}
						label='Q2'
					/>
				</g>

				{/* Компоненты среднего слоя */}
				<g
					className='parallax-mid'
					opacity='0.65'
				>
					<DipChip
						x={610}
						y={345}
						rotate={4}
						label='ATMEGA'
					/>
					<To92
						x={290}
						y={710}
						rotate={-7}
						label='Q1'
					/>
					<SmdDiode
						x={1020}
						y={560}
						rotate={-5}
						label='SS14'
					/>
				</g>

				{/* Компоненты переднего слоя */}
				<g
					className='parallax-front'
					opacity='0.78'
				>
					<SoicChip
						x={1110}
						y={330}
						rotate={7}
						label='OPAMP'
					/>
					<Sot23
						x={760}
						y={720}
						rotate={8}
						label='U3'
					/>
					<SmdDiode
						x={1510}
						y={410}
						rotate={-10}
						label='BAV99'
					/>
				</g>

				{/* SVG шум */}
				<rect
					width='1800'
					height='1000'
					filter='url(#noiseFilter)'
					opacity='0.22'
					className='mix-blend-soft-light'
				/>
			</svg>

			{/* Цветовые пятна под стеклом */}
			<div className='absolute left-[-8%] top-[-12%] h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[130px]' />
			<div className='absolute right-[-12%] top-[18%] h-[620px] w-[620px] rounded-full bg-blue-600/18 blur-[150px]' />
			<div className='absolute bottom-[-18%] left-[30%] h-[560px] w-[560px] rounded-full bg-emerald-400/10 blur-[150px]' />

			{/* Стекло */}
			<div className='absolute inset-0 bg-white/[0.035] backdrop-blur-[3px]' />

			{/* Блики на стекле */}
			<div className='glass-highlight absolute inset-0' />

			{/* CSS шумовая текстура */}
			<div className='noise-layer absolute inset-0 opacity-[0.13]' />

			{/* Затемнение для читаемости */}
			<div className='absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/42 to-slate-950/88' />

			<style
				jsx
				global
			>{`
				.electronics-bg {
					--scroll-y: 0px;
				}

				.animated-traces path {
					stroke-dasharray: 90 910;
					stroke-dashoffset: 1000;
					animation: traceFlow 7s linear infinite;
				}

				.animated-traces path:nth-child(2) {
					animation-delay: -1.4s;
				}

				.animated-traces path:nth-child(3) {
					animation-delay: -2.2s;
				}

				.animated-traces path:nth-child(4) {
					animation-delay: -3.1s;
				}

				.animated-traces path:nth-child(5) {
					animation-delay: -4.3s;
				}

				.animated-traces path:nth-child(6) {
					animation-delay: -5.1s;
				}

				.animated-traces path:nth-child(7) {
					animation-delay: -6s;
				}

				@keyframes traceFlow {
					0% {
						stroke-dashoffset: 1000;
						opacity: 0.35;
					}

					45% {
						opacity: 1;
					}

					100% {
						stroke-dashoffset: 0;
						opacity: 0.45;
					}
				}

				.parallax-back {
					transform: translate3d(0, calc(var(--scroll-y) * -0.018), 0);
					transform-box: fill-box;
					transform-origin: center;
					transition: transform 0.08s linear;
				}

				.parallax-mid {
					transform: translate3d(0, calc(var(--scroll-y) * -0.035), 0);
					transform-box: fill-box;
					transform-origin: center;
					transition: transform 0.08s linear;
				}

				.parallax-front {
					transform: translate3d(0, calc(var(--scroll-y) * -0.055), 0);
					transform-box: fill-box;
					transform-origin: center;
					transition: transform 0.08s linear;
				}

				.glass-highlight {
					background:
						linear-gradient(
							115deg,
							transparent 0%,
							transparent 28%,
							rgba(255, 255, 255, 0.08) 38%,
							transparent 48%,
							transparent 100%
						),
						radial-gradient(
							circle at 20% 12%,
							rgba(255, 255, 255, 0.12),
							transparent 28%
						);
					mix-blend-mode: screen;
					pointer-events: none;
				}

				.noise-layer {
					background-image:
						radial-gradient(
							circle at 20% 30%,
							rgba(255, 255, 255, 0.28) 0 1px,
							transparent 1px
						),
						radial-gradient(
							circle at 80% 70%,
							rgba(255, 255, 255, 0.18) 0 1px,
							transparent 1px
						);
					background-size:
						13px 13px,
						17px 17px;
					mix-blend-mode: overlay;
					pointer-events: none;
				}

				@media (prefers-reduced-motion: reduce) {
					.animated-traces path {
						animation: none;
						stroke-dasharray: none;
					}

					.parallax-back,
					.parallax-mid,
					.parallax-front {
						transform: none;
						transition: none;
					}
				}
			`}</style>
		</div>
	)
}

/* SOIC / SMD микросхема */
function SoicChip({
	x,
	y,
	rotate = 0,
	label
}: {
	x: number
	y: number
	rotate?: number
	label: string
}) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
			{/* ножки слева */}
			{Array.from({ length: 8 }).map((_, i) => (
				<rect
					key={`l-${i}`}
					x='-18'
					y={14 + i * 14}
					width='22'
					height='5'
					rx='1'
					fill='url(#metal)'
				/>
			))}

			{/* ножки справа */}
			{Array.from({ length: 8 }).map((_, i) => (
				<rect
					key={`r-${i}`}
					x='146'
					y={14 + i * 14}
					width='22'
					height='5'
					rx='1'
					fill='url(#metal)'
				/>
			))}

			<rect
				x='0'
				y='0'
				width='150'
				height='125'
				rx='12'
				fill='#09090b'
				stroke='#334155'
				strokeWidth='2'
			/>

			<rect
				x='12'
				y='12'
				width='126'
				height='101'
				rx='8'
				fill='#111827'
				stroke='#1e293b'
			/>

			<circle
				cx='22'
				cy='22'
				r='5'
				fill='#64748b'
			/>

			<text
				x='75'
				y='67'
				textAnchor='middle'
				fill='#94a3b8'
				fontSize='17'
				fontFamily='monospace'
				fontWeight='700'
			>
				{label}
			</text>
		</g>
	)
}

/* DIP микросхема */
function DipChip({
	x,
	y,
	rotate = 0,
	label
}: {
	x: number
	y: number
	rotate?: number
	label: string
}) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
			{Array.from({ length: 7 }).map((_, i) => (
				<rect
					key={`top-${i}`}
					x={18 + i * 24}
					y='-22'
					width='8'
					height='28'
					rx='2'
					fill='url(#metal)'
				/>
			))}

			{Array.from({ length: 7 }).map((_, i) => (
				<rect
					key={`bottom-${i}`}
					x={18 + i * 24}
					y='104'
					width='8'
					height='28'
					rx='2'
					fill='url(#metal)'
				/>
			))}

			<rect
				x='0'
				y='0'
				width='180'
				height='110'
				rx='14'
				fill='#050505'
				stroke='#334155'
				strokeWidth='2'
			/>

			<path
				d='M72 0 A18 18 0 0 0 108 0'
				fill='#020617'
				stroke='#334155'
				strokeWidth='2'
			/>

			<text
				x='90'
				y='62'
				textAnchor='middle'
				fill='#94a3b8'
				fontSize='18'
				fontFamily='monospace'
				fontWeight='700'
			>
				{label}
			</text>
		</g>
	)
}

/* SMD-диод, например SOD-123/SMA-подобный */
function SmdDiode({
	x,
	y,
	rotate = 0,
	label
}: {
	x: number
	y: number
	rotate?: number
	label: string
}) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
			<rect
				x='-34'
				y='16'
				width='38'
				height='28'
				rx='3'
				fill='url(#metal)'
			/>
			<rect
				x='116'
				y='16'
				width='38'
				height='28'
				rx='3'
				fill='url(#metal)'
			/>

			<rect
				x='0'
				y='0'
				width='120'
				height='60'
				rx='9'
				fill='#111827'
				stroke='#334155'
				strokeWidth='2'
			/>

			{/* Полоса катода */}
			<rect
				x='88'
				y='0'
				width='10'
				height='60'
				fill='#cbd5e1'
				opacity='0.7'
			/>

			<text
				x='54'
				y='37'
				textAnchor='middle'
				fill='#cbd5e1'
				fontSize='15'
				fontFamily='monospace'
				fontWeight='700'
			>
				{label}
			</text>
		</g>
	)
}

/* SOT-23 */
function Sot23({
	x,
	y,
	rotate = 0,
	label
}: {
	x: number
	y: number
	rotate?: number
	label: string
}) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
			<rect
				x='13'
				y='-24'
				width='10'
				height='28'
				rx='2'
				fill='url(#metal)'
			/>
			<rect
				x='57'
				y='-24'
				width='10'
				height='28'
				rx='2'
				fill='url(#metal)'
			/>
			<rect
				x='35'
				y='70'
				width='10'
				height='30'
				rx='2'
				fill='url(#metal)'
			/>

			<path
				d='M8 0 H72 L82 70 H-2 Z'
				fill='#0a0a0a'
				stroke='#334155'
				strokeWidth='2'
			/>

			<circle
				cx='18'
				cy='15'
				r='3.5'
				fill='#64748b'
			/>

			<text
				x='40'
				y='42'
				textAnchor='middle'
				fill='#94a3b8'
				fontSize='13'
				fontFamily='monospace'
				fontWeight='700'
			>
				{label}
			</text>
		</g>
	)
}

/* TO-92 транзистор */
function To92({
	x,
	y,
	rotate = 0,
	label
}: {
	x: number
	y: number
	rotate?: number
	label: string
}) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate})`}>
			{/* выводы */}
			<path
				d='M22 92 C18 130 15 160 10 205'
				stroke='url(#metal)'
				strokeWidth='7'
				fill='none'
				strokeLinecap='round'
			/>
			<path
				d='M52 94 C52 135 52 165 52 210'
				stroke='url(#metal)'
				strokeWidth='7'
				fill='none'
				strokeLinecap='round'
			/>
			<path
				d='M82 92 C88 132 93 162 100 205'
				stroke='url(#metal)'
				strokeWidth='7'
				fill='none'
				strokeLinecap='round'
			/>

			{/* корпус */}
			<path
				d='M10 85 V45 C10 20 30 4 55 4 C80 4 100 20 100 45 V85 Z'
				fill='#09090b'
				stroke='#334155'
				strokeWidth='2'
			/>

			<path
				d='M10 85 H100'
				stroke='#475569'
				strokeWidth='2'
				opacity='0.7'
			/>

			<text
				x='55'
				y='52'
				textAnchor='middle'
				fill='#94a3b8'
				fontSize='14'
				fontFamily='monospace'
				fontWeight='700'
			>
				{label}
			</text>
		</g>
	)
}
