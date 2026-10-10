import ComponentMediaEditor from '@/components/admin/ComponentMediaEditor'
import ComponentOperatingConditionsEditor from '@/components/admin/ComponentOperatingConditionsEditor'
import ComponentPinsEditor from '@/components/admin/ComponentPinsEditor'
import ComponentRatingsEditor from '@/components/admin/ComponentRatingsEditor'
import ComponentSpecificationsEditor from '@/components/admin/ComponentSpecificationsEditor'
import ComponentThermalEditor from '@/components/admin/ComponentThermalEditor'
import ComponentVariantsEditor from '@/components/admin/ComponentVariantsEditor'
import { asc, desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ComponentAliasesEditor from '@/components/admin/ComponentAliasesEditor'
import ComponentApplicationsEditor from '@/components/admin/ComponentApplicationsEditor'
import ComponentDatasheetsEditor from '@/components/admin/ComponentDatasheetsEditor'

import { db } from '@/db'
import {
	assetType,
	categories,
	componentMedia,
	componentAliases,
	componentOperatingConditions,
	componentPins,
	componentSeries,
	componentVariants,
	componentRatings,
	applications,
	componentApplications,
	componentSpecifications,
	componentThermal,
	components,
	manufacturers,
	packageVariants,
	packages,
	datasheets,
	documentType,
	pinType
} from '@/db/schema'

type PageProps = {
	params: Promise<{
		id: string
	}>
	searchParams: Promise<{
		tab?: string
	}>
}

export default async function ComponentPage({
	params,
	searchParams
}: PageProps) {
	const { id } = await params
	const { tab } = await searchParams

	let componentId: bigint

	try {
		componentId = BigInt(id)

		if (componentId <= BigInt(0)) {
			notFound()
		}
	} catch {
		notFound()
	}

	/*
	 * Основной компонент
	 */
	const result = await db
		.select({
			id: components.id,
			name: components.name,
			designation: components.designation,
			slug: components.slug,
			description: components.description,
			shortDescription: components.shortDescription,
			function: components.function,
			status: components.status,
			isActive: components.isActive,

			manufacturerId: manufacturers.id,
			manufacturerName: manufacturers.name,

			categoryId: categories.id,
			categoryName: categories.name,

			seriesId: componentSeries.id,
			seriesName: componentSeries.name
		})
		.from(components)
		.leftJoin(manufacturers, eq(components.manufacturerId, manufacturers.id))
		.leftJoin(categories, eq(components.categoryId, categories.id))
		.leftJoin(componentSeries, eq(components.seriesId, componentSeries.id))
		.where(eq(components.id, componentId))
		.limit(1)

	const component = result[0]

	if (!component) {
		notFound()
	}
	/*
	 * Выводы компонентов
	 */

	/*
	 * Варианты компонента + корпус
	 */
	const variants = await db
		.select({
			id: componentVariants.id,
			designation: componentVariants.designation,
			slug: componentVariants.slug,
			packageVariantId: componentVariants.packageVariantId,
			packageVariantName: packageVariants.name,
			packageName: packages.name,
			marking: componentVariants.marking,
			process: componentVariants.process,
			packing: componentVariants.packing,
			operatingTempMin: componentVariants.operatingTempMin,
			operatingTempMax: componentVariants.operatingTempMax,
			isPrimary: componentVariants.isPrimary,
			isActive: componentVariants.isActive
		})
		.from(componentVariants)
		.leftJoin(
			packageVariants,
			eq(componentVariants.packageVariantId, packageVariants.id)
		)
		.leftJoin(packages, eq(packageVariants.packageId, packages.id))
		.where(eq(componentVariants.componentId, componentId))

	/*
	 * Список доступных корпусов
	 */
	const packageVariantsList = await db
		.select({
			id: packageVariants.id,
			name: packageVariants.name,
			packageName: packages.name
		})
		.from(packageVariants)
		.innerJoin(packages, eq(packageVariants.packageId, packages.id))
		.where(eq(packageVariants.isActive, true))

	const media = (
		await db
			.select({
				id: componentMedia.id,
				assetType: componentMedia.assetType,
				title: componentMedia.title,
				fileUrl: componentMedia.fileUrl,
				mimeType: componentMedia.mimeType,
				fileSize: componentMedia.fileSize,
				width: componentMedia.width,
				height: componentMedia.height,
				sortOrder: componentMedia.sortOrder,
				isPrimary: componentMedia.isPrimary,
				isActive: componentMedia.isActive,
				altText: componentMedia.altText,
				description: componentMedia.description
			})
			.from(componentMedia)
			.where(eq(componentMedia.componentId, componentId))
			.orderBy(componentMedia.sortOrder, componentMedia.id)
	).map(item => ({
		...item,
		fileSize: item.fileSize !== null ? Number(item.fileSize) : null
	}))

	const pins = await db
		.select()
		.from(componentPins)
		.where(eq(componentPins.componentId, componentId))
		.orderBy(componentPins.sortOrder, componentPins.id)

	const specifications = await db
		.select()
		.from(componentSpecifications)
		.where(eq(componentSpecifications.componentId, componentId))
		.orderBy(componentSpecifications.sortOrder, componentSpecifications.id)

	const operatingConditions = await db
		.select()
		.from(componentOperatingConditions)
		.where(eq(componentOperatingConditions.componentId, componentId))
		.orderBy(
			componentOperatingConditions.sortOrder,
			componentOperatingConditions.id
		)

	const ratings = await db
		.select()
		.from(componentRatings)
		.where(eq(componentRatings.componentId, componentId))
		.orderBy(componentRatings.sortOrder, componentRatings.id)

	/*
	 * Тепловые характеристики компонентов
	 */
	const thermalItems = await db
		.select()
		.from(componentThermal)
		.where(eq(componentThermal.componentId, componentId))
		.orderBy(componentThermal.id)

	const aliases = await db
		.select()
		.from(componentAliases)
		.where(eq(componentAliases.componentId, componentId))
		.orderBy(desc(componentAliases.isPrimary), asc(componentAliases.alias))

	const datasheetItemsRaw = await db
		.select()
		.from(datasheets)
		.where(eq(datasheets.componentId, componentId))
		.orderBy(
			desc(datasheets.isPrimary),
			desc(datasheets.createdAt),
			desc(datasheets.id)
		)

	const datasheetItems = datasheetItemsRaw.map(item => ({
		...item,
		id: item.id.toString(),
		fileSize: item.fileSize?.toString() ?? null
	}))

	// Все области применения из справочника.
	const applicationsList = await db
		.select({
			id: applications.id,
			name: applications.name,
			slug: applications.slug
		})
		.from(applications)
		.orderBy(asc(applications.name))

	// Области применения, связанные с текущим компонентом.
	const linkedApplications = await db
		.select({
			applicationId: applications.id,
			name: applications.name,
			slug: applications.slug,
			description: componentApplications.description
		})
		.from(componentApplications)
		.innerJoin(
			applications,
			eq(componentApplications.applicationId, applications.id)
		)
		.where(eq(componentApplications.componentId, componentId))
		.orderBy(asc(applications.name))

	return (
		<div className='mx-auto max-w-7xl'>
			{/* Header */}
			<div className='mb-6'>
				<div className='mb-4'>
					<Link
						href='/admin/components'
						className='text-sm text-gray-500 transition hover:text-gray-900'
					>
						← Компоненты
					</Link>
				</div>

				<div className='flex items-start justify-between gap-4'>
					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-semibold text-gray-900'>
								{component.designation}
							</h1>

							<span
								className={`rounded-full px-2.5 py-1 text-xs font-medium ${
									component.isActive
										? 'bg-green-50 text-green-700'
										: 'bg-gray-100 text-gray-500'
								}`}
							>
								{component.isActive ? 'Активен' : 'Неактивен'}
							</span>
						</div>

						<p className='mt-1 text-sm text-gray-500'>{component.name}</p>
					</div>

					<div className='flex items-center gap-2'>
						<Link
							href={`/components/${component.slug}`}
							target='_blank'
							className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50'
						>
							Открыть сайт
						</Link>

						<button
							type='button'
							className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800'
						>
							Сохранить
						</button>
					</div>
				</div>
			</div>

			{/* Component summary */}
			<div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
				<InfoCard
					label='Производитель'
					value={component.manufacturerName ?? '—'}
				/>

				<InfoCard
					label='Категория'
					value={component.categoryName ?? '—'}
				/>

				<InfoCard
					label='Серия'
					value={component.seriesName ?? 'Без серии'}
				/>
			</div>

			{/* Tabs */}
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
				<div className='border-b border-gray-200'>
					<nav className='flex flex-wrap'>
						<Tab
							href={`/admin/components/${component.id.toString()}`}
							label='Основное'
							active={!tab}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=variants`}
							label={`Варианты (${variants.length})`}
							active={tab === 'variants'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=pins`}
							label={`Пины (${pins.length})`}
							active={tab === 'pins'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=specifications`}
							label={`Технические характеристики (${specifications.length})`}
							active={tab === 'specifications'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=conditions`}
							label={`Условия эксплуатации (${operatingConditions.length})`}
							active={tab === 'conditions'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=ratings`}
							label={`Предельные характеристики (${ratings.length})`}
							active={tab === 'ratings'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=thermal`}
							label={`Тепловые характеристики (${thermalItems.length})`}
							active={tab === 'thermal'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=aliases`}
							label={`Альтернативные обозначения (${aliases.length})`}
							active={tab === 'aliases'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=applications`}
							label={`Области применения (${linkedApplications.length})`}
							active={tab === 'applications'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=datasheets`}
							label={`Документация (${datasheetItems.length})`}
							active={tab === 'datasheets'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=assets`}
							label={`Медиафайлы (${media.length})`}
							active={tab === 'assets'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=graphs`}
							label='Графики'
							active={tab === 'graphs'}
						/>

						<Tab
							href={`/admin/components/${component.id.toString()}?tab=relations`}
							label='Связи'
							active={tab === 'relations'}
						/>
					</nav>
				</div>

				{/* Main content */}
				{tab === 'variants' ? (
					<ComponentVariantsEditor
						componentId={componentId}
						variants={variants}
						packageVariants={packageVariantsList}
					/>
				) : tab === 'pins' ? (
					<ComponentPinsEditor
						componentId={componentId}
						pins={pins}
						pinTypes={pinType.enumValues}
					/>
				) : tab === 'specifications' ? (
					<ComponentSpecificationsEditor
						componentId={componentId}
						specifications={specifications}
					/>
				) : tab === 'conditions' ? (
					<ComponentOperatingConditionsEditor
						componentId={componentId}
						conditions={operatingConditions}
					/>
				) : tab === 'ratings' ? (
					<ComponentRatingsEditor
						componentId={componentId}
						ratings={ratings}
					/>
				) : tab === 'datasheets' ? (
					<ComponentDatasheetsEditor
						componentId={componentId.toString()}
						items={datasheetItems}
						documentTypes={documentType.enumValues}
					/>
				) : tab === 'aliases' ? (
					<ComponentAliasesEditor
						componentId={componentId}
						aliases={aliases}
					/>
				) : tab === 'thermal' ? (
					<ComponentThermalEditor
						componentId={componentId}
						thermalItems={thermalItems}
					/>
				) : tab === 'applications' ? (
					<ComponentApplicationsEditor
						componentId={componentId}
						applications={applicationsList}
						linkedApplications={linkedApplications}
					/>
				) : tab === 'assets' ? (
					<div className='p-6'>
						<ComponentMediaEditor
							componentId={Number(componentId)}
							media={media}
							assetTypes={assetType.enumValues}
						/>
					</div>
				) : (
					<div className='p-6'>
						<div className='mb-6'>
							<h2 className='text-lg font-semibold text-gray-900'>
								Основная информация
							</h2>

							<p className='mt-1 text-sm text-gray-500'>
								Основные сведения о компоненте.
							</p>
						</div>

						<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
							<Field
								label='Название'
								value={component.name}
							/>

							<Field
								label='Обозначение'
								value={component.designation}
							/>

							<Field
								label='Slug'
								value={component.slug}
							/>

							<Field
								label='Функция'
								value={component.function}
							/>

							<Field
								label='Производитель'
								value={component.manufacturerName}
							/>

							<Field
								label='Категория'
								value={component.categoryName}
							/>

							<Field
								label='Серия'
								value={component.seriesName}
							/>

							<Field
								label='Статус'
								value={component.status}
							/>

							<div className='md:col-span-2'>
								<Field
									label='Краткое описание'
									value={component.shortDescription}
								/>
							</div>

							<div className='md:col-span-2'>
								<Field
									label='Описание'
									value={component.description}
									multiline
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

/*
 * Информационная карточка
 */
function InfoCard({ label, value }: { label: string; value: string }) {
	return (
		<div className='rounded-xl border border-gray-200 bg-white p-5'>
			<p className='text-xs font-medium uppercase tracking-wide text-gray-400'>
				{label}
			</p>

			<p className='mt-2 truncate text-sm font-medium text-gray-900'>{value}</p>
		</div>
	)
}

/*
 * Поле компонента
 */
function Field({
	label,
	value,
	multiline = false
}: {
	label: string
	value: string | null
	multiline?: boolean
}) {
	return (
		<div>
			<p className='mb-2 text-xs font-medium uppercase tracking-wide text-gray-400'>
				{label}
			</p>

			<div
				className={`rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 ${
					multiline ? 'whitespace-pre-wrap leading-6' : ''
				}`}
			>
				{value || '—'}
			</div>
		</div>
	)
}

/*
 * Вкладка
 */
function Tab({
	href,
	label,
	active = false
}: {
	href: string
	label: string
	active?: boolean
}) {
	return (
		<Link
			href={href}
			className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
				active
					? 'border-gray-900 text-gray-900'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
			}`}
		>
			{label}
		</Link>
	)
}
