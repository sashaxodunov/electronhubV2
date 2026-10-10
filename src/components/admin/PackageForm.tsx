'use client'

import { useState } from 'react'

import { createPackage, updatePackage } from '@/actions/packages'

type PackageData = {
	id?: bigint | number
	name: string
	slug: string
	standard: string | null
	bodyType: string | null
	mountingType: string | null
	description: string | null
	isActive: boolean
}

type PackageFormProps = {
	packageData?: PackageData
}

export default function PackageForm({ packageData }: PackageFormProps) {
	const isEdit = Boolean(packageData)

	const [name, setName] = useState(packageData?.name ?? '')
	const [slug, setSlug] = useState(packageData?.slug ?? '')
	const [standard, setStandard] = useState(packageData?.standard ?? '')
	const [bodyType, setBodyType] = useState(packageData?.bodyType ?? '')
	const [mountingType, setMountingType] = useState(
		packageData?.mountingType ?? ''
	)
	const [description, setDescription] = useState(packageData?.description ?? '')
	const [isActive, setIsActive] = useState(packageData?.isActive ?? true)

	function generateSlug(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9а-яё-]/gi, '')
			.replace(/-+/g, '-')
	}

	function handleNameChange(value: string) {
		setName(value)

		if (!isEdit) {
			setSlug(generateSlug(value))
		}
	}

	return (
		<form
			action={isEdit ? updatePackage : createPackage}
			className='space-y-6'
		>
			{isEdit && (
				<input
					type='hidden'
					name='id'
					value={String(packageData?.id)}
				/>
			)}

			<div className='rounded-lg border border-gray-200 bg-white p-6'>
				<h2 className='mb-5 text-lg font-semibold text-gray-900'>
					Основная информация
				</h2>

				<div className='grid gap-5 md:grid-cols-2'>
					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Название *
						</label>

						<input
							type='text'
							name='name'
							value={name}
							onChange={e => handleNameChange(e.target.value)}
							required
							className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500'
							placeholder='SOIC'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Slug *
						</label>

						<input
							type='text'
							name='slug'
							value={slug}
							onChange={e => setSlug(e.target.value)}
							required
							className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none text-gray-700 focus:border-gray-500'
							placeholder='soic'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Стандарт
						</label>

						<input
							type='text'
							name='standard'
							value={standard}
							onChange={e => setStandard(e.target.value)}
							className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none text-gray-700 focus:border-gray-500'
							placeholder='JEDEC'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Тип корпуса
						</label>

						<input
							type='text'
							name='bodyType'
							value={bodyType}
							onChange={e => setBodyType(e.target.value)}
							className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500'
							placeholder='Small Outline'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Монтаж
						</label>

						<select
							name='mountingType'
							value={mountingType}
							onChange={e => setMountingType(e.target.value)}
							className='w-full text-gray-700 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500'
						>
							<option value=''>Не указан</option>
							<option value='SMD'>SMD</option>
							<option value='THT'>THT</option>
						</select>
					</div>

					<div className='flex items-center'>
						<label className='flex cursor-pointer items-center gap-2 text-sm text-gray-700'>
							<input
								type='checkbox'
								name='isActive'
								checked={isActive}
								onChange={e => setIsActive(e.target.checked)}
								className='h-4 w-4 text-gray-700 rounded border-gray-300'
							/>
							Активен
						</label>
					</div>
				</div>

				<div className='mt-5'>
					<label className='mb-1 block text-sm font-medium text-gray-700'>
						Описание
					</label>

					<textarea
						name='description'
						value={description}
						onChange={e => setDescription(e.target.value)}
						rows={5}
						className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500'
						placeholder='Описание семейства корпуса...'
					/>
				</div>
			</div>

			<div className='flex items-center justify-end gap-3'>
				<button
					type='submit'
					className='rounded-md text-gray-700 bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
				>
					{isEdit ? 'Сохранить изменения' : 'Создать корпус'}
				</button>
			</div>
		</form>
	)
}
