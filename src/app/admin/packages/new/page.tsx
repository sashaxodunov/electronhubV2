import Link from 'next/link'

import PackageForm from '@/components/admin/PackageForm'

export default function NewPackagePage() {
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

				<span className='text-sm text-gray-500'>Новый корпус</span>
			</div>

			<div>
				<h1 className='text-2xl font-semibold text-gray-900'>Новый корпус</h1>

				<p className='mt-1 text-sm text-gray-500'>
					Создание нового типа корпуса
				</p>
			</div>

			<PackageForm />
		</div>
	)
}
