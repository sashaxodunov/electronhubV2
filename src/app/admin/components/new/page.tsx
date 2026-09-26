import { db } from '@/db'
import { categories, componentSeries, manufacturers } from '@/db/schema'

import ComponentForm from '@/components/admin/ComponentForm'

export default async function NewComponentPage() {
	const [manufacturersList, categoriesList, seriesList] = await Promise.all([
		db
			.select({
				id: manufacturers.id,
				name: manufacturers.name
			})
			.from(manufacturers),

		db
			.select({
				id: categories.id,
				name: categories.name
			})
			.from(categories),

		db
			.select({
				id: componentSeries.id,
				name: componentSeries.name
			})
			.from(componentSeries)
	])

	return (
		<div className='mx-auto max-w-6xl'>
			<div className='mb-8'>
				<h1 className='text-2xl font-semibold text-accent'>Новый компонент</h1>

				<p className='mt-1 text-sm text-gray-500'>
					Добавление электронного компонента в каталог
				</p>
			</div>

			<ComponentForm
				manufacturers={manufacturersList}
				categories={categoriesList}
				series={seriesList}
			/>
		</div>
	)
}
