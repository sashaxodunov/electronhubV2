import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { packages } from '@/db/schema'
import PackageForm from '@/components/admin/PackageForm'

type PageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function EditPackagePage({ params }: PageProps) {
	const { id } = await params

	let packageId: bigint

	try {
		packageId = BigInt(id)
	} catch {
		notFound()
	}

	const [pkg] = await db
		.select({
			id: packages.id,
			name: packages.name,
			slug: packages.slug,
			standard: packages.standard,
			bodyType: packages.bodyType,
			mountingType: packages.mountingType,
			description: packages.description,
			isActive: packages.isActive
		})
		.from(packages)
		.where(eq(packages.id, packageId))
		.limit(1)

	if (!pkg) {
		notFound()
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-3'>
				<Link
					href={`/admin/packages/${pkg.id}`}
					className='text-sm text-gray-500 hover:text-gray-900'
				>
					← {pkg.name}
				</Link>

				<span className='text-gray-300'>/</span>

				<span className='text-sm text-gray-500'>Редактирование</span>
			</div>

			<div>
				<h1 className='text-2xl font-semibold text-gray-900'>
					Редактирование корпуса
				</h1>

				<p className='mt-1 text-sm text-gray-500'>
					Изменение основных данных типа корпуса
				</p>
			</div>

			<PackageForm
				packageData={{
					id: pkg.id,
					name: pkg.name,
					slug: pkg.slug,
					standard: pkg.standard,
					bodyType: pkg.bodyType,
					mountingType: pkg.mountingType,
					description: pkg.description,
					isActive: pkg.isActive
				}}
			/>
		</div>
	)
}
