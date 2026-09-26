import Link from 'next/link'

import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

import { deletePackage } from '@/actions/packages'
import PackageVariantsEditor from '@/components/admin/PackageVariantsEditor'
import { db } from '@/db'
import { packageVariants, packages } from '@/db/schema'

type PageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function PackagePage({ params }: PageProps) {
	const { id } = await params

	let packageId: bigint

	try {
		packageId = BigInt(id)
	} catch {
		notFound()
	}

	const [pkg] = await db
		.select()
		.from(packages)
		.where(eq(packages.id, packageId))
		.limit(1)

	if (!pkg) {
		notFound()
	}

	const variants = await db
		.select({
			id: packageVariants.id,
			name: packageVariants.name,
			slug: packageVariants.slug,
			manufacturer: packageVariants.manufacturer,
			pinCount: packageVariants.pinCount,
			pitchMm: packageVariants.pitchMm,
			lengthMm: packageVariants.lengthMm,
			widthMm: packageVariants.widthMm,
			heightMm: packageVariants.heightMm,
			bodyLengthMm: packageVariants.bodyLengthMm,
			bodyWidthMm: packageVariants.bodyWidthMm,
			leadLengthMm: packageVariants.leadLengthMm,
			leadWidthMm: packageVariants.leadWidthMm,
			thermalPad: packageVariants.thermalPad,
			description: packageVariants.description,
			isActive: packageVariants.isActive,
			variantCode: packageVariants.variantCode,
			standardCode: packageVariants.standardCode,
			bodyShape: packageVariants.bodyShape,
			pitchXMm: packageVariants.pitchXMm,
			pitchYMm: packageVariants.pitchYMm,
			terminalWidthMm: packageVariants.terminalWidthMm,
			terminalLengthMm: packageVariants.terminalLengthMm,
			exposedPadLengthMm: packageVariants.exposedPadLengthMm,
			exposedPadWidthMm: packageVariants.exposedPadWidthMm,
			packageDrawingUrl: packageVariants.packageDrawingUrl
		})
		.from(packageVariants)
		.where(eq(packageVariants.packageId, packageId))

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-3'>
				<Link
					href='/admin/packages'
					className='text-sm text-gray-500 hover:text-gray-900'
				>
					← Корпуса
				</Link>

				<span className='text-gray-300'>/</span>

				<span className='text-sm text-gray-500'>{pkg.name}</span>
			</div>

			<div className='flex items-start justify-between'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>{pkg.name}</h1>

					<p className='mt-1 text-sm text-gray-500'>
						{pkg.description || 'Описание отсутствует'}
					</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href={`/admin/packages/${pkg.id}/edit`}
						className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
					>
						Редактировать
					</Link>

					<form action={deletePackage}>
						<input
							type='hidden'
							name='id'
							value={pkg.id.toString()}
						/>

						<button
							type='submit'
							className='rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50'
						>
							Удалить
						</button>
					</form>
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-4'>
				<div className='rounded-lg border border-gray-200 bg-white p-5'>
					<div className='text-xs font-medium uppercase text-gray-400'>
						Slug
					</div>

					<div className='mt-2 text-sm font-medium text-gray-900'>
						{pkg.slug}
					</div>
				</div>

				<div className='rounded-lg border border-gray-200 bg-white p-5'>
					<div className='text-xs font-medium uppercase text-gray-400'>
						Стандарт
					</div>

					<div className='mt-2 text-sm font-medium text-gray-900'>
						{pkg.standard || '—'}
					</div>
				</div>

				<div className='rounded-lg border border-gray-200 bg-white p-5'>
					<div className='text-xs font-medium uppercase text-gray-400'>Тип</div>

					<div className='mt-2 text-sm font-medium text-gray-900'>
						{pkg.bodyType || '—'}
					</div>
				</div>

				<div className='rounded-lg border border-gray-200 bg-white p-5'>
					<div className='text-xs font-medium uppercase text-gray-400'>
						Монтаж
					</div>

					<div className='mt-2 text-sm font-medium text-gray-900'>
						{pkg.mountingType || '—'}
					</div>
				</div>
			</div>

			<div className='rounded-lg border border-gray-200 bg-white p-5'>
				<PackageVariantsEditor
					packageId={packageId}
					variants={variants}
				/>
			</div>
		</div>
	)
}
