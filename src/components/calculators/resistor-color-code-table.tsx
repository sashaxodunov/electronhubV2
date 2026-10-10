const colorRows = [
	{
		color: 'Чёрный',
		css: '#111827',
		digit: '0',
		multiplier: '×1',
		tolerance: '—',
		tcr: '250 ppm/°C'
	},
	{
		color: 'Коричневый',
		css: '#8b4513',
		digit: '1',
		multiplier: '×10',
		tolerance: '±1 %',
		tcr: '100 ppm/°C'
	},
	{
		color: 'Красный',
		css: '#dc2626',
		digit: '2',
		multiplier: '×100',
		tolerance: '±2 %',
		tcr: '50 ppm/°C'
	},
	{
		color: 'Оранжевый',
		css: '#f97316',
		digit: '3',
		multiplier: '×1 000',
		tolerance: '—',
		tcr: '15 ppm/°C'
	},
	{
		color: 'Жёлтый',
		css: '#eab308',
		digit: '4',
		multiplier: '×10 000',
		tolerance: '—',
		tcr: '25 ppm/°C'
	},
	{
		color: 'Зелёный',
		css: '#16a34a',
		digit: '5',
		multiplier: '×100 000',
		tolerance: '±0,5 %',
		tcr: '20 ppm/°C'
	},
	{
		color: 'Синий',
		css: '#2563eb',
		digit: '6',
		multiplier: '×1 000 000',
		tolerance: '±0,25 %',
		tcr: '10 ppm/°C'
	},
	{
		color: 'Фиолетовый',
		css: '#7c3aed',
		digit: '7',
		multiplier: '×10 000 000',
		tolerance: '±0,1 %',
		tcr: '5 ppm/°C'
	},
	{
		color: 'Серый',
		css: '#6b7280',
		digit: '8',
		multiplier: '×100 000 000',
		tolerance: '±0,05 %',
		tcr: '1 ppm/°C'
	},
	{
		color: 'Белый',
		css: '#f3f4f6',
		digit: '9',
		multiplier: '×1 000 000 000',
		tolerance: '—',
		tcr: '—'
	},
	{
		color: 'Золотой',
		css: '#d4af37',
		digit: '—',
		multiplier: '×0,1',
		tolerance: '±5 %',
		tcr: '—'
	},
	{
		color: 'Серебряный',
		css: '#9ca3af',
		digit: '—',
		multiplier: '×0,01',
		tolerance: '±10 %',
		tcr: '—'
	}
]

export default function ResistorColorCodeTable() {
	return (
		<section className='mt-10 rounded-xl border border-border bg-background-light p-5 md:p-7'>
			{' '}
			<div className='mb-6'>
				{' '}
				<h2 className='text-2xl font-bold text-white'>
					Таблица цветовой маркировки{' '}
				</h2>
				<p className='mt-2 text-sm leading-6 text-[#8f9aa1]'>
					Значения цветов для цифр, множителя, допуска и температурного
					коэффициента.
				</p>
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full min-w-175 border-collapse text-sm'>
					<thead>
						<tr className='border-b border-border text-left'>
							<th className='px-4 py-3 font-semibold text-white'>Цвет</th>

							<th className='px-4 py-3 font-semibold text-white'>Цифра</th>

							<th className='px-4 py-3 font-semibold text-white'>
								Множитель сопротивления
							</th>

							<th className='px-4 py-3 font-semibold text-white'>Допуск</th>

							<th className='px-4 py-3 font-semibold text-white'>ТКС</th>
						</tr>
					</thead>

					<tbody>
						{colorRows.map(row => (
							<tr
								key={row.color}
								className='border-b border-border/70 last:border-0'
							>
								<td className='px-4 py-3'>
									<div className='flex items-center gap-3'>
										<span
											aria-hidden='true'
											className='size-6 shrink-0 rounded border border-white/20'
											style={{ backgroundColor: row.css }}
										/>

										<span className='font-medium text-white'>{row.color}</span>
									</div>
								</td>

								<td className='px-4 py-3 font-mono text-[#aeb7bd]'>
									{row.digit}
								</td>

								<td className='px-4 py-3 font-mono text-[#aeb7bd]'>
									{row.multiplier}
								</td>

								<td className='px-4 py-3 text-[#aeb7bd]'>{row.tolerance}</td>

								<td className='px-4 py-3 text-[#aeb7bd]'>{row.tcr}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
