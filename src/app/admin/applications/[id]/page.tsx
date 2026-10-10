import Link from 'next/link'
import { asc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

import { deleteApplication, updateApplication } from '@/actions/applications'
import { db } from '@/db'
import { applications, componentApplications, components } from '@/db/schema'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function EditApplicationPage({ params }: PageProps) {
	const { id } = await params

	if (!/^[1-9]\d*$/.test(id)) {
		notFound()
	}

	const applicationId = BigInt(id)

	const [application] = await db
		.select()
		.from(applications)
		.where(eq(applications.id, applicationId))
		.limit(1)

	if (!application) {
		notFound()
	}

	const linkedComponents = await db
		.select({
			id: components.id,
			name: components.name,
			designation: components.designation,
			slug: components.slug,
			description: componentApplications.description
		})
		.from(componentApplications)
		.innerJoin(components, eq(componentApplications.componentId, components.id))
		.where(eq(componentApplications.applicationId, applicationId))
		.orderBy(asc(components.designation))

	const inputClass =
		'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500'

	return (
		<div className='mx-auto max-w-4xl space-y-8'>
			<div>
				<Link
					href='/admin/applications'
					className='text-sm text-gray-500 hover:text-gray-900'
				>
					← Области применения
				</Link>

				<h1 className='mt-4 text-2xl font-semibold text-gray-900'>
					Редактирование области применения
				</h1>

				<p className='mt-1 text-sm text-gray-500'>
					ID: {application.id.toString()}
				</p>
			</div>

			<form
				action={updateApplication}
				className='space-y-5 rounded-xl border border-gray-200 bg-white p-6'
			>
				<input
					type='hidden'
					name='id'
					value={application.id.toString()}
				/>

				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Название</span>
					<input
						name='name'
						type='text'
						maxLength={255}
						required
						defaultValue={application.name}
						className={inputClass}
					/>
				</label>

				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Slug</span>
					<input
						name='slug'
						type='text'
						maxLength={255}
						required
						defaultValue={application.slug}
						className={inputClass}
					/>
					<span className='text-xs text-gray-500'>
						Изменение slug может повлиять на URL опубликованной страницы.
					</span>
				</label>

				<label className='block space-y-1'>
					<span className='text-sm font-medium text-gray-700'>Описание</span>
					<textarea
						name='description'
						rows={6}
						defaultValue={application.description ?? ''}
						className={inputClass}
					/>
				</label>

				<button
					type='submit'
					className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
				>
					Сохранить изменения
				</button>
			</form>

			<section className='space-y-3'>
				<div>
					<h2 className='text-lg font-semibold text-gray-900'>
						Связанные компоненты
					</h2>
					<p className='mt-1 text-sm text-gray-500'>
						Всего: {linkedComponents.length}
					</p>
				</div>

				<div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
					{linkedComponents.length === 0 ? (
						<p className='p-5 text-sm text-gray-500'>
							С этой областью применения пока не связано ни одного компонента.
						</p>
					) : (
						<ul className='divide-y divide-gray-100'>
							{linkedComponents.map(item => (
								<li
									key={item.id.toString()}
									className='flex flex-wrap items-center justify-between gap-3 p-4'
								>
									<div>
										<p className='font-medium text-gray-900'>
											{item.designation} — {item.name}
										</p>
										{item.description && (
											<p className='mt-1 text-sm text-gray-500'>
												{item.description}
											</p>
										)}
									</div>

									<Link
										href={`/admin/components/${item.id.toString()}?tab=applications`}
										className='text-sm font-medium text-gray-700 hover:text-gray-950'
									>
										Открыть компонент
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</section>

			<section className='rounded-xl border border-red-200 bg-white p-5'>
				<h2 className='font-semibold text-red-700'>
					Удаление области применения
				</h2>

				<p className='mt-1 text-sm text-gray-500'>
					Запись будет удалена. Связи с компонентами также удалятся, но сами
					компоненты останутся.
				</p>

				<form
					action={deleteApplication}
					className='mt-4'
				>
					<input
						type='hidden'
						name='id'
						value={application.id.toString()}
					/>

					<button
						type='submit'
						className='rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50'
					>
						Удалить область применения
					</button>
				</form>
			</section>
		</div>
	)
}
