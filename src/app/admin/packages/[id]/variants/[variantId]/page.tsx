import Link from 'next/link'
import { notFound } from 'next/navigation'

import { eq } from 'drizzle-orm'

import PackageMediaEditor from '@/components/admin/PackageMediaEditor'
import PackageMediaGallery from '@/components/admin/PackageMediaGallery'

import { db } from '@/db'
import {
	packageMedia,
	packageMediaType,
	packageVariants,
	packages
} from '@/db/schema'

type Props = {
	params: Promise<{
		id: string
		variantId: string
	}>
}

export default async function PackageVariantPage({ params }: Props) {
	const { id, variantId } = await params

	const packageId = BigInt(id)
	const packageVariantId = BigInt(variantId)

	const [pkg] = await db
		.select()
		.from(packages)
		.where(eq(packages.id, packageId))
		.limit(1)

	if (!pkg) {
		notFound()
	}

	const [variant] = await db
		.select()
		.from(packageVariants)
		.where(eq(packageVariants.id, packageVariantId))
		.limit(1)

	if (!variant) {
		notFound()
	}

	if (variant.packageId !== Number(pkg.id)) {
		notFound()
	}

	const media = await db
		.select({
			id: packageMedia.id,
			mediaType: packageMedia.mediaType,
			title: packageMedia.title,
			fileUrl: packageMedia.fileUrl,
			mimeType: packageMedia.mimeType,
			fileSize: packageMedia.fileSize,
			width: packageMedia.width,
			height: packageMedia.height,
			sortOrder: packageMedia.sortOrder,
			isPrimary: packageMedia.isPrimary,
			isActive: packageMedia.isActive,
			altText: packageMedia.altText,
			description: packageMedia.description
		})
		.from(packageMedia)
		.where(eq(packageMedia.packageVariantId, Number(variant.id)))
		.orderBy(packageMedia.sortOrder, packageMedia.id)

	return (
		<main className='space-y-8 p-6'>
			<div>
				<div className='mb-4 flex items-center gap-2 text-sm text-gray-500'>
					<Link
						href='/admin/packages'
						className='hover:text-gray-900'
					>
						Корпуса
					</Link>

					<span>/</span>

					<Link
						href={`/admin/packages/${pkg.id.toString()}`}
						className='hover:text-gray-900'
					>
						{pkg.name}
					</Link>

					<span>/</span>

					<span>{variant.name}</span>
				</div>

				<div className='flex items-start justify-between gap-4'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>{variant.name}</h1>

						<p className='mt-1 text-sm text-gray-500'>
							Вариант корпуса: {variant.slug}
						</p>
					</div>

					<Link
						href={`/admin/packages/${pkg.id.toString()}`}
						className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
					>
						← К корпусу
					</Link>
				</div>
			</div>

			<section className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='text-xs uppercase text-gray-500'>Корпус</div>

					<div className='mt-1 font-semibold text-gray-900'>{pkg.name}</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='text-xs uppercase text-gray-500'>Выводы</div>

					<div className='mt-1 font-semibold text-gray-900'>
						{variant.pinCount ?? '—'}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='text-xs uppercase text-gray-500'>Производитель</div>

					<div className='mt-1 font-semibold text-gray-900'>
						{variant.manufacturer ?? '—'}
					</div>
				</div>

				<div className='rounded-xl border border-gray-200 bg-white p-4'>
					<div className='text-xs uppercase text-gray-500'>Медиа</div>

					<div className='mt-1 font-semibold text-gray-900'>{media.length}</div>
				</div>
			</section>

			<section className='space-y-8'>
				<PackageMediaGallery media={media} />

				<PackageMediaEditor
					packageId={Number(pkg.id)}
					packageVariantId={Number(variant.id)}
					media={media}
					mediaTypes={packageMediaType.enumValues}
				/>
			</section>
		</main>
	)
}
